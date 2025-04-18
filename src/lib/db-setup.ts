
import { createProductsTable, createAccountsTable, createProfilesTable, createCustomersTable, createSalesTable } from './db/tables';
import { createRolesTable, createUsersTable, createPermissionsTable } from './db/user-tables';
import { 
  createMarketplaceProviderTable, 
  createMarketplaceProductsTable, 
  createMarketplaceReviewsTable,
  createChatsTable,
  createChatMessagesTable
} from './db/marketplace-tables';
import { 
  createSubscribersTable, 
  createPriceListsTable, 
  createSettingsTable,
  createTrashTable
} from './db/subscriber-tables';
import { createCreatorUser } from './db/user-management';

export const setupDatabase = async () => {
  try {
    console.log('Setting up database tables...');
    
    // Create user management tables first (since others depend on roles)
    await createRolesTable();
    await createUsersTable();
    await createPermissionsTable();
    
    // Create core tables
    await createProductsTable();
    await createAccountsTable();
    await createProfilesTable();
    await createCustomersTable();
    await createSalesTable();
    
    // Create marketplace tables
    await createMarketplaceProviderTable();
    await createMarketplaceProductsTable();
    await createMarketplaceReviewsTable();
    await createChatsTable();
    await createChatMessagesTable();
    
    // Create subscriber tables
    await createSubscribersTable();
    await createPriceListsTable();
    await createSettingsTable();
    await createTrashTable();
    
    // Create the creator user after all tables are set up
    const result = await createCreatorUser();
    
    console.log('Database setup completed successfully');
    return { success: true, message: 'Database setup completed successfully', creatorResult: result };
  } catch (error) {
    console.error('Error setting up database:', error);
    return { success: false, message: 'Error setting up database: ' + error };
  }
};

export { createCreatorUser };
