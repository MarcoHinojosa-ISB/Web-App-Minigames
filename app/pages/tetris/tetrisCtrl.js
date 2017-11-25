"use strict"

app.controller("tetrisCtrl", function($scope){
  let gameStart = false;

  // block field is 20 rows, 10 cols
  $scope.blockField = [];
  let rowSize = 20;
  let colSize = 10;

  /* block starting coords
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
    2: [[0,4],[0,5],[1,3],[1,4]],
    3: [[0,4],[1,3],[1,4],[1,5]],
    4: [[1,4],[1,5],[1,6],[0,6]],
    5: [[0,4],[0,5],[0,6],[1,6]],
    6: [[0,3],[0,4],[0,5],[0,6]],
    7: [[0,4],[0,5],[1,4],[1,5]]
  }

  let blk, blkColor;
  let blockFallInterval, blockFallSpeed = 1000;

  $scope.init = function(){
    gameStart = true;
    // create empty grid
    for(let r=0; r<rowSize; r++){
      $scope.blockField.push([]);
      for(let c=0; c<colSize; c++){
        $scope.blockField[r].push(0);
      }
    }

    getNewBlock();
    blockFallInterval = setInterval(blockFall, blockFallSpeed);
  }

  $scope.keyDown = function(e){
    if(gameStart){
      switch(e.key.toLowerCase()){
        case 'a':
          leftWallCollision();
          break;
        case 'd':
          rightWallCollision();
          break;
        case 's':
          if(!floorCollision()){
            clearInterval(blockFallInterval);
            blockFallInterval = setInterval(blockFall, blockFallSpeed);
          };
          break;
      }
    }

  }

  function leftWallCollision(){
    if(blk[0][1] !== 0 && blk[1][1] !== 0 && blk[2][1] !== 0 && blk[3][1] !== 0){
      console.log("wall not touched")
      for(let i=0; i<blk.length; i++){
        $scope.blockField[ blk[i][0] ][ blk[i][1] ] = 0;
      }

      for(let i=0; i<blk.length; i++){
        blk[i][1]--;
        $scope.blockField[ blk[i][0] ][ blk[i][1] ] = blkColor;
      }
    }
  }
  function rightWallCollision(){
    if(blk[0][1] !== colSize-1 && blk[1][1] !== colSize-1 && blk[2][1] !== colSize-1 && blk[3][1] !== colSize-1){
      console.log(blk[3][1])
      for(let i=0; i<blk.length; i++){
        $scope.blockField[ blk[i][0] ][ blk[i][1] ] = 0;
      }

      for(let i=0; i<blk.length; i++){
        blk[i][1]++;
        $scope.blockField[ blk[i][0] ][ blk[i][1] ] = blkColor;
      }
    }
  }
  function floorCollision(){
    let bottomReached = false;

    for(let i=0; i<blk.length; i++){
      // check if the tile coords of the falling block reached the bottom
      if(blk[i][0] + 1 === 20){
        bottomReached = true;
        break;
      }
      // check if the tile coords of the falling block reached other blocks
      if($scope.blockField[ blk[i][0] + 1 ][ blk[i][1] ] !== 0){
        if(!checkTileExists([blk[i][0] + 1, blk[i][1]])){
          bottomReached = true;
          break;
        }
      }
    }

    // move block if still falling, else grab new block
    if(!bottomReached){
      for(let i=0; i<blk.length; i++){
        $scope.blockField[ blk[i][0] ][ blk[i][1] ] = 0;
      }

      for(let i=0; i<blk.length; i++){
        blk[i][0]++;
        $scope.blockField[ blk[i][0] ][ blk[i][1] ] = blkColor;
      }
    }

    return bottomReached;
  }

  function blockFall(){
    if(floorCollision()){
      getNewBlock();
    }

    //redraw grid
    $scope.$apply();
  }

  // check if a tile is part of falling block
  function checkTileExists(tile){
    for(let i=0; i<blk.length; i++){
      if(blk[i][0] === tile[0] && blk[i][1] === tile[1])
        return true;
    }
    return false;
  }

  // get a new block at random
  function getNewBlock(){
    blk = [];
    blkColor = Math.ceil(Math.random()*7);

    // get tile coordinates of new block, then draw on grid
    for(let i=0; i<blk_structure[ blkColor ].length; i++){
      blk.push(blk_structure[ blkColor ][i].slice(0));
    }

    for(let i=0; i<blk.length; i++){
      if($scope.blockField[ blk[i][0] ][ blk[i][1] ] !== 0){
        clearInterval(blockFallInterval);
        gameStart = false;
      }

      $scope.blockField[ blk[i][0] ][ blk[i][1] ] = blkColor;
    }
  }
})
