export interface Continent {
    ID: string;
    name: string;
  }
  
  export interface Country {
    ID: string;
    name: string;
    continentID: string;
  }
  
  export interface City {
    ID: string;
    name: string;
    countryID: string;
  }
  
  export interface Place {
    ID: string;
    name: string;
    cityID: string;
  }
  
  export interface Theme {
    ID: string;
    name: string;
  }
  
  export interface Relationship {
    fromID: string;
    from: string;
    toID: string;
    to: string;
    type: string;
  }
  