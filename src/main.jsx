import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
 import "bootstrap/dist/css/bootstrap.min.css";
import "bulma/css/bulma.min.css";
 import 'uikit/dist/css/uikit.min.css'


import { registerSW } from 'virtual:pwa-register'

// ✅ This registers the service worker
registerSW({ immediate: true })
console.log("Loaded API URL:", import.meta.env.VITE_API_URL);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
