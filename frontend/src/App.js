import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import Metrics from './Metrics'; // Import the Metrics component
import './interface.css';
import Spot from './Spot.mp4';

function App() {
    const [isHomePage, setIsHomePage] = useState(true); // State for main/home view
    const [isMetricsPage, setIsMetricsPage] = useState(false); // State for metrics view

    const handleSearchFocus = () => {
        setIsHomePage(false);
    };

    const toggleMetricsPage = () => {
        // Toggle between metrics and main view
        setIsMetricsPage(!isMetricsPage);
        setIsHomePage(isMetricsPage); // Make sure to reset home state accordingly
    };

    const handleBackToHome = () => {
        setIsHomePage(true);
        setIsMetricsPage(false); // Reset metrics state
        window.scrollTo(0, 0);
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
            {isMetricsPage ? (
                <Metrics /> // Show Metrics view
            ) : (
                <>
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

                    {!isHomePage && (
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
