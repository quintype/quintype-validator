import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { HomeComponent, Migrator, Sidebar } from './home-component';
import ErrorPage from "./error-404";

class Validator extends React.Component {
  render() {
    return (
      <div>
        <Router basename="/quintype-validator">
          <Sidebar />
          <Switch>
            <Redirect exact from="/" to="/website" />
            <Route exact path="/website" component={HomeComponent} />
            <Route exact path="/migrator" component={Migrator} />
            <Route exact path="" component={ ErrorPage }/>
          </Switch>
        </Router>
      </div>

    );
  }
}

ReactDOM.render(<Validator />, document.getElementById('root'));
