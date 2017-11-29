// returns letter code of current rotation angles
export function getRotationCode({ x, y, z }) {
  const X_PERSPECTIVE = 28;
  let code = '';
  [x - X_PERSPECTIVE, y, z].forEach((angle) => {
    const a = angle < 0
      ? (angle % 360) + 360
      : (angle % 360);
    if (a < 90)  return code += 'A';
    if (a < 180) return code += 'B';
    if (a < 270) return code += 'C';
    if (a < 360) return code += 'D';
  });
  return code;
}

// returns sorting pattern based on rotation code
export function getSortingPattern(code) {
  switch (code) {
    case 'AAA': return '+Y/-X/+Z';
    case 'ABA': return '';
    case 'ACA': return '';
    case 'ADA': return '';

    case 'BAA': return '';
    case 'BBA': return '';
    case 'BCA': return '';
    case 'BDA': return '';

    case 'CAA': return '';
    case 'CBA': return '';
    case 'CCA': return '';
    case 'CDA': return '';

    case 'DAA': return '-Y/-X/+Z';
    case 'DBA': return '';
    case 'DCA': return '';
    case 'DDA': return '';
  }
}

// cube matrix creation based on dimensions
export function createCubeMatrix({ width, height, depth }) {
  const matrix = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < depth; x++) {
      for (let z = 0; z < width; z++) {
        matrix.push({ x, y, z });
      }
    }
  }
  return matrix;
}

// sort cube matrix by rotationCode
export function getMatrixIndexes(matrix, code) {
  console.log('getMatrixIndexes()', code);

  const pattern = getSortingPattern(code);
  const cubeMatrix = [...matrix];
  const indexes = {};

  if (pattern) {
    const sorter = pattern.toLowerCase().split('/');
    cubeMatrix.sort(function(a, b) {
      for (var i = 0; i < sorter.length; i++) {
        const prop = sorter[i][1];
        const inverter = sorter[i][0] === '-' ? -1 : 1;
        if (a[prop] === b[prop]) continue;
        return (a[prop] > b[prop]) ? inverter : -inverter;
      }
    });
    cubeMatrix.forEach(({ x, y, z }, index) => {
      indexes[`${x}${y}${z}`] = index;
    });
  } else {
    console.warn('No pattern matchied for:', code);
  }

  return indexes;
}
