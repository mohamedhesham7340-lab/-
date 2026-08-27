import React, { useState } from 'react';
import { 
  X, 
  Package, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Award, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ExternalLink,
  Info
} from 'lucide-react';
import { ProductItem, CurrencyCode, QuotationMeta } from '../types';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  currency: CurrencyCode;
  exchangeRate: number;
  onAddToCart: (product: ProductItem, quantityMT: number, containerChoice: '20FCL' | '40FCL' | 'custom') => void;
  meta: QuotationMeta;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  currency,
  exchangeRate,
  onAddToCart,
  meta,
}) => {
  if (!product) return null;

  const [quantityMT, setQuantityMT] = useState<number>(
    parseInt(product.fcl20.replace(/[^0-9]/g, '')) || product.minOrderMT || 10
  );
  const [containerChoice, setContainerChoice] = useState<'20FCL' | '40FCL' | 'custom'>('20FCL');
  const [isAdded, setIsAdded] = useState(false);

  const convertedPrice = Math.round(product.pricePerMT * exchangeRate);
  const totalPriceUSD = product.pricePerMT * quantityMT;
  const convertedTotalPrice = Math.round(totalPriceUSD * exchangeRate);

  const handleSelectContainer = (type: '20FCL' | '40FCL' | 'custom') => {
    setContainerChoice(type);
    if (type === '20FCL') {
      const num = parseInt(product.fcl20.replace(/[^0-9]/g, '')) || 20;
      setQuantityMT(num);
    } else if (type === '40FCL') {
      const num = parseInt(product.fcl40.replace(/[^0-9]/g, '')) || 40;
      setQuantityMT(num);
    }
  };

  const handleAdd = () => {
    onAddToCart(product, quantityMT, containerChoice);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const directWhatsAppUrl = `https://wa.me/${meta.sellerWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `🏛️ *استفسار تصدير - Pharaoh Agri Exports*\n\nالمنتج: *${product.nameAr} (${product.nameEn})*\nكود البند: ${product.itemNo}\nالكمية المطلوبة: ${quantityMT} طن متري (MT)\nالتعبئة: ${product.packagingAr}\nالسعر الحالي: $${product.pricePerMT} USD/MT\nالإجمالي التقديري: $${totalPriceUSD.toLocaleString()} USD\n\nيرجى تأكيد إمكانية الحجز وميناء الشحن.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#111111] border-2 border-[#d4af37]/50 rounded-2xl shadow-2xl p-6 text-[#e5d5b0] pyramid-pattern"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-[#1a1a1a] hover:bg-[#d4af37] hover:text-[#0a0a0a] text-[#e5d5b0] transition-all z-10 border border-[#d4af37]/30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-[#d4af37]/30 pb-4 mb-6">
          <div className="px-3 py-1 rounded bg-[#d4af37] text-[#0a0a0a] font-black text-sm">
            بند رقم {product.itemNo}
          </div>
          <div>
            <span className="text-xs text-[#d4af37] font-semibold">{product.categoryNameAr} • {product.categoryNameEn}</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{product.nameAr}</h2>
            <p className="text-sm text-[#9e9785] font-['Cinzel',serif]">{product.nameEn}</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Image & Quick Badges */}
          <div className="space-y-4">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-[#d4af37]/40 bg-[#0a0a0a] group">
              <img 
                src={product.imageUrl} 
                alt={product.nameAr}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#0a0a0a]/90 text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>جودة تصديرية درجة أولى</span>
              </div>
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded bg-[#0a0a0a]/90 text-white border border-[#d4af37]/30 text-xs font-semibold">
                🇪🇬 منشأ مصر
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="bg-[#161616] rounded-xl p-4 border border-[#d4af37]/20 space-y-2.5">
              <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                المواصفات الفنية والقياسية
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#0a0a0a] p-2 rounded border border-[#d4af37]/15">
                  <span className="text-[#9e9785] block">نسبة الرطوبة (Moisture):</span>
                  <span className="font-bold text-white">{product.moisture || 'أقل من 6%'}</span>
                </div>
                <div className="bg-[#0a0a0a] p-2 rounded border border-[#d4af37]/15">
                  <span className="text-[#9e9785] block">درجة النقاء (Purity):</span>
                  <span className="font-bold text-[#d4af37]">{product.purity || '99.5%'}</span>
                </div>
                <div className="bg-[#0a0a0a] p-2 rounded border border-[#d4af37]/15">
                  <span className="text-[#9e9785] block">فترة الصلاحية (Shelf Life):</span>
                  <span className="font-bold text-white">{product.shelfLife || '24 شهر'}</span>
                </div>
                <div className="bg-[#0a0a0a] p-2 rounded border border-[#d4af37]/15">
                  <span className="text-[#9e9785] block">كود التبنيد (HS Code):</span>
                  <span className="font-bold text-[#f5d77f] font-mono">{product.hsCode || '07122000'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Ordering Section */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-[#d4af37] mb-1.5">الوصف واستخدامات المنتج</h4>
                <p className="text-xs sm:text-sm text-[#e5d5b0] leading-relaxed bg-[#161616] p-3 rounded-xl border border-[#d4af37]/15">
                  {product.descriptionAr}
                </p>
                <p className="text-xs text-[#9e9785] mt-1 italic font-['Cinzel',serif]">
                  {product.descriptionEn}
                </p>
              </div>

              {/* Packaging & Container Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#161616] p-3 rounded-xl border border-[#d4af37]/30">
                  <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold mb-1">
                    <Package className="w-3.5 h-3.5" />
                    نوع التعبئة
                  </div>
                  <div className="text-sm font-bold text-white">{product.packagingAr}</div>
                  <div className="text-xs text-[#9e9785]">{product.packagingEn}</div>
                </div>

                <div className="bg-[#161616] p-3 rounded-xl border border-[#d4af37]/30">
                  <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold mb-1">
                    <Truck className="w-3.5 h-3.5" />
                    حمولة الحاويات
                  </div>
                  <div className="text-xs font-bold text-white">20&apos; FCL: <span className="text-[#d4af37]">{product.fcl20}</span></div>
                  <div className="text-xs font-bold text-white">40&apos; FCL: <span className="text-[#d4af37]">{product.fcl40}</span></div>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-[#161616] p-4 rounded-xl border border-[#d4af37]/50">
                <span className="text-xs text-[#d4af37] font-medium block">السعر المعتمد للطن المتري (FOB/CIF)</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#d4af37]">
                    ${product.pricePerMT.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#e5d5b0]">USD / MT</span>
                  {currency !== 'USD' && (
                    <span className="text-sm text-[#f5d77f] font-semibold mr-auto">
                      ≈ {convertedPrice.toLocaleString()} {currency}
                    </span>
                  )}
                </div>
              </div>

              {/* Container Quantity Presets */}
              <div>
                <label className="text-xs font-bold text-[#d4af37] block mb-2">
                  تحديد حجم الطلبية والحاوية
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectContainer('20FCL')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      containerChoice === '20FCL'
                        ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37]'
                        : 'bg-[#161616] text-[#e5d5b0] border-[#d4af37]/20 hover:border-[#d4af37]'
                    }`}
                  >
                    حاوية 20 قدم
                    <span className="block text-[10px] opacity-80">({product.fcl20})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectContainer('40FCL')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      containerChoice === '40FCL'
                        ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37]'
                        : 'bg-[#161616] text-[#e5d5b0] border-[#d4af37]/20 hover:border-[#d4af37]'
                    }`}
                  >
                    حاوية 40 قدم
                    <span className="block text-[10px] opacity-80">({product.fcl40})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectContainer('custom')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      containerChoice === 'custom'
                        ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37]'
                        : 'bg-[#161616] text-[#e5d5b0] border-[#d4af37]/20 hover:border-[#d4af37]'
                    }`}
                  >
                    كمية مخصصة
                    <span className="block text-[10px] opacity-80">(طن متري)</span>
                  </button>
                </div>

                {/* Counter */}
                <div className="flex items-center justify-between mt-3 bg-[#0a0a0a] p-2 rounded-xl border border-[#d4af37]/20">
                  <span className="text-xs text-[#e5d5b0] font-semibold px-2">إجمالي الأطنان:</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantityMT(Math.max(1, quantityMT - 1))}
                      className="w-8 h-8 rounded-lg bg-[#161616] hover:bg-[#d4af37] hover:text-[#0a0a0a] text-[#e5d5b0] flex items-center justify-center font-bold transition-all border border-[#d4af37]/30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-base font-black text-white w-12 text-center">
                      {quantityMT} <span className="text-xs font-normal text-[#d4af37]">طن</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantityMT(quantityMT + 1)}
                      className="w-8 h-8 rounded-lg bg-[#161616] hover:bg-[#d4af37] hover:text-[#0a0a0a] text-[#e5d5b0] flex items-center justify-center font-bold transition-all border border-[#d4af37]/30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="flex items-center justify-between pt-2 border-t border-[#d4af37]/20 text-xs sm:text-sm">
                <span className="text-[#9e9785]">الإجمالي المقدر ({quantityMT} طن):</span>
                <span className="text-lg font-black text-[#d4af37]">
                  ${totalPriceUSD.toLocaleString()} USD
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-4">
              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#d4af37] hover:bg-[#e5c05b] text-[#0a0a0a]'
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
                    <span>تمت الإضافة بنجاح!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>إضافة إلى مسودة العرض</span>
                  </>
                )}
              </button>

              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#161616] hover:bg-[#222222] text-[#d4af37] border border-[#d4af37]/40 font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span className="text-base">💬</span>
                <span>طلب واتساب فوري</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
