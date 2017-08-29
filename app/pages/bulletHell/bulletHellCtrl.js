"use strict"

app.controller('bulletHellCtrl', function($scope, $http, BH_player, BH_playerBullet, BH_enemy, BH_enemyBullet, BH_points){
		let c_BG = $("#bh-screen")[0];
		let c_PL = $("#bh-player")[0];
		let c_EN = $("#bh-enemy")[0];
		let ctx_BG = c_BG.getContext("2d");
		let ctx_PL = c_PL.getContext("2d");
		let ctx_EN = c_EN.getContext("2d");

		let plBulletCount = [];
		let enBulletCount = [];
		let enemyOnScreen = [];

		let shotDelay = 8;	// shot delay for player
		let pl;

		let points = BH_points;

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
				speed: [2, 2],
				radius: 5
			};
			pl = new BH_player.spawnPlayer(data);

			// enemy wave intervals
			let w1;

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
			// Up
			if(keyState[87]){
      	if(pl.yPos - pl.radius - pl.ySpd < 0)
      		pl.yPos = pl.radius;
      	else
      		pl.yPos -= pl.ySpd;
      }
			// Right
	    if(keyState[68]){
	    	if(pl.xPos + pl.radius + pl.xSpd > gameWidth - 300)
        		pl.xPos = gameWidth - 300 - pl.radius;
      	else
      		pl.xPos += pl.xSpd;
	    }
			// Down
      if(keyState[83]){
      	if(pl.yPos + pl.radius + pl.ySpd > gameHeight)
      		pl.yPos = gameHeight - pl.radius;
      	else
      		pl.yPos += pl.ySpd;
      }
			// Left
      if(keyState[65]){
      	if(pl.xPos - pl.radius - pl.xSpd < 0)
      		pl.xPos = pl.radius;
      	else
      		pl.xPos -= pl.xSpd;
      }
			// shoot bullets every 8 milliseconds
	    if(keyState[75]){
	    	shotDelay++;
	    	if(shotDelay > 8){
					shotDelay = 0;

					let data = {
						position: [pl.xPos - 2.5, pl.yPos - pl.radius],
						speed: [0, 12],
						size: [5, 15],
						power: 5
					}
	    		plBulletCount.push(new BH_playerBullet.spawnBullet(data));
	    	}
	    }
    }

		// COLLISIONS
		function checkPlayerCollision(){
			enBulletCount.forEach(function(bullet){
				if(Math.pow((pl.xPos-bullet.xPos),2) + Math.pow((pl.yPos-bullet.yPos),2) <= Math.pow((pl.radius*3+bullet.radius),2)) {
					points.AddPoints(5);
				}
				if(Math.pow((pl.xPos-bullet.xPos),2) + Math.pow((pl.yPos-bullet.yPos),2) <= Math.pow((pl.radius*0.6+bullet.radius),2)) {
					pl.loseLife();
				}
			})
		}
		function checkEnemyHitCollision(){
			enemyOnScreen = enemyOnScreen.filter(function(enemy){
				plBulletCount = plBulletCount.filter(function(bullet){
					// Get vertical/horizontal distance between enemy and player bullet
					let distX = Math.abs(enemy.xPos - (bullet.xPos + (bullet.width/2)));
					let distY = Math.abs(enemy.yPos - (bullet.yPos + (bullet.height/2)));

					// No collision if distance is greater than
		 			// the sum of 50% width of enemy and player bullet
					if (distX > (bullet.width/2 + enemy.radius) || distY > (bullet.height/2 + enemy.radius)){
						return true;
					}

					// Collision detected if distance is less than
		 			// 50% player bullet
			    if (distX <= (bullet.width/2) || distY <= (bullet.height/2)) {
						enemy.takeDmg(bullet.power);
						return false;
					}

					// Check corners of bullet for collision
					let dx = distX-bullet.width/2;
    			let dy = distY-bullet.height/2;

    			if(dx*dx + dy*dy <= (enemy.radius*enemy.radius)){
						enemy.takeDmg(bullet.power);
						return false;
					}
					else
						return true;
				})

				if(enemy.health <= 0){
					points.AddPoints(50);
					return false;
				}
				else
					return true;
			})
		}


		// ENEMIES WORKSPACE
		function wave1(){
			let data = {
				position: [50, -5],
				speed: [0.1, 1.4],
				radius: 10,
				health: 10,
				wave: 1,
				phase: 1
			}
			enemyOnScreen.push(new BH_enemy.spawnEnemy(data));

			data = {
				position: [gameWidth - 360, -5],
				speed: [-0.1, 1.4],
				radius: 10,
				health: 10,
				wave: 1,
				phase: 1
			}
			enemyOnScreen.push(new BH_enemy.spawnEnemy(data));
		}



	  // Animate game
		function updateActors(){
			ctx_BG.clearRect(0,0,gameWidth,gameHeight);
			ctx_PL.clearRect(0,0,gameWidth,gameHeight);
			ctx_EN.clearRect(0,0,gameWidth,gameHeight);

			drawGUI();
			keyChecker();

			drawBullets();
			drawPlayer();

			drawEnemies();
			checkPlayerCollision();
			checkEnemyHitCollision();
		}
		function drawPlayer(){
			//sprite
			ctx_PL.beginPath();
			ctx_PL.fillStyle = "lime";
			ctx_PL.arc(pl.xPos, pl.yPos, pl.radius*3, 0, 2 * Math.PI);
			ctx_PL.fill();
			ctx_PL.closePath();

			//hitbox
			ctx_PL.beginPath();
			ctx_PL.fillStyle = "white";
			ctx_PL.strokeStyle = "red";
			ctx_PL.arc(pl.xPos, pl.yPos, pl.radius, 0, 2 * Math.PI);
			ctx_PL.fill();
			ctx_PL.stroke();
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
			ctx_BG.fillText(""+points.getPoints(),gameWidth-175, 150);
			ctx_BG.fillText("Points",gameWidth-200, 100);

			ctx_BG.fillText(""+pl.getLives(),gameWidth-175, 350);
			ctx_BG.fillText("Lives",gameWidth-200, 300);
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



		function drawEnemies(){
			enemyOnScreen = enemyOnScreen.filter(function(enemy){
				if(!enemy.outOfBounds(gameWidth,gameHeight)){
					//Wave 1 behavior
					if(enemy.wave === 1){
						//phase 1
						if(enemy.phase === 1 && enemy.yPos < 300){
							enemy.yPos += enemy.ySpd;

							enemy.ySpd *= 0.997;
						}
						//phase 2
						else{
							if(enemy.phase !== 2){
								enemy.phase = 2;
								enemy.shotDelay = 20;
							}

							// UPDATE MOVEMENT
							enemy.xPos += enemy.xSpd;
							enemy.yPos -= enemy.ySpd;

							enemy.xSpd *= 1.02;
							enemy.ySpd *= 1.02;

							// SHOOT BULLETS
							enemy.shotDelay++;
							if(enemy.shotDelay > 20){
								enemy.shotDelay = 0;

								let data = {
									position: [enemy.xPos, enemy.yPos],
									target: [pl.xPos - enemy.xPos, pl.yPos - enemy.yPos],
									speed: [10, 10],
									acceleration: 0.95,
									radius: enemy.radius/1.2,
									type: 1
								}
				    		enBulletCount.push(new BH_enemyBullet.spawnBullet(data));
							}
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

		function drawBullets(){
			// Player bullets
			plBulletCount = plBulletCount.filter(function(bullet){
				if(bullet.yPos + bullet.height > 0){
					ctx_PL.beginPath();
					ctx_PL.fillStyle = "blue";
					ctx_PL.fillRect(bullet.xPos, bullet.yPos, bullet.width, bullet.height);
					ctx_PL.closePath();

					bullet.yPos -= bullet.ySpd;
					return true;
				}
				return false;
			});

			// Enemy bullets (circular hitbox, rectangular image)
			enBulletCount = enBulletCount.filter(function(bullet){
				if(!bullet.outOfBounds(gameWidth, gameHeight)){
					let img = new Image();

					// Depending on bullet type, select image and determine speed/direction
					switch(bullet.type){
						case 1:
							img.src = "assets/images/bullethell/shot1.png";

							bullet.xSpd * bullet.accel > bullet.getMinSpd() ? bullet.xSpd *= bullet.accel : bullet.xSpd = bullet.getMinSpd();
							bullet.ySpd * bullet.accel > bullet.getMinSpd() ? bullet.ySpd *= bullet.accel : bullet.ySpd = bullet.getMinSpd();
							break;
					}

					ctx_EN.beginPath();
					ctx_EN.drawImage(img, bullet.xPos - bullet.radius, bullet.yPos - bullet.radius, bullet.radius*2, bullet.radius*2);
					ctx_EN.closePath();

					bullet.xPos += bullet.xDir * bullet.xSpd;
					bullet.yPos += bullet.yDir * bullet.ySpd;
					return true;
				}
				return false;
			});
		}

	/* simple spiral pattern formula for later
	enemy.xPos = 250 + (enemy.xScale * Math.cos(enemy.angle * Math.PI / 180));
	enemy.yPos = 250 + (enemy.yScale * Math.sin(enemy.angle * Math.PI / 180));
	enemy.xPos = 250 + (enemy.xScale * Math.sin(enemy.angle * Math.PI / 180));
	enemy.yPos = 250 + (enemy.yScale * Math.cos(enemy.angle * Math.PI / 180));
	enemy.angle + 3 <= 360 ? enemy.angle += 3 : enemy.angle = 0;
	enemy.xScale += enemy.xSpd;
	enemy.yScale += enemy.ySpd;
	*/
})
