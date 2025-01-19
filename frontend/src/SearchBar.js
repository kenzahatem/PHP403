import React, { useState, useRef, useEffect } from 'react';
import searchIcon from './search-icon.png';
import { fetchNodesByNameFragmentWithoutLabel , fetchNodesWithRelationship, fetchThemes} from './api/nodeApi.js';
import './interface.css';

function SearchBar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const searchContainerRef = useRef(null);

    // Gère l'expansion de la barre
    const handleFocus = () => setIsExpanded(true);
    //fin de l'expansion 

    
    // renvoie des résultats lors de la saisie
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
    // fin du renvoie lors de la saisie


    // renvoie les résultats associés a des noeuds quand on clique dessus
    const handleSearchAssociateResults = async (suggestion) => {
        console.log("Clicked on:", suggestion);

        const filteredNodes = await fetchNodesWithRelationship(suggestion);
        console.log("Résultats pour :", suggestion.label, filteredNodes);

    };
    const handleAllPossibleThemes = async()=>{
        const themes  = await fetchThemes() ; 
        console.log("Les Thèmes sont:" , themes) ; 
    }
    // fin du renvoie des résultats associés

    return (
        <div
            ref={searchContainerRef}
            className={`search-container ${isExpanded ? 'expanded' : ''}`}
        >
            {isExpanded && (
                <div
                    className="overlay"
                ></div>
            )}
            <div className={`search-box ${isExpanded ? 'expanded' : ''}`}>
                <input
                    type="text"
                    placeholder="Tapez des mots-clés comme 'plage', 'montagne', 'aventure'"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onClick={handleAllPossibleThemes}
                    aria-label="Barre de recherche"
                />
                
                <button>
                    <img src={searchIcon} alt="Recherche" />
                </button>
            </div>
            {isExpanded && (
                <div className="photo-container">
                    {suggestions.map((suggestion, index) => {
                        return (
                            <div
                                key={index}
                                className="suggestion-icon"
                                onClick={() => handleSearchAssociateResults(suggestion)}
                            >
                                <div className="icon-content">
                                    <img alt={suggestion.Name} src={suggestion.image}/>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
    
}

export default SearchBar;
