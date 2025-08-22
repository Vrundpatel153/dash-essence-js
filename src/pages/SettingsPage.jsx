import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle,
  Target,
  DollarSign
} from 'lucide-react';
import { resetDemoData } from '../seed/seedData';
import { formatCurrency } from '../utils/transactionUtils';
import { useAuth } from '../context/AuthContext';
import { useExpenseLimit } from '../hooks/useExpenseLimit';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { currentUser, updateProfile } = useAuth();
  const { currentExpenses, percentageUsed, hasLimit } = useExpenseLimit();
  const [loading, setLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [expenseLimit, setExpenseLimit] = useState(currentUser?.expenseLimit || '');

  const handleResetDemoData = async () => {
    setLoading(true);
    
    try {
      const success = resetDemoData();
      if (success) {
        toast.success('Demo data reset successfully! Please refresh the page.');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error('Failed to reset demo data');
      }
    } catch (error) {
      console.error('Reset error:', error);
      toast.error('An error occurred while resetting data');
    }
    
    setLoading(false);
    setShowResetConfirm(false);
  };

  const handleSaveExpenseLimit = async () => {
    try {
      const limitValue = expenseLimit === '' ? null : parseFloat(expenseLimit);
      
      if (limitValue !== null && (isNaN(limitValue) || limitValue <= 0)) {
        toast.error('Please enter a valid expense limit');
        return;
      }

      const result = await updateProfile({ expenseLimit: limitValue });
      
      if (result.success) {
        toast.success(limitValue ? 'Expense limit updated successfully!' : 'Expense limit removed successfully!');
      } else {
        toast.error(result.error || 'Failed to update expense limit');
      }
    } catch (error) {
      console.error('Save expense limit error:', error);
      toast.error('An error occurred while updating expense limit');
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
          Settings
        </h1>
        <p className="text-muted">
          Manage your app preferences and data
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Expense Limit Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Expense Limit</span>
          </h3>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Monthly Expense Limit</h4>
                  <p className="text-sm text-muted">Set a monthly spending limit to track your budget</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <input
                  type="number"
                  placeholder="Enter amount (e.g., 1000)"
                  value={expenseLimit}
                  onChange={(e) => setExpenseLimit(e.target.value)}
                  className="flex-1 bg-input border border-border/50 rounded-lg px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSaveExpenseLimit}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Save
                </button>
              </div>
              
              {hasLimit && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-400">
                    Current month: {formatCurrency(currentExpenses)} of {formatCurrency((currentUser?.expenseLimit || 0) * 100)} ({percentageUsed.toFixed(0)}% used)
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Data Management</span>
          </h3>


          {/* Reset Demo Data */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <h4 className="font-medium text-foreground">Reset Demo Data</h4>
                  <p className="text-sm text-muted">
                    Clear all data and restore demo transactions. This action cannot be undone.
                  </p>
                </div>
              </div>
              
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Reset Demo Data
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <p className="text-sm text-foreground">Are you sure?</p>
                  <button
                    onClick={handleResetDemoData}
                    disabled={loading}
                    className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-1 px-3 rounded text-sm font-medium transition-colors"
                  >
                    {loading ? 'Resetting...' : 'Yes, Reset'}
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="bg-white/10 hover:bg-white/20 text-foreground py-1 px-3 rounded text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>


        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">About</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Version</span>
              <span className="text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Built with</span>
              <span className="text-foreground">React + Vite</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Data Storage</span>
              <span className="text-foreground">Local Storage</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Demo Credentials</span>
              <span className="text-foreground text-xs">demo@local.test / DemoPass123</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted">
            <p>
              This is a demo expense tracker app. All data is stored locally in your browser.
              To reset or clear data, use the "Reset Demo Data" button above.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}