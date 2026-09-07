// TypeScript natively knows what an HTMLCanvasElement is!
const canvas = document.getElementById('stage') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!; // The '!' tells TS this won't be null

let angle = 0;

function draw() {
    // Clear the stage
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a basic shape spinning in the center
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);

    ctx.fillStyle = '#646cff'; // Vite Purple
    ctx.fillRect(-50, -50, 100, 100);
    ctx.restore();

    angle += 0.02;
    requestAnimationFrame(draw);
}

// Start the canvas loop
draw();
