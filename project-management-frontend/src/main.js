import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(App, {}) }) }));
