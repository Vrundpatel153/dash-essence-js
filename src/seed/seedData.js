import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const STORAGE_KEYS = {
  USERS: 'et_users',
  CURRENT_USER: 'et_currentUser',
  CATEGORIES: 'et_categories',
  TRANSACTIONS: 'et_transactions',
};

// Demo user credentials
export const DEMO_CREDENTIALS = {
  email: 'demo@local.test',
  password: 'DemoPass123'
};

function createDemoUser() {
  return {
    id: 'user-demo-1',
    name: 'Demo User',
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
    avatarUrl: null,
  preferredCurrency: 'INR',
    createdAt: new Date().toISOString(),
  };
}

function createDefaultCategories() {
  const categories = [
    // Income categories
    { id: 'cat-salary', name: 'Salary', type: 'income', isDeleted: false },
    { id: 'cat-freelance', name: 'Freelance', type: 'income', isDeleted: false },
    { id: 'cat-investment', name: 'Investment', type: 'income', isDeleted: false },
    { id: 'cat-other-income', name: 'Other Income', type: 'income', isDeleted: false },
    
    // Expense categories
    { id: 'cat-food', name: 'Food & Dining', type: 'expense', isDeleted: false },
    { id: 'cat-transport', name: 'Transportation', type: 'expense', isDeleted: false },
    { id: 'cat-shopping', name: 'Shopping', type: 'expense', isDeleted: false },
    { id: 'cat-entertainment', name: 'Entertainment', type: 'expense', isDeleted: false },
    { id: 'cat-utilities', name: 'Utilities', type: 'expense', isDeleted: false },
    { id: 'cat-healthcare', name: 'Healthcare', type: 'expense', isDeleted: false },
    { id: 'cat-education', name: 'Education', type: 'expense', isDeleted: false },
    { id: 'cat-rent', name: 'Rent & Housing', type: 'expense', isDeleted: false },
  ];

  return categories.map(cat => ({
    ...cat,
    userId: null, // Global categories
    createdAt: new Date().toISOString(),
  }));
}

