import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Receipt, TrendingUp, TrendingDown, User, ArrowRight, BarChart3, Wallet, Target } from 'lucide-react';
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
      icon: BarChart3,
      gradient: 'from-aurora-purple to-aurora-rose',
      iconBg: 'bg-aurora-purple/20',
      iconColor: 'text-aurora-purple',
    },
    {
      label: 'This Month Income',
      value: formatCurrency(income),
      icon: TrendingUp,
      gradient: 'from-aurora-emerald to-aurora-cyan',
      iconBg: 'bg-aurora-emerald/20',
      iconColor: 'text-aurora-emerald',
    },
    {
      label: 'This Month Expenses',
      value: formatCurrency(expenses),
      icon: TrendingDown,
      gradient: 'from-aurora-rose to-aurora-crimson',
      iconBg: 'bg-aurora-rose/20',
      iconColor: 'text-aurora-rose',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold gradient-text mb-2">
            Dashboard
          </h1>
          <p className="text-text-secondary text-lg">
            Welcome back, <span className="text-primary font-medium">{currentUser?.name}</span>. 
            Here's your financial overview.
          </p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
          {/* Balance Card */}
          <BalanceCard balance={balance} income={income} expenses={expenses} />

          {/* Chart */}
          <TransactionChart transactions={transactions} />

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {quickStats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="interactive-card p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary/50 to-accent/50 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground text-xl">
                  Recent Activity
                </h3>
              </div>
              <Link
                to="/transactions"
                className="group flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-surface/50 border border-border/50 hover:bg-surface/80 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        transaction.type === 'income' 
                          ? 'bg-aurora-emerald/10 border border-aurora-emerald/20' 
                          : 'bg-aurora-rose/10 border border-aurora-rose/20'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-4 h-4 text-aurora-emerald" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-aurora-rose" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {transaction.note || 'No description'}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {categoryMap[transaction.categoryId]?.name || 'Unknown'} • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-base font-bold ${
                        transaction.type === 'income' 
                          ? 'text-aurora-emerald' 
                          : 'text-aurora-rose'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amountMinor)}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-muted" />
                  </div>
                  <p className="text-muted text-base font-medium mb-2">No transactions yet</p>
                  <p className="text-text-secondary text-sm mb-4">Start tracking your finances</p>
                  <Link
                    to="/transactions/new"
                    className="inline-flex items-center gap-2 btn-aurora px-6 py-3 rounded-xl text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Transaction
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Enhanced Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-aurora rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-aurora-emerald rounded-full border-2 border-background flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-lg">{currentUser?.name}</h4>
                <p className="text-sm text-text-secondary">{currentUser?.email}</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface/30">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-text-secondary">Currency</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {currentUser?.preferredCurrency || 'USD'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface/30">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-aurora-emerald" />
                  <span className="text-sm font-medium text-text-secondary">Status</span>
                </div>
                <span className="status-positive">Active</span>
              </div>
            </div>

            <Link
              to="/profile"
              className="block w-full text-center bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 text-foreground py-4 rounded-xl text-sm font-medium transition-all duration-300 border border-primary/20 hover:border-primary/40"
            >
              Edit Profile
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}