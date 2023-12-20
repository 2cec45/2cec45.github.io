let gyroscope = new Gyroscope({ frequency: 30 });
let accelerometer = new Accelerometer({ frequency: 30 });

class Stone {
    constructor(position, radius, direction, velocity) {
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

const stoneAmount = 6;
const playerOrientation = new Int32Array(stoneAmount);
const tipOrigin = new Vector(0, 20);
const lCOrigin = new Vector(10, -20);
const rCOrigin = new Vector(-10, -20);
var tip = new Vector(0, 20);
var lC = new Vector(10, -20);
var rC = new Vector(-10, -20);
const stones = new Array(5);
const middle = new Vector(500, 500);
var currentRotation = 0;
var st1 = new Stone(new Vector(0, 100), new Vector(1, 1), 2);



function rotate(vec, deg) {
    var result = new Vector(0,0);
    result.x = vec.x * Math.cos(deg) + vec.y * (- Math.sin(deg));
    result.y = vec.x * Math.sin(deg) + vec.y * Math.cos(deg);
    return result;
}

function add(vec1, vec2) {
    vec1.x = vec1.x + vec2.x;
    vec1.y = vec1.y + vec2.y;
}

function scalarMult(vec, scalar){
    var res = new Vector(0,0);
    res.x = vec.x * scalar;
    res.y = vec.y * scalar;
    return res;
}

function fillStonesArray(xRange, yRange, sizeRange, velocityRange) {
    for (let i = 0; i < stones.length; i++) {
        position = new Vector( (Math.random() * (xRange.y - xRange.x)) +xRange.x,
                               (Math.random() * (yRange.y - yRange.x)) + yRange.x);
        var size = Math.random()*(sizeRange.y - sizeRange.x) + sizeRange.x;
        var direction = new Vector(-position.x / 100, -position.y / 100);
        console.log(direction);
        var velocity = Math.random()*(velocityRange.y - velocityRange.x) + velocityRange.x;
        stones[i] = new Stone(position, size, direction, velocity);
    }
}

var context;
var st2;
function init(){
    const canvas = document.getElementById("drawing_canvas");
    context = canvas.getContext("2d");
    context.translate(middle.x, middle.y);
    fillStonesArray(new Vector(-500, 500), new Vector(-500, 500), new Vector(10, 30), new Vector(0, 3));
    window.requestAnimationFrame(draw);
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
    //update Player
    currentRotation += 0.1;
    tip = rotate(tipOrigin,currentRotation / Math.PI*2);
    lC = rotate(lCOrigin,currentRotation / Math.PI*2);
    rC = rotate(rCOrigin,currentRotation / Math.PI*2);
    //update Stones
    for (let i = 0; i < stones.length; i++) {
        var mult = scalarMult(stones[i].direction, stones[i].velocity);
        console.log(mult);
        add(stones[i].position, mult);
    }
}

function drawStone(context, stone) {
    context.beginPath();
    context.arc(stone.position.x, stone.position.y, stone.radius, 0, Math.PI * 2, true);
    context.stroke()
    context.closePath();
}

function drawStones(context){
    for (let i = 0; i < stones.length; i++) {
        const element = stones[i];
        drawStone(context, element);
    }
}

function draw(){
    var height = window.innerHeight;
    var width = window.innerWidth;
    context.clearRect(-500,-500, 1000, 1000)
    updatePositions();
    drawPlayer(context);
    drawStones(context, stones);
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