if (window.DeviceOrientationEvent) {

} else {
    console.log('Gyroskop wird nicht unterstützt');
}

let gyroscope = new Gyroscope({ frequency: 30 });

gyroscope.addEventListener("reading", (e) => {
    document.getElementById("accelerationSpan").innerText = `Angular velocity: ${gyroscope.x}, ${gyroscope.y}, ${gyroscope.z}`;
});

gyroscope.start();