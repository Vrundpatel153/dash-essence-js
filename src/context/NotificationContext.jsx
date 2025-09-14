import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

const MAX_NOTIFICATIONS = 10;

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [reminders, setReminders] = useState([]);

  // Load notifications and reminders from localStorage
  useEffect(() => {
    if (currentUser) {
      const savedNotifications = localStorage.getItem(`notifications_${currentUser.id}`);
      const savedReminders = localStorage.getItem(`reminders_${currentUser.id}`);
      
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
      
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    }
  }, [currentUser]);

  // Save to localStorage whenever notifications/reminders change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(notifications));
    }
  }, [notifications, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`reminders_${currentUser.id}`, JSON.stringify(reminders));
    }
  }, [reminders, currentUser]);

  const addNotification = (notification) => {
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Keep only the latest 10 notifications
      return updated.slice(0, MAX_NOTIFICATIONS);
    });
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addReminder = (reminder) => {
    const newReminder = {
      id: `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      active: true,
      ...reminder
    };

    setReminders(prev => [...prev, newReminder]);
    return newReminder.id;
  };

  const updateReminder = (reminderId, updates) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === reminderId ? { ...reminder, ...updates } : reminder
      )
    );
  };

  const deleteReminder = (reminderId) => {
    setReminders(prev =>
      prev.filter(reminder => reminder.id !== reminderId)
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  // Check for scheduled reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      reminders.forEach(reminder => {
        if (!reminder.active) return;
        
        if (reminder.type === 'custom' && reminder.scheduledDate) {
          const scheduledDate = new Date(reminder.scheduledDate);
          const timeDiff = Math.abs(now - scheduledDate);
          
          // If we're within 1 minute of the scheduled time
          if (timeDiff <= 60000 && scheduledDate <= now) {
            addNotification({
              type: 'reminder',
              title: 'Custom Reminder',
              message: reminder.description,
              category: 'reminder'
            });
            
            // Deactivate the reminder
            updateReminder(reminder.id, { active: false });
          }
        }
        
        if (reminder.type === 'daily' && reminder.time) {
          const [hours, minutes] = reminder.time.split(':');
          const scheduledTime = new Date();
          scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          const timeDiff = Math.abs(now - scheduledTime);
          
          // If we're within 1 minute of the scheduled time
          if (timeDiff <= 60000 && scheduledTime <= now) {
            const lastTriggered = localStorage.getItem(`daily_reminder_${reminder.id}_last`);
            const today = now.toDateString();
            
            if (lastTriggered !== today) {
              addNotification({
                type: 'reminder',
                title: 'Daily Reminder',
                message: "Don't forget to add today's spending!",
                category: 'reminder'
              });
              
              localStorage.setItem(`daily_reminder_${reminder.id}_last`, today);
            }
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    
    // Check immediately
    checkReminders();
    
    return () => clearInterval(interval);
  }, [reminders]);

  const value = {
    notifications,
    reminders,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addReminder,
    updateReminder,
    deleteReminder,
    getUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
