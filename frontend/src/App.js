import React from 'react';
import SearchBar from './SearchBar';

function App() {
    return (
        <div className="app">
            <div className="text-container">
                <h1>KeyTrip</h1>
                <p>Explorez Votre Prochaine Destination de Rêve</p>
            </div>
            <div className="container">
                <SearchBar />
            </div>
        </div>
    );
}

export default App;
