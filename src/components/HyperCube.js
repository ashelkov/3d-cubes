import React, { Component } from 'react';
// components
import Cube from './Cube';
// utils
import throttle from 'lodash/throttle';
// styles
import cn from 'classnames';
import './HyperCube.scss';

class HyperCube extends Component {
  constructor() {
    super();
    this.state = {
      posXY: null,
      rotationMode: false,
      rotation: { x: 0, y: 55, z: 0 },
    };
    this.onMouseMoveThrottled = throttle(this.handleMouseMove, 100);
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('mousemove', this.onMouseMoveThrottled);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('mousemove', this.onMouseMoveThrottled);
  }

  handleMouseDown = (e) => {
    this.setState({
      rotationMode: true,
      posXY: { x: e.clientX, y :e.clientY }
    });
  };

  handleMouseUp = () => {
    this.setState({ rotationMode: false });
  };

  handleMouseMove = (e) => {
    const { rotationMode, posXY, rotation } = this.state;
    const SENSIVITY = 2;
    if (rotationMode) {
      const shiftX = e.clientX - posXY.x;
      const shiftY = e.clientY - posXY.y;
      const degX = Math.round(shiftY/window.innerHeight*100*SENSIVITY);
      const degY = Math.round(shiftX/window.innerWidth*100*SENSIVITY);
      this.setState({
        posXY: { x: e.clientX, y: e.clientY },
        rotation: {
          x: rotation.x - degX,
          y: rotation.y + degY,
          z: rotation.z,
        },
      });
    }
  };

  render() {
    const { depth, width, height, size, margin, rotationMode } = this.props;
    const { rotation } = this.state;
    const cubes = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < depth; x++) {
        for (let z = 0; z < width; z++) {
          cubes.push(
            <Cube
              key={`${x}-${y}-${z}`}
              posX={x-depth*(1+margin)/2 + margin*(x+1)}
              posY={y-height*(1+margin)/2 + margin*(y+1)}
              posZ={z-width*(1+margin)/2 + margin*(z+1)}
              size={size}
              zIndex={(10-y)*100 + (100-x) + z}
              rotationMode={rotationMode}
              rotation={rotation}
            />
          );
        }
      }
    }

    return (
      <div className="hypercube-container" onMouseDown={this.handleMouseDown}>
        {cubes}
        <div className="rotation-inspector">
          x: {rotation.x}, y: {rotation.y}, z: {rotation.z}
        </div>
      </div>
    )
  }
}

HyperCube.defaultProps = {
  depth: 2,
  width: 2,
  height: 2,
  size: 4,
  margin: 0.25,
};

export default HyperCube;
