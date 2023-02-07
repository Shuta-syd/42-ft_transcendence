import React from 'react';
import ReactDOM from 'react-dom/client';
import { Input } from 'antd';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <h1>Hello World</h1>
    <Input/>
  </React.StrictMode>
);
