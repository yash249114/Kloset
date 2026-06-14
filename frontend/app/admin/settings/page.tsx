'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [takeRate, setTakeRate] = useState(5);
  const [taxRate, setTaxRate] = useState(8);
  const [cleaningFee, setCleaningFee] = useState(500);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate settings persist delay
    setTimeout(() => {
      setSaving(false);
      toast.success('Platform configurations saved successfully.');
    }, 1200);
  };

  return (
    <div className="space-y-8 text-left select-none bg-admin-bg min-h-screen text-[#E8E8E8] font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A96E] uppercase font-bold block">
          Operational Hub
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-medium text-[#E8E8E8] mt-1">
          Settings
        </h1>
      </div>

      {/* Forms */}
      <Card hoverEffect={false} padding="md" theme="admin" className="max-w-2xl">
        <h3 className="font-display text-base font-semibold mb-6 pb-3 border-b border-[#2A2A2A]">
          Platform Configurations
        </h3>
        <form onSubmit={handleSave} className="space-y-6 text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono tracking-widest uppercase text-charcoal-light font-bold block mb-1">
                Platform Take-Rate commission (%)
              </label>
              <input
                type="number"
                value={takeRate}
                onChange={(e) => setTakeRate(Number(e.target.value))}
                className="w-full h-[52px] px-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#E8E8E8] text-sm outline-none focus:border-[#C9A96E]"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-mono tracking-widest uppercase text-charcoal-light font-bold block mb-1">
                GST / Tax Rate (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full h-[52px] px-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#E8E8E8] text-sm outline-none focus:border-[#C9A96E]"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-mono tracking-widest uppercase text-charcoal-light font-bold block mb-1">
                Standard Dry-cleaning Base Cost (₹)
              </label>
              <input
                type="number"
                value={cleaningFee}
                onChange={(e) => setCleaningFee(Number(e.target.value))}
                className="w-full h-[52px] px-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#E8E8E8] text-sm outline-none focus:border-[#C9A96E]"
                required
              />
            </div>
          </div>

          <div className="pt-6 border-t border-[#2A2A2A] text-right">
            <Button
              type="submit"
              variant="gold"
              isLoading={saving}
              className="px-10 cursor-pointer"
            >
              Save Configurations
            </Button>
          </div>

        </form>
      </Card>

    </div>
  );
}
