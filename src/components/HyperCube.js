import React, { Component } from 'react';
// components
import Cube from './Cube';
// utils
import { Motion, spring } from 'react-motion';
import throttle from 'lodash.throttle';
import memoize from 'lodash.memoize';
import {
  getRotationCode,
  createCubeMatrix,
  getMatrixIndexes,
} from './utils';
// styles
import './HyperCube.scss';

class HyperCube extends Component {

  constructor() {
    super();
    this.state = this.getInitialState();
    this.onMouseMoveThrottled = throttle(this.handleMouseMove, 100);
    this.reindexMatrix = memoize(getMatrixIndexes, (m, c, x, y, z) => `${c}-${x}-${y}-${z}`);
    this.newLayer = {};
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

  getInitialState = () => {
    const initialMeasures = {
      Z: [-1, 0],
      Y: [-1, 0],
      X: [-1, 0],
      size: 45,
      margin: 0.25,
    };
    const matrix = createCubeMatrix(initialMeasures);
    return {
      ...initialMeasures,
      posXY: null,
      isRotating: false,
      rotation: { x: 0, y: 55, z: 0 },
      rotationCode: 'DAA',
      cubeMatrix: matrix,
      cubeMatrixIndexes: getMatrixIndexes(matrix, 'DAA'),
    };
  };

  reset = () => {
    this.setState(
      this.getInitialState()
    );
  };

  handleMouseDown = (e) => {
    this.setState({
      isRotating: true,
      posXY: { x: e.clientX, y :e.clientY }
    });
  };

  handleMouseUp = () => {
    this.setState({ isRotating: false });
  };

  // CUBE ROTATE
  handleMouseMove = (e) => {
    const { isRotating, posXY, rotation, cubeMatrix } = this.state;
    const SPEED = 2;
    if (isRotating) {
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

      this.setState(({ rotationCode, Z, Y, X }) => {
        const extra = {};
        if (nextCode !== rotationCode) {
          Object.assign(extra, {
            cubeMatrixIndexes: this.reindexMatrix(cubeMatrix, nextCode, X, Y, Z)
          });
        }

        return {
          posXY: { x: e.clientX, y: e.clientY },
          rotation: nextRotation,
          rotationCode: nextCode,
          ...extra,
        }
      });
    }
  };

  // SIDE CLICK
  handleCubeClick = (x, y, z) => ({ target }) => {
    const { Z, Y, X, rotationCode } = this.state;
    const side = target.getAttribute('data-side');
    if (!side) return false;
    const override = {
      top:    { Y: [Y[0] - 1, Y[1]] },
      bottom: { Y: [Y[0], Y[1] + 1] },
      right:  { X: [X[0], X[1] + 1] },
      left:   { X: [X[0] - 1, X[1]] },
      front:  { Z: [Z[0], Z[1] + 1] },
      back:   { Z: [Z[0] - 1, Z[1]] },
    }[side];
    const matrix = createCubeMatrix({ Z, Y, X, ...override });
    this.setState({
      cubeMatrix: matrix,
      cubeMatrixIndexes: getMatrixIndexes(matrix, rotationCode),
      ...override,
    });

    this.clickedSide = side;
    this.newLayer = {
      top:    { y: y - 1 },
      bottom: { y: y + 1 },
      right:  { x: x + 1 },
      left:   { x: x - 1 },
      front:  { z: z + 1 },
      back:   { z: z - 1 },
    }[side];
  };

  getCubePosition = (index, vector) => {
    const { margin } = this.state;
    const vectorSize = vector[1] - vector[0];
    const shiftSize = vectorSize/2 - vector[1];
    return (index + shiftSize) * (margin + 1);
  };

  getMotionDefaultStyle = ({ x, y, z }) => {
    const SHIFT_SIZE = 3;
    const override = {
      top:    { y: y - SHIFT_SIZE },
      bottom: { y: y + SHIFT_SIZE },
      right:  { x: x + SHIFT_SIZE },
      left:   { x: x - SHIFT_SIZE },
      front:  { z: z + SHIFT_SIZE },
      back:   { z: z - SHIFT_SIZE },
    }[this.clickedSide];
    return { x, y, z, ...override };
  };

  isNewLayer = (xyz) => {
    const key = Object.keys(this.newLayer)[0];
    const value = Object.values(this.newLayer)[0];
    return xyz[key] === value;
  };

  render() {
    const { cubeMatrix, cubeMatrixIndexes, rotation, rotationCode, size, isRotating, Z, Y, X } = this.state;
    const springPreset = { stiffness: 100, damping: 12 };

    return (
      <div className="hypercube-container">
        {cubeMatrix.map(({ x, y, z }, index) => (
          <Motion
            key={`${x}-${y}-${z}`}
            defaultStyle={this.getMotionDefaultStyle({ x, y, z })}
            style={{
              x: spring(x, springPreset),
              y: spring(y, springPreset),
              z: spring(z, springPreset),
            }}
          >
            {(motion) => (
              <Cube
                posX={this.getCubePosition(motion.x, X)}
                posY={this.getCubePosition(motion.y, Y)}
                posZ={this.getCubePosition(motion.z, Z)}
                size={size}
                zIndex={cubeMatrixIndexes[`${x}${y}${z}`]}
                isRotating={isRotating}
                rotation={rotation}
                onClick={this.handleCubeClick(x, y, z)}
                withMotion={this.isNewLayer({x, y, z})}
              />
            )}
          </Motion>
        ))}
        <div className="rotation-inspector">
          <div>x: {rotation.x}, y: {rotation.y}, z: {rotation.z}</div>
          <div>code: {rotationCode}</div>
        </div>
      </div>
    )
  }
}

export default HyperCube;
