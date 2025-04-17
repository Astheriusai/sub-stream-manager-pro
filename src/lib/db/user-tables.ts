
import { supabaseAdmin } from '../supabase';

export const createRolesTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
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
};

export const createUsersTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
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
};

export const createPermissionsTable = async () => {
  return supabaseAdmin.rpc('execute_sql', {
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
};

