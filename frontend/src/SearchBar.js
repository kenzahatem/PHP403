import React , {useState}from 'react';
import searchIcon from './search-icon.png'; // Icône de recherche
import { fetchAllNodes, searchFromQuery , fetchNodesByNameFragmentWithoutLabel } from './api/nodeApi.js';


function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('') ; 


    const handleInputChange = async(e)=> {
        const query = e.target.value; 
        setSearchQuery(query); 
        if (query.trim()!==""){
            const filteredNodes = await fetchNodesByNameFragmentWithoutLabel(query);
            if (filteredNodes && filteredNodes.length > 0){
                console.log("Résultats pour :", query, filteredNodes);
            }
        }
    }

    const  handleSearch = async()=>{
        if (searchQuery.trim() === ""){ 
            const nodes = await fetchAllNodes() ; 
            console.log("Données renvoyées :" , nodes) ; 
        }
        else {
            const nodes = await searchFromQuery(searchQuery) ; 
            console.log("Données à partir du résultat de la recherche:", nodes) ;
        }
    }
    return (
        <div className="search-box">
            <input 
                type="text" 
                placeholder="Tapez des mots-clés comme 'plage', 'montagne', 'aventure'"
                value={searchQuery}
                onChange={handleInputChange}
            />
            <button onClick={handleSearch}>
                <img src={searchIcon} alt="Recherche" />
            </button>
        </div>
    );
}

export default SearchBar;
