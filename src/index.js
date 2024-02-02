import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import "./flag.css"; // core css
import { store } from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { PrimeReactProvider } from "primereact/api";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </Provider>
  // </React.StrictMode>
);

reportWebVitals();
