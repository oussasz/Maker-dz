import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/design-system.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import i18n, { i18nInitPromise } from "./i18n";

const root = createRoot(document.getElementById("root"));

const renderApp = () => {
  root.render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </BrowserRouter>,
  );
};

i18nInitPromise
  .then(() => i18n.loadNamespaces(i18n.options?.ns || []))
  .then(renderApp)
  .catch(renderApp);
