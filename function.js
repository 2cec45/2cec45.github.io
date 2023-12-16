let gyroscope = new Gyroscope({ frequency: 30 });
let accelerometer = new Accelerometer({ frequency: 30 });

gyroscope.addEventListener("reading", (e) => {
    document.getElementById("gyroscopeSpan").innerText = `Angular velocity: ${gyroscope.x}, ${gyroscope.y}, ${gyroscope.z}`;
});

accelerometer.addEventListener("reading", (e) => {
    document.getElementById("accelerometerSpan").innerText = `Acceleration: ${accelerometer.x}, ${accelerometer.y}, ${accelerometer.z}`;
});

function setStartPoint() {
    gyroscope.start();
    accelerometer.start();
}