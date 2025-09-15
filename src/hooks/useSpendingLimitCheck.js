import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getTransactions } from '../utils/transactionUtils';

export const useSpendingLimitCheck = () => {
  const { currentUser } = useAuth();
  const { addNotification, reminders } = useNotifications();

  const formatRupee = (amount) => {
    try {
      return new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR' 
      }).format(amount / 100);
    } catch { 
      return `₹${(amount / 100).toFixed(2)}`;
    }
  };

  const calculateCurrentBalance = (transactions) => {
    return transactions.reduce((balance, transaction) => {
      return transaction.type === 'income' 
        ? balance + (transaction.amountMinor || 0)
        : balance - (transaction.amountMinor || 0);
    }, 0);
  };

  const calculateTotalSpending = (transactions) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth)
      .reduce((total, t) => total + (t.amountMinor || 0), 0);
  };

  useEffect(() => {
    if (!currentUser) return;

    const checkSpendingLimits = () => {
      const transactions = getTransactions(currentUser.id);
      const totalSpending = calculateTotalSpending(transactions);
      
      const spendingLimitReminders = reminders.filter(
        r => r.type === 'spending_limit' && r.active
      );

      spendingLimitReminders.forEach(reminder => {
        const limitAmount = reminder.amount * 100; // Convert to minor units
        const lastNotifiedKey = `spending_limit_notified_${reminder.id}`;
        const lastNotified = localStorage.getItem(lastNotifiedKey);
        const currentMonth = new Date().getMonth();
        const lastNotifiedMonth = lastNotified ? new Date(lastNotified).getMonth() : -1;
        
        if (totalSpending >= limitAmount && currentMonth !== lastNotifiedMonth) {
          addNotification({
            type: 'spending_limit',
            title: 'Spending Limit Exceeded! 💰',
            message: `You've spent ${formatRupee(totalSpending)} this month, which exceeds your limit of ${formatRupee(limitAmount)}.`,
            category: 'alert'
          });
          
          localStorage.setItem(lastNotifiedKey, new Date().toISOString());
        }
      });
    };

    // Listen for transaction changes
    const handleTransactionChange = () => {
      checkSpendingLimits();
    };

    // Check on mount and when reminders change
    checkSpendingLimits();
    
  // React to balanceUpdated which is dispatched after saveTransaction/update
  window.addEventListener('balanceUpdated', handleTransactionChange);
    
    return () => {
      window.removeEventListener('balanceUpdated', handleTransactionChange);
    };
  }, [currentUser, reminders, addNotification]);
};