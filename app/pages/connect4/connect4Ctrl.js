"use strict"

app.controller('connect4Ctrl', function($scope){
  $scope.init = function(){
    for(let r=0; r<6; r++){
      for(let c=0; c<7; c++){
        $("#c4-row-"+(r+1)).append("<div class='c4-space'><div class='open'></div></div>");
      }
    }
  }
})
