import React from 'react';
import ReactDOM from 'react-dom';
import MuteSwan from './muteswan/root';

// Render app to DOM
const $app = window.document.querySelector('#muteswan');
ReactDOM.hydrate(<MuteSwan />, $app);

// Register Service Worker
if ('serviceWorker' in window.navigator) {
  window.navigator.serviceWorker.register('/sw.js');
}
