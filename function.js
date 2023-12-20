let gyroscope = new Gyroscope({ frequency: 30 });
let accelerometer = new Accelerometer({ frequency: 30 });

class Stone {
    constructor(position, direction,velocity) {
        this.position = position;
        this.radius = Math.random()*20;
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

const playerOrientation = new Int32Array(3);
const tipOrigin = new Vector(0, 20);
const lCOrigin = new Vector(10, -20);
const rCOrigin = new Vector(-10, -20);
var tip = new Vector(0, 20);
var lC = new Vector(10, -20);
var rC = new Vector(-10, -20);
const stones = new Array(50);
const middle = new Vector(500, 500);
var currentRotation = 0;




function rotate(vec, deg) {
    var result = new Vector(0,0);
    result.x = vec.x * Math.cos(deg) + vec.y * (- Math.sin(deg));
    result.y = vec.x * Math.sin(deg) + vec.y * Math.cos(deg);
    return result;
}

function add(vec1, vec2) {
    vec1.x = vec1.x + vec2.x;
    vec2.y = vec1.y + vec2.y
}
var context;
function init(){
    window.requestAnimationFrame(draw);
    const canvas = document.getElementById("drawing_canvas");
    context = canvas.getContext("2d");
    context.translate(middle.x, middle.y);
}
function setCanvasSize() {
    var canvas = document.getElementById("drawing_canvas");
    var div = document.getElementById("canvas_div");
    canvas.style.width = window.innerWidth;
    canvas.style.height = window.innerHeight + "px";
    
}

function drawPlayer(context) {
    context.beginPath();
    context.moveTo(tip.x, tip.y);
    context.lineTo(lC.x, lC.y);
    context.lineTo(rC.x, rC.y);
    context.lineTo(tip.x, tip.y);
    context.stroke();
    context.closePath()
}

function updatePositions(){
    currentRotation += 0.1;
    tip = rotate(tipOrigin,currentRotation / Math.PI*2);
    lC = rotate(lCOrigin,currentRotation / Math.PI*2);
    rC = rotate(rCOrigin,currentRotation / Math.PI*2);
    stones.forEach(element => {
        add(element.position, element.velocity);
    });
}

function drawStone(context, stone) {
    context.beginPath();
    context.arc(stone.position.x, stone.position.y, stone.radius, 0, Math.PI * 2, true);
    context.stroke()
    context.closePath();
}

function draw(){
    var pos = new Vector(0, 100);
    var st1 = new Stone(pos, new Vector(1, 1), 2);
    var height = window.innerHeight;
    var width = window.innerWidth;
    context.clearRect(-500,-500, 1000, 1000)
    updatePositions();
    drawPlayer(context);
    drawStone(context, st1);
    window.requestAnimationFrame(draw)
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