import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import axios from 'axios';
import store from './Store';
import App from './App';
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { isDemoMode, getMockResponse } from './utils/demoMock';

// When REACT_APP_DEMO_MODE=true, all /api/v1 requests return dummy data (no backend needed)
if (isDemoMode()) {
  const defaultAdapter = axios.defaults.adapter;
  axios.defaults.adapter = function (config) {
    const mock = getMockResponse(config);
    if (mock) {
      return Promise.resolve({
        data: mock.data,
        status: mock.status,
        statusText: 'OK',
        headers: {},
        config,
      });
    }
    return defaultAdapter(config);
  };
}


const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
  <Provider store={store}>
  <AlertProvider template={AlertTemplate} {...options}>
    <App />
  </AlertProvider>
</Provider>,
  
);
