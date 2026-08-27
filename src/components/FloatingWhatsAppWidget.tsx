import React, { useState } from 'react';
import { QuotationMeta } from '../types';
import { MessageCircle, X, Send, Sparkles, Check, PhoneCall } from 'lucide-react';

interface FloatingWhatsAppWidgetProps {
  meta: QuotationMeta;
}

export const FloatingWhatsAppWidget: React.FC<FloatingWhatsAppWidgetProps> = ({ meta }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState(
    `السلام عليكم ورحمة الله وبركاته،\nأود الاستفسار بخصوص طلب وتصدير محاصيل وأعشاب زراعية من شركة ${meta.sellerCompanyNameAr} (عرض أسعار رقم ${meta.quotationNo}).`
  );

  const cleanPhone = (meta.sellerWhatsApp || '201001234567').replace(/[^0-9]/g, '');

  const quickTemplates = [
    {
      title: '📦 استفسار عن حاوية FCL',
      text: `السلام عليكم، أود الاستفسار عن حجز حمولة حاوية 40 قدم من البصل المجفف والأعشاب الطبية ومواعيد الشحن المتاحة.`,
    },
    {
      title: '🌿 طلب عينات للمختبر',
      text: `مرحباً، نرغب في طلب عينات تجارية معتمدة لفحص الجودة والمواصفات القياسية قبل تأكيد أمر الشراء.`,
    },
    {
      title: '💰 طلب عرض سعر رسمي CIF',
      text: `السلام عليكم، أرجو تزويدي بعرض سعر رسمي مفصل CIF لميناء الوصول متضمناً شروط الدفع والشهادات.`,
    },
  ];

  const handleSend = () => {
    const encoded = encodeURIComponent(customMessage);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  const handleDirectOneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const encoded = encodeURIComponent(customMessage);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="no-print fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Quick Message Dialog */}
      {isOpen && (
        <div 
          className="mb-3 w-80 sm:w-96 bg-[#121212] border-2 border-[#d4af37]/70 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn text-[#e5d5b0] pyramid-pattern"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#1a1a1a] p-3.5 border-b border-[#d4af37]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">محادثة فورية مع إدارة التصدير</h4>
                <p className="text-[10px] text-[#d4af37] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  متواجدون الآن للرد على استفساركم
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-[#9e9785] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-3.5 space-y-3">
            <div>
              <label className="text-[11px] text-[#9e9785] block mb-1 font-semibold">
                نماذج رسائل جاهزة سريعة:
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {quickTemplates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomMessage(tmpl.text)}
                    className="text-right text-[11px] p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] border border-[#d4af37]/20 hover:border-[#d4af37]/60 text-[#e5d5b0] transition-all flex items-center justify-between"
                  >
                    <span>{tmpl.title}</span>
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#9e9785] block mb-1 font-semibold">
                نص الرسالة الافتراضية (يمكنك تعديلها بحرية):
              </label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#0a0a0a] border border-[#d4af37]/30 text-xs text-white placeholder-[#9e9785] focus:outline-none focus:border-[#d4af37] resize-none"
                placeholder="اكتب رسالتك أو استفسارك هنا..."
              />
            </div>

            <div className="text-[10px] text-[#9e9785] flex items-center gap-1.5 bg-[#161616] p-2 rounded-lg border border-white/5">
              <PhoneCall className="w-3 h-3 text-[#d4af37]" />
              <span>الرقم المعتمد: <span className="text-white font-mono">{meta.sellerWhatsApp}</span></span>
            </div>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSend}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
              <span>فتح محادثة واتساب الآن</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Button Bar */}
      <div className="flex items-center gap-2">
        {/* Helper Hint Pill (Desktop) */}
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 py-2 px-3.5 rounded-full bg-[#161616]/95 border border-[#d4af37]/60 text-[#e5d5b0] text-xs font-bold shadow-xl cursor-pointer hover:border-[#d4af37] transition-all backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>تواصل واتساب مباشر</span>
          </div>
        )}

        {/* Floating WhatsApp Action Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative p-3.5 sm:p-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-white/20"
          title="تواصل فوري عبر واتساب"
          aria-label="WhatsApp Contact"
        >
          {/* Pulsing Outer Ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none"></span>
          
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white drop-shadow" />
        </button>
      </div>

    </div>
  );
};
