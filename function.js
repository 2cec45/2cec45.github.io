let gyroscope = new Gyroscope({ frequency: 30 });
let accelerometer = new Accelerometer({ frequency: 30 });
let startPoint = new Float64Array(3);
startPoint[0] = 0;
startPoint[1] = 0;
startPoint[2] = 0;

gyroscope.addEventListener("reading", (e) => {
    document.getElementById("gyroscopeSpan").innerText = `Angular velocity: ${gyroscope.x}, ${gyroscope.y}, ${gyroscope.z}`;
});

accelerometer.addEventListener("reading", (e) => {
    document.getElementById("accelerometerSpan").innerText = `Acceleration: ${accelerometer.x}, ${accelerometer.y}, ${accelerometer.z}`;
});
gyroscope.start();
accelerometer.start();

function setStartPoint() {

}