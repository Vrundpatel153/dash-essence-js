import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransactions } from '../utils/transactionUtils';

export function useExpenseLimit() {
  const { currentUser } = useAuth();
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const [currentExpenses, setCurrentExpenses] = useState(0);
  const [percentageUsed, setPercentageUsed] = useState(0);

  useEffect(() => {
    if (!currentUser?.expenseLimit) {
      setIsLimitExceeded(false);
      setCurrentExpenses(0);
      setPercentageUsed(0);
      return;
    }

    const transactions = getTransactions(currentUser.id);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Calculate current month expenses
    const monthlyExpenses = transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return tx.type === 'expense' && 
               txDate.getMonth() === currentMonth && 
               txDate.getFullYear() === currentYear;
      })
      .reduce((sum, tx) => sum + tx.amountMinor, 0);

    setCurrentExpenses(monthlyExpenses);
    
    const limit = currentUser.expenseLimit * 100; // Convert to minor units
    const percentage = limit > 0 ? (monthlyExpenses / limit) * 100 : 0;
    
    setPercentageUsed(percentage);
    setIsLimitExceeded(monthlyExpenses > limit);
  }, [currentUser]);

  return {
    isLimitExceeded,
    currentExpenses,
    percentageUsed,
    expenseLimit: currentUser?.expenseLimit || null,
    hasLimit: Boolean(currentUser?.expenseLimit)
  };
}