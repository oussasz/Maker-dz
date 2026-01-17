import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/design-system.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </BrowserRouter>
);
