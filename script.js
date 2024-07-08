const points = [
    { x: 100, y: 200 },
    { x: 180, y: 100 },
    { x: 340, y: 80 },
    { x: 480, y: 230 },
    { x: 420, y: 380 },
    { x: 310, y: 410 },
    { x: 280, y: 380 },
]

function main() {
    console.log('Started...');

    const canvas = document.getElementById('canvas');
    const image = document.getElementById('image');
    canvas.width = image.clientWidth;
    canvas.height = image.clientHeight;

    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
        
    ctx.strokeStyle = 'red'; // Set the color of the polygon's border
    ctx.lineWidth = 1; // Set the width of the polygon's border
    ctx.stroke();
                
    // Create a mask effect by filling outside the polygon
    ctx.save(); // Save the current state
    ctx.fillStyle = 'rgba(255, 255, 0, 0.4)'; // Fill with a red color at 50% opacity
    ctx.fill(); // Fill the polygon area
    ctx.restore(); // Restore the state

    canvas.addEventListener('click', function(event) {
        // Get the click coordinates
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // console.log(contains2(points, x, y));
        console.log(isPointInsidePolygon(x, y, points))
    });
}

function isPointInsidePolygon(x, y, polygonPoints) {
    let counter = 0;
    
    for (let i = 0; i < polygonPoints.length; i++) {
        const pointA = polygonPoints[i];
        const pointB = polygonPoints[(i + 1) % polygonPoints.length];

        if (((pointA.y > y) !== (pointB.y > y)) &&
            (x < (pointB.x - pointA.x) * (y - pointA.y) / (pointB.y - pointA.y) + pointA.x)) {
            counter++;
        }
    }

    return counter % 2 === 1;
}

main();
