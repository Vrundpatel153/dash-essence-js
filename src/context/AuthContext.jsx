import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, safeLocalStorageGet, safeLocalStorageSet } from '../seed/seedData';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load existing session so data persists across reloads
    const savedUser = safeLocalStorageGet(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const users = safeLocalStorageGet(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Remove password from session data
      const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
  preferredCurrency: 'INR',
      };

      safeLocalStorageSet(STORAGE_KEYS.CURRENT_USER, sessionUser);
      setCurrentUser(sessionUser);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const { name, email, password } = userData;
      
      // Validate input
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      const users = safeLocalStorageGet(STORAGE_KEYS.USERS, []);
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        password,
        avatarUrl: null,
  preferredCurrency: 'INR',
        createdAt: new Date().toISOString(),
      };

      // Save to users list
      users.push(newUser);
      safeLocalStorageSet(STORAGE_KEYS.USERS, users);

      // Auto-login the new user
      const sessionUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
  preferredCurrency: 'INR',
      };

      safeLocalStorageSet(STORAGE_KEYS.CURRENT_USER, sessionUser);
      setCurrentUser(sessionUser);

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setCurrentUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const users = safeLocalStorageGet(STORAGE_KEYS.USERS, []);
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user in users list
      users[userIndex] = { ...users[userIndex], ...profileData };
      safeLocalStorageSet(STORAGE_KEYS.USERS, users);

      // Update current session
      const updatedSessionUser = {
        ...currentUser,
        name: profileData.name || currentUser.name,
        email: profileData.email || currentUser.email,
        avatarUrl: profileData.avatarUrl || currentUser.avatarUrl,
        preferredCurrency: profileData.preferredCurrency || currentUser.preferredCurrency,
      };

      safeLocalStorageSet(STORAGE_KEYS.CURRENT_USER, updatedSessionUser);
      setCurrentUser(updatedSessionUser);

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  // Change password method
  const changePassword = async (oldPassword, newPassword) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      const users = safeLocalStorageGet(STORAGE_KEYS.USERS, []);
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      if (userIndex === -1) throw new Error('User not found');
      if (users[userIndex].password !== oldPassword) {
        throw new Error('Current password is incorrect');
      }
      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      users[userIndex].password = newPassword;
      safeLocalStorageSet(STORAGE_KEYS.USERS, users);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted text-center mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}