import React, { Component } from 'react';
// components
import HyperCube from './components/HyperCube';
// styles
import './App.scss';

class App extends Component {

  resetHyperCube = () => {
    this.hypercube.reset();
  };

  setEraserMode = (e) => {
    this.hypercube.setEraserMode(e.target.checked);
  };

  render() {
    return (
      <div className="app-container">
        <HyperCube ref={(ref) => this.hypercube = ref} />

        <div className="control-buttons">
          <label className="eraser-checkbox">
            <input type="checkbox" onChange={this.setEraserMode} />
            <span>Remove Cubes</span>
          </label>
          <button onClick={this.resetHyperCube}>Reset</button>
        </div>
      </div>
    )
  }
}

export default App;
