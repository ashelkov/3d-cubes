import React, { Component } from 'react';
// components
import Cube from './Cube';
// utils
import { Motion, spring, presets } from 'react-motion';
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
    this.reindexMatrix = memoize(getMatrixIndexes, (m, c, w, h, d) => `${c}-${w}-${h}-${d}`);
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.onMouseMoveThrottled);
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps()', nextProps);
    let isNextPropsChanged = false;
    ['width', 'height', 'depth'].forEach((key) => {
      if (this.props[key] !== nextProps[key]) isNextPropsChanged = true;
    });
    if (isNextPropsChanged) {
      const { width, height, depth } = nextProps;
      const { rotationCode } = this.state;
      const matrix = createCubeMatrix(nextProps);
      this.setState({
        cubeMatrix: matrix,
        cubeMatrixIndexes: this.reindexMatrix(matrix, rotationCode, width, height, depth)
      });
    }
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

      this.setState((prevState, { width, height, depth }) => {
        const isReindexReqired = prevState.rotationCode !== nextCode;
        const extra = isReindexReqired ? {
          cubeMatrixIndexes: this.reindexMatrix(cubeMatrix, nextCode, width, height, depth)
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
    // console.log('x, y, z', {x, y, z});
    console.log('e.target', e.target.title);
  };

  getCubePosition = (index, length) => {
    const { margin } = this.props;
    return (index + 0.5 - length / 2) * (margin + 1);
  };

  render() {
    const { depth, width, height, size, rotationMode } = this.props;
    const { cubeMatrix, cubeMatrixIndexes, rotation, rotationCode } = this.state;

    return (
      <div className="hypercube-container">
        {cubeMatrix.map(({ x, y, z }, index) => (
          <Motion
            key={`${x}-${y}-${z}`}
            defaultStyle={{ x: x + 1, y: y + 1 }}
            style={{
              x: spring(x, presets.gentle),
              y: spring(y, presets.gentle),
            }}
          >
            {(value) => (
              <Cube
                posX={this.getCubePosition(value.x, depth)}
                posY={this.getCubePosition(value.y, height)}
                posZ={this.getCubePosition(z, width)}
                size={size}
                zIndex={cubeMatrixIndexes[`${x}${y}${z}`]}
                rotationMode={rotationMode}
                rotation={rotation}
                onClick={this.handleCubeClick(x, y, z)}
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

HyperCube.defaultProps = {
  depth: 3,
  width: 3,
  height: 3,
  size: 3,
  margin: 0.25,
};

export default HyperCube;
