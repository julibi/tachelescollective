import React from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useFirebase } from '../Firebase';

// interface SignOutButtonProps extends RouteComponentProps<any> {
//   firebase: firebase;
//   className: string;
// }

const SignOutButton = ({ className }) => {
  const { firebaseFunctions } = useFirebase();
  const history = useHistory();
  const handleClick = async () => {
    if (firebaseFunctions) {
      await firebaseFunctions.doSignOut();
      history.push('/texts');
    }
  };
  return (
    <button type="button" onClick={handleClick} className={className}>
      SIGN OUT
    </button>
  )
};

export default SignOutButton;

SignOutButton.propTypes = {
  className: PropTypes.string
};