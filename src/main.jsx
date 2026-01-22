import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import NavigationComponent from "./NavigationComponent.jsx";
import { BrowserRouter } from "react-router-dom";
import PhotoGallery from "./PhotoGallery.jsx";
import { Toaster } from 'sonner'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* <PhotoGallery /> */}
      <NavigationComponent />
      <Toaster/>
    </BrowserRouter>
  </StrictMode>,
);
