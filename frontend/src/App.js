import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import './interface.css';
import Spot from './Spot.mp4';

function App() {
    const [isHomePage, setIsHomePage] = useState(true);
    const [showButton, setShowButton] = useState(true);

    const handleSearchFocus = () => {
        setIsHomePage(false);
    };

    const handleBackToHome = () => {
        setIsHomePage(true);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        const handleScroll = () => {
            const isTop = window.scrollY < 50;
            setShowButton(isTop);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="app">
            {isHomePage && (
                <div className="video-container small-video">
                    <video autoPlay muted loop className="background-video">
                        <source src={Spot} type="video/mp4" />
                    </video>
                </div>
            )}

            <div className="text-container">
                <h1>KeyTrip</h1>
                <p>Explorez Votre Prochaine Destination de Rêve</p>
            </div>

            <div className="container">
                <SearchBar onSearchFocus={handleSearchFocus} />
            </div>

            {!isHomePage && showButton && (
                <button
                className="return-button"
                onClick={handleBackToHome}
            >
                <img 
                    src={require('./acceuil.png')} 
                    alt="Accueil" 
                    className="return-icon" 
                />
                </button>
            
            
            )}

            {!isHomePage && showButton && (
                <button
                    className="back-button"
                    onClick={handleBackToHome}
                >
                    <img 
                        src={require('./retour.png')} 
                        alt="retour" 
                        className="back-icon" 
                    />
                </button>
            )}
        </div>
    );
}

export default App;