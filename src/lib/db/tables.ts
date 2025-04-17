
import { supabaseAdmin } from '../supabase';

export const createProductsTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        base_price DECIMAL(10,2) NOT NULL,
        max_profiles INTEGER NOT NULL,
        allowed_durations INTEGER[] NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
};

export const createAccountsTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS accounts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id UUID NOT NULL REFERENCES products(id),
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
        expiration_date TIMESTAMP WITH TIME ZONE NOT NULL,
        base_price DECIMAL(10,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'available',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
};

export const createProfilesTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        account_id UUID NOT NULL REFERENCES accounts(id),
        name TEXT NOT NULL,
        pin TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'available',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
};

export const createCustomersTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
};

export const createSalesTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS sales (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        customer_id UUID NOT NULL REFERENCES customers(id),
        product_id UUID NOT NULL REFERENCES products(id),
        account_id UUID NOT NULL REFERENCES accounts(id),
        profile_id UUID REFERENCES profiles(id),
        purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
        expiration_date TIMESTAMP WITH TIME ZONE NOT NULL,
        sale_price DECIMAL(10,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
};

