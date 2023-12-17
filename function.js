let gyroscope = new Gyroscope({ frequency: 30 });
let accelerometer = new Accelerometer({ frequency: 30 });
let startPoint = new Float64Array(3);
startPoint[0] = 0;
startPoint[1] = 0;
startPoint[2] = 0;

function setCanvasSize() {
    var canvas = document.getElementById("drawing_canvas");
    canvas.style.width = '${window.innerWidth}px';
    canvas.style.width = '${window.innerHeight}px';
    console.log(window.innerHeight)
}

gyroscope.addEventListener("reading", (e) => {
    console.log(`Angular velocity: ${gyroscope.x}, ${gyroscope.y}, ${gyroscope.z}`);
});

accelerometer.addEventListener("reading", (e) => {
    console.log(`Acceleration: ${accelerometer.x}, ${accelerometer.y}, ${accelerometer.z}`);
});
gyroscope.start();
accelerometer.start();

function setStartPoint() {

}