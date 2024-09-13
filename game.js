const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const lines = [];
const numLines = 10;
const distance = 100;

// Initialize lines with random positions
for (let i = 0; i < numLines; i++) {
    const x1 = Math.random() * canvas.width;
    const y1 = Math.random() * canvas.height;
    const x2 = Math.random() * canvas.width;
    const y2 = Math.random() * canvas.height;

    lines.push({
        x1,
        y1,
        x2,
        y2,
        originalX1: x1,
        originalY1: y1,
        originalX2: x2,
        originalY2: y2
    });
}

function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(0, 1, 1, 1)';
    ctx.lineWidth = 2;

    lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
    });
}

function updateLines(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    lines.forEach(line => {
        const dist1 = Math.hypot(mouseX - line.x1, mouseY - line.y1);
        const dist2 = Math.hypot(mouseX - line.x2, mouseY - line.y2);

        if (dist1 < distance) {
            line.x1 += (line.originalX1 - line.x1) / 20;
            line.y1 += (line.originalY1 - line.y1) / 20;
        } else {
            line.x1 += (line.originalX1 - line.x1) / 20;
            line.y1 += (line.originalY1 - line.y1) / 20;
        }

        if (dist2 < distance) {
            line.x2 += (line.originalX2 - line.x2) / 20;
            line.y2 += (line.originalY2 - line.y2) / 20;
        } else {
            line.x2 += (line.originalX2 - line.x2) / 20;
            line.y2 += (line.originalY2 - line.y2) / 20;
        }
    });
}

canvas.addEventListener('mousemove', updateLines);

function animate() {
    drawLines();
    requestAnimationFrame(animate);
}

animate();
