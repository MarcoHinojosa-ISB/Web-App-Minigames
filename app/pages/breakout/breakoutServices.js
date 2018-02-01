"use strict"

app.service("BO_paddle", function(){
  function paddle(data){
    let xPos = data.xPos;
    let yPos = data.gameHeight - 60;
    let xSpd = data.speed;
    const width = 100;
    const height = 20;
    const leftScreenBorder = 0;
    const rightScreenBorder = data.gameWidth;

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
    let health = data.health;
    let xPos = data.xPos;
    let yPos = data.yPos;
    const width = 50;
    const height = 30;

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
    let xSpd = 0;
    let ySpd = data.speed;
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
  }
  return {
    ball: ball
  };
})
.service("BO_mapData", function(){
  function mapData(){
    // the arrays represent each brick's properties [xPos, yPos, health]
    // the number to the left represents the level in which the properties are used
    const maps = {
      1: [ [0,0,1], [50,0,1], [100,0,1], [150,0,1], [200,0,1], [250,0,1], [300,0,1], [350,0,1],
          [400,0,1], [450,0,1], [500,0,1], [550,0,1], [600,0,1], [650,0,1], [700,0,1], [750,0,1],
          [0,30,1], [50,30,1], [100,30,1], [150,30,1], [200,30,1], [250,30,1], [300,30,1], [350,30,1],
          [400,30,1], [450,30,1], [500,30,1], [550,30,1], [600,30,1], [650,30,1], [700,30,1], [750,30,1],
          [0,60,1], [50,60,1], [100,60,1], [150,60,1], [200,60,1], [250,60,1], [300,60,1], [350,60,1],
          [400,60,1], [450,60,1], [500,60,1], [550,60,1], [600,60,1], [650,60,1], [700,60,1], [750,60,1] ]
    };

    this.getMap = function(level){
      return maps[level];
    }
  }
  return {
    mapData: mapData
  };
})
