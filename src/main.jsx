import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { CartProvider } from "./context/CartContext.jsx";
import { AuthContextProvider } from "./context/AuthContext";

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <AuthContextProvider>
    <StrictMode>
      <CartProvider>
      <App />
      </CartProvider>
    </StrictMode>
    </AuthContextProvider>
  );
} else {
  console.error("Root element not found");
}

