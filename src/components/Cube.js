import React from 'react';
// recompose
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withProps from 'recompose/withProps';
// styles
import cn from 'classnames';
import './Cube.scss';

const Cube = ({
  size,
  cubeStyle,
  posX,
  posY,
  posZ,
  zIndex,
  getSideStyle,
  rotation,
  withMotion,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isHovered,
}) => (
  <div
    className={cn('cube-container', {
      'no-transition': withMotion,
      'is-hovered': isHovered,
    })}
    style={cubeStyle}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <div className="back side" data-side="back" style={{ transform: getSideStyle(0, 0, -1)}} />
    <div className="left side" data-side="left" style={{ transform: getSideStyle(-1, 0, 0) + ' rotateY(90deg)'}} />
    <div className="right side" data-side="right" style={{ transform: getSideStyle(1, 0, 0)  + ' rotateY(90deg)'}} />
    <div className="top side" data-side="top" style={{ transform: getSideStyle(0, -1, 0) + ' rotateX(90deg)'}} />
    <div className="bottom side" data-side="bottom" style={{ transform: getSideStyle(0, 1, 0) + ' rotateX(90deg)'}} />
    <div className="front side" data-side="front" style={{ transform: getSideStyle(0, 0, 1)}} />
  </div>
);

export default compose(
  withProps(({ size, posX, posY, posZ, zIndex, rotation }) => {
    return {
      cubeStyle: {
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
        width: `${size}px`,
        height: `${size}px`,
        zIndex: zIndex,
      },
      getSideStyle: (modX, modY, modZ) => {
        const positions = [
          `translateX(${size*posX + modX*size/2}px)`,
          `translateY(${size*posY + modY*size/2}px)`,
          `translateZ(${size*posZ + modZ*size/2}px)`,
        ];
        return positions.join(' ');
      }
    }
  }),
  pure,
)(Cube);
