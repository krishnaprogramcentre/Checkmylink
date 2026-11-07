'use client';

import React, { useState, useEffect } from 'react';

export const SAFE_LINKS = [
  "https://www.google.com",
  "https://www.gmail.com",
  "https://drive.google.com",
  "https://docs.google.com",
  "https://sheets.google.com",
  "https://slides.google.com",
  "https://calendar.google.com",
  "https://maps.google.com",
  "https://translate.google.com",
  "https://photos.google.com",
  "https://www.wikipedia.org",
  "https://www.khanacademy.org",
  "https://www.coursera.org",
  "https://www.edx.org",
  "https://swayam.gov.in",
  "https://diksha.gov.in",
  "https://ncert.nic.in",
  "https://www.cbse.gov.in",
  "https://www.ugc.gov.in",
  "https://www.nios.ac.in",
  "https://www.india.gov.in",
  "https://igod.gov.in",
  "https://www.mygov.in",
  "https://uidai.gov.in",
  "https://www.digilocker.gov.in",
  "https://www.incometax.gov.in",
  "https://www.gst.gov.in",
  "https://www.passportindia.gov.in",
  "https://parivahan.gov.in",
  "https://cybercrime.gov.in",
  "https://www.microsoft.com",
  "https://outlook.live.com",
  "https://www.office.com",
  "https://onedrive.live.com",
  "https://www.apple.com",
  "https://www.icloud.com",
  "https://www.adobe.com",
  "https://www.canva.com",
  "https://zoom.us",
  "https://www.notion.so",
  "https://www.whatsapp.com",
  "https://web.whatsapp.com",
  "https://www.instagram.com",
  "https://www.facebook.com",
  "https://www.messenger.com",
  "https://www.linkedin.com",
  "https://www.pinterest.com",
  "https://www.reddit.com",
  "https://telegram.org",
  "https://discord.com",
  "https://github.com",
  "https://gitlab.com",
  "https://stackoverflow.com",
  "https://developer.mozilla.org",
  "https://www.w3schools.com",
  "https://www.freecodecamp.org",
  "https://www.geeksforgeeks.org",
  "https://codepen.io",
  "https://www.npmjs.com",
  "https://openai.com",
  "https://www.bbc.com",
  "https://www.reuters.com",
  "https://www.thehindu.com",
  "https://indianexpress.com",
  "https://www.ndtv.com",
  "https://www.indiatoday.in",
  "https://www.hindustantimes.com",
  "https://www.aljazeera.com",
  "https://www.nationalgeographic.com",
  "https://www.britannica.com",
  "https://www.amazon.in",
  "https://www.flipkart.com",
  "https://www.myntra.com",
  "https://www.ajio.com",
  "https://www.meesho.com",
  "https://www.nykaa.com",
  "https://www.snapdeal.com",
  "https://www.croma.com",
  "https://www.reliancedigital.in",
  "https://www.irctc.co.in",
  "https://www.indianrailways.gov.in",
  "https://www.uber.com",
  "https://www.olacabs.com",
  "https://www.redbus.in",
  "https://www.makemytrip.com",
  "https://www.goibibo.com",
  "https://www.cleartrip.com",
  "https://www.airindia.com",
  "https://www.ixigo.com",
  "https://www.youtube.com",
  "https://www.netflix.com",
  "https://www.primevideo.com",
  "https://www.hotstar.com",
  "https://www.sonyliv.com",
  "https://open.spotify.com",
  "https://soundcloud.com",
  "https://www.bookmyshow.com",
  "https://www.swiggy.com",
  "https://www.zomato.com"
];

