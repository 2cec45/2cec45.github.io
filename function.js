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
// globals
var currentFrame = 0;
var alpha = 0;
var gyroAccessible = true;;
var playerCollisionDetected = false;
var turningDirection = 0;
var turningDirections = [0.05, -0.05];
// GameParameters   
const stoneAmount = 3;
const framesPerBullet = 5;
const stones = new Array(stoneAmount);
const middle = new Vector(innerWidth/2, innerHeight/2);
var context;
var score = 0;
// PlayerParameters
var currentRotation = 0;
var turning = false;
const tipOrigin = new Vector(0, 20);
const lCOrigin = new Vector(10, -20);
const rCOrigin = new Vector(-10, -20);
var tip = new Vector(0, 20);
var lC = new Vector(10, -20);
var rC = new Vector(-10, -20);
// StoneParameters:
const xRange = new Vector(-innerWidth/2, innerWidth/2);
const yRange = new Vector(-innerHeight/2, innerHeight/2);
const sizeRange = new Vector(17, 45);
const velocityRange = new Vector(2, 5);
// BulletParameters
const bulletVelocity = 6;
const bulletSize = new Vector(7, 2);
var bullets = new Array(0);

function askPermission(){
    if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function"
      ) {
        DeviceMotionEvent.requestPermission();
      }
}

window.addEventListener('deviceorientation', onRotation, false);

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

function normalize(vec) {
    var length = Math.sqrt((Math.pow(vec.x, 2) + Math.pow(vec.y, 2)));
    return new Vector(vec.x / length, vec.y / length);
}

function rotate(vec, deg) {
    var result = new Vector(0, 0);
    result.x = vec.x * Math.cos(deg) + vec.y * (- Math.sin(deg));
    result.y = vec.x * Math.sin(deg) + vec.y * Math.cos(deg);
    return result;
}

function toRadians(deg) {
    return deg / 360 * Math.PI * 2;
}

function dotProduct(vec1, vec2) {
    v1 = normalize(vec1);
    v2 = normalize(vec2);
    return v1.x * v2.x + v1.y + v2.y;
}

function onRotation(event) {
    if (event.alpha != null) {
        alpha = event.alpha;
    }
}

