import React, { Component } from 'react';
// components
import Cube from './Cube';
// helpers
import {
  getRotationCode,
  createCubeMatrix,
  getMatrixIndexes,
} from './helpers';
// utils
import { Motion, StaggeredMotion, spring } from 'react-motion';
import memoize from 'lodash.memoize';
import filter from 'lodash.filter';
import reject from 'lodash.reject';
import omit from 'lodash.omit';
// styles
import './HyperCube.scss';

class HyperCube extends Component {

  constructor() {
    super();
    this.reindexMatrix = memoize(getMatrixIndexes, (m, c, x, y, z) => `${c}-${x}-${y}-${z}`);
    this.isRotating = false;
    this.rotationCode = 'DAA';
    this.posXY = {};
    this.state = this.getInitialState();
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  getInitialState = () => {
    const cubeSizes = {
      X: [-1, 0],
      Y: [-1, 0],
      Z: [-1, 0],
      size: 50,
      margin: 0.25,
    };
    const matrix = createCubeMatrix(cubeSizes);
    return {
      ...cubeSizes,
      rotation: { x: 0, y: 55, z: 0 },
      cubeMatrix: matrix,
      cubeMatrixIndexes: getMatrixIndexes(matrix, this.rotationCode),
    };
  };

  reset = () => {
    this.rotationCode = 'DAA';
    this.posXY = {};
    this.setState(
      this.getInitialState()
    );
  };

  setEraserMode = (eraserMode) => {
    this.setState({
      eraserMode,
    });
  };

  handleMouseDown = (e) => {
    this.setState({ isRotating: true });
    this.posXY = { x: e.clientX, y :e.clientY };
  };

  handleMouseUp = () => {
    this.setState({ isRotating: false });
  };

  // CUBE ROTATE
  handleMouseMove = (e) => {
    const { isRotating } = this.state;
    if (isRotating) {
      this._posXY = { x: this.posXY.x, y: this.posXY.y };
      this.posXY = { x: e.clientX, y: e.clientY };
      requestAnimationFrame(this.animateCubeRotation);
    }
  };

  animateCubeRotation = () => {
    const { rotation, cubeMatrix, isRotating } = this.state;
    const { rotationCode, posXY, _posXY } = this;
    const shiftX = _posXY.x - posXY.x;
    const shiftY = _posXY.y - posXY.y;
    if (isRotating) {
      const nextRotation = {
        x: rotation.x + Math.round(shiftY/3),
        y: rotation.y - Math.round(shiftX/3),
        z: rotation.z,
      };
      const nextCode = getRotationCode(nextRotation);
      this.setState(({ Z, Y, X }) => {
        const extra = {};
        if (nextCode !== rotationCode) {
          Object.assign(extra, {cubeMatrixIndexes: this.reindexMatrix(cubeMatrix, nextCode, X, Y, Z)});
        }
        return {
          rotation: nextRotation,
          ...extra,
        }
      });
      this.rotationCode = nextCode;
    }
  };

  // SIDE CLICK
  handleCubeClick = (x, y, z) => ({ target }) => {
    const { eraserMode } = this.state;
    const side = target.getAttribute('data-side');
    if (!side) return false;
    if (eraserMode) {
      this.removeSingleCube({x, y, z});
    } else {
      this.addNewLayer(side);
    }
  };

  addNewLayer = (side) => {
    const { Z, Y, X, cubeMatrix } = this.state;
    const { rotationCode } = this;
    const actionData = {
      top:    { Y: [Y[0] - 1, Y[1]], layer: { y: Y[0] - 1} },
      bottom: { Y: [Y[0], Y[1] + 1], layer: { y: Y[1] + 1} },
      right:  { X: [X[0], X[1] + 1], layer: { x: X[1] + 1} },
      left:   { X: [X[0] - 1, X[1]], layer: { x: X[0] - 1} },
      front:  { Z: [Z[0], Z[1] + 1], layer: { z: Z[1] + 1} },
      back:   { Z: [Z[0] - 1, Z[1]], layer: { z: Z[0] - 1} },
    }[side];
    const { layer, ...override } = actionData;
    const newFullMatrix = createCubeMatrix({ Z, Y, X, ...override });
    const newLayer = filter(newFullMatrix, layer);
    const matrix = [...cubeMatrix, ...newLayer];
    this.setState({
      cubeMatrix: matrix,
      cubeMatrixIndexes: getMatrixIndexes(matrix, rotationCode),
      ...omit(override, 'filter'),
    });
  };

  removeSingleCube = (xyz) => {
    const { cubeMatrix } = this.state;
    this.setState({
      cubeMatrix: reject(cubeMatrix, xyz)
    });
  };

  getCubePosition = (index, vector) => {
    const { margin } = this.state;
    const vectorSize = vector[1] - vector[0];
    const shiftSize = vectorSize/2 - vector[1];
    return (index + shiftSize) * (margin + 1);
  };

  getMotionDefaultStyles = (action) => {
    const { cubeMatrix } = this.state;
    return cubeMatrix.map((cube) => ({ value: 0 }));
  };

  getMotionStyles = (action) => (
    (prevInterpolatedStyles) => {
      const springPreset = {stiffness: 100, damping: 12};
      return prevInterpolatedStyles.map((_, i) => {
        return i === 0
          ? { value: spring(50, springPreset) }
          : { value: spring(prevInterpolatedStyles[i - 1].value, springPreset)}
      })
    }
  );

  _getMotionDefaultStyle = ({ x, y, z }) => {
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

  render() {
    const {
      rotation,           // current rotation angles (x, y, z)
      isRotating,         // current rotation state
      cubeMatrix,         // hypercube model (array of cubes)
      cubeMatrixIndexes,  // matrix z-indexes
      size,               // cube size
      Z, Y, X,            // dimensions size vectors
      action,             // current action that handled by react-motion
      eraserMode,         // state of eraser mode
    } = this.state;
    return (
      <div className="hypercube-container">
        <StaggeredMotion
          defaultStyles={this.getMotionDefaultStyles(action)}
          styles={this.getMotionStyles(action)}
        >
          {(interpolatingStyles) => (
            <div>
              {
                cubeMatrix.map(({ x, y, z, color }, index) => {
                  return (
                    <Cube
                      key={`${x}-${y}-${z}`}
                      posX={this.getCubePosition(x, X)}
                      posY={this.getCubePosition(y, Y)}
                      posZ={this.getCubePosition(z, Z)}
                      size={size}
                      rotation={rotation}
                      isRotating={isRotating}
                      zIndex={cubeMatrixIndexes[`${x}${y}${z}`]}
                      onClick={this.handleCubeClick(x, y, z)}
                      color={color}
                      eraserMode={eraserMode}
                    />
                  )
                })
              }
            </div>
          )}
        </StaggeredMotion>

        <div className="rotation-inspector">
          <div>x: {rotation.x}, y: {rotation.y}, z: {rotation.z}</div>
        </div>
      </div>
    )
  }
}

export default HyperCube;

// <StaggeredMotion
//   defaultStyles={[{h: 0}, {h: 0}, {h: 0}]}
//   styles={prevInterpolatedStyles => prevInterpolatedStyles.map((_, i) => {
//     return i === 0
//       ? {h: spring(100)}
//       : {h: spring(prevInterpolatedStyles[i - 1].h)}
//   })}>
//   {interpolatingStyles =>
//     <div>
//       {interpolatingStyles.map((style, i) =>
//         <div key={i} style={{border: '1px solid', height: style.h}} />)
//       }
//     </div>
//   }
// </StaggeredMotion>