import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
//import "bulma/css/bulma.min.css";
//import "uikit/dist/css/uikit.min.css";
import "./index.css";

// PWA temporarily disabled
 import { registerSW } from "virtual:pwa-register";

 registerSW({
  immediate: true,
   onNeedRefresh() {
    window.location.reload();
  },
 });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);