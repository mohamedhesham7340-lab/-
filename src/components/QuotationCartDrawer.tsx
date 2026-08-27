import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Send, 
  FileText, 
  CheckCircle, 
  Building, 
  Globe, 
  User, 
  Package, 
  Truck,
  DollarSign
} from 'lucide-react';
import { ProductItem, CartItem, QuotationMeta, CurrencyCode, ActiveView } from '../types';
import { generateWhatsAppMessage } from '../utils/storage';

interface QuotationCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: ProductItem[];
  onUpdateCartQuantity: (productId: string, quantityMT: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  meta: QuotationMeta;
  currency: CurrencyCode;
  exchangeRate: number;
  setActiveView: (view: ActiveView) => void;
  onUpdateClientMeta: (clientName: string, clientCompany: string, clientCountry: string) => void;
}

export const QuotationCartDrawer: React.FC<QuotationCartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  products,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onClearCart,
  meta,
  currency,
  exchangeRate,
  setActiveView,
  onUpdateClientMeta,
}) => {
  if (!isOpen) return null;

  const [clientName, setClientName] = useState(meta.clientContactPerson || '');
  const [clientCompany, setClientCompany] = useState(meta.clientCompanyName || '');
  const [clientCountry, setClientCountry] = useState(meta.clientCountry || '');
  const [clientNotes, setClientNotes] = useState('');

  const cartProductDetails = cart.map((item) => {
    const p = products.find((x) => x.id === item.productId);
    return {
      ...item,
      product: p,
    };
  }).filter((x) => Boolean(x.product));

  const totalMT = cart.reduce((sum, item) => sum + item.quantityMT, 0);
  const totalUSD = cart.reduce((sum, item) => {
    const p = products.find((x) => x.id === item.productId);
    return sum + (p ? p.pricePerMT * item.quantityMT : 0);
  }, 0);
  const convertedTotal = Math.round(totalUSD * exchangeRate);

  const handleSendWhatsApp = () => {
    onUpdateClientMeta(clientName, clientCompany, clientCountry);
    const msg = generateWhatsAppMessage(
      cart,
      products,
      meta,
      `${clientName} - ${clientCompany}`,
      clientCountry,
      clientNotes,
      currency,
      exchangeRate
    );
    const waUrl = `https://wa.me/${meta.sellerWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const handleOpenPdf = () => {
    onUpdateClientMeta(clientName, clientCompany, clientCountry);
    onClose();
    setActiveView('pdf_preview');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md sm:max-w-lg bg-[#0f0f0f] border-r-2 border-[#d4af37]/50 shadow-2xl flex flex-col text-[#e5d5b0] pyramid-pattern">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-[#d4af37]/30 bg-[#161616] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#d4af37] text-[#0a0a0a]">
                <ShoppingBag className="w-5 h-5 font-bold" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">سلة تسعيرة التصدير (RFQ)</h2>
                <p className="text-xs text-[#d4af37]">عرض رقم {meta.quotationNo}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#222222] hover:bg-[#d4af37] hover:text-[#0a0a0a] text-[#e5d5b0] transition-all border border-[#d4af37]/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="text-5xl opacity-80">🌾</div>
                <h3 className="text-lg font-bold text-white">السلة فارغة حالياً</h3>
                <p className="text-xs text-[#9e9785] max-w-xs mx-auto leading-relaxed">
                  تصفح كتالوج المحاصيل الزراعية والأعشاب وأضف الكميات المطلوبة بالأطنان لحساب التكلفة وإنشاء عرض الأسعار.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#0a0a0a] font-bold text-xs"
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#9e9785] pb-1 border-b border-[#d4af37]/20">
                    <span>المنتجات المختارة ({cart.length})</span>
                    <button
                      onClick={onClearCart}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      مسح الكل
                    </button>
                  </div>

                  {cartProductDetails.map(({ product, quantityMT }) => {
                    if (!product) return null;
                    const itemTotalUSD = product.pricePerMT * quantityMT;

                    return (
                      <div
                        key={product.id}
                        className="bg-[#161616] border border-[#d4af37]/30 rounded-xl p-3 flex gap-3 items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.nameAr}
                            className="w-14 h-14 rounded-lg object-cover border border-[#d4af37]/20 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#d4af37] text-[#0a0a0a] font-black">
                                {product.itemNo}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-white">{product.nameAr}</h4>
                            </div>
                            <p className="text-[11px] text-[#9e9785] font-['Cinzel',serif]">{product.nameEn}</p>
                            <p className="text-[11px] text-[#d4af37] font-semibold">
                              ${product.pricePerMT.toLocaleString()} / طن
                            </p>
                          </div>
                        </div>

                        {/* Quantity Counter & Delete */}
                        <div className="flex flex-col items-end gap-1.5">
                          <div className="flex items-center gap-1.5 bg-[#0a0a0a] px-1.5 py-1 rounded-lg border border-[#d4af37]/20">
                            <button
                              onClick={() => onUpdateCartQuantity(product.id, Math.max(1, quantityMT - 1))}
                              className="w-6 h-6 rounded bg-[#222222] hover:bg-[#d4af37] hover:text-[#0a0a0a] text-white flex items-center justify-center font-bold text-xs transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black text-white px-1">
                              {quantityMT} طن
                            </span>
                            <button
                              onClick={() => onUpdateCartQuantity(product.id, quantityMT + 1)}
                              className="w-6 h-6 rounded bg-[#222222] hover:bg-[#d4af37] hover:text-[#0a0a0a] text-white flex items-center justify-center font-bold text-xs transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-[#d4af37]">
                              ${itemTotalUSD.toLocaleString()}
                            </span>
                            <button
                              onClick={() => onRemoveFromCart(product.id)}
                              className="text-[#9e9785] hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Client Information Form */}
                <div className="bg-[#161616] p-4 rounded-xl border border-[#d4af37]/30 space-y-3">
                  <h4 className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
                    <Building className="w-4 h-4" />
                    بيانات المستورد والوجهة (اختياري)
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[#9e9785] block mb-1">اسم المسؤول / المشتري:</label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="مثال: م. أحمد عبد الله"
                        className="w-full p-2 rounded-lg bg-[#0a0a0a] border border-[#d4af37]/20 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="text-[#9e9785] block mb-1">اسم الشركة المستوردة:</label>
                      <input
                        type="text"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                        placeholder="مثال: شركة الخليج للتغذية"
                        className="w-full p-2 rounded-lg bg-[#0a0a0a] border border-[#d4af37]/20 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#9e9785] block mb-1">الدولة / ميناء الوصول المطلوب (Port of Discharge):</label>
                    <input
                      type="text"
                      value={clientCountry}
                      onChange={(e) => setClientCountry(e.target.value)}
                      placeholder="مثال: السعودية - ميناء جدة الإسلامي (Jeddah Port)"
                      className="w-full p-2 rounded-lg bg-[#0a0a0a] border border-[#d4af37]/20 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#9e9785] block mb-1">ملاحظات أو متطلبات تعبئة خاصة:</label>
                    <textarea
                      rows={2}
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      placeholder="أي اشتراطات خاصة بالتحليل أو التعبئة بعبوات خاصة..."
                      className="w-full p-2 rounded-lg bg-[#0a0a0a] border border-[#d4af37]/20 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* Summary Calculations */}
                <div className="bg-[#161616] p-4 rounded-xl border border-[#d4af37]/50 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#e5d5b0]">
                    <span>إجمالي الكمية المطلوبة:</span>
                    <span className="font-bold text-white text-sm">{totalMT} طن متري (MT)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#e5d5b0]">
                    <span>شروط الشحن المقترحة:</span>
                    <span className="font-semibold text-[#f5d77f]">FOB / CIF Alexandria Port</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#d4af37]/20">
                    <span className="text-sm font-bold text-white">القيمة الإجمالية المقدرة:</span>
                    <div className="text-left">
                      <div className="text-xl font-black text-[#d4af37]">
                        ${totalUSD.toLocaleString()} USD
                      </div>
                      {currency !== 'USD' && (
                        <div className="text-xs text-[#9e9785] font-semibold">
                          ≈ {convertedTotal.toLocaleString()} {currency}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#d4af37]/30 bg-[#161616] space-y-2.5">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full py-3.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e5c05b] text-[#0a0a0a] font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                <span className="text-lg">💬</span>
                <span>إرسال الطلب والتسعيرة عبر واتساب</span>
              </button>

              <button
                type="button"
                onClick={handleOpenPdf}
                className="w-full py-3 px-4 rounded-xl bg-[#222222] hover:bg-[#2a2a2a] text-[#e5d5b0] hover:text-white border border-[#d4af37]/30 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <FileText className="w-4 h-4 text-[#d4af37]" />
                <span>معاينة وتحميل عرض الأسعار PDF المعتمد</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
