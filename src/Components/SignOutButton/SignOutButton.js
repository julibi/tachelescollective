import React from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase/context';
import history from '../../history';
 
const SignOutButton = ({ firebase, className }) => {
  const handleClick = async() => {
    await firebase.doSignOut();
    history.push('/texts');
  };
  return (
    <button type="button" onClick={handleClick} className={className}>
      SIGN OUT
    </button> 
  )
};
 
export default withRouter(withFirebase(SignOutButton));