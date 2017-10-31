"use strict"

app.controller('connect4Ctrl', function($scope, $timeout){
  $scope.playerWait = true;
  let rack;
  let cpuTurn;
  let playerColor, cpuColor;

  $scope.init = function(){
    rack = [];
    cpuTurn = false;

    $("#c4-rack").children("div").addClass("gray-out");
    $("#select-token").css("display","block");

    for(let r=0; r<6; r++){
      rack.push([]);
      for(let c=0; c<7; c++){
        $("#c4-col-"+c).append("<div class='c4-space open'><div></div></div>");
        rack[r][c] = 0;
      }
    }
  }

  // reset game: remove colors and set rack values to 0
  $scope.restart = function(){
    for(let c=0; c<7; c++){
      let rows = $("#c4-col-"+c).children();

      for(let r=0; r<rows.length; r++){
        rows[r].classList.remove("filled-red");
        rows[r].classList.remove("filled-black");
        rows[r].classList.add("open");

        rack[r][c] = 0;
      }
    }

    $("#play-again").css("display","none");
    $("#select-token").css("display","block");
  }

  // Insert token into rack
  $scope.insertToken = function(e){
    let c = parseInt(e.currentTarget.id.substr(-1)); //id,index of selected column
    let rows = e.currentTarget.children; //rows in selected column
    let winFlag = false;

    for(let r=rows.length-1; r>=0; r--){
      if(rows[r].classList.contains("open")){
        rows[r].classList.remove("open");

        if(!cpuTurn){
          rows[r].classList.add("filled-"+playerColor);
          rack[r][c] = 1;
          winFlag = checkWinPatterns(1);
        }
        else{
          rows[r].classList.add("filled-"+cpuColor);
          rack[r][c] = 2;
          winFlag = checkWinPatterns(2);
        }

        // if no one has won yet, continue to next turn
        if(!winFlag)
          cpuTurn = !cpuTurn;

        break;
      }
    }

    if(winFlag){
      $scope.playerWait = true;
      $scope.winner = !cpuTurn ? "Player 1 (you)" : "Player 2 (CPU)";

      $("#c4-rack").children("div").addClass("gray-out");
      $("#game-in-progress").css("display","none");
      $("#play-again").css("display","block");
    }
    else if(rack[0].indexOf(0) === -1){
      $scope.playerWait = true;
      $scope.winner = "tie";

      $("#c4-rack").children("div").addClass("gray-out");
      $("#game-in-progress").css("display","none");
      $("#play-again").css("display","block");
    }
    else if(cpuTurn){
      $scope.playerWait = true;
      cpuDecision();
    }
  }

  $scope.playerColorSelected = function(selected, other){
    playerColor = selected;
    cpuColor = other;

    $scope.playerWait = false;
    $("#c4-rack").children("div").removeClass("gray-out");
    $("#select-token").css("display","none");
    $("#game-in-progress").css("display","block");
  }

  function cpuDecision(){
    let openColumns = [];
    for(let c=0; c<rack[0].length; c++){
      if(rack[0][c] === 0)
        openColumns.push(c);
    }

    $timeout(function() {
      $scope.playerWait = false;
      angular.element("#c4-col-"+openColumns[Math.floor(Math.random() * openColumns.length)]).trigger("click");
    },1000);
  }

  // check all possible win conditions
  function checkWinPatterns(token){
    let count = 0;

    // (-) horizontal
    for(let r=0; r<6; r++){
      for(let c=0; c<7; c++){
        if(rack[r][c] === token)
          count++;
        else
          count = 0;

        if(count === 4)
          return true;
      }
      count = 0;
    }

    // (|) vertical
    for(let c=0; c<7; c++){
      for(let r=0; r<6; r++){
        if(rack[r][c] === token)
          count++;
        else
          count = 0;

        if(count === 4)
          return true;
      }
      count = 0;
    }

    // (\) diagonal
    for(let r=0; r<3; r++){
      for(let c=0; c<4; c++){
        if(rack[r][c] === token &&
          rack[r+1][c+1] === token &&
          rack[r+2][c+2] === token &&
          rack[r+3][c+3] === token){
          return true;
        }
      }
    }
    // (/) diagonal
    for(let r=0; r<3; r++){
      for(let c=3; c<7; c++){
        if(rack[r][c] === token &&
          rack[r+1][c-1] === token &&
          rack[r+2][c-2] === token &&
          rack[r+3][c-3] === token){
          return true;
        }
      }
    }
    return false;
  }
})
