import React from 'react';
import searchIcon from './search-icon.png'; // Icône de recherche

function SearchBar() {
    return (
        <div className="search-box">
            <input 
                type="text" 
                placeholder="Tapez des mots-clés comme 'plage', 'montagne', 'aventure'"
            />
            <button>
                <img src={searchIcon} alt="Recherche" />
            </button>
        </div>
    );
}

export default SearchBar;
