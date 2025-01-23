import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import Metrics from './Metrics'; // Import Metrics if needed
import './interface.css';
import Logo from './Tour Travel Business Logo.svg'; // Import du logo SVG
import VideoAcc from './video.mp4'; // Import de la vidéo d'accueil

function App() {
    const [isHomePage, setIsHomePage] = useState(true); // State for home page view
    const [isMetricsPage, setIsMetricsPage] = useState(false); // State for metrics view
    const [showButton, setShowButton] = useState(true); // Controls visibility of navigation buttons

    const handleSearchFocus = () => {
        setIsHomePage(false); // Hide home page when search bar is focused
    };

    const toggleMetricsPage = () => {
        setIsMetricsPage(!isMetricsPage);
        setIsHomePage(false); // Ensure home page is hidden when viewing metrics
    };

    const handleBackToHome = () => {
        setIsHomePage(true);
        setIsMetricsPage(false); // Reset metrics state
        window.scrollTo(0, 0); // Scroll back to top of the page
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY < 50); // Show buttons only at the top of the page
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="app">
            {/* If Metrics Page is active */}
            {isMetricsPage ? (
                <Metrics /> // Render Metrics view
            ) : (
                <>
                    {/* Home Page Background Video */}
                    {isHomePage && (
                        <div className="video-background">
                            <video autoPlay muted loop className="background-video">
                                <source src={VideoAcc} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    {/* Home Page Text and Logo */}
                    {isHomePage && (
                        <div className="text-container">
                            {/* Affichage du logo */}
                            <img src={Logo} alt="Logo KeyTrip" className="logo" />
                            <p className="home-description">Explorez Votre Prochaine Destination de Rêve</p>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="container">
                        <SearchBar onSearchFocus={handleSearchFocus} />
                    </div>

                    {/* Navigation Buttons */}
                    {!isHomePage && (
                        <div className="navigation-buttons">
                            {showButton && (
                                <>
                                    <button className="return-button" onClick={handleBackToHome}>
                                        <img 
                                            src={require('./acceuil.png')} 
                                            alt="Accueil" 
                                            className="return-icon" 
                                        />
                                    </button>
                                    <button className="metrics-button" onClick={toggleMetricsPage}>
                                        Voir les métriques
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
// npm install react-datepicker chart.js chartjs-plugin-zoom react-chartjs-2


export default App;
