import { connectToDatabase , closeConnection , getNodeByFirstLetterWithLabelNotSpecified, getNodeByFirstLetterWithLabelSpecified } from "../database/Database.ts";
import { config } from "../database/config.ts";


export const fetchNodeByFirstLetterWithLabelNotSpecified = async(Letter : string)=>  {
    const{driver, session} = connectToDatabase(config.url , config.username , config.password) ; 
    try {
        return await getNodeByFirstLetterWithLabelNotSpecified(Letter, session) ; 
    }
    finally  {
        await closeConnection(driver , session) ;
    }
}; 

export const fetchNodeByFirstLetterWithLabelSpecified = async(Label : string , Letter : string )=>{
    const {driver , session} = connectToDatabase(config.url , config.username , config.password) ; 
    try {
        return await getNodeByFirstLetterWithLabelSpecified(Label ,Letter , session ) ;
    }finally {
        await closeConnection(driver , session) ; 
    }
}; 