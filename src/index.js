import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      theme="dark"
      toastStyle={{
        background: "#1a1a1a",
        color: "#c9a84c",
        border: "1px solid #c9a84c33",
      }}
    />
  </React.StrictMode>,
);
