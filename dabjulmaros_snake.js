//Global Varibles

//Game settings
let settings = {
  speed: 1,
  wrap: false,
  highScore: "0",
  difficultyMulti: 1,
  playIntro: true,
};

//game state controls
let intro = false;
let menu = false;
let game = false;
let paused = false;
let gameOver = false;

//cursor variables
let blink = true;
let selectedOption = 0;

//time delta variables
let deltaVar = Date.now();

//Arrays of ascii art for menu and intro
//plus pacing ticker
let artTicks = 0;
let art = [
  ["           /^\\/^\\                                      "],
  ["         .!..!  O!                                     "],
  ["\\/     /*     \\./ \\                                    "],
  [" \\....!........../  \\                                  "],
  ["        \\.......      \\                                "],
  ["                `\\     \\                 \\             "],
  ["                  !     !                  \\           "],
  ["                 /      /                    \\         "],
  ["                /     /                       \\\\       "],
  ["              /      /                         \\ \\     "],
  ["             /     /                            \\  \\   "],
  ["           /     /             .----.            \\   \\ "],
  ["          /     /           .-*      *-.         !   ! "],
  ["         (      (        .-*    .--.    *-.     ./   ! "],
  ["          \\      *-....-*    .-*    *-.    *-.-*    /  "],
  ["            *-.           .-*          *-.       .-*   "],
  ["               *--......-*                *-...-*      "],
];

let title = [
  "▟██▙ ▟  ▙  ▟▙  ▟ ▛  ▟██▙",
  "▜▙   █▙ █ ▟▛▜▙ █▙   █ ▟▛",
  "  ▜▙ █▜▙█ █▀▀█ █▜▙  █▛  ",
  "▜██▛ ▜ ▜▛ ▜  ▛ ▜ ▜▙ ▜██▛",
];

//Game objects
//varibles and others
let food = { x: 0, y: 0 };
let snake = {
  tail: [],
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  holdUpdate: false,
  updateBuffer: [],
};
let update = { x: 0, y: 0 };
let score = 0;
let difficulties = ["Easy", "Normal", "Hard", "Good Luck"];

/**
 * This function should return a string that will be used as the server's name.
 * It must be short enough to fit in the NETronics Connect! menu.
 **/
function getName() {
  return "Snake";
}

/**
 * This function will be called when a user connects to the server.
 **/
function onConnect() {
  //Load Game Data
  let data = loadData();

  //If data excists overwrite global settings with saved data
  if (data != "") settings = JSON.parse(data);

  //Set to play intro or not
  if (settings.playIntro) intro = true;
  else menu = true;
}

/**
 * This function will be called approximately 30 times a
 * second while a user is connected to the server.
 **/
