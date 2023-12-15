if (window.DeviceOrientationEvent) {
    // Gyroskop-Event-Listener hinzufügen
    window.addEventListener('deviceorientation', handleOrientation, true);
    window.addEventListener('devicemotion', handleAcceleration, true);

} else {
    console.log('Gyroskop wird nicht unterstützt');
}

let gyroscope = new Gyroscope({ frequency: 30 });

gyroscope.addEventListener("reading", (e) => {
    document.getElementById("accelerationSpan").innerText = `Angular velocity along the X-axis ${gyroscope.x}, the Y-axis ${gyroscope.y} ,the Z-axis ${gyroscope.z}`;
});
gyroscope.start();