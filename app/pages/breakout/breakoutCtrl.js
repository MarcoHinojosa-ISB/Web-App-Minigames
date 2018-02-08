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
  const finalLevel = 3;

  let level, lives, paddle, mapData;
  let bricks = [], balls = [];
  let updater, screenTrans1, screenTrans2;

  // load images
  let powerUpImages = [];
  powerUpImages.push([new Image(), "assets/images/breakout/ballGrow.png"],
                    [new Image(), "assets/images/breakout/multiBall.png"],
                    [new Image(), "assets/images/breakout/oneUp.png"]);
  powerUpImages = powerUpImages.map(function(curr){
    curr[0].src = curr[1];
    return curr[0];
  })

  // Init
  $scope.init = function(){
    drawMessageScreen("Break Out");
  }

  $scope.startGame = function(){
    $("#bo-start").hide();
    $("#bo-restart").hide();

    // set initial game settings
    paddle = new BO_paddle.paddle({
      xPos: (gameWidth/2) - 40,
      speed: 3,
      gameWidth: gameWidth,
      gameHeight: gameHeight
    });
    balls[0] = new BO_ball.ball({
      xPos: gameWidth/2,
      yPos: gameHeight - 250,
      xSpd: 0,
      ySpd: 2,
      radius: 10
    })
    level = 1;
    lives = 3;
    mapData = new BO_mapData.mapData();

    // Create bricks;
    generateBricks();

    // Start game loop
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
        type: brickProp[2]
      }));
    });
  };

  // Collisions =================================
  function checkPaddleBallCollision(){
    balls.forEach(function(ball){
      // Get vertical/horizontal distance between the centers of paddle and ball
      let dx = Math.abs(ball.getXPos() - (paddle.getXPos() + (paddle.getWidth()/2)));
      let dy = Math.abs(ball.getYPos() - (paddle.getYPos() + (paddle.getHeight()/2)));

      // No collision if distance > 50% width/height of paddle + ball radius
      if(dx > (paddle.getWidth()/2) + ball.getRadius() || dy > (paddle.getHeight()/2) + ball.getRadius()){
        return;
      }

      // Collision if distance <= 50% width/height of paddle
      if(dx <= paddle.getWidth()/2 || dy <= paddle.getHeight()/2){
        let tmp = ball.getXPos() - (paddle.getXPos() + (paddle.getWidth()/2));
        ball.setXSpd((tmp * 3)/100);

        if(ball.getYSpd() > 0)
          ball.setYSpd(ball.getYSpd() * -1);
      }

      // Check corners of paddle for collision
      let dx2 = dx - paddle.getWidth()/2;
      let dy2 = dy - paddle.getHeight()/2;

      if((dx2*dx2) + (dy2*dy2) <= ball.getRadius()*ball.getRadius()){
        let tmp = ball.getXPos() - (paddle.getXPos() + (paddle.getWidth()/2));
        ball.setXSpd((tmp * 3)/100);

        if(ball.getYSpd() > 0)
          ball.setYSpd(ball.getYSpd() * -1);
      }
    })
  }

  function checkBrickBallCollision(){
    balls.forEach(function(ball){
      bricks = bricks.filter(function(brick){
        // Get vertical/horizontal distance between the centers of brick and ball
        let dx = Math.abs(ball.getXPos() - (brick.getXPos() + (brick.getWidth()/2)));
        let dy = Math.abs(ball.getYPos() - (brick.getYPos() + (brick.getHeight()/2)));

        // No collision if distance > 50% width/height of brick + ball radius
        if(dx > (brick.getWidth()/2) + ball.getRadius() || dy > (brick.getHeight()/2) + ball.getRadius()){
          return true;
        }

        // Collision if distance <= 50% width/height of brick
        if(dx <= brick.getWidth()/2 || dy <= brick.getHeight()/2){
          if(dx <= brick.getWidth()/2)
            ball.setYSpd(ball.getYSpd() * -1);
          if(dy <= brick.getHeight()/2)
            ball.setXSpd(ball.getXSpd() * -1);

          brick.damaged();
        }

        // Check corners of brick for collision
        let dx2 = dx - brick.getWidth()/2;
        let dy2 = dy - brick.getHeight()/2;

        if((dx2*dx2) + (dy2*dy2) <= ball.getRadius()*ball.getRadius()){
          ball.setYSpd(ball.getYSpd() * -1);
          ball.setXSpd(ball.getXSpd() * -1);

          brick.damaged();
        }

        if(brick.getHealth() > 0){
          return true;
        }
        else{
          if(brick.getType() === 2){
            ball.setRadius(15);
          }
          else if(brick.getType() === 3){
            balls.push(new BO_ball.ball({
              xPos: ball.getXPos(),
              yPos: ball.getYPos(),
              xSpd: 2,
              ySpd: -2,
              radius: 10
            }), new BO_ball.ball({
              xPos: ball.getXPos(),
              yPos: ball.getYPos(),
              xSpd: -2,
              ySpd: 1.5,
              radius: 10
            }), new BO_ball.ball({
              xPos: ball.getXPos(),
              yPos: ball.getYPos(),
              xSpd: -1.5,
              ySpd: 2,
              radius: 10
            }));
          }
          else if(brick.getType() === 4){
            lives++;
          }
          return false;
        }
      })
    })

    // if all bricks are destroyed, advance to next level
    if(bricks.length === 0){
      level++;
      clearInterval(updater);

      if(level > finalLevel){
        screenTrans1 = setTimeout(function(){
          drawMessageScreen("Game Cleared");
          $("#bo-restart").show();
        }, 500);
      }
      else{
        screenTrans1 = setTimeout(function(){
          drawMessageScreen("Next Level");

          screenTrans2 = setTimeout(function(){
            balls = [];

            paddle = new BO_paddle.paddle({
              xPos: (gameWidth/2) - 40,
              speed: 3,
              gameWidth: gameWidth,
              gameHeight: gameHeight
            });
            balls[0] = new BO_ball.ball({
              xPos: gameWidth/2,
              yPos: gameHeight - 250,
              xSpd: 0,
              ySpd: 2,
              radius: 10
            });

            generateBricks();

            updater = setInterval(updateGame, 10);
          }, 500)
        }, 500)
      }
    }
  }

  function checkBorderBallCollision(){
    balls = balls.filter(function(ball){
      if(ball.getXPos() - ball.getRadius() <= 0 || ball.getXPos() + ball.getRadius() >= gameWidth){
        ball.setXSpd(ball.getXSpd() * -1);
      }
      if(ball.getYPos() - ball.getRadius() <= 0){
        ball.setYSpd(ball.getYSpd() * -1);
      }
      if(ball.getYPos() - ball.getRadius() >= gameHeight){
        return false;
      }
      return true;
    })

    if(balls.length === 0){
      lives--;
      if(lives > 0){
        balls[0] = new BO_ball.ball({
          xPos: gameWidth/2,
          yPos: gameHeight - 250,
          xSpd: 0,
          ySpd: 2,
          radius: 10
        })
      }
      else{
        clearInterval(updater);
        screenTrans1 = setTimeout(function(){
          drawMessageScreen("Game Over");
          $("#bo-restart").show();
        }, 500);
      }
    }
  }
  // ============================================

  // Draw Methods================================
  //clear screen
  function clearScreen(){
    ctx_BG.clearRect(0,0,gameWidth,gameHeight);
    ctx_PL.clearRect(0,0,gameWidth,gameHeight);
    ctx_BR.clearRect(0,0,gameWidth,gameHeight);
    ctx_BLL.clearRect(0,0,gameWidth,gameHeight);
  }

  // Heading Message
  function drawMessageScreen(message){
    clearScreen();

    ctx_BG.beginPath();
    ctx_BG.font = "40px Comic Sans MS";
    ctx_BG.fillText(message, 300, 100);
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

  // Balls
  function drawBall(){
    balls.forEach(function(ball){
      ctx_BLL.beginPath();
      ctx_BLL.fillStyle = "white";
      ctx_BLL.strokeStyle = "black";
      ctx_BLL.arc(ball.getXPos(), ball.getYPos(), ball.getRadius(), 0, 2 * Math.PI);
      ctx_BLL.fill();
      ctx_BLL.stroke();
      ctx_BLL.closePath();
      ball.move();
    })
  }

  // Bricks
  function drawBricks(){
    bricks.forEach(function(brick){
      ctx_BR.beginPath();
      ctx_BR.fillStyle = "white";
      ctx_BR.strokeStyle = "black";
      ctx_BR.rect(brick.getXPos(), brick.getYPos(), brick.getWidth(), brick.getHeight());
      ctx_BR.fill();
      ctx_BR.stroke();
      if(brick.getType() === 2)
        ctx_BR.drawImage(powerUpImages[0], brick.getXPos() + 25, brick.getYPos(), 30, 30);
      else if(brick.getType() === 3)
        ctx_BR.drawImage(powerUpImages[1], brick.getXPos() + 25, brick.getYPos(), 30, 30);
      else if(brick.getType() === 4)
        ctx_BR.drawImage(powerUpImages[2], brick.getXPos() + 25, brick.getYPos(), 30, 30);
    })
  }

  function drawStatus(){
    ctx_BG.beginPath();
    ctx_BG.font = "20px sans-serif";
    ctx_BG.fillStyle = "black";
    ctx_BG.textAlign = "right";
    ctx_BG.fillText(lives + " Lives", gameWidth - 20, gameHeight - 20);
    ctx_BG.textAlign = "left";
    ctx_BG.fillText("Level "+level, 10, gameHeight - 20);
    ctx_BG.closePath();
  }

  // Update game
  function updateGame(){
    clearScreen();

    keyChecker();
    checkBorderBallCollision();
    checkPaddleBallCollision();
    checkBrickBallCollision();
    drawPaddle();
    drawBricks();
    drawBall();
    drawStatus();
  }

  $scope.$on('$locationChangeStart', function(event){
    clearTimeout(screenTrans1);
    clearTimeout(screenTrans2);
    clearInterval(updater);
    balls = [];
    bricks = [];
    paddle = null;
    mapData = null;
  })
})
