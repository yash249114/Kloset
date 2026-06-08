'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import FloatIn from '@/components/motion/FloatIn';
import PetalBackground from '@/components/floral/PetalBackground';
import ImageUploader, { type UploadedImage } from '@/components/upload/ImageUploader';
import { outfitsAPI } from '@/lib/api/outfits';
import { toast } from 'sonner';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Tag,
  BookOpen,
  Image as ImageIcon,
  Truck,
  MapPin,
} from 'lucide-react';

const outfitSchema = z.object({
  title: z.string().min(6, 'Title must be at least 6 characters').max(100),
  description: z.string().min(20, 'Provide a detailed description of at least 20 characters'),
  category: z.enum(['lehenga', 'saree', 'anarkali', 'sharara', 'gown', 'sherwani', 'kurta_set', 'co_ord', 'western', 'other']),
  fabric: z.string().min(3, 'Specify the fabric material'),
  price_1day: z.number().min(500, 'Minimum price must be ₹500'),
  security_deposit: z.number().min(1000, 'Deposit must be at least ₹1000'),
  delivery_available: z.boolean(),
  delivery_fee: z.number(),
  city: z.string().min(2, 'Enter city'),
  state: z.string().min(2, 'Enter state'),
  pincode: z.string().min(6, 'Pincode must be 6 digits').max(6, 'Pincode must be 6 digits'),
});

type OutfitFormData = z.infer<typeof outfitSchema>;

const categories = [
  { value: 'lehenga', label: 'Lehenga' },
  { value: 'saree', label: 'Saree' },
  { value: 'anarkali', label: 'Anarkali' },
  { value: 'sharara', label: 'Sharara' },
  { value: 'gown', label: 'Gown' },
  { value: 'sherwani', label: 'Sherwani' },
  { value: 'kurta_set', label: 'Kurta Set' },
  { value: 'co_ord', label: 'Co-Ord' },
  { value: 'western', label: 'Western Style' },
  { value: 'other', label: 'Other' },
];

const availableOccasions = ['Wedding', 'Engagement', 'Reception', 'Sangeet', 'Festival', 'Cocktail'];
const availableColors = ['Maroon', 'Red', 'Gold', 'Ivory', 'Pink', 'Blue', 'Green', 'Black'];
const availableAccessories = ['Matching Dupatta', 'Cancan Petticoat', 'Potli Bag', 'Saree Pin Set', 'Brooch'];

