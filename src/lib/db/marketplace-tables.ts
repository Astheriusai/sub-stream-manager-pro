
import { supabaseAdmin } from '../supabase';

export const createMarketplaceProviderTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS marketplace_providers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id),
        name TEXT NOT NULL,
        description TEXT,
        logo_url TEXT,
        rating DECIMAL(3,2) DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        delivery_time TEXT,
        schedule TEXT,
        contact_links JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
};

export const createMarketplaceProductsTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS marketplace_products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        provider_id UUID NOT NULL REFERENCES marketplace_providers(id),
        product_id UUID NOT NULL REFERENCES products(id),
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
};

export const createMarketplaceReviewsTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS marketplace_reviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        provider_id UUID NOT NULL REFERENCES marketplace_providers(id),
        reviewer_id UUID NOT NULL REFERENCES users(id),
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
};

export const createChatsTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS chats (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sender_id UUID NOT NULL REFERENCES users(id),
        receiver_id UUID NOT NULL REFERENCES users(id),
        last_message TEXT,
        last_message_time TIMESTAMP WITH TIME ZONE,
        unread_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
};

export const createChatMessagesTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        chat_id UUID NOT NULL REFERENCES chats(id),
        sender_id UUID NOT NULL REFERENCES users(id),
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
};

