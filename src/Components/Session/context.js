import React, { useContext, useEffect, useState } from 'react';
import { useFirebase } from '../Firebase/context';

const AuthUserContext = React.createContext(null);

export const useAuthUser = () => {
  const authUser = useContext(AuthUserContext);
  return authUser;
}

// this component protects routes, so only people with access to a route are allowed
export const AuthUserProvider = ({children}) => {
    const { auth } = useFirebase();
    let listener;
    const [authUser, setAuthUser] = useState(null);
    // XXX: use useRef to make linter happy?
    useEffect(() => {
      if(auth) {
        listener = auth.onAuthStateChanged(
          authUser => {
            console.log(auth);
            setAuthUser(authUser);
          },
        );
      }
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