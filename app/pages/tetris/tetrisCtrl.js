"use strict"

app.controller("tetrisCtrl", function($scope){
  let gameStart = false;
  $scope.points = 0;
  $scope.linesCleared = 0;

  $scope.grid = []; $scope.nextGrid = [];
  const rowSize = 20;
  const colSize = 10;

  /* block initial coords
  ID: shape/color
  ===============
  0: "EMPTY"/black;
  1: Z/red;
  2: S/blue;
  3: T/purple;
  4: L/green;
  5: J/orange;
  6: I/light-blue;
  7: O/yellow;
  ===============*/
  const blk_structure = {
    1: [[0,3],[0,4],[1,4],[1,5]],
    2: [[0,5],[0,4],[1,3],[1,4]],
    3: [[0,4],[1,4],[1,3],[1,5]],
    4: [[1,3],[1,4],[1,5],[0,5]],
    5: [[1,3],[1,4],[1,5],[0,3]],
    6: [[0,3],[0,4],[0,5],[0,6]],
    7: [[0,4],[0,5],[1,4],[1,5]]
  }
  const next_blk_structure = {
    1: [[1,1],[1,2],[2,2],[2,3]],
    2: [[1,2],[1,1],[2,0],[2,1]],
    3: [[1,1],[2,1],[2,0],[2,2]],
    4: [[2,0],[2,1],[2,2],[1,2]],
    5: [[1,1],[2,1],[2,2],[2,3]],
    6: [[1,0],[1,1],[1,2],[1,3]],
    7: [[1,1],[1,2],[2,1],[2,2]]
  }

  let blk, blkColor;
  let nextBlk, nextBlkColor;
  let blockFallInterval, blockFallSpeed = 500;

  $scope.init = function(){
    // create empty grid
    for(let r=0; r<rowSize; r++){
      $scope.grid.push([]);
      if(r<4){
        $scope.nextGrid.push([]);
      }
      for(let c=0; c<colSize; c++){
        $scope.grid[r].push(0);
        if(r<4 && c<4){
          $scope.nextGrid[r].push(0);
        }
      }
    }
  }

  $scope.startGame = function(){
    $("#tetris-screen").focus();

    // hide start button
    $("#tetris-start").css("display", "none");

    // start game variables
    gameStart = true;
    $scope.points = 0;
    $scope.linesCleared = 0;

    // begin dropping blocks
    nextBlkColor = Math.ceil(Math.random()*7);
    getNewBlock();
    blockFallInterval = setInterval(blockFall, blockFallSpeed);
  }

  $scope.resetGame = function(){
    $("#tetris-grid").css("opacity","1");
    $("#tetris-gameover").css("display", "none");

    for(let r=0; r<rowSize; r++){
      for(let c=0; c<colSize; c++){
        $scope.grid[r][c] = 0;
      }
    }

    $scope.startGame();
  }

  function blockFall(){
    //if block reached bottom collision, get new block
    if(floorCollision()){
      checkLineClear();
      getNewBlock();
    }
    $scope.$apply();
  }

  function checkLineClear(){
    let miss;

    for(let r=0; r<rowSize; r++){
      miss = false;

      for(let c=0; c<colSize; c++){
        if($scope.grid[r][c] === 0){
          miss = true;
          break;
        }
      }
      if(!miss){
        $scope.grid.splice(r,1);
        $scope.grid.unshift([]);

        for(let c=0; c<colSize; c++){
          $scope.grid[0].push(0);
        }
        $scope.points += 40;
        $scope.linesCleared++;
      }
    }
  }

  // get a new block at random
  function getNewBlock(){
    blk = [];
    nextBlk = [];

    blkColor = nextBlkColor;
    nextBlkColor = Math.ceil(Math.random()*7);

    // get tile coordinates of next blocks
    for(let i=0; i<4; i++){
      blk.push(blk_structure[ blkColor ][i].slice(0));
      nextBlk.push(next_blk_structure[ nextBlkColor ][i].slice(0));
    }

    // clear grid on status area
    for(let r=0; r<4; r++){
      for(let c=0; c<4; c++){
        $scope.nextGrid[r][c] = 0;
      }
    }

    // draw blocks on grids
    for(let i=0; i<4; i++){
      // end game if no open space for current block
      if($scope.grid[ blk[i][0] ][ blk[i][1] ] !== 0){
        clearInterval(blockFallInterval);
        gameStart = false;
        $("#tetris-grid").css("opacity","0.7");
        $("#tetris-gameover").css("display", "block");
      }

      $scope.grid[ blk[i][0] ][ blk[i][1] ] = blkColor;
      $scope.nextGrid[ nextBlk[i][0] ][ nextBlk[i][1] ] = nextBlkColor;
    }
  }

  function blockRotation(){
    let pivot = blk[1];
    let rotateMatrix = [[0,1],[-1,0]];
    let tmp1 = [1,1], tmp2 = [1,1], tmp3 = [];
    let canRotate = true;

    // rotate tiles
    for(let i=0; i<blk.length; i++){
      tmp1[0] = blk[i][0] - pivot[0];
      tmp1[1] = blk[i][1] - pivot[1];

      tmp2[0] = (rotateMatrix[0][0] * tmp1[0]) + (rotateMatrix[0][1] * tmp1[1]);
      tmp2[1] = (rotateMatrix[1][0] * tmp1[0]) + (rotateMatrix[1][1] * tmp1[1]);

      tmp3.push([tmp2[0] + pivot[0], tmp2[1] + pivot[1]]);
    }

    // check if rotation is valid
    for(let i=0; i<tmp3.length; i++){
      if(tmp3[i][0] < 0 || tmp3[i][0] > rowSize-1 || tmp3[i][1] < 0 || tmp3[i][1] > colSize-1){
        canRotate = false;
        break;
      }
      if($scope.grid[ tmp3[i][0] ][ tmp3[i][1] ] !== 0 && $scope.grid[ tmp3[i][0] ][ tmp3[i][1] ] !== $scope.grid[ blk[i][0] ][ blk[i][1] ]){
        canRotate = false;
        break;
      }
    }

    // update grid if rotation is valid
    if(canRotate){
      for(let i=0; i<blk.length; i++){
        $scope.grid[blk[i][0]][blk[i][1]] = 0;
      }
      blk = tmp3.slice(0);
      for(let i=0; i<blk.length; i++){
        $scope.grid[blk[i][0]][blk[i][1]] = blkColor;
      }
    }
  }

  // controls
  // ========
  // W/Up: rotate
  // A/left: move left
  // S/Down: move down
  // D/Right: move right
  $scope.controls = function(e){
    if(gameStart){
      switch(e.keyCode){
        case 87:
        case 38:
          blockRotation();
          break;
        case 37:
        case 65:
          leftWallCollision();
          break;
        case 39:
        case 68:
          rightWallCollision();
          break;
        case 40:
        case 83:
          // if no floor collision, reset block fall timer
          if(!floorCollision()){
            $scope.points++;
            clearInterval(blockFallInterval);
            blockFallInterval = setInterval(blockFall, blockFallSpeed);
          };
          break;
      }
    }

  }

  function leftWallCollision(){
    let wallReached = false;

    for(let i=0; i<blk.length; i++){
      if(blk[i][1] === 0){
        wallReached = true;
        break;
      }
      if($scope.grid[ blk[i][0] ][ blk[i][1] - 1 ] !== 0){
        if(!checkTileExists([ blk[i][0], blk[i][1] - 1 ])){
          wallReached = true;
          break;
        }
      }
    }

    if(!wallReached){
      for(let i=0; i<blk.length; i++){
        $scope.grid[ blk[i][0] ][ blk[i][1] ] = 0;
      }

      for(let i=0; i<blk.length; i++){
        blk[i][1]--;
        $scope.grid[ blk[i][0] ][ blk[i][1] ] = blkColor;
      }
    }
  }
  function rightWallCollision(){
    let wallReached = false;

    for(let i=0; i<blk.length; i++){
      if(blk[i][1] === colSize-1){
        wallReached = true;
        break;
      }
      if($scope.grid[ blk[i][0] ][ blk[i][1] + 1 ] !== 0){
        if(!checkTileExists([ blk[i][0], blk[i][1] + 1 ])){
          wallReached = true;
          break;
        }
      }
    }

    if(!wallReached){
      for(let i=0; i<blk.length; i++){
        $scope.grid[ blk[i][0] ][ blk[i][1] ] = 0;
      }

      for(let i=0; i<blk.length; i++){
        blk[i][1]++;
        $scope.grid[ blk[i][0] ][ blk[i][1] ] = blkColor;
      }
    }
  }
  function floorCollision(){
    let bottomReached = false;

    for(let i=0; i<blk.length; i++){
      // check if the tile coords of the falling block reached the bottom
      if(blk[i][0] === rowSize-1){
        bottomReached = true;
        break;
      }
      // check if the tile coords of the falling block reached other blocks
      if($scope.grid[ blk[i][0] + 1 ][ blk[i][1] ] !== 0){
        if(!checkTileExists([ blk[i][0] + 1, blk[i][1] ])){
          bottomReached = true;
          break;
        }
      }
    }

    // move block if floor not reached
    if(!bottomReached){
      for(let i=0; i<blk.length; i++){
        $scope.grid[ blk[i][0] ][ blk[i][1] ] = 0;
      }

      for(let i=0; i<blk.length; i++){
        blk[i][0]++;
        $scope.grid[ blk[i][0] ][ blk[i][1] ] = blkColor;
      }
    }

    return bottomReached;
  }

  // check if a tile is part of falling block
  function checkTileExists(tile){
    for(let i=0; i<blk.length; i++){
      if(blk[i][0] === tile[0] && blk[i][1] === tile[1])
        return true;
    }
    return false;
  }
})
