import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { HomeComponent, Sidebar } from './home-component';
import { Migrator } from "./migrator";

class Validator extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Sidebar />
          <Switch>
            <Redirect exact from="/" to="/website" />
            <Route exact path="/website" component={HomeComponent} />
            <Route exact path="/migrator" component={Migrator} />
          </Switch>
        </Router>
      </div>

    );
  }
}

ReactDOM.render(<Validator />, document.getElementById('root'));
