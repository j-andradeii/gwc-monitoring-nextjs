# Payment Implementation Analysis

## Overview
The staged files implement an **Online Giving** feature using **PayMongo** as the payment gateway. This allows users to give offerings and tithes via various payment methods (GCash, Card, PayMaya, GrabPay) directly from the web application.

## Staged Files & Responsibilities

### 1. Backend: Payment Session Creation
**File:** `src/app/api/paymongo/checkout/route.ts`

*   **Functionality:**
    *   Acts as a secure server-side proxy to create PayMongo Checkout Sessions.
    *   Accepts `amount` and optional `description` from the client.
    *   Validates the amount (must be > 0).
    *   Converts the amount to **centavos** (PayMongo requirement).
    *   Constructs the payload for PayMongo API.

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, description = 'Tithes and Offerings' } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        const secretKey = process.env.PAYMONGO_SECRET_KEY;

        if (!secretKey) {
            console.error('PAYMONGO_SECRET_KEY is not set');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // PayMongo expects amount in centavos
        const amountInCentavos = Math.round(parseFloat(amount) * 100);

        // Base URL for redirects
        // Use the origin from the request if available, otherwise fallback
        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Create Basic Auth header
        const encodedKey = Buffer.from(secretKey).toString('base64');

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Basic ${encodedKey}`,
            },
            body: JSON.stringify({
                data: {
                    attributes: {
                        send_email_receipt: true,
                        show_description: true,
                        show_line_items: true,
                        description: description,
                        line_items: [
                            {
                                currency: 'PHP',
                                amount: amountInCentavos,
                                description: description,
                                name: 'Giving',
                                quantity: 1,
                            },
                        ],
                        payment_method_types: ['gcash', 'card', 'paymaya', 'grab_pay', 'dob'],
                        success_url: `${origin}/give/success`,
                        cancel_url: `${origin}/give/cancel`,
                    },
                },
            }),
        };

        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options);
        const data = await response.json();

        if (data.errors) {
            console.error('PayMongo API Error:', data.errors);
            return NextResponse.json({ error: data.errors[0].detail || 'Payment gateway error' }, { status: 400 });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
```

### 2. UI: Donation Interface
**File:** `src/components/landing/give/DonationModal.tsx`

*   **Functionality:**
    *   Provides a user-friendly modal for entering donation amounts.
    *   Features:
        *   **Preset Amounts:** Chips for ₱500, ₱1,000, ₱2,500, ₱5,000.
        *   **Custom Amount:** Input field with validation (minimum ₱100).
        *   **Visuals:** Styled with the "Kingdom Gold" (`#d4a84b`) and "Navy" (`#1a2744`) theme.
        *   **Feedback:** Loading spinner during API call and error handling display.

```tsx
'use client';

import React, { useState } from 'react';
import Spinner from '@/components/ui/Spinner';

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
    const [amount, setAmount] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

    if (!isOpen) return null;

    const handleDonate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/paymongo/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: parseFloat(amount) }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            if (data.data?.attributes?.checkout_url) {
                window.location.href = data.data.attributes.checkout_url;
            } else {
                throw new Error('No checkout URL returned');
            }
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_24px_60px_rgba(0,0,0,0.2)] rounded-3xl p-8 animate-in fade-in zoom-in duration-300 overflow-hidden">
                {/* Decorative background gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4a84b] to-[#f9d976]" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/50 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-all hover:rotate-90"
                    type="button"
                >
                    <i className="pi pi-times text-lg"></i>
                </button>

                <div className="text-center mb-8">
                    <h3 className="text-2xl font-extrabold text-[#1a2744] uppercase tracking-tight mb-2">Give Online</h3>
                    <p className="text-gray-500 text-sm font-medium">Support the kingdom work securely</p>
                </div>

                <form onSubmit={handleDonate}>
                    <div className="mb-8">
                        <label htmlFor="amount" className="block text-xs font-bold text-[#1a2744] uppercase tracking-widest mb-3 text-center">
                            Select Amount (PHP)
                        </label>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {PRESET_AMOUNTS.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setAmount(preset.toString())}
                                    className={`py-2 px-4 rounded-xl text-sm font-bold transition-all border-2 ${amount === preset.toString()
                                        ? 'border-[#d4a84b] bg-[#d4a84b]/10 text-[#d4a84b]'
                                        : 'border-gray-100 bg-gray-50/50 text-gray-500 hover:border-[#d4a84b]/50 hover:text-[#d4a84b]'
                                        }`}
                                >
                                    ₱{preset.toLocaleString()}
                                </button>
                            ))}
                        </div>

                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-[#d4a84b] transition-colors">₱</span>
                            <input
                                type="number"
                                id="amount"
                                required
                                min="100"
                                step="1"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4a84b]/20 focus:border-[#d4a84b] transition-all text-lg font-bold text-[#1a2744] placeholder:font-normal placeholder:text-gray-300 outline-none"
                                placeholder="Enter custom amount"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">Minimum amount: ₱100.00</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50/80 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3">
                            <i className="pi pi-exclamation-circle mt-0.5"></i>
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !amount}
                        className="w-full bg-gradient-to-br from-[#d4a84b] to-[#c9973f] hover:from-[#c9973f] hover:to-[#d4a84b] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-full transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(212,168,75,0.25)] hover:shadow-[0_6px_20px_rgba(212,168,75,0.35)] transform hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-wide text-sm"
                    >
                        {loading ? (
                            <>
                                <Spinner size="small" />
                                <span>Processing Securely...</span>
                            </>
                        ) : (
                            <>
                                <span>Proceed to Give</span>
                                <i className="pi pi-arrow-right"></i>
                            </>
                        )}
                    </button>

                    <div className="mt-6 flex justify-center items-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-300">
                        <i className="pi pi-credit-card text-xl" title="Credit Card"></i>
                        <span className="h-4 w-px bg-gray-300"></span>
                        <i className="pi pi-wallet text-xl" title="GCash/Maya"></i>
                        <span className="h-4 w-px bg-gray-300"></span>
                        <div className="flex items-center gap-1 text-xs font-semibold">
                            <i className="pi pi-lock"></i>
                            <span>SECURE</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DonationModal;
```

### 3. UI: Entry Point
**File:** `src/components/landing/give/GiveChannelsSection.tsx`

*   **Functionality:**
    *   Updated to include a prominent **"Give Online Now"** button.
    *   Integrates the `DonationModal` into the existing ways-to-give section.

```tsx
'use client';

import React, { useState, useCallback } from 'react';
import { givingChannels } from '@/data/giveData';
import DownloadQRButton from '@/components/ui/DownloadQRButton';
import { CONTACT_INFO } from '@/data/contact';
import DonationModal from './DonationModal';

// ... (existing imports and hooks)

export const GiveChannelsSection: React.FC = () => {
  const { copiedId, copy } = useCopyToClipboard();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="landing-section give-channels-section section-white">
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">Channels</span>
          <h2>How to Give</h2>
          <p>Choose your preferred method to give your tithes and offerings. Please send a screenshot of your transaction to <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary hover:underline">{CONTACT_INFO.email}</a> or via <a href={CONTACT_INFO.social.facebook} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook</a>.</p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-br from-[#d4a84b] to-[#c9973f] hover:from-[#c9973f] hover:to-[#d4a84b] text-white font-extrabold uppercase tracking-wide py-4 px-10 rounded-full shadow-[0_4px_15px_rgba(212,168,75,0.25)] hover:shadow-[0_6px_20px_rgba(212,168,75,0.35)] transition-all transform hover:-translate-y-1 flex items-center gap-3 text-lg"
            >
              <i className="pi pi-heart-fill text-xl animate-pulse"></i>
              <span>Give Online Now</span>
            </button>
          </div>
        </div>

        {/* ... (existing channel rendering) */}
        
      </div>
      <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default GiveChannelsSection;
```

### 4. UI: Transaction Outcomes
**File:** `src/app/(public)/give/success/page.tsx`

*   **Success State:**
    *   Displayed after a successful payment.

```tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GiveSuccessPage() {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setShowConfetti(true);
    }, []);

    return (
        <main className="min-h-[80vh] flex items-center justify-center bg-[#f5f0e6] relative overflow-hidden py-20 px-4">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,168,75,0.1),transparent_40%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(26,39,68,0.05),transparent_40%)] pointer-events-none" />

            <div className="relative z-10 max-w-lg w-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_24px_60px_rgba(0,0,0,0.1)] rounded-3xl p-10 text-center animate-in fade-in zoom-in duration-500">

                {/* Success Icon */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#d4a84b] to-[#c9973f] shadow-[0_10px_30px_rgba(212,168,75,0.4)] mb-8 animate-bounce">
                    <i className="pi pi-check text-4xl text-white font-bold"></i>
                </div>

                <h1 className="text-4xl font-extrabold text-[#1a2744] uppercase tracking-tight mb-4">
                    Thank You!
                </h1>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Your generosity is making a difference. Your tithes and offerings help us advance the Kingdom of God.
                </p>

                <div className="bg-[#1a2744]/5 rounded-xl p-6 mb-8 border border-[#1a2744]/10">
                    <p className="text-sm font-semibold text-[#1a2744] uppercase tracking-wider mb-1">
                        Transaction Status
                    </p>
                    <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-lg">
                        <i className="pi pi-verified"></i>
                        <span>Successful</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        An email receipt has been sent to you.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/"
                        className="w-full bg-[#1a2744] hover:bg-[#151e32] text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                    >
                        <i className="pi pi-home"></i>
                        <span>Return Home</span>
                    </Link>

                    <Link
                        href="/give/ways-to-give"
                        className="w-full bg-transparent hover:bg-white text-[#d4a84b] hover:text-[#b8923f] border-2 border-[#d4a84b] font-bold py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                    >
                        <span>Give Again</span>
                    </Link>
                </div>
            </div>

            {/* Confetti CSS Effect (Simple) */}
            {showConfetti && (
                <style jsx global>{`
          @keyframes confetti-fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: #d4a84b;
            animation: confetti-fall 4s linear infinite;
          }
        `}</style>
            )}
        </main>
    );
}
```

