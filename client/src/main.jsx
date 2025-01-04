import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import Navbar from "./components/navbar";
import { AuthProvider } from "./hooks/authContext";

const root = createRoot(document.getElementById("root"))
root.render(
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <App />
    </BrowserRouter>
  </AuthProvider>
);