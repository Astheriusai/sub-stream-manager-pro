
export type Product = {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  base_price?: number;
  max_profiles?: number;
  allowed_durations?: number[];
  created_at?: string;
};

export type PriceList = {
  id: string;
  subscriber_id: string;
  product_id: string;
  price: number;
  created_at: string;
  product_name?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
};

export type Account = {
  id: string;
  product_id: string;
  email: string;
  password: string;
  purchase_date: string;
  expiration_date: string;
  base_price: number;
  status: 'available' | 'in_use' | 'expired';
  created_at: string;
};

export type Profile = {
  id: string;
  account_id: string;
  name: string;
  pin: string;
  status: 'available' | 'in_use';
  created_at: string;
};

export type Sale = {
  id: string;
  customer_id: string;
  product_id: string;
  account_id: string;
  profile_id: string | null;
  purchase_date: string;
  expiration_date: string;
  sale_price: number;
  status: 'active' | 'expiring_soon' | 'expired';
  created_at: string;
  customer_name?: string;
  product_name?: string;
  account_email?: string;
  profile_name?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role_id: string;
  subscriber_id: string | null;
  created_at: string;
  role_name?: string;
};

export type Role = {
  id: string;
  name: string;
  created_at: string;
};

export type Permission = {
  id: string;
  role_id: string;
  module: string;
  action: string;
  created_at: string;
};

export type Subscriber = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'trial';
  start_date: string;
  expiration_date: string;
  whatsapp_instance_id: string | null;
  reminder_days: number[];
  reminder_template: string;
  terms_conditions: string;
  created_at: string;
};

export type Settings = {
  id: string;
  subscriber_id: string;
  currency: string;
  date_format: string;
  timezone: string;
  sale_message_template: string;
  reminder_message_template: string;
  terms_conditions: string;
  created_at: string;
};

export type MessageTemplate = {
  service: string;
  email: string;
  password: string;
  profile?: string;
  pin?: string;
  expiration_date: string;
};
