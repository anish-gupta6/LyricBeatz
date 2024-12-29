import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SongContext from './context/SongContext';

ReactDOM.render(
  <React.StrictMode>
    <SongContext>
    <App />
    </SongContext>
  </React.StrictMode>,
  document.getElementById('root')
);
