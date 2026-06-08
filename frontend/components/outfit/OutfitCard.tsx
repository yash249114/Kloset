'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import type { Outfit } from '@/types';

interface OutfitCardProps {
  outfit: Outfit;
  onWishlistToggle?: (outfitId: string, isWishlisted: boolean) => void;
}

export default function OutfitCard({ outfit, onWishlistToggle }: OutfitCardProps) {
  const [wishlisted, setWishlisted] = useState(outfit.is_wishlisted);
  const [imgLoaded, setImgLoaded] = useState(false);

  const img = outfit.images.find((i) => i.is_primary) || outfit.images[0];
  const src = img?.url || '/placeholder-outfit.jpg';

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
    onWishlistToggle?.(outfit.id, !wishlisted);
  };

  return (
    <div className="group relative flex flex-col justify-between h-full bg-white transition-all duration-300">
      <Link href={`/outfit/${outfit.id}`} className="flex flex-col flex-grow">
        
        {/* Image wrapper with soft aspect ratio and clean hover scale */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#faf9f6] mb-3">
          {!imgLoaded && <div className="absolute inset-0 shimmer animate-pulse" />}
          <Image
            src={src}
            alt={outfit.title}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onLoad={() => setImgLoaded(true)}
          />

          {/* Availability Badge */}
          {outfit.status !== 'active' ? (
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm px-2.5 py-1 text-[8px] font-mono tracking-widest text-white uppercase rounded-sm z-10">
              {outfit.status.replace('_', ' ')}
            </div>
          ) : (
            <div className="absolute top-3 left-3 bg-emerald-700/80 backdrop-blur-sm px-2.5 py-1 text-[8px] font-mono tracking-widest text-white uppercase rounded-sm z-10">
              Available
            </div>
          )}

          {/* Wishlist Heart Icon */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/85 border border-gray-150 hover:bg-white shadow-sm transition-all duration-300 z-10 cursor-pointer"
          >
            <Heart
              size={13}
              fill={wishlisted ? 'var(--kloset-gold)' : 'none'}
              stroke={wishlisted ? 'var(--kloset-gold)' : '#7a7570'}
              className="transition-colors duration-200"
            />
          </button>
        </div>

        {/* Title / Name */}
        <h3 className="font-display text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-[var(--kloset-gold)] transition-colors leading-tight mb-1 px-1">
          {outfit.title}
        </h3>

        {/* Dynamic metadata: rating & price */}
        <div className="flex items-center justify-between mt-1 px-1">
          
          {/* Price */}
          <div className="flex items-baseline text-gray-950">
            <span className="text-[10px] font-medium mr-0.5">₹</span>
            <span className="text-sm font-bold">
              {(outfit.price_1day || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-gray-400 ml-0.5 font-normal uppercase tracking-wider">/ day</span>
          </div>

          {/* Rating */}
          {outfit.rating_avg > 0 && (
            <div className="flex items-center gap-0.5 text-[10px] font-semibold text-gray-700 bg-gray-50 border border-gray-150 px-1.5 py-0.5 rounded-sm">
              <span className="text-[var(--kloset-gold)]">★</span>
              <span>{outfit.rating_avg.toFixed(1)}</span>
            </div>
          )}

        </div>

      </Link>
    </div>
  );
}
