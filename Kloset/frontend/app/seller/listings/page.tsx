'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Image as ImageIcon, Send } from 'lucide-react';
import { outfitsAPI } from '@/lib/api';
import type { Outfit, OutfitCategory } from '@/types';
import { toast } from 'sonner';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ImageUploader, { UploadedImage } from '@/components/upload/ImageUploader';

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

export default function SellerListingsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<OutfitCategory>('lehenga');
  const [fabric, setFabric] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M']);
  const [price1Day, setPrice1Day] = useState(1500);
  const [price3Day, setPrice3Day] = useState(3000);
  const [price7Day, setPrice7Day] = useState(5000);
  const [deposit, setDeposit] = useState(4000);
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400001');
  const [delivery, setDelivery] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(200);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const loadOutfits = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const resp = await outfitsAPI.getSellerOutfits(1);
      setOutfits(resp.outfits || []);
    } catch {
      toast.error('Failed to load listed couture designs.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      await loadOutfits();
    }
    init();
  }, []);

  const handleSizeToggle = (sz: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('lehenga');
    setFabric('');
    setSelectedSizes(['M']);
    setPrice1Day(1500);
    setPrice3Day(3000);
    setPrice7Day(5000);
    setDeposit(4000);
    setDelivery(true);
    setDeliveryFee(200);
    setUploadedImages([]);
  };

  const openEditModal = (item: Outfit) => {
    setEditingOutfit(item);
    setTitle(item.title);
    setDescription(item.description || '');
    setCategory(item.category);
    setFabric(item.fabric || '');
    setSelectedSizes(item.sizes || ['M']);
    setPrice1Day(item.price_1day || 1500);
    setPrice3Day(item.price_3day || 3000);
    setPrice7Day(item.price_7day || 5000);
    setDeposit(item.security_deposit || 4000);
    setDelivery(item.delivery_available);
    setDeliveryFee(item.delivery_fee || 200);
    setUploadedImages(item.images?.map((img, idx) => ({ url: img.url, cloudinary_id: img.id, is_primary: img.is_primary, sort_order: img.sort_order ?? idx })) || []);
    setCity(item.city || '');
    setState(item.state || '');
    setIsEditModalOpen(true);
  };

  const handleEditListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOutfit) return;
    setSaving(true);
    try {
      await outfitsAPI.update(editingOutfit.id, {
        title,
        description,
        category,
        fabric,
        sizes: selectedSizes,
        occasions: ['wedding', 'reception'],
        colors: ['Gold', 'Ivory'],
        accessories_included: [] as string[],
        city,
        state,
        pincode,
        price_1day: Number(price1Day),
        price_3day: Number(price3Day),
        price_7day: Number(price7Day),
        security_deposit: Number(deposit),
        delivery_available: delivery,
        delivery_fee: Number(deliveryFee),
        images: uploadedImages.map((img, idx) => ({
          url: img.url,
          cloudinary_id: img.cloudinary_id,
          is_primary: idx === 0,
          sort_order: idx,
        })),
      });
      toast.success('Listing updated successfully!');
      setIsEditModalOpen(false);
      setEditingOutfit(null);
      loadOutfits(true);
    } catch {
      toast.error('Failed to update listing.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !fabric || uploadedImages.length === 0) {
      toast.error('Please complete all form fields and upload at least one image.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title,
        description,
        category,
        fabric,
        sizes: selectedSizes,
        occasions: ['wedding', 'reception'],
        colors: ['Gold', 'Ivory'],
        accessories_included: [] as string[],
        city,
        state,
        pincode,
        price_1day: Number(price1Day),
        price_3day: Number(price3Day),
        price_7day: Number(price7Day),
        security_deposit: Number(deposit),
        delivery_available: delivery,
        delivery_fee: Number(deliveryFee),
        images: uploadedImages.map((img, idx) => ({
          url: img.url,
          cloudinary_id: img.cloudinary_id,
          is_primary: idx === 0,
          sort_order: idx,
        })),
      };

      await outfitsAPI.create(payload);
      toast.success('Couture listing draft created successfully!');
      setIsModalOpen(false);
      resetForm();
      loadOutfits(true);
    } catch {
      toast.error('Failed to register couture listing.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForApproval = async (id: string) => {
    try {
      await outfitsAPI.submitForApproval(id);
      toast.success('Listing submitted for admin quality audit verification.');
      loadOutfits(true);
    } catch {
      toast.error('Failed to submit listing.');
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      await outfitsAPI.delete(id);
      toast.success('Listing deleted.');
      setOutfits((prev) => prev.filter((o) => o.id !== id));
    } catch {
      toast.error('Failed to delete listing.');
    }
  };

  const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className="space-y-8 text-left font-sans select-none text-charcoal"
    >
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-champagne uppercase font-bold block">
            Couture Wardrobe
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-medium text-charcoal mt-1">
            My Listings
          </h1>
        </div>
        <Button 
          variant="gold"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} /> Add Couture Listing
        </Button>
      </div>

      {/* Catalog lists */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="shimmer h-[300px] rounded bg-ivory-dark" />
              <div className="h-4 bg-ivory-dark rounded w-3/4" />
              <div className="h-4 bg-ivory-dark rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : outfits.length === 0 ? (
        <Card hoverEffect={false} padding="lg" className="bg-white border-border text-center space-y-4">
          <ImageIcon size={36} className="text-champagne mx-auto animate-pulse" />
          <h3 className="font-display text-lg font-bold">No registered listings found</h3>
            <p className="text-xs text-charcoal-light leading-relaxed max-w-sm mx-auto font-light">
              You haven&apos;t listed any luxury outfits in your studio yet. Click the button above to add your first design.
            </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfits.map((item, index) => {
            const imgUrl = item.images?.[0]?.url || '/placeholder-outfit.jpg';
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: index * 0.05 }}
              >
                <Card
                  hoverEffect={true}
                  padding="none"
                  className="bg-white border-border text-left flex flex-col justify-between w-full h-full"
                >
                  <div className="h-[260px] relative overflow-hidden bg-ivory-dark">
                    <motion.img 
                      src={imgUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                      whileHover={{ scale: 1.05 }}
                      transition={springTransition}
                    />
                    <span className="absolute top-3 right-3">
                      <Badge variant={
                        item.status === 'active' ? 'sage' :
                        item.status === 'pending_approval' ? 'gold' : 'charcoal'
                      }>
                        {item.status}
                      </Badge>
                    </span>
                  </div>
                  <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-champagne uppercase font-bold tracking-widest block">
                        {item.category}
                      </span>
                      <h4 className="font-display text-sm font-semibold truncate text-charcoal">{item.title}</h4>
                      <span className="text-[9px] font-mono text-charcoal-light block">Daily Rent: ₹{item.price_1day}/day</span>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-border/40 mt-4 flex-wrap">
                      <button
                        onClick={() => openEditModal(item)}
                        className="h-[52px] px-4 border border-border text-champagne hover:bg-champagne/10 hover:border-champagne/30 rounded flex items-center justify-center transition-colors cursor-pointer flex-grow"
                        title="Edit listing"
                      >
                        <Edit2 size={14} />
                      </button>
                      {item.status === 'draft' && (
                        <Button
                          variant="gold"
                          onClick={() => handleSubmitForApproval(item.id)}
                          className="!h-[52px] !px-4 text-[10px] font-mono tracking-wider uppercase flex-grow flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Send size={12} /> Submit Approval
                        </Button>
                      )}
                      <button
                        onClick={() => handleDeleteListing(item.id)}
                        className="h-[52px] px-4 border border-border text-error hover:bg-error/10 hover:border-error/30 rounded flex items-center justify-center transition-colors cursor-pointer flex-grow"
                        title="Delete listing"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Couture Listing"
        size="lg"
      >
        <form onSubmit={handleCreateListing} className="space-y-6 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Outfit Title"
                placeholder="e.g. Sabyasachi Heritage Red Silk Lehenga"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-mono tracking-widest uppercase text-charcoal-light font-bold block mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[100px] p-4 text-sm font-sans bg-warm-white border border-border rounded outline-none focus:border-champagne"
                placeholder="Describe the fabric weight, embroidery work, style guidelines, fitting advice, and accessories included..."
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-mono tracking-widest uppercase text-charcoal-light font-bold block mb-1">
                Outfit Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OutfitCategory)}
                className="w-full h-[52px] px-4 border border-border bg-warm-white rounded outline-none text-xs font-mono uppercase tracking-wider text-charcoal focus:border-champagne"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Fabric Details"
              placeholder="e.g. Pure Silk Velvet, Georgette"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              required
            />
          </div>

          {/* Sizing options */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono tracking-widest text-charcoal-light uppercase font-bold block">
              Available Sizes
            </span>
            <div className="flex gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                const active = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => handleSizeToggle(sz)}
                    className={`
                      w-12 h-12 rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 font-bold border cursor-pointer
                      ${active
                        ? 'bg-charcoal text-white border-charcoal'
                        : 'bg-white border-border text-charcoal-light hover:border-charcoal'
                      }
                    `}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rental durations pricing */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input
              type="number"
              label="Rent 1-Day (₹)"
              value={price1Day}
              onChange={(e) => setPrice1Day(Number(e.target.value))}
              required
            />
            <Input
              type="number"
              label="Rent 3-Day (₹)"
              value={price3Day}
              onChange={(e) => setPrice3Day(Number(e.target.value))}
              required
            />
            <Input
              type="number"
              label="Rent 7-Day (₹)"
              value={price7Day}
              onChange={(e) => setPrice7Day(Number(e.target.value))}
              required
            />
            <Input
              type="number"
              label="Refundable Deposit (₹)"
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              required
            />
          </div>

          {/* Shipping config */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 pt-3">
              <input
                type="checkbox"
                id="delivery-check"
                checked={delivery}
                onChange={(e) => setDelivery(e.target.checked)}
                className="w-4 h-4 border-border rounded outline-none focus:ring-1 focus:ring-champagne"
              />
              <label htmlFor="delivery-check" className="text-xs text-charcoal-light font-light cursor-pointer select-none">
                Provide platform-wide delivery logistics & pickup
              </label>
            </div>
            {delivery && (
              <Input
                type="number"
                label="Delivery Logistics Fee (₹)"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                required
              />
            )}
          </div>

          {/* Location fields */}
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Location City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <Input
              label="Location State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            <Input
              label="Location Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              required
            />
          </div>

          {/* Cloudinary Image uploader integration */}
          <div className="border-t border-border pt-6">
            <ImageUploader
              images={uploadedImages}
              onChange={setUploadedImages}
              maxImages={6}
            />
          </div>

          {/* Submit action */}
          <div className="pt-6 border-t border-border flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gold"
              isLoading={saving}
              className="px-10 cursor-pointer"
            >
              Save Wardrobe Listing
            </Button>
          </div>

        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingOutfit(null); }}
        title="Edit Couture Listing"
        size="lg"
      >
        <form onSubmit={handleEditListing} className="space-y-6 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Outfit Title"
                placeholder="e.g. Sabyasachi Heritage Red Silk Lehenga"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-mono tracking-widest uppercase text-charcoal-light font-bold block mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[100px] p-4 text-sm font-sans bg-warm-white border border-border rounded outline-none focus:border-champagne"
                placeholder="Describe the fabric weight, embroidery work, style guidelines..."
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-mono tracking-widest uppercase text-charcoal-light font-bold block mb-1">
                Outfit Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OutfitCategory)}
                className="w-full h-[52px] px-4 border border-border bg-warm-white rounded outline-none text-xs font-mono uppercase tracking-wider text-charcoal focus:border-champagne"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Fabric Details"
              placeholder="e.g. Pure Silk Velvet, Georgette"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2.5">
            <span className="text-[10px] font-mono tracking-widest text-charcoal-light uppercase font-bold block">
              Available Sizes
            </span>
            <div className="flex gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                const active = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => handleSizeToggle(sz)}
                    className={`w-12 h-12 rounded text-xs font-mono uppercase tracking-wider transition-all duration-300 font-bold border cursor-pointer ${
                      active ? 'bg-charcoal text-white border-charcoal' : 'bg-white border-border text-charcoal-light hover:border-charcoal'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input type="number" label="Rent 1-Day (₹)" value={price1Day} onChange={(e) => setPrice1Day(Number(e.target.value))} required />
            <Input type="number" label="Rent 3-Day (₹)" value={price3Day} onChange={(e) => setPrice3Day(Number(e.target.value))} required />
            <Input type="number" label="Rent 7-Day (₹)" value={price7Day} onChange={(e) => setPrice7Day(Number(e.target.value))} required />
            <Input type="number" label="Refundable Deposit (₹)" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 pt-3">
              <input type="checkbox" id="edit-delivery-check" checked={delivery} onChange={(e) => setDelivery(e.target.checked)}
                className="w-4 h-4 border-border rounded outline-none focus:ring-1 focus:ring-champagne" />
              <label htmlFor="edit-delivery-check" className="text-xs text-charcoal-light font-light cursor-pointer select-none">
                Provide platform-wide delivery
              </label>
            </div>
            {delivery && (
              <Input type="number" label="Delivery Fee (₹)" value={deliveryFee} onChange={(e) => setDeliveryFee(Number(e.target.value))} required />
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} required />
            <Input label="State" value={state} onChange={(e) => setState(e.target.value)} required />
            <Input label="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
          </div>

          <div className="border-t border-border pt-6">
            <ImageUploader images={uploadedImages} onChange={setUploadedImages} maxImages={6} />
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => { setIsEditModalOpen(false); setEditingOutfit(null); }} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" variant="gold" isLoading={saving} className="px-10 cursor-pointer">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      </motion.div>
  );
}
