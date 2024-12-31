const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let points = [];
const numPoints = 40;
const spacing = 10;
let dragging = false;
let targetX = canvas.width / 2;
let targetY = canvas.height / 2;
let balls = [];
let score = 0;

// Initialize dragon points
for (let i = 0; i < numPoints; i++) {
  points.push({ x: canvas.width / 2, y: canvas.height / 2 });
}

// Add event listener for dragging
canvas.addEventListener("mousedown", (e) => {
  dragging = true;
  targetX = e.clientX;
  targetY = e.clientY;
});

canvas.addEventListener("mousemove", (e) => {
  if (dragging) {
    targetX = e.clientX;
    targetY = e.clientY;
  }
});

canvas.addEventListener("mouseup", () => {
  dragging = false;
});

// Function to spawn a new ball at a random position
function spawnBall() {
  const radius = 10;
  const x = Math.random() * (canvas.width - 2 * radius) + radius;
  const y = Math.random() * (canvas.height - 2 * radius) + radius;
  balls.push({ x, y, radius });
}

// Check if the dragon head is near a ball
function checkCollision() {
  if (balls.length === 0) return;

  const head = points[0];
  const ball = balls[0];
  const dx = head.x - ball.x;
  const dy = head.y - ball.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < ball.radius + 5) {
    balls.shift(); // Remove the captured ball
    score++;
    spawnBall(); // Spawn a new ball
  }
}

// Update the dragon points
function updatePoints() {
  points[0].x += (targetX - points[0].x) * 0.1;
  points[0].y += (targetY - points[0].y) * 0.1;

  for (let i = 1; i < points.length; i++) {
    const dx = points[i - 1].x - points[i].x;
    const dy = points[i - 1].y - points[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    if (distance > spacing) {
      points[i].x = points[i - 1].x - Math.cos(angle) * spacing;
      points[i].y = points[i - 1].y - Math.sin(angle) * spacing;
    }
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the dragon
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.lineWidth = 5;
  ctx.strokeStyle = "black";
  ctx.stroke();

  // Draw the balls
  balls.forEach((ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "cyan";
    ctx.fill();
  });

  // Draw the score
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Score: ${score}`, 10, 30);

  checkCollision();
  updatePoints();
  requestAnimationFrame(draw);
}

// Start the game
spawnBall();
draw();
