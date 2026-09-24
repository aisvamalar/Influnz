import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './app/AuthContext';
import AppRouter from './app/Router';
import './lib/i18n';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  );
}
