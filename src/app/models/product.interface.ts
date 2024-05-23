export interface Product {
  id: number;
  name: string;
  brand: string;
  ean_code: string;
  stock: number;
  buying_price: number;
  selling_price: number;
  discount: number;
  description: string;
  comment: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
