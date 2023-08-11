import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import theme from "./theme.tsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="container">
                <App />
            </div>
        </ThemeProvider>
    </React.StrictMode>
);
