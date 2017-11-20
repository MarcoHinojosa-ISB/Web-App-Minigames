"use strict"

app.controller("tetrisCtrl", function($scope){
  // block field is 20 rows, 10 cols
  $scope.blockField = [];
  let rowSize = 20;
  let colSize = 10;

  /* ID: shape/color
  ===============
  0: "EMPTY"/black;
  1: Z/red;
  2: S/blue;
  3: T/purple;
  4: L/green;
  5: Reverse-L/orange;
  6: Line/light-blue;
  7: Box/yellow;
  ===============*/
  let blk_structure = {
    1: [[0,3],[0,4],[1,4],[1,5]],
    2: [[0,4],[0,5],[1,3],[1,4]],
    3: [[0,4],[1,3],[1,4],[1,5]],
    4: [[0,4],[1,4],[2,4],[2,5]],
    5: [[0,4],[1,4],[2,4],[2,3]],
    6: [[0,3],[0,4],[0,5],[0,6]],
    7: [[0,4],[0,5],[1,4],[1,5]]
  }

  let blk, blkColor;

  $scope.init = function(){
    for(let r=0; r<rowSize; r++){
      $scope.blockField.push([]);
      for(let c=0; c<colSize; c++){
        $scope.blockField[r].push(0);
      }
    }

    getNewBlock();
    gameStart();
  }

  function gameStart(){
    let blkFall = setInterval(function(){
      let bottomReached = false;

      // check if the tiles of the block reached the bottom
      for(let i=0; i<blk.length; i++){
        if(blk[i][0] + 1 === 20){
          bottomReached = true;
          break;
        }
        if($scope.blockField[ blk[i][0] + 1 ][ blk[i][1] ] !== 0){
          if(!checkTileExists([blk[i][0] + 1, blk[i][1]])){
            bottomReached = true;
            break;
          }
        }
      }

      if(!bottomReached){
        for(let i=0; i<blk.length; i++){
          $scope.blockField[ blk[i][0] ][ blk[i][1] ] = 0;
        }

        for(let i=0; i<blk.length; i++){
          blk[i][0]++;
          $scope.blockField[ blk[i][0] ][ blk[i][1] ] = blkColor;
        }
      }
      else{
        getNewBlock();
      }
      $scope.$apply();
    }, 100);
  }

  function checkTileExists(tmp){
    let tileExists = false;

    for(let j=0; j<blk.length; j++){
      if(blk[j][0] === tmp[0] && blk[j][1] === tmp[1]){
        tileExists = true;
        break;
      }
    }

    return tileExists;
  }

  // get random block
  function getNewBlock(){
    blkColor = Math.ceil(Math.random()*7);
    blk = [];

    for(let i=0; i<blk_structure[ blkColor ].length; i++){
      blk.push(blk_structure[ blkColor ][i].slice(0));
    }

    for(let i=0; i<blk.length; i++){
      $scope.blockField[ blk[i][0] ][ blk[i][1] ] = blkColor;
    }
  }
})
