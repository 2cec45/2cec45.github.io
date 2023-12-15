if (window.DeviceOrientationEvent) {
    // Gyroskop-Event-Listener hinzufügen
    window.addEventListener('deviceorientation', handleOrientation, true);
    window.addEventListener('devicemotion', handleAcceleration, true);

} else {
    console.log('Gyroskop wird nicht unterstützt');
}

// Funktion zum Handhaben von Gyroskopdaten
function handleOrientation(event) {
    // Extrahiere die Rotationsdaten (x, y, z)
    var o_x = event.beta;  // Beta entspricht der Neigung um die X-Achse
    var o_y = event.gamma; // Gamma entspricht der Neigung um die Y-Achse
    var o_z = event.alpha; // Alpha entspricht der Rotation um die Z-Achse

    var gyroDataSpan = document.getElementById('orientationSpan');
    gyroDataSpan.innerText = 'Orientation Data: X - ' + o_x.toFixed(2) + ', Y - ' + o_y.toFixed(2) + ', Z - ' + o_z.toFixed(2);
}

let gyroscope = new Gyroscope({ frequency: 60 });

gyroscope.addEventListener("reading", (e) => {
    console.log(`Angular velocity along the X-axis ${gyroscope.x}`);
    document.getElementById("accelerationSpan").innerText = gyroscope.x;
    console.log(`Angular velocity along the Y-axis ${gyroscope.y}`);
    console.log(`Angular velocity along the Z-axis ${gyroscope.z}`);
});
gyroscope.start();

function handleAcceleration(event) {
    // Extrahiere die Rotationsdaten (x, y, z)
    var d_x = event.beta;  // Beta entspricht der Neigung um die X-Achse
    var d_y = event.gamma; // Gamma entspricht der Neigung um die Y-Achse
    var d_z = event.alpha; // Alpha entspricht der Rotation um die Z-Achse
    console.log("test1234");
    var gyroDataSpan = document.getElementById('accelerationSpan');
    gyroDataSpan.innerText = 'Motion Data: X - ' + d_x.toFixed(2) + ', Y - ' + d_y.toFixed(2) + ', Z - ' + d_z.toFixed(2);
}

function setStartPoint() {
    console.log("Startpoint set.");
}