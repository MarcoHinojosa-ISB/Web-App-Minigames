"use strict"

app.controller("tetrisCtrl", function($scope){
  let gameStart = false;

  // block field is 20 rows, 10 cols
  $scope.grid = [];
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
  6: Line/light-blue;
  7: Box/yellow;
  ===============*/
  const blk_structure = {
    1: [[0,3],[0,4],[1,4],[1,5]],
    2: [[0,5],[0,4],[1,3],[1,4]],
    3: [[0,4],[1,4],[1,3],[1,5]],
    4: [[1,3],[1,4],[1,5],[0,5]],
    5: [[1,3],[1,4],[1,5],[0,3]],
    6: [[1,3],[1,4],[1,5],[1,6]],
    7: [[0,4],[0,5],[1,4],[1,5]]
  }

  let blk, blkColor;
  let blockFallInterval, blockFallSpeed = 500;

  $scope.init = function(){
    gameStart = true;
    // create empty grid
    for(let r=0; r<rowSize; r++){
      $scope.grid.push([]);
      for(let c=0; c<colSize; c++){
        $scope.grid[r].push(0);
      }
    }

    getNewBlock();
    blockFallInterval = setInterval(blockFall, blockFallSpeed);
  }

  function blockFall(){
    //if block reached bottom collision, get new block
    if(floorCollision()){
      checkLineClear();
      getNewBlock();
    }

    //redraw grid
    $scope.$apply();
  }

  function checkLineClear(){
    let miss;

    for(let i=0; i<$scope.grid.length; i++){
      miss = false;

      for(let j=0; j<$scope.grid[i].length; j++){
        if($scope.grid[i][j] === 0){
          miss = true;
          break;
        }
      }
      if(!miss){
        $scope.grid.splice(i,1);
        $scope.grid.unshift([]);
        for(let c=0; c<colSize; c++){
          $scope.grid[0].push(0);
        }
      }
    }
  }

  // get a new block at random
  function getNewBlock(){
    blk = [];
    blkColor = Math.ceil(Math.random()*7);

    // get tile coordinates of new block
    for(let i=0; i<blk_structure[ blkColor ].length; i++){
      blk.push(blk_structure[ blkColor ][i].slice(0));
    }

    // draw block on grid
    for(let i=0; i<blk.length; i++){
      // end game if no open space for new block
      if($scope.grid[ blk[i][0] ][ blk[i][1] ] !== 0){
        clearInterval(blockFallInterval);
        gameStart = false;
      }

      $scope.grid[ blk[i][0] ][ blk[i][1] ] = blkColor;
    }
  }

  // block rotation
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

  $scope.keyDown = function(e){
    if(gameStart){
      switch(e.key.toLowerCase()){
        case 'w':
          blockRotation();
          break;
        case 'a':
          leftWallCollision();
          break;
        case 'd':
          rightWallCollision();
          break;
        case 's':
          // if no floor collision, reset block fall timer
          if(!floorCollision()){
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
