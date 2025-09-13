import { motion } from 'framer-motion';
import { Bell, CheckCircle2, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Simple in-memory notifications store (local only)
const initialNotifications = [
  { id: '1', title: 'Welcome to ExpenseTracker', body: 'Start by adding your first transaction.', read: false, type: 'info', ts: Date.now() - 1000 * 60 * 5 },
  { id: '2', title: 'Weekly Summary', body: 'Your weekly summary is ready to view.', read: false, type: 'summary', ts: Date.now() - 1000 * 60 * 60 * 2 },
  { id: '3', title: 'Backup Reminder', body: 'Export your data regularly to keep a backup.', read: true, type: 'reminder', ts: Date.now() - 1000 * 60 * 60 * 24 },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications(n => n.map(nf => ({ ...nf, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications(n => n.map(nf => nf.id === id ? { ...nf, read: !nf.read } : nf));
  };

  const clearRead = () => {
    setNotifications(n => n.filter(nf => !nf.read));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-muted mt-1">View and manage system messages</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <button onClick={markAllRead} className="px-4 py-2 text-xs rounded-lg bg-card/5 hover:bg-card/10 text-foreground transition-colors">Mark all read</button>
          <button onClick={clearRead} className="px-4 py-2 text-xs rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors flex items-center gap-1"><Trash2 className="w-3 h-3" />Clear read</button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card p-6"
      >
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-10 h-10 text-muted mx-auto mb-4" />
            <p className="text-muted">No notifications</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
              {notifications.map((n, i) => (
              <motion.li
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`py-4 flex items-start gap-4 ${!n.read ? 'bg-card/5 rounded-lg px-4 -mx-4' : 'px-0'}`}>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{n.title}</h3>
                    {!n.read && <span className="inline-block w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{n.body}</p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-muted">
                    <span>{new Date(n.ts).toLocaleString()}</span>
                    <button onClick={() => toggleRead(n.id)} className="uppercase tracking-wide hover:text-foreground transition-colors">
                      {n.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                  </div>
                </div>
                {n.read && <CheckCircle2 className="w-4 h-4 text-green-400 mt-1" />}
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
