import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import OpenReplay from '@openreplay/tracker';
//...
const tracker = new OpenReplay({
    projectKey: 'FC8cwpO5yLvmHKidhn6X',
    defaultInputMode: 0,
    obscureTextNumbers: false,
    obscureTextEmails: true,
    ingestPoint: 'http://127.0.0.1:8888',
    __DISABLE_SECURE_MODE: true,
});
tracker.start();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
