'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import OutfitCard from '@/components/outfit/OutfitCard';
import { outfitsAPI } from '@/lib/api/outfits';
import { SlidersHorizontal, X, ChevronDown, Star } from 'lucide-react';
import type { Outfit, OutfitCategory } from '@/types';

const categoryOptions = [
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

const priceRanges = [
  { label: 'Under ₹2,000', min: 0, max: 2000 },
  { label: '₹2,000 to ₹3,000', min: 2000, max: 3000 },
  { label: '₹3,000 to ₹4,000', min: 3000, max: 4000 },
  { label: 'Over ₹4,000', min: 4000, max: 99999 },
];

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const cityOptions = ['Mumbai', 'Delhi', 'Bangalore', 'Jaipur', 'Hyderabad', 'Chennai'];

function DiscoverContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('');
  const [deliveryOnly, setDeliveryOnly] = useState(false);

  const activeFilterCount = [
    category,
    selectedSizes.length > 0,
    selectedCity,
    priceRange,
    minRating,
    deliveryOnly
  ].filter(Boolean).length;

  const fetchOutfits = useCallback(async () => {
    try {
      setLoading(true);
      const filters: Record<string, any> = {};
      
      if (searchQuery) filters.q = searchQuery;
      if (category) filters.category = category;
      if (selectedSizes.length > 0) filters.size = selectedSizes[0]; // API supports single size filter
      if (selectedCity) filters.city = selectedCity;
      if (priceRange) {
        if (priceRange.min > 0) filters.min_price = priceRange.min;
        if (priceRange.max < 99999) filters.max_price = priceRange.max;
      }
      if (sortBy) filters.sort = sortBy;

      const { outfits: apiOutfits, meta } = await outfitsAPI.browse(filters);
      
      // Client-side filters for things the API doesn't support
      let filtered = apiOutfits;
      if (minRating) filtered = filtered.filter((o) => o.rating_avg >= minRating);
      if (deliveryOnly) filtered = filtered.filter((o) => o.delivery_available);
      
      setOutfits(filtered);
      setTotalCount(meta?.total || filtered.length);
    } catch (err) {
      console.error('Failed to fetch outfits:', err);
      setOutfits([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category, selectedSizes, selectedCity, priceRange, minRating, sortBy, deliveryOnly]);

  useEffect(() => {
    fetchOutfits();
  }, [fetchOutfits]);

  // Sync URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('q');
    const city = searchParams.get('city');
    if (cat) setCategory(cat);
    if (q) setSearchQuery(q);
    if (city) setSelectedCity(city);
  }, [searchParams]);

  const clearFilters = () => {
    setCategory('');
    setSelectedSizes([]);
    setSelectedCity('');
    setPriceRange(null);
    setMinRating(null);
    setSortBy('');
    setDeliveryOnly(false);
    setSearchQuery('');
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
  };

  /* ─── Filter Sidebar Component ── */
  const FilterPanel = () => (
    <div className="space-y-6 text-[#111111] select-none font-body">
      
      {/* Category */}
      <div className="pb-5 border-b border-[var(--kloset-border)]">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-900 mb-3">Category</h4>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setCategory('')}
            className={`text-left text-[12px] hover:text-[var(--kloset-gold)] cursor-pointer transition-colors ${!category ? 'font-bold text-[var(--kloset-gold)]' : 'text-gray-600'}`}
          >
            All Collections
          </button>
          {categoryOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCategory(opt.value)}
              className={`text-left text-[12px] pl-2 hover:text-[var(--kloset-gold)] cursor-pointer transition-colors ${category === opt.value ? 'font-bold text-[var(--kloset-gold)]' : 'text-gray-500'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery speed checkbox */}
      <div className="pb-5 border-b border-[var(--kloset-border)]">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-900 mb-3">Service Type</h4>
        <label className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={deliveryOnly}
            onChange={(e) => setDeliveryOnly(e.target.checked)}
            className="rounded border-gray-300 text-[var(--kloset-gold)] focus:ring-[var(--kloset-gold)] scale-105"
          />
          <span>Express Shipping</span>
        </label>
      </div>

      {/* Ratings */}
      <div className="pb-5 border-b border-[var(--kloset-border)]">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-900 mb-3">Rating</h4>
        <div className="flex flex-col gap-2">
          {[4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => setMinRating(minRating === stars ? null : stars)}
              className={`flex items-center gap-1.5 text-[12px] hover:text-[var(--kloset-gold)] cursor-pointer ${minRating === stars ? 'font-bold text-[var(--kloset-gold)]' : 'text-gray-500'}`}
            >
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={13}
                    className={idx < stars ? 'text-[var(--kloset-gold)] fill-[var(--kloset-gold)]' : 'text-gray-250'}
                  />
                ))}
              </div>
              <span className="text-[11px] ml-0.5">& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Ranges */}
      <div className="pb-5 border-b border-[var(--kloset-border)]">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-900 mb-3">Rental Fee</h4>
        <div className="flex flex-col gap-2">
          {priceRanges.map((range) => {
            const isActive = priceRange?.min === range.min && priceRange?.max === range.max;
            return (
              <button
                key={range.label}
                onClick={() => setPriceRange(isActive ? null : range)}
                className={`text-left text-[12px] hover:text-[var(--kloset-gold)] cursor-pointer transition-colors ${isActive ? 'font-bold text-[var(--kloset-gold)]' : 'text-gray-500'}`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Grid (Squared) */}
      <div className="pb-5 border-b border-[var(--kloset-border)]">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-900 mb-3">Size</h4>
        <div className="grid grid-cols-3 gap-2 max-w-[180px]">
          {sizeOptions.map((size) => {
            const active = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`h-9 border text-xs font-semibold flex items-center justify-center cursor-pointer transition-colors rounded-none ${
                  active ? 'bg-[var(--kloset-dark)] border-[var(--kloset-dark)] text-white' : 'bg-white border-[var(--kloset-border)] hover:bg-gray-50 text-gray-700'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-900 mb-3">Location</h4>
        <div className="flex flex-col gap-2">
          {cityOptions.map((city) => {
            const active = selectedCity === city;
            return (
              <label key={city} className="flex items-center gap-2.5 text-[12px] text-gray-500 hover:text-gray-900 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => setSelectedCity(active ? '' : city)}
                  className="rounded border-gray-300 text-[var(--kloset-gold)] focus:ring-[var(--kloset-gold)] scale-105"
                />
                <span className={active ? 'font-bold text-gray-900' : ''}>{city}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      
      {/* Top Banner Result Stats */}
      <div className="border-b border-[var(--kloset-border)] py-4 bg-[#fbfaf8] mb-8">
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            {loading ? 'Loading...' : `Showing 1-${outfits.length} of ${totalCount} items`} {searchQuery && `for "${searchQuery}"`}
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 font-semibold uppercase tracking-wider">Sort:</span>
              <div className="relative flex items-center bg-white border border-[var(--kloset-border)] rounded-sm px-2.5 py-1.5 hover:bg-gray-50">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-gray-700 font-semibold outline-none cursor-pointer pr-4 appearance-none"
                >
                  <option value="">Default Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Avg. Customer Review</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 text-gray-450 pointer-events-none" />
              </div>
            </div>
            
            {/* Mobile Filters Trigger */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-[var(--kloset-border)] rounded-sm text-xs font-semibold bg-white hover:bg-gray-50 cursor-pointer"
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex gap-12 items-start">
          
          {/* Left Filter Sidebar (Desktop) */}
          <aside className="hidden lg:block w-[220px] flex-shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--kloset-border)] mb-5">
              <span className="font-display font-semibold text-sm uppercase tracking-widest">Filters</span>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-[10px] uppercase tracking-wider text-blue-600 hover:text-blue-800 cursor-pointer font-bold">
                  Clear All
                </button>
              )}
            </div>
            <FilterPanel />
          </aside>

          {/* Grid Products list */}
          <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="shimmer aspect-[3/4] rounded-sm mb-3" />
                    <div className="shimmer h-4 w-3/4 rounded-sm mb-2" />
                    <div className="shimmer h-3 w-1/2 rounded-sm" />
                  </div>
                ))}
              </div>
            ) : outfits.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-[var(--kloset-border)] rounded-sm bg-[#fbfaf8]">
                <p className="font-display text-[16px] font-semibold text-gray-900 mb-1">No outfits match your filters</p>
                <p className="text-xs text-gray-450 mb-6 font-light">Adjust or clear filters to see collections.</p>
                <button onClick={clearFilters} className="btn-luxury-secondary px-6">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {outfits.map((outfit) => (
                  <OutfitCard key={outfit.id} outfit={outfit} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Filter Sheet Drawer */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4.5 border-b border-[var(--kloset-border)]">
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-gray-900">Filters</h3>
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">
                    Clear All
                  </button>
                )}
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 cursor-pointer">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <FilterPanel />
            </div>
            <div className="p-4 border-t border-[var(--kloset-border)] bg-gray-50">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full btn-luxury-primary justify-center text-xs"
              >
                Show {outfits.length} results
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1440px] mx-auto px-6 py-24">
        <div className="shimmer h-12 w-full rounded-sm mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border border-gray-100 rounded-sm p-4 h-[380px]">
              <div className="shimmer aspect-[3/4] rounded-sm mb-4" />
              <div className="shimmer h-4 w-3/4 rounded-sm mb-2" />
              <div className="shimmer h-3 w-1/2 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    }>
      <DiscoverContent />
    </Suspense>
  );
}
