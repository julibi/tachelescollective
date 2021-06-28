import React, { useContext } from 'react';
 
export const FirebaseContext = React.createContext(null);
 
export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
      {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
);


export const useFirebase = () => {
  const firebase = useContext(FirebaseContext);
  return firebase;
}
