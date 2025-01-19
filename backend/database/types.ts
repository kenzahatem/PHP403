export interface Continent {
    id: number;
    image : string ;
    label: string;
    description : string ; 
  }
  
  export interface Country {
    id: number;
    label: string;
    description : string ;
    continent : number ; 
    flag : string ;
    languages : string ; 
 
  }
  
  export interface City {
    id: number;
    image: string;
    coordinates : string ;
    country : number ; 
    label : string ; 
    description : string ; 
  }
  
  export interface Place {
    id: number;
    label: string;
    coordinates : string ;
    country : number ; 
    themes : Array<string> ; 
    city : number ; 
  }
  
  export interface Theme {
    id: number;
    label: string;
    superclasses : Array<number> ; 
  }

  //version 1 
  export interface Relationship {
    fromID: string;
    from: string;
    toID: string;
    to: string;
    type: string;

  }
  

  