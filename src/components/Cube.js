import React from 'react';
// recompose
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import withProps from 'recompose/withProps';
// styles
import cn from 'classnames';
import './Cube.scss';

function getSideStyle(XYZ, _XYZ) {

}

const Cube = ({
  size,
  cubeStyle,
  animate,
  posX,
  posY,
  posZ,
}) => (
  <div
    className={cn('cube-container', { animate })}
    style={cubeStyle}
  >
    <div className="back side"
      style={{ transform: `translateZ(${-size/2}em)`}} />
    <div className="left side"
      style={{ transform: `translateX(${-size/2}em) rotateY(90deg)`}} />
    <div className="right side"
      style={{ transform: `translateX(${size/2}em) rotateY(90deg)`}} />
    <div className="top side"
      style={{ transform: `translateY(${-size/2}em) rotateX(90deg)`}} />
    <div className="bottom side"
      style={{ transform: `translateY(${size/2}em) rotateX(90deg)`}} />
    <div className="front side"
      style={{ transform: `translateZ(${size/2}em)`}} />
  </div>
);

export default compose(
  defaultProps({
    size: 5,
    viewAngle: 55,
    animate: false,
    posX: 0,
    posY: 0,
    posZ: 0,
  }),
  withProps(({ viewAngle, size, posX, posY, posZ }) => {
    const cubeTransforms = [
      // `translateX(${posX*size}em)`,
      // `translateY(${posY*size}em)`,
      // `translateZ(${posZ*size}em)`,
      `rotateX(0)`,
      `rotateY(${viewAngle}deg)`,
      `rotateZ(0)`,
    ];
    return {
      cubeStyle: {
        transform: cubeTransforms.join(' '),
        border: '1px dashed red',
        width: `${size}em`,
        height: `${size}em`,
      },
    }
  }),
)(Cube);
