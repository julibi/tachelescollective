import React from 'react';
import {
  Link,
  useLocation
} from "react-router-dom";
import classNames from 'classnames';
import SignOutButton from '../SignOutButton';
import { AuthUserContext } from '../Session';

import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  return (
    <AuthUserContext.Consumer>
      {authUser =>
        <div className="navigationGrid">
          <div className="navigationEmpty" />
          <div className={classNames(
            "navigationTexts",
            location.pathname === "/" && "strikethrough",
            location.pathname === "/texts" && "strikethrough"
          )}>
            <Link to="/texts">HOME</Link>
          </div>
          <div className={classNames(
            "navigationAuth",
            location.pathname === "/login" && "strikethrough"
          )}>
            {authUser ?
              <SignOutButton className="signoutButton" /> :
              <Link to="/login">LOGIN</Link>
            }
          </div>
        </div>
      }
    </AuthUserContext.Consumer>
  );
};

export default Navigation;