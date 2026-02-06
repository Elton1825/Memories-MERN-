

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { GoogleOAuthProvider } from "@react-oauth/google";  

import App from "./App";
import reducers from "./reducers";

import "./index.css";

const store = configureStore({
  reducer: reducers,
  devTools: true,
});

const theme = createTheme();


const GOOGLE_CLIENT_ID =
  "190603700943-d7srfs8n8k1omso8s3qjhhu2ag06fju2.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>  
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </Provider>
);
