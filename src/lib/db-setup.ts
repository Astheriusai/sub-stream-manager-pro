
import { supabaseAdmin } from './supabase';

export const setupDatabase = async () => {
  try {
    console.log('Setting up database tables...');
    
    // Products Table
    await supabaseAdmin.rpc('execute_sql', {
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
    
    // Accounts Table
    await supabaseAdmin.rpc('execute_sql', {
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
    
    // Profiles Table
    await supabaseAdmin.rpc('execute_sql', {
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
    
    // Customers Table
    await supabaseAdmin.rpc('execute_sql', {
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
    
    // Sales Table
    await supabaseAdmin.rpc('execute_sql', {
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
    
    // Roles Table
    await supabaseAdmin.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS roles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Insert default roles
        INSERT INTO roles (name) 
        VALUES ('creator'), ('admin'), ('moderator'), ('worker')
        ON CONFLICT (name) DO NOTHING;
      `
    });
    
    // Users Table
    await supabaseAdmin.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          role_id UUID NOT NULL REFERENCES roles(id),
          subscriber_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    // Permissions Table
    await supabaseAdmin.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS permissions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          role_id UUID NOT NULL REFERENCES roles(id),
          module TEXT NOT NULL,
          action TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(role_id, module, action)
        );
        
        -- Insert default permissions
        INSERT INTO permissions (role_id, module, action)
        SELECT id, 'all', 'all' FROM roles WHERE name = 'creator'
        ON CONFLICT (role_id, module, action) DO NOTHING;
      `
    });
    
    // Subscribers Table
    await supabaseAdmin.rpc('execute_sql', {
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
    
    // Marketplace Providers Table
    await supabaseAdmin.rpc('execute_sql', {
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
    
    // Marketplace Products Table
    await supabaseAdmin.rpc('execute_sql', {
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
    
    // Marketplace Reviews Table
    await supabaseAdmin.rpc('execute_sql', {
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
    
    // Chats Table
    await supabaseAdmin.rpc('execute_sql', {
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
    
    // Chat Messages Table
    await supabaseAdmin.rpc('execute_sql', {
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
    
    // Trash Table
    await supabaseAdmin.rpc('execute_sql', {
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
    
    // Price Lists Table
    await supabaseAdmin.rpc('execute_sql', {
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
    
    // Settings Table
    await supabaseAdmin.rpc('execute_sql', {
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
    
    console.log('Database setup completed successfully');
    return { success: true, message: 'Database setup completed successfully' };
  } catch (error) {
    console.error('Error setting up database:', error);
    return { success: false, message: 'Error setting up database: ' + error };
  }
};