export const MALICIOUS_LINKS = [
  "https://google-account-verify.example/login",
  "https://gmail-security-alert.example/verify",
  "https://facebook-login-check.example/account",
  "https://instagram-verify-user.example/login",
  "https://whatsapp-update-account.example/verify",
  "https://microsoft-password-reset.example/login",
  "https://apple-id-security.example/verify",
  "https://amazon-refund-claim.example/refund",
  "https://flipkart-prize-winner.example/claim",
  "https://paypal-payment-check.example/login",
  "https://netflix-account-warning.example/verify",
  "https://youtube-premium-gift.example/claim",
  "https://telegram-account-check.example/login",
  "https://discord-nitro-gift.example/claim",
  "https://linkedin-security-check.example/verify",
  "https://bank-account-blocked.example/login",
  "https://bank-kyc-update.example/verify",
  "https://upi-refund-approved.example/claim",
  "https://payment-failed-alert.example/verify",
  "https://credit-card-limit-increase.example/apply",
  "https://free-mobile-gift.example/claim",
  "https://win-new-iphone.example/prize",
  "https://lottery-winner-message.example/claim",
  "https://shopping-cashback.example/reward",
  "https://free-shopping-voucher.example/claim",
  "https://urgent-account-update.example/verify",
  "https://password-expired-alert.example/reset",
  "https://security-warning-message.example/login",
  "https://account-suspended-now.example/restore",
  "https://verify-your-identity.example/confirm",
  "https://fake-delivery-update.example/track",
  "https://parcel-payment-required.example/pay",
  "https://courier-address-check.example/update",
  "https://free-recharge-offer.example/claim",
  "https://mobile-sim-blocked.example/verify",
  "https://sim-kyc-expired.example/update",
  "https://electricity-bill-warning.example/pay",
  "https://gas-bill-refund.example/claim",
  "https://fast-loan-approval.example/apply",
  "https://instant-scholarship-award.example/claim",
  "https://student-result-check.example/login",
  "https://exam-fee-refund.example/claim",
  "https://job-selection-message.example/verify",
  "https://work-from-home-prize.example/register",
  "https://government-scheme-reward.example/claim",
  "https://tax-refund-approved.example/verify",
  "https://pan-card-update.example/confirm",
  "https://aadhaar-update-alert.example/verify",
  "https://passport-verification.example/login",
  "https://railway-ticket-refund.example/claim",
  "https://flight-ticket-cancelled.example/refund",
  "https://hotel-booking-reward.example/claim",
  "https://free-game-coins.example/redeem",
  "https://gaming-account-warning.example/login",
  "https://free-diamonds-reward.example/claim",
  "https://game-account-banned.example/restore",
  "https://crypto-free-reward.example/claim",
  "https://investment-double-money.example/register",
  "https://wallet-security-alert.example/verify",
  "https://digital-payment-refund.example/claim",
  "https://account-login-unusual.example/check",
  "https://new-device-login-alert.example/verify",
  "https://confirm-your-password.example/login",
  "https://reset-password-immediately.example/reset",
  "https://email-storage-full.example/upgrade",
  "https://cloud-storage-warning.example/verify",
  "https://document-share-alert.example/open",
  "https://fake-invoice-payment.example/pay",
  "https://urgent-payment-request.example/confirm",
  "https://unknown-transaction-alert.example/check",
  "https://atm-card-blocked.example/restore",
  "https://debit-card-verification.example/verify",
  "https://credit-card-reward.example/claim",
  "https://bank-reward-points.example/redeem",
  "https://upi-pin-update.example/confirm",
  "https://mobile-banking-update.example/login",
  "https://account-verification-required.example/verify",
  "https://free-data-pack.example/claim",
  "https://internet-speed-upgrade.example/activate",
  "https://new-phone-giveaway.example/winner",
  "https://festival-gift-offer.example/claim",
  "https://birthday-reward.example/redeem",
  "https://exclusive-discount.example/claim",
  "https://limited-time-prize.example/win",
  "https://urgent-document-check.example/upload",
  "https://unknown-file-download.example/download",
  "https://fake-support-team.example/contact",
  "https://customer-care-refund.example/request",
  "https://delivery-fee-pending.example/pay",
  "https://online-order-cancelled.example/restore",
  "https://subscription-expired.example/renew",
  "https://free-premium-access.example/activate",
  "https://social-media-blue-tick.example/claim",
  "https://account-recovery-support.example/login",
  "https://verify-mobile-number.example/confirm",
  "https://security-check-required.example/continue",
  "https://payment-confirmation.example/submit",
  "https://final-warning-account.example/restore",
  "https://bonus-cash-reward.example/claim",
  "https://special-user-gift.example/redeem",
  "https://unknown-login-verification.example/check",
  "https://personal-data-update.example/submit",
  "https://important-account-message.example/read"
];

