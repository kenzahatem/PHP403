import React, { useState, useRef, useEffect, useCallback } from 'react';
import croixIcon from './media/croix.png';
import {
    fetchprincipleThemesApi,
    fetchNodesByNameFragmentWithoutLabel,
    fetchNodesWithRelationship,
    fetchPlacesRelatedToThemeApi } from './api/nodeApi.js';
import './interface.css';
import plageImage from './media/imagesThemes/plage.jpg';
import montagneImage from './media/imagesThemes/montagne.jpg';
import desertImage from './media/imagesThemes/desert.jpg';
import neigeImage from './media/imagesThemes/neige.jpg';

function SearchBar({ onSearchFocus }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [canSeeMore, setcanSeeMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [breadcrumb, setBreadcrumb] = useState([]);
    const [popupContent, setPopupContent] = useState(null);
    const searchContainerRef = useRef(null);
    const [favorites, setFavorites] = useState([]);


    const handleAllPossibleThemes = async()=>{
        const themes  = await fetchprincipleThemesApi() ; 
        console.log("Les Thèmes sont:" , themes) ; 
    }

    const handleDestination = async()=>{
        const themes = [
            {
                id: "40080",
                label: "Plage",
                description: "Un lieu de détente et de baignade en bord de mer",
                flag: plageImage,
                type: "Theme" ,
            },
            {
                id: "8502",
                label: "Montagne",
                description: "Un environnement naturel avec des sommets élevés",
                flag: montagneImage,
                type: "Theme" ,
            },
            {
                id: "8514",
                label: "Désert",
                description: "Un vaste espace sec avec des dunes de sable",
                flag: desertImage,
                type: "Theme" ,
            },
            {
                id: "130003",
                label: "Neige",
                description: "Un environnement glacé avec de la neige",
                flag: neigeImage,
                type: "Theme" ,
            }
            ];
          
        // console.log(favorites) ; 
        setSuggestions(themes) ;
        console.log(favorites) ; 
        // console.log(suggestions) ;  
        setSearchQuery('Nos meilleures destinations !') ;
    }
    
    // gestion des favoris (ajout ,suppression, renvoie)
    const addToFavorites = (item) => {
        setFavorites((prevFavorites) => {
            if (!prevFavorites.some(fav => fav.label === item.label)) { 
                console.log(item.label ,"Ajouté au favoris ! ")
                return [...prevFavorites, item];
            }
            return prevFavorites; 
        });
    };
    const removeFromFavorites = (item) => {
        setFavorites((prevFavorites) => {
            console.log(item.label ,"Supprimé au favoris ! ")
            setSuggestions(prevFavorites.filter(fav => fav.label !== item.label)) ;
            setSearchQuery('favorites') ;
            return prevFavorites.filter(fav => fav.label !== item.label);
        });
        
    };
    const ListAllFavouriteItems= () => {
        // console.log(favorites) ; 
        setSuggestions(favorites) ;
        // console.log(suggestions) ;  
        setSearchQuery('favorites') ; 
    }
    // fin de la gestion des favoris

    //pagination 
    const [page, setPage] = useState(0); 
    // eslint-disable-next-line
    const [hasMore, setHasMore] = useState(true);
    const limit = 20; 
    //fin pagination 

    //fonction pour ajouter les résultats suivants 
    const loadMoreResults = async () => {
        if (!searchQuery.trim()) return; 
    
        const nextPage = page + 1;
        const newResults = await fetchNodesByNameFragmentWithoutLabel(searchQuery, nextPage * limit, limit);
    
        if (newResults.length > 0) {
            setSuggestions((prev) => [...prev, ...newResults]);
            setPage(nextPage);
            setHasMore(newResults.length === limit); 
        } else {
            setHasMore(false);
        }
    };
    //fin de la fonction 

    const handleFocus = () => {
        setIsExpanded(true);
        if (onSearchFocus) onSearchFocus();
    };

    const handleInputChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    
        if (query.trim() !== "") {
            setPage(0); 
            setSuggestions([]); 
            const filteredNodes = await fetchNodesByNameFragmentWithoutLabel(query, 0, limit);
            setHasMore(filteredNodes.length === limit); 
            setSuggestions(filteredNodes.length > 0 ? filteredNodes : [{ label: 'Aucun résultat trouvé', IsLeaf: false }]);
        } else {
            setSuggestions([]); 
            setHasMore(false); 
        }
    };
    

    const clearSearch = () => {
        setSearchQuery('');
        setSuggestions([]);
        setBreadcrumb([]);
        setcanSeeMore(true) ; 
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
            let nextLevelSuggestions = [];
    
            if (suggestion.type === "Theme") {
                // Récupérer les places associées au thème
                nextLevelSuggestions = await fetchPlacesRelatedToThemeApi(suggestion);
            } else {
                // Récupérer les relations associées
                nextLevelSuggestions = await fetchNodesWithRelationship(suggestion);
            }
    
            if (nextLevelSuggestions.length > 0) {
                // Si des suggestions sont trouvées, mettre à jour l'état
                setSuggestions(nextLevelSuggestions);
                setBreadcrumb((prev) => [...prev, suggestion.label]);
            } else {
                // Si aucune suggestion n'est trouvée, ouvrir une popup
                console.log('Dernier résultat atteint. Affichage de la popup.');
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
            <button className="star-icon" onClick={ListAllFavouriteItems}> {'⭐'}</button>
                <input
                    type="text"
                    placeholder="Tapez des mots-clés comme 'plage', 'montagne', 'aventure'"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onClick = {handleAllPossibleThemes}
                    aria-label="Barre de recherche"
                />

                <button className="clear-button" onClick={clearSearch}>
                    <img src={croixIcon} alt="Réinitialiser la recherche" />
                </button>
                
            </div>
            <div><button className="suggestion-button" onClick={handleDestination} >Nos meilleurs Destinations  </button></div>
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
        {suggestions.length === 1 && suggestions[0].label === 'Aucun résultat trouvé' ? (
            <div className="no-result">
                <img src={require('./media/aucun-resultat.png')} alt="Aucun résultat" className="no-result-icon" />
            </div>
        ) : (
            suggestions.map((suggestion, index) => {
                const isFavorite = favorites.some(fav => fav.label === suggestion.label);

                return (
                    <div key={index} className="suggestion-icon" onClick={() => handleSuggestionClick(suggestion)}>
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
            })
        )}
        {searchQuery && suggestions.length >= 60 && canSeeMore && (
            <div className="button-container">
                <button onClick={loadMoreResults} className="load-more">
                    Voir plus
                </button>
            </div>
        )}
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