import React from 'react';
import App from './App';
import Home from './pages/home';
import { BrowserRouter, Route } from 'react-router-dom';

class MyRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Route path='/' exact render={props => <App {...props} />} />
        <Route path='/home' render={props => <Home {...props} />} />
      </BrowserRouter>
    )
  }
}

export default MyRouter;