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
  margin, // 0..1
}) => {
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
    width: 4,
    height: 3,
    size: 3,
    margin: 0.25,
  }),
)(HyperCube);