function playerShoot(tip, lC, rC) {
    bullets.push(new Bullet(tip, bulletVelocity, normalize(tip)));
    cleanupBullets();
}
function cleanupBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        if ((xRange.x > b.position.x || b.position.x > xRange.y) || (yRange.x > b.position.y || b.position.y > yRange.y)) {
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

function destroyStone(stone) {
    var tmp = createRandomStone(xRange, yRange, sizeRange, velocityRange);
    stone.position = tmp.position;
    stone.direction = tmp.direction;
    stone.velocity = tmp.velocity;
    stone.radius = tmp.radius;
}

function destroyBullet(index) {
    bullets.splice(index, 1);
}

function bulletCollision() {
    for (let i = 0; i < bullets.length; i++) {
        var cB = bullets[i];
        for (let j = 0; j < stones.length; j++) {
            var cS = stones[j];
            // construct rectangle in the circle((x+r, 0), (x-r,0), (0,y+r)(0,y-r));
            const endPoint = add(cB.position, scalarMult(cB.direction, cB.velocity));
            const xValues = new Vector(cS.position.x - cS.radius, cS.position.x + cS.radius);
            const yValues = new Vector(cS.position.y - cS.radius, cS.position.y + cS.radius);
            if ((xValues.x < endPoint.x && endPoint.x < xValues.y) &&
                (yValues.x < endPoint.y && endPoint.y < yValues.y)) {
                destroyStone(cS);
                destroyBullet(i);
                increaseScore();
            }
        }
    }
}

function randomStonePosition() {
    var number = Math.trunc(Math.random() * 4);
    switch (number) {
        case 1:
            return new Vector(xRange.y, Math.random() * (yRange.y - yRange.x) + yRange.x);
        case 2:
            return new Vector(xRange.x, Math.random() * (yRange.y - yRange.x) + yRange.x);
        case 3:
            return new Vector(Math.random() * (yRange.y - yRange.x) + yRange.x, yRange.x);
        default:
            return new Vector(Math.random() * (yRange.y - yRange.x) + yRange.x, yRange.y);
    }
}

function wallCollisionDetection() {

    for (let i = 0; i < stones.length; i++) {
        if ((stones[i].position.x > xRange.y + 50) || (stones[i].position.x < xRange.x - 50) ||
            (stones[i].position.y < yRange.x - 50) || (stones[i].position.y > yRange.y + 50)) {
            stones[i] = createRandomStone(xRange, yRange, sizeRange, velocityRange);
        }
    }
}

function increaseScore() {
    score++;
}

function displayScore() {
    context.font = "30px Arial";
    context.fillText("score:" + score, xRange.x + 50, yRange.x + 50);
}

function playerCollision() {
    for (let i = 0; i < stones.length; i++) {
        var stone = stones[i];
        var edgePoint = add(stone.position, scalarMult(stone.direction, stone.radius));
        var deg = dotProduct(new Vector(0, 1), stone.direction);
        edgePoint = rotate(edgePoint, deg);
        if ((rCOrigin.x < edgePoint.x && edgePoint.x < lCOrigin.x * 2) &&
            (rCOrigin.y < edgePoint.y && edgePoint.y < Math.abs(tipOrigin.y) + Math.abs(lCOrigin.y))) {
            //destroy Player();
            destroyStone(stone);
            playerCollisionDetected = true;
        }
    }
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

function buttonTurnLeft(){
    turning = true;
    turningDirection = 1; 
}

function stopTurning() {
    turning = false;
}

function buttonTurnRight(){
    turning = true;
    turningDirection = 0; 
}

function init() {
    const canvas = document.getElementById("drawing_canvas");
    const button_left = document.getElementById("button_left");
    const button_right = document.getElementById("button_right");
    setCanvasSize() 
    context = canvas.getContext("2d");
    context.translate(middle.x, middle.y);

    button_left.addEventListener("pointerdown", buttonTurnLeft);
    button_left.addEventListener("mouseup", stopTurning);
    button_right.addEventListener("pointerdown", buttonTurnRight);
    button_right.addEventListener("mouseup", stopTurning); 

    const nextRoundButton = document.createElement("button");
    nextRoundButton.textContent = "Next round!";
    nextRoundButton.id = "nextRoundButton";
    document.body.appendChild(nextRoundButton);
    nextRoundButton.position = "fixed";
    nextRoundButton.style.width = 250 + "px";
    nextRoundButton.style.bottom = 30 + "px";
    nextRoundButton.style.left = (xRange.y - 125) + "px";
    nextRoundButton.addEventListener("click", resetRound);
}



function setCanvasSize() {
    var canvas = document.getElementById("drawing_canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawPlayer(context) {
    context.beginPath();
    context.moveTo(tip.x, tip.y);
    context.lineTo(lC.x, lC.y);
    context.lineTo(rC.x, rC.y);
    context.lineTo(tip.x, tip.y);
    context.stroke();
    context.closePath();
}

function updatePositions() {
    //update Player
    var rotation = newPlayerRotation();
    tip = rotate(tipOrigin, rotation);
    lC = rotate(lCOrigin, rotation);
    rC = rotate(rCOrigin, rotation);
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
    //check collisions
    wallCollisionDetection();
    bulletCollision();
    playerCollision();
}

function newPlayerRotation() {
    if (gyroAccessible) {
        return toRadians(alpha * 4);
    } else {
        if(turning){
            currentRotation += turningDirections[turningDirection];
        }
        return currentRotation;
    }
}

function drawStone(context, stone) {
    context.beginPath();
    context.arc(stone.position.x, stone.position.y, stone.radius, 0, Math.PI * 2, true);
    context.stroke();
    context.closePath();
}

function drawStones(context) {
    for (let i = 0; i < stones.length; i++) {
        const element = stones[i];
        drawStone(context, element);
    }
}

function resetRound() {
    askPermission();
    score = 0;
    for (let i = 0; i < stones.length; i++) {
        stones[i] = createRandomStone(xRange, yRange, sizeRange, velocityRange);
    }
    bullets = new Array(0);
    currentRotation = 0;
    playerCollisionDetected = false;
    document.getElementById("nextRoundButton").remove();
    window.requestAnimationFrame(draw);
}

function showEndScreen() {
    const nextRoundButton = document.createElement("button");
    nextRoundButton.textContent = "Next round!";
    nextRoundButton.id = "nextRoundButton";
    document.body.appendChild(nextRoundButton);
    nextRoundButton.position = "fixed";
    nextRoundButton.style.width = 250 + "px";
    nextRoundButton.style.bottom = 30 + "px";
    nextRoundButton.style.left = (xRange.y - 125) + "px";
    nextRoundButton.addEventListener("click", resetRound);
}

function draw() {
    currentFrame++;
    context.clearRect(xRange.x, yRange.x, -xRange.x * 2, -yRange.x * 2)
    updatePositions();
    if (playerCollisionDetected) {
        showEndScreen();
    } else {
        if ((currentFrame % framesPerBullet) == 0) {
            playerShoot(tip, lC, rC);
        }
        drawPlayer(context);
        drawBullets(context);
        drawStones(context, stones);
        displayScore();
        window.requestAnimationFrame(draw);
    }
}