// classes
class Stone {
    constructor(position, radius, direction, velocity) {
        this.position = position;
        this.radius = radius;
        this.direction = direction;
        this.velocity = velocity;
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Bullet {
    constructor(position, velocity, direction) {
        this.position = position;
        this.velocity = velocity;
        this.direction = direction;
    }
}
window.addEventListener('deviceorientation', onRotation, false);
// globals
var currentFrame = 0;
var alpha;
// GameParameters
const stoneAmount = 6;
const framesPerBullet = 5;
const stones = new Array(5);
const middle = new Vector(500, 500);
// PlayerParameters
var currentRotation = 0;
const tipOrigin = new Vector(0, 20);
const lCOrigin = new Vector(10, -20);
const rCOrigin = new Vector(-10, -20);
var tip = new Vector(0, 20);
var lC = new Vector(10, -20);
var rC = new Vector(-10, -20);
// StoneParameters:
const xRange = new Vector(-500, 500);
const yRange = new Vector(-500, 500);
const sizeRange = new Vector(10, 30);
const velocityRange = new Vector(2, 5);
// BulletParameters
const bulletVelocity = 6;
const bulletSize = new Vector(7, 2);
var bullets = new Array(0);


function add(vec1, vec2) {
    var result = new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
    return result;
}

function scalarMult(vec, scalar) {
    var res = new Vector(0, 0);
    res.x = vec.x * scalar;
    res.y = vec.y * scalar;
    return res;
}

function rotate(vec, deg) {
    var result = new Vector(0, 0);
    result.x = vec.x * Math.cos(deg) + vec.y * (- Math.sin(deg));
    result.y = vec.x * Math.sin(deg) + vec.y * Math.cos(deg);
    return result;
}

function onRotation(event){
    alpha = event.alpha;
}

function playerShoot(tip, lC, rC) {
    bullets.push(new Bullet(tip, bulletVelocity, normalize(tip)));
    cleanupBullets();
}
function cleanupBullets() {
    for (let i = bullets.length - 1; i >= 0 ; i--) {
        const b = bullets[i];
        if((-500 > b.position.x || b.position.x > 500) || (-500 > b.position.y || b.position.y > 500)){
            bullets = bullets.slice(i);
        }
    }
}


function drawBullet(context, bullet) {
    context.lineWidth = bulletSize.y;
    context.beginPath();
    context.moveTo(bullet.position.x, bullet.position.y);
    var newPosition = add(bullet.position, scalarMult(bullet.direction, bulletSize.x));
    context.lineTo(newPosition.x, newPosition.y);
    context.stroke();
    context.closePath();
    context.lineWidth = 1;
}

function drawBullets(context) {
    for (let i = 0; i < bullets.length; i++) {
        drawBullet(context, bullets[i]);
    }
}

function randomStonePosition() {
    var number = Math.trunc(Math.random() * 4);
    switch (number) {
        case 1:
            return new Vector(500, Math.random() * (yRange.y - yRange.x) + yRange.x);
        case 2:
            return new Vector(-500, Math.random() * (yRange.y - yRange.x) + yRange.x);
        case 3:
            return new Vector(Math.random() * (yRange.y - yRange.x) + yRange.x, 500);
        default:
            return new Vector(Math.random() * (yRange.y - yRange.x) + yRange.x, -500);
    }
}

function wallCollisionDetection() {

    for (let i = 0; i < stones.length; i++) {
        if ((stones[i].position.x > 550) || (stones[i].position.x < -550) ||
            (stones[i].position.y < -550) || (stones[i].position.y > 550)) {
            stones[i] = createRandomStone(xRange, yRange, sizeRange, velocityRange);
        }
    }
}

function normalize(vec) {
    var length = Math.sqrt((Math.pow(vec.x, 2) + Math.pow(vec.y, 2)));
    return new Vector(vec.x / length, vec.y / length);
}
function createRandomStone(xRange, yRange, sizeRange, velocityRange) {
    position = randomStonePosition();
    var size = Math.random() * (sizeRange.y - sizeRange.x) + sizeRange.x;
    var directionNormalized = normalize(position);
    var direction = new Vector(-directionNormalized.x, -directionNormalized.y);
    var velocity = Math.random() * (velocityRange.y - velocityRange.x) + velocityRange.x;
    return new Stone(position, size, direction, velocity);
}

function fillStonesArray(xRange, yRange, sizeRange, velocityRange) {
    for (let i = 0; i < stones.length; i++) {
        stones[i] = createRandomStone(xRange, yRange, sizeRange, velocityRange);
    }
}

var context;
var st2;
function init() {
    const canvas = document.getElementById("drawing_canvas");
    context = canvas.getContext("2d");
    context.translate(middle.x, middle.y);
    fillStonesArray(xRange, yRange, sizeRange, velocityRange);
    window.requestAnimationFrame(draw);
}

function setCanvasSize() {
    var canvas = document.getElementById("drawing_canvas");
    var div = document.getElementById("canvas_div");
    canvas.style.width = window.innerWidth + "px";
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

function updatePositions() {
    //update Player
    var rotation = newPlayerRotation();
    currentRotation += rotation;
    tip = rotate(tipOrigin, currentRotation);
    lC = rotate(lCOrigin, currentRotation);
    rC = rotate(rCOrigin, currentRotation);
    //update Stones
    for (let i = 0; i < stones.length; i++) {
        var mult = scalarMult(stones[i].direction, stones[i].velocity);
        stones[i].position = add(stones[i].position, mult);
    }
    //update Bullets
    for (let i = 0; i < bullets.length; i++) {
        var mult = scalarMult(bullets[i].direction, bulletVelocity);
        bullets[i].position = add(bullets[i].position, mult);
    }
    wallCollisionDetection();
}

function newPlayerRotation(){
    if(alpha >= 0 && alpha < 180){
        return ((alpha/360)*(2*Math.PI)/4);
    }else{
        return -((alpha/360)*(2*Math.PI)/4);
    }
}

function drawStone(context, stone) {
    context.beginPath();
    context.arc(stone.position.x, stone.position.y, stone.radius, 0, Math.PI * 2, true);
    context.stroke()
    context.closePath();
}

function drawStones(context) {
    for (let i = 0; i < stones.length; i++) {
        const element = stones[i];
        drawStone(context, element);
    }
}

function draw() {
    var height = window.innerHeight;
    var width = window.innerWidth;
    currentFrame++;
    context.clearRect(-500, -500, 1000, 1000)
    updatePositions();
    if((currentFrame % framesPerBullet) == 0) {
        playerShoot(tip, lC, rC);
    }
    drawPlayer(context);
    drawBullets(context);
    drawStones(context, stones);
    window.requestAnimationFrame(draw);
}