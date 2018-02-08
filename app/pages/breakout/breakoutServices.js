"use strict"

app.service("BO_paddle", function(){
  function paddle(data){
    const width = 100;
    const height = 20;
    const leftScreenBorder = 0;
    const rightScreenBorder = data.gameWidth;
    let xPos = data.xPos;
    let yPos = data.gameHeight - 60;
    let xSpd = data.speed;

    this.setXSpd = function(spd){
      xSpd = spd;
    }
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
          xPos += xSpd;
          if(xPos + width > rightScreenBorder)
            xPos = rightScreenBorder - width;
          break;
        case 65:
          xPos -= xSpd;
          if(xPos < leftScreenBorder)
            xPos = leftScreenBorder + 1;
          break;
      }
    }
  }
  return {
    paddle: paddle
  };
})
.service("BO_brick", function(){
  function brick(data){
    const width = 80;
    const height = 30;
    const type = data.type;
    let xPos = data.xPos * width;
    let yPos = data.yPos * height;
    let health = 1;

    this.getHealth = function(){
      return health;
    }
    this.getXPos = function(){
      return xPos;
    }
    this.getYPos = function(){
      return yPos;
    }
    this.getWidth = function(){
      return width;
    }
    this.getHeight = function(){
      return height;
    }
    this.getType = function(){
      return type;
    }

    this.damaged = function(){
      health--;
    }
  }
  return {
    brick: brick
  };
})
.service("BO_ball", function(){
  function ball(data){
    let xPos = data.xPos;
    let yPos = data.yPos;
    let xSpd = data.xSpd;
    let ySpd = data.ySpd;
    let radius = data.radius;

    this.move = function(){
      xPos += xSpd;
      yPos += ySpd;
    }

    this.getXPos = function(){
      return xPos;
    }
    this.getYPos = function(){
      return yPos;
    }
    this.getXSpd = function(){
      return xSpd;
    }
    this.getYSpd = function(){
      return ySpd;
    }
    this.getRadius = function(){
      return radius;
    }

    this.setXSpd = function(x){
      xSpd = x;
    }
    this.setYSpd = function(y){
      ySpd = y;
    }
    this.setRadius = function(r){
      radius = r;
    }
  }
  return {
    ball: ball
  };
})
.service("BO_mapData", function(){
  function mapData(){
    // the arrays in "maps" represent each brick's properties [column, row, type]
    // at max, bricks can take up 10 columns and 7 rows
    // the number to the left represents the level in which the properties are used
    const maps = {
      1: [[0,1,1], [1,1,1], [2,1,1], [3,1,1], [4,1,1], [5,1,1], [6,1,1], [7,1,1], [8,1,1], [9,1,1],
          [0,2,1], [1,2,1], [2,2,1], [3,2,1], [4,2,1], [5,2,1], [6,2,1], [7,2,1], [8,2,1], [9,2,1],
          [0,3,1], [1,3,1], [2,3,1], [3,3,1], [4,3,1], [5,3,1], [6,3,1], [7,3,1], [8,3,1], [9,3,1]],
      2: [[0,1,1], [1,1,1], [2,1,1], [7,1,1], [8,1,1], [9,1,1],
          [0,2,1], [1,2,4], [2,2,1], [7,2,1], [8,2,2], [9,2,1],
          [0,3,1], [1,3,1], [2,3,1], [7,3,1], [8,3,1], [9,3,1]],
      3: [[1,1,1], [2,1,1], [3,1,1], [4,1,1], [5,5,3], [6,1,1], [7,1,1], [8,1,1],
          [1,2,1], [2,2,1], [3,2,3], [6,2,3], [7,2,1], [8,2,1],
          [1,3,1], [2,3,1], [3,3,1], [6,3,1], [7,3,1], [8,3,1],
          [1,4,1], [2,4,1], [3,4,3], [6,4,3], [7,4,1], [8,4,1],
          [1,5,1], [2,5,1], [3,5,1], [4,5,3], [5,5,3], [6,5,1], [7,5,1], [8,5,1]]
    };

    this.getMap = function(level){
      return maps[level];
    }
  }
  return {
    mapData: mapData
  };
})
