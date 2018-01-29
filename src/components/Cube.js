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
  getTransforms,
  rotation,
  onClick,
  eraserMode,
  sideStyle,
}) => (
  <div
    style={cubeStyle}
    onClick={onClick}
    className={cn("cube-container", {'eraser-mode': eraserMode})}
  >
    <div className="back side" data-side="back"
         style={{ ...sideStyle, transform: getTransforms(0, 0, -1) }} />
    <div className="left side" data-side="left"
         style={{ ...sideStyle, transform: getTransforms(-1, 0, 0)  + ' rotateY(90deg)' }} />
    <div className="right side" data-side="right"
         style={{ ...sideStyle, transform: getTransforms(1, 0, 0)   + ' rotateY(90deg)' }} />
    <div className="top side" data-side="top"
         style={{ ...sideStyle, transform: getTransforms(0, -1, 0)  + ' rotateX(90deg)' }} />
    <div className="bottom side" data-side="bottom"
         style={{ ...sideStyle, transform: getTransforms(0, 1, 0)   + ' rotateX(90deg)' }} />
    <div className="front side" data-side="front"
         style={{ ...sideStyle, transform: getTransforms(0, 0, 1) }} />
  </div>
);

export default compose(
  withProps(({ size, posX, posY, posZ, zIndex, rotation, color }) => {
    return {
      cubeStyle: {
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
        width: `${size}px`,
        height: `${size}px`,
        zIndex: zIndex,
      },
      sideStyle: {
        background: `hsla(${color}, 60%, 65%, 0.75)`,
      },
      getTransforms: (modX, modY, modZ) => {
        return [
          `translateX(${size*posX + modX*size/2}px)`,
          `translateY(${size*posY + modY*size/2}px)`,
          `translateZ(${size*posZ + modZ*size/2}px)`,
        ].join(' ');
      },
    }
  }),
  pure,
)(Cube);
