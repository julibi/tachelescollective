import React from 'react';
import {
  Link
} from "react-router-dom";
import SignOutButton from '../SignOutButton';
import { AuthUserContext } from '../Session';


const Navigation = () => {
  return(
    <AuthUserContext.Consumer>
      { authUser =>
       <div>
        <nav>
          <ul>
            <li>
              <Link to="/texts">Texts</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>  
            <li>
              { authUser ? <SignOutButton/> : <Link to="login">Login</Link> }
            </li>
          </ul>
        </nav>
      </div>
      }
    </AuthUserContext.Consumer>
  );
};

export default Navigation;