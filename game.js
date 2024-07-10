const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// Create the paddle
const paddleWidth = 10, paddleHeight = 100, paddleSpeed = 8;
const user = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: "#00f", score: 0 };
const com = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: "#f00", score: 0 };

// Create the ball
const ballRadius = 10;
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: ballRadius, speed: 5, velocityX: 5, velocityY: 5, color: "#0f0" };

// Draw rectangle function
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Draw circle function
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Draw text function
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "45px sans-serif";
    context.fillText(text, x, y);
}

// Render the game
function render() {
    // Clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    // Draw the paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // Draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // Draw the scores
    drawText(user.score, canvas.width / 4, canvas.height / 5, "#fff");
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5, "#fff");
}

// Control the user paddle
canvas.addEventListener("mousemove", movePaddle);
function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}

// Collision detection
function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// Reset the ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// Update the game
function update() {
    // Move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // AI paddle movement
    let comLevel = 0.1;
    com.y += (ball.y - (com.y + com.height / 2)) * comLevel;

    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Ball collision with paddles
    let player = (ball.x < canvas.width / 2) ? user : com;
    if (collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
    }

    // Update the score
    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }
}

// Game loop
function game() {
    update();
    render();
}

// Number of frames per second
const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);
