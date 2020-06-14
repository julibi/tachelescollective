import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../Components/Firebase/context';

const Login = ({ history, firebase }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isInvalid, setIsInvalid] = useState(true);
  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
    validate();
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    validate();
  };

  const validate = async() => {
    // TODO: be more accurate about validation
    if (email.length && password.length) {
      await setIsInvalid(false);
    }
  };

  // TODO async await
  const handleSubmit = (event, email, password) => {
    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        setEmail('');
        setPassword('');
        setError(null);
        setIsInvalid(false);
        history.push('/texts');
      })
      .catch(error => {
        console.log('error');
        setError(error);
      });
      event.preventDefault(); 
  };

  return(
    <form onSubmit={(event) => handleSubmit(event, email, password)}>
      <input
        name="email"
        value={email}
        onChange={handleChangeEmail}
        type="text"
        placeholder="E-Mail"
        autoComplete="on"
      />
      <input
        name="password"
        value={password}
        onChange={handleChangePassword}
        type="password"
        placeholder="Password"
        autoComplete="on"
      />
      <button type="submit" disabled={isInvalid}>Sign Up</button>

      {error && <p>{error.message}</p>}
  </form>
  );
}

export default withRouter(withFirebase(Login));