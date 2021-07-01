import React from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useFirebase } from '../Firebase';


// interface firebase {
//   doSignOut: () => void;
// }

// interface SignOutButtonProps extends RouteComponentProps<any> {
//   firebase: firebase;
//   className: string;
// }

const SignOutButton = ({ className }) => {
  const firebase = useFirebase();
  const history = useHistory();
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

export default SignOutButton;

SignOutButton.propTypes = {
  firebase: PropTypes.object,
  className: PropTypes.string
};