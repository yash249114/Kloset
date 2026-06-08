'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import OutfitCard from '@/components/outfit/OutfitCard';
import { useBookingStore } from '@/stores/booking.store';
import { useCartStore } from '@/stores/cart.store';
import { outfitsAPI } from '@/lib/api/outfits';
import { toast } from 'sonner';
import {
  Heart,
  MapPin,
  Star,
  Lock,
  ChevronDown,
  Plus,
  Minus,
} from 'lucide-react';
import type { Outfit } from '@/types';

/* ─── Reviews (will be fetched from API in future) ── */
const mockReviews = [
  { id: 'r1', name: 'Aishwarya S.', rating: 5, text: 'Absolutely stunning! The embroidery caught the light beautifully. Received so many compliments.', date: '2026-05-15' },
  { id: 'r2', name: 'Meera D.', rating: 5, text: 'Perfect fit. The adjustable details made it comfortable to wear for the entire event.', date: '2026-04-28' },
  { id: 'r3', name: 'Tara S.', rating: 4, text: 'Excellent condition, smelt fresh and clean. The fabric feels extremely premium. Will rent again!', date: '2026-04-12' },
];

export default function OutfitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingStore = useBookingStore();
  const addItem = useCartStore((state) => state.addItem);
  const id = params?.id as string;

  const [outfit, setOutfit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedDuration, setSelectedDuration] = useState<1 | 3 | 7>(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [similarOutfits, setSimilarOutfits] = useState<Outfit[]>([]);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ details: true });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const resp = await outfitsAPI.getById(id);
        if (!resp) {
          setOutfit(null);
          return;
        }

        const data = { ...resp, images: resp.images.map((img) => img.url) };
        setOutfit(data);
        setIsWishlisted(data.is_wishlisted || false);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);

        // Fetch similar outfits
        try {
          const sim = await outfitsAPI.browse({ category: data.category, per_page: 5 });
          const filtered = (sim.outfits || []).filter((o) => o.id !== id);
          setSimilarOutfits(filtered.slice(0, 4));
        } catch {
          setSimilarOutfits([]);
        }
      } catch {
        setOutfit(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="shimmer h-[600px] rounded-sm" />
          <div className="space-y-6">
            <div className="shimmer h-10 w-3/4 rounded-sm" />
            <div className="shimmer h-6 w-1/3 rounded-sm" />
            <div className="shimmer h-40 w-full rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!outfit) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center pt-24 bg-white select-none">
        <div className="text-center">
          <p className="font-display text-lg font-bold mb-6">Outfit not found</p>
          <Link href="/discover" className="btn-luxury-primary text-xs">Browse Outfits</Link>
        </div>
      </div>
    );
  }

  const priceMap = {
    1: outfit.price_1day || 0,
    3: outfit.price_3day || Math.round((outfit.price_1day || 0) * 2.2),
    7: outfit.price_7day || Math.round((outfit.price_1day || 0) * 4.5),
  };

  const deliveryFee = outfit.delivery_available ? outfit.delivery_fee : 0;
  const platformFee = Math.round(priceMap[selectedDuration] * 0.05);

  const handleWishlist = async () => {
    try {
      if (isWishlisted) await outfitsAPI.removeFromWishlist(outfit.id);
      else await outfitsAPI.addToWishlist(outfit.id);
    } catch {}
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = () => {
    const mainImg = outfit.images?.[imgIdx] || outfit.images?.[0] || '';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDaysLater = new Date();
    threeDaysLater.setDate(tomorrow.getDate() + 3);

    addItem({
      id: outfit.id,
      title: outfit.title,
      price: priceMap[selectedDuration],
      deposit: outfit.security_deposit || 0,
      size: selectedSize,
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: threeDaysLater.toISOString().split('T')[0],
      image: mainImg,
      sellerId: outfit.seller_id,
      sellerName: outfit.seller?.name || 'Seller',
    });
    toast.success('Added to Cart');
  };

  const handleBookNow = () => {
    const mainImg = outfit.images?.[0] || '';
    bookingStore.reset();
    bookingStore.setOutfit(outfit.id, outfit.title, mainImg);
    bookingStore.setSize(selectedSize);
    bookingStore.setDuration(selectedDuration);
    bookingStore.setPricing(priceMap[selectedDuration], outfit.security_deposit || 0, deliveryFee);
    toast.success('Checkout initialized');
    router.push('/booking/checkout');
  };

  const getDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white min-h-screen pt-20 font-body text-gray-900 select-none">
      
      {/* Breadcrumb banner */}
      <div className="border-b border-[var(--kloset-border)] py-3 bg-[#fbfaf8]">
        <div className="max-w-[1440px] mx-auto px-6 flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold text-gray-400">
          <Link href="/" className="hover:text-gray-950 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/discover" className="hover:text-gray-950 transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[250px]">{outfit.title}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* ─── COLUMN 1: Image Gallery (Span 7) ─── */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            
            {/* Sidebar Thumbnails */}
            {outfit.images?.length > 1 && (
              <div className="flex flex-row md:flex-col gap-2.5 order-2 md:order-1 overflow-x-auto md:overflow-x-visible">
                {outfit.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className="relative w-14 h-18 border cursor-pointer transition-colors overflow-hidden bg-gray-50 flex-shrink-0"
                    style={{
                      borderColor: imgIdx === i ? 'var(--kloset-gold)' : '#e5e5e5',
                    }}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            )}

            {/* Large Active View Image */}
            <div className="relative aspect-[3/4] flex-grow bg-[#faf9f6] border border-gray-100 overflow-hidden order-1 md:order-2">
              {outfit.images?.length > 0 ? (
                <Image
                  key={imgIdx}
                  src={outfit.images[imgIdx]}
                  alt={outfit.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">No Image</div>
              )}

              {/* Wishlist toggle overlaid on image */}
              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 border border-gray-100 hover:bg-white shadow-sm flex items-center justify-center cursor-pointer transition-all duration-300"
              >
                <Heart size={16} fill={isWishlisted ? 'var(--kloset-gold)' : 'none'} stroke={isWishlisted ? 'var(--kloset-gold)' : '#111'} />
              </button>
            </div>
          </div>

          {/* ─── COLUMN 2: Details & Actions (Span 5) ─── */}
          <div className="lg:col-span-5 flex flex-col gap-8 text-left">
            
            {/* Header info */}
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-bold block mb-2 leading-none">
                Hosted by {outfit.seller?.name || 'Seller'}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-wide text-gray-900 leading-tight mb-3">
                {outfit.title}
              </h1>
              
              <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                {outfit.rating_avg > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-900">{(outfit.rating_avg || 4.8).toFixed(1)}</span>
                    <div className="flex items-center text-[var(--kloset-gold)]">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={12}
                          className={idx < Math.round(outfit.rating_avg || 4.8) ? 'fill-[var(--kloset-gold)] text-[var(--kloset-gold)]' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                    <span className="text-gray-400 font-light">({outfit.rating_count || 45} reviews)</span>
                  </div>
                )}
                
                <span className="flex items-center gap-1 font-semibold text-gray-700">
                  <MapPin size={12} className="text-gray-400" />
                  {outfit.city}
                </span>
              </div>
            </div>

            {/* Price display & deposit */}
            <div className="pb-6 border-b border-[var(--kloset-border)] flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-[10px] tracking-wider uppercase text-gray-400 font-bold block mb-1">Rental fee</span>
                <div className="flex items-baseline text-gray-950">
                  <span className="text-xs font-semibold mr-0.5">₹</span>
                  <span className="text-3xl font-bold tracking-tight">
                    {priceMap[selectedDuration].toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-400 ml-1 font-medium">/ {selectedDuration === 1 ? 'day' : `${selectedDuration} days`}</span>
                </div>
              </div>

              {outfit.security_deposit && (
                <div className="text-right">
                  <span className="text-[10px] tracking-wider uppercase text-gray-450 font-bold block mb-1">Security Deposit</span>
                  <span className="text-sm font-semibold text-gray-700">
                    ₹{(outfit.security_deposit).toLocaleString('en-IN')}
                  </span>
                  <p className="text-[9px] text-gray-400 mt-0.5 font-light">100% refundable on return check</p>
                </div>
              )}
            </div>

            {/* Sizing grid */}
            {outfit.sizes?.length > 0 && (
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-900 block mb-2.5">Select Size</span>
                <div className="flex flex-wrap gap-2">
                  {outfit.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 border text-xs font-semibold flex items-center justify-center cursor-pointer transition-all duration-300 rounded-none ${
                        selectedSize === size
                          ? 'border-gray-900 bg-gray-950 text-white font-bold'
                          : 'border-gray-200 hover:border-gray-400 bg-white text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rental Duration Selectors */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-900 block mb-2.5">Select Duration</span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { days: 1, label: '1 Day' },
                  { days: 3, label: '3 Days' },
                  { days: 7, label: '7 Days' },
                ].map((d) => (
                  <button
                    key={d.days}
                    onClick={() => setSelectedDuration(d.days as 1 | 3 | 7)}
                    className={`py-3 px-2 border text-center cursor-pointer transition-all duration-300 rounded-none ${
                      selectedDuration === d.days
                        ? 'border-gray-950 bg-gray-950 text-white font-bold'
                        : 'border-gray-200 hover:border-gray-400 bg-white text-gray-600'
                    }`}
                  >
                    <div className="text-[11px] font-semibold tracking-wider uppercase">{d.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout & Cart buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleBookNow}
                className="w-full btn-luxury-primary justify-center cursor-pointer py-3.5 text-xs tracking-[0.2em] font-bold"
              >
                Book Rental Now
              </button>
              
              <button
                onClick={handleAddToCart}
                className="w-full btn-luxury-secondary justify-center cursor-pointer py-3.5 text-xs tracking-[0.2em]"
              >
                Add to Cart
              </button>
            </div>

            {/* Trust highlights */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest justify-center py-2.5 bg-[#fbfaf8] border border-[var(--kloset-border)] rounded-sm">
              <Lock size={12} className="text-gray-400" />
              <span>Razorpay Escrow Secure Transaction</span>
            </div>

            {/* Editorial Accordion Menus */}
            <div className="border-t border-[var(--kloset-border)] mt-4 divide-y divide-[var(--kloset-border)]">
              {[
                {
                  key: 'details',
                  title: 'About the garment',
                  content: (
                    <ul className="space-y-2 text-xs text-gray-500 font-light leading-relaxed">
                      <li><strong>Fabric & Details:</strong> {outfit.fabric || 'Premium Handcrafted Silk'}</li>
                      {outfit.colors?.length > 0 && (
                        <li><strong>Garment Color:</strong> {outfit.colors.join(', ')}</li>
                      )}
                      {outfit.accessories_included?.length > 0 && (
                        <li><strong>Accessories Included:</strong> {outfit.accessories_included.join(', ')}</li>
                      )}
                      <li>{outfit.description}</li>
                    </ul>
                  )
                },
                {
                  key: 'shipping',
                  title: 'Shipping & Care',
                  content: (
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      Garments arrive professionally dry-cleaned, pressed, and sealed in sanitized packaging. Free transit insurance is applied. We schedule return pickups directly from your address. Est. Delivery by <strong className="text-gray-800">{getDeliveryDate()}</strong>.
                    </p>
                  )
                },
                {
                  key: 'deposit',
                  title: 'Security Deposit policy',
                  content: (
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      The refundable security deposit of <strong>₹{(outfit.security_deposit || 0).toLocaleString('en-IN')}</strong> is held securely and refunded directly to your original payment account within 48 hours of return transit check in.
                    </p>
                  )
                }
              ].map((acc) => {
                const open = openAccordions[acc.key];
                return (
                  <div key={acc.key} className="py-3">
                    <button
                      onClick={() => toggleAccordion(acc.key)}
                      className="w-full text-left py-2 flex justify-between items-center font-display text-[14px] font-semibold text-gray-900 hover:text-[var(--kloset-gold)] transition-colors cursor-pointer"
                    >
                      <span>{acc.title}</span>
                      <ChevronDown size={14} className={`text-gray-400 transform transition-transform duration-300 ${open ? 'rotate-180 text-[var(--kloset-gold)]' : ''}`} />
                    </button>
                    {open && (
                      <div className="pt-2 pb-3 animate-fade-in pl-1">
                        {acc.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* ─── SECTION 3: Reviews & Recommendations ─── */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-16 border-t border-[var(--kloset-border)]">
          
          {/* Reviews column (Span 4) */}
          <div className="lg:col-span-4 text-left">
            <h3 className="font-display text-lg font-semibold text-gray-900 uppercase tracking-wider mb-6">Customer Reviews</h3>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center text-[var(--kloset-gold)]">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={16}
                    className="fill-[var(--kloset-gold)] text-[var(--kloset-gold)]"
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-800">{(outfit.rating_avg || 4.8).toFixed(1)} out of 5</span>
            </div>

            <div className="flex flex-col gap-5">
              {mockReviews.map((r) => (
                <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5.5 h-5.5 rounded-full bg-gray-150 flex items-center justify-center text-[10px] font-bold text-gray-500">
                      {r.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-gray-700">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex items-center text-[var(--kloset-gold)]">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={11}
                          className={idx < r.rating ? 'fill-[var(--kloset-gold)] text-[var(--kloset-gold)]' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-gray-450 font-bold ml-1.5">Verified Renter</span>
                  </div>
                  <p className="text-[10px] text-gray-450 mb-1.5 font-light">Reviewed on {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-xs text-gray-600 leading-relaxed font-light">{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Similar outfits grid (Span 8) */}
          <div className="lg:col-span-8 text-left">
            <h3 className="font-display text-lg font-semibold text-gray-900 uppercase tracking-wider mb-8">Recommendations</h3>
            {similarOutfits.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {similarOutfits.map((s) => (
                  <OutfitCard key={s.id} outfit={s} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-light">No recommendations available at this time.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
