'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Star, Search, RotateCcw, LayoutGrid, Sparkles, Filter } from 'lucide-react';
import { outfitsAPI } from '@/lib/api';
import type { Outfit, OutfitCategory } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Z_INDEX } from '@/lib/constants';

const CATEGORY_OPTIONS: { label: string; value: OutfitCategory }[] = [
  { label: 'Lehenga', value: 'lehenga' },
  { label: 'Saree', value: 'saree' },
  { label: 'Anarkali', value: 'anarkali' },
  { label: 'Sharara', value: 'sharara' },
  { label: 'Gown', value: 'gown' },
  { label: 'Sherwani', value: 'sherwani' },
  { label: 'Kurta Set', value: 'kurta_set' },
  { label: 'Co-Ord', value: 'co_ord' },
  { label: 'Western', value: 'western' },
];

const OCCASION_OPTIONS = [
  { label: 'Wedding', value: 'wedding' },
  { label: 'Reception', value: 'reception' },
  { label: 'Festival', value: 'festive' },
  { label: 'Party', value: 'party' },
  { label: 'Engagement', value: 'engagement' },
  { label: 'Sangeet', value: 'sangeet' },
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const PRICE_RANGES = [
  { label: 'Under ₹2,000', min: 0, max: 2000 },
  { label: '₹2,000 - ₹3,000', min: 2000, max: 3000 },
  { label: '₹3,000 - ₹4,000', min: 3000, max: 4000 },
  { label: 'Over ₹4,000', min: 4000, max: 99999 },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newly Listed' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Popularity' },
];

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

