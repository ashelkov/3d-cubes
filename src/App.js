import React, { Component } from 'react';
// components
import HyperCube from './components/HyperCube';
// styles
import './App.scss';

class App extends Component {

  resetHyperCube = () => {
    this.hypercube.reset();
  };

  render() {
    return (
      <div className="app-container">
        <HyperCube ref={(ref) => this.hypercube = ref} />
        <div className="control-buttons">
          <button className="button reset-button" onClick={this.resetHyperCube}>Reset</button>
        </div>
      </div>
    )
  }
}

export default App;
