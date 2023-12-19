let gyroscope = new Gyroscope({ frequency: 30 });
let accelerometer = new Accelerometer({ frequency: 30 });
let startPoint = new Float64Array(3);
let measurementActive = false;

startPoint[0] = 0;
startPoint[1] = 0;
startPoint[2] = 0;

function setCanvasSize() {
    var canvas = document.getElementById("drawing_canvas");
    var div = document.getElementById("canvas_div");
    canvas.style.width = window.innerWidth;
    canvas.style.height = window.innerHeight + "px";
    
    
}

function drawPlayer(context) {
    var tip = [0,20];
    var lC = [10, -20];
    var rC = [-10, -20];
    context.translate(middle[0],middle[1]);
    context.beginPath();
    context.goTo(tip[0], tip[1]);
    context.lineTo(lC[0], lC[1]);
    context.lineTo(rC[0], rC[1]);
    context.lineTo(tip[0], [1]);
    context.closePath();
}

function drawStone(context, position) {
    context.arc(position[0], position[1], Math.random()*20, 0, Math.PI * 2, true);
}

function draw(){
    const canvas = document.getElementById("drawing_canvas");
    var height = window.innerHeight;
    var width = window.innerWidth;
    const context = canvas.getContext("2d");
    upatePositions();
    context.translate(mid[0], mid[1]);
    drawPlayer(context);
    drawStones(context);

}





gyroscope.addEventListener("reading", (e) => {
    console.log(`Angular velocity: ${gyroscope.x}, ${gyroscope.y}, ${gyroscope.z}`);
});

accelerometer.addEventListener("reading", (e) => {
    console.log(`Acceleration: ${accelerometer.x}, ${accelerometer.y}, ${accelerometer.z}`);
    if(measurementActive) {
        
    }
});

gyroscope.start();
accelerometer.start();