
app.controller('bulletHellCtrl', function($scope, $http, BH_player, BH_playerBullet){
	var c_BG = document.getElementById("bh-screen");
	var c_PL = document.getElementById("bh-player");
	var ctx_BG = c_BG.getContext("2d");
	var ctx_PL = c_PL.getContext("2d");
	var pl = new BH_player.spawnPlayer([50,0],[3,4],1);
	var shootTimer = 0;
	var playerBullets = [];

	// Screen parameters
	const gameWidth = c_BG.getAttribute('width');
	const gameHeight = c_BG.getAttribute('height');

	// Init
	$scope.init = function(){
		pl.reset(); // reset player stats
		playerBullets = []; // remove player's bullets
		drawGUI(); // draw background (once)
		setInterval(updateActors, 10); // animate players/enemies/bullets
	}

	// Keys/Controls
	var keyState = {};
	$scope.keyDown = function(e){
		keyState[e.keyCode || e.which] = true;
		
	}
	$scope.keyUp = function(e){
		keyState[e.keyCode || e.which] = false;
	}
	function keyChecker(){
		
        if(keyState[87]){
        	if(pl.yPos - pl.ySpd < 0)
        		pl.yPos = 0;
        	else
        		pl.yPos -= pl.ySpd;
        }
        if(keyState[65]){
        	if(pl.xPos - pl.xSpd < 0)
        		pl.xPos = 0;
        	else
        		pl.xPos -= pl.xSpd;
        } 
        if(keyState[83]){
        	if(pl.yPos + pl.getHeight() + pl.ySpd > gameHeight)
        		pl.yPos = gameHeight - pl.getHeight();
        	else
        		pl.yPos += pl.ySpd;
        }
	    if(keyState[68]){
	    	if(pl.xPos + pl.getWidth() + pl.xSpd > gameWidth - 300)
        		pl.xPos = gameWidth - 301 - pl.getWidth();
        	else
        		pl.xPos += pl.xSpd;
	    }
	    if(keyState[75]){
	    	console.log(playerBullets.length)
	    	shootTimer++;
	    	if(shootTimer > 10){
	    		playerBullets.push(new BH_playerBullet.spawnBullet( [pl.xPos + pl.getWidth()*.3, pl.yPos - pl.getHeight()/2], [0,20], [pl.getWidth()*.3,30], 5));
	    		shootTimer = 0;
	    	}
	    }    
    }

    function drawPlayerBullets(){
    	playerBullets = playerBullets.filter(function(bullet){
    		if(bullet.yPos + bullet.getHeight() > 0){
    			ctx_PL.beginPath();
    			ctx_PL.fillStyle = "blue";
    			ctx_PL.fillRect(bullet.xPos, bullet.yPos, bullet.getWidth(), bullet.getHeight());
    			ctx_PL.closePath();
    			bullet.yPos -= bullet.ySpd;
    			return true;
    		}
    		else{
    			return false;
    		}
    	});
    }

    // Animate game
	function updateActors(){
		ctx_PL.clearRect(0,0,gameWidth,gameHeight);
		drawPlayerBullets();
		drawPlayer();
		
		keyChecker();
	}
	function drawPlayer(){
		//sprite
		ctx_PL.beginPath();
		ctx_PL.fillStyle = "lime";
		ctx_PL.fillRect(pl.xPos, pl.yPos, pl.getWidth(), pl.getHeight());
		ctx_PL.closePath();
		//hitbox
		ctx_PL.beginPath();
		ctx_PL.fillStyle = "red";
		ctx_PL.fillRect(pl.xPos+(pl.getWidth()*.3), pl.yPos+(pl.getHeight()*.3), pl.getWidth()*.4, pl.getWidth()*.4);
		ctx_PL.closePath();
	}
	function drawGUI(){
		//Left Side
		ctx_BG.beginPath();
		ctx_BG.rect(0,0,gameWidth-300,gameHeight);
		ctx_BG.lineWidth=1;
		ctx_BG.stroke();
		ctx_BG.closePath();

		//Right Side
		ctx_BG.beginPath();
		ctx_BG.rect(gameWidth-300,0,300,gameHeight);
		ctx_BG.lineWidth=1;
		ctx_BG.stroke();
		ctx_BG.closePath();
	}
})