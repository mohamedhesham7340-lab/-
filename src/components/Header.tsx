import React from 'react';
import { 
  FileText, 
  ShoppingBag, 
  Settings, 
  HelpCircle, 
  PhoneCall, 
  Sparkles, 
  DollarSign, 
  Check, 
  Globe2,
  Share2
} from 'lucide-react';
import { ActiveView, CurrencyCode, QuotationMeta } from '../types';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  cartCount: number;
  totalCartMT: number;
  setIsCartOpen: (open: boolean) => void;
  meta: QuotationMeta;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  currency,
  setCurrency,
  cartCount,
  totalCartMT,
  setIsCartOpen,
  meta,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#d4af37]/30 shadow-2xl transition-all">
      {/* Top Pharaonic Golden Trim Bar */}
      <div className="h-1 w-full gold-gradient"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => setActiveView('catalog')}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="relative w-11 h-11 border-2 border-[#d4af37] rotate-45 flex items-center justify-center bg-[#161616] shadow-lg group-hover:border-[#f5d77f] transition-all">
              <span className="-rotate-45 text-xl font-bold text-[#d4af37] select-none transform group-hover:scale-110 transition-transform">𓋹</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-[0.15em] text-[#d4af37] font-['Cinzel',serif]">
                  ROYAL PHARAOH
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#d4af37]/15 text-[#f5d77f] border border-[#d4af37]/30 font-bold uppercase tracking-wider hidden sm:inline-block">
                  EXPORT GRADE
                </span>
              </div>
              <p className="text-xs text-[#e5d5b0] opacity-80 font-medium hidden sm:block">
                {meta.sellerTaglineAr}
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-2 bg-[#161616] p-1.5 rounded-xl border border-[#d4af37]/25">
            <button
              onClick={() => setActiveView('catalog')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all ${
                activeView === 'catalog'
                  ? 'bg-[#d4af37] text-[#0a0a0a] shadow-md'
                  : 'text-[#e5d5b0] hover:text-[#d4af37] hover:bg-[#222222]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>الكتالوج والطلب</span>
            </button>

            <button
              onClick={() => setActiveView('pdf_preview')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all ${
                activeView === 'pdf_preview'
                  ? 'bg-[#d4af37] text-[#0a0a0a] shadow-md'
                  : 'text-[#e5d5b0] hover:text-[#d4af37] hover:bg-[#222222]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>عرض الأسعار PDF</span>
            </button>

            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all ${
                activeView === 'admin'
                  ? 'bg-[#d4af37] text-[#0a0a0a] shadow-md'
                  : 'text-[#e5d5b0] hover:text-[#d4af37] hover:bg-[#222222]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>لوحة التحكم</span>
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
            </button>

            <button
              onClick={() => setActiveView('guide')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all ${
                activeView === 'guide'
                  ? 'bg-[#d4af37] text-[#0a0a0a] shadow-md'
                  : 'text-[#e5d5b0] hover:text-[#d4af37] hover:bg-[#222222]'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>دليل Vercel</span>
            </button>
          </nav>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Currency Selector */}
            <div className="flex items-center bg-[#161616] border border-[#d4af37]/30 rounded-lg p-0.5">
              {(['USD', 'EUR', 'EGP'] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                    currency === c
                      ? 'bg-[#d4af37] text-[#0a0a0a]'
                      : 'text-[#9e9785] hover:text-[#e5d5b0]'
                  }`}
                >
                  {c === 'USD' ? '$ USD' : c === 'EUR' ? '€ EUR' : 'ج.م EGP'}
                </button>
              ))}
            </div>

            {/* Shopping & RFQ Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#161616] hover:bg-[#222222] text-[#e5d5b0] border border-[#d4af37]/40 shadow-lg hover:border-[#d4af37] transition-all"
            >
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <div className="text-right hidden sm:block">
                <div className="text-[11px] text-[#d4af37] font-medium leading-none">عرض السعر</div>
                <div className="text-xs font-bold text-white">{totalCartMT} طن (MT)</div>
              </div>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#d4af37] text-[#0a0a0a] font-black text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* WhatsApp Direct Quick Action */}
            <a
              href={`https://wa.me/${meta.sellerWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `مرحباً، أود الاستفسار عن عرض أسعار الخضروات والأعشاب المجففة (${meta.quotationNo})`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#161616] hover:bg-[#222222] text-[#d4af37] text-xs font-bold border border-[#d4af37]/40 shadow-sm transition-all"
            >
              <span className="text-sm">💬</span>
              <span>واتساب المصنع</span>
            </a>
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-[#d4af37]/15">
          <button
            onClick={() => setActiveView('catalog')}
            className={`flex flex-col items-center py-1 text-xs font-semibold ${
              activeView === 'catalog' ? 'text-[#d4af37]' : 'text-[#9e9785]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>الكتالوج</span>
          </button>
          <button
            onClick={() => setActiveView('pdf_preview')}
            className={`flex flex-col items-center py-1 text-xs font-semibold ${
              activeView === 'pdf_preview' ? 'text-[#d4af37]' : 'text-[#9e9785]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>عرض PDF</span>
          </button>
          <button
            onClick={() => setActiveView('admin')}
            className={`flex flex-col items-center py-1 text-xs font-semibold ${
              activeView === 'admin' ? 'text-[#d4af37]' : 'text-[#9e9785]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>لوحة التحكم</span>
          </button>
          <button
            onClick={() => setActiveView('guide')}
            className={`flex flex-col items-center py-1 text-xs font-semibold ${
              activeView === 'guide' ? 'text-[#d4af37]' : 'text-[#9e9785]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>دليل فيرسيل</span>
          </button>
        </div>
      </div>
    </header>
  );
};