**File:** `src/app/(public)/give/cancel/page.tsx`
*   **Cancel State:**
    *   Displayed if the user cancels the payment or it fails.

```tsx
'use client';

import React from 'react';
import Link from 'next/link';

export default function GiveCancelPage() {
    return (
        <main className="min-h-[70vh] flex items-center justify-center bg-[#f5f0e6] relative overflow-hidden py-16 px-4">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(26,39,68,0.05),transparent_40%)] pointer-events-none" />

            <div className="relative z-10 max-w-md w-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_24px_60px_rgba(0,0,0,0.1)] rounded-3xl p-8 text-center animate-in fade-in zoom-in duration-500">

                {/* Cancel Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                    <i className="pi pi-info-circle text-4xl text-gray-400"></i>
                </div>

                <h1 className="text-3xl font-extrabold text-[#1a2744] uppercase tracking-tight mb-4">
                    Transaction Cancelled
                </h1>

                <p className="text-gray-600 mb-8">
                    No charges were made to your account. You can try again whenever you are ready.
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/give/ways-to-give"
                        className="w-full bg-[#d4a84b] hover:bg-[#b8923f] text-white font-bold py-4 px-6 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                    >
                        <i className="pi pi-refresh"></i>
                        <span>Try Again</span>
                    </Link>

                    <Link
                        href="/"
                        className="w-full bg-transparent hover:bg-gray-50 text-gray-500 hover:text-[#1a2744] font-medium py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <span>Return Home</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
```

## Requirements for Deployment
*   **Environment Variables:**
    *   `PAYMONGO_SECRET_KEY`: The secret key from the PayMongo dashboard.
    *   `NEXT_PUBLIC_BASE_URL`: (Optional but recommended) The production URL of the site.
