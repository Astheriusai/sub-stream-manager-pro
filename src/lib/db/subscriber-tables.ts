
import { supabaseAdmin } from '../supabase';

export const createSubscribersTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS subscribers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        expiration_date TIMESTAMP WITH TIME ZONE,
        whatsapp_instance_id TEXT,
        reminder_days INTEGER[],
        reminder_template TEXT,
        terms_conditions TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
};

export const createPriceListsTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS price_lists (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        subscriber_id UUID NOT NULL REFERENCES subscribers(id),
        product_id UUID NOT NULL REFERENCES products(id),
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(subscriber_id, product_id)
      );
    `
  });
};

export const createSettingsTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS settings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        subscriber_id UUID NOT NULL REFERENCES subscribers(id) UNIQUE,
        currency TEXT DEFAULT 'USD',
        date_format TEXT DEFAULT 'DD/MM/YYYY',
        timezone TEXT DEFAULT 'UTC',
        sale_message_template TEXT,
        reminder_message_template TEXT,
        terms_conditions TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
};

export const createTrashTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS trash (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        original_table TEXT NOT NULL,
        original_id UUID NOT NULL,
        data JSONB NOT NULL,
        deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
};

