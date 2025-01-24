// Suggestion.js
import React, { useState, useEffect } from 'react';
import './interface.css';

function Suggestion({ suggestion, handleSuggestionClick, isFavorite, addToFavorites, removeFromFavorites }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Déclenche la transition après le montage
        setMounted(true);
    }, []);

    return (
        <div
            className={`suggestion-wrapper ${mounted ? 'mounted' : ''}`}
            onClick={() => handleSuggestionClick(suggestion)}
        >
            <div className="icon-content">
                {suggestion.flag && (
                    <img
                        src={suggestion.flag}
                        alt={suggestion.label}
                        className="img-suggestion"
                        loading="lazy"
                    />
                )}
                <p>{suggestion.label}</p>
                <span
                    className={`star-icon ${isFavorite ? 'filled' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isFavorite) {
                            removeFromFavorites(suggestion);
                        } else {
                            addToFavorites(suggestion);
                        }
                    }}
                >
                    {isFavorite ? '⭐' : '☆'}
                </span>
            </div>
        </div>
    );
}

export default Suggestion;
