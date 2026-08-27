import { ProductItem, QuotationMeta, CartItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_QUOTATION_META } from '../data/initialData';

const PRODUCTS_KEY = 'pharaoh_agri_products_v1';
const META_KEY = 'pharaoh_agri_meta_v1';
const CART_KEY = 'pharaoh_agri_cart_v1';

export function loadProducts(): ProductItem[] {
  try {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load products from localStorage:', err);
  }
  return INITIAL_PRODUCTS;
}

export function saveProducts(products: ProductItem[]): void {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products to localStorage:', err);
  }
}

export function loadQuotationMeta(): QuotationMeta {
  try {
    const saved = localStorage.getItem(META_KEY);
    if (saved) {
      return { ...INITIAL_QUOTATION_META, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.error('Failed to load meta from localStorage:', err);
  }
  return INITIAL_QUOTATION_META;
}

export function saveQuotationMeta(meta: QuotationMeta): void {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch (err) {
    console.error('Failed to save meta to localStorage:', err);
  }
}

export function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to load cart from localStorage:', err);
  }
  return [];
}

export function saveCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error('Failed to save cart to localStorage:', err);
  }
}

export function resetAllData(): { products: ProductItem[]; meta: QuotationMeta; cart: CartItem[] } {
  localStorage.removeItem(PRODUCTS_KEY);
  localStorage.removeItem(META_KEY);
  localStorage.removeItem(CART_KEY);
  return {
    products: INITIAL_PRODUCTS,
    meta: INITIAL_QUOTATION_META,
    cart: [],
  };
}

export function exportBackupJSON(products: ProductItem[], meta: QuotationMeta): void {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    products,
    quotationMeta: meta,
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pharaoh_agri_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateWhatsAppMessage(
  cart: CartItem[],
  products: ProductItem[],
  meta: QuotationMeta,
  clientName: string,
  clientCountry: string,
  customNotes: string,
  currency: 'USD' | 'EUR' | 'EGP' = 'USD',
  exchangeRate: number = 1
): string {
  const selectedDetails = cart.map((item, idx) => {
    const p = products.find((x) => x.id === item.productId);
    if (!p) return '';
    const unitPrice = Math.round(p.pricePerMT * exchangeRate);
    const itemTotal = Math.round(p.pricePerMT * item.quantityMT * exchangeRate);
    return `${idx + 1}. *${p.nameAr} (${p.nameEn})*
   • البند: ${p.itemNo}
   • الكمية المطلوبة: ${item.quantityMT} طن متري (MT)
   • التعبئة: ${p.packagingAr} (${p.packagingEn})
   • السعر/طن: $${p.pricePerMT.toLocaleString()} USD (${unitPrice.toLocaleString()} ${currency})
   • الإجمالي المقدر: $${(p.pricePerMT * item.quantityMT).toLocaleString()} USD`;
  }).filter(Boolean).join('\n\n');

  const totalMT = cart.reduce((acc, item) => acc + item.quantityMT, 0);
  const totalUSD = cart.reduce((acc, item) => {
    const p = products.find((x) => x.id === item.productId);
    return acc + (p ? p.pricePerMT * item.quantityMT : 0);
  }, 0);

  const message = `🏛️ *طلب تسعيرة وتوريد رسمي - Pharaoh Agri Exports* 🇪🇬
━━━━━━━━━━━━━━━━━━━━
📄 *رقم مرجع العرض:* ${meta.quotationNo}
📅 *التاريخ:* ${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
👤 *مقدم من:* ${clientName || 'عميل محترم'}
🌍 *الدولة / ميناء الوصول:* ${clientCountry || 'غير محدد'}

📦 *المنتجات المطلوبة:*
${selectedDetails || 'طلب استفسار عام'}

━━━━━━━━━━━━━━━━━━━━
📊 *إجمالي الكمية:* ${totalMT} طن متري (MT)
💰 *إجمالي القيمة التقديرية:* $${totalUSD.toLocaleString()} USD (${Math.round(totalUSD * exchangeRate).toLocaleString()} ${currency})
🚢 *شروط التسليم المقترحة:* ${meta.deliveryTermsAr}
💳 *شروط الدفع:* ${meta.paymentTermsAr}

${customNotes ? `📝 *ملاحظات العميل:* ${customNotes}\n━━━━━━━━━━━━━━━━━━━━\n` : ''}
يرجى تأكيد الأسعار الحالية وحجز الحصة التصديرية وتأكيد موعد الشحن.
شكراً لكم!`;

  return message;
}

export const NEON_POSTGRES_SQL_SCHEMA = `-- ==========================================
-- Pharaoh Agri Exports - Neon Postgres Schema
-- For Vercel + Neon Database Integration
-- ==========================================

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    item_no VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    category_name_ar VARCHAR(100) NOT NULL,
    category_name_en VARCHAR(100) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    packaging_ar VARCHAR(100) NOT NULL,
    packaging_en VARCHAR(100) NOT NULL,
    price_per_mt NUMERIC(10, 2) NOT NULL,
    fcl_20 VARCHAR(50) NOT NULL,
    fcl_40 VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    in_stock BOOLEAN DEFAULT true,
    min_order_mt NUMERIC(10, 2) DEFAULT 10,
    hs_code VARCHAR(50),
    moisture VARCHAR(50),
    purity VARCHAR(50),
    shelf_life VARCHAR(50),
    origin VARCHAR(100) DEFAULT 'Egypt',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quotation_meta (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'default',
    quotation_no VARCHAR(50) NOT NULL,
    date_str VARCHAR(100) NOT NULL,
    valid_days INT DEFAULT 15,
    currency VARCHAR(100) DEFAULT 'USD per Metric Ton (MT)',
    seller_company_name_ar TEXT NOT NULL,
    seller_company_name_en TEXT NOT NULL,
    seller_tagline_ar TEXT,
    seller_tagline_en TEXT,
    seller_phone VARCHAR(50),
    seller_whatsapp VARCHAR(50),
    seller_email VARCHAR(100),
    seller_address_ar TEXT,
    seller_address_en TEXT,
    delivery_terms_ar TEXT,
    delivery_terms_en TEXT,
    payment_terms_ar TEXT,
    payment_terms_en TEXT,
    quality_guarantee_ar TEXT,
    quality_guarantee_en TEXT,
    authorized_signatory TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;
