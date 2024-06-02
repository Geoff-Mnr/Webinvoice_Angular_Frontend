import { DocumentType } from "./documenttype.interface";
import { Customer } from "./customer.interface";
import { Product } from "./product.interface";

export interface Document {
  id: number;
  documenttype_id: number;
  documenttype: DocumentType;
  customer_id: number;
  customer: Customer;
  product_id: number;
  product: Product;
  reference_number: string;
  document_date: Date;
  due_date: Date;
  price_htva: number;
  price_vvat: number;
  price_total: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}
