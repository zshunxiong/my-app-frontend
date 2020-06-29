import React from 'react';
import App from './App';
import Home from './pages/Home'; 
import Space from './pages/Space';
import { BrowserRouter, Route } from 'react-router-dom';

class MyRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Route path='/' exact render={props => <App {...props} />} />
        <Route path='/home' render={props => <Home {...props} />} />
        <Route path='/space' render={props => <Space {...props} />} />
      </BrowserRouter>
    )
  }
}

export default MyRouter;