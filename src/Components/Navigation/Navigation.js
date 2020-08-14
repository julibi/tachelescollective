import React from 'react';
import {
  Link
} from "react-router-dom";
import SignOutButton from '../SignOutButton';
import { AuthUserContext } from '../Session';

import './Navigation.css';

const Navigation = () => {
  return(
    <AuthUserContext.Consumer>
      { authUser =>
       <div className="navigationGrid">
        <div className="navigationText">
          <Link to="/texts">Texts</Link>
        </div>
        <div className="navigationAbout">
          <Link to="/about">About</Link>
        </div>
        <div className="navigationAuth">
          { authUser ?
            <SignOutButton/> :
            <Link to="login">Login</Link>
          }
        </div>
      </div>
      }
    </AuthUserContext.Consumer>
  );
};

export default Navigation;