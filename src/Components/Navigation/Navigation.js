import React from 'react';
import {
  Link,
  useLocation
} from "react-router-dom";
import classNames from 'classnames';
import SignOutButton from '../SignOutButton';
import { useAuthUser } from '../Session';

import './Navigation.css';

const Navigation = () => {
  const authUser = useAuthUser();
  const location = useLocation();
  
  return (
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
  );
};

export default Navigation;