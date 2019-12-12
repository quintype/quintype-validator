import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { HomeComponent, Migrator, Sidebar } from './home-component';

class Validator extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Sidebar/>
          <Switch>
            <Route exact path="/website" component={HomeComponent} />
            <Route exact path="/migrator" component={Migrator} />
            <Route exact path="/" component={HomeComponent} />
          </Switch>
        </Router>
      </div>

    );
  }
}

ReactDOM.render(<Validator />, document.getElementById('root'));
