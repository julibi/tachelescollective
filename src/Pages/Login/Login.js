import React, { useState, useEffect, useCallback } from "react";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../../Components/Firebase/context";

const Login = ({ history, firebase }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isInvalid, setIsInvalid] = useState(true);
  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const validate = useCallback(() => {
    if (email.length < 1 || password.length < 1) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  }, [email.length, password]);

  const resetLogin = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setIsInvalid(false);
  };

  // TODO async await
  const handleSubmit = (event, email, password) => {
    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then((authUser) => {
        resetLogin();
        history.push("/texts");
      })
      .catch((error) => {
        console.log("error");
        setError(error);
      });
    event.preventDefault();
  };

  useEffect(() => {
    validate();
  }, [email, password, validate]);

  return (
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
      <button type="submit" disabled={isInvalid}>
        Sign Up
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

export default withRouter(withFirebase(Login));
