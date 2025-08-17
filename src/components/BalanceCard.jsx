import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/transactionUtils';

export default function BalanceCard({ balance, income, expenses }) {
  const isPositive = balance >= 0;
  const incomeAmount = income || 0;
  const expenseAmount = expenses || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="balance-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white/80 text-sm font-medium">Total Balance</h3>
          <p className="text-xs text-white/60">Current account balance</p>
        </div>
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Balance Amount */}
      <div className="mb-6">
        <motion.h2
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2"
        >
          {formatCurrency(balance)}
        </motion.h2>
        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
          isPositive 
            ? 'bg-green-500/20 text-green-100' 
            : 'bg-red-500/20 text-red-100'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{isPositive ? 'Positive' : 'Negative'} Balance</span>
        </div>
      </div>

      {/* Income & Expenses */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-300" />
            <span className="text-white/80 text-sm">Income</span>
          </div>
          <p className="text-white font-semibold">
            {formatCurrency(incomeAmount)}
          </p>
        </div>

        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-300" />
            <span className="text-white/80 text-sm">Expenses</span>
          </div>
          <p className="text-white font-semibold">
            {formatCurrency(expenseAmount)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}