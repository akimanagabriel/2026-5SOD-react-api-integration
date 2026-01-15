import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import SingleProductVIew from "./SingleProductVIew";

const NavigationComponent = () => {
  return (
    <Routes>
      <Route
        index
        element={<App />}
      />

      <Route
        path="/product/:id"
        element={<SingleProductVIew />}
      />
    </Routes>
  );
};

export default NavigationComponent;
