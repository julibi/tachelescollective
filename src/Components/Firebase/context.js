import React, { useContext } from 'react';
import Firebase from './Firebase';
 
export const FirebaseContext = React.createContext(null);
 
// export const withFirebase = Component => props => (
//     <FirebaseContext.Consumer>
//       {firebase => <Component {...props} firebase={firebase} />}
//     </FirebaseContext.Consumer>
// );

export const useFirebase = () => {
  const firebase = useContext(FirebaseContext);
  return firebase;
}

export const FirebaseProvider = ({ children }) => {
  return (
    <FirebaseContext.Provider value={new Firebase()}>
      {children}
    </FirebaseContext.Provider>
  );
}
