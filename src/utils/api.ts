import { ProductItem, QuotationMeta } from '../types';

export async function fetchProducts(): Promise<ProductItem[]> {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchMeta(): Promise<QuotationMeta> {
  const res = await fetch('/api/meta');
  if (!res.ok) throw new Error('Failed to fetch meta');
  return res.json();
}

export async function saveProduct(product: ProductItem): Promise<void> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to save product');
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

export async function saveMeta(meta: QuotationMeta): Promise<void> {
  const res = await fetch('/api/meta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meta),
  });
  if (!res.ok) throw new Error('Failed to save meta');
}
