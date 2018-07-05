import React, { Component } from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom'
import './App.css';
import "./components/Login/Login.css"
import Login from './components/Login/Login'
import Private from './components/Private/Private'

class App extends Component {
  render() {
    return (
      //The HashRouter tag needs to wrap everything, so that you can use Route, Link, Switch, etc.
      <HashRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/private" component={Private}/>
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
