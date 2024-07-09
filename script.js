const points = [
    { x: 100, y: 200 },
    { x: 180, y: 100 },
    { x: 340, y: 80 },
    { x: 480, y: 230 },
    { x: 420, y: 380 },
    { x: 310, y: 410 },
    { x: 280, y: 380 },
];

const polygons = [
    [...points],
]

let drawing = false;
let newPolygon = [];
let canvas;
let ctx;

function main() {
    console.log('Started...');

    canvas = document.getElementById('canvas'); 
    const image = document.getElementById('image');
    canvas.width = image.clientWidth;
    canvas.height = image.clientHeight;

    ctx = canvas.getContext('2d');

    drawPolygons();

    canvas.addEventListener('click', onCanvasClick);
    // canvas.addEventListener('dblclick', onCanvasDoubleClick);
    canvas.addEventListener('mousemove', onCanvasMouseMove);
    // canvas.addEventListener('mouseup', onCanvasMouseUp);
}

function drawPolygons() {
    const image = document.getElementById('image');
    const heightRatio = image.clientHeight / image.naturalHeight;
    const widthRatio = image.clientWidth / image.naturalWidth;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < polygons.length; i++) {
        const polygonPoints = polygons[i];

        ctx.beginPath();
        ctx.moveTo(polygonPoints[0].x * widthRatio, polygonPoints[0].y * heightRatio);

        for (let i = 1; i < polygonPoints.length; i++) {
            ctx.lineTo(polygonPoints[i].x * widthRatio, polygonPoints[i].y * heightRatio);
        }

        ctx.closePath();
            
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 0, 0.4)'; 
        ctx.fill();
        ctx.restore();
    }
}

function onCanvasDrawEnd() {
    const image = document.getElementById('image');
    const heightRatio = image.clientHeight / image.naturalHeight;
    const widthRatio = image.clientWidth / image.naturalWidth;

    drawing = false;
    polygons.push(newPolygon.map((point) => ({ x: point.x / widthRatio, y: point.y / heightRatio })));
    ctx.closePath();
    newPolygon = false;
    drawPolygons();
}

function onCanvasMouseMove(event) {
    if (!drawing || newPolygon.length === 0) return;

    console.log('onCanvasMouseMove')

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const lastPoint = newPolygon[newPolygon.length - 1];
    drawPolygons();
    drawCurrentPolygon();
    drawLine(lastPoint.x, lastPoint.y, x, y);
}

function drawLine(fromX, fromY, toX, toY) {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function drawCurrentPolygon() {
    if (newPolygon.length <= 1) return;

    ctx.beginPath();
    ctx.moveTo(newPolygon[0].x, newPolygon[0].y);

    for (let i = 1; i < newPolygon.length; i++) {
        ctx.lineTo(newPolygon[i].x, newPolygon[i].y);
    }

    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function onCanvasClick(event) {
    // Get the click coordinates
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!drawing) {
        // verify if clicked in polygon
        console.log(isPointInsidePolygon(x, y, points));
        return;
    }

    if (newPolygon.length === 0) {
        newPolygon.push({ x, y });
    } else {
        const lastPoint = newPolygon[newPolygon.length - 1];
        drawLine(lastPoint.x, lastPoint.y, x, y);

        const firstPoint = newPolygon[0];
        const threshold = 10;
        const distance = Math.sqrt(Math.pow(firstPoint.x - x, 2) + Math.pow(firstPoint.y - y, 2));

        if (distance < threshold) {
            onCanvasDrawEnd();
        } else {
            newPolygon.push({ x, y });
        }
    }
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

document.getElementById('draw-btn').addEventListener('click', () => {
    console.log('DRAW');
    drawing = true;
    newPolygon = [];
    ctx.beginPath();
});

window.addEventListener('resize', () => main());

main();
