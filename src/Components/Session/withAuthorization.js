import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthUserContext from './context';
import { useFirebase } from '../Firebase/context';
 
// refactor this whole component to work with Hooks!
// then think about what kind of custom context this useAuthorization hook should 
// look like, if it is not a HOC - maybe it can stay a HOC
// what is the difference between the two histories?


// this component protects routes, so only people with access to a route are allowed
const withAuthorization = condition => Component => {
  const WrappedComponent = () => {
    const firebase = useFirebase();
    const history = useHistory();
    let listener;

    useEffect(() => {
      listener = firebase.auth.onAuthStateChanged(
        authUser => {
          if (!condition(authUser)) {
            history.push('/login');
          }
        },
      );
    }, []);

 
    useEffect(() => {
      return () => {
        listener();
      }
    }, []);
      
    

      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component /> : null
          }
      </AuthUserContext.Consumer>
      );
  }
 
  return WrappedComponent;
};
 
export default withAuthorization;