"use strict"

app.controller('bulletHellCtrl', function($scope, $http, BH_player, BH_playerBullet, BH_enemy){
		let c_BG = $("#bh-screen")[0];
		let c_PL = $("#bh-player")[0];
		let c_EN = $("#bh-enemy")[0];
		let ctx_BG = c_BG.getContext("2d");
		let ctx_PL = c_PL.getContext("2d");
		let ctx_EN = c_EN.getContext("2d");
		let enemyOnScreen = [];
		let shotDelay = 8;
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

			//Create player
			let data = {
				position: [50, 400],
				speed: [4, 4],
				size: [20, 20]
			};
			pl = new BH_player.spawnPlayer(data);

			// enemy waves
			var w1;

			setInterval(updateActors, 10);
			setTimeout(function(){
				w1 = setInterval(wave1, 700);
			}, 1000);
			setTimeout(function(){
				clearInterval(w1);
			}, 6000);
		}

		// Keys/Controls
		let keyState = {};
		$scope.keyDown = function(e){
			keyState[e.keyCode || e.which] = true;
		}
		$scope.keyUp = function(e){
			if(e.which === 75)
				shotDelay = 8;
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
	    	if(shotDelay > 8){
					shotDelay = 0;

					let data = {
						position: [pl.xPos + pl.getWidth()*.3, pl.yPos - pl.getHeight()/2],
						speed: [0, 12],
						size: [pl.getWidth()*.3, 30],
						power: 5
					}
	    		pl.bulletCount.push(new BH_playerBullet.spawnBullet(data));
	    	}
	    }
    }

		// ENEMIES WORKSPACE
		function wave1(){
			console.log(shotDelay)

			let data = {
				position: [50, -5],
				speed: [0.5, 1.4],
				radius: 10,
				health: 10,
				wave: 1,
				phase: 1
			}
			enemyOnScreen.push(new BH_enemy.spawnEnemy(data));

			data = {
				position: [gameWidth - 360, -5],
				speed: [-0.5, 1.4],
				radius: 10,
				health: 10,
				wave: 1,
				phase: 1
			}
			enemyOnScreen.push(new BH_enemy.spawnEnemy(data));
		}

		function checkEnemyHitCollision(){
			enemyOnScreen = enemyOnScreen.filter(function(enemy){
				pl.bulletCount = pl.bulletCount.filter(function(bullet){
					let distX = Math.abs(enemy.xPos - (bullet.xPos + (bullet.width/2)));
					let distY = Math.abs(enemy.yPos - (bullet.yPos + (bullet.height/2)));

					// No Collision
					if (distX > (bullet.width/2 + enemy.radius) || distY > (bullet.height/2 + enemy.radius)){
						return true;
					}

					// Collision
			    if (distX <= (bullet.width/2) || distY <= (bullet.height/2)) {
						enemy.takeDmg(bullet.power);
						return false;
					}

					// check corners
					let dx = distX-bullet.width/2;
    			let dy = distY-bullet.height/2;
    			if(dx*dx + dy*dy <= (enemy.radius*enemy.radius)){
						enemy.takeDmg(bullet.power);
						return false;
					}
					else {
						return true;
					}
				})

				return enemy.health > 0;
			})
		}

	  // Animate game
		function updateActors(){
			ctx_BG.clearRect(0,0,gameWidth,gameHeight);
			ctx_PL.clearRect(0,0,gameWidth,gameHeight);
			ctx_EN.clearRect(0,0,gameWidth,gameHeight);

			drawGUI();
			keyChecker();

			drawPlayerBullets();
			drawPlayer();

			drawEnemies();
			checkEnemyHitCollision();
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
				if(bullet.yPos + bullet.height <= 0){
					return false;
				}
				else{
					ctx_PL.beginPath();
					ctx_PL.fillStyle = "blue";
					ctx_PL.fillRect(bullet.xPos, bullet.yPos, bullet.width, bullet.height);
					ctx_PL.closePath();
					bullet.yPos -= bullet.ySpd;
					return true;
				}
			});
		}

		function drawEnemies(){
			enemyOnScreen = enemyOnScreen.filter(function(enemy){
				if(!enemy.outOfBounds(gameWidth,gameHeight)){
					//Wave 1 behavior
					if(enemy.wave === 1){
						//phase 1
						if(enemy.yPos < 300 && enemy.phase === 1){
							enemy.yPos += enemy.ySpd;
							enemy.ySpd *= 0.998;

						}
						//phase 2
						else{
							if(enemy.phase !== 2){
								enemy.phase = 2;
								enemy.ySpd = 0.02;
							}

							enemy.xPos += enemy.xSpd;
							enemy.yPos -= enemy.ySpd;
							enemy.xSpd *= 1.005;
							enemy.ySpd *= 1.02;
						}
					}

					ctx_EN.beginPath();
					ctx_EN.fillStyle = "gray";
					ctx_EN.arc(enemy.xPos, enemy.yPos, enemy.radius, 0, 2 * Math.PI);
					ctx_EN.fill();
					ctx_EN.closePath();


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
