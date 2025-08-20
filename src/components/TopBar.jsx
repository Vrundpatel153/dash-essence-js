import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, Plus, Bell, User, LogOut, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';

export default function TopBar({ onSidebarToggle, sidebarOpen }) {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="glass-card border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors md:hidden"
          >
            <Menu className="w-5 h-5 text-muted" />
          </button>
          
          <div className="hidden md:block">
            <h1 className="text-xl font-heading font-semibold text-foreground">
              Good morning, {currentUser?.name?.split(' ')[0]}!
            </h1>
            <p className="text-sm text-muted">Here's your financial overview</p>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Quick Add Button */}
          <Link
            to="/transactions/new"
            className="hidden sm:flex items-center space-x-2 bg-gradient-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </Link>

          {/* Mobile Quick Add */}
          <Link
            to="/transactions/new"
            className="sm:hidden p-2 bg-gradient-primary hover:opacity-90 text-white rounded-lg transition-all duration-200 shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </Link>

          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-muted" />
            ) : (
              <Moon className="w-5 h-5 text-muted" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors relative">
            <Bell className="w-5 h-5 text-muted" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground">
                {currentUser?.name}
              </span>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 glass-card border border-border/50 rounded-lg shadow-lg z-50"
                >
                  <div className="p-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-white/5 rounded-md transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-white/5 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}