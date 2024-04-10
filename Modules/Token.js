import { randomBytes } from "crypto";
import { db } from "./firebase.js";
import { collection, updateDoc, doc, getDocs} from "firebase/firestore";

const Token = (username) => {
    const value = randomBytes(32).toString('hex');
    updateDoc(doc(collection(db, 'users'), username), {
        token: value,
        }).then().catch((err)=>{console.log(err); return null;}
    )
    return value;
}

const getTokenfromDb = async (username) => {
    const querySnapshot = await getDocs(collection(db, "users"));
    let userToken = null;
   
    for (const doc of querySnapshot.docs) {
       if (doc.id === username) {
         userToken = doc.data().token;
         break; // Exit the loop once the token is found
       }
    }
   
    return userToken;
   };
   

export {Token, getTokenfromDb}
