const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const maxParticles = 100;
const maxDistance = 120; // Max distance to form a line

// Resize canvas dynamically
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Create particles with random size
class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - -0.01) * 1.5;
    this.vy = (Math.random() - -0.01) * 1.5;
    this.radius = Math.random() * 3 + 1; // Random radius between 1 and 4
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    // If the particle goes out of the canvas, wrap it to the opposite side
    if (this.x < 0) {
      this.x = width; // Wrap to the right side
    } else if (this.x > width) {
      this.x = 0; // Wrap to the left side
    }

    if (this.y < 0) {
      this.y = height; // Wrap to the bottom
    } else if (this.y > height) {
      this.y = 0; // Wrap to the top
    }
  }

  draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Black particles
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill(); 
  }
}

// Initialize particles
for (let i = 0; i < maxParticles; i++) {
  particles.push(new Particle());
}

// Connect particles based on distance and mouse position
const mouse = { x: null, y: null };

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        // Set the color of the line to light grey
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';  // Light grey lines
        ctx.lineWidth = 1.5;  // Thicker lines
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    // Connect particles to mouse
    if (mouse.x && mouse.y) {
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        // Set the color of the line to light grey
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';  // Light grey lines
        ctx.lineWidth = 2;  // Thicker lines
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

// Animate particles
function animate() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach((particle) => {
    particle.move();
    particle.draw();
  });
  connectParticles();
  requestAnimationFrame(animate);
}

animate();
