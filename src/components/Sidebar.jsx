import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  User, 
  Settings,
  TrendingUp,
  X
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: Receipt,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function Sidebar({ open, onToggle, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);
  const expanded = isMobile ? open : (open || isHovered);

  return (
    <>
      <motion.div 
        className={`
          icon-rail border-r border-border/50 flex flex-col z-50
          ${isMobile 
            ? 'fixed left-0 top-0 h-full' 
            : 'relative h-screen'
          }
        `}
        animate={{ 
          width: expanded ? 240 : (isMobile ? 0 : 64),
          x: isMobile && !open ? -240 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading font-semibold text-foreground">
                  ExpenseTracker
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {isMobile && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4 text-muted" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={() => isMobile && onToggle()}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted hover:bg-white/5 hover:text-foreground'
                    }`
                  }
                >
                  <item.icon className={`flex-shrink-0 w-5 h-5 ${expanded ? 'mr-3' : 'mx-auto'}`} />
                  <AnimatePresence mode="wait">
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>
    </>
  );
}