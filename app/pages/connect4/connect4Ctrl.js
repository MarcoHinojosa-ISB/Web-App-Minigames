"use strict"

app.controller('connect4Ctrl', function($scope, $timeout){
  $scope.playerWait = false;
  let cpuTurn = false;
  let rackSpaces = [];

  $scope.init = function(){
    for(let r=0; r<6; r++){
      rackSpaces.push([]);
      for(let c=0; c<7; c++){
        $("#c4-col-"+c).append("<div class='c4-space open'><div></div></div>");
        rackSpaces[r][c] = 0;
      }
    }
  }

  // Insert chip into rack
  $scope.insertChip = function(e){
    let columnSelected = e.currentTarget;
    let c = parseInt(columnSelected.id.substr(-1));
    let rows = columnSelected.children;

    for(let r=rows.length-1; r>=0; r--){
      if(rows[r].classList.contains("open")){
        rows[r].classList.remove("open");
        cpuTurn === false ? rows[r].classList.add("filled-red") : rows[r].classList.add("filled-black");

        rackSpaces[r][c] = 1;
        cpuTurn = !cpuTurn;
        break;
      }
    }

    if(rackSpaces[0].indexOf(0) === -1){
      $scope.playerWait = true;
      console.log("GAME OVER")
    }
    else{
      if(cpuTurn === true){
        $scope.playerWait = true;
        setTimeout(cpuDecision, 1000);
      }
    }
  }

  function cpuDecision(){
    let openColumns = [];
    for(let i=0; i<rackSpaces[0].length; i++){
      if(rackSpaces[0][i] === 0)
        openColumns.push(i);
    }

    let i = Math.floor(Math.random() * openColumns.length);

    $timeout(function() {
      $scope.playerWait = false;
      angular.element("#c4-col-"+openColumns[i]).trigger("click");
    },0);
  }
})
