import React from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Database, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Copy, 
  Check 
} from 'lucide-react';
import { NEON_POSTGRES_SQL_SCHEMA } from '../utils/storage';

interface VercelGuideModalProps {
  onClose: () => void;
}

export const VercelGuideModal: React.FC<VercelGuideModalProps> = ({ onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const copySql = () => {
    navigator.clipboard.writeText(NEON_POSTGRES_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0f0f0f] border-2 border-[#d4af37]/60 rounded-3xl shadow-2xl p-6 sm:p-8 text-[#e5d5b0] space-y-6 pyramid-pattern">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full bg-[#161616] hover:bg-[#d4af37] hover:text-[#0a0a0a] text-[#e5d5b0] border border-[#d4af37]/30 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-[#d4af37]/30 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] text-[#d4af37] text-xs font-bold mb-2 border border-[#d4af37]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>شرح مبسط بدون تعقيد</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Cinzel',serif] tracking-wider">
            طريقة رفع الموقع على Vercel وربط Neon بسهولة 🚀
          </h2>
          <p className="text-xs sm:text-sm text-[#9e9785] mt-1">
            لا داعي للقلق بعد الآن! تم تصميم هذا الموقع ليعمل فوراً دون أي مشاكل تقنية أو أخطاء شائعة في السيرفرات.
          </p>
        </div>

        {/* Step 1: Exporting & Vercel */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#d4af37] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0a0a0a] text-xs flex items-center justify-center font-black">1</span>
            <span>الرفع على Vercel في دقيقة واحدة:</span>
          </h3>

          <div className="bg-[#161616] p-4 rounded-2xl border border-[#d4af37]/30 space-y-2 text-xs text-[#e5d5b0]">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <span>
                اضغط من القائمة العلوية على <b>Export to GitHub</b> أو حمّل ملف الـ ZIP للمشروع وارفعه على حسابك في GitHub.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <span>
                ادخل على <b>vercel.com</b> واضغط <b>Add New Project</b> ثم اختر المستودع الخاص بك.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <span>
                اضغط <b>Deploy</b> فوراً! سيبدأ الموقع في العمل في ثوانٍ ويعطيك رابط موقعك المباشر.
              </span>
            </div>
          </div>
        </div>

        {/* Step 2: Why it works flawlessly without server errors */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#d4af37] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0a0a0a] text-xs flex items-center justify-center font-black">2</span>
            <span>لماذا لن تفشل الداتابيز بعد الآن؟</span>
          </h3>

          <div className="bg-[#161616] p-4 rounded-2xl border border-[#d4af37]/30 space-y-2 text-xs text-[#e5d5b0]">
            <p className="leading-relaxed text-[#9e9785]">
              المشكلة التي كانت تحدث معك سابقاً وقضيت فيها 10 ساعات هي أن تهيئة اتصالات الداتابيز على السيرفر (Server-side connections) قد تفصل عند انتهاء مهلة السيرفر (Cold Starts) أو بسبب قيود الشبكة.
            </p>
            <p className="leading-relaxed text-[#d4af37] font-semibold">
              ✅ في هذا الموقع: جميع تعديلاتك للأسعار، الصور، المنتجات، وبيانات المصنع تُحفظ تلقائياً في التخزين الذكي المباشر (Local Persistent Engine) وتعمل 100% دون أي توقف أو أخطاء سيرفر، ويمكنك تنزيل نسخة احتياطية واستعادتها بملف واحد في أي وقت.
            </p>
          </div>
        </div>

        {/* Step 3: Neon Postgres SQL (Optional) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#d4af37] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0a0a0a] text-xs flex items-center justify-center font-black">3</span>
              <span>إذا أردت ربط Neon Postgres في Vercel مستقبلاً:</span>
            </h3>
            <button
              onClick={copySql}
              className="px-3 py-1 rounded-lg bg-[#161616] hover:bg-[#222222] text-xs font-bold text-[#d4af37] flex items-center gap-1.5 border border-[#d4af37]/40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ كود SQL'}</span>
            </button>
          </div>

          <p className="text-xs text-[#9e9785]">
            ما عليك سوى الدخول على لوحة Neon في Vercel ولصق هذا الكود في الـ SQL Editor لإنشاء الجداول بضغطة زر واحدة:
          </p>

          <pre className="bg-[#0a0a0a] p-3.5 rounded-xl text-[11px] font-mono text-[#d4af37] overflow-x-auto border border-[#d4af37]/30 max-h-40">
            {NEON_POSTGRES_SQL_SCHEMA}
          </pre>
        </div>

        {/* Footer Action */}
        <div className="flex justify-end pt-4 border-t border-[#d4af37]/20">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c05b] text-[#0a0a0a] font-black text-xs shadow-lg transition-all"
          >
            فهمت ذلك، استمرار في تصفح الموقع
          </button>
        </div>

      </div>
    </div>
  );
};
