export interface Customer {
  id: number;
  user_id: number;
  product_id: number;
  company_name: string;
  email: string;
  billing_address: string;
  billing_city: string;
  billing_country: string;
  billing_zip_code: string;
  billing_state: string;
  website: string;
  vat_number: string;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
  status: string;
}
