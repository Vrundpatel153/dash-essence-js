import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Download, 
  Upload, 
  Shield, 
  Bell, 
  Moon, 
  Sun,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { resetDemoData } from '../seed/seedData';
import { exportTransactionsToCSV, getTransactions, getCategories } from '../utils/transactionUtils';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

  const handleExportData = () => {
    const transactions = getTransactions(currentUser?.id);
    const categories = getCategories();
    const result = exportTransactionsToCSV(transactions, categories);
    
    if (result.success) {
      toast.success('Data exported successfully!');
    } else {
      toast.error('Failed to export data');
    }
  };

  const handleImportData = () => {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // For now, just show a message
        toast.info('CSV import feature coming soon!');
      }
    };
    input.click();
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
      </div>

      <div className="space-y-6">
        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Data Management</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export Data */}
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Download className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Export Data</h4>
                  <p className="text-sm text-muted">Download your transactions as CSV</p>
                </div>
              </div>
              <button
                onClick={handleExportData}
                className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Export CSV
              </button>
            </div>

            {/* Import Data */}
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Upload className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Import Data</h4>
                  <p className="text-sm text-muted">Upload transactions from CSV</p>
                </div>
              </div>
              <button
                onClick={handleImportData}
                className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Import CSV
              </button>
            </div>
          </div>

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

        {/* App Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Preferences</span>
          </h3>

          <div className="space-y-4">
            {/* Notifications */}
            <div className="flex items-center justify-between py-3 border-b border-border/30">
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted">Get notified about important updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Theme */}
            <div className="flex items-center justify-between py-3 border-b border-border/30">
              <div>
                <p className="font-medium text-foreground">Theme</p>
                <p className="text-sm text-muted">Choose your preferred theme</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-white/10 rounded-lg">
                  <Sun className="w-4 h-4 text-muted" />
                </button>
                <button className="p-2 bg-primary rounded-lg">
                  <Moon className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Currency Display */}
            <div className="flex items-center justify-between py-3 border-b border-border/30">
              <div>
                <p className="font-medium text-foreground">Currency Display</p>
                <p className="text-sm text-muted">Show currency symbols</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Auto-categorization */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-foreground">Smart Categorization</p>
                <p className="text-sm text-muted">Automatically suggest categories</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
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