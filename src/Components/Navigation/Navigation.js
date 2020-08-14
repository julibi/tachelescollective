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
        <div className="navigationText" />
        <div className="navigationAbout">
          <Link to="/texts">HOME</Link>
        </div>
        <div className="navigationAuth">
          { authUser ?
            <SignOutButton/> :
            <Link to="login">LOGIN</Link>
          }
        </div>
      </div>
      }
    </AuthUserContext.Consumer>
  );
};

export default Navigation;