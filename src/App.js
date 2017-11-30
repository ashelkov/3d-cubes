import React, { Component } from 'react';
// components
import HyperCube from './components/HyperCube';
// styles
import './App.scss';

class App extends Component {

  render() {
    return (
      <div className="app-scene">
        <HyperCube />
      </div>
    )
  }
}

export default App;
