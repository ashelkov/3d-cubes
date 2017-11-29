import React, { Component } from 'react';
// components
import Cube from './Cube';
// utils
import throttle from 'lodash/throttle';
import {
  getRotationCode,
  createCubeMatrix,
  getMatrixIndexes,
} from './utils';
// styles
import './HyperCube.scss';

class HyperCube extends Component {
  constructor(props) {
    super(props);
    const matrix = createCubeMatrix(props);
    this.state = {
      posXY: null,
      rotationMode: false,
      rotation: { x: 0, y: 55, z: 0 },
      rotationCode: 'DAA',
      cubeMatrix: matrix,
      cubeMatrixIndexes: getMatrixIndexes(matrix, 'DAA'),
    };
    this.onMouseMoveThrottled = throttle(this.handleMouseMove, 100);
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.onMouseMoveThrottled);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('mousedown', this.handleMouseDown);
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
    const { rotationMode, posXY, rotation, cubeMatrix } = this.state;
    const SPEED = 3;
    if (rotationMode) {
      const shiftX = e.clientX - posXY.x;
      const shiftY = e.clientY - posXY.y;
      const degX = Math.round(shiftY / window.innerHeight * 100 * SPEED);
      const degY = Math.round(shiftX / window.innerWidth * 100 * SPEED);
      const nextRotation = {
        x: rotation.x - degX,
        y: rotation.y + degY,
        z: rotation.z,
      };
      const nextCode = getRotationCode(nextRotation);

      this.setState((prevState, props) => {
        const isReindexReqired = prevState.rotationCode !== nextCode;
        const extra = isReindexReqired ? {
          cubeMatrixIndexes: getMatrixIndexes(cubeMatrix, nextCode)
        } : {};

        return {
          posXY: { x: e.clientX, y: e.clientY },
          rotation: nextRotation,
          rotationCode: nextCode,
          ...extra,
        }
      });
    }
  };

  handleCubeClick = (x, y, z) => (e) => {
    console.log('x, y, z', {x, y, z});
  };

  render() {
    const { depth, width, height, size, margin, rotationMode } = this.props;
    const { cubeMatrix, cubeMatrixIndexes, rotation, rotationCode } = this.state;

    return (
      <div className="hypercube-container">
        {cubeMatrix.map(({ x, y, z }, index) => (
          <Cube
            key={`${x}-${y}-${z}`}
            posX={x-depth*(1+margin)/2 + margin*(x+1)}
            posY={y-height*(1+margin)/2 + margin*(y+1)}
            posZ={z-width*(1+margin)/2 + margin*(z+1)}
            size={size}
            zIndex={cubeMatrixIndexes[`${x}${y}${z}`]}
            rotationMode={rotationMode}
            rotation={rotation}
            onClick={this.handleCubeClick(x, y, z)}
          />
        ))}
        <div className="rotation-inspector">
          <div>x: {rotation.x}, y: {rotation.y}, z: {rotation.z}</div>
          <div>code: {rotationCode}</div>
        </div>
      </div>
    )
  }
}

HyperCube.defaultProps = {
  depth: 3,
  width: 3,
  height: 3,
  size: 4,
  margin: 0.25,
};

export default HyperCube;
