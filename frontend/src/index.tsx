import { Grid } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import NewNavBar from './components/utils/NewNavbar';
import './styles/index.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <>
    <BrowserRouter>
      <Grid container>
        <NewNavBar />
        <App />
      </Grid>
    </BrowserRouter>
  </>
);
