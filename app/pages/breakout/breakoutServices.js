"use strict"

app.service("BO_bricks", function(){
  function brick(data){
    const width = 60;
    const height = 20;
    let hp = data.hp;
    let color = data.color;

    this.getWidth = function(){
      return width;
    }
    this.getHeight = function(){
      return height;
    }
    this.damaged = function(){
      hp -= 1;
    }
  }
  return {
    brick: brick
  };
})
.service("BO_paddle", function(){
  function paddle(data){
    let xPos = data.position;
    let yPos = data.gameHeight - 60;
    let spd = data.speed;
    let width = 100;
    const height = 20;
    const leftScreenBorder = 0;
    const rightScreenBorder = data.gameWidth;

    this.getWidth = function(){
      return width;
    }
    this.getHeight = function(){
      return height;
    }
    this.getXPos = function(){
      return xPos;
    }
    this.getYPos = function(){
      return yPos;
    }

    this.move = function(keyCode){
      switch(keyCode){
        // Right=68, Left=65
        case 68:
          xPos += spd;
          if(xPos + width > rightScreenBorder)
            xPos = rightScreenBorder - width;
          break;
        case 65:
          xPos -= spd;
          if(xPos < leftScreenBorder)
            xPos = leftScreenBorder + 1;
          break;
      }
    }
  }

  return {
    paddle: paddle
  };
})/*
.service("BO_ball", function(){
  return {

  }
})*/
