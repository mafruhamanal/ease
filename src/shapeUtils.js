export const getBuiltInShapes = (width, height) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const shapes = {};

  shapes.circle = [];
  const radius = 100;
  for (let angle = 0; angle < 360; angle += 3) {
    const math_pi = angle * Math.PI

    const math_x = centerX + radius * Math.cos((math_pi) / 180)
    const x = Math.floor(math_x);
    const math_pi22 =  angle * Math.PI
    const math_y = centerY + radius * Math.sin((math_pi22) / 180)
    const y = Math.floor(math_y);
    shapes.circle.push({ x, y });
  }

  shapes.square = [];
  const size = 200;
  const topLeftX = centerX - size / 2;
  const topLeftY = centerY - size / 2;
  for (let x = topLeftX; x < topLeftX + size; x += 3) {
    shapes.square.push({ x: Math.floor(x), y: Math.floor(topLeftY) });
  }
  for (let y = topLeftY; y < topLeftY + size; y += 3) {
    shapes.square.push({ x: Math.floor(topLeftX + size), y: Math.floor(y) });
  }
  for (let x = topLeftX + size; x > topLeftX; x -= 3) {
    shapes.square.push({ x: Math.floor(x), y: Math.floor(topLeftY + size) });
  }
  for (let y = topLeftY + size; y > topLeftY; y -= 3) {
    shapes.square.push({ x: Math.floor(topLeftX), y: Math.floor(y) });
  }

  shapes.triangle = [];
  const top = { x: centerX, y: centerY - 100 };
  const bottomLeft = { x: centerX - 100, y: centerY + 100 };
  const bottomRight = { x: centerX + 100, y: centerY + 100 };

  for (let t = 0; t <= 1; t += 0.02) {
    shapes.triangle.push({
      x: Math.floor(top.x + t * (bottomRight.x - top.x)),
      y: Math.floor(top.y + t * (bottomRight.y - top.y)),
    });
  }
  for (let t = 0; t <= 1; t += 0.02) {
    shapes.triangle.push({
      x: Math.floor(bottomRight.x + t * (bottomLeft.x - bottomRight.x)),
      y: Math.floor(bottomRight.y + t * (bottomLeft.y - bottomRight.y)),
    });
  }
  for (let t = 0; t <= 1; t += 0.02) {
    shapes.triangle.push({
      x: Math.floor(bottomLeft.x + t * (top.x - bottomLeft.x)),
      y: Math.floor(bottomLeft.y + t * (top.y - bottomLeft.y)),
    });
  }

  return shapes;
};
