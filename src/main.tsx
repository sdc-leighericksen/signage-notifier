import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error('Failed to render app:', error);
    rootElement.innerHTML = '<div style="color: white; padding: 20px; font-family: sans-serif;">Error loading application. Please check console for details.</div>';
  }
} else {
  console.error('Root element not found');
}
