import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { routes } from "./routes";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  const element = useRoutes([
    {
      element: <Layout />,
      children: routes,
    },
  ]);

  return element;
};

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>,
);
