import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  AlertCircle, 
  Package, 
  DollarSign, 
  FileText, 
  Layers, 
  Database, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Copy,
  Image as ImageIcon,
  Building,
  Phone,
  Mail,
  Shield,
  Clock
} from 'lucide-react';
import { ProductItem, QuotationMeta, ActiveView } from '../types';
import { exportBackupJSON, resetAllData, NEON_POSTGRES_SQL_SCHEMA } from '../utils/storage';

interface AdminDashboardProps {
  products: ProductItem[];
  setProducts: (products: ProductItem[]) => void;
  meta: QuotationMeta;
  setMeta: (meta: QuotationMeta) => void;
  setActiveView: (view: ActiveView) => void;
}

const PRESET_SAMPLE_IMAGES = [
  { name: 'شرائح بصل مجفف', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80' },
  { name: 'بودرة بصل ناعمة', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80' },
  { name: 'جرانيول بصل', url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80' },
  { name: 'بودرة ثوم', url: 'https://images.unsplash.com/photo-1588615419957-c6b8bf228ce9?auto=format&fit=crop&w=600&q=80' },
  { name: 'ثوم مفروم / مينسد', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },
  { name: 'جزر مجفف شرائح', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80' },
  { name: 'جزر مجفف بودرة', url: 'https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=600&q=80' },
  { name: 'بنجر مجفف بودرة', url: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=600&q=80' },
  { name: 'بودرة بطاطس', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80' },
  { name: 'بقدونس مجفف', url: 'https://images.unsplash.com/photo-1594951478519-5d3c907b22ff?auto=format&fit=crop&w=600&q=80' },
  { name: 'نعناع مجفف', url: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80' },
  { name: 'ريحان مجفف', url: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80' },
  { name: 'كركديه شرائح', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80' },
  { name: 'كركديه زهور كاملة', url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  setProducts,
  meta,
  setMeta,
  setActiveView,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'meta' | 'database' | 'guide'>('products');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Edit / Add product state
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [productForm, setProductForm] = useState<Partial<ProductItem>>({});

  // Meta form state
  const [metaForm, setMetaForm] = useState<QuotationMeta>(meta);

  const showNotification = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleOpenAddProduct = () => {
    setProductForm({
      id: 'prod-' + Date.now(),
      itemNo: `${(products.length + 1).toString()}.1`,
      category: 'other',
      categoryNameAr: 'منتجات عامة',
      categoryNameEn: 'General Crops',
      nameAr: '',
      nameEn: '',
      packagingAr: 'شيكارة 25 كجم',
      packagingEn: 'Bag 25 kg',
      pricePerMT: 3000,
      fcl20: '20 MT',
      fcl40: '40 MT',
      imageUrl: PRESET_SAMPLE_IMAGES[0].url,
      descriptionAr: 'منتج مجفف عالي الجودة مطابق للمواصفات القياسية.',
      descriptionEn: 'High-grade dehydrated agricultural crop.',
      inStock: true,
      minOrderMT: 10,
      hsCode: '07129090',
      moisture: 'Max 6%',
      purity: '99.5%',
      shelfLife: '24 Months',
      origin: 'Egypt (مصر)',
    });
    setIsAddingNew(true);
    setEditingProduct(null);
  };

  const handleOpenEditProduct = (prod: ProductItem) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
    setIsAddingNew(false);
  };

  const handleSaveProduct = () => {
    if (!productForm.nameAr || !productForm.pricePerMT) {
      alert('يرجى كتابة اسم المنتج وتحديد السعر.');
      return;
    }

    if (isAddingNew) {
      const newProd = productForm as ProductItem;
      const updated = [...products, newProd];
      setProducts(updated);
      showNotification('تمت إضافة المنتج الجديد بنجاح!');
    } else if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id ? ({ ...p, ...productForm } as ProductItem) : p
      );
      setProducts(updated);
      showNotification('تم تحديث بيانات وسعر المنتج بنجاح!');
    }
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج من عرض الأسعار؟')) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      showNotification('تم حذف المنتج بنجاح.');
    }
  };

  const handleInlinePriceChange = (id: string, newPrice: number) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, pricePerMT: newPrice } : p
    );
    setProducts(updated);
    showNotification('تم تحديث السعر فورياً وحفظه في النظام.');
  };

  const handleSaveMeta = (e: React.FormEvent) => {
    e.preventDefault();
    setMeta(metaForm);
    showNotification('تم حفظ بيانات الشركة وعرض الأسعار والشروط بنجاح!');
  };

  const handleResetData = () => {
    if (window.confirm('هل تريد استعادة البيانات الأصلية للكتالوج وعرض الأسعار كما في ملف PDF؟')) {
      const res = resetAllData();
      setProducts(res.products);
      setMeta(res.meta);
      setMetaForm(res.meta);
      showNotification('تمت استعادة البيانات الأصلية بنجاح.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.products && Array.isArray(json.products)) {
          setProducts(json.products);
        }
        if (json.quotationMeta) {
          setMeta(json.quotationMeta);
          setMetaForm(json.quotationMeta);
        }
        showNotification('تم استيراد النسخة الاحتياطية بنجاح!');
      } catch (err) {
        alert('الملف غير صالح، يرجى التأكد من اختيار ملف JSON صحيح.');
      }
    };
    reader.readAsText(file);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(NEON_POSTGRES_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#d4af37] text-[#0b131e] px-5 py-3 rounded-2xl shadow-2xl font-black text-sm flex items-center gap-2 animate-bounce border-2 border-white">
          <CheckCircle2 className="w-5 h-5" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Dashboard Top Header */}
      <div className="bg-[#0f0f0f] p-6 sm:p-8 rounded-3xl border-2 border-[#d4af37]/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pyramid-pattern">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-md bg-[#161616] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold">
              لوحة التحكم الذكية والإدارة
            </span>
            <span className="flex items-center gap-1 text-[#d4af37] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
              مزامنة فورية نشطة
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Cinzel',serif] tracking-wider">
            إدارة الكتالوج، الأسعار والبيانات
          </h1>
          <p className="text-xs sm:text-sm text-[#9e9785] mt-1">
            تحكم كامل في الأسعار، الصور، المواصفات، بيانات العرض وشروط التصدير — التعديلات تسمع فورياً في الموقع والـ PDF!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveView('pdf_preview')}
            className="px-4 py-2.5 rounded-xl bg-[#161616] hover:bg-[#222222] text-[#d4af37] border border-[#d4af37]/40 font-bold text-xs flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>معاينة عرض PDF</span>
          </button>
          <button
            onClick={() => setActiveView('catalog')}
            className="px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c05b] text-[#0a0a0a] font-bold text-xs flex items-center gap-2 shadow-md"
          >
            <span>زيارة الكتالوج والموقع</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#d4af37]/20 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
            activeTab === 'products'
              ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37] shadow-lg'
              : 'bg-[#161616] text-[#e5d5b0] border-[#d4af37]/20 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>المنتجات والأسعار ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('meta')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
            activeTab === 'meta'
              ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37] shadow-lg'
              : 'bg-[#161616] text-[#e5d5b0] border-[#d4af37]/20 hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>بيانات الشركة وشروط العرض</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
            activeTab === 'database'
              ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37] shadow-lg'
              : 'bg-[#161616] text-[#e5d5b0] border-[#d4af37]/20 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>النسخ وقاعدة البيانات (Neon/Vercel)</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
            activeTab === 'guide'
              ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37] shadow-lg'
              : 'bg-[#161616] text-[#e5d5b0] border-[#d4af37]/20 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>شرح رفع Vercel بدون مشاكل</span>
        </button>
      </div>

      {/* TAB 1: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161616] p-4 rounded-2xl border border-[#d4af37]/30">
            <div>
              <h3 className="text-base font-bold text-white">قائمة المنتجات والتسعير للطن المتري</h3>
              <p className="text-xs text-[#9e9785]">يمكنك تعديل الأسعار فورياً من الجدول أو النقر على &quot;تعديل&quot; لتغيير الصور والوصف.</p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c05b] text-[#0a0a0a] font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة صنف / منتج جديد</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto bg-[#111111] rounded-2xl border border-[#d4af37]/30 shadow-xl">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#161616] text-[#d4af37] font-bold border-b border-[#d4af37]/30">
                <tr>
                  <th className="p-3">البند</th>
                  <th className="p-3">الصورة</th>
                  <th className="p-3">اسم المنتج (عربي / English)</th>
                  <th className="p-3">التصنيف</th>
                  <th className="p-3">التعبئة</th>
                  <th className="p-3">السعر / طن ($ USD)</th>
                  <th className="p-3">حمولة 20&apos; / 40&apos;</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/10 text-[#e5d5b0]">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-3 font-mono font-bold text-[#d4af37]">
                      {prod.itemNo}
                    </td>
                    <td className="p-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.nameAr}
                        className="w-12 h-12 rounded-lg object-cover border border-[#d4af37]/20 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-white text-sm">{prod.nameAr}</div>
                      <div className="text-[11px] text-[#9e9785] font-['Cinzel',serif]">{prod.nameEn}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded bg-[#161616] text-[#d4af37] border border-[#d4af37]/30 text-[10px] font-semibold">
                        {prod.categoryNameAr}
                      </span>
                    </td>
                    <td className="p-3 font-medium">
                      {prod.packagingAr}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[#d4af37] font-bold">$</span>
                        <input
                          type="number"
                          value={prod.pricePerMT}
                          onChange={(e) => handleInlinePriceChange(prod.id, Number(e.target.value))}
                          className="w-24 px-2 py-1 rounded bg-[#0b1420] border border-white/20 text-white font-black text-sm focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </td>
                    <td className="p-3 text-[11px] text-gray-300">
                      <div>20&apos;: <span className="text-white font-bold">{prod.fcl20}</span></div>
                      <div>40&apos;: <span className="text-white font-bold">{prod.fcl40}</span></div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1.5 rounded-lg bg-[#1a3350] hover:bg-[#d4af37] hover:text-[#0b131e] text-white transition-all"
                          title="تعديل التفاصيل والصورة"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 rounded-lg bg-red-950 hover:bg-red-700 text-red-300 hover:text-white transition-all"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Edit / Add Modal */}
      {(isAddingNew || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f1d2e] border-2 border-[#d4af37]/70 rounded-2xl shadow-2xl p-6 text-[#f5efe6] space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
                <span>{isAddingNew ? 'إضافة منتج زراعي جديد' : `تعديل منتج: ${productForm.nameAr}`}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">رقم البند (Item No):</label>
                <input
                  type="text"
                  value={productForm.itemNo || ''}
                  onChange={(e) => setProductForm({ ...productForm, itemNo: e.target.value })}
                  placeholder="مثال: 1.5"
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">التصنيف:</label>
                <select
                  value={productForm.category || 'onion'}
                  onChange={(e) => {
                    const cat = e.target.value as any;
                    const catMap: Record<string, [string, string]> = {
                      onion: ['البصل', 'Onion'],
                      garlic: ['الثوم', 'Garlic'],
                      carrot: ['الجزر المجفف', 'Dried Carrot'],
                      beetroot: ['البنجر المجفف', 'Dried Beetroot'],
                      potato_herbs: ['البطاطس والأعشاب', 'Potato & Herbs'],
                      hibiscus: ['الكركديه', 'Hibiscus'],
                      other: ['أعشاب ونباتات طبية', 'Medicinal Plants'],
                    };
                    const names = catMap[cat] || ['عام', 'General'];
                    setProductForm({
                      ...productForm,
                      category: cat,
                      categoryNameAr: names[0],
                      categoryNameEn: names[1],
                    });
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                >
                  <option value="onion">البصل (Onion)</option>
                  <option value="garlic">الثوم (Garlic)</option>
                  <option value="carrot">الجزر المجفف (Dried Carrot)</option>
                  <option value="beetroot">البنجر المجفف (Dried Beetroot)</option>
                  <option value="potato_herbs">البطاطس والأعشاب (Potato & Herbs)</option>
                  <option value="hibiscus">الكركديه (Hibiscus)</option>
                  <option value="other">أعشاب ومحاصيل أخرى (Other)</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">الاسم بالعربية:</label>
                <input
                  type="text"
                  value={productForm.nameAr || ''}
                  onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })}
                  placeholder="مثال: بصل شرائح مجفف"
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">الاسم بالإنجليزية:</label>
                <input
                  type="text"
                  value={productForm.nameEn || ''}
                  onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })}
                  placeholder="e.g. Onion Flakes / Slices"
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">السعر للطن المتري ($ USD):</label>
                <input
                  type="number"
                  value={productForm.pricePerMT || ''}
                  onChange={(e) => setProductForm({ ...productForm, pricePerMT: Number(e.target.value) })}
                  placeholder="مثال: 3450"
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white font-bold text-sm focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">نوع التعبئة والتغليف (عربي):</label>
                <input
                  type="text"
                  value={productForm.packagingAr || ''}
                  onChange={(e) => setProductForm({ ...productForm, packagingAr: e.target.value })}
                  placeholder="مثال: كرتونة 10 كجم أو شيكارة 25 كجم"
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">حمولة حاوية 20 قدم (20&apos; FCL):</label>
                <input
                  type="text"
                  value={productForm.fcl20 || ''}
                  onChange={(e) => setProductForm({ ...productForm, fcl20: e.target.value })}
                  placeholder="مثال: 10 MT أو 20 MT"
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">حمولة حاوية 40 قدم (40&apos; FCL):</label>
                <input
                  type="text"
                  value={productForm.fcl40 || ''}
                  onChange={(e) => setProductForm({ ...productForm, fcl40: e.target.value })}
                  placeholder="مثال: 20 MT أو 40 MT"
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-gray-300 font-semibold block mb-1">رابط صورة المنتج (Image URL):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={productForm.imageUrl || ''}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white text-xs focus:border-[#d4af37] outline-none"
                  />
                  {productForm.imageUrl && (
                    <img
                      src={productForm.imageUrl}
                      alt="Preview"
                      className="w-10 h-10 rounded-lg object-cover border border-[#d4af37]/50"
                    />
                  )}
                </div>

                {/* Quick Preset Images */}
                <div className="mt-2">
                  <span className="text-[11px] text-gray-400 block mb-1">أو اختر صورة جاهزة عالية الدقة بنقرة واحدة:</span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-[#09111b] rounded-lg border border-white/5">
                    {PRESET_SAMPLE_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setProductForm({ ...productForm, imageUrl: img.url })}
                        className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                          productForm.imageUrl === img.url
                            ? 'bg-[#d4af37] text-[#0b131e] border-[#d4af37]'
                            : 'bg-[#122338] text-gray-300 border-white/10 hover:border-[#d4af37]/40'
                        }`}
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-gray-300 font-semibold block mb-1">الوصف والمواصفات (عربي):</label>
                <textarea
                  rows={2}
                  value={productForm.descriptionAr || ''}
                  onChange={(e) => setProductForm({ ...productForm, descriptionAr: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingProduct(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveProduct}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38728] text-[#0b131e] font-black text-xs flex items-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>حفظ المنتج في العرض</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: Quotation & Factory Meta */}
      {activeTab === 'meta' && (
        <form onSubmit={handleSaveMeta} className="space-y-6">
          <div className="bg-[#0f1f33] p-6 rounded-2xl border border-[#d4af37]/30 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-[#d4af37]/20 pb-3">
              <Building className="w-5 h-5 text-[#d4af37]" />
              <span>بيانات الشركة المصدرة ورأس عرض الأسعار</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">رقم العرض (Quotation No):</label>
                <input
                  type="text"
                  value={metaForm.quotationNo}
                  onChange={(e) => setMetaForm({ ...metaForm, quotationNo: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white font-mono font-bold focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">تاريخ العرض (Date):</label>
                <input
                  type="text"
                  value={metaForm.dateStr}
                  onChange={(e) => setMetaForm({ ...metaForm, dateStr: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">مدة الصلاحية (أيام):</label>
                <input
                  type="number"
                  value={metaForm.validDays}
                  onChange={(e) => setMetaForm({ ...metaForm, validDays: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-gray-300 font-semibold block mb-1">اسم الشركة بالعربية:</label>
                <input
                  type="text"
                  value={metaForm.sellerCompanyNameAr}
                  onChange={(e) => setMetaForm({ ...metaForm, sellerCompanyNameAr: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white font-bold focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">اسم الشركة بالإنجليزية:</label>
                <input
                  type="text"
                  value={metaForm.sellerCompanyNameEn}
                  onChange={(e) => setMetaForm({ ...metaForm, sellerCompanyNameEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white font-['Cinzel',serif] focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">رقم واتساب المبيعات / التصدير:</label>
                <input
                  type="text"
                  value={metaForm.sellerWhatsApp}
                  onChange={(e) => setMetaForm({ ...metaForm, sellerWhatsApp: e.target.value })}
                  placeholder="+201001234567"
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white font-mono focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">البريد الإلكتروني:</label>
                <input
                  type="email"
                  value={metaForm.sellerEmail}
                  onChange={(e) => setMetaForm({ ...metaForm, sellerEmail: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">عنوان المصنع / المقر:</label>
                <input
                  type="text"
                  value={metaForm.sellerAddressAr}
                  onChange={(e) => setMetaForm({ ...metaForm, sellerAddressAr: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Terms and Conditions Block */}
          <div className="bg-[#0f1f33] p-6 rounded-2xl border border-[#d4af37]/30 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-[#d4af37]/20 pb-3">
              <Shield className="w-5 h-5 text-[#d4af37]" />
              <span>الشروط والأحكام والضمانات التصديرية (Terms & Conditions)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">شروط التسليم (Delivery Terms):</label>
                <input
                  type="text"
                  value={metaForm.deliveryTermsAr}
                  onChange={(e) => setMetaForm({ ...metaForm, deliveryTermsAr: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Delivery Terms (English):</label>
                <input
                  type="text"
                  value={metaForm.deliveryTermsEn}
                  onChange={(e) => setMetaForm({ ...metaForm, deliveryTermsEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">شروط الدفع (Payment Terms):</label>
                <input
                  type="text"
                  value={metaForm.paymentTermsAr}
                  onChange={(e) => setMetaForm({ ...metaForm, paymentTermsAr: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Payment Terms (English):</label>
                <input
                  type="text"
                  value={metaForm.paymentTermsEn}
                  onChange={(e) => setMetaForm({ ...metaForm, paymentTermsEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-gray-300 font-semibold block mb-1">مواصفات وضمان الجودة (Quality Guarantee):</label>
                <textarea
                  rows={2}
                  value={metaForm.qualityGuaranteeAr}
                  onChange={(e) => setMetaForm({ ...metaForm, qualityGuaranteeAr: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-gray-300 font-semibold block mb-1">جهة المصادقة والتوقيع (Authorized By):</label>
                <input
                  type="text"
                  value={metaForm.authorizedSignatory}
                  onChange={(e) => setMetaForm({ ...metaForm, authorizedSignatory: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0b1420] border border-white/10 text-white focus:border-[#d4af37] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38728] hover:from-[#e5c05b] hover:to-[#c59b27] text-[#0b131e] font-black text-sm flex items-center gap-2 shadow-xl"
              >
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات في النظام</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: Database, Neon & Backup */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          
          {/* Status & Local Persistence */}
          <div className="bg-gradient-to-br from-[#102944] via-[#0c1f33] to-[#07111c] p-6 rounded-2xl border border-emerald-500/40 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">حفظ البيانات التلقائي (Active &amp; Secure)</h3>
                <p className="text-xs text-gray-300">
                  جميع المنتجات، الأسعار، الصور، وبيانات العرض تُحفظ فورياً وتعمل بنسبة 100% دون أي احتمال لتعطل الموقع على Vercel.
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => exportBackupJSON(products, meta)}
                className="px-4 py-2.5 rounded-xl bg-[#17385c] hover:bg-[#1f4b7a] text-white font-bold text-xs flex items-center gap-2 border border-[#d4af37]/40 shadow-md"
              >
                <Download className="w-4 h-4 text-[#d4af37]" />
                <span>تحميل نسخة احتياطية كاملة (JSON Backup)</span>
              </button>

              <label className="px-4 py-2.5 rounded-xl bg-[#17385c] hover:bg-[#1f4b7a] text-white font-bold text-xs flex items-center gap-2 border border-[#d4af37]/40 shadow-md cursor-pointer">
                <Upload className="w-4 h-4 text-[#d4af37]" />
                <span>استعادة نسخة احتياطية من ملف</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                onClick={handleResetData}
                className="px-4 py-2.5 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-200 font-bold text-xs flex items-center gap-2 border border-red-500/30"
              >
                <RotateCcw className="w-4 h-4" />
                <span>استعادة البيانات الأصلية للـ PDF</span>
              </button>
            </div>
          </div>

          {/* Neon Postgres on Vercel Integration Section */}
          <div className="bg-[#0e1c2e] p-6 rounded-2xl border border-[#d4af37]/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-base font-bold text-white">ربط داتابيز Neon مع Vercel (اختياري وبكل سهولة)</h3>
              </div>
              <button
                onClick={handleCopySql}
                className="px-3 py-1.5 rounded-lg bg-[#193554] hover:bg-[#234975] text-[#f5d77f] font-bold text-xs flex items-center gap-1.5 border border-[#d4af37]/30"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'تم النسخ!' : 'نسخ كود الـ SQL'}</span>
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              إذا أردت ربط Neon Postgres على Vercel لاحقاً، قمنا بتجهيز الـ SQL Schema بالكامل. يمكنك نسخ الكود أدناه ولصقه في Neon SQL Editor بضغطة زر واحدة:
            </p>

            <pre className="bg-[#070e17] p-4 rounded-xl text-[11px] text-emerald-300 font-mono overflow-x-auto border border-white/10 max-h-60">
              {NEON_POSTGRES_SQL_SCHEMA}
            </pre>
          </div>

        </div>
      )}

      {/* TAB 4: Vercel Deploy Guide */}
      {activeTab === 'guide' && (
        <div className="bg-[#0f1f33] p-6 sm:p-8 rounded-2xl border border-[#d4af37]/40 shadow-xl space-y-6">
          <div className="border-b border-[#d4af37]/20 pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <span>دليل رفع الموقع على Vercel في 3 خطوات بسيطة (بدون أخطاء)</span>
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              الموقع مصمم بتقنية Single Page Application حديثة، يرفع مباشرة على Vercel ويعمل 100% دون الحاجة لتهيئة سيرفرات معقدة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="bg-[#14283f] p-5 rounded-2xl border border-[#d4af37]/30 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#d4af37] text-[#0b131e] font-black flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="text-sm font-bold text-white">تنزيل المشروع أو رفعه على GitHub</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                من قائمة الإعدادات (Settings) في الأعلى، اضغط على <b>Export to GitHub</b> أو حمّل ملف الـ <b>ZIP</b> وارفعه على حسابك في GitHub.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#14283f] p-5 rounded-2xl border border-[#d4af37]/30 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#d4af37] text-[#0b131e] font-black flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="text-sm font-bold text-white">تسجيل الدخول في Vercel والربط</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                افتح موقع <b>vercel.com</b> واضغط <b>Add New Project</b> ثم اختر مستودع المشروع من GitHub.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#14283f] p-5 rounded-2xl border border-[#d4af37]/30 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#d4af37] text-[#0b131e] font-black flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="text-sm font-bold text-white">الضغط على Deploy</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                اضغط على زر <b>Deploy</b> مباشرة! سيتعرف Vercel على إعدادات Vite تلقائياً ويعطيك رابط موقع مباشر يعمل عالمياً بسرعة فائقة.
              </p>
            </div>

          </div>

          <div className="bg-[#0b1624] p-4 rounded-xl border border-emerald-500/30 text-xs text-gray-300 space-y-2">
            <span className="font-bold text-emerald-400 block">💡 لماذا لن تواجه مشاكل بعد الآن؟</span>
            <p>
              قمنا ببناء بنية تحتية ذكية تعمل بنظام التخزين الموضعي التلقائي (Local State Engine) بدون الحاجة إلى إعدادات سيرفرات وقواعد بيانات معقدة تسبب فشل الـ Build. كما يمكنك في أي وقت تنزيل نسخة احتياطية من بياناتك أو استعادتها بملف واحد!
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