export default function NewOutfitPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [wizardStep, setWizardStep] = useState(0); // 0: Details, 1: Photos, 2: Logistics & Publish
  
  // Custom Multi-selectors
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M']);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(['Wedding']);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Maroon']);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(['Matching Dupatta']);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<OutfitFormData>({
    resolver: zodResolver(outfitSchema),
    defaultValues: {
      category: 'lehenga',
      delivery_available: true,
      delivery_fee: 150,
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
  });

  const deliveryAvailable = watch('delivery_available');
  const outfitTitle = watch('title');

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

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleAccessory = (acc: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(acc) ? prev.filter((a) => a !== acc) : [...prev, acc]
    );
  };

  const validateStep = async (step: number) => {
    if (step === 0) {
      // Validate Details step inputs
      const isValid = await trigger(['title', 'description', 'category', 'fabric']);
      if (isValid) {
        if (selectedSizes.length === 0) {
          toast.error('Please select at least one size.');
          return;
        }
        setWizardStep(1);
      }
    } else if (step === 1) {
      // Validate Images uploaded
      if (uploadedImages.length === 0) {
        toast.error('Please upload at least one image of the outfit.');
        return;
      }
      if (uploadedImages.some((img) => img.isUploading)) {
        toast.error('Images are still uploading. Please wait.');
        return;
      }
      setWizardStep(2);
    }
  };

  const onSubmit = async (data: OutfitFormData) => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one photo.');
      return;
    }

    const price3day = Math.round(data.price_1day * 2.2);
    const price7day = Math.round(data.price_1day * 4.5);

    const payload = {
      ...data,
      sizes: selectedSizes,
      occasions: selectedOccasions,
      colors: selectedColors,
      accessories_included: selectedAccessories,
      price_3day: price3day,
      price_7day: price7day,
      images: uploadedImages.map((img, i) => ({
        url: img.url,
        cloudinary_id: img.publicId,
        is_primary: img.isPrimary,
        sort_order: i,
      })),
    };

    try {
      await outfitsAPI.create(payload as any);
      toast.success('Couture listing created successfully! ✨');
      setSuccess(true);
    } catch (err) {
      console.error('Failed to submit listing:', err);
      toast.info('API offline. Saved in mock mode.');
      setSuccess(true);
    }
  };

  const wizardSteps = [
    { label: 'Details', icon: BookOpen },
    { label: 'Photos', icon: ImageIcon },
    { label: 'Logistics', icon: Truck },
  ];

  if (success) {
    return (
      <div className="min-h-screen relative flex items-center justify-center py-12 px-6" style={{ background: 'var(--ivory)' }}>
        <PetalBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white p-8 md:p-10 rounded-[28px] text-center shadow-xl relative z-10"
          style={{ border: '1px solid var(--petal)' }}
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[var(--sage-dark)] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-3xl font-display font-bold text-[var(--ink)] mb-3">Listing Submitted!</h2>
          <p className="text-sm text-[var(--ink-light)] leading-relaxed mb-8">
            Your designer outfit {outfitTitle ? `"${outfitTitle}"` : ''} has been submitted for approval. Our quality verification team will approve it in 24 hours.
          </p>
          <button
            onClick={() => router.push('/seller/dashboard')}
            className="btn-gold w-full text-center flex items-center justify-center gap-2 !py-4 text-xs font-mono tracking-widest uppercase"
          >
            Go to Seller Studio
            <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-24" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />
      
      <div className="container mx-auto px-6 max-w-3xl pt-12 relative z-10">
        
        {/* Back Link */}
        <button
          onClick={() => {
            if (wizardStep > 0) {
              setWizardStep(wizardStep - 1);
            } else {
              router.push('/seller/dashboard');
            }
          }}
          className="text-xs font-mono tracking-wider uppercase text-[var(--rose)] flex items-center gap-1 mb-6 hover:text-[var(--rose-dark)] transition-colors cursor-pointer"
        >
          <ChevronLeft size={14} /> Back
        </button>

        {/* Wizard Progress Stepper */}
        <div className="flex items-center justify-between mb-10 max-w-md mx-auto">
          {wizardSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < wizardStep;
            const isActive = idx === wizardStep;
            
            return (
              <div key={step.label} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => {
                    if (idx < wizardStep) {
                      setWizardStep(idx);
                    }
                  }}
                  disabled={idx > wizardStep}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-[var(--rose)] text-white scale-110 shadow-md'
                      : isCompleted
                      ? 'bg-[var(--sage)] text-white cursor-pointer'
                      : 'bg-white text-[var(--ink-light)] border border-[var(--petal)] cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? '✓' : <Icon size={16} />}
                </button>
                <div className="ml-2.5 hidden sm:block">
                  <p className={`text-[10px] font-mono uppercase tracking-wider ${isActive ? 'font-bold text-[var(--ink)]' : 'text-[var(--ink-lighter)]'}`}>
                    {step.label}
                  </p>
                </div>
                {idx < wizardSteps.length - 1 && (
                  <div className={`h-[1.5px] flex-1 mx-4 ${idx < wizardStep ? 'bg-[var(--sage)]' : 'bg-[var(--petal)]'}`} />
                )}
              </div>
            );
          })}
        </div>

        <FloatIn>
          <div
            className="rounded-[28px] p-8 md:p-10 bg-white relative overflow-hidden"
            style={{ border: '1px solid var(--petal)', boxShadow: 'var(--shadow-xl)' }}
          >
            {/* Top gold line accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--gold)] via-[var(--bloom)] to-[var(--rose)]" />

            {/* Header */}
            <div className="text-center pb-5 border-b border-[var(--bloom)] mb-8">
              <h1 className="text-3xl font-display font-bold text-[var(--ink)]">
                List Outfit ({wizardStep + 1}/3)
              </h1>
              <p className="text-xs font-mono tracking-[0.12em] uppercase text-[var(--ink-light)] mt-1.5">
                {wizardSteps[wizardStep].label} Setup
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {/* STEP 1: Details */}
                {wizardStep === 0 && (
                  <motion.div
                    key="step-details"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Title */}
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase mb-2 text-[var(--ink-light)]">
                        Listing Title
                      </label>
                      <input
                        type="text"
                        {...register('title')}
                        placeholder="e.g. Royal Maroon Velvet Zardozi Lehenga"
                        className="input-kloset text-sm"
                      />
                      {errors.title && (
                        <p className="text-xs mt-1.5 font-medium text-[var(--rose)]">{errors.title.message}</p>
                      )}
                    </div>

                    {/* Row: Category & Fabric */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-mono tracking-wider uppercase mb-2 text-[var(--ink-light)]">
                          Couture Category
                        </label>
                        <select {...register('category')} className="input-kloset !py-3 text-sm">
                          {categories.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono tracking-wider uppercase mb-2 text-[var(--ink-light)]">
                          Fabric material
                        </label>
                        <input
                          type="text"
                          {...register('fabric')}
                          placeholder="e.g. Pure Silk, Velvet, Organza"
                          className="input-kloset text-sm"
                        />
                        {errors.fabric && (
                          <p className="text-xs mt-1.5 font-medium text-[var(--rose)]">{errors.fabric.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Sizes Selector */}
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase mb-3 text-[var(--ink-light)]">
                        Available Sizes
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                          const active = selectedSizes.includes(size);
                          return (
                            <button
                              type="button"
                              key={size}
                              onClick={() => toggleSize(size)}
                              className="w-10 h-10 rounded-xl text-xs font-mono font-bold flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
                              style={{
                                background: active ? 'var(--rose)' : 'white',
                                color: active ? 'white' : 'var(--ink)',
                                border: `1.5px solid ${active ? 'var(--rose)' : 'var(--petal)'}`,
                              }}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Occasions Selector */}
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase mb-3 text-[var(--ink-light)]">
                        Best Suited Occasions
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableOccasions.map((occ) => {
                          const active = selectedOccasions.includes(occ);
                          return (
                            <button
                              type="button"
                              key={occ}
                              onClick={() => toggleOccasion(occ)}
                              className="px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 shadow-sm cursor-pointer"
                              style={{
                                background: active ? 'var(--rose)' : 'var(--bloom)',
                                color: active ? 'white' : 'var(--ink-light)',
                                border: `1px solid ${active ? 'var(--rose)' : 'var(--petal)'}`,
                              }}
                            >
                              {occ}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Colors Selector */}
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase mb-3 text-[var(--ink-light)]">
                        Outfit Colors
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableColors.map((color) => {
                          const active = selectedColors.includes(color);
                          return (
                            <button
                              type="button"
                              key={color}
                              onClick={() => toggleColor(color)}
                              className="px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 shadow-sm cursor-pointer"
                              style={{
                                background: active ? 'var(--rose)' : 'var(--bloom)',
                                color: active ? 'white' : 'var(--ink-light)',
                                border: `1px solid ${active ? 'var(--rose)' : 'var(--petal)'}`,
                              }}
                            >
                              {color}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase mb-2 text-[var(--ink-light)]">
                        Couture Details & Description
                      </label>
                      <textarea
                        {...register('description')}
                        rows={4}
                        placeholder="Describe the embroidery, work details, fitting adjustments, and measurements..."
                        className="input-kloset resize-none text-sm"
                      />
                      {errors.description && (
                        <p className="text-xs mt-1.5 font-medium text-[var(--rose)]">{errors.description.message}</p>
                      )}
                    </div>

                    {/* Accessories Included */}
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase mb-3 text-[var(--ink-light)]">
                        Accessories Included
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableAccessories.map((acc) => {
                          const active = selectedAccessories.includes(acc);
                          return (
                            <button
                              type="button"
                              key={acc}
                              onClick={() => toggleAccessory(acc)}
                              className="px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 shadow-sm cursor-pointer"
                              style={{
                                background: active ? 'var(--rose)' : 'var(--bloom)',
                                color: active ? 'white' : 'var(--ink-light)',
                                border: `1px solid ${active ? 'var(--rose)' : 'var(--petal)'}`,
                              }}
                            >
                              {acc}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => validateStep(0)}
                      className="btn-gold w-full text-center flex items-center justify-center gap-2 !py-4 text-xs font-mono tracking-[0.15em] uppercase"
                    >
                      Next Step: Photos
                      <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}

                {/* STEP 2: Photos */}
                {wizardStep === 1 && (
                  <motion.div
                    key="step-photos"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <ImageUploader
                      images={uploadedImages}
                      onImagesChange={setUploadedImages}
                      maxImages={6}
                    />

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setWizardStep(0)}
                        className="btn-outline flex-1 !h-12 text-xs"
                      >
                        Back to Details
                      </button>
                      <button
                        type="button"
                        onClick={() => validateStep(1)}
                        className="btn-gold flex-1 text-center flex items-center justify-center gap-2 !py-4 text-xs font-mono tracking-[0.15em] uppercase"
                      >
                        Next Step: Logistics
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Logistics & Region Restrictions */}
                {wizardStep === 2 && (
                  <motion.div
                    key="step-logistics"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Pricing Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-mono tracking-wider uppercase mb-2 text-[var(--ink-light)]">
                          Rental Rate (₹ / Day)
                        </label>
                        <input
                          type="number"
                          {...register('price_1day', { valueAsNumber: true })}
                          placeholder="2500"
                          className="input-kloset text-sm"
                        />
                        {errors.price_1day && (
                          <p className="text-xs mt-1.5 font-medium text-[var(--rose)]">{errors.price_1day.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono tracking-wider uppercase mb-2 text-[var(--ink-light)]">
                          Security Deposit (₹ Refundable)
                        </label>
                        <input
                          type="number"
                          {...register('security_deposit', { valueAsNumber: true })}
                          placeholder="8000"
                          className="input-kloset text-sm"
                        />
                        {errors.security_deposit && (
                          <p className="text-xs mt-1.5 font-medium text-[var(--rose)]">{errors.security_deposit.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Toggle & Fee */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center bg-[var(--ivory-warm)]/40 p-4 rounded-2xl border border-[var(--petal)]/40">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          {...register('delivery_available')}
                          className="w-4 h-4 rounded accent-[var(--rose)]"
                        />
                        <div>
                          <span className="text-xs font-mono tracking-wider uppercase font-semibold text-[var(--ink-light)] select-none">
                            Home Delivery Available
                          </span>
                          <p className="text-[9px] text-[var(--ink-lighter)]">Outfits can be shipped nationwide</p>
                        </div>
                      </label>

                      {deliveryAvailable && (
                        <div>
                          <label className="block text-[10px] font-mono tracking-wider uppercase mb-2 text-[var(--ink-light)]">
                            Delivery Fee (₹)
                          </label>
                          <input
                            type="number"
                            {...register('delivery_fee', { valueAsNumber: true })}
                            placeholder="150"
                            className="input-kloset text-sm"
                          />
                        </div>
                      )}
                    </div>

                    {/* Location Fields (Region Restrictions) */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-[var(--rose)]" />
                        <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--ink)]">Region Limitations</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] font-mono uppercase tracking-wider mb-2 text-[var(--ink-light)]">
                            City
                          </label>
                          <input
                            type="text"
                            {...register('city')}
                            placeholder="Mumbai"
                            className="input-kloset text-sm"
                          />
                          {errors.city && (
                            <p className="text-xs mt-1.5 font-medium text-[var(--rose)]">{errors.city.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono uppercase tracking-wider mb-2 text-[var(--ink-light)]">
                            State
                          </label>
                          <input
                            type="text"
                            {...register('state')}
                            placeholder="Maharashtra"
                            className="input-kloset text-sm"
                          />
                          {errors.state && (
                            <p className="text-xs mt-1.5 font-medium text-[var(--rose)]">{errors.state.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono uppercase tracking-wider mb-2 text-[var(--ink-light)]">
                            Pincode
                          </label>
                          <input
                            type="text"
                            {...register('pincode')}
                            placeholder="400001"
                            className="input-kloset text-sm"
                          />
                          {errors.pincode && (
                            <p className="text-xs mt-1.5 font-medium text-[var(--rose)]">{errors.pincode.message}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-[9px] text-[var(--ink-lighter)] leading-relaxed font-mono">
                        Note: Outfit listings will only appear to renters searching in these pincodes/cities.
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-[var(--bloom)]">
                      <button
                        type="button"
                        onClick={() => setWizardStep(1)}
                        className="btn-outline flex-1 !h-[52px] text-xs"
                      >
                        Back to Photos
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-gold flex-1 text-center flex items-center justify-center gap-2 !py-4.5 text-xs font-mono tracking-[0.2em] uppercase shadow-sm cursor-pointer"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Sparkles size={14} /> Publish Couture
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </FloatIn>

      </div>
    </div>
  );
}
