var context, controller1, player1, player2, loop, canvas, enemy;

var startAnimation = 100;
var playerWon = false;
// Load player images
var imgArr1 = ["Media/player1.png", "Media/player2.png"];
var imgArr2 = ["Media/player2-right.png", "Media/player2-left.png"];

// Object for player
player1 = {
    height: 150,
    width: 150,
    jumping: true,
    x: 100,
    x_velocity: 0,
    y: 0,
    y_velocity: 0,
    lookingSide: 'right',
    lookingDown: false,
    isPunching: false,
    punchAnimationStart: 0,
    punchAnimationMax: 10,
    life: 5,
    lastSide: null
};
var player_img1 = new Image();
player_img1.src = imgArr1[0];

// Object for controller
controller1 = {
    left: false,
    right: false,
    up: false,
    down: false,
    punch: false,
    canPunch: true,
    keyListener: function (event) {
        var key_state = (event.type == "keydown") ? true : false;

        switch (event.keyCode) {
            case 65:// a
                controller1.left = key_state;
                break;
            case 87:// w
                controller1.up = key_state;
                break;
            case 68:// d
                controller1.right = key_state;
                break;
            case 83:// s
                controller1.down = key_state;
                break;
            case 72:// z - punch
                controller1.punch = key_state;
                break;
        }
    }
}

// Object for player
player2 = {
    height: 150,
    width: 150,
    jumping: true,
    x: window.innerWidth - 150 - 100,
    x_velocity: 0,
    y: 0,
    y_velocity: 0,
    lookingSide: 'left',
    lookingDown: false,
    isPunching: false,
    punchAnimationStart: 0,
    punchAnimationMax: 10,
    life: 5,
    lastSide: null
};
var player_img2 = new Image();
player_img2.src = imgArr2[1];

// Object for controller
controller2 = {
    left: false,
    right: false,
    up: false,
    down: false,
    punch: false,
    canPunch: true,
    keyListener: function (event) {
        var key_state = (event.type == "keydown") ? true : false;

        switch (event.keyCode) {
            case 100:// Numpad4 key
                controller2.left = key_state;
                break;
            case 104:// Numpad8 key
                controller2.up = key_state;
                break;
            case 102:// Numpad6 key
                controller2.right = key_state;
                break;
            case 101:// Numpad5 key
                controller2.down = key_state;
                break;
            case 222:// ' - punch
                controller2.punch = key_state;
                break;
        }
    }
}

// Object for punch
punch = {
    height: 50,
    width: 80
};
kick = {
    height: 80
}
// Punch images
var punch_img_right = new Image();
var punch_img_left = new Image();
var punch_img_down = new Image();
punch_img_right.src = "Media/punch_right.png";
punch_img_left.src = "Media/punch_left.png";
punch_img_down.src = "Media/punch_down.png";

// Health image
var health = new Image();
health.src = "Media/health.png";

var audio = new Audio('Media/fight_sound.mp3');
var audio2 = new Audio('Media/ko_sound.mp3');

window.addEventListener("load", function () {
    // Adding background
    document.body.style.backgroundImage = "url('Media/bg" + sessionStorage.getItem("bg") + ".gif')";
    init();
})

function init() {

    /**@type {Element} */
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.height = 0.90 * window.innerHeight;
    canvas.width = window.innerWidth;

    window.requestAnimationFrame(loop);
}

var lastTime = 0;
var fps = 1000 / 144;

// Main loop of the game
function loop(currentTime) {

    if (currentTime - lastTime >= fps) {
        update();
        lastTime = currentTime;
    }
    render();

    // Call update when the brower is ready to draw again
    window.requestAnimationFrame(loop);
}

// Changes the movement of the players
function update() {
    checkMovement(1);
    checkMovement(2);
}

