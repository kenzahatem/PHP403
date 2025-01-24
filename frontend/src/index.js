import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './interface.css'; // Importation du CSS existant
import { BrowserRouter as Router } from 'react-router-dom'; // Import du Router

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router> {/* Enveloppez l'application dans le Router ici */}
            <App />
        </Router>
    </React.StrictMode>
);
