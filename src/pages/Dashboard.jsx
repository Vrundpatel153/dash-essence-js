import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Receipt, TrendingUp, TrendingDown, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getTransactions, 
  getCategories, 
  calculateBalance, 
  getRecentTransactions,
  formatCurrency 
} from '../utils/transactionUtils';
import BalanceCard from '../components/BalanceCard';
import TransactionChart from '../components/TransactionChart';

export default function Dashboard() {
  const { currentUser } = useAuth();

  const dashboardData = useMemo(() => {
    const transactions = getTransactions(currentUser?.id);
    const categories = getCategories();
    
    const income = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amountMinor, 0);
    
    const expenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amountMinor, 0);
    
    const balance = calculateBalance(transactions);
    const recentTransactions = getRecentTransactions(transactions, 5);
    
    return {
      transactions,
      categories,
      income,
      expenses,
      balance,
      recentTransactions,
    };
  }, [currentUser?.id]);

  const { transactions, categories, income, expenses, balance, recentTransactions } = dashboardData;

  const categoryMap = useMemo(() => {
    return categories.reduce((map, cat) => {
      map[cat.id] = cat;
      return map;
    }, {});
  }, [categories]);

  const quickStats = [
    {
      label: 'Total Transactions',
      value: transactions.length,
      icon: Receipt,
      color: 'text-blue-400',
    },
    {
      label: 'This Month Income',
      value: formatCurrency(income),
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      label: 'This Month Expenses',
      value: formatCurrency(expenses),
      icon: TrendingDown,
      color: 'text-red-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted mt-1">
            Welcome back, {currentUser?.name}. Here's your financial overview.
          </p>
        </div>
        
        <Link
          to="/transactions/new"
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-gradient-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </Link>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Card */}
          <BalanceCard balance={balance} income={income} expenses={expenses} />

          {/* Chart */}
          <TransactionChart transactions={transactions} />

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {quickStats.map((stat, index) => (
              <div key={stat.label} className="glass-card p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-white/10`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted">{stat.label}</p>
                    <p className="font-semibold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-foreground">
                Recent Transactions
              </h3>
              <Link
                to="/transactions"
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center space-x-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between py-2 border-b border-border/30 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'income' 
                          ? 'bg-green-500/20' 
                          : 'bg-red-500/20'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {transaction.note || 'No description'}
                        </p>
                        <p className="text-xs text-muted">
                          {categoryMap[transaction.categoryId]?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        transaction.type === 'income' 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amountMinor)}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Receipt className="w-8 h-8 text-muted mx-auto mb-2" />
                  <p className="text-muted text-sm">No transactions yet</p>
                  <Link
                    to="/transactions/new"
                    className="text-primary hover:text-primary/80 text-sm font-medium mt-2 inline-block"
                  >
                    Add your first transaction
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{currentUser?.name}</h4>
                <p className="text-sm text-muted">{currentUser?.email}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted">Preferred Currency</span>
                <span className="text-sm text-foreground">{currentUser?.preferredCurrency || 'USD'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted">Account Status</span>
                <span className="text-sm text-green-400">Active</span>
              </div>
            </div>

            <Link
              to="/profile"
              className="block w-full mt-4 text-center bg-white/5 hover:bg-white/10 text-foreground py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Edit Profile
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}