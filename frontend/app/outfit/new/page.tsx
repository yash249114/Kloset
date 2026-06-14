'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Info, 
  Check, 
  ChevronRight, 
  AlertCircle,
  Truck,
  IndianRupee,
  FileText,
  MapPin,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';
import { outfitsAPI } from '@/lib/api';
import type { OutfitCategory, CreateOutfitPayload } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import ImageUploader from '@/components/upload/ImageUploader';
import type { UploadedImage } from '@/components/upload/ImageUploader';

// Category options with premium labels
const CATEGORIES: { value: OutfitCategory; label: string }[] = [
  { value: 'lehenga', label: 'Bespoke Lehenga' },
  { value: 'saree', label: 'Heritage Saree' },
  { value: 'anarkali', label: 'Royal Anarkali' },
  { value: 'sharara', label: 'Classic Sharara Set' },
  { value: 'gown', label: 'Couture Gown' },
  { value: 'sherwani', label: 'Imperial Sherwani' },
  { value: 'kurta_set', label: 'Premium Kurta Set' },
  { value: 'co_ord', label: 'Luxury Co-Ord' },
  { value: 'western', label: 'Western Atelier' },
  { value: 'other', label: 'Other Fine Wear' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COLORS = [
  { name: 'Royal Gold', hex: '#D4AF37' },
  { name: 'Crimson Red', hex: '#990000' },
  { name: 'Pure Ivory', hex: '#FFFFF0' },
  { name: 'Emerald Green', hex: '#046307' },
  { name: 'Midnight Blue', hex: '#191970' },
  { name: 'Blush Pink', hex: '#FFC0CB' },
  { name: 'Charcoal Black', hex: '#2C2C2C' },
  { name: 'Champagne Gold', hex: '#F0E68C' },
  { name: 'Ruby Wine', hex: '#722F37' },
];

const OCCASIONS = [
  'Wedding Reception',
  'Sangeet / Mehendi',
  'Festive Celebrations',
  'Cocktail Soiree',
  'Editorial Shoot',
  'Gala & Red Carpet',
  'Haldi Ceremony',
];

export default function NewOutfitPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'lehenga' as OutfitCategory,
    fabric: '',
    sizes: [] as string[],
    occasions: [] as string[],
    colors: [] as string[],
    accessories_included: [] as string[],
    city: '',
    state: '',
    pincode: '',
    price_1day: '',
    price_3day: '',
    price_7day: '',
    security_deposit: '',
    delivery_available: true,
    delivery_fee: '',
  });

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [accessoryInput, setAccessoryInput] = useState('');

  // Form Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      else if (formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
      
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.fabric.trim()) newErrors.fabric = 'Fabric details are required';
      if (formData.sizes.length === 0) newErrors.sizes = 'Select at least one size';
    }

    if (currentStep === 2) {
      if (formData.colors.length === 0) newErrors.colors = 'Select at least one color';
      if (formData.occasions.length === 0) newErrors.occasions = 'Select at least one occasion';
    }

    if (currentStep === 3) {
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.pincode.trim()) {
        newErrors.pincode = 'Pincode is required';
      } else if (!/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Pincode must be exactly 6 digits';
      }
      
      if (formData.delivery_available && !formData.delivery_fee) {
        newErrors.delivery_fee = 'Delivery fee is required when shipping is active';
      }
    }

    if (currentStep === 4) {
      if (!formData.price_1day || Number(formData.price_1day) <= 0) {
        newErrors.price_1day = 'Please input a valid 1-day rental price';
      }
      if (!formData.price_3day || Number(formData.price_3day) <= 0) {
        newErrors.price_3day = 'Please input a valid 3-day rental price';
      }
      if (!formData.price_7day || Number(formData.price_7day) <= 0) {
        newErrors.price_7day = 'Please input a valid 7-day rental price';
      }
      if (!formData.security_deposit || Number(formData.security_deposit) < 0) {
        newErrors.security_deposit = 'Please input a valid security deposit';
      }
    }

    if (currentStep === 5) {
      if (images.length === 0) {
        newErrors.images = 'Please upload at least one imagery showing the garment detail.';
      }
      const hasPrimary = images.some(img => img.is_primary);
      if (images.length > 0 && !hasPrimary) {
        newErrors.images = 'Please designate one image as primary.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5));
    } else {
      toast.error('Please resolve validation errors before continuing.');
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleAddAccessory = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessoryInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        accessories_included: [...prev.accessories_included, accessoryInput.trim()],
      }));
      setAccessoryInput('');
    }
  };

  const handleRemoveAccessory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      accessories_included: prev.accessories_included.filter((_, i) => i !== index),
    }));
  };

  const toggleSizeSelection = (size: string) => {
    setFormData((prev) => {
      const isSelected = prev.sizes.includes(size);
      const newSizes = isSelected 
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const toggleOccasionSelection = (occasion: string) => {
    setFormData((prev) => {
      const isSelected = prev.occasions.includes(occasion);
      const newOccasions = isSelected 
        ? prev.occasions.filter((o) => o !== occasion)
        : [...prev.occasions, occasion];
      return { ...prev, occasions: newOccasions };
    });
  };

  const toggleColorSelection = (color: string) => {
    setFormData((prev) => {
      const isSelected = prev.colors.includes(color);
      const newColors = isSelected 
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: newColors };
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      toast.error('Garment validation checks failed. Please review step 5 details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateOutfitPayload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        occasions: formData.occasions,
        colors: formData.colors,
        fabric: formData.fabric,
        sizes: formData.sizes,
        accessories_included: formData.accessories_included,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        price_1day: Number(formData.price_1day),
        price_3day: Number(formData.price_3day),
        price_7day: Number(formData.price_7day),
        security_deposit: Number(formData.security_deposit),
        delivery_available: formData.delivery_available,
        delivery_fee: formData.delivery_available ? Number(formData.delivery_fee) : 0,
        images: images.map((img) => ({
          url: img.url,
          cloudinary_id: img.cloudinary_id,
          is_primary: img.is_primary,
          sort_order: img.sort_order,
        })),
      };

      await outfitsAPI.create(payload);
      toast.success('Listing created successfully! Placed under review queue.');
      router.push('/seller');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to publish couture listing. Check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsDetails = [
    { title: 'Garment Profile', desc: 'Designation & size classification' },
    { title: 'Aesthetic DNA', desc: 'Couture tone, occasions, & accessories' },
    { title: 'Fulfillment & Origin', desc: 'Garment location & courier rules' },
    { title: 'Rental Rates', desc: 'Tiered daily fees & security rules' },
    { title: 'Imagery Verification', desc: 'High-res photos & final review' },
  ];

  return (
    <div className="bg-ivory min-h-screen pt-28 pb-16 font-sans text-charcoal select-none">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Breadcrumb banner */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold text-charcoal-light mb-6">
          <span>Seller Studio</span>
          <ChevronRight size={10} />
          <span className="text-champagne">New Couture Listing</span>
        </div>

        {/* Header Title */}
        <div className="mb-10 text-left">
          <span className="text-xs font-mono tracking-[0.2em] text-champagne uppercase font-bold block mb-1">
            Atelier Studio Upload Wizard
          </span>
          <h1 className="text-3xl font-display font-medium text-charcoal">
            Publish New Garment
          </h1>
          <p className="text-xs text-charcoal-light font-mono mt-1">
            Provide precise details to achieve maximum conversion rates on luxury rental queues.
          </p>
        </div>

        {/* Step Indicator Header */}
        <div className="mb-12 border-b border-border/80 pb-6">
          <div className="grid grid-cols-5 gap-2">
            {stepsDetails.map((sDetail, idx) => {
              const currentStepIdx = idx + 1;
              const isActive = step === currentStepIdx;
              const isCompleted = step > currentStepIdx;

              return (
                <div key={idx} className="text-left relative">
                  <div className="h-1.5 rounded-full overflow-hidden bg-border/40 mb-3 relative">
                    {isCompleted && (
                      <div className="absolute inset-y-0 left-0 bg-success w-full" />
                    )}
                    {isActive && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-champagne"
                      />
                    )}
                  </div>
                  <span className={`text-[10px] font-mono font-bold block ${
                    isActive ? 'text-champagne' : isCompleted ? 'text-success' : 'text-charcoal-light'
                  }`}>
                    0{currentStepIdx}
                  </span>
                  <span className={`text-[10px] font-semibold tracking-wide block truncate mt-0.5 ${
                    isActive ? 'text-charcoal' : 'text-charcoal-light/70'
                  }`}>
                    {sDetail.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <Card hoverEffect={false} padding="lg" className="bg-white border-border shadow-sm mb-8 text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* STEP 1: GARMENT PROFILE */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-border/60 pb-4 mb-6">
                    <h3 className="text-sm font-mono tracking-wider font-bold uppercase text-charcoal flex items-center gap-2">
                      <FileText size={16} className="text-champagne" /> Step 1: Garment Profile
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Garment Title / Model Name"
                      name="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Sabyasachi Crimson Velvet Bridal Lehenga"
                      error={errors.title}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono tracking-widest text-charcoal-light uppercase font-bold block mb-1">
                          Garment Category
                        </label>
                        <select
                          className="w-full h-[52px] px-4 text-xs font-mono font-semibold bg-white border border-border rounded focus:outline-none focus:border-champagne"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as OutfitCategory })}
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Input
                        label="garment fabric / blend"
                        name="fabric"
                        value={formData.fabric}
                        onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                        placeholder="e.g. Banarasi Katan Silk with Zari weave"
                        error={errors.fabric}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono tracking-widest text-charcoal-light uppercase font-bold block mb-1">
                        Garment Description
                      </label>
                      <textarea
                        className="w-full min-h-[120px] p-4 text-xs font-sans bg-white border border-border rounded focus:outline-none focus:border-champagne resize-none leading-relaxed"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Provide deep details regarding stitching limits, heavy embroidery, styling directions, and exact dry clean care rules."
                      />
                      {errors.description && (
                        <span className="text-[10px] font-mono text-error mt-1 block font-bold">{errors.description}</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-charcoal-light uppercase font-bold block mb-2">
                        Size Availability (Select all that fit)
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {SIZES.map((size) => {
                          const isSelected = formData.sizes.includes(size);
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => toggleSizeSelection(size)}
                              className={`h-[52px] min-w-[52px] text-xs font-mono font-bold uppercase rounded border transition-all duration-300 cursor-pointer ${
                                isSelected 
                                  ? 'bg-charcoal border-charcoal text-ivory' 
                                  : 'bg-white border-border hover:border-champagne text-charcoal-light'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                      {errors.sizes && (
                        <span className="text-[10px] font-mono text-error mt-1.5 block font-bold">{errors.sizes}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: AESTHETIC DNA */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-border/60 pb-4 mb-6">
                    <h3 className="text-sm font-mono tracking-wider font-bold uppercase text-charcoal flex items-center gap-2">
                      <Tag size={16} className="text-champagne" /> Step 2: Aesthetic DNA
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-charcoal-light uppercase font-bold block mb-3">
                        Dominant Colors (Select at least 1)
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {COLORS.map((c) => {
                          const isSelected = formData.colors.includes(c.name);
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => toggleColorSelection(c.name)}
                              className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all duration-300 cursor-pointer ${
                                isSelected 
                                  ? 'border-charcoal bg-charcoal/5' 
                                  : 'border-border bg-white hover:border-champagne'
                              }`}
                            >
                              <div 
                                className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0" 
                                style={{ backgroundColor: c.hex }}
                              />
                              <span className="text-[10px] font-mono font-bold truncate text-charcoal">
                                {c.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.colors && (
                        <span className="text-[10px] font-mono text-error mt-2 block font-bold">{errors.colors}</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-charcoal-light uppercase font-bold block mb-3">
                        Target Occasions (Select at least 1)
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {OCCASIONS.map((occasion) => {
                          const isSelected = formData.occasions.includes(occasion);
                          return (
                            <button
                              key={occasion}
                              type="button"
                              onClick={() => toggleOccasionSelection(occasion)}
                              className={`h-[42px] px-5 text-xs font-mono font-semibold uppercase rounded-full border transition-all duration-300 cursor-pointer ${
                                isSelected 
                                  ? 'bg-champagne border-champagne text-white' 
                                  : 'bg-white border-border hover:border-champagne text-charcoal-light'
                              }`}
                            >
                              {occasion}
                            </button>
                          );
                        })}
                      </div>
                      {errors.occasions && (
                        <span className="text-[10px] font-mono text-error mt-2 block font-bold">{errors.occasions}</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-charcoal-light uppercase font-bold block mb-1">
                        Accessories Included
                      </span>
                      <form onSubmit={handleAddAccessory} className="flex gap-3 mb-3">
                        <Input
                          name="accessory"
                          value={accessoryInput}
                          onChange={(e) => setAccessoryInput(e.target.value)}
                          placeholder="e.g. Designer Clutch, Silk Dupatta, Extra Potli"
                          className="flex-1"
                        />
                        <Button
                          type="submit"
                          variant="outline"
                          className="h-[52px] px-6"
                        >
                          Add Item
                        </Button>
                      </form>
                      
                      {formData.accessories_included.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {formData.accessories_included.map((item, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-champagne/30 bg-champagne/5 rounded text-[10px] font-mono font-semibold text-charcoal"
                            >
                              {item}
                              <button 
                                type="button" 
                                onClick={() => handleRemoveAccessory(idx)}
                                className="text-error hover:text-red-700 cursor-pointer"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] font-mono text-charcoal-light/60 font-light flex items-center gap-1">
                          <Info size={11} /> No accessory attachments listed.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: FULFILLMENT & ORIGIN */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-border/60 pb-4 mb-6">
                    <h3 className="text-sm font-mono tracking-wider font-bold uppercase text-charcoal flex items-center gap-2">
                      <MapPin size={16} className="text-champagne" /> Step 3: Fulfillment & Origin
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label="garment origin city"
                        name="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. New Delhi"
                        error={errors.city}
                        required
                      />

                      <Input
                        label="garment origin state"
                        name="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="e.g. Delhi NCR"
                        error={errors.state}
                        required
                      />

                      <Input
                        label="Garment Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="e.g. 110001"
                        error={errors.pincode}
                        required
                      />
                    </div>

                    <div className="border border-border rounded-lg p-5 bg-[#FAF9F6] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2.5 items-start">
                          <Truck size={18} className="text-champagne mt-0.5" />
                          <div>
                            <h4 className="text-xs font-mono font-bold text-charcoal uppercase">Active Courier Shipping</h4>
                            <p className="text-[10px] text-charcoal-light/80 mt-0.5 leading-normal font-light">
                              Allow shipping of this garment across the logistics networks supported in the platform.
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-champagne border-border rounded cursor-pointer"
                          checked={formData.delivery_available}
                          onChange={(e) => setFormData({ ...formData, delivery_available: e.target.checked })}
                        />
                      </div>

                      {formData.delivery_available && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-4 border-t border-border/60"
                        >
                          <Input
                            label="Out-of-pocket Flat Shipping Fee (₹)"
                            name="delivery_fee"
                            type="number"
                            value={formData.delivery_fee}
                            onChange={(e) => setFormData({ ...formData, delivery_fee: e.target.value })}
                            placeholder="e.g. 250"
                            error={errors.delivery_fee}
                            required
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: RENTAL RATES */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-border/60 pb-4 mb-6">
                    <h3 className="text-sm font-mono tracking-wider font-bold uppercase text-charcoal flex items-center gap-2">
                      <IndianRupee size={16} className="text-champagne" /> Step 4: Rental Rates
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-mono text-charcoal-light leading-relaxed mb-4">
                      <AlertCircle size={12} className="inline text-champagne mr-1" />
                      Renters choose rental intervals. Provide rates inclusive of professional post-wear dry cleaning.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label="1-day Rental Price (₹)"
                        name="price_1day"
                        type="number"
                        value={formData.price_1day}
                        onChange={(e) => setFormData({ ...formData, price_1day: e.target.value })}
                        placeholder="e.g. 2500"
                        error={errors.price_1day}
                        required
                      />

                      <Input
                        label="3-day Rental Price (₹)"
                        name="price_3day"
                        type="number"
                        value={formData.price_3day}
                        onChange={(e) => setFormData({ ...formData, price_3day: e.target.value })}
                        placeholder="e.g. 6000"
                        error={errors.price_3day}
                        required
                      />

                      <Input
                        label="7-day Rental Price (₹)"
                        name="price_7day"
                        type="number"
                        value={formData.price_7day}
                        onChange={(e) => setFormData({ ...formData, price_7day: e.target.value })}
                        placeholder="e.g. 10000"
                        error={errors.price_7day}
                        required
                      />
                    </div>

                    <Input
                      label="Refundable Security Deposit (₹)"
                      name="security_deposit"
                      type="number"
                      value={formData.security_deposit}
                      onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })}
                      placeholder="e.g. 5000"
                      error={errors.security_deposit}
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: IMAGERY VERIFICATION & REVIEW */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="border-b border-border/60 pb-4 mb-6">
                    <h3 className="text-sm font-mono tracking-wider font-bold uppercase text-charcoal flex items-center gap-2">
                      <Sparkles size={16} className="text-champagne" /> Step 5: Couture Verification
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {/* Cloudinary Image Uploader */}
                    <div>
                      <ImageUploader
                        images={images}
                        onChange={setImages}
                        maxImages={6}
                      />
                      {errors.images && (
                        <span className="text-[10px] font-mono text-error mt-2 block font-bold">{errors.images}</span>
                      )}
                    </div>

                    {/* Preview Summary Listing */}
                    <div className="border border-border/60 rounded-lg p-5 bg-[#FAF9F6]">
                      <h4 className="text-[10px] font-mono font-bold text-charcoal uppercase tracking-widest mb-4">
                        Listing Summary Review
                      </h4>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                        <div>
                          <span className="text-[9px] font-mono text-charcoal-light uppercase block font-medium">Title</span>
                          <span className="font-semibold text-charcoal block mt-0.5 truncate">{formData.title || 'Untitled'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-charcoal-light uppercase block font-medium">Category</span>
                          <span className="font-semibold text-charcoal block mt-0.5 capitalize">{formData.category}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-charcoal-light uppercase block font-medium">Rates (1 / 3 / 7 Days)</span>
                          <span className="font-mono font-bold text-charcoal block mt-0.5">
                            ₹{formData.price_1day || '0'} / ₹{formData.price_3day || '0'} / ₹{formData.price_7day || '0'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-charcoal-light uppercase block font-medium">Security Deposit</span>
                          <span className="font-mono font-bold text-charcoal block mt-0.5">₹{formData.security_deposit || '0'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-charcoal-light uppercase block font-medium">Sizes Available</span>
                          <span className="font-semibold text-charcoal block mt-0.5 uppercase">
                            {formData.sizes.join(', ') || 'None selected'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-charcoal-light uppercase block font-medium">garment location</span>
                          <span className="font-semibold text-charcoal block mt-0.5 truncate">
                            {formData.city ? `${formData.city}, ${formData.state} - ${formData.pincode}` : 'No origin set'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action buttons footer inside Card */}
          <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
              className="px-6 h-[52px]"
            >
              <ArrowLeft size={14} className="mr-2" /> Back
            </Button>

            {step < 5 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                className="px-6 h-[52px]"
              >
                Next Step <ArrowRight size={14} className="ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="gold"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                className="px-8 h-[52px]"
              >
                <Check size={14} className="mr-2" /> Publish Couture Listing
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
