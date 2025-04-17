
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sbase.astherius.tech/';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export type Tables = {
  products: {
    id: string;
    name: string;
    base_price: number;
    max_profiles: number;
    allowed_durations: number[];
    status: 'active' | 'inactive';
    created_at: string;
  };
  accounts: {
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
  profiles: {
    id: string;
    account_id: string;
    name: string;
    pin: string;
    status: 'available' | 'in_use';
    created_at: string;
  };
  customers: {
    id: string;
    name: string;
    email: string;
    phone: string;
    created_at: string;
  };
  sales: {
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
  };
  users: {
    id: string;
    name: string;
    email: string;
    password: string;
    role_id: string;
    subscriber_id: string | null;
    created_at: string;
  };
  roles: {
    id: string;
    name: string;
    created_at: string;
  };
  permissions: {
    id: string;
    role_id: string;
    module: string;
    action: string;
    created_at: string;
  };
  subscribers: {
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
  marketplace_providers: {
    id: string;
    user_id: string;
    name: string;
    description: string;
    logo_url: string;
    rating: number;
    review_count: number;
    delivery_time: string;
    schedule: string;
    contact_links: Record<string, string>;
    created_at: string;
  };
  marketplace_products: {
    id: string;
    provider_id: string;
    product_id: string;
    price: number;
    created_at: string;
  };
  marketplace_reviews: {
    id: string;
    provider_id: string;
    reviewer_id: string;
    rating: number;
    comment: string;
    created_at: string;
  };
  chats: {
    id: string;
    sender_id: string;
    receiver_id: string;
    last_message: string;
    last_message_time: string;
    unread_count: number;
    created_at: string;
  };
  chat_messages: {
    id: string;
    chat_id: string;
    sender_id: string;
    message: string;
    read: boolean;
    created_at: string;
  };
  trash: {
    id: string;
    original_table: string;
    original_id: string;
    data: Record<string, any>;
    deleted_at: string;
  };
  price_lists: {
    id: string;
    subscriber_id: string;
    product_id: string;
    price: number;
    created_at: string;
  };
  settings: {
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
};
