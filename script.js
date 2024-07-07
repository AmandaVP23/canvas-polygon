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

        console.log(contains(points, x, y));

        // // Check if the click is inside the polygon
        // if (isPointInPolygon(x, y, points)) {
        //     alert('You clicked inside the polygon!');
        // } else {
        //     alert('You clicked outside the polygon!');
        // }
    });

    function isPointInPolygon(x, y, points) {
        let inside = false;

        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const xi = points[i].x
            const yi = points[i].y;
            const xj = points[j].x
            const yj = points[j].y;

            const intersect = ((yi > y) !== (yj > y)) &&
                              (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }
}

function contains(bounds, lat, lng) {
    //https://rosettacode.org/wiki/Ray-casting_algorithm
    var count = 0;
    for (var b = 0; b < bounds.length; b++) {
        var vertex1 = bounds[b];
        var vertex2 = bounds[(b + 1) % bounds.length];
        console.log('vertex1', vertex1, 'vertex2', vertex2, 'pos vertex2', (b + 1) % bounds.length);
        if (west(vertex1, vertex2, lng, lat))
            ++count;
    }
    return count % 2;

    /**
     * @return {boolean} true if (x,y) is west of the line segment connecting A and B
     */
    function west(A, B, x, y) {
        if (A.y <= B.y) {
            if (y <= A.y || y > B.y ||
                x >= A.x && x >= B.x) {
                return false;
            } else if (x < A.x && x < B.x) {
                return true;
            } else {
                return (y - A.y) / (x - A.x) > (B.y - A.y) / (B.x - A.x);
            }
        } else {
            return west(B, A, x, y);
        }
    }
}



main();
