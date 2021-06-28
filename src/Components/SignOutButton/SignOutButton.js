import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useFirebase } from '../Firebase';
import history from '../../history';


// interface firebase {
//   doSignOut: () => void;
// }

// interface SignOutButtonProps extends RouteComponentProps<any> {
//   firebase: firebase;
//   className: string;
// }

const SignOutButton = ({ className }) => {
  const firebase = useFirebase();
  const handleClick = async () => {
    await firebase.doSignOut();

    history.push('/texts');
  };
  return (
    <button type="button" onClick={handleClick} className={className}>
      SIGN OUT
    </button>
  )
};

export default withRouter(SignOutButton);

SignOutButton.propTypes = {
  firebase: PropTypes.object,
  className: PropTypes.string
};