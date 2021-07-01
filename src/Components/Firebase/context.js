import React, { useContext } from 'react';
import {Firebase, auth, db, firebaseFunctions} from './Firebase';
 
export const FirebaseContext = React.createContext(null);

export const useFirebase = () => {
  const firebase = useContext(FirebaseContext);
  return firebase;
}

export const FirebaseProvider = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{Firebase, auth, db, firebaseFunctions}}>
      {children}
    </FirebaseContext.Provider>
  );
}
