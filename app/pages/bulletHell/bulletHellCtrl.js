"use strict"

app.controller('bulletHellCtrl', function($scope, $http, BH_player, BH_playerBullet, BH_enemy, BH_enemyBullet, BH_points){
		let c_BG = $("#bh-screen")[0];
		let c_PL = $("#bh-player")[0];
		let c_EN = $("#bh-enemy")[0];
		let ctx_BG = c_BG.getContext("2d");
		let ctx_PL = c_PL.getContext("2d");
		let ctx_EN = c_EN.getContext("2d");

		// Bullet count
		let plBulletCount = [];
		let enBulletCount = [];

		// player/enemy objects
		let pl = null;
		let en = null;

		//points
		let points = BH_points;

		//images
		let enBulletImg1 = new Image();
		enBulletImg1.src = "assets/images/bullethell/shot1.png";

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

			// Create player
			pl = new BH_player.spawnPlayer({
				position: [50, 400],
				speed: [1, 1],
				health: 100,
				radius: 5,
				shotDelay: 10
			});

			// Create Enemy
			en = new BH_enemy.spawnEnemy({
				position: [(gameWidth-300)/2 - 10, -5],
				speed: [0.0, 1.0],
				health: 500,
				radius: 20,
				shotDelay: 0
			});

			// Animate game
			setInterval(updateActors, 2);
		}

		// Keys/Controls
		let keyState = {};
		$scope.keyDown = function(e){
			keyState[e.keyCode || e.which] = true;
		}
		$scope.keyUp = function(e){
			if(e.which === 75)
				pl.shotDelay = 10;
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
	    	pl.shotDelay++;
	    	if(pl.shotDelay > 10){
					pl.shotDelay = 0;

					let data = new BH_playerBullet.spawnBullet({
						position: [pl.xPos - 7.5, pl.yPos - pl.radius],
						speed: [0, 12],
						size: [15, 30],
						power: 5
					})
	    		plBulletCount.push(data);
	    	}
	    }
    }

		// ==================COLLISIONS
		function checkPlayerCollision(){
			enBulletCount = enBulletCount.filter(function(bullet){
				let distX = Math.abs(pl.xPos - bullet.xPos);
				let distY = Math.abs(pl.yPos - bullet.yPos);

				// Graze collisions
				if(distX*distX + distY*distY <= Math.pow((pl.radius*3+bullet.radius),2)) {
					points.AddPoints(5);
				}
				// Hitbox collisions
				if(distX*distX + distY*distY <= Math.pow((pl.radius*0.6+bullet.radius),2)) {
					pl.takeDmg(5);
					return false;
				}
				return true;
			})
		}
		function checkEnemyHitCollision(){
			plBulletCount = plBulletCount.filter(function(bullet){
				// Get vertical/horizontal distance between the centers of enemy and player bullet
				let distX = Math.abs(en.xPos - (bullet.xPos + (bullet.width/2)));
				let distY = Math.abs(en.yPos - (bullet.yPos + (bullet.height/2)));

				// No collision if distance > 50% width of enemy + player bullet
				if (distX > (bullet.width/2 + en.radius) || distY > (bullet.height/2 + en.radius)){
					return true;
				}

				// Collision detected if distance < 50% player bullet
		    if (distX <= (bullet.width/2) || distY <= (bullet.height/2)) {
					// No points if enemy transitioning to next phase
					if(!en.deadFlag){
						en.takeDmg(bullet.power);
						points.AddPoints(50);
					}
					return false;
				}

				// Check corners of bullet for collision
				let dx = distX-bullet.width/2;
  			let dy = distY-bullet.height/2;

  			if(dx*dx + dy*dy <= (en.radius*en.radius)){
					// No points if enemy transitioning to next phase
					if(!en.deadFlag){
						en.takeDmg(bullet.power);
						points.AddPoints(50);
					}
					return false;
				}
				else
					return true;
			})

			// Check if enemy health depleted
			if(en.health <= 0 && !en.deadFlag){
				en.deadFlag = true;
				points.AddPoints(500000);

				//transition to next attack phase
				switch(en.phase){
					case 1:
						setTimeout(function(){
							en.deadFlag = false;
							en.health = en.getMaxHealth();
							en.phase++;
						},1000)
						break;
					case 2:
						break;
				}
			}
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
			checkPlayerCollision();

			drawEnemy();
			checkEnemyHitCollision();
		}
		function drawGUI(){
			//==Left Side
			ctx_BG.beginPath();
			ctx_BG.rect(0,0,gameWidth-300,gameHeight);
			ctx_BG.lineWidth=1;
			ctx_BG.stroke();
			ctx_BG.closePath();

			//==Right Side
			ctx_BG.beginPath();
			ctx_BG.rect(gameWidth-300,0,300,gameHeight);
			ctx_BG.lineWidth=1;
			ctx_BG.stroke();
			ctx_BG.closePath();

			//Text
			ctx_BG.beginPath();
			ctx_BG.font = "20px sans-serif";
			ctx_BG.fillStyle = "#000";
			ctx_BG.fillText("Points",gameWidth-290, 25);
			ctx_BG.textAlign = "right";
			ctx_BG.fillText(""+points.getPointsPadded(),gameWidth-175, 45);
			ctx_BG.textAlign = "left";
			ctx_BG.fillText("Health",gameWidth-290, 65);
			ctx_BG.closePath();

			//health bar
			ctx_BG.beginPath();
			ctx_BG.fillStyle = "lime";
			ctx_BG.strokeStyle = "#000000";
			ctx_BG.rect(gameWidth-270, 80, (pl.health/pl.getMaxHealth())*100, 20);
			ctx_BG.fill();
			ctx_BG.rect(gameWidth-270, 80, 100, 20);
			ctx_BG.stroke();
			ctx_BG.closePath();
		}
		function drawPlayer(){
			//sprite/graze area
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

		function drawEnemy(){
			if(!en.deadFlag){
				switch(en.phase){
					//Phase 0
					case 0:
						//Enemy Enters
						en.yPos += en.ySpd;
						en.ySpd *= 0.985;
						if(en.ySpd <= 0.05)
							en.phase++;
						break;
					//Phase 1
					case 1:
						en.shotDelay++;
						if(en.shotDelay % 10 === 0){
							let data = new BH_enemyBullet.spawnBullet({
								position: [en.xPos, en.yPos],
								target: [Math.cos((en.angle+45)* (Math.PI / 180))*2, Math.sin((en.angle+45 ) * (Math.PI / 180)) * 2],//[pl.xPos - en.xPos, pl.yPos - en.yPos],
								speed: [0.1, 0.1],
								acceleration: 1.01,
								radius: 5,
								behavior: 2
							})
			    		enBulletCount.push(data);
							data = new BH_enemyBullet.spawnBullet({
								position: [en.xPos, en.yPos],
								target: [Math.cos(((90-en.angle)+45) * (Math.PI/180))*2 , Math.sin(((90-en.angle)+45) * (Math.PI / 180)) * 2],//[pl.xPos - en.xPos, pl.yPos - en.yPos],
								speed: [0.1, 0.1],
								acceleration: 1.01,
								radius: 5,
								behavior: 2
							})
							enBulletCount.push(data);
						}
						if(en.shotDelay % 200 == 0){
							en.shotDelay = 0;

							let data = new BH_enemyBullet.spawnBullet({
								position: [en.xPos, en.yPos],
								target: [pl.xPos - en.xPos, pl.yPos - en.yPos],//[pl.xPos - en.xPos, pl.yPos - en.yPos],
								speed: [0.5, 0.5],
								acceleration: 1.0,
							 	radius: 10,
							 	behavior: 1
							})
							enBulletCount.push(data);
						}

						en.angle += Math.random()*5;
						if(en.angle >= 90)
							en.angle -= 90;
						break;
					// Phase 2
					case 2:
						en.shotDelay++;
						if(en.shotDelay % 5 === 0){
							let data = new BH_enemyBullet.spawnBullet({
								position: [en.xPos, en.yPos],
								target: [Math.cos(55 * (Math.PI / 180))*2, Math.sin(55 * (Math.PI / 180)) * 2],//[pl.xPos - en.xPos, pl.yPos - en.yPos],
								speed: [3, 3],
								acceleration: 1.05,
								radius: 7,
								behavior: 1
							});
							enBulletCount.push(data);
							data = new BH_enemyBullet.spawnBullet({
								position: [en.xPos, en.yPos],
								target: [Math.cos(125 * (Math.PI / 180))*2, Math.sin(125 * (Math.PI / 180)) * 2],//[pl.xPos - en.xPos, pl.yPos - en.yPos],
								speed: [3, 3],
								acceleration: 1.05,
								radius: 7,
								behavior: 1
							});
							enBulletCount.push(data);
						}
						if(en.shotDelay % 10 === 0 && en.shotDelay < 500){
							let data = new BH_enemyBullet.spawnBullet({
								position: [en.xPos, en.yPos],
								target: [Math.cos(en.angle * (Math.PI / 180))*2, Math.sin(en.angle * (Math.PI / 180)) * 2],//[pl.xPos - en.xPos, pl.yPos - en.yPos],
								speed: [1.5, 1.5],
								acceleration: 1.05,
								radius: 7,
								behavior: 3
							})
							enBulletCount.push(data);
							data = new BH_enemyBullet.spawnBullet({
								position: [en.xPos, en.yPos],
								target: [Math.cos((360-en.angle) * (Math.PI/180))*2 , Math.sin((360-en.angle) * (Math.PI / 180)) * 2],//[pl.xPos - en.xPos, pl.yPos - en.yPos],
								speed: [3, 3],
								acceleration: 1.05,
								radius: 7,
								behavior: 3
							})
							enBulletCount.push(data);

							en.angle += 45;
							if(en.angle >= 360)
								en.angle = 0;
						}
						else if(en.shotDelay > 600){
							en.shotDelay = 0;
							en.angle = 0;
						}
						break;
					default:
						break;
				}
			}

			ctx_EN.beginPath();
			ctx_EN.fillStyle = "gray";
			ctx_EN.arc(en.xPos, en.yPos, en.radius, 0, 2 * Math.PI);
			ctx_EN.fill();
			ctx_EN.closePath();
		}

		function drawBullets(){
			// Player bullets
			plBulletCount = plBulletCount.filter(function(bullet){
				if(bullet.yPos + bullet.height > 0){
					bullet.yPos -= bullet.ySpd;

					ctx_PL.beginPath();
					ctx_PL.fillStyle = "blue";
					ctx_PL.fillRect(bullet.xPos, bullet.yPos, bullet.width, bullet.height);
					ctx_PL.closePath();
					return true;
				}
				return false;
			});

			// Enemy bullets
			enBulletCount = enBulletCount.filter(function(bullet){
				if(!bullet.outOfBounds(gameWidth, gameHeight)){
					// Depending on bullet behavior, determine next movements
					switch(bullet.behavior){
						case 1: // No Acceleration
							bullet.xPos += bullet.xDir * bullet.xSpd;
							bullet.yPos += bullet.yDir * bullet.ySpd;
							break;
						case 2: // Straight Accelerating
							bullet.xSpd * bullet.accel < bullet.getMaxSpd() ? bullet.xSpd *= bullet.accel : bullet.xSpd = bullet.getMaxSpd();
							bullet.ySpd * bullet.accel < bullet.getMaxSpd() ? bullet.ySpd *= bullet.accel : bullet.ySpd = bullet.getMaxSpd();

							bullet.xPos += bullet.xDir * bullet.xSpd;
							bullet.yPos += bullet.yDir * bullet.ySpd;
							break;
						case 3: // Stop for a bit, then Accelerate to player
							bullet.xSpd / bullet.accel > bullet.getMinSpd() ? bullet.xSpd /= bullet.accel : bullet.xSpd = bullet.getMinSpd();
							bullet.ySpd / bullet.accel > bullet.getMinSpd() ? bullet.ySpd /= bullet.accel : bullet.ySpd = bullet.getMinSpd();

							bullet.xPos += bullet.xDir * bullet.xSpd;
							bullet.yPos += bullet.yDir * bullet.ySpd;

							if(bullet.xSpd === bullet.getMinSpd() || bullet.ySpd === bullet.getMinSpd()){
								bullet.newTarget([pl.xPos - bullet.xPos, pl.yPos - bullet.yPos]);
								bullet.behavior = 2;
							}
							break;
					}

					ctx_EN.beginPath();
					ctx_EN.drawImage(enBulletImg1, bullet.xPos - bullet.radius, bullet.yPos - bullet.radius, bullet.radius*2, bullet.radius*2);
					ctx_EN.closePath();
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
