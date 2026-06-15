'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

export interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  is_primary?: boolean;
}

export interface PremiumImageGalleryProps {
  images: GalleryImage[];
  className?: string;
  aspectRatio?: string;
  showThumbnails?: boolean;
  enableFullscreen?: boolean;
}

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

export default function PremiumImageGallery({
  images,
  className = '',
  aspectRatio = '4/5',
  showThumbnails = true,
  enableFullscreen = true,
}: PremiumImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images.length) {
    return (
      <div className={`aspect-[${aspectRatio}] rounded-xl bg-ivory-dark border border-border/40 flex items-center justify-center ${className}`}>
        <span className="text-[10px] font-mono text-charcoal-light/40">No images available</span>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setIsFullscreen(false);
  };

  return (
    <div className={className} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main Image */}
      <motion.div
        className={`relative aspect-[${aspectRatio}] rounded-xl overflow-hidden bg-ivory-dark border border-border/40 group cursor-zoom-in`}
        whileHover={{ scale: 1.01 }}
        transition={springTransition}
        onClick={enableFullscreen ? () => setIsFullscreen(true) : undefined}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={springTransition}
            src={currentImage.url}
            alt={currentImage.alt || 'Gallery image'}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={springTransition}
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-border/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-charcoal" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={springTransition}
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-border/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-charcoal" />
            </motion.button>
          </>
        )}

        {enableFullscreen && (
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-border/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <Expand size={16} className="text-charcoal" />
          </div>
        )}
      </motion.div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <motion.button
              key={img.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={springTransition}
              onClick={() => setSelectedIndex(idx)}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 cursor-pointer transition-all duration-300 ${
                idx === selectedIndex
                  ? 'border-champagne ring-2 ring-champagne/20'
                  : 'border-border hover:border-champagne/50'
              }`}
              aria-label={`View image ${idx + 1}`}
              aria-current={idx === selectedIndex ? 'true' : 'false'}
            >
              <Image src={img.url} alt="" width={80} height={80} unoptimized className="w-full h-full object-cover" />
            </motion.button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-charcoal/95 z-[100] flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={springTransition}
              className="relative max-w-6xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute -top-14 right-0 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                aria-label="Close fullscreen"
              >
                <X size={20} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={springTransition}
                  src={currentImage.url}
                  alt={currentImage.alt || 'Gallery image'}
                  className="max-h-[80vh] w-auto mx-auto object-contain"
                />
              </AnimatePresence>

              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>

              {/* Thumbnail strip in fullscreen */}
              <div className="flex gap-2 mt-4 justify-center overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(idx); }}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 cursor-pointer transition-all ${
                      idx === selectedIndex
                        ? 'border-champagne ring-2 ring-champagne/30'
                        : 'border-white/20 hover:border-champagne/50'
                    }`}
                  >
                    <Image src={img.url} alt="" width={400} height={533} unoptimized className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}