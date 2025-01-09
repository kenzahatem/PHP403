import React, { useState, useRef, useEffect } from 'react';
import searchIcon from './search-icon.png';
import { fetchNodesByNameFragmentWithoutLabel } from './api/nodeApi.js';
import './interface.css';

function SearchBar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const searchContainerRef = useRef(null);

    // Gère l'expansion de la barre
    const handleFocus = () => setIsExpanded(true);

    // Gestion du clic en dehors du conteneur
    const handleClickOutside = (event) => {
        if (
            searchContainerRef.current &&
            !searchContainerRef.current.contains(event.target)
        ) {
            setIsExpanded(false); // Réinitialise l'état
        }
    };

    // Ajout et suppression des événements de clic
    useEffect(() => {
        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isExpanded]);

    const handleInputChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() !== "") {
            const filteredNodes = await fetchNodesByNameFragmentWithoutLabel(query);
            if (filteredNodes && filteredNodes.length > 0) {
                setSuggestions(filteredNodes); // Mettre à jour les suggestions
                console.log("Résultats pour :", query, filteredNodes);
            } else {
                setSuggestions([]); // Pas de résultats
            }
        } else {
            setSuggestions([]); // Effacer les suggestions si la requête est vide
        }
    };

    return (
        <div
            ref={searchContainerRef}
            className={`search-container ${isExpanded ? 'expanded' : ''}`}
        >
            {/* Overlay pour fermer l'expansion */}
            {isExpanded && (
                <div
                    className="overlay"
                    onClick={() => setIsExpanded(false)} // Revenir à l'état initial
                ></div>
            )}
            <div className={`search-box ${isExpanded ? 'expanded' : ''}`}>
                <input
                    type="text"
                    placeholder="Tapez des mots-clés comme 'plage', 'montagne', 'aventure'"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    aria-label="Barre de recherche"
                />
                <button>
                    <img src={searchIcon} alt="Recherche" />
                </button>
            </div>
            {isExpanded && (
                <div className="photo-container">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="suggestion-icon">
                            <div className="icon-content">
                                <img alt={suggestion.Name}></img>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
