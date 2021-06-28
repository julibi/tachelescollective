import React, { useContext, useEffect, useState } from 'react';

import { FirebaseContext } from '../Firebase';
import { AuthUserContext } from '.';

const withAuthentication = Component => {
  const Authenticate = () => {
    const firebase = useContext(FirebaseContext)
    const [authUser, setAuthUser] = useState(null);
    useEffect(() => {
      const fetchAuthUser = async () => {
        await firebase.auth.onAuthStateChanged(authUser => {
          if (authUser) {
            setAuthUser(authUser);
          } else {
            setAuthUser(null);
          }
        });
      };

      fetchAuthUser();
    }, [firebase]);
    return (
      <AuthUserContext.Provider value={authUser}>
        <Component />
      </AuthUserContext.Provider>
    );
  }

  return Authenticate;
};

export default withAuthentication;

