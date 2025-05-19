import { IStorage } from './storage-setup';
import { DatabaseStorage } from './db-storage';

// Export an instance of the database storage implementation
export const storage = new DatabaseStorage();