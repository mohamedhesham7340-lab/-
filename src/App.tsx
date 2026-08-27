import React, { useState, useEffect } from 'react';
import { 
  ProductItem, 
  QuotationMeta, 
  CartItem, 
  ActiveView, 
  CurrencyCode 
} from './types';
import { 
  loadCart, 
  saveCart
} from './utils/storage';
import { INITIAL_PRODUCTS, INITIAL_QUOTATION_META } from './data/initialData';
import { fetchProducts, fetchMeta, saveProduct, saveMeta, deleteProduct } from './utils/api';
import { Header } from './components/Header';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuotationCartDrawer } from './components/QuotationCartDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { PdfQuotationView } from './components/PdfQuotationView';
import { VercelGuideModal } from './components/VercelGuideModal';
import { FloatingWhatsAppWidget } from './components/FloatingWhatsAppWidget';
import { 
  ShoppingBag, 
  FileText, 
  Settings, 
  Sparkles, 
  ShieldCheck, 
  Globe2, 
  Phone, 
  Mail, 
  MapPin,
  ArrowUp
} from 'lucide-react';

export default function App() {
  const [products, setProductsState] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [meta, setMetaState] = useState<QuotationMeta>(INITIAL_QUOTATION_META);
  const [cart, setCartState] = useState<CartItem[]>(loadCart);

  const [activeView, setActiveView] = useState<ActiveView>('catalog');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<ProductItem | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const [isFetching, setIsFetching] = useState(true);

  // Fetch initial data from DB
  useEffect(() => {
    async function loadData() {
      try {
        const [dbProducts, dbMeta] = await Promise.all([
          fetchProducts(),
          fetchMeta()
        ]);
        if (dbProducts && dbProducts.length > 0) {
          setProductsState(dbProducts);
        }
        if (dbMeta) {
          setMetaState(dbMeta);
        }
      } catch (err) {
        console.error('Failed to fetch from DB:', err);
      } finally {
        setIsFetching(false);
      }
    }
    loadData();
  }, []);

  // Exchange rates relative to USD
  const exchangeRates: Record<CurrencyCode, number> = {
    USD: 1.0,
    EUR: 0.92,
    EGP: 48.6,
  };
  const currentRate = exchangeRates[currency];

  // Auto-sync products to DB on change
  const setProducts = async (newProds: ProductItem[]) => {
    const deleted = products.filter(p => !newProds.find(n => n.id === p.id));
    const modified = newProds.filter(n => {
      const old = products.find(p => p.id === n.id);
      return !old || JSON.stringify(old) !== JSON.stringify(n);
    });

    setProductsState(newProds);

    try {
      for (const p of deleted) {
        await deleteProduct(p.id);
      }
      for (const p of modified) {
        await saveProduct(p);
      }
    } catch (err) {
      console.error('Failed to sync products to DB:', err);
    }
  };

  // Auto-sync meta to DB on change
  const setMeta = async (newMeta: QuotationMeta) => {
    setMetaState(newMeta);
    try {
      await saveMeta(newMeta);
    } catch (err) {
      console.error('Failed to save meta to DB:', err);
    }
  };

  // Auto-sync cart to storage on change
  const setCart = (newCart: CartItem[]) => {
    setCartState(newCart);
    saveCart(newCart);
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  // Cart operations
  const handleAddToCart = (
    product: ProductItem, 
    quantityMT: number, 
    containerChoice: '20FCL' | '40FCL' | 'custom'
  ) => {
    setCartState((prev) => {
      const existingIdx = prev.findIndex((item) => item.productId === product.id);
      let updated: CartItem[];
      if (existingIdx > -1) {
        updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantityMT: updated[existingIdx].quantityMT + quantityMT,
          containerChoice,
        };
      } else {
        updated = [
          ...prev,
          {
            productId: product.id,
            quantityMT,
            containerChoice,
            packagingChoice: product.packagingAr,
          },
        ];
      }
      saveCart(updated);
      return updated;
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantityMT: number) => {
    setCartState((prev) => {
      const updated = prev.map((item) =>
        item.productId === productId ? { ...item, quantityMT } : item
      );
      saveCart(updated);
      return updated;
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartState((prev) => {
      const updated = prev.filter((item) => item.productId !== productId);
      saveCart(updated);
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleUpdateClientMeta = (
    clientName: string, 
    clientCompany: string, 
    clientCountry: string
  ) => {
    const updated = {
      ...meta,
      clientContactPerson: clientName || meta.clientContactPerson,
      clientCompanyName: clientCompany || meta.clientCompanyName,
      clientCountry: clientCountry || meta.clientCountry,
    };
    setMeta(updated);
  };

  const totalCartMT = cart.reduce((sum, item) => sum + item.quantityMT, 0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5d5b0] flex flex-col selection:bg-[#d4af37] selection:text-[#0a0a0a] pyramid-pattern">
      
      {/* Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        currency={currency}
        setCurrency={setCurrency}
        cartCount={cart.length}
        totalCartMT={totalCartMT}
        setIsCartOpen={setIsCartOpen}
        meta={meta}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeView === 'catalog' && (
          <ProductCatalog
            products={products}
            currency={currency}
            exchangeRate={currentRate}
            onOpenProductModal={(p) => setSelectedProductModal(p)}
            onAddToCart={handleAddToCart}
            meta={meta}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'pdf_preview' && (
          <PdfQuotationView
            products={products}
            meta={meta}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            products={products}
            setProducts={setProducts}
            meta={meta}
            setMeta={setMeta}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'guide' && (
          <AdminDashboard
            products={products}
            setProducts={setProducts}
            meta={meta}
            setMeta={setMeta}
            setActiveView={setActiveView}
          />
        )}
      </main>

      {/* Modals & Slide-overs */}
      <ProductDetailModal
        product={selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
        currency={currency}
        exchangeRate={currentRate}
        onAddToCart={handleAddToCart}
        meta={meta}
      />

      <QuotationCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        products={products}
        onUpdateCartQuantity={handleUpdateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        meta={meta}
        currency={currency}
        exchangeRate={currentRate}
        setActiveView={setActiveView}
        onUpdateClientMeta={handleUpdateClientMeta}
      />

      {isGuideModalOpen && (
        <VercelGuideModal onClose={() => setIsGuideModalOpen(false)} />
      )}

      {/* Floating Instant WhatsApp Contact Widget */}
      <FloatingWhatsAppWidget meta={meta} />

      {/* Scroll to Top Floating Button */}
      <button
        onClick={scrollToTop}
        className="no-print fixed bottom-6 left-6 z-30 p-3 rounded-full bg-[#161616] hover:bg-[#d4af37] text-[#e5d5b0] hover:text-[#0a0a0a] border border-[#d4af37]/40 shadow-2xl transition-all"
        title="الصعود للأعلى"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Sophisticated Dark Pharaonic Footer */}
      <footer className="no-print bg-[#0f0f0f] border-t border-[#d4af37]/30 text-[#9e9785] text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Brand & Identity */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 border border-[#d4af37] rotate-45 flex items-center justify-center bg-[#161616]">
                  <span className="-rotate-45 text-sm text-[#d4af37]">𓋹</span>
                </div>
                <span className="text-lg font-bold text-white font-['Cinzel',serif] tracking-wider">
                  {meta.sellerCompanyNameEn}
                </span>
              </div>
              <p className="text-[#f5d77f] font-semibold text-sm">
                {meta.sellerCompanyNameAr}
              </p>
              <p className="text-[#9e9785] text-xs leading-relaxed max-w-md">
                {meta.sellerTaglineAr} — مصنع معتمد لإنتاج وتجفيف وتجهيز وتصدير الخضروات والأعشاب الطبية بأعلى المواصفات القياسية العالمية.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <span className="px-2.5 py-1 rounded-md bg-[#161616] text-[#d4af37] border border-[#d4af37]/30 text-[10px] font-bold">
                  ISO 22000 Certified
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#161616] text-[#d4af37] border border-[#d4af37]/30 text-[10px] font-bold">
                  FDA Registered
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#161616] text-[#d4af37] border border-[#d4af37]/30 text-[10px] font-bold">
                  Egyptian Origin 🇪🇬
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest">
                روابط سريعة
              </h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setActiveView('catalog')}
                    className="hover:text-[#f5d77f] transition-colors"
                  >
                    كتالوج المنتجات والأسعار
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveView('pdf_preview')}
                    className="hover:text-[#f5d77f] transition-colors"
                  >
                    عرض الأسعار المعتمد PDF
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveView('admin')}
                    className="hover:text-[#f5d77f] transition-colors"
                  >
                    لوحة التحكم والإدارة
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setIsGuideModalOpen(true)}
                    className="hover:text-[#f5d77f] transition-colors"
                  >
                    شرح رفع Vercel و Neon
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Details */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest">
                التواصل والتصدير
              </h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="text-[#e5d5b0]">{meta.sellerPhone}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sm">💬</span>
                  <a 
                    href={`https://wa.me/${meta.sellerWhatsApp.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#d4af37] hover:underline font-semibold"
                  >
                    واتساب: {meta.sellerWhatsApp}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="text-[#e5d5b0]">{meta.sellerEmail}</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                  <span className="text-[#e5d5b0]">{meta.sellerAddressAr}</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-[#d4af37]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9e9785]">
            <div>
              جميع الحقوق محفوظة © {new Date().getFullYear()} {meta.sellerCompanyNameAr}
            </div>
            <div className="text-[11px] text-[#9e9785]">
              Ref: <span className="font-mono text-[#d4af37]">{meta.quotationNo}</span> • Prices in USD / MT
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
