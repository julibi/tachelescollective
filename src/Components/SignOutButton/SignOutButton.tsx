import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withFirebase } from '../Firebase/context';
import history from '../../history';


interface firebase {
  doSignOut: () => void;
}

interface SignOutButtonProps extends RouteComponentProps<any> {
  firebase: firebase;
  className: string;
}

const SignOutButton = ({ firebase, className }: SignOutButtonProps) => {
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

export default withRouter(withFirebase(SignOutButton));

SignOutButton.propTypes = {
  firebase: PropTypes.object,
  className: PropTypes.string
};