import { DocumentType } from "./documenttype.interface";

export interface Document {
  id: number;
  documenttype_id: number;
  documenttype: DocumentType;
  customer_id: number;
  product_id: number;
  reference_number: string;
  document_date: Date;
  due_date: Date;
  price_htva: number;
  price_vvac: number;
  price_total: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}