const STORAGE_KEY = 'cml_random_website_state_v1';

export interface GeneratedLink {
  url: string;
  category: 'SAFE' | 'SUSPICIOUS';
  type: string;
}

export interface RandomGeneratorState {
  nextCategory: 'SAFE' | 'SUSPICIOUS';
  usedSafe: string[];
  usedSuspicious: string[];
  currentLink: GeneratedLink | null;
}

export interface RandomWebsiteGeneratorProps {
  onSelectUrl?: (url: string) => void;
  className?: string;
}

export const RandomWebsiteGenerator: React.FC<RandomWebsiteGeneratorProps> = ({
  onSelectUrl,
  className = '',
}) => {
  const [state, setState] = useState<RandomGeneratorState>({
    nextCategory: 'SAFE',
    usedSafe: [],
    usedSuspicious: [],
    currentLink: null,
  });
  const [copied, setCopied] = useState(false);
  const [exhaustedMessage, setExhaustedMessage] = useState<string | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({
          nextCategory: parsed.nextCategory === 'SUSPICIOUS' ? 'SUSPICIOUS' : 'SAFE',
          usedSafe: Array.isArray(parsed.usedSafe) ? parsed.usedSafe : [],
          usedSuspicious: Array.isArray(parsed.usedSuspicious) ? parsed.usedSuspicious : [],
          currentLink: parsed.currentLink || null,
        });
      }
    } catch (e) {
      console.warn('Failed to parse random generator state from localStorage', e);
    }
  }, []);

  const saveState = (newState: RandomGeneratorState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn('Failed to save random generator state to localStorage', e);
    }
  };

  const handleGenerate = () => {
    setCopied(false);
    setExhaustedMessage(null);

    const isSafeTurn = state.nextCategory === 'SAFE';

    if (isSafeTurn) {
      const remaining = SAFE_LINKS.filter((url) => !state.usedSafe.includes(url));
      if (remaining.length === 0) {
        setExhaustedMessage('All links in this category have been used.');
        return;
      }
      const randomIndex = Math.floor(Math.random() * remaining.length);
      const chosenUrl = remaining[randomIndex];

      saveState({
        nextCategory: 'SUSPICIOUS',
        usedSafe: [...state.usedSafe, chosenUrl],
        usedSuspicious: state.usedSuspicious,
        currentLink: {
          url: chosenUrl,
          category: 'SAFE',
          type: 'Commonly Used Website',
        },
      });
    } else {
      const remaining = MALICIOUS_LINKS.filter((url) => !state.usedSuspicious.includes(url));
      if (remaining.length === 0) {
        setExhaustedMessage('All links in this category have been used.');
        return;
      }
      const randomIndex = Math.floor(Math.random() * remaining.length);
      const chosenUrl = remaining[randomIndex];

      saveState({
        nextCategory: 'SAFE',
        usedSafe: state.usedSafe,
        usedSuspicious: [...state.usedSuspicious, chosenUrl],
        currentLink: {
          url: chosenUrl,
          category: 'SUSPICIOUS',
          type: 'Suspicious Test Example',
        },
      });
    }
  };

  const handleReset = () => {
    setCopied(false);
    setExhaustedMessage(null);
    const resetState: RandomGeneratorState = {
      nextCategory: 'SAFE',
      usedSafe: [],
      usedSuspicious: [],
      currentLink: null,
    };
    saveState(resetState);
  };

  const handleCopy = () => {
    if (state.currentLink) {
      navigator.clipboard.writeText(state.currentLink.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalUsed = state.usedSafe.length + state.usedSuspicious.length;

  return (
    <div
      className={`relative w-full max-w-3xl mx-auto rounded-2xl border border-blue-600/30 bg-[#080F1F]/90 backdrop-blur-xl p-6 md:p-8 shadow-2xl transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#FF6B00] font-bold">
            DISCOVERY ENGINE
          </span>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">Try a Random Website</h3>
          <p className="text-sm text-slate-400 mt-1">Discover different website examples</p>
        </div>

        {/* Sequence Indicator Pill */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono border transition-all ${
            state.nextCategory === 'SAFE'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-orange-500/10 border-orange-500/30 text-orange-300'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full animate-ping ${
              state.nextCategory === 'SAFE' ? 'bg-emerald-400' : 'bg-[#FF6B00]'
            }`}
          />
          <span>
            Next Click:{' '}
            <strong>{state.nextCategory === 'SAFE' ? 'SAFE WEBSITE' : 'SUSPICIOUS TEST LINK'}</strong>
          </span>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="rounded-xl border border-slate-800 bg-[#040812]/80 p-5 md:p-6 min-h-[160px] flex flex-col justify-center items-center text-center">
        {exhaustedMessage ? (
          <div className="space-y-2 py-4">
            <div className="text-3xl">ℹ️</div>
            <p className="text-base font-bold text-[#FF6B00]">{exhaustedMessage}</p>
            <p className="text-xs text-slate-400">Click Reset below to clear history and restart with a Safe link.</p>
          </div>
        ) : state.currentLink ? (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Top Badge Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    state.currentLink.category === 'SAFE'
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                      : 'bg-orange-500/15 border border-orange-500/40 text-[#FF6B00]'
                  }`}
                >
                  {state.currentLink.category === 'SAFE' ? '🛡️ SAFE WEBSITE' : '⚠️ SUSPICIOUS TEST LINK'}
                </span>
                <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  {state.currentLink.type}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">Link #{totalUsed}</span>
            </div>

            {/* URL Box */}
            <div className="w-full text-left p-3.5 rounded-lg bg-[#0D1B31] border border-blue-500/30 font-mono text-sm md:text-base text-blue-300 break-all select-all shadow-inner">
              {state.currentLink.url}
            </div>

            {/* Suspicious Educational Disclaimer */}
            {state.currentLink.category === 'SUSPICIOUS' && (
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-orange-950/40 border-l-4 border-[#FF6B00] text-xs text-orange-200 text-left">
                <span>⚠️</span>
                <span>This is a fictional example for cybersecurity education.</span>
              </div>
            )}

            {/* Action Buttons for Link */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
              {onSelectUrl && (
                <button
                  type="button"
                  onClick={() => onSelectUrl(state.currentLink!.url)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#2563EB] hover:bg-blue-600 text-white transition-all shadow-md hover:shadow-blue-500/20 active:scale-95"
                >
                  ⚡ Test in Scanner
                </button>
              )}
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 rounded-lg text-xs font-semibold border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
              >
                {copied ? '✓ Copied!' : '📋 Copy Link'}
              </button>
              {state.currentLink.category === 'SAFE' && (
                <a
                  href={state.currentLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-all"
                >
                  Open Website ↗
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2 py-4">
            <div className="text-3xl opacity-80">🎲</div>
            <p className="text-sm font-semibold text-slate-200">Ready to test website examples</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Click &ldquo;Generate Random Link&rdquo; to begin. The sequence strictly alternates:{' '}
              <span className="text-emerald-400">1st: Safe</span> &rarr;{' '}
              <span className="text-orange-400">2nd: Suspicious</span> &rarr;{' '}
              <span className="text-emerald-400">3rd: Safe</span>...
            </p>
          </div>
        )}
      </div>

      {/* Footer Controls & Stats Counter */}
      <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#2563EB] to-blue-700 hover:from-blue-600 hover:to-[#2563EB] text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>⚡</span>
            <span>Generate Random Link</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-3 rounded-xl font-medium text-sm border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 transition-all active:scale-95"
            title="Clear used history and start again from Safe"
          >
            ↻ Reset
          </button>
        </div>

        {/* Small Counters */}
        <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-950/70 border border-slate-800/80 px-4 py-2 rounded-full font-mono">
          <div>
            Safe: <strong className="text-emerald-400">{state.usedSafe.length} / 100</strong>
          </div>
          <span className="text-slate-600">•</span>
          <div>
            Suspicious: <strong className="text-orange-400">{state.usedSuspicious.length} / 100</strong>
          </div>
          <span className="text-slate-600">•</span>
          <div>
            Total: <strong className="text-white">{totalUsed}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
