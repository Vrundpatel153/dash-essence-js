import { STORAGE_KEYS, safeLocalStorageGet, safeLocalStorageSet } from '../seed/seedData';
import { v4 as uuidv4 } from 'uuid';

export function formatCurrency(amountMinor, currency = 'USD') {
  const amount = amountMinor / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function getTransactions(userId = null) {
  try {
    const transactions = safeLocalStorageGet(STORAGE_KEYS.TRANSACTIONS, []);
    return userId ? transactions.filter(tx => tx.userId === userId && !tx.isDeleted) : transactions;
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
}

export function getTransaction(id) {
  try {
    const transactions = safeLocalStorageGet(STORAGE_KEYS.TRANSACTIONS, []);
    return transactions.find(tx => tx.id === id && !tx.isDeleted);
  } catch (error) {
    console.error('Error getting transaction:', error);
    return null;
  }
}

export function saveTransaction(transactionData, userId) {
  try {
    const transactions = safeLocalStorageGet(STORAGE_KEYS.TRANSACTIONS, []);
    const now = new Date().toISOString();
    
    if (transactionData.id) {
      // Update existing transaction
      const index = transactions.findIndex(tx => tx.id === transactionData.id);
      if (index !== -1) {
        transactions[index] = {
          ...transactions[index],
          ...transactionData,
          updatedAt: now,
        };
      }
    } else {
      // Create new transaction
      const newTransaction = {
        id: uuidv4(),
        userId,
        ...transactionData,
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
      };
      transactions.push(newTransaction);
    }
    
    safeLocalStorageSet(STORAGE_KEYS.TRANSACTIONS, transactions);
    return { success: true };
  } catch (error) {
    console.error('Error saving transaction:', error);
    return { success: false, error: error.message };
  }
}

export function deleteTransaction(id) {
  try {
    const transactions = safeLocalStorageGet(STORAGE_KEYS.TRANSACTIONS, []);
    const index = transactions.findIndex(tx => tx.id === id);
    
    if (index !== -1) {
      transactions[index].isDeleted = true;
      transactions[index].updatedAt = new Date().toISOString();
      safeLocalStorageSet(STORAGE_KEYS.TRANSACTIONS, transactions);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { success: false, error: error.message };
  }
}

export function restoreTransaction(id) {
  try {
    const transactions = safeLocalStorageGet(STORAGE_KEYS.TRANSACTIONS, []);
    const index = transactions.findIndex(tx => tx.id === id);
    
    if (index !== -1) {
      transactions[index].isDeleted = false;
      transactions[index].updatedAt = new Date().toISOString();
      safeLocalStorageSet(STORAGE_KEYS.TRANSACTIONS, transactions);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error restoring transaction:', error);
    return { success: false, error: error.message };
  }
}

export function getCategories() {
  try {
    return safeLocalStorageGet(STORAGE_KEYS.CATEGORIES, []);
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

export function calculateBalance(transactions) {
  return transactions.reduce((balance, tx) => {
    if (tx.type === 'income') {
      return balance + tx.amountMinor;
    } else {
      return balance - tx.amountMinor;
    }
  }, 0);
}

export function getRecentTransactions(transactions, limit = 5) {
  return transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

export function filterTransactions(transactions, filters) {
  return transactions.filter(tx => {
    // Date range filter
    if (filters.startDate && new Date(tx.date) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(tx.date) > new Date(filters.endDate)) {
      return false;
    }
    
    // Category filter
    if (filters.categoryId && tx.categoryId !== filters.categoryId) {
      return false;
    }
    
    // Type filter
    if (filters.type && tx.type !== filters.type) {
      return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return tx.note?.toLowerCase().includes(searchTerm);
    }
    
    return true;
  });
}

export function exportTransactionsToCSV(transactions, categories) {
  try {
    const categoryMap = categories.reduce((map, cat) => {
      map[cat.id] = cat.name;
      return map;
    }, {});

    const headers = ['Date', 'Type', 'Amount', 'Category', 'Note', 'Payment Method'];
    const csvData = [headers];

    transactions.forEach(tx => {
      csvData.push([
        new Date(tx.date).toLocaleDateString(),
        tx.type,
        (tx.amountMinor / 100).toFixed(2),
        categoryMap[tx.categoryId] || 'Unknown',
        tx.note || '',
        tx.paymentMethod || '',
      ]);
    });

    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return { success: false, error: error.message };
  }
}