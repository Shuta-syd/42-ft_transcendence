import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css'
import { RootSocket, RootWebsocketProvider } from './contexts/WebsocketContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <>
    <BrowserRouter>
      <RootWebsocketProvider value={RootSocket}>
        <App />
      </RootWebsocketProvider>
    </BrowserRouter>
  </>
);
