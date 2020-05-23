import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom";

import Texts from './Pages/Texts';
import About from './Pages/About';
import Login from './Pages/Login';

 export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
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
                <Link to="login">Login</Link>
              </li>
            </ul>
          </nav>
        </div>
          <Route exact path="/" component={Texts} />
          <Route path="/texts" component={Texts} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
        </Router>
      </div>
    );
  }
}
