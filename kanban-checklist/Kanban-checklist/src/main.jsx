import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './style.css'  // ← VERIFIQUE SE ESTÁ ASSIM

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)