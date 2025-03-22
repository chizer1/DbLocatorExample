import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Tenants from "./pages/Tenants.tsx";
import DatabaseTypes from "./pages/DatabaseTypes.tsx";
import Databases from "./pages/Databases.tsx";
import DatabaseServers from "./pages/DatabaseServers.tsx";
import Connections from "./pages/Connections.tsx";
import Home from "./pages/Home.tsx";
import NavigationBar from "./components/navigationBar.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatabaseUsers from "./pages/DatabaseUsers.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <NavigationBar />
    <div className="container mt-3">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="connections" element={<Connections />} />
        <Route path="databaseUsers" element={<DatabaseUsers />} />
        <Route path="databases" element={<Databases />} />
        <Route path="databaseServers" element={<DatabaseServers />} />
        <Route path="databaseTypes" element={<DatabaseTypes />} />
        <Route path="tenants" element={<Tenants />} />
      </Routes>
    </div>
  </BrowserRouter>
);
