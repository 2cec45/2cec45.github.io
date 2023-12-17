let gyroscope = new Gyroscope({ frequency: 30 });
let accelerometer = new Accelerometer({ frequency: 30 });
let startPoint = new Float64Array(3);
startPoint[0] = 0;
startPoint[1] = 0;
startPoint[2] = 0;
setCanvasSize();

function setCanvasSize() {
    var drawing_canvas = document.getElementById("drawing_canvas");
    drawing_canvas.style.backroundColor = "blue";
    console.log("changed");
    drawing_canvas.style.width = window.screen.availWidth;
    drawing_canvas.style.height = window.screen.availHeight;
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