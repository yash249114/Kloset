'use client';

import { Printer, Calendar, Shield, CreditCard, Sparkles } from 'lucide-react';
import { calculateRentalDays } from '@/stores/cart.store';

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  renterName: string;
  renterEmail: string;
  shippingAddress?: {
    full_address: string;
    city: string;
    state: string;
    pincode: string;
  } | null;
  items: Array<{
    id: string | number;
    title: string;
    price: number;
    deposit: number;
    size: string;
    startDate: string;
    endDate: string;
    quantity: number;
    sellerName?: string;
  }>;
  subtotal: number;
  securityDeposit: number;
  platformFee: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
}

interface InvoiceViewerProps {
  invoice: InvoiceData;
  onClose?: () => void;
}

export default function InvoiceViewer({ invoice, onClose }: InvoiceViewerProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-3xl mx-auto shadow-xl border border-[var(--petal)] print:border-none print:shadow-none print:p-0 print:m-0">
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[var(--petal)] pb-6 mb-6 print:border-zinc-300">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-display font-bold tracking-wide text-[var(--rose)] print:text-zinc-800">
              Kloset
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase opacity-60 text-[var(--ink-light)] border-l border-[var(--petal)] pl-2">
              Invoice
            </span>
          </div>
          <p className="text-xs text-[var(--ink-light)]">Premium Fashion Rentals & Marketplace</p>
        </div>
        <div className="mt-4 md:mt-0 text-right md:text-right flex flex-col items-start md:items-end">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--ink-lighter)]">
            Invoice Number
          </span>
          <span className="font-mono text-base font-bold text-[var(--ink)]">{invoice.invoiceNumber}</span>
          <span className="text-xs text-[var(--ink-light)] mt-0.5">Date: {invoice.date}</span>
        </div>
      </div>

      {/* Renter & Ship-To Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-lighter)] mb-2">
            Renter Details
          </h4>
          <p className="font-semibold text-[var(--ink)]">{invoice.renterName}</p>
          <p className="text-xs text-[var(--ink-light)]">{invoice.renterEmail}</p>
        </div>
        
        {invoice.shippingAddress ? (
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-lighter)] mb-2">
              Delivery Destination
            </h4>
            <p className="text-[var(--ink)] font-medium">
              {invoice.shippingAddress.full_address}
            </p>
            <p className="text-xs text-[var(--ink-light)]">
              {invoice.shippingAddress.city}, {invoice.shippingAddress.state} - {invoice.shippingAddress.pincode}
            </p>
          </div>
        ) : (
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-lighter)] mb-2">
              Fulfillment Type
            </h4>
            <p className="font-semibold text-[var(--sage-dark)]">Self Pickup</p>
            <p className="text-xs text-[var(--ink-light)]">Pick up from Kloset Partner Hub</p>
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--petal)] text-[10px] font-mono uppercase tracking-wider text-[var(--ink-lighter)] print:border-zinc-300">
              <th className="pb-3 pl-2">Outfit Item</th>
              <th className="pb-3 text-center">Size</th>
              <th className="pb-3 text-center">Duration</th>
              <th className="pb-3 text-right">Rent/Day</th>
              <th className="pb-3 text-right pr-2">Total Rent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-xs">
            {invoice.items.map((item, index) => {
              const days = calculateRentalDays(item.startDate, item.endDate);
              return (
                <tr key={`${item.id}-${index}`} className="hover:bg-zinc-50/50 print:hover:bg-transparent">
                  <td className="py-4 pl-2">
                    <span className="font-display text-sm font-semibold text-[var(--ink)] block">
                      {item.title}
                    </span>
                    {item.sellerName && (
                      <span className="text-[9px] uppercase font-mono text-[var(--gold)] tracking-widest block mt-0.5">
                        Seller: {item.sellerName}
                      </span>
                    )}
                    <span className="text-[10px] text-[var(--ink-light)] flex items-center gap-1 mt-1 font-mono">
                      <Calendar size={10} />
                      {item.startDate} to {item.endDate}
                    </span>
                  </td>
                  <td className="py-4 text-center font-mono font-semibold text-[var(--ink)]">{item.size}</td>
                  <td className="py-4 text-center font-mono text-[var(--ink-light)]">
                    {days} {days === 1 ? 'Day' : 'Days'}
                  </td>
                  <td className="py-4 text-right font-mono">₹{item.price}</td>
                  <td className="py-4 text-right font-mono font-bold text-[var(--ink)] pr-2">
                    ₹{item.price * days * item.quantity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6 border-t border-[var(--petal)] print:border-zinc-300">
        {/* Terms and Notes */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-[var(--ivory-warm)]/50 p-4 rounded-2xl border border-[var(--petal)]/30 text-[11px] leading-relaxed text-[var(--ink-light)] print:bg-zinc-50 print:text-zinc-600 print:border-zinc-200">
            <h5 className="font-semibold text-xs text-[var(--ink)] mb-2 flex items-center gap-1 font-display uppercase tracking-wider">
              <Sparkles size={12} className="text-[var(--gold)]" />
              Rental Terms & Care Guide
            </h5>
            <ul className="list-disc pl-4 space-y-1">
              <li>Please treat this garment with love. Normal wear and tear is fully insured.</li>
              <li>Do NOT hand wash, dry clean, or alter the outfit. We handle all sanitization and repairs.</li>
              <li>A security deposit return will be initiated within 72 hours of checking back the garment.</li>
              <li>Returns must be handed over in the provided garment bag.</li>
            </ul>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[var(--ink-lighter)]">
            <Shield size={12} className="text-[var(--sage)]" />
            <span>Encrypted Ledger Record · Verified Rent Transaction</span>
          </div>
        </div>

        {/* Pricing Math */}
        <div className="md:col-span-6 space-y-2.5 font-mono text-xs text-right">
          <div className="flex justify-between">
            <span className="text-[var(--ink-light)]">Rental Subtotal</span>
            <span className="text-[var(--ink)]">₹{invoice.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--ink-light)]">Refundable Deposit</span>
            <span className="text-[var(--ink)]">₹{invoice.securityDeposit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--ink-light)]">Platform Fee (5%)</span>
            <span>₹{invoice.platformFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--ink-light)]">Estimated Tax (8%)</span>
            <span>₹{invoice.tax}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--ink-light)]">Fulfillment & Shipping</span>
            <span>₹{invoice.shippingFee}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between text-[var(--sage-dark)]">
              <span>Promo Discount</span>
              <span>-₹{invoice.discount}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-[var(--petal)] pt-2.5 mt-1 print:border-zinc-300">
            <span className="font-semibold text-[var(--ink)] text-sm">Amount Paid</span>
            <span className="font-bold text-lg text-[var(--rose)] print:text-zinc-800">
              ₹{invoice.total}
            </span>
          </div>
          
          <div className="bg-[var(--bloom)]/30 rounded-xl px-3 py-1.5 inline-flex items-center gap-1.5 mt-2 print:border print:border-zinc-200">
            <CreditCard size={12} className="text-[var(--rose)]" />
            <span className="text-[9px] uppercase tracking-wider text-[var(--ink-light)] font-sans">
              Paid via {invoice.paymentMethod}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons (hidden during print) */}
      <div className="flex justify-end gap-3 mt-8 border-t border-[var(--petal)] pt-6 print:hidden">
        {onClose && (
          <button onClick={onClose} className="btn-outline !h-11 !px-5 text-xs">
            Close Invoice
          </button>
        )}
        <button
          onClick={handlePrint}
          className="btn-gold !h-11 !px-5 text-xs flex items-center gap-2 cursor-pointer"
        >
          <Printer size={14} />
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
