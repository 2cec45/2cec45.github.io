let gyroscope = new Gyroscope({ frequency: 30 });
let accelerometer = new Accelerometer({ frequency: 30 });
let startPoint = new Float64Array(3);
startPoint[0] = 0;
startPoint[1] = 0;
startPoint[2] = 0;

function setCanvasSize() {
    var canvas = document.getElementById("drawing_canvas");
    var div = document.getElementById("canvas_div");
    canvas.style.width = window.innerWidth;
    canvas.style.height = window.innerHeight + "px";
    div.style.width = window.innerWidth;
    div.style.height = window.screen.availWidth;
    console.log(window.screen.availHeight + "px");
    console.log(window.innerHeight);
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