function DiscoverContent() {
  const searchParams = useSearchParams() || new URLSearchParams();
  const router = useRouter();

  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState<string>(searchParams.get('category') || '');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(
    searchParams.get('occasion') ? [searchParams.get('occasion')!] : []
  );
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  const fetchOutfits = useCallback(async () => {
    setLoading(true);
    try {
      const filters: Record<string, unknown> = {
        q: searchQuery || undefined,
        category: (category as OutfitCategory) || undefined,
        city: city || undefined,
        sort: sortBy || undefined,
        size: selectedSizes.join(',') || undefined,
        min_price: priceRange?.min ?? undefined,
        max_price: priceRange?.max ?? undefined,
        occasion: selectedOccasions.join(',') || undefined,
      };
      const resp = await outfitsAPI.browse(filters);
      setOutfits(resp.outfits || []);
    } catch (err) {
      console.warn('API error browsing outfits', err);
      setOutfits([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category, city, sortBy, selectedSizes, priceRange, selectedOccasions]);

  useEffect(() => {
    fetchOutfits();
  }, [fetchOutfits]);

  const updateURLParams = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (category) params.set('category', category);
    if (city) params.set('city', city);
    if (sortBy) params.set('sort', sortBy);
    if (selectedOccasions.length > 0) params.set('occasion', selectedOccasions[0]);
    router.replace(`/discover?${params.toString()}`);
  }, [searchQuery, category, city, sortBy, selectedOccasions, router]);

  useEffect(() => {
    updateURLParams();
  }, [updateURLParams]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setCategory('');
    setSelectedSizes([]);
    setPriceRange(null);
    setSelectedOccasions([]);
    setCity('');
    setSortBy('newest');
    router.replace('/discover');
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleOccasion = (occ: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  const hasActiveFilters = !!category || selectedSizes.length > 0 || !!priceRange || selectedOccasions.length > 0 || !!city;

  const activeFilterChips: { label: string; onRemove: () => void }[] = [];
  if (category) activeFilterChips.push({ label: CATEGORY_OPTIONS.find(o => o.value === category)?.label || category, onRemove: () => setCategory('') });
  selectedOccasions.forEach(occ => activeFilterChips.push({ label: OCCASION_OPTIONS.find(o => o.value === occ)?.label || occ, onRemove: () => toggleOccasion(occ) }));
  selectedSizes.forEach(s => activeFilterChips.push({ label: `Size ${s}`, onRemove: () => toggleSize(s) }));
  if (priceRange) activeFilterChips.push({ label: PRICE_RANGES.find(r => r.min === priceRange.min && r.max === priceRange.max)?.label || `₹${priceRange.min}-${priceRange.max}`, onRemove: () => setPriceRange(null) });
  if (city) activeFilterChips.push({ label: city, onRemove: () => setCity('') });

  const filterSidebar = (
    <div className="space-y-8 text-left font-sans select-none">
      <div className="space-y-3">
        <h4 className="text-[10px] font-mono tracking-widest uppercase text-charcoal font-bold flex items-center gap-2">
          <Filter size={12} className="text-champagne" /> Category
        </h4>
        <div className="flex flex-col gap-2">
          {CATEGORY_OPTIONS.map((opt) => (
            <motion.button
              key={opt.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={springTransition}
              onClick={() => setCategory(category === opt.value ? '' : opt.value)}
              className={`
                h-[52px] w-full px-4 rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 font-bold border text-left cursor-pointer
                ${category === opt.value
                  ? 'bg-charcoal text-ivory border-charcoal shadow-sm'
                  : 'bg-white border-border text-charcoal-light hover:border-charcoal hover:text-charcoal hover:shadow-sm'
                }
              `}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-mono tracking-widest uppercase text-charcoal font-bold flex items-center gap-2">
          <Sparkles size={12} className="text-champagne" /> Occasions
        </h4>
        <div className="flex flex-wrap gap-2">
          {OCCASION_OPTIONS.map((opt) => {
            const isSelected = selectedOccasions.includes(opt.value);
            return (
              <motion.button
                key={opt.value}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={springTransition}
                onClick={() => toggleOccasion(opt.value)}
                className={`
                  px-4 h-[52px] rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 font-bold border cursor-pointer
                  ${isSelected
                    ? 'bg-charcoal text-ivory border-charcoal shadow-sm'
                    : 'bg-white border-border text-charcoal-light hover:border-charcoal hover:shadow-sm'
                  }
                `}
              >
                {opt.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-mono tracking-widest uppercase text-charcoal font-bold">Size</h4>
        <div className="grid grid-cols-3 gap-2">
          {SIZE_OPTIONS.map((s) => {
            const isSelected = selectedSizes.includes(s);
            return (
              <motion.button
                key={s}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={springTransition}
                onClick={() => toggleSize(s)}
                className={`
                  h-11 rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 font-bold border cursor-pointer
                  ${isSelected
                    ? 'bg-charcoal text-ivory border-charcoal shadow-sm'
                    : 'bg-white border-border text-charcoal-light hover:border-charcoal'
                  }
                `}
              >
                {s}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-mono tracking-widest uppercase text-charcoal font-bold">Rental Budget</h4>
        <div className="flex flex-col gap-2">
          {PRICE_RANGES.map((rng, i) => {
            const isSelected = priceRange?.min === rng.min && priceRange?.max === rng.max;
            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
                onClick={() => setPriceRange(isSelected ? null : { min: rng.min, max: rng.max })}
                className={`
                  h-[52px] w-full px-4 rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 font-bold border text-left cursor-pointer
                  ${isSelected
                    ? 'bg-charcoal text-ivory border-charcoal shadow-sm'
                    : 'bg-white border-border text-charcoal-light hover:border-charcoal hover:text-charcoal hover:shadow-sm'
                  }
                `}
              >
                {rng.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={resetAllFilters}
        className="w-full flex items-center justify-center gap-2 cursor-pointer"
      >
        <RotateCcw size={14} /> Reset Filters
      </Button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className="max-w-7xl mx-auto px-6 py-24 select-none font-sans text-charcoal"
    >
      <div className="text-left mb-10">
        <span className="text-[10px] font-mono tracking-[0.25em] text-champagne uppercase font-bold block">
          Luxe Wardrobe
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-medium mt-1">
          Browse Catalog
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-6">
        <div className="md:col-span-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light" size={16} />
            <input
              type="text"
              placeholder="Search by designer, outfit category, color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[52px] pl-12 pr-4 text-sm font-sans bg-white border border-border rounded outline-none focus:border-champagne transition-shadow focus:shadow-sm"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <input
            type="text"
            placeholder="Filter by city (e.g. Mumbai)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-[52px] px-4 text-sm font-sans bg-white border border-border rounded outline-none focus:border-champagne transition-shadow focus:shadow-sm"
          />
        </div>

        <div className="md:col-span-4 flex gap-3">
          <div className="flex-1 relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-[52px] px-4 pr-10 text-sm font-sans bg-white border border-border rounded outline-none focus:border-champagne appearance-none cursor-pointer transition-shadow focus:shadow-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-light">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden h-[52px] px-5 border border-border rounded bg-white hover:bg-ivory-dark transition-colors cursor-pointer flex items-center gap-2"
          >
            <Filter size={16} className="text-champagne" />
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[9px] font-mono uppercase tracking-wider text-charcoal-light font-bold mr-1">Active Filters:</span>
          {activeFilterChips.map((chip, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-charcoal/5 border border-border/60 rounded-full text-[10px] font-mono text-charcoal">
              {chip.label}
              <button onClick={chip.onRemove} className="hover:text-error transition-colors cursor-pointer">
                <X size={11} />
              </button>
            </span>
          ))}
          <button onClick={resetAllFilters} className="text-[9px] font-mono uppercase tracking-wider text-champagne hover:text-charcoal transition-colors ml-1 cursor-pointer">
            Clear all
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 border border-border p-6 rounded-lg bg-white shadow-sm">
            {filterSidebar}
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-6">
          <div className="hidden lg:flex justify-between items-center text-xs font-mono text-charcoal-light">
            <span className="flex items-center gap-2">
              <Sparkles size={13} className="text-champagne" />
              {outfits.length} {outfits.length === 1 ? 'couture masterpiece' : 'couture masterpieces'}
            </span>
            <span className="flex items-center gap-1"><LayoutGrid size={14} /> Gallery Grid</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="space-y-3 animate-pulse">
                  <div className="shimmer h-[340px] rounded-lg bg-ivory-dark" />
                  <div className="h-3 bg-ivory-dark rounded w-1/3" />
                  <div className="h-4 bg-ivory-dark rounded w-3/4" />
                  <div className="h-3 bg-ivory-dark rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : outfits.length === 0 ? (
            <div className="py-20 text-center space-y-6 border border-border/60 rounded-xl bg-white p-10 shadow-sm">
              <div className="w-20 h-20 mx-auto rounded-full bg-champagne/5 border border-champagne/20 flex items-center justify-center">
                <Sparkles size={32} className="text-champagne/60" />
              </div>
              <div className="space-y-2 max-w-xs mx-auto">
                <h3 className="font-display text-lg font-semibold text-charcoal">No Results Found</h3>
                <p className="text-xs text-charcoal-light leading-relaxed font-light">
                  We couldn&apos;t find any couture pieces matching your current filters. Try adjusting your search criteria.
                </p>
              </div>
              <Button variant="gold" onClick={resetAllFilters} className="cursor-pointer">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {outfits.map((item) => {
                const imgUrl = item.images?.[0]?.url || '/placeholder-outfit.jpg';
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0, 0, 0, 0.04)' }}
                    transition={springTransition}
                    className="bg-white border border-border rounded-lg overflow-hidden group text-left flex flex-col justify-between"
                  >
                    <div className="h-[340px] relative overflow-hidden bg-ivory-dark">
                      <motion.img
                        src={imgUrl}
                        alt={item.title}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springTransition}>
                          <Link
                            href={`/outfit/${item.id}`}
                            className="btn btn-gold !h-[52px] px-6 text-[10px] font-mono tracking-widest uppercase"
                          >
                            View Details
                          </Link>
                        </motion.div>
                      </div>
                      {item.rating_avg > 0 && (
                        <span className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm border border-border/40 text-[9px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                          <Star size={10} className="fill-gold text-gold" /> {item.rating_avg}
                        </span>
                      )}
                    </div>
                    <div className="p-5 space-y-1.5 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono text-champagne uppercase font-bold tracking-wider">
                            {item.category}
                          </span>
                          {item.city && (
                            <Badge variant="outline" className="!py-0 !px-1.5 font-sans lowercase text-[9px]">
                              {item.city}
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-display text-sm font-semibold text-charcoal mt-1 line-clamp-1">
                          {item.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-4 text-xs font-bold font-mono text-charcoal">
                        <span>
                          ₹{item.price_1day?.toLocaleString('en-IN')}
                          <span className="text-[9px] font-normal text-charcoal-light">/day</span>
                        </span>
                        <span className="text-[9px] font-normal text-charcoal-light">
                          Dep: ₹{item.security_deposit?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 lg:hidden" style={{ zIndex: Z_INDEX.FILTERS }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-[4px]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={springTransition}
              className="absolute left-0 top-0 bottom-0 w-80 max-w-full bg-ivory p-6 border-r border-border overflow-y-auto flex flex-col shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <h3 className="font-display text-lg font-bold">Catalog Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-[52px] h-[52px] flex items-center justify-center border border-border hover:bg-ivory-dark rounded transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
              {filterSidebar}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-24 select-none">
        <div className="text-left mb-10">
          <div className="h-3 bg-ivory-dark rounded w-24 animate-pulse mb-3" />
          <div className="h-10 bg-ivory-dark rounded w-64 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="hidden lg:block lg:col-span-3">
            <div className="space-y-6 animate-pulse">
              <div className="h-4 bg-ivory-dark rounded w-20" />
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-[52px] bg-ivory-dark rounded" />)}
            </div>
          </div>
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="space-y-3">
                  <div className="shimmer h-[340px] rounded-lg bg-ivory-dark" />
                  <div className="h-3 bg-ivory-dark rounded w-1/3" />
                  <div className="h-4 bg-ivory-dark rounded w-3/4" />
                  <div className="h-3 bg-ivory-dark rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <DiscoverContent />
    </Suspense>
  );
}