function onUpdate() {
  //Game Flow Logic

  if (intro) {
    //If Art is all shown
    //Wait 750 millis to go to menu
    if (artTicks > art.length) {
      if (dTime(750)) {
        intro = false;
        menu = true;
        return;
      }
      return;
    }
    //Uses dTime and art ticker to show a new section of the intro
    //ascii intro
    if (dTime(200)) {
      for (let x = 0; x < artTicks; x++) {
        drawText(String(art[x]), 17, 0, 18 - artTicks + x);
      }
      artTicks += 1;
      return;
    }
    return;
  }

  //Displays the menu state of the game
  if (menu) {
    clearScreen();

    //border box around the window
    drawBox(7, 0, 0, 55, 20);
    //border around the title
    drawBox(10, 13, 1, 28, 8);
    //Simple loop to draw the stylized logo
    for (let x = 0; x < title.length; x++) {
      drawText(String(title[x]), 17, 15, 3 + x);
    }
    //Gets saved highscore to display in title
    //processScore is used to pad or limit the value to 12 chars
    let highS = settings.highScore;
    if (parseInt(highS) == 0) {
      highS = " No Score Yet";
    } else {
      highS = processScore(highS);
    }

    drawText("HighScore:  ", 15, 16, 9);
    drawText(highS, 17, 26, 9);

    //Draws all menu items
    drawText("New Game", 15, 22, 11);
    drawText("---Options---", 7, 20, 13);
    drawText(
      "Borders: " + String(settings.wrap ? "False" : "True"),
      15,
      20,
      14
    );
    drawText(
      "Difficulty: " + difficulties[settings.difficultyMulti],
      15,
      18,
      15
    );
    drawText(
      "Play Intro: " + String(settings.playIntro ? "True" : "False"),
      15,
      19,
      16
    );

    //Changes the cursor color every 500 millis
    if (dTime(500)) {
      blink = !blink;
    }
    let cursorColor = 5;
    if (blink) {
      cursorColor = 17;
    }

    //Sets the cursor position on the selected option
    switch (selectedOption) {
      case 0:
        drawText(">", cursorColor, 20, 11);
        break;
      case 1:
        drawText(">", cursorColor, 18, 14);
        break;
      case 2:
        drawText(">", cursorColor, 16, 15);
        break;
      case 3:
        drawText(">", cursorColor, 17, 16);
        break;
    }

    //Some help text at the bottom of the screen
    drawText("WASD or Arrow Keys to Move, Space or Enter to Select", 6, 1, 18);

    return;
  }

  //game loop
  if (game) {
    //Draw Game over screen
    if (gameOver) {
      //draws and fills the "Pop up" box
      fillArea("█", 17, 1, 1, 38, 18);
      fillArea("█", 0, 4, 4, 32, 12);
      drawBox(10, 4, 4, 32, 12);

      //Display the score
      drawText("Game OVER!", 16, 14, 5);
      drawText("Final Score!", 10, 13, 7);
      drawText(processScore(score), 10, 13, 8);
      if (score > parseInt(settings.highScore)) {
        settings.highScore = score.toString();
        saveData(JSON.stringify(settings));
      }
      //Draws some controls
      drawText("Press 'Select' to Restart", 8, 7, 12);
      drawText("Press 'ESC' to Quit", 8, 7, 13);
      return;
    }
    // Draw paused box
    if (paused) {
      // draws box and fills area with 'empty' chars
      fillArea("█", 0, 4, 4, 32, 12);
      drawBox(10, 4, 4, 32, 12);

      //Display the paused State
      //and some options
      drawText("Game Paused!", 16, 14, 8);
      drawText("Press 'Select' to continue", 8, 7, 12);
      drawText("Press 'ESC' to Quit", 8, 7, 13);
      return;
    }
    //Normal Game State
    clearScreen();
    //Draw dark or light border depending on the settings
    drawBox(settings.wrap ? 1 : 15, 0, 0, 40, 20);
    //Draw score on the side
    drawText("Score:", 10, 44, 3);
    drawText(processScore(score), 10, 41, 5);

    //Game loop
    //on every update show food and snake
    showFood();
    showSnake();
    // Move the snake only on a fixed interval
    // Updates to velocity are handle on input
    if (dTime(500 / (settings.difficultyMulti + 1))) {
      snakeMove();
    }
    if (checkDeath()) {
      gameOver = true;
    }
  }
}

/**
 * This function will be called every time the connected user presses a key.
 * @param {number} key the ASCII representation of the key pressed
 **/
