import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeProvider.jsx';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}