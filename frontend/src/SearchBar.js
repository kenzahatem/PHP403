import React, { useState, useRef, useEffect, useCallback } from 'react';
import croixIcon from './croix.png';
import {  fetchNodesByNameFragmentWithoutLabel, fetchNodesWithRelationship } from './api/nodeApi.js';
import './interface.css';

function SearchBar({ onSearchFocus }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [breadcrumb, setBreadcrumb] = useState([]);
    const [popupContent, setPopupContent] = useState(null);
    const searchContainerRef = useRef(null);

    const handleFocus = () => {
        setIsExpanded(true);
        if (onSearchFocus) onSearchFocus();
    };

    const handleInputChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() !== "") {
            const filteredNodes = await fetchNodesByNameFragmentWithoutLabel(query);
            console.log(filteredNodes) ; 
            setSuggestions(filteredNodes.length > 0 ? filteredNodes : [{ label: 'Aucun résultat trouvé', IsLeaf: false }]);
        } else {
            setSuggestions([]);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSuggestions([]);
        setBreadcrumb([]);
    };

    const handleClickOutside = useCallback((event) => {
        if (
            searchContainerRef.current &&
            !searchContainerRef.current.contains(event.target)
        ) {
            setIsExpanded(false);
        }
    }, []);

    useEffect(() => {
        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isExpanded, handleClickOutside]);

    const openPopup = (content) => {
        console.log('Opening popup with content:', content);
        setPopupContent(content);
    };
    

    const closePopup = () => setPopupContent(null);

    const handleSuggestionClick = async (suggestion) => {
        console.log('Suggestion clicked:', suggestion);
    
        try {
            // Récupérer les résultats associés
            const nextLevelSuggestions = await fetchNodesWithRelationship(suggestion);
    
            if (nextLevelSuggestions.length > 0) {
                // Continuer la navigation
                setSuggestions(nextLevelSuggestions);
                setBreadcrumb([...breadcrumb, suggestion.Name]);
            } else {
                // Pas de résultats associés, afficher la popup
                console.log('Dernier résultat atteint. Affichage de la popup.');
                console.log(suggestion) ; 
                openPopup({
                    name: suggestion.label,
                    image: suggestion.image || '/placeholder.jpg',
                    description: suggestion.description || 'Pas de description disponible.'
                });
            }
        } catch (error) {
            console.error('Erreur lors de la gestion de la suggestion :', error);
        }
    };
    
    
    

    const handleBreadcrumbClick = async (index) => {
        const newBreadcrumb = breadcrumb.slice(0, index + 1);
        setBreadcrumb(newBreadcrumb);

        if (newBreadcrumb.length === 0) {
            clearSearch();
        } else {
            const lastNode = newBreadcrumb[newBreadcrumb.length - 1];
            const previousSuggestions = await fetchNodesWithRelationship({ Name: lastNode });
            setSuggestions(previousSuggestions);
        }
    };

    return (
        <div ref={searchContainerRef} className={`search-container ${isExpanded ? 'expanded' : ''}`}>
            <div className={`search-box ${isExpanded ? 'expanded' : ''}`}>
                <input
                    type="text"
                    placeholder="Tapez des mots-clés comme 'plage', 'montagne', 'aventure'"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    aria-label="Barre de recherche"
                />
                <button className="clear-button" onClick={clearSearch}>
                    <img src={croixIcon} alt="Réinitialiser la recherche" />
                </button>
            </div>

            {breadcrumb.length > 0 && (
                <div className="breadcrumb">
                    {breadcrumb.map((level, index) => (
                        <span key={index} className="breadcrumb-item" onClick={() => handleBreadcrumbClick(index)}>
                            {level} {index < breadcrumb.length - 1 && '>'}
                        </span>
                    ))}
                </div>
            )}

            {isExpanded && (
                <div className="photo-container">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="suggestion-icon" onClick={() => handleSuggestionClick(suggestion)}>
                            <div className="icon-content">
                                <p>{suggestion.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {popupContent && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <img src={popupContent.image} alt={popupContent.name} className="popup-image" />
                        <h2>{popupContent.name}</h2>
                        <p>{popupContent.description}</p>
                        <button className="close-popup" onClick={closePopup}>
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchBar;