export interface Product {
  id: number;
  name: string;
  brand: string;
  ean_code: string;
  buying_price: number;
  selling_price: number;
  margin: number;
  description: string;
  comment: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  pivot: {
    document_id: number;
    product_id: number;
    selling_price: number;
    quantity: number;
    price_htva: number;
    discount: number;
    margin: number;
    comment: string;
    description: string;
  };
}
