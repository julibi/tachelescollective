import React, { Component } from 'react';
import {
  Router,
  Route,
  Switch
} from "react-router-dom";
import history from './history';

import { withAuthentication } from './Components/Session';
import Texts from './Pages/Texts';
import TextDetail from './Pages/TextDetail';
import About from './Pages/About';
import Login from './Pages/Login';
import Write from './Pages/Write';
import NoMatch from './Pages/NoMatch';
import Navigation from './Components/Navigation';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={history}>
          <Navigation />
          <Switch>
            <Route exact path="/" component={Texts} />
            <Route exact path="/texts" component={Texts} />
            <Route exact path="/texts/:id" component={TextDetail} />
            <Route exact path="/about" component={About} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/write/:id" component={Write} />
            <Route component={NoMatch} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default withAuthentication(App);