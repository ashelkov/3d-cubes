import React from 'react';
// recompose
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import withProps from 'recompose/withProps';
// styles
import cn from 'classnames';
import './Cube.scss';

const Cube = ({
  size,
  cubeStyle,
  animate,
  posX,
  posY,
  posZ,
  zIndex,
  getSideStyle,
  rotationMode,
  rotation,
  onClick,
}) => (
  <div
    className={cn('cube-container', { animate, rotationMode })}
    style={cubeStyle}
    onClick={onClick}
  >
    <div className="back side" title="back"
      style={{ transform: getSideStyle(0, 0, -1)}} />
    <div className="left side" title="left"
      style={{ transform: getSideStyle(-1, 0, 0) + ' rotateY(90deg)'}} />
    <div className="right side" title="right"
      style={{ transform: getSideStyle(1, 0, 0)  + ' rotateY(90deg)'}} />
    <div className="top side" title="top"
      style={{ transform: getSideStyle(0, -1, 0) + ' rotateX(90deg)'}} />
    <div className="bottom side" title="bottom"
      style={{ transform: getSideStyle(0, 1, 0) + ' rotateX(90deg)'}} />
    <div className="front side" title="front"
      style={{ transform: getSideStyle(0, 0, 1)}} />
  </div>
);

export default compose(
  defaultProps({
    size: 5,
    animate: false,
    posX: 0,
    posY: 0,
    posZ: 0,
  }),
  withProps(({ size, posX, posY, posZ, zIndex, rotation }) => {
    return {
      cubeStyle: {
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
        width: `${size}em`,
        height: `${size}em`,
        zIndex: zIndex,
      },
      getSideStyle: (modX, modY, modZ) => {
        const positions = [
          `translateX(${size*posX + modX*size/2}em)`,
          `translateY(${size*posY + modY*size/2}em)`,
          `translateZ(${size*posZ + modZ*size/2}em)`,
        ];
        return positions.join(' ');
      }
    }
  }),
)(Cube);
