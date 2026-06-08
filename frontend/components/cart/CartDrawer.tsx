'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Calendar, ShoppingBag, Plus, Minus, Tag, AlertCircle } from 'lucide-react';
import { useCartStore, calculateRentalDays } from '@/stores/cart.store';

export default function CartDrawer() {
  const {
    cartItems,
    isOpen,
    couponCode,
    discountPercentage,
    setIsOpen,
    removeItem,
    updateItemDates,
    updateItemSize,
    updateItemQuantity,
    applyCoupon,
    removeCoupon,
    getCalculations,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (couponCode) {
      setCouponInput(couponCode);
      setCouponSuccess(true);
    }
  }, [couponCode]);

  if (!mounted) return null;

  const calculations = getCalculations();
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const success = applyCoupon(couponInput);
    if (success) {
      setCouponSuccess(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try KLOSETGOLD or FIRSTRENT');
      setCouponSuccess(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput('');
    setCouponSuccess(false);
    setCouponError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black z-[9998] backdrop-blur-[4px]"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--ivory)] z-[9999] shadow-2xl flex flex-col h-full border-l"
            style={{ borderColor: 'var(--petal)' }}
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b" style={{ borderColor: 'var(--petal)' }}>
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} className="text-[var(--rose)]" />
                <h2 className="text-xl font-display font-semibold tracking-wide text-[var(--ink)]">
                  Your Rental Cart
                </h2>
                <span className="badge badge-rose text-xs font-mono">{cartItems.length}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-[var(--bloom)] transition-colors text-[var(--ink-light)]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Item list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 silk-scroll">
              {cartItems.length === 0 ? (
                <div className="empty-floral py-16 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--bloom)] flex items-center justify-center text-[var(--rose)]">
                    <ShoppingBag size={28} />
                  </div>
                  <h3 className="text-lg font-display font-medium text-[var(--ink)]">Your cart is empty</h3>
                  <p className="text-sm text-[var(--ink-light)]">
                    Explore our luxury collection and pick your perfect look for rental.
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className="btn-gold !h-12 !px-6 text-xs w-full max-w-[200px]"
                  >
                    Start Renting
                  </button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const rentalDays = calculateRentalDays(item.startDate, item.endDate);

                  return (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="card-floral p-4 flex gap-4 bg-white relative"
                    >
                      {/* Image */}
                      <div className="w-20 h-28 relative rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-semibold text-[var(--ink)] line-clamp-1 pr-6 font-display text-base">
                              {item.title}
                            </h4>
                            <button
                              onClick={() => removeItem(item.id, item.size)}
                              className="absolute top-4 right-4 text-[var(--ink-lighter)] hover:text-[var(--rose-dark)] transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          {item.sellerName && (
                            <p className="text-[10px] uppercase font-mono tracking-widest text-[var(--gold)] mt-0.5">
                              Seller: {item.sellerName}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-2">
                            {/* Size picker dropdown */}
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] text-[var(--ink-light)] font-mono">Size:</span>
                              <select
                                value={item.size}
                                onChange={(e) => updateItemSize(item.id, item.size, e.target.value)}
                                className="bg-[var(--ivory)] border border-[var(--petal)] text-xs rounded-lg px-1.5 py-0.5 font-mono text-[var(--ink)] focus:outline-none"
                              >
                                {sizes.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Quantity selector */}
                            <div className="flex items-center gap-1.5 border border-[var(--petal)] rounded-lg px-1.5 py-0.5 bg-[var(--ivory)]">
                              <button
                                onClick={() => updateItemQuantity(item.id, item.size, item.quantity - 1)}
                                className="text-[var(--ink-light)] hover:text-[var(--rose)]"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="text-xs font-mono font-medium px-1 text-[var(--ink)] min-w-[12px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateItemQuantity(item.id, item.size, item.quantity + 1)}
                                className="text-[var(--ink-light)] hover:text-[var(--rose)]"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="mt-3 bg-[var(--bloom)]/40 p-2 rounded-lg space-y-1 border border-[var(--petal)]/30">
                          <div className="flex items-center justify-between text-[10px] text-[var(--ink-light)] font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} className="text-[var(--rose)]" />
                              Rental Duration:
                            </span>
                            <span className="font-semibold text-[var(--rose)]">
                              {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1 justify-between">
                            <div className="flex flex-col flex-1">
                              <span className="text-[8px] text-[var(--ink-lighter)] uppercase tracking-wider">Start</span>
                              <input
                                type="date"
                                value={item.startDate}
                                onChange={(e) => updateItemDates(item.id, item.size, e.target.value, item.endDate)}
                                className="bg-white border border-[var(--petal)] text-[10px] rounded px-1 py-0.5 font-mono text-[var(--ink)] w-full focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col flex-1">
                              <span className="text-[8px] text-[var(--ink-lighter)] uppercase tracking-wider">End</span>
                              <input
                                type="date"
                                value={item.endDate}
                                onChange={(e) => updateItemDates(item.id, item.size, item.startDate, e.target.value)}
                                className="bg-white border border-[var(--petal)] text-[10px] rounded px-1 py-0.5 font-mono text-[var(--ink)] w-full focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="mt-3 flex items-center justify-between border-t border-[var(--petal)]/30 pt-2 text-xs">
                          <div className="text-[var(--ink-light)]">
                            <span className="font-mono">₹{item.price}</span>/day
                            <span className="mx-1 text-[var(--ink-lighter)]">×</span>
                            <span>{item.quantity} qty</span>
                          </div>
                          <div className="font-mono font-bold text-[var(--rose)] text-sm">
                            ₹{item.price * rentalDays * item.quantity}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer calculations */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-white border-t border-[var(--petal)] space-y-4">
                {/* Coupon Form */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-lighter)]" size={16} />
                    <input
                      type="text"
                      placeholder="Coupon: KLOSETGOLD"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      disabled={couponSuccess}
                      className="input-kloset !py-2.5 !pl-10 !text-xs uppercase font-mono tracking-widest"
                    />
                  </div>
                  {couponSuccess ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="btn-rose !h-[42px] !px-4 !rounded-xl !text-xs !bg-[var(--rose-dark)]"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn-gold !h-[42px] !px-5 !rounded-xl !text-xs"
                    >
                      Apply
                    </button>
                  )}
                </form>

                {couponError && (
                  <p className="text-[10px] text-[var(--rose)] flex items-center gap-1 font-mono">
                    <AlertCircle size={12} />
                    {couponError}
                  </p>
                )}

                {couponSuccess && (
                  <p className="text-[10px] text-[var(--sage-dark)] flex items-center gap-1 font-mono">
                    ✓ Code applied successfully! ({discountPercentage}% Off Subtotal)
                  </p>
                )}

                {/* Subtotals breakdown */}
                <div className="space-y-2 text-xs border-b border-[var(--petal)]/40 pb-3 font-mono text-[var(--ink-light)]">
                  <div className="flex justify-between">
                    <span>Rental Subtotal</span>
                    <span className="font-semibold text-[var(--ink)]">₹{calculations.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      Refundable Security Deposit
                      <span className="cursor-help text-[10px] bg-[var(--bloom)] text-[var(--rose)] rounded-full w-3.5 h-3.5 flex items-center justify-center" title="Fully refunded back to you once the outfit is returned safely.">?</span>
                    </span>
                    <span className="font-semibold text-[var(--ink)]">₹{calculations.securityDeposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (5%)</span>
                    <span>₹{calculations.platformFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (8%)</span>
                    <span>₹{calculations.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping (Flat Rate)</span>
                    <span>₹{calculations.shippingFee}</span>
                  </div>
                  {calculations.discount > 0 && (
                    <div className="flex justify-between text-[var(--sage-dark)]">
                      <span>Discount ({discountPercentage}%)</span>
                      <span>-₹{calculations.discount}</span>
                    </div>
                  )}
                </div>

                {/* Grand Total */}
                <div className="flex items-baseline justify-between pt-1">
                  <span className="font-display text-lg font-semibold text-[var(--ink)]">Total Pay</span>
                  <div className="text-right">
                    <div className="font-mono text-2xl font-bold text-[var(--rose)]">
                      ₹{calculations.total}
                    </div>
                    <span className="text-[9px] text-[var(--ink-lighter)] uppercase tracking-wider block">
                      Includes refundable security deposit
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <Link
                  href="/booking/checkout"
                  onClick={() => setIsOpen(false)}
                  className="btn-gold w-full text-center tracking-[0.18em]"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
