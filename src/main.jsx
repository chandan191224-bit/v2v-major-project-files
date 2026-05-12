import React from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  Toaster,
} from "react-hot-toast";

import "./index.css";

import App from "./App";

import ModeProvider from "./context/ModeContext";

import VehicleProvider from "./context/VehicleContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <ModeProvider>

      <VehicleProvider>

        <BrowserRouter>

          <Toaster
            position="top-right"
          />

          <App />

        </BrowserRouter>

      </VehicleProvider>

    </ModeProvider>

  </React.StrictMode>

);