import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

import { withAuthentication } from './Components/Session';
import Texts from './Pages/Texts';
import About from './Pages/About';
import Login from './Pages/Login';
import Navigation from './Components/Navigation';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Navigation />
          <Route exact path="/" component={Texts} />
          <Route path="/texts" component={Texts} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
        </Router>
      </div>
    );
  }
}

export default withAuthentication(App);