import React, { useState, useRef, useEffect, useCallback } from 'react';
import PopupPortal from './PopupPortal';
import croixIcon from './media/croix.png';
import Suggestion from './Suggestion';
import {
    fetchprincipleThemesApi,
    fetchNodesByNameFragmentWithoutLabel,
    fetchNodesWithRelationship,
    fetchPlacesRelatedToThemeApi
} from './api/nodeApi.js';
import './interface.css';
import plageImage from './media/imagesThemes/plage.jpg';
import montagneImage from './media/imagesThemes/montagne.jpg';
import desertImage from './media/imagesThemes/desert.jpg';
import neigeImage from './media/imagesThemes/neige.jpg';
import TourismeImage from './media/imagesThemes/tourisme.jpg';
import foretImage from './media/imagesThemes/foret.jpg';
import lacImage from './media/imagesThemes/lac.jpg';
import prisonImage from './media/imagesThemes/prison.jpg';
import horreurImage from './media/imagesThemes/horreur.jpeg';
import stadeImage from './media/imagesThemes/stade.jpg';
import tombeImage from './media/imagesThemes/tombe.jpg';
import villePhantomeImage from './media/imagesThemes/villePhantome.jpg';
import maisonHisImage from './media/imagesThemes/maisonHis.jpg';
import grotteImage from './media/imagesThemes/grotte.jpg';
import museumImage from './media/imagesThemes/musee.jpg';
import tourImage from './media/imagesThemes/tour.jpg';
import pontImage from './media/imagesThemes/pont.jpg';
import noPhoto from './iconesAffichage/no-photo.jpg' ;
import useDebounce from './hooks/useDebounce'; 

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function SearchBar({ onSearchFocus }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [canSeeMore, setcanSeeMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [breadcrumb, setBreadcrumb] = useState([]);
    const [popupContent, setPopupContent] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const searchContainerRef = useRef(null);
    const [favorites, setFavorites] = useState([]);
    const [historyStack, setHistoryStack] = useState([]);
    const [context, setContext] = useState('search'); // 'search' ou 'favorites'


    const handleAllPossibleThemes = async () => {
        const themes = await fetchprincipleThemesApi();
        console.log("Les Thèmes sont:", themes);
    }

    const handleDestination = async () => {
        const themes = [
            {
                id: "40080",
                label: "Plage",
                description: "Un lieu de détente et de baignade en bord de mer",
                flag: plageImage,
                type: "Theme",
            },
            {
                id: "8502",
                label: "Montagne",
                description: "Un environnement naturel avec des sommets élevés",
                flag: montagneImage,
                type: "Theme",
            },
            {
                id: "8514",
                label: "Désert",
                description: "Un vaste espace sec avec des dunes de sable",
                flag: desertImage,
                type: "Theme",
            },
            {
                id: "130003",
                label: "Neige",
                description: "Un environnement glacé avec de la neige",
                flag: neigeImage,
                type: "Theme",
            },
            {
                id: "1542314",
                label: "Tourisme",
                description: "Un environnement glacé avec de la neige",
                flag: TourismeImage,
                type: "Theme",
            },
            {
                id: "4421",
                label: "Forêt",
                description: "Un environnement glacé avec de la neige",
                flag: foretImage,
                type: "Theme",
            },
            {
                id: "40357",
                label: "Prison",
                description: "Un lieu d'enfermement souvent associé à des récits sombres",
                flag: prisonImage,
                type: "Theme",
            },
            {
                id: "23397",
                label: "Lac",
                description: "Une étendue d'eau calme entourée de paysages naturels",
                flag: lacImage,
                type: "Theme",
            },
            {
                id: "3947",
                label: "Maison historique",
                description: "Un thème qui évoque la peur et le suspense",
                flag: maisonHisImage,
                type: "Theme",
            },
            {
                id: "483110",
                label: "Stade",
                description: "Un lieu où se déroulent des événements sportifs ou culturels",
                flag: stadeImage,
                type: "Theme",
            },
            {
                id: "756102",
                label: "Open Air : Museum",
                description: "Un musée en plein air, souvent historique et immersif",
                flag: museumImage, 
                type: "Theme",
            },
            {
                id: "74047",
                label: "Ville fantôme",
                description: "Une ville abandonnée remplie d'histoire et de mystère",
                flag: villePhantomeImage, 
                type: "Theme",
            },
            {
                id: "2232001",
                label: "Grotte",
                description: "Un espace souterrain naturel souvent mystérieux",
                flag: grotteImage, 
                type: "Theme",
            },
            {
                id: "173387",
                label: "Tombe",
                description: "Un lieu historique ou spirituel souvent associé au passé",
                flag: tombeImage, 
                type: "Theme",
            },
            {
                id: "12570",
                label: "Pont suspendu",
                description: "Une structure impressionnante reliant deux points éloignés",
                flag: pontImage, 
                type: "Theme",
            },
            {
                id: "81917",
                label: "Tour fortifiée",
                description: "Un bâtiment défensif témoignant d'une architecture historique",
                flag: tourImage, 
                type: "Theme",
            }
        ];
        
        

        setSuggestions(themes);
        setSearchQuery('Nos meilleures destinations !');
        setContext('suggestions');
    }

    // Gestion des favoris
    const addToFavorites = (item) => {
        setFavorites((prevFavorites) => {
            if (!prevFavorites.some(fav => fav.label === item.label)) {
                console.log(item.label, "Ajouté au favoris !");
                return [...prevFavorites, item];
            }
            return prevFavorites;
        });
    };

    const removeFromFavorites = (item) => {
        setFavorites((prevFavorites) => {
            console.log(item.label, "Supprimé des favoris !");
            setSuggestions(prevFavorites.filter(fav => fav.label !== item.label));
            setSearchQuery('favorites');
            return prevFavorites.filter(fav => fav.label !== item.label);
        });
    };

    const ListAllFavouriteItems = () => {
        setSuggestions(favorites);
        setSearchQuery('favorites');
        setContext('favorites');
    }


    // Fonction pour précharger les images
    const preloadImages = (imageUrls) => {
        console.log("début du chargement des images") ; 
        imageUrls.forEach((url) => {
            const img = new Image();

            img.src = url;
            console.log("image1 stocké") ; 
        });
    };
    

    // Pagination
    const [page, setPage] = useState(0);
    // eslint-disable-next-line
    const [hasMore, setHasMore] = useState(true);
    const limit = 20;

    const loadMoreResults = async () => {
        if (!searchQuery.trim()) return;

        const nextPage = page + 1;
        const newResults = await fetchNodesByNameFragmentWithoutLabel(searchQuery, nextPage * limit, limit);
        // const imageUrls = newResults.map((result) => result.image).filter(Boolean);
        // preloadImages(imageUrls);

        if (newResults.length > 0) {
            setSuggestions((prev) => [...prev, ...newResults]);
            setPage(nextPage);
            setHasMore(newResults.length === limit);
        } else {
            setHasMore(false);
        }
    };

    const handleFocus = () => {
        setIsExpanded(true);
        if (onSearchFocus) onSearchFocus();
        setContext('search');
    };

    const saveToHistory = () => {
        setHistoryStack((prevStack) => [
            ...prevStack,
            {
                searchQuery: deepClone(searchQuery),
                suggestions: deepClone(suggestions),
                breadcrumb: deepClone(breadcrumb),
            },
        ]);
    };

    const goBack = () => {
        if (historyStack.length === 0) return; // No history to go back to

        const previousState = historyStack[historyStack.length - 1];
        setSearchQuery(previousState.searchQuery);
        setSuggestions(previousState.suggestions);
        setBreadcrumb(previousState.breadcrumb);

        // Remove the last state from the stack
        setHistoryStack((prevStack) => prevStack.slice(0, prevStack.length - 1));
    };

    const debouncedQuery = useDebounce(searchQuery, 80 ); 

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value); // Met à jour la requête de recherche
        setContext('search');
    };

    useEffect(() => {
        const fetchResults = async () => {
            if (context !== 'search') return;
            if (debouncedQuery.trim() !== "") {
                setSuggestions([]);
                const filteredNodes = await fetchNodesByNameFragmentWithoutLabel(debouncedQuery, 0, limit);
                // const imageUrls = filteredNodes.map((result) => result.image).filter(Boolean);
                // preloadImages(imageUrls);
                setHasMore(filteredNodes.length === limit);
                setSuggestions(filteredNodes.length > 0 ? filteredNodes : [{ label: 'Aucun résultat trouvé', IsLeaf: false }]);
            } else {
                setSuggestions([]);
                setHasMore(false);
            }
        };

        fetchResults();
    }, [debouncedQuery,context]);

    const clearSearch = () => {
        setSearchQuery('');
        setSuggestions([]);
        setBreadcrumb([]);
        setcanSeeMore(true);
    };

    const handleClickOutside = useCallback((event) => {
        // Ignorer les clics autres que le clic gauche
        if (event.button !== 0) return;

        // Si le clic est en dehors du conteneur de recherche et qu'aucune popup n'est ouverte
        if (
            searchContainerRef.current &&
            !searchContainerRef.current.contains(event.target) &&
            !isPopupOpen
        ) {
            setIsExpanded(false);
        }
    }, [isPopupOpen]);

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
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setPopupContent(null);
        setIsPopupOpen(false);
    };

    useEffect(() => {
        if (isPopupOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isPopupOpen]);

    const handleSuggestionClick = async (suggestion) => {
        console.log('Suggestion clicked:', suggestion);

        try {
            let nextLevelSuggestions = [];

            if (suggestion.type === "Theme") {
                nextLevelSuggestions = await fetchPlacesRelatedToThemeApi(suggestion);
            } else {
                nextLevelSuggestions = await fetchNodesWithRelationship(suggestion);
            }

            if (nextLevelSuggestions.length > 0) {
                saveToHistory(); // Save current state before navigating
                setSuggestions(nextLevelSuggestions);
                setBreadcrumb((prev) => [...prev, suggestion.label]);
            } else {
                openPopup({
                    name: suggestion.label,
                    image: suggestion.image || noPhoto,
                    description: suggestion.description || 'Pas de description disponible.',
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

    function capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div ref={searchContainerRef}>
            {historyStack.length > 0 && (
                <button className="back-button" onClick={goBack}>
                    <img src={require('./media/retour.png')} alt="retour" className="back-icon"/>
                </button>
            )}
            <div className={`search-box ${isExpanded ? 'expanded' : ''}`}>
                <button className="star-icon" onClick={ListAllFavouriteItems}>
                    {'⭐'}
                </button>
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
            <div className={`results-container ${isExpanded ? 'expanded' : ''}`}>
                <div>
                    <button className="suggestion-button" onClick={handleDestination}>
                        Nos meilleurs Destinations
                    </button>
                </div>
                {breadcrumb.length > 0 && (
                    <div className="breadcrumb">
                        {breadcrumb.map((level, index) => (
                            <span
                                key={index}
                                className="breadcrumb-item"
                                onClick={() => handleBreadcrumbClick(index)}
                            >
                                {level} {index < breadcrumb.length - 1 && '>'}
                            </span>
                        ))}
                    </div>
                )}
                {isExpanded && (
                    <div className="photo-container">
                        {suggestions.length === 1 && suggestions[0].label === 'Aucun résultat trouvé' ? (
                            <div className="no-result">
                                <img
                                    src={require('./media/aucun-resultat.png')}
                                    alt="Aucun résultat"
                                    className="no-result-icon"
                                />
                            </div>
                        ) : (
                            suggestions.map((suggestion) => {
                                const isFavorite = favorites.some((fav) => fav.label === suggestion.label);
                                return (
                                    <Suggestion
                                        key={suggestion.id || suggestion.label}
                                        suggestion={suggestion}
                                        handleSuggestionClick={handleSuggestionClick}
                                        isFavorite={isFavorite}
                                        addToFavorites={addToFavorites}
                                        removeFromFavorites={removeFromFavorites}
                                    />
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
                {isPopupOpen && popupContent && (
                    <PopupPortal onClose={closePopup}>
                        <img src={popupContent.image} alt={popupContent.name} className="popup-image" />
                        <h2>{popupContent.name}</h2>
                        <p>{capitalizeFirstLetter(popupContent.description)}</p>
                        <button className="popup-close" onClick={closePopup}>
                            Fermer
                        </button>
                    </PopupPortal>
                )}
            </div>
        </div>
    );
}

export default SearchBar;