// Paints the changes on the canvas
function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();

    // Drawing players
    context.drawImage(player_img1, player1.x, player1.y, player1.width, player1.height);
    context.drawImage(player_img2, player2.x, player2.y, player2.width, player2.height);

    // Punching player1
    if (controller1.punch && controller1.canPunch) {
        controller1.isPunching = true;
    }

    // Cheking if player1 is now punching
    if (controller1.isPunching) {
        punchAnimation(1);
    }

    // Punching player2
    if (controller2.punch && controller2.canPunch) {
        controller2.isPunching = true;
    }

    // Cheking if player2 is now punching
    if (controller2.isPunching) {
        punchAnimation(2);
    }

    // Drawing life
    for (var index = 0; index < player1.life; index++) {
        context.drawImage(health, 20 + 80 * index, 30, 50, 50);
    }

    for (var index2 = player2.life; index2 > 0; index2--) {
        context.drawImage(health, window.innerWidth - 20 - 80 * index2, 30, 50, 50);
    }

    if (startAnimation < 60) {
        if (startAnimation === 1) {
            audio.currentTime = 6.2;
            audio.volume = 0.2;
            audio.play();
            setTimeout(function () {
                audio.muted = true;
                audio.pause();
            }, 1700);
        }
        // Add Fight
        var fight = new Image();
        fight.src = "Media/fight.png";
        context.drawImage(fight, window.innerWidth / 2 - 450, 150, 900, 400);
        startAnimation++;
        // Add Sound
    }

    if (playerWon) {
        var KO = new Image();
        KO.src = "Media/ko.png";
        context.drawImage(KO, window.innerWidth / 2 - 450, 100, 900, 500);
        fps = 1000 / 10;
        enemy.x_velocity = -1;
    }
}

// Checks for player movement(called in update)
function checkMovement(player_num) {
    var controller = eval("controller" + player_num);
    var player = eval("player" + player_num);
    var player_img = eval("player_img" + player_num);
    var imgArr = eval("imgArr" + player_num);
    // If up is pressed and player is not currently in the air
    if (controller.up && player.jumping == false) {
        player.y_velocity -= 45;
        player.jumping = true;
    }

    // Moving left
    if (controller.left) {
        player.x_velocity -= 1;

        if (!controller.isPunching) {
            player_img.src = imgArr[1];
            player.lookingSide = "left";
        }
    }

    // Moving right
    if (controller.right) {
        player.x_velocity += 1;

        if (!controller.isPunching) {
            player_img.src = imgArr[0];
            player.lookingSide = "right";
        }
    }

    // looking down
    if (controller.down) {
        player.lookingDown = true;
    }
    else {
        player.lookingDown = false;
    }

    player.y_velocity += 1.5;   // Gravity
    player.x += player.x_velocity;  // Moving the player
    player.y += player.y_velocity;  // Moving the player
    player.x_velocity *= 0.9;   // Friction
    player.y_velocity *= 0.9;   // Friction

    // If player is falling below map
    if (player.y > canvas.height - player.height) {
        player.jumping = false;
        player.y = canvas.height - player.height;
        player.y_velocity = 0;

        // Ducks got to the ground for the first time
        if (startAnimation === 100) {
            startAnimation = 0;
            // Adding listeners for buttons 
            //Player1
            window.addEventListener("keydown", controller1.keyListener);
            window.addEventListener("keyup", controller1.keyListener);

            // Player2
            window.addEventListener("keydown", controller2.keyListener);
            window.addEventListener("keyup", controller2.keyListener);

        }
    }

    // Allows player to move throught the walls of the screen
    if (player.x < -player.width) {
        player.x = canvas.width;
    }
    else if (player.x > canvas.width) {
        player.x = -player.width;
    }
}

