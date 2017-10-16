import React from 'react';
// recompose
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
// components
import Cube from './Cube';
import './HyperCube.scss';

const HyperCube = ({
  depth,
  width,
  height,
  size,
}) => {
  const cubes = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < depth; x++) {
      for (let z = 0; z < width; z++) {
        cubes.push(
          <Cube
            key={`${x}-${y}-${z}`}
            posX={x-depth/2}
            posY={y-height/2}
            posZ={z-width/2}
            size={size}
            zIndex={(10-y)*100 + (100-x) + z}
          />
        );
      };
    };
  };

  return (
    <div className="hypercube-container">
      {cubes}
    </div>
  )
};

export default compose(
  defaultProps({
    depth: 5,
    width: 5,
    height: 5,
    size: 3,
  }),
)(HyperCube);
