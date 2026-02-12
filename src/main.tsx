import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MandarinMaster } from "./MandarinMaster";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MandarinMaster />
  </StrictMode>
);