function generateSampleTransactions() {
  const userId = 'user-demo-1';
  const now = dayjs();
  
  const transactions = [
    // Recent income
    {
      type: 'income',
  amountMinor: 450000, // ₹4,500.00
      categoryId: 'cat-salary',
      note: 'Monthly salary',
      date: now.subtract(2, 'day').toISOString(),
      paymentMethod: 'bank_transfer',
    },
    {
      type: 'income',
  amountMinor: 120000, // ₹1,200.00
      categoryId: 'cat-freelance',
      note: 'Website project completion',
      date: now.subtract(5, 'day').toISOString(),
      paymentMethod: 'bank_transfer',
    },

    // Recent expenses
    {
      type: 'expense',
  amountMinor: 8500, // ₹85.00
      categoryId: 'cat-food',
      note: 'Weekly groceries',
      date: now.subtract(1, 'day').toISOString(),
      paymentMethod: 'card',
    },
    {
      type: 'expense',
  amountMinor: 1200, // ₹12.00
      categoryId: 'cat-transport',
      note: 'Metro card top-up',
      date: now.subtract(1, 'day').toISOString(),
      paymentMethod: 'card',
    },
    {
      type: 'expense',
  amountMinor: 4500, // ₹45.00
      categoryId: 'cat-entertainment',
      note: 'Movie tickets',
      date: now.subtract(3, 'day').toISOString(),
      paymentMethod: 'card',
    },
    {
      type: 'expense',
  amountMinor: 125000, // ₹1,250.00
      categoryId: 'cat-rent',
      note: 'Monthly rent',
      date: now.subtract(4, 'day').toISOString(),
      paymentMethod: 'bank_transfer',
    },

    // Older transactions
    {
      type: 'expense',
  amountMinor: 6800, // ₹68.00
      categoryId: 'cat-utilities',
      note: 'Internet bill',
      date: now.subtract(7, 'day').toISOString(),
      paymentMethod: 'card',
    },
    {
      type: 'expense',
  amountMinor: 15000, // ₹150.00
      categoryId: 'cat-shopping',
      note: 'Clothing purchase',
      date: now.subtract(10, 'day').toISOString(),
      paymentMethod: 'card',
    },
    {
      type: 'income',
  amountMinor: 75000, // ₹750.00
      categoryId: 'cat-investment',
      note: 'Dividend payment',
      date: now.subtract(12, 'day').toISOString(),
      paymentMethod: 'bank_transfer',
    },
    {
      type: 'expense',
  amountMinor: 9200, // ₹92.00
      categoryId: 'cat-food',
      note: 'Restaurant dinner',
      date: now.subtract(14, 'day').toISOString(),
      paymentMethod: 'card',
    },

    // Month ago transactions
    {
      type: 'income',
  amountMinor: 450000, // ₹4,500.00
      categoryId: 'cat-salary',
      note: 'Monthly salary',
      date: now.subtract(32, 'day').toISOString(),
      paymentMethod: 'bank_transfer',
    },
    {
      type: 'expense',
  amountMinor: 125000, // ₹1,250.00
      categoryId: 'cat-rent',
      note: 'Monthly rent',
      date: now.subtract(34, 'day').toISOString(),
      paymentMethod: 'bank_transfer',
    },
    {
      type: 'expense',
  amountMinor: 25000, // ₹250.00
      categoryId: 'cat-shopping',
      note: 'Electronics purchase',
      date: now.subtract(28, 'day').toISOString(),
      paymentMethod: 'card',
    },
    {
      type: 'expense',
  amountMinor: 8900, // ₹89.00
      categoryId: 'cat-healthcare',
      note: 'Doctor visit',
      date: now.subtract(25, 'day').toISOString(),
      paymentMethod: 'card',
    },
    {
      type: 'income',
  amountMinor: 200000, // ₹2,000.00
      categoryId: 'cat-freelance',
      note: 'App development project',
      date: now.subtract(20, 'day').toISOString(),
      paymentMethod: 'bank_transfer',
    },
  ];

  return transactions.map(tx => ({
    id: uuidv4(),
    userId,
    ...tx,
  currency: 'INR',
    receiptUrl: null,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function safeLocalStorageGet(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
}

export function seedDataIfNeeded() {
  try {
    // Check if users exist
    const existingUsers = safeLocalStorageGet(STORAGE_KEYS.USERS, []);
    if (existingUsers.length === 0) {
      console.log('🌱 Seeding demo user...');
      safeLocalStorageSet(STORAGE_KEYS.USERS, [createDemoUser()]);
    }

    // Check if categories exist
    const existingCategories = safeLocalStorageGet(STORAGE_KEYS.CATEGORIES, []);
    if (existingCategories.length === 0) {
      console.log('🌱 Seeding categories...');
      safeLocalStorageSet(STORAGE_KEYS.CATEGORIES, createDefaultCategories());
    }

    // Check if transactions exist
    const existingTransactions = safeLocalStorageGet(STORAGE_KEYS.TRANSACTIONS, []);
    if (existingTransactions.length === 0) {
      console.log('🌱 Seeding sample transactions...');
      safeLocalStorageSet(STORAGE_KEYS.TRANSACTIONS, generateSampleTransactions());
    }

    console.log('✅ Seed data check complete');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

export function resetDemoData() {
  try {
    console.log('🔄 Resetting demo data...');
    
    // Clear existing data
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    
    // Re-seed with fresh data
    seedDataIfNeeded();
    
    console.log('✅ Demo data reset complete');
    return true;
  } catch (error) {
    console.error('❌ Error resetting demo data:', error);
    return false;
  }
}

export { STORAGE_KEYS, safeLocalStorageGet, safeLocalStorageSet };