// Paints the punch animation(called in render)
function punchAnimation(player_num) {
    var controller = eval("controller" + player_num);
    var player = eval("player" + player_num);
    if (player.punchAnimationStart <= player.punchAnimationMax) {

        if (player.lastSide === null) {
            player.lastSide = player.lookingSide;
            if (player.lookingDown) {
                player.lastSide = "down";
            }
        }

        // Adding direction to the punch
        if (player.lastSide === "down" && player.jumping) {
            context.drawImage(punch_img_down, (player.x + (player.width / 2) - punch.width / 2), (player.y + player.height), punch.width, kick.height);
        }
        else if (player.lastSide === "right") {
            context.drawImage(punch_img_right, (player.x + player.width), (player.y + player.height / 2), punch.width, punch.height);
        }
        else if (player.lastSide === "left") {
            context.drawImage(punch_img_left, player.x - punch.width, (player.y + player.height / 2), punch.width, punch.height);
        }


        // Starting the punch animation
        if (player.punchAnimationStart === 1) {
            // Add collision detection here
            checkCollision(player_num);
            controller.canPunch = false;
        }

        // Ending the punch animation
        if (player.punchAnimationStart === player.punchAnimationMax) {
            player.punchAnimationStart = 0;
            controller.isPunching = false;
            player.lastSide = null;
            setTimeout(function () {
                controller.canPunch = true;
            }, 700);
        }
        player.punchAnimationStart++;
    }
}

// Checks collision for players attacks
function checkCollision(player_num) {
    var enemy_num;
    if (player_num === 1) {
        enemy_num = 2;
    }
    else {
        enemy_num = 1;
    }
    var player = eval("player" + player_num);
    enemy = eval("player" + enemy_num);

    var checkX;
    var checkY = (player.y + (player.height / 2) > enemy.y && player.y + (player.height / 2) < enemy.y + enemy.height) || ((player.y + (player.height / 2) + punch.height > enemy.y) && (player.y + (player.height / 2) + punch.height < enemy.y + enemy.height));

    if (player.lookingDown) {
        checkY = (player.y + player.height + kick.height < enemy.y && player.y + player.height + kick.height < enemy.y + enemy.height) || ((player.y + player.height + kick.height > enemy.y) && (player.y + player.height < enemy.y + enemy.height));
        checkX = (((player.x + player.width / 2 - punch.width / 2) > enemy.x ) && ((player.x + player.width / 2 - punch.width / 2) < enemy.x + player.width)) || (((player.x + player.width / 2 + punch.width / 2) < enemy.x + enemy.width) && (player.x + player.width / 2 + punch.width / 2 > enemy.x));
    }
    else if (player.lookingSide === "right") {
        checkX = (((player.x + player.width + punch.width) < enemy.x + enemy.width) && ((player.x + player.width + punch.width) > enemy.x)) || (((player.x + player.width) < enemy.x + enemy.width) && (player.x + player.width > enemy.x));
    }
    else {
        checkX = (((player.x - punch.width) < enemy.x + enemy.width) && ((player.x - punch.width) > enemy.x)) || ((player.x < enemy.x + enemy.width) && (player.x > enemy.x));
    }

    // If player punch hit
    if (checkX && checkY) {
        enemy.life--;
        if(player.lookingSide === "right" && player.lookingDown === false) {
            enemy.x_velocity += 25;
        }
        else if(player.lookingSide === "left" && player.lookingDown === false) {
            enemy.x_velocity -= 25;
        }

        if (enemy.life <= 0) {
            // Add KO sound
            audio2.currentTime = 0.5;
            audio2.volume = 0.1;
            audio2.play();
            // removing listeners from buttons 
            //Player1
            window.removeEventListener("keydown", controller1.keyListener);
            window.removeEventListener("keyup", controller1.keyListener);

            // Player2
            window.removeEventListener("keydown", controller2.keyListener);
            window.removeEventListener("keyup", controller2.keyListener);

            playerWon = true;
            controller1.isPunching = false;
            controller2.isPunching = false;
            sessionStorage.setItem("player_won", player_num);
            setTimeout(function () {
                window.location.href = "end_page.html";
            }, 2000);
        }
    }
}