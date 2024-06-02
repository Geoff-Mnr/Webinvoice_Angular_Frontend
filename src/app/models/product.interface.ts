export interface Product {
  id: number;
  name: string;
  brand: string;
  ean_code: string;
  quantity: number;
  buying_price: number;
  selling_price: number;
  margin: number;
  discount: number;
  description: string;
  comment: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