function onInput(key) {
  //119 17 up
  //115 18 down
  //97  19 left
  //100 20 right
  //32  10 select
  //27     esc

  //Rather than using a swithc case I went with ifs
  //Ifs let me use multiple keys for the same actions
  //The generous uses of return forces flow control

  //Up   W or Up arrow
  //Goes up in the menu with wrapping
  //Goes up in the game
  if (key == 119 || key == 17) {
    //up
    if (menu) {
      selectedOption -= 1;
      if (selectedOption < 0) {
        selectedOption = 3;
      }
      return;
    }
    if (game) {
      snakeUpdateVelocity(0, -1);
      return;
    }
    return;
  }
  //Down S or Down Arrow
  //Goes Down in the menu with wrapping
  //Goes Down in the game
  if (key == 115 || key == 18) {
    //down
    if (menu) {
      selectedOption += 1;
      if (selectedOption > 3) {
        selectedOption = 0;
      }
      return;
    }
    if (game) {
      snakeUpdateVelocity(0, 1);
      return;
    }
    return;
  }
  //Left A or Left Arrow
  //Goes Left in the menu options with wrapping
  //Goes Left in the game
  if (key == 97 || key == 19) {
    //left
    if (menu) {
      switch (selectedOption) {
        case 1:
          settings.wrap = !settings.wrap;
          break;
        case 2:
          settings.difficultyMulti = settings.difficultyMulti - 1;
          if (settings.difficultyMulti < 0) settings.difficultyMulti = 3;
          break;
        case 3:
          settings.playIntro = !settings.playIntro;
          break;
      }
      saveData(JSON.stringify(settings));
      return;
    }
    if (game) {
      snakeUpdateVelocity(-1, 0);
      return;
    }
    return;
  }

  //Right D or Right Arrow
  //Goes Right in the menu options with wrapping
  //Goes Right in the game
  if (key == 100 || key == 20) {
    //right
    if (menu) {
      switch (selectedOption) {
        case 1:
          settings.wrap = !settings.wrap;
          break;
        case 2:
          settings.difficultyMulti = settings.difficultyMulti + 1;
          if (settings.difficultyMulti > 3) settings.difficultyMulti = 0;
          break;
        case 3:
          settings.playIntro = !settings.playIntro;
          break;
      }
      saveData(JSON.stringify(settings));
      return;
    }
    if (game) {
      snakeUpdateVelocity(1, 0);
      return;
    }
    return;
  }

  //Select Space or Enter
  // On menu starts new game 
  //or moves forward the selected option with wrapping
  //On game and paused resume game
  //On game and game over start new game
  if (key == 32 || key == 10) {
    //select
    if (menu) {
      switch (selectedOption) {
        case 0:
          startGame();
          break;
        case 1:
          settings.wrap = !settings.wrap;
          break;
        case 2:
          settings.difficultyMulti = settings.difficultyMulti + 1;
          if (settings.difficultyMulti > 3) settings.difficultyMulti = 0;
          break;
        case 3:
          settings.playIntro = !settings.playIntro;
          break;
      }
      saveData(JSON.stringify(settings));
      return;
    }
    if (game)
      if (paused) {
        paused = false;
        return;
      }

    if (game)
      if (gameOver) {
        startGame();
        return;
      }
    return;
  }

  //Esc key
  //On intro skip intro
  //In game pause game
  //In game and paused quit game
  //In game and game over quit game
  if (key == 27) {
    //esc
    if (game) {
      if (gameOver) {
        menu = true;
        game = false;
        gameOver = false;
        return;
      }

      if (paused) {
        menu = true;
        game = false;
        return;
      }
      paused = true;
      return;
    }
    if (intro) {
      menu = true;
      intro = false;
      return;
    }
    return;
  }
}

//Basic Function to control game flow based on time
//Not the best given that the game may refresh at different intervals
//But also better than depending on the game calling the update fuction
function dTime(time) {
  let d = Date.now();
  let delta = d - deltaVar;
  if (delta > time) {
    deltaVar = d;
    return true;
  }
  return false;
}

//Takes a score string and limits or pads it to 12 characters
function processScore(score) {
  let temp = score;
  if (temp.length > 12) {
    temp = (parseInt(temp) / 1000000000).toFixed(2);
    temp = ("0000000000000" + temp).substr(-11);
    temp = temp + "B";
  } else {
    temp = ("0000000000000" + temp).substr(-12);
  }
  return temp;
}


//Game functions
//To start a game resets variables and sets the game state
function startGame() {
  menu = false;
  game = true;
  paused = false;
  gameOver = false;
  score = 0;
  snake = {
    tail: [],
    x: 20,
    y: 10,
    vx: 1,
    vy: 0,
    holdUpdate: false,
    updateBuffer: [],
  };
  newFood();
}

//Sets the food position to a new location that is not on the snake body
function newFood() {
  let x = Math.floor(Math.random() * 18) + 1;
  let y = Math.floor(Math.random() * 18) + 1;
  if (isOnSnake(x, y)) {
    newFood();
  } else {
    food = { x: x, y: y };
  }
}

