// returns letter code of current rotation angles
export function getRotationCode({ x, y, z }) {
  const X_PERSPECTIVE = 25;
  let code = '';
  [x - X_PERSPECTIVE, y, z].forEach((angle) => {
    const a = angle < 0
      ? (angle % 360) + 360
      : (angle % 360);
    if (a < 90)  return code += 'A';
    if (a < 180) return code += 'B';
    if (a < 270) return code += 'C';
    return code += 'D';
  });
  return code;
}

// returns sorting pattern based on rotation code
export function getSortingPattern(code) {
  switch (code) {
    case 'AAA': return '+Y/-X/+Z';
    case 'ABA': return '+Y/-Z/-X';
    case 'ACA': return '+Y/+X/-Z';
    case 'ADA': return '+Y/+Z/+X';

    case 'BAA': return '+Y/+X/-Z';
    case 'BBA': return '+Y/+Z/+X';
    case 'BCA': return '+Y/-X/+Z';
    case 'BDA': return '+Y/-Z/-X';

    case 'CAA': return '-Y/+X/-Z';
    case 'CBA': return '-Y/+Z/+X';
    case 'CCA': return '-Y/-X/+Z';
    case 'CDA': return '-Y/-Z/-X';

    case 'DAA': return '-Y/-X/+Z';
    case 'DBA': return '-Y/-Z/-X';
    case 'DCA': return '-Y/+X/-Z';
    case 'DDA': return '-Y/+Z/+X';
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
      for (let i = 0; i < sorter.length; i++) {
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
    console.warn('No pattern matched for:', code);
  }

  return indexes;
}
