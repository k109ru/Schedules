import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Header from './components/Header.js';
import Routers from './Routes';

function App() {
  return (
    <Router>
      <Header />
      <Routers />
    </Router>
  );
}

export default App;
