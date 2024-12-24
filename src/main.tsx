import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { CartProvider } from "./context/CartContext";

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <CartProvider>
      <App />
      </CartProvider>
    </StrictMode>
  );
} else {
  console.error("Root element not found");
}

