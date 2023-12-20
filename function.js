//let gyroscope = new Gyroscope({ frequency: 30 });
//let accelerometer = new Accelerometer({ frequency: 30 });

class Stone {
    constructor(position, radius, direction, velocity) {
        this.position = position;
        this.radius = radius;
        this.direction = direction;
        this.velocity = velocity;
    }
}

class Vector{
    constructor(x, y) {
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
// StoneParameters:
const xRange = new Vector(-500, 500);
const yRange = new Vector(-500, 500);
const sizeRange =  new Vector(10, 30);
const velocityRange = new Vector(2, 5);



function rotate(vec, deg) {
    var result = new Vector(0,0);
    result.x = vec.x * Math.cos(deg) + vec.y * (- Math.sin(deg));
    result.y = vec.x * Math.sin(deg) + vec.y * Math.cos(deg);
    return result;
}

function randomStonePosition() {
    var number = Math.trunc(Math.random() * 4);
    switch (number) {
        case 1:
            return new Vector(500, Math.random() * (yRange.y-yRange.x) + yRange.x);
        case 2:
            return new Vector(-500, Math.random() * (yRange.y-yRange.x) + yRange.x);
        case 3:
            return new Vector(Math.random() * (yRange.y-yRange.x) + yRange.x , 500);
        default:
            return new Vector(Math.random() * (yRange.y-yRange.x) + yRange.x , -500);
    }
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

function wallCollisionDetection(){
    
    for (let i = 0; i < stones.length; i++) {
        if((stones[i].position.x > 550) || (stones[i].position.x < -550) ||
         (stones[i].position.y < -550) || (stones[i].position.y > 550)){
            stones[i] = createRandomStone(xRange, yRange, sizeRange, velocityRange);
        }
    }
}

function normalize(vec) {
    var length = Math.sqrt((Math.pow(vec.x,2) + Math.pow(vec.y,2)));
    return new Vector(vec.x/length, vec.y/length);
}
function createRandomStone(xRange, yRange, sizeRange, velocityRange){
    position = randomStonePosition();
    var size = Math.random()*(sizeRange.y - sizeRange.x) + sizeRange.x;
    var directionNormalized = normalize(position);
    var direction = new Vector(-directionNormalized.x, -directionNormalized.y);
    var velocity = Math.random()*(velocityRange.y - velocityRange.x) + velocityRange.x;
    return new Stone(position, size, direction, velocity);
}
function fillStonesArray(xRange, yRange, sizeRange, velocityRange) {
    for (let i = 0; i < stones.length; i++) {
        stones[i] = createRandomStone(xRange, yRange, sizeRange, velocityRange);
    }
}

var context;
var st2;
function init(){
    const canvas = document.getElementById("drawing_canvas");
    context = canvas.getContext("2d");
    context.translate(middle.x, middle.y);
    fillStonesArray(xRange,yRange,sizeRange, velocityRange);
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
        add(stones[i].position, mult);
    }
    wallCollisionDetection();
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

/*gyroscope.addEventListener("reading", (e) => {
console.log(`Angular velocity: ${gyroscope.x}, ${gyroscope.y}, ${gyroscope.z}`);
});

accelerometer.addEventListener("reading", (e) => {
console.log(`Acceleration: ${accelerometer.x}, ${accelerometer.y}, ${accelerometer.z}`);
if(measurementActive) {

}
});

gyroscope.start();
accelerometer.start();
*/