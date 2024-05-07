import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';
import {SnackbarProvider} from "notistack";
import {Provider} from "react-redux";
import {store} from "./Stores/Store";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline />
      <SnackbarProvider/>
      <Provider store= {store}>
    <App />
      </Provider>
  </React.StrictMode>,
)
