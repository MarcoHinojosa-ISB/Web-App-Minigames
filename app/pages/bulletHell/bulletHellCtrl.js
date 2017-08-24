"use strict"

app.controller('bulletHellCtrl', function($scope, $http, BH_player, BH_playerBullet, BH_enemy){
	let c_BG = $("#bh-screen")[0];
	let c_PL = $("#bh-player")[0];
	let c_EN = $("#bh-enemy")[0];
	let ctx_BG = c_BG.getContext("2d");
	let ctx_PL = c_PL.getContext("2d");
	let ctx_EN = c_EN.getContext("2d");
	let enemyOnScreen = [];
	let shotDelay = 0;
	let pl;

	const second = 1000;

	// Screen Parameters
	const gameWidth = c_BG.getAttribute('width');
	const gameHeight = c_BG.getAttribute('height');

	// Init
	$scope.init = function(){
		drawTitleScreen();
	}

	// Game Start
	$scope.startGame = function(){
		$("#bh-start").hide();

		let data = {
			position: [50, 400],
			speed: [4, 4],
			size: [20, 20]
		};
		pl = new BH_player.spawnPlayer(data);

		setInterval(updateActors, 10);
		setTimeout(function(){
			setInterval(wave1, 2000);
		}, second);
	}

	// Keys/Controls
	let keyState = {};
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
	    	shotDelay++;
	    	if(shotDelay > 10){
					shotDelay = 0;

					let data = {
						position: [pl.xPos + pl.getWidth()*.3, pl.yPos - pl.getHeight()/2],
						speed: [0, 20],
						size: [pl.getWidth()*.3, 30],
						power: 5
					}
	    		pl.bulletCount.push(new BH_playerBullet.spawnBullet(data));
	    	}
	    }
    }


		// ENEMIES WORKSPACE
		function wave1(){
			let data = {
				position: [50, -5],
				speed: [0.5, 0.8],
				radius: 10,
				health: 10,
				wave: 1,
				phase: 1
			}
			enemyOnScreen.push(new BH_enemy.spawnEnemy(data));

			data = {
				position: [gameWidth - 360, -5],
				speed: [-0.5, 0.8],
				radius: 10,
				health: 10,
				wave: 1,
				phase: 1
			}
			enemyOnScreen.push(new BH_enemy.spawnEnemy(data));
		}


    // Animate game
	function updateActors(){
		ctx_PL.clearRect(0,0,gameWidth,gameHeight);
		ctx_EN.clearRect(0,0,gameWidth,gameHeight);

		drawPlayerBullets();
		drawPlayer();

		keyChecker();
		drawEnemies();
		drawGUI();
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
		ctx_BG.clearRect(0,0,gameWidth,gameHeight);

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
	function drawTitleScreen(){
		ctx_BG.clearRect(0,0,gameWidth,gameHeight);

		// border
		ctx_BG.beginPath();
		ctx_BG.rect(0,0,gameWidth,gameHeight);
		ctx_BG.lineWidth=1;
		ctx_BG.stroke();
		ctx_BG.closePath();

		// title
		ctx_BG.beginPath();
		ctx_BG.font = "40px Comic Sans MS";
		ctx_BG.fillText("Bullet Hell", 300, 100);
		ctx_BG.closePath();
	}

	function drawPlayerBullets(){
		pl.bulletCount = pl.bulletCount.filter(function(bullet){
			if(bullet.yPos + bullet.getHeight() <= 0){
				return false;
			}
			else{
				ctx_PL.beginPath();
				ctx_PL.fillStyle = "blue";
				ctx_PL.fillRect(bullet.xPos, bullet.yPos, bullet.getWidth(), bullet.getHeight());
				ctx_PL.closePath();
				bullet.yPos -= bullet.ySpd;
				return true;
			}
		});
	}

	function drawEnemies(){
		enemyOnScreen = enemyOnScreen.filter(function(enemy){
			if(!enemy.outOfBounds(gameWidth,gameHeight)){
				ctx_EN.beginPath();
				ctx_EN.fillStyle = "gray";
				ctx_EN.arc(enemy.xPos, enemy.yPos, enemy.radius, 0, 2 * Math.PI);
				ctx_EN.fill();
				ctx_EN.closePath();

				//Wave 1 behavior
				if(enemy.wave === 1){
					//phase 1
					if(enemy.yPos < 400 && enemy.phase === 1){
						enemy.yPos += enemy.ySpd;
					}
					else{
						//phase 2
						if(enemy.phase !== 2){
							enemy.phase = 2;
							enemy.ySpd = 0.02;
						}

						enemy.xPos += enemy.xSpd;
						enemy.yPos -= enemy.ySpd;
						enemy.xSpd *= 1.008;
						enemy.ySpd *= 1.02;
					}
				}
				return true;
			}
			return false;
		});
	}

	/* simple pattern formula for later
	enemy.xPos = 250 + (enemy.xScale * Math.cos(enemy.angle * Math.PI / 180));
	enemy.yPos = 250 + (enemy.yScale * Math.sin(enemy.angle * Math.PI / 180));
	enemy.xPos = 250 + (enemy.xScale * Math.sin(enemy.angle * Math.PI / 180));
	enemy.yPos = 250 + (enemy.yScale * Math.cos(enemy.angle * Math.PI / 180));
	enemy.angle + 3 <= 360 ? enemy.angle += 3 : enemy.angle = 0;
	enemy.xScale += enemy.xSpd;
	enemy.yScale += enemy.ySpd;
	*/
})
