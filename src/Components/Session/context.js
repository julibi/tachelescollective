import React, { useContext, useEffect, useState } from 'react';
import { useFirebase } from '../Firebase/context';

const AuthUserContext = React.createContext(null);


// what is the difference between the two histories?

export const useAuthUser = () => {
  const authUser = useContext(AuthUserContext);
  return authUser;
}

// this component protects routes, so only people with access to a route are allowed
export const AuthUserProvider =  ({children}) => {
    const firebase = useFirebase();
    let listener;
    const [authUser, setAuthUser] = useState(null);
    // XXX: use useRef to make linter happy?
    useEffect(async() => {
      listener = await firebase.auth.onAuthStateChanged(
        authUser => {
          setAuthUser(authUser);
        },
      );
    }, []);

 
    useEffect(() => {
      return () => {
        listener();
      }
    }, [listener]);
      
    return (
      <AuthUserContext.Provider value={authUser}>
        {children}
      </AuthUserContext.Provider>
    );
};

export default AuthUserContext;