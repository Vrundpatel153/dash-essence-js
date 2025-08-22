import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../utils/transactionUtils';

export default function BalanceCard({ balance, income, expenses }) {
  const isPositive = balance >= 0;
  const incomeAmount = income || 0;
  const expenseAmount = expenses || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="balance-card p-8 rounded-2xl relative overflow-hidden group"
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-pulse" />
        <div className="absolute top-16 right-12 w-1 h-1 bg-white rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-500" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-white/80 animate-pulse" />
            <h3 className="text-white/90 text-sm font-medium tracking-wide uppercase">
              Total Balance
            </h3>
          </div>
          <p className="text-xs text-white/60">Your current financial position</p>
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
          <div className="w-6 h-6 bg-gradient-to-br from-white to-white/60 rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-black">$</span>
          </div>
        </div>
      </div>

      {/* Balance Amount */}
      <div className="mb-8 relative z-10">
        <motion.h2
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl sm:text-5xl font-heading font-bold text-white mb-3 tracking-tight"
        >
          {formatCurrency(balance)}
        </motion.h2>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
          isPositive 
            ? 'bg-emerald-400/20 text-emerald-100 border border-emerald-400/30' 
            : 'bg-rose-400/20 text-rose-100 border border-rose-400/30'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{isPositive ? 'Healthy' : 'Needs Attention'} Balance</span>
        </div>
      </div>

      {/* Income & Expenses */}
      <div className="grid grid-cols-2 gap-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 group hover:bg-white/15 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-emerald-400/20 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-emerald-300" />
            </div>
            <span className="text-white/80 text-sm font-medium">Income</span>
          </div>
          <p className="text-white font-bold text-lg tracking-tight">
            {formatCurrency(incomeAmount)}
          </p>
          <p className="text-white/60 text-xs mt-1">This period</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 group hover:bg-white/15 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-rose-400/20 rounded-xl flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 text-rose-300" />
            </div>
            <span className="text-white/80 text-sm font-medium">Expenses</span>
          </div>
          <p className="text-white font-bold text-lg tracking-tight">
            {formatCurrency(expenseAmount)}
          </p>
          <p className="text-white/60 text-xs mt-1">This period</p>
        </motion.div>
      </div>

      {/* Floating orb effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl animate-float" />
      <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-2xl animate-float delay-1000" />
    </motion.div>
  );
}