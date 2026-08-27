import React from 'react';
import { 
  Printer, 
  Download, 
  ArrowRight, 
  Settings, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Award,
  Building,
  Phone,
  Mail,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { ProductItem, QuotationMeta, ActiveView } from '../types';

interface PdfQuotationViewProps {
  products: ProductItem[];
  meta: QuotationMeta;
  setActiveView: (view: ActiveView) => void;
}

export const PdfQuotationView: React.FC<PdfQuotationViewProps> = ({
  products,
  meta,
  setActiveView,
}) => {
  const handlePrint = () => {
    window.print();
  };

  // Group products by category in exact order
  const categoryGroups = [
    { key: 'onion', nameAr: 'البصل', nameEn: 'Onion', items: products.filter((p) => p.category === 'onion') },
    { key: 'garlic', nameAr: 'الثوم', nameEn: 'Garlic', items: products.filter((p) => p.category === 'garlic') },
    { key: 'carrot', nameAr: 'الجزر المجفف', nameEn: 'Dried Carrot', items: products.filter((p) => p.category === 'carrot') },
    { key: 'beetroot', nameAr: 'البنجر المجفف', nameEn: 'Dried Beetroot', items: products.filter((p) => p.category === 'beetroot') },
    { key: 'potato_herbs', nameAr: 'البطاطس والأعشاب', nameEn: 'Potato & Herbs', items: products.filter((p) => p.category === 'potato_herbs') },
    { key: 'hibiscus', nameAr: 'الكركديه', nameEn: 'Hibiscus', items: products.filter((p) => p.category === 'hibiscus') },
    { key: 'other', nameAr: 'منتجات أخرى', nameEn: 'Other Crops', items: products.filter((p) => p.category === 'other') },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Action Bar (Hidden in Print) */}
      <div className="no-print bg-[#0f0f0f] p-4 sm:p-5 rounded-2xl border border-[#d4af37]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 pyramid-pattern">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('catalog')}
            className="p-2 rounded-xl bg-[#161616] hover:bg-[#222222] text-[#e5d5b0] hover:text-white border border-[#d4af37]/20 transition-all"
            title="العودة للكتالوج"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>عرض الأسعار الرسمي المعتمد (Official PDF Quotation)</span>
              <span className="px-2 py-0.5 rounded bg-[#d4af37] text-[#0a0a0a] text-[10px] font-black">
                {meta.quotationNo}
              </span>
            </h2>
            <p className="text-xs text-[#9e9785]">
              جاهز للطباعة أو الحفظ كملف PDF رسمي عالي الدقة بضغطة زر واحدة.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveView('admin')}
            className="px-4 py-2.5 rounded-xl bg-[#161616] hover:bg-[#222222] text-[#d4af37] border border-[#d4af37]/40 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>تعديل الأسعار والبيانات</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c05b] text-[#0a0a0a] font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:shadow-[#d4af37]/30 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة / حفظ كـ PDF رسمي</span>
          </button>
        </div>
      </div>

      {/* Printable Document Container */}
      <div className="print-container max-w-4xl mx-auto bg-white text-[#111827] rounded-2xl shadow-2xl overflow-hidden border border-[#d4af37]/40 font-['Cairo',sans-serif]">
        
        {/* Document Header Section (Green / Dark Teal Header with Gold Line) */}
        <div className="bg-[#0e3b2e] text-white p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* English Header Side */}
            <div className="text-left font-['Cinzel',serif]">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white">
                COMMERCIAL QUOTATION
              </h1>
              <p className="text-xs sm:text-sm text-[#e2d4a8] tracking-wide mt-1">
                {meta.sellerTaglineEn}
              </p>
            </div>

            {/* Arabic Header Side */}
            <div className="text-right">
              <h1 className="text-2xl sm:text-3xl font-black text-[#fdf6d8]">
                عرض أسعار تجاري
              </h1>
              <p className="text-xs sm:text-sm text-gray-200 mt-1">
                {meta.sellerTaglineAr}
              </p>
            </div>

          </div>

          {/* Golden Divider Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#937128] via-[#f5d77f] to-[#937128]"></div>
        </div>

        {/* Quotation Meta & Reference Info Bar */}
        <div className="p-4 sm:p-6 bg-[#faf8f2] border-b border-[#e5dcba] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="border-l border-[#e5dcba] pl-3">
            <span className="text-gray-500 block text-[10px]">Date / التاريخ</span>
            <span className="font-bold text-gray-900">{meta.dateStr}</span>
          </div>

          <div className="border-l border-[#e5dcba] pl-3">
            <span className="text-gray-500 block text-[10px]">Quotation No. / رقم العرض</span>
            <span className="font-bold font-mono text-[#0e3b2e]">{meta.quotationNo}</span>
          </div>

          <div className="border-l border-[#e5dcba] pl-3">
            <span className="text-gray-500 block text-[10px]">Currency / العملة</span>
            <span className="font-bold text-gray-900">{meta.currency}</span>
          </div>

          <div>
            <span className="text-gray-500 block text-[10px]">Validity / الصلاحية</span>
            <span className="font-bold text-emerald-800">صالحة لمدة {meta.validDays} يوماً من تاريخه</span>
          </div>
        </div>

        {/* To / Client Information Bar */}
        <div className="p-4 sm:p-6 bg-[#f2ede0] border-b border-[#e5dcba] flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">To:</span>
            <span className="font-bold text-[#0e3b2e] text-sm">{meta.clientCompanyName}</span>
          </div>
          <div className="text-gray-600">
            مقدم إلى: <span className="font-semibold text-gray-900">{meta.clientContactPerson || 'السيد / شركة اسم العميل'}</span>
          </div>
        </div>

        {/* Quotation Table */}
        <div className="p-4 sm:p-6 space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#0e3b2e] text-white font-bold">
                  <th className="p-2.5 text-center w-14">Photo</th>
                  <th className="p-2.5 text-center w-12">No.</th>
                  <th className="p-2.5 text-right">المنتج / Product</th>
                  <th className="p-2.5 text-center w-28">التعبئة / Packaging</th>
                  <th className="p-2.5 text-center w-28 bg-[#092920] text-[#f5d77f]">
                    Price / MT<br />USD
                  </th>
                  <th className="p-2.5 text-center w-20">20&apos; FCL</th>
                  <th className="p-2.5 text-center w-20">40&apos; FCL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categoryGroups.map((group) => (
                  <React.Fragment key={group.key}>
                    
                    {/* Category Divider Header Row */}
                    <tr className="bg-[#1b4e3f] text-[#f5d77f] font-bold">
                      <td colSpan={7} className="py-1.5 px-4 text-center text-xs tracking-wider">
                        {group.nameAr} • {group.nameEn}
                      </td>
                    </tr>

                    {/* Products in this category */}
                    {group.items.map((item, idx) => (
                      <tr 
                        key={item.id} 
                        className={`page-break-inside-avoid ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]'
                        } hover:bg-[#f5efe0] transition-colors`}
                      >
                        {/* Photo */}
                        <td className="p-2 text-center align-middle">
                          <img
                            src={item.imageUrl}
                            alt={item.nameAr}
                            className="w-10 h-10 object-cover rounded mx-auto border border-gray-300"
                            referrerPolicy="no-referrer"
                          />
                        </td>

                        {/* Item No */}
                        <td className="p-2 text-center font-bold text-gray-700 font-mono align-middle">
                          {item.itemNo}
                        </td>

                        {/* Name in AR / EN */}
                        <td className="p-2 align-middle">
                          <div className="font-bold text-gray-900 text-xs sm:text-sm">{item.nameAr}</div>
                          <div className="text-[11px] text-gray-600 font-['Cinzel',serif]">{item.nameEn}</div>
                        </td>

                        {/* Packaging */}
                        <td className="p-2 text-center align-middle text-gray-700">
                          <div className="font-semibold">{item.packagingAr}</div>
                          <div className="text-[10px] text-gray-500">{item.packagingEn}</div>
                        </td>

                        {/* Price per MT in USD */}
                        <td className="p-2 text-center align-middle font-black text-sm text-[#0e3b2e] bg-[#fdfaf0]">
                          ${item.pricePerMT.toLocaleString()}
                        </td>

                        {/* 20' FCL */}
                        <td className="p-2 text-center align-middle font-semibold text-gray-700 text-[11px]">
                          {item.fcl20}
                        </td>

                        {/* 40' FCL */}
                        <td className="p-2 text-center align-middle font-semibold text-gray-700 text-[11px]">
                          {item.fcl40}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Terms & Conditions Section (Matching user PDF page 2/3) */}
          <div className="page-break-inside-avoid mt-8 pt-6 border-t-2 border-[#0e3b2e]/30 space-y-4">
            <div className="bg-[#0e3b2e] text-[#f5d77f] py-1.5 px-4 font-bold text-xs rounded text-center">
              الشروط والأحكام / Terms &amp; Conditions
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              
              <div className="bg-[#faf8f2] p-3 rounded-lg border border-[#e5dcba] space-y-1">
                <div className="font-bold text-[#0e3b2e]">Validity / صلاحية العرض:</div>
                <div className="text-gray-800">{meta.validDays} days from date of issue / ساري لمدة {meta.validDays} يوماً من تاريخه.</div>
              </div>

              <div className="bg-[#faf8f2] p-3 rounded-lg border border-[#e5dcba] space-y-1">
                <div className="font-bold text-[#0e3b2e]">Delivery / شروط التسليم:</div>
                <div className="text-gray-800">{meta.deliveryTermsAr}</div>
                <div className="text-[11px] text-gray-500 italic">{meta.deliveryTermsEn}</div>
              </div>

              <div className="bg-[#faf8f2] p-3 rounded-lg border border-[#e5dcba] space-y-1">
                <div className="font-bold text-[#0e3b2e]">Payment / شروط الدفع:</div>
                <div className="text-gray-800">{meta.paymentTermsAr}</div>
                <div className="text-[11px] text-gray-500 italic">{meta.paymentTermsEn}</div>
              </div>

              <div className="bg-[#faf8f2] p-3 rounded-lg border border-[#e5dcba] space-y-1">
                <div className="font-bold text-[#0e3b2e]">Quality / الجودة والمواصفات:</div>
                <div className="text-gray-800">{meta.qualityGuaranteeAr}</div>
                <div className="text-[11px] text-gray-500 italic">{meta.qualityGuaranteeEn}</div>
              </div>

              <div className="md:col-span-2 bg-[#faf8f2] p-3 rounded-lg border border-[#e5dcba] space-y-1">
                <div className="font-bold text-[#0e3b2e]">Prices / الأسعار:</div>
                <div className="text-gray-800">{meta.pricesNoteAr}</div>
                <div className="text-[11px] text-gray-500 italic">{meta.pricesNoteEn}</div>
              </div>

            </div>

            {/* Official Authorization & Stamp Box */}
            <div className="mt-6 p-4 rounded-xl border-2 border-dashed border-[#0e3b2e]/40 bg-[#f9f7f0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-xs">
                <div className="font-bold text-[#0e3b2e] text-sm">
                  مصادق عليه من: {meta.sellerCompanyNameAr}
                </div>
                <div className="text-gray-600">
                  {meta.sellerCompanyNameEn}
                </div>
                <div className="text-gray-500 text-[11px]">
                  هاتف: {meta.sellerPhone} | واتساب: {meta.sellerWhatsApp} | إيميل: {meta.sellerEmail}
                </div>
                <div className="text-[#0e3b2e] font-bold text-xs pt-1">
                  {meta.stampTextAr}
                </div>
              </div>

              {/* Official Seal / Signature Badge */}
              <div className="w-32 h-32 rounded-full border-2 border-[#0e3b2e] flex flex-col items-center justify-center p-2 text-center bg-white shadow-sm shrink-0">
                <span className="text-[9px] font-bold text-[#0e3b2e] uppercase tracking-wider">PHARAOH AGRI</span>
                <span className="text-xl">🏛️</span>
                <span className="text-[8px] font-bold text-emerald-800">EXPORT GRADE</span>
                <span className="text-[7px] text-gray-500">OFFICIALLY APPROVED</span>
              </div>
            </div>

          </div>

        </div>

        {/* Document Footer */}
        <div className="bg-[#0e3b2e] text-[#e2d4a8] p-3 text-[10px] flex items-center justify-between">
          <span>{meta.quotationNo} | Confidential — Prices in USD / MT</span>
          <span>Pharaoh Agri Exports • Egypt</span>
        </div>

      </div>

    </div>
  );
};
