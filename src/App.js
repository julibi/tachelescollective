import React, { Component } from 'react';
import {
  Router,
  Route
} from "react-router-dom";
import history from './history';

import { withAuthentication } from './Components/Session';
import Texts from './Pages/Texts';
import About from './Pages/About';
import Login from './Pages/Login';
import Write from './Pages/Write';
import Navigation from './Components/Navigation';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={history}>
          <Navigation />
          <Route exact path="/" component={Texts} />
          <Route path="/texts" component={Texts} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
          <Route path="/write" component={Write} />
        </Router>
      </div>
    );
  }
}

export default withAuthentication(App);