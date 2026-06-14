'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Calendar, ShieldCheck, MapPin, Sparkles, ChevronRight, User } from 'lucide-react';
import { outfitsAPI, reviewsAPI } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import type { Outfit, Review, ReviewResponse } from '@/types';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

const MOCK_REVIEWS = [
  { id: 'r1', name: 'Aishwarya S.', rating: 5, text: 'Absolutely stunning! The embroidery caught the light beautifully. Received so many compliments.', date: '2026-05-15' },
  { id: 'r2', name: 'Meera D.', rating: 5, text: 'Perfect fit. The adjustable details made it comfortable to wear for the entire event.', date: '2026-04-28' },
  { id: 'r3', name: 'Tara S.', rating: 4, text: 'Excellent condition, smelt fresh and clean. The fabric feels extremely premium. Will rent again!', date: '2026-04-12' },
];

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

export default function OutfitDetailPage() {
  const params = useParams() || {};
  const router = useRouter();
  
  const id = (params.id as string) || '';
  
  const addItem = useCartStore((s) => s.addItem);
  const { wishlist, toggleWishlist, isWishlisted } = useWishlistStore();

  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedDuration, setSelectedDuration] = useState<1 | 3 | 7>(3);
  const [startDate, setStartDate] = useState('');
   
  interface DisplayReview {
    id: string;
    name: string;
    rating: number;
    text: string;
    date: string;
    reviewer_name?: string;
    comment?: string;
    created_at?: string;
  }

  const [reviews, setReviews] = useState<DisplayReview[]>([]);
  const [similarOutfits, setSimilarOutfits] = useState<Outfit[]>([]);
  const [moreFromSeller, setMoreFromSeller] = useState<Outfit[]>([]);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transform: 'scale(1)',
    transformOrigin: 'center',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: 'scale(1.8)',
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center',
    });
  };

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);
      try {
        const resp = await outfitsAPI.getById(id);
        if (resp) {
          setOutfit(resp);
          if (resp.sizes && resp.sizes.length > 0) {
            setSelectedSize(resp.sizes[0]);
          }
        }
      } catch (err) {
        console.warn('API error loading outfit detail, using mock', err);
        setOutfit(null);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  useEffect(() => {
    async function loadSecondaryData() {
      if (!outfit) return;
      
      // Load reviews
      try {
        const revResp = await reviewsAPI.listOutfitReviews(outfit.id);
        if (revResp.reviews.length > 0) {
          const mappedReviews: DisplayReview[] = revResp.reviews.map((r) => ({
            id: r.id,
            name: r.reviewer_name || r.id,
            rating: r.rating,
            text: r.comment || '',
            date: r.created_at ? new Date(r.created_at).toLocaleDateString() : '',
            reviewer_name: r.reviewer_name,
            comment: r.comment,
            created_at: r.created_at,
          }));
          setReviews(mappedReviews);
        } else {
          setReviews(MOCK_REVIEWS);
        }
      } catch {
        setReviews(MOCK_REVIEWS);
      }

      // Load recommendations
      try {
        const simResp = await outfitsAPI.browse({ category: outfit.category, per_page: 5 });
        setSimilarOutfits(simResp.outfits.filter((o) => o.id !== outfit.id).slice(0, 4));
      } catch {}

      try {
        const sellerResp = await outfitsAPI.browse({ per_page: 5 });
        setMoreFromSeller(sellerResp.outfits.filter((o) => o.id !== outfit.id).slice(0, 4));
      } catch {}
    }
    loadSecondaryData();
  }, [outfit]);

  // Set default start date to tomorrow
  useEffect(() => {
    const timer = setTimeout(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setStartDate(tomorrow.toISOString().split('T')[0]);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 select-none font-sans text-charcoal">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 shimmer h-[600px] rounded-lg animate-pulse" />
          <div className="lg:col-span-5 space-y-6">
            <div className="shimmer h-12 w-3/4 rounded animate-pulse" />
            <div className="shimmer h-6 w-1/3 rounded animate-pulse" />
            <div className="shimmer h-40 w-full rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!outfit) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center pt-24 bg-white text-center select-none font-sans text-charcoal">
        <div className="space-y-4">
          <p className="font-display text-xl italic">Wardrobe listing not found</p>
          <Link href="/discover" className="btn btn-gold !h-[52px] px-8">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  const priceMap = {
    1: outfit.price_1day || 0,
    3: outfit.price_3day || Math.round((outfit.price_1day || 0) * 2.2),
    7: outfit.price_7day || Math.round((outfit.price_1day || 0) * 4.5),
  };

  const currentRentalFee = priceMap[selectedDuration];
  const securityDeposit = outfit.security_deposit || 0;
  const deliveryFee = outfit.delivery_available ? outfit.delivery_fee : 0;

  const dailyPrice = Math.round(currentRentalFee / selectedDuration);

  const calculateEndDate = () => {
    if (!startDate) return '';
    const end = new Date(startDate);
    end.setDate(end.getDate() + selectedDuration - 1);
    return end.toISOString().split('T')[0];
  };

  const handleWishlistToggle = async () => {
    await toggleWishlist(outfit);
    const saved = isWishlisted(outfit.id);
    toast.success(saved ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = () => {
    const mainImg = outfit.images?.[imgIdx]?.url || outfit.images?.[0]?.url || '';
    const endStr = calculateEndDate();

    addItem({
      id: outfit.id,
      title: outfit.title,
      price: dailyPrice,
      deposit: securityDeposit,
      size: selectedSize,
      startDate: startDate,
      endDate: endStr,
      image: mainImg,
      sellerId: outfit.seller_id,
      sellerName: outfit.seller?.name || 'Partner Host',
    });
    toast.success('Added to Cart Drawer');
  };

  const handleBookNow = () => {
    if (!outfit) return;
    const mainImg = outfit.images?.[imgIdx]?.url || outfit.images?.[0]?.url || '';
    const endStr = calculateEndDate();

    // Clear previous cart contents
    useCartStore.getState().clearCart();

    // Populate with the current outfit
    useCartStore.getState().addItem({
      id: outfit.id,
      title: outfit.title,
      price: dailyPrice,
      deposit: securityDeposit,
      size: selectedSize,
      startDate: startDate,
      endDate: endStr,
      image: mainImg,
      sellerId: outfit.seller_id,
      sellerName: outfit.seller?.name || 'Partner Host',
    });

    toast.success('Checkout session created');
    router.push('/booking/checkout');
  };

  return (
    <div className="bg-ivory min-h-screen pt-24 font-sans text-charcoal select-none">
      
      {/* Breadcrumb banner */}
      <div className="border-b border-border py-4 bg-[#fbfaf8]">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold text-charcoal-light">
          <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
          <span>/</span>
          <Link href="/discover" className="hover:text-charcoal transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-charcoal">{outfit.title}</span>
        </div>
      </div>

      {/* Main product box */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Images & Gallery */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Interactive Zoom Box */}
            <div
              className="relative aspect-[4/5] bg-white border border-border rounded-lg overflow-hidden cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={outfit.images?.[imgIdx]?.url || '/placeholder-outfit.jpg'}
                alt={outfit.title}
                className="w-full h-full object-cover transition-transform duration-100 ease-out"
                style={zoomStyle}
              />

              {/* Wishlist Button */}
              <motion.button
                onClick={handleWishlistToggle}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={springTransition}
                className="absolute top-4 right-4 w-12 h-12 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-md border border-border/40 cursor-pointer"
                title="Wishlist"
              >
                <Heart
                  size={18}
                  className={isWishlisted(outfit.id) ? 'fill-rose-gold text-rose-gold' : 'text-charcoal-light'}
                />
              </motion.button>
            </div>

            {/* Gallery Thumbnails */}
            {outfit.images && outfit.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scroll-rail">
                {outfit.images.map((img, i) => (
                  <motion.button
                    key={img.id}
                    onClick={() => setImgIdx(i)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={springTransition}
                    className={`
                      w-20 h-24 rounded border overflow-hidden flex-shrink-0 bg-white cursor-pointer transition-all
                      ${imgIdx === i ? 'border-champagne ring-1 ring-champagne' : 'border-border'}
                    `}
                  >
                    <img src={img.url} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}

          </div>

          {/* Right Side: Options & Actions */}
          <div className="lg:col-span-5 text-left space-y-8">
            
            {/* Product Meta */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-champagne uppercase font-extrabold block">
                {outfit.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-medium text-charcoal leading-tight">
                {outfit.title}
              </h1>

              {outfit.rating_avg > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-charcoal-light">
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < Math.round(outfit.rating_avg) ? 'fill-current' : ''} />
                    ))}
                  </div>
                  <span>({outfit.rating_count || 3} reviews)</span>
                </div>
              )}
            </div>

            {/* Cost Details block */}
            <Card hoverEffect={false} padding="md" className="bg-[#FAF9F6] border-border relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-champagne" />
              <div className="space-y-4">
                
                {/* Custom price tag */}
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <span className="text-xs text-charcoal-light font-mono uppercase">Rental Duration Payout</span>
                  <span className="price text-2xl font-bold">
                    ₹{currentRentalFee.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-charcoal-light">for {selectedDuration} days</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono uppercase text-charcoal-light">
                  <div>
                    <span className="block text-[10px] text-charcoal-light font-bold mb-0.5">Escrow Refundable Deposit</span>
                    <span className="font-bold text-charcoal text-sm">₹{securityDeposit}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-charcoal-light font-bold mb-0.5">Delivery Logistics</span>
                    <span className="font-bold text-charcoal text-sm">
                      {outfit.delivery_available ? `₹${deliveryFee}` : 'Self Pick-up only'}
                    </span>
                  </div>
                </div>

              </div>
            </Card>

            {/* Controls: Size, Duration, Start Date */}
            <div className="space-y-6">
              
              {/* Sizes selection */}
              {outfit.sizes && outfit.sizes.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono tracking-widest text-charcoal-light uppercase font-bold block">
                    Select Size
                  </span>
                  <div className="flex gap-2">
                    {outfit.sizes.map((sz) => (
                      <motion.button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={springTransition}
                        className={`
                          w-12 h-12 rounded text-xs font-mono uppercase tracking-wider transition-colors duration-300 font-bold border cursor-pointer
                          ${selectedSize === sz
                            ? 'bg-charcoal text-ivory border-charcoal'
                            : 'bg-white border-border text-charcoal hover:border-charcoal'
                          }
                        `}
                      >
                        {sz}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Durations */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono tracking-widest text-charcoal-light uppercase font-bold block">
                  Rental Duration
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {([1, 3, 7] as const).map((days) => (
                    <motion.button
                      key={days}
                      onClick={() => setSelectedDuration(days)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={springTransition}
                      className={`
                        h-12 rounded text-xs font-mono uppercase tracking-wider transition-colors duration-300 font-bold border cursor-pointer
                        ${selectedDuration === days
                          ? 'bg-charcoal text-ivory border-charcoal'
                          : 'bg-white border-border text-charcoal hover:border-charcoal'
                        }
                      `}
                    >
                      {days} {days === 1 ? 'Day' : 'Days'}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono tracking-widest text-charcoal-light uppercase font-bold block">
                  Select Event Start Date
                </span>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-[52px] px-4 border border-border bg-white rounded outline-none focus:border-champagne font-mono text-sm"
                  />
                </div>
                {startDate && (
                  <p className="text-[10px] font-mono text-champagne uppercase font-bold mt-1 animate-fade-in">
                    Rental Ends on return date: {calculateEndDate()}
                  </p>
                )}
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="gold"
                onClick={handleBookNow}
                className="flex-1 h-[52px] text-xs font-mono tracking-widest uppercase cursor-pointer"
              >
                Rent Now
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToCart}
                className="flex-1 h-[52px] text-xs font-mono tracking-widest uppercase cursor-pointer"
              >
                Add to Cart Drawer
              </Button>
            </div>

            {/* Host Spotlights */}
            {outfit.seller && (
              <div className="p-4 border border-border rounded-lg bg-white flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-ivory-dark overflow-hidden flex-shrink-0">
                  <User className="text-charcoal-light p-2 w-full h-full" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-charcoal">{outfit.seller.name}</span>
                    {outfit.seller.is_verified && (
                      <span className="badge badge-sage text-[7px] uppercase font-bold">Verified</span>
                    )}
                  </div>
                  <span className="text-[9px] text-charcoal-light font-mono block">Trust Score: {outfit.seller.trust_score}%</span>
                </div>
              </div>
            )}

            {/* Accordions description */}
            <div className="border-t border-border pt-6 space-y-4">
              {[
                { id: 'details', label: 'Outfit Details', text: outfit.description || 'Stunning collection crafted from high-grade traditional fabric.' },
                { id: 'policies', label: 'Cancellation & Return Policies', text: 'Free cancellation up to 7 days before pickup. Security deposits are released within 72 hours of quality check.' },
              ].map((acc) => {
                const isOpen = openAccordion === acc.id;
                return (
                  <div key={acc.id} className="border-b border-border/40 pb-4">
                    <button
                      onClick={() => setOpenAccordion(isOpen ? null : acc.id)}
                      className="w-full flex items-center justify-between text-left font-display text-sm font-semibold text-charcoal cursor-pointer py-2"
                    >
                      <span>{acc.label}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={springTransition}
                      >
                        <ChevronRight size={14} />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={springTransition}
                          className="overflow-hidden"
                        >
                          <p className="mt-3 text-xs text-charcoal-light leading-relaxed font-light">
                            {acc.text}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* Recommendations & Reviews sections */}
      <section className="border-t border-border bg-white py-24 select-none">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          
          {/* Reviews list */}
          <div className="space-y-8">
            <h3 className="text-2xl font-display font-medium text-charcoal text-left">
              Reviews & Feedback
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {reviews.map((rev, i) => (
                <Card key={i} hoverEffect={false} padding="md" className="space-y-4">
                  <div className="flex gap-0.5 text-gold">
                    {[...Array(5)].map((_, starI) => (
                      <Star key={starI} size={12} className={starI < rev.rating ? 'fill-current' : ''} />
                    ))}
                  </div>
                  <p className="text-xs text-charcoal-light leading-relaxed italic font-light">
                    &ldquo;{rev.comment || rev.text}&rdquo;
                  </p>
                  <div className="border-t border-border/40 pt-3 flex items-center justify-between text-[9px] font-mono uppercase text-charcoal-light">
                    <span className="font-bold text-charcoal">{rev.reviewer_name || rev.name}</span>
                    <span>{rev.created_at ? new Date(rev.created_at).toLocaleDateString() : rev.date}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Similar outfits grid */}
          {similarOutfits.length > 0 && (
            <div className="space-y-8 text-left">
              <h3 className="text-2xl font-display font-medium text-charcoal">
                You May Also Like
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {similarOutfits.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    transition={springTransition}
                  >
                    <Link href={`/outfit/${item.id}`} className="group flex flex-col gap-2">
                      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-ivory-dark border border-border relative">
                        <motion.img 
                          src={item.images?.[0]?.url} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                          whileHover={{ scale: 1.04 }}
                          transition={springTransition}
                        />
                      </div>
                      <div>
                        <h4 className="font-display text-xs font-semibold truncate text-charcoal mt-1">{item.title}</h4>
                        <span className="price text-[11px] font-mono text-charcoal-light">₹{item.price_1day}/day</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
