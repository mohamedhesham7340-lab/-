import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  Package, 
  Truck, 
  Award, 
  Eye, 
  Plus, 
  FileText, 
  MessageCircle,
  ExternalLink,
  Flame,
  ArrowUpDown,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { ProductItem, CurrencyCode, QuotationMeta, ActiveView } from '../types';

interface ProductCatalogProps {
  products: ProductItem[];
  currency: CurrencyCode;
  exchangeRate: number;
  onOpenProductModal: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem, quantityMT: number, containerChoice: '20FCL' | '40FCL' | 'custom') => void;
  meta: QuotationMeta;
  setActiveView: (view: ActiveView) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  currency,
  exchangeRate,
  onOpenProductModal,
  onAddToCart,
  meta,
  setActiveView,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'itemNo' | 'priceAsc' | 'priceDesc' | 'name'>('itemNo');
  const [addedItemIds, setAddedItemIds] = useState<{ [key: string]: boolean }>({});

  const categories = useMemo(() => {
    const list = [
      { id: 'all', nameAr: 'جميع المنتجات', nameEn: 'All Products', icon: '🌾' },
      { id: 'onion', nameAr: 'منتجات البصل', nameEn: 'Onion Products', icon: '🧅' },
      { id: 'garlic', nameAr: 'منتجات الثوم', nameEn: 'Garlic Products', icon: '🧄' },
      { id: 'carrot', nameAr: 'الجزر المجفف', nameEn: 'Dried Carrot', icon: '🥕' },
      { id: 'beetroot', nameAr: 'البنجر المجفف', nameEn: 'Dried Beetroot', icon: '🟣' },
      { id: 'potato_herbs', nameAr: 'البطاطس والأعشاب', nameEn: 'Potato & Herbs', icon: '🌿' },
      { id: 'hibiscus', nameAr: 'الكركديه الأسواني', nameEn: 'Hibiscus', icon: '🌺' },
    ];
    return list;
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          p.nameAr.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.itemNo.toLowerCase().includes(q) ||
          p.categoryNameAr.toLowerCase().includes(q) ||
          p.packagingAr.toLowerCase().includes(q);
        return matchesCat && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.pricePerMT - b.pricePerMT;
        if (sortBy === 'priceDesc') return b.pricePerMT - a.pricePerMT;
        if (sortBy === 'name') return a.nameAr.localeCompare(b.nameAr, 'ar');
        return a.itemNo.localeCompare(b.itemNo, undefined, { numeric: true });
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (product: ProductItem) => {
    const defaultMT = parseInt(product.fcl20.replace(/[^0-9]/g, '')) || product.minOrderMT || 10;
    onAddToCart(product, defaultMT, '20FCL');
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Pharaonic Luxury Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0f0f0f] border-2 border-[#d4af37]/30 shadow-2xl p-6 sm:p-10 pyramid-pattern">
        
        {/* Decorative Pharaonic Corner Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#d4af37]/10 to-transparent pointer-events-none rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#d4af37]/10 to-transparent pointer-events-none rounded-tr-full"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161616] border border-[#d4af37]/50 text-[#d4af37] text-xs sm:text-sm font-bold shadow-md tracking-wider">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>عرض أسعار تجاري رسمي معتمد • {meta.quotationNo}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight font-['Cinzel',serif] tracking-wider">
            {meta.sellerCompanyNameEn}
          </h1>
          <p className="text-lg sm:text-2xl font-bold text-[#d4af37]">
            {meta.sellerCompanyNameAr}
          </p>
          <p className="text-sm sm:text-base text-[#e5d5b0] opacity-80 max-w-2xl mx-auto leading-relaxed">
            {meta.sellerTaglineAr} — محاصيل مجففة طبيعياً ومطابقة لأعلى المواصفات القياسية للتصدير للأسواق الأوروبية والخليجية والعالمية.
          </p>

          {/* Key Export Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 max-w-3xl mx-auto">
            <div className="bg-[#161616] border border-[#d4af37]/30 rounded-xl p-3 text-center">
              <span className="text-lg sm:text-2xl font-black text-[#d4af37] block">16+</span>
              <span className="text-[11px] sm:text-xs text-[#9e9785] font-medium">صنف تصديري معتمد</span>
            </div>
            <div className="bg-[#161616] border border-[#d4af37]/30 rounded-xl p-3 text-center">
              <span className="text-lg sm:text-2xl font-black text-[#d4af37] block">100%</span>
              <span className="text-[11px] sm:text-xs text-[#9e9785] font-medium">جودة قياسية ونقاء</span>
            </div>
            <div className="bg-[#161616] border border-[#d4af37]/30 rounded-xl p-3 text-center">
              <span className="text-lg sm:text-2xl font-black text-[#d4af37] block">20&apos; &amp; 40&apos;</span>
              <span className="text-[11px] sm:text-xs text-[#9e9785] font-medium">حمولات حاويات كاملة FCL</span>
            </div>
            <div className="bg-[#161616] border border-[#d4af37]/30 rounded-xl p-3 text-center">
              <span className="text-lg sm:text-2xl font-black text-[#d4af37] block">15 يوماً</span>
              <span className="text-[11px] sm:text-xs text-[#9e9785] font-medium">صلاحية الأسعار الحالية</span>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('pdf_preview')}
              className="px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c05b] text-[#0a0a0a] font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>تحميل عرض الأسعار PDF المعتمد</span>
            </button>
            <a
              href={`https://wa.me/${meta.sellerWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `مرحباً، أود استلام نسخة من عرض الأسعار الحالي وكراسة المواصفات (${meta.quotationNo})`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl bg-[#161616] hover:bg-[#222222] text-[#d4af37] font-bold text-sm border border-[#d4af37]/40 flex items-center gap-2 transition-all shadow-md"
            >
              <span>💬</span>
              <span>محادثة فورية مع إدارة التصدير</span>
            </a>
          </div>

        </div>
      </section>

      {/* Filter and Search Controls */}
      <section className="space-y-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const count = cat.id === 'all' 
              ? products.length 
              : products.filter((p) => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37] shadow-lg'
                    : 'bg-[#161616] text-[#e5d5b0] border-[#d4af37]/20 hover:border-[#d4af37]/60 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameAr}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isSelected ? 'bg-[#0a0a0a] text-[#d4af37]' : 'bg-[#222222] text-[#e5d5b0]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111111] p-3 rounded-2xl border border-[#d4af37]/25">
          
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#9e9785] absolute top-3.5 right-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، رقم البند (1.1)، التعبئة..."
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-[#1a1a1a] border border-[#d4af37]/20 text-sm text-white placeholder-[#9e9785] focus:outline-none focus:border-[#d4af37]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2.5 text-xs text-[#9e9785] hover:text-white"
              >
                مسح
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-[#e5d5b0]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>ترتيب:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#d4af37]"
            >
              <option value="itemNo">حسب رقم البند التسلسلي</option>
              <option value="priceAsc">السعر: من الأقل للأعلى</option>
              <option value="priceDesc">السعر: من الأعلى للأقل</option>
              <option value="name">حسب الاسم أبجدياً</option>
            </select>

            <span className="text-xs text-[#9e9785] hidden sm:inline">
              (تم العثور على {filteredProducts.length} منتج)
            </span>
          </div>

        </div>

      </section>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#161616] rounded-2xl border border-[#d4af37]/20 space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-lg font-bold text-white">لم يتم العثور على منتجات مطابقة للبحث</h3>
          <p className="text-sm text-[#9e9785]">جرب تغيير كلمات البحث أو اختيار تصنيف آخر</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#d4af37] text-[#0a0a0a] font-bold text-xs"
          >
            عرض جميع المنتجات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const convertedPrice = Math.round(product.pricePerMT * exchangeRate);
            const isAdded = !!addedItemIds[product.id];

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between bg-[#161616] rounded-2xl border border-[#d4af37]/25 hover:border-[#d4af37] transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/10"
              >
                {/* Top Image Section */}
                <div>
                  <div className="relative aspect-4/3 overflow-hidden bg-[#0a0a0a] border-b border-[#d4af37]/10">
                    <img
                      src={product.imageUrl}
                      alt={product.nameAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    
                    {/* Item Number Badge */}
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded bg-[#d4af37] text-[#0a0a0a] font-black text-[11px] shadow">
                      بند {product.itemNo}
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#0a0a0a]/90 text-[#d4af37] border border-[#d4af37]/30 text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse"></span>
                      <span>تصدير معتمد</span>
                    </div>

                    {/* Quick View Button Overlay */}
                    <button
                      onClick={() => onOpenProductModal(product)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs"
                    >
                      <Eye className="w-4 h-4 text-[#d4af37]" />
                      <span>عرض المواصفات الكاملة</span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    
                    <div className="space-y-1">
                      <div className="text-[11px] text-[#d4af37] font-semibold">
                        {product.categoryNameAr} • {product.categoryNameEn}
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">
                        {product.nameAr}
                      </h3>
                      <p className="text-xs text-[#9e9785] font-['Cinzel',serif]">
                        {product.nameEn}
                      </p>
                    </div>

                    {/* Packaging & Container Capacity Chips */}
                    <div className="space-y-1.5 text-[11px] bg-[#0f0f0f] p-2.5 rounded-xl border border-[#d4af37]/15">
                      <div className="flex items-center justify-between text-[#e5d5b0]">
                        <span className="flex items-center gap-1 text-[#9e9785]">
                          <Package className="w-3 h-3 text-[#d4af37]" />
                          التعبئة:
                        </span>
                        <span className="font-bold text-white">{product.packagingAr}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#e5d5b0] pt-1 border-t border-white/5">
                        <span className="flex items-center gap-1 text-[#9e9785]">
                          <Truck className="w-3 h-3 text-[#d4af37]" />
                          حمولة الحاويات:
                        </span>
                        <span className="font-semibold text-[#d4af37]">
                          20&apos;: {product.fcl20} | 40&apos;: {product.fcl40}
                        </span>
                      </div>
                    </div>

                    {/* Price Block */}
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-[#9e9785] block">السعر للطن المتري</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-[#d4af37]">
                            ${product.pricePerMT.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#e5d5b0]">USD / MT</span>
                        </div>
                      </div>

                      {currency !== 'USD' && (
                        <div className="text-left">
                          <span className="text-[10px] text-[#9e9785] block">المعادل</span>
                          <span className="text-xs font-bold text-[#f5d77f]">
                            {convertedPrice.toLocaleString()} {currency}
                          </span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Footer Card Actions */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#d4af37] hover:bg-[#e5c05b] text-[#0a0a0a] shadow-md'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>تمت الإضافة!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>أضف للعرض</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onOpenProductModal(product)}
                    className="py-2 px-3 rounded-xl bg-[#222222] hover:bg-[#2a2a2a] text-[#e5d5b0] hover:text-white border border-[#d4af37]/25 font-semibold text-xs flex items-center justify-center gap-1"
                  >
                    <span>تفاصيل</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Trust & Guarantee Banner */}
      <section className="bg-[#111111] p-6 rounded-3xl border border-[#d4af37]/30 text-center space-y-4">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="inline-flex p-2 rounded-full bg-[#d4af37]/15 text-[#d4af37] mb-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">ضمان الجودة والمواصفات التصديرية القياسية</h3>
          <p className="text-xs sm:text-sm text-[#9e9785] leading-relaxed">
            {meta.qualityGuaranteeAr} جميع شحناتنا تخضع لفحص مخبري دقيق وإصدار شهادات الصحة النباتية وشهادات المنشأ المعتمدة من الهيئة العامة للرقابة على الصادرات والواردات.
          </p>
        </div>
      </section>

    </div>
  );
};
