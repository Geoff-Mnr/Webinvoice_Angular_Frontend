export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  company_name: string;
  vat_number: string;
  account_number: string;
  email: string;
  password: string;
  phone_number: string;
  address: string;
  city: string;
  country: string;
  zip_code: string;
  profile_picture: string;
  role_id: number;
  role: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  is_active: string;
  role_name: string;
}
