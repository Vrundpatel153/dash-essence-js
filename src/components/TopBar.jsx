import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, Plus, Bell, User, LogOut, Sun, Moon, AlarmClock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';

export default function TopBar({ onSidebarToggle, sidebarOpen }) {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Basic unread indicator stub (could be replaced by context/state later)
  const [unreadCount] = useState(2);

  return (
    <header className="sticky top-0 z-[100] glass-card border-b border-border/50 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg hover:bg-card/5 transition-colors md:hidden"
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
            to="/app/transactions/new"
            className="hidden sm:flex items-center space-x-2 bg-gradient-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </Link>

          {/* Mobile Quick Add */}
          <Link
            to="/app/transactions/new"
            className="sm:hidden p-2 bg-gradient-primary hover:opacity-90 text-white rounded-lg transition-all duration-200 shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </Link>

          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-card/5 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-muted" />
            ) : (
              <Moon className="w-5 h-5 text-muted" />
            )}
          </button>


          {/* Reminder Alarm Icon */}
          <button
            onClick={() => {
              if (location.pathname !== '/app/set-reminder') navigate('/app/set-reminder');
            }}
            className="p-2 rounded-lg hover:bg-card/5 transition-colors"
            title="Set Reminder"
          >
            <AlarmClock className="w-5 h-5 text-primary" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => {
              if (location.pathname !== '/app/notifications') navigate('/app/notifications');
            }}
            className="p-2 rounded-lg hover:bg-card/5 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-muted" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-primary text-[10px] leading-4 font-medium text-white rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-card/5 transition-colors"
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
                  className="fixed right-6 mt-2 w-48 glass-card border border-border/50 rounded-lg shadow-lg z-[9999] bg-background/95 backdrop-blur-sm"
                >
                  <div className="p-2">
                      <Link
                        to="/app/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-card/5 rounded-md transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Go to Profile</span>
                      </Link>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="flex items-center space-x-2 w-full px-3 py-2 mt-1 text-sm text-foreground hover:bg-card/5 rounded-md transition-colors"
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