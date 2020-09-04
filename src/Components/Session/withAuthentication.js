import React, { useEffect, useState } from 'react';

import { withFirebase } from '../Firebase/context';
import { AuthUserContext } from '.';
import { auth } from 'firebase';


const withAuthentication = Component => {
  const Authenticate = props => {
    const [authUser, setAuthUser] = useState(null);
    useEffect(() => {
      const fetchAuthUser = async () => {
        await props.firebase.auth.onAuthStateChanged(authUser => {
          if (authUser) {
            setAuthUser(authUser);
          } else {
            setAuthUser(null);
          }
        });
      };

      fetchAuthUser();
    }, [props.firebase]);
    return (
      <AuthUserContext.Provider value={authUser}>
        <Component {...props} />
      </AuthUserContext.Provider>
    );
  }

  return withFirebase(Authenticate);
};

export default withAuthentication;

