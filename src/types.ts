export interface ProductItem {
  id: string;
  itemNo: string; // e.g. "1.1", "1.2"
  category: 'onion' | 'garlic' | 'carrot' | 'beetroot' | 'potato_herbs' | 'hibiscus' | 'other';
  categoryNameAr: string;
  categoryNameEn: string;
  nameAr: string;
  nameEn: string;
  packagingAr: string;
  packagingEn: string;
  pricePerMT: number; // in USD
  fcl20: string; // e.g. "10 MT", "20 MT"
  fcl40: string; // e.g. "20 MT", "40 MT"
  imageUrl: string;
  descriptionAr: string;
  descriptionEn: string;
  inStock: boolean;
  minOrderMT: number;
  hsCode?: string;
  moisture?: string;
  purity?: string;
  shelfLife?: string;
  origin?: string;
}

export interface QuotationMeta {
  quotationNo: string;
  dateStr: string;
  validDays: number;
  currency: string;
  sellerCompanyNameAr: string;
  sellerCompanyNameEn: string;
  sellerTaglineAr: string;
  sellerTaglineEn: string;
  sellerPhone: string;
  sellerWhatsApp: string;
  sellerEmail: string;
  sellerAddressAr: string;
  sellerAddressEn: string;
  clientCompanyName: string;
  clientContactPerson: string;
  clientCountry: string;
  clientPhone: string;
  clientEmail: string;
  deliveryTermsAr: string;
  deliveryTermsEn: string;
  paymentTermsAr: string;
  paymentTermsEn: string;
  qualityGuaranteeAr: string;
  qualityGuaranteeEn: string;
  pricesNoteAr: string;
  pricesNoteEn: string;
  authorizedSignatory: string;
  stampTextAr: string;
  stampTextEn: string;
  stampImageUrl?: string;
}

export interface CartItem {
  productId: string;
  quantityMT: number;
  containerChoice: '20FCL' | '40FCL' | 'custom';
  packagingChoice: string;
  customNotes?: string;
}

export type ActiveView = 'catalog' | 'pdf_preview' | 'admin' | 'guide';
export type CurrencyCode = 'USD' | 'EUR' | 'EGP';
