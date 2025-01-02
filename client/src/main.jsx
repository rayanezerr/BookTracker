import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import Navbar from "./components/navbar";

const root = createRoot(document.getElementById("root"))
root.render(
  <BrowserRouter>
    <Navbar />
    <App />
  </BrowserRouter>
);