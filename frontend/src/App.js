import React, { useState, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom'; // Import de Route et Routes

import SearchBar from './SearchBar';
import Suggestions from './Suggestions'; // Import de la page Suggestions
import Metrics from './Metrics'; // Import de la page Metrics
import './interface.css';
import Logo from './media/Tour Travel Business Logo.svg'; // Logo SVG
import VideoAcc from './media/video.mp4'; // Vidéo d'accueil

function App() {
    const [isHomePage, setIsHomePage] = useState(true); // State pour la vue principale
    const [isMetricsPage, setIsMetricsPage] = useState(false); // State pour la vue métriques

    const handleSearchFocus = () => {
        setIsHomePage(false); // Masquer la page d'accueil lorsque la barre de recherche est focalisée
    };

    const toggleMetricsPage = () => {
        setIsMetricsPage(!isMetricsPage);
        setIsHomePage(false); // Masquer la page d'accueil lorsqu'on affiche les métriques
    };

    const handleBackToHome = () => {
        setIsHomePage(true);
        setIsMetricsPage(isMetricsPage); // Réinitialiser l'état des métriques
        window.scrollTo(0, 0); // Revenir en haut de la page
    };

    useEffect(() => {
        const handleScroll = () => {
            const isTop = window.scrollY < 50;
            setIsHomePage(isTop);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="app">
            <Routes>
                {/* Ajoutez une route pour la page Suggestions */}
                <Route path="/suggestions" element={<Suggestions />} />
            </Routes>

            {isMetricsPage ? (
                <Metrics /> // Affiche la vue des métriques
            ) : (
                <>
                    {/* Vidéo en fond */}
                    {isHomePage && (
                        <div className="video-background">
                            <video autoPlay muted loop className="background-video">
                                <source src={VideoAcc} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    <div className="text-container">
                        {/* Affichage du logo */}
                        <img src={Logo} alt="Logo KeyTrip" className="logo" />
                        <p className="home-description">Explorez Votre Prochaine Destination de Rêve</p>
                    </div>

                    <div className="container">
                        <SearchBar onSearchFocus={handleSearchFocus} />
                    </div>


                    {!isHomePage && (
                        <button
                            className="return-button"
                            onClick={handleBackToHome}
                        >
                            <img
                                src={require('./media/accueil.png')}
                                alt="Accueil"
                                className="return-icon"
                            />
                        </button>
                    )}
                        {/* {!isHomePage && (
                        <button className="suggestion-button" onClick={handleSearchFocus}>Nos meilleurs Destinations  </button>
                    )} */}
                </>
            )}

            <button
                className="metrics-button"
                onClick={toggleMetricsPage}
            >
                {isMetricsPage ? "Back to Home" : "Toggle View Metrics"}
            </button>
        </div>
    );
}

export default App;