//Helper function for food,
//Is only used once so it could be implemented inside newFood 
//but this is more redable
function isOnSnake(x, y) {
  if (snake.x == x && snake.y == y) {
    return true;
  }
  for (let pos in snake.tail) {
    if (snake.tail[pos].x == food.x && snake.tail[pos].y == food.y) {
      return true;
    }
  }
  return false;
}

//Simple function to show the food in the board
function showFood() {
  drawText("♥", 17, food.x, food.y);
}

//Cheacks if the the food is on the position passed
function eatFood( x, y) {
  if (food.x == x && food.y == y) {
    return true;
  } else {
    return false;
  }
}

//Draws the snake on the board and its tail sections on a darker color
function showSnake() {
  drawText("♦", 17, snake.x, snake.y);
  for (let i in snake.tail) {
    // the tail color could be set to 
    // (parseInt(i)%2==0)?10:7
    // but after some testing it gets really taxing on the eyes
    drawText("♦", 10, snake.tail[i].x, snake.tail[i].y);
  }
}


//Adds segments to the tail
function snakeGrow() {
  if (snake.tail.length > 0) {
    snake.tail.push({
      x: snake.tail[snake.tail.length - 1].x,
      y: snake.tail[snake.tail.length - 1].y,
    });
  } else {
    snake.tail.push({
      x: snake.x - snake.vx,
      y: snake.y - snake.vy,
    });
  }
}

//changes the snake direction
//plus some logic to queue snake updates
function snakeUpdateVelocity(x, y) {
  if (snake.vx == 0 && snake.vy == 0) {
    snake.vx = x;
    snake.vy = y;
  }
  if (x != -snake.vx && y != -snake.vy && !snake.holdUpdate) {
    snake.vx = x;
    snake.vy = y;
    snake.holdUpdate = true;
  }
  if (snake.holdUpdate) {
    if (x != -snake.vx && y != -snake.vy) {
      snake.updateBuffer = [x, y];
    }
  }
}

//Updates the sanke position
function snakeMove() {
  snake.holdUpdate = false;
  let lastPosition = [snake.x, snake.y];
  snake.x = snake.x + snake.vx;
  snake.y = snake.y + snake.vy;

  for (let tailPos in snake.tail) {
    //is this retarded or am i afraid of copy/reference issues? yes
    let temp = [snake.tail[tailPos].x, snake.tail[tailPos].y];
    snake.tail[tailPos].x = lastPosition[0];
    snake.tail[tailPos].y = lastPosition[1];
    lastPosition = [temp[0], temp[1]];
  }
  //If there are updates queued set the value to the updated velocity
  //for the next move update
  if (snake.updateBuffer.length) {
    snake.vx = snake.updateBuffer[0];
    snake.vy = snake.updateBuffer[1];
    snake.updateBuffer = [];
  }
  if (eatFood(snake.x, snake.y)) {
    score +=
      (snake.tail.length + 1) *
      (settings.difficultyMulti + 1) *
      (settings.wrap ? 1 : 3);
    newFood();
    snakeGrow();
  }
}

//Checks if the head position is inside the game area
//or inside the snake body
function checkDeath() {
  //If the position of the head is against a border trigger game over
  // or if warping is enabled / no borders, 
  // move the snake to the oposite border
  if (snake.x < 1 || snake.x > 38 || snake.y < 1 || snake.y > 18) {
    if (!settings.wrap) {
      return true;
    } else {
      if (snake.x < 1) {
        snake.x = 38;
      } else if (snake.x > 38) {
        snake.x = 1;
      }
      if (snake.y < 1) {
        snake.y = 18;
      } else if (snake.y > 18) {
        snake.y = 1;
      }
    }
  }
  //if the head position intersects a tail piece trigger game over
  if (snake.tail.length > 1) {
    for (let ele in snake.tail) {
      if (snake.x == snake.tail[ele].x && snake.y == snake.tail[ele].y) {
        return true;
      }
    }
  }
  return false;
}
