import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="text-9xl font-bold text-primary/20 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
                <Search className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Page Not Found
          </h1>
          
          <p className="text-muted text-lg">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-gradient-primary hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-foreground px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-border/50"
        >
          <p className="text-sm text-muted mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              to="/transactions" 
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Transactions
            </Link>
            <Link 
              to="/profile" 
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Profile
            </Link>
            <Link 
              to="/settings" 
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Settings
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}