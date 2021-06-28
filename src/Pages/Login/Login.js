import React, { useState, useEffect, useCallback, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { useFirebase } from "../../Components/Firebase";
import "./Login.css";

const Login = ({ history }) => {
  const firebase = useFirebase();
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

  const handleSubmit = async (event, email, password) => {
    event.preventDefault();
    await firebase
      .doSignInWithEmailAndPassword(email, password)
      .then((authUser) => {
        resetLogin();
        history.push("/texts");
      })
      .catch((error) => {
        console.log("error");
        setError(error);
      });
  };

  useEffect(() => {
    validate();
  }, [email, password, validate]);

  return (
    <Fragment>
      <div className="loginWrapper">
        <form onSubmit={(event) => handleSubmit(event, email, password)} className="loginForm">
          <label type="text" name="username" className="label">
            {"USERNAME/E-MAIL:"}
          </label>
          <input
            className="loginField"
            name="email"
            value={email}
            onChange={handleChangeEmail}
            type="text"
            autoComplete="on"
          />
          <label type="text" name="passwort" className="label">
            {"PASSWORT:"}
          </label>
          <input
            className="loginField"
            name="password"
            value={password}
            onChange={handleChangePassword}
            type="password"
            autoComplete="on"
          />
          <button type="submit" disabled={isInvalid} className="loginButton">
            LOGIN
          </button>

          {error && <p className="errorMessage">{error.message}</p>}
        </form>
      </div>
      <div className="loginDivider" />
    </Fragment>
  );
};

export default withRouter(Login);
