"use strict"

app.controller("breakoutCtrl", function($scope, BO_paddle, BO_brick, BO_ball, BO_mapData){
  let c_BG = $("#bo-screen")[0];
  let c_PL = $("#bo-player")[0];
  let c_BR = $("#bo-bricks")[0];
  let c_BLL = $("#bo-ball")[0];
  let ctx_BG = c_BG.getContext("2d");
  let ctx_PL = c_PL.getContext("2d");
  let ctx_BR = c_BR.getContext("2d");
  let ctx_BLL = c_BLL.getContext("2d");

  const gameWidth = c_BG.getAttribute("width");
  const gameHeight = c_BG.getAttribute("height");

  let level, paddle, ball, mapData;
  let bricks = [];
  let updater;


  // Init
  $scope.init = function(){
    drawTitleScreen();
  }

  $scope.startGame = function(){
    $("#bo-start").hide();

    // set initial game settings
    level = 1;

    paddle = new BO_paddle.paddle({
      xPos: (gameWidth/2) - 40,
      speed: 5,
      gameWidth: gameWidth,
      gameHeight: gameHeight
    });
    ball = new BO_ball.ball({
      xPos: gameWidth/2,
      yPos: gameHeight - 250,
      speed: 2,
      radius: 10
    })
    mapData = new BO_mapData.mapData();

    // create bricks;
    generateBricks();

    updater = setInterval(updateGame, 10);
  }

  // Keys/Controls ================================
  let keyState = {};
  $scope.keyDown = function(e){
    keyState[e.keyCode || e.which] = true;
  }
  $scope.keyUp = function(e){
    keyState[e.keyCode || e.which] = false;
  }
  function keyChecker(){
    // Right
    if(keyState[68]){
      paddle.move(68);
    }
    // Left
    if(keyState[65]){
      paddle.move(65);
    }
  }
  // ============================================

  function generateBricks(){
    mapData.getMap(level).forEach(function(brickProp){
      bricks.push(new BO_brick.brick({
        xPos: brickProp[0],
        yPos: brickProp[1],
        health: brickProp[2]
      }));
    });
  };

  // Collisions =================================
  function checkPaddleBallCollision(){
    let dx = Math.abs(ball.getXPos() - (paddle.getXPos() + (paddle.getWidth()/2)));
    let dy = Math.abs(ball.getYPos() - (paddle.getYPos() + (paddle.getHeight()/2)));

    if(dx > (paddle.getWidth()/2) + ball.getRadius() || dy > (paddle.getHeight()/2) + ball.getRadius()){
      return;
    }

    if(dx <= paddle.getWidth()/2 || dy <= paddle.getHeight()/2){
      let tmp = ball.getXPos() - (paddle.getXPos() + (paddle.getWidth()/2));
      ball.setYSpd(ball.getYSpd() * -1);
      ball.setXSpd((tmp * 2)/100);
    }
  }
  // ============================================

  // Title
  function drawTitleScreen(){
    ctx_BG.beginPath();
    ctx_BG.font = "40px Comic Sans MS";
    ctx_BG.fillText("Break Out", 300, 100);
    ctx_BG.closePath();
  }

  // Paddle
  function drawPaddle(){
    ctx_PL.beginPath();
    ctx_PL.fillStyle = "white";
    ctx_PL.strokeStyle = "black";
    ctx_PL.rect(paddle.getXPos(), paddle.getYPos(), paddle.getWidth(), paddle.getHeight());
    ctx_PL.fill();
    ctx_PL.stroke();
    ctx_PL.closePath();
  }

  // Ball
  function drawBall(){
    ctx_BLL.beginPath();
    ctx_BLL.fillStyle = "white";
    ctx_BLL.strokeStyle = "black";
    ctx_BLL.arc(ball.getXPos(), ball.getYPos(), ball.getRadius(), 0, 2 * Math.PI);
    ctx_BLL.fill();
    ctx_BLL.stroke();
    ctx_BLL.closePath();
    ball.move();
  }

  // Bricks
  function drawBricks(){
    ctx_BR.beginPath();

    bricks.forEach(function(brick){
      ctx_BR.fillStyle = "white";
      ctx_BR.strokeStyle = "black";
      ctx_BR.rect(brick.getXPos(), brick.getYPos(), brick.getWidth(), brick.getHeight());
      ctx_BR.fill();
      ctx_BR.stroke();
    })

    ctx_BR.closePath();
  }

  // Update game
  function updateGame(){
    ctx_BG.clearRect(0,0,gameWidth,gameHeight);
    ctx_PL.clearRect(0,0,gameWidth,gameHeight);
    ctx_BR.clearRect(0,0,gameWidth,gameHeight);
    ctx_BLL.clearRect(0,0,gameWidth,gameHeight);

    keyChecker();
    checkPaddleBallCollision();
    drawPaddle();
    drawBricks();
    drawBall();
  }
})
