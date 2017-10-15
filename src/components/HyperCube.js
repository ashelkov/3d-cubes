import React from 'react';
import Cube from './Cube';
import './HyperCube.scss';

const HyperCube = (props) => (
  <div className="hypercube-container">
    <Cube />
    <Cube posX={1} posY={1} posZ={1} />
    <Cube posX={2} posY={2} posZ={2} />

  </div>
);

export default HyperCube;
