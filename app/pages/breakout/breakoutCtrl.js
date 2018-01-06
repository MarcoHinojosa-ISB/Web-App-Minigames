"use strict"

app.controller("breakoutCtrl", function($scope, BO_paddle){
  let c_BG = $("#bo-screen")[0];
  let c_PL = $("#bo-player")[0];
  let ctx_BG = c_BG.getContext("2d");
  let ctx_PL = c_PL.getContext("2d");

  const gameWidth = c_BG.getAttribute("width");
  const gameHeight = c_BG.getAttribute("height");

  let paddle;
  let updater;
  let timer = 10;

  // Init
  $scope.init = function(){
    drawTitleScreen();
  }

  $scope.startGame = function(){
    $("#bo-start").hide();

    paddle = new BO_paddle.paddle({
      position: 40,
      speed: 5,
      gameWidth: gameWidth,
      gameHeight: gameHeight
    });

    updater = setInterval(updateGame, timer)
  }

  // Keys/Controls
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

  function drawTitleScreen(){
    ctx_BG.clearRect(0, 0, gameWidth, gameHeight);

    //Title
    ctx_BG.beginPath();
    ctx_BG.font = "40px Comic Sans MS";
    ctx_BG.fillText("Break Out", 300, 100);
    ctx_BG.closePath();
  }

  function updateGame(){
    ctx_BG.clearRect(0,0,gameWidth,gameHeight);
    ctx_PL.clearRect(0,0,gameWidth,gameHeight);

    keyChecker();
    drawPaddle();
  }

  function drawPaddle(){
    ctx_PL.beginPath();
    ctx_PL.fillStyle = "white";
    ctx_PL.strokeStyle = "black";
    ctx_PL.rect(paddle.getXPos(), paddle.getYPos(), paddle.getWidth(), paddle.getHeight());
    ctx_PL.fill();
    ctx_PL.stroke();
    ctx_PL.closePath();
  }
})
