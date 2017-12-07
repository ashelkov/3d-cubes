import React, { Component } from 'react';
// components
import HyperCube from './components/HyperCube';
// styles
import './App.scss';

class App extends Component {

  constructor() {
    super();
    this.state = {
      width: 2,
      height: 2,
      depth: 2,
    };
  }

  increaseDimension = (dimension) => {
    this.setState((prevState) => ({
      [dimension]: prevState[dimension] + 1
    }));
  };

  resetHypercube = () => {
    this.setState({
      width: 2,
      height: 2,
      depth: 2,
    });
  };

  render() {
    const { width, height, depth } = this.state;

    return (
      <div className="app-scene">
        <HyperCube
          width={width}
          height={height}
          depth={depth}
          margin={0.25}
          size={3}
        />
        <div className="dev-buttons">
          <button onClick={() => this.resetHypercube()}>Reset</button>
          <button onClick={() => this.increaseDimension('width')}>Width</button>
          <button onClick={() => this.increaseDimension('height')}>Height</button>
          <button onClick={() => this.increaseDimension('depth')}>Depth</button>
        </div>
      </div>
    )
  }
}

export default App;
