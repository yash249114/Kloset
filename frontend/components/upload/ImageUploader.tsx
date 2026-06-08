'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Image from 'next/image';
import { uploadImage, validateImageFile, type UploadProgress } from '@/lib/cloudinary';
import {
  Upload,
  X,
  GripVertical,
  ImagePlus,
  AlertCircle,
} from 'lucide-react';

export interface UploadedImage {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  isUploading: boolean;
  progress: number;
  error?: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 6,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList) => {
      const remainingSlots = maxImages - images.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      for (const file of filesToProcess) {
        const validationError = validateImageFile(file);
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

        if (validationError) {
          onImagesChange([
            ...images,
            {
              id: tempId,
              url: '',
              publicId: '',
              isPrimary: images.length === 0,
              isUploading: false,
              progress: 0,
              error: validationError,
            },
          ]);
          continue;
        }

        // Create preview URL immediately
        const previewUrl = URL.createObjectURL(file);
        const newImage: UploadedImage = {
          id: tempId,
          url: previewUrl,
          publicId: '',
          isPrimary: images.length === 0,
          isUploading: true,
          progress: 0,
        };

        const updatedImages = [...images, newImage];
        onImagesChange(updatedImages);

        try {
          const result = await uploadImage(file, (progress: UploadProgress) => {
            onImagesChange(
              updatedImages.map((img) =>
                img.id === tempId
                  ? { ...img, progress: progress.percentage }
                  : img
              )
            );
          });

          onImagesChange(
            updatedImages.map((img) =>
              img.id === tempId
                ? {
                    ...img,
                    url: result.secure_url,
                    publicId: result.public_id,
                    isUploading: false,
                    progress: 100,
                  }
                : img
            )
          );
        } catch {
          onImagesChange(
            updatedImages.map((img) =>
              img.id === tempId
                ? { ...img, isUploading: false, error: 'Upload failed. Try again.' }
                : img
            )
          );
        }
      }
    },
    [images, maxImages, onImagesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const removeImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    // If removed image was primary, make first remaining primary
    if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    onImagesChange(filtered);
  };

  const setPrimary = (id: string) => {
    onImagesChange(
      images.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      }))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono tracking-wider uppercase font-semibold" style={{ color: 'var(--ink-light)' }}>
          Outfit Photos
        </label>
        <span className="text-xs font-mono" style={{ color: 'var(--ink-lighter)' }}>
          {images.length}/{maxImages}
        </span>
      </div>

      {/* Drop Zone */}
      {images.length < maxImages && (
        <motion.div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-2xl p-8 cursor-pointer transition-all duration-300 text-center"
          style={{
            border: `2px dashed ${isDragging ? 'var(--rose)' : 'var(--petal)'}`,
            background: isDragging ? 'var(--bloom)' : 'white',
          }}
          whileHover={{ scale: 1.005, borderColor: 'var(--rose)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, var(--bloom), rgba(201, 169, 110, 0.1))',
              border: '1px solid var(--petal)',
            }}
          >
            {isDragging ? (
              <Upload size={24} style={{ color: 'var(--rose)' }} />
            ) : (
              <ImagePlus size={24} style={{ color: 'var(--rose)' }} />
            )}
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>
            {isDragging ? 'Drop images here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs" style={{ color: 'var(--ink-lighter)' }}>
            JPG, PNG, WebP · Max 10MB · Up to {maxImages} photos
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </motion.div>
      )}

      {/* Image Grid */}
      <AnimatePresence>
        {images.length > 0 && (
          <Reorder.Group
            axis="x"
            values={images}
            onReorder={onImagesChange}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {images.map((image) => (
              <Reorder.Item
                key={image.id}
                value={image}
                className="relative"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden group"
                  style={{
                    border: image.isPrimary
                      ? '2px solid var(--gold)'
                      : '1px solid var(--petal)',
                  }}
                >
                  {image.url && (
                    <Image
                      src={image.url}
                      alt="Outfit photo"
                      fill
                      className="object-cover"
                    />
                  )}

                  {/* Upload progress overlay */}
                  {image.isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                      <div className="loader-floral-circle mb-2" />
                      <span className="text-xs font-mono" style={{ color: 'var(--rose)' }}>
                        {image.progress}%
                      </span>
                    </div>
                  )}

                  {/* Error overlay */}
                  {image.error && (
                    <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-3">
                      <AlertCircle size={20} className="mb-2" style={{ color: 'var(--rose)' }} />
                      <span className="text-xs text-center" style={{ color: 'var(--rose)' }}>
                        {image.error}
                      </span>
                    </div>
                  )}

                  {/* Hover controls */}
                  {!image.isUploading && !image.error && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-start justify-between p-2">
                      {/* Drag handle */}
                      <div className="p-1.5 rounded-lg bg-white/90 cursor-grab active:cursor-grabbing">
                        <GripVertical size={14} style={{ color: 'var(--ink-light)' }} />
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(image.id);
                        }}
                        className="p-1.5 rounded-lg bg-white/90 hover:bg-red-50 transition-colors"
                      >
                        <X size={14} style={{ color: 'var(--rose)' }} />
                      </button>
                    </div>
                  )}

                  {/* Primary badge */}
                  {image.isPrimary && !image.isUploading && (
                    <div className="absolute bottom-2 left-2">
                      <span className="badge badge-gold text-[9px] !py-0.5 !px-2">
                        Primary
                      </span>
                    </div>
                  )}

                  {/* Set as primary button (for non-primary images) */}
                  {!image.isPrimary && !image.isUploading && !image.error && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrimary(image.id);
                      }}
                      className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-lg bg-white/90" style={{ color: 'var(--ink-light)' }}>
                        Set Primary
                      </span>
                    </button>
                  )}
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </AnimatePresence>

      {/* Helper text */}
      {images.length > 0 && images.length < maxImages && (
        <p className="text-[11px] text-center" style={{ color: 'var(--ink-lighter)' }}>
          Drag images to reorder · First image is the cover photo · Add {maxImages - images.length} more
        </p>
      )}
    </div>
  );
}
