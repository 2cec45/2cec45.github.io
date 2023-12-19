let gyroscope = new Gyroscope({ frequency: 30 });
let accelerometer = new Accelerometer({ frequency: 30 });

class Stone {
    constructor(position, radius, direction,velocity) {
        this.position = position;
        this.radius = radius;
        this.direction = direction;
        this.velocity = velocity;
    }
}

class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}


function setCanvasSize() {
    var canvas = document.getElementById("drawing_canvas");
    var div = document.getElementById("canvas_div");
    canvas.style.width = window.innerWidth;
    canvas.style.height = window.innerHeight + "px";
}

function drawPlayer(context) {
    const tip = new Vector(0, 20);
    const lC = new Vector(10, -20);
    const rC = new Vector(-10, -20);
    context.translate(middle.x,middle.y);
    context.beginPath();
    context.goTo(tip.x, tip.y);
    context.lineTo(lC.x, lC.y);
    context.lineTo(rC.x, rC.y);
    context.lineTo(tip.x, tip.y);
    context.closePath();
}

function drawStone(context, position) {
    context.arc(position[0], position[1], Math.random()*20, 0, Math.PI * 2, true);
}

function draw(){
    var middle = new Vector(500, 500);
    var pos = new Vector(500, 100);
    const canvas = document.getElementById("drawing_canvas");
    var height = window.innerHeight;
    var width = window.innerWidth;
    const context = canvas.getContext("2d");
    upatePositions();
    context.translate(mid[0], mid[1]);
    drawPlayer(context, middle);
    drawStone(context, pos);
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