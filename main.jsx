import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.jsx";
import "./index.css";

// Register Service Worker — enables offline mode & install prompt
const updateSW = registerSW({
  onNeedRefresh() {
    // App has a new version available
    if (confirm("تحديث جديد متاح — هل تريد التحديث الآن؟")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("DataFlow جاهز للعمل بدون إنترنت ✓");
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
