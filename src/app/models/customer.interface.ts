export interface Customer {
  id: number;
  company_name: string;
  email: string;
  billing_address: string;
  billing_city: string;
  billing_country: string;
  billing_zip_code: string;
  billing_state: string;
  website: string;
  status: string;
  vat_number: string;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
}
