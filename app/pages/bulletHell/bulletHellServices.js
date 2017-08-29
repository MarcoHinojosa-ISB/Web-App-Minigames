"use strict"

// PLAYER SERVICE
app.service("BH_player", function(){
	let	lives = 3;
	let	lifePieces = 0;

	function spawnPlayer(data){
		// Player stats
		this.xPos = data.position[0], this.yPos = data.position[1],
		this.xSpd = data.speed[0], this.ySpd = data.speed[1],
		this.radius = data.radius,

		// Get Lives/Life pieces
		this.getLives = function(){
			return lives;
		},
		this.getLifePieces = function(){
			return lifePieces;
		},
		// increment/decrement a life
		this.gainLife = function(){
			lives++;
		},
		this.loseLife = function(){
			lives--;
		},
		// increment life pieces, if 3 collected then reset to 0 and increment total lives
		this.gainLifePiece = function(){
			lifePieces++;

			if(lifePieces === 3){
				lifePieces = 0;
				lives++;
			}
		};
	};

	return {
		spawnPlayer: spawnPlayer
	};
})
// PLAYER BULLET SERVICE
.service("BH_playerBullet", function(){
	function spawnBullet(data){
		this.xPos = data.position[0], this.yPos = data.position[1],
		this.xSpd = data.speed[0], this.ySpd = data.speed[1],
		this.width = data.size[0], this.height = data.size[1],
		this.power = data.power
	};
	return {
		spawnBullet: spawnBullet
	};
})
.service("BH_points", function(){
	let total = 0;

	return {
		AddPoints: function(points){
			total += points;
		},
		getPoints: function(points){
			return total;
		}
	};
})
// ENEMY BULLET SERVICE
.service("BH_enemyBullet", function(){
	let maxSpd = 10.0;
	let minSpd = 1.0;

	function spawnBullet(data){
		//stats
		this.xPos = data.position[0], this.yPos = data.position[1],
		this.xPosTarget = data.target[0], this.yPosTarget = data.target[1],
		this.xSpd = data.speed[0], this.ySpd = data.speed[1],
		this.accel = data.acceleration,
		this.radius = data.radius,
		this.type = data.type,

		// fix direction for proper speed
		this.magnitude = Math.sqrt(this.xPosTarget*this.xPosTarget + this.yPosTarget*this.yPosTarget),
		this.xDir = this.xPosTarget/this.magnitude, this.yDir = this.yPosTarget/this.magnitude,

		this.outOfBounds = function(gameWidth, gameHeight){
			if(this.yPos - this.radius > gameHeight - 0 + this.radius)
				return true;
			else if(this.yPos + this.radius < this.radius)
				return true;
			else if(this.xPos - this.radius > gameWidth - 300 + this.radius)
				return true;
			else if(this.xPos + this.radius < -this.radius)
				return true;
			else
				return false;
		},

		this.getMaxSpd = function(){
			return maxSpd;
		},
		this.getMinSpd = function(){
			return minSpd;
		}
	};
	return {
		spawnBullet: spawnBullet
	};
})
// ENEMY SERVICE
.service("BH_enemy", function(){

	function spawnEnemy(data){
		// enemy stats
		this.xPos = data.position[0], this.yPos = data.position[1],
		this.xSpd = data.speed[0], this.ySpd = data.speed[1],
		this.radius = data.radius,
		this.health = data.health,
		this.wave = data.wave,
		this.phase = 1,

		// take damage
		this.takeDmg = function(dmg){
			this.health - dmg >= 0 ? this.health -= dmg : this.health = 0;
		}

		this.outOfBounds = function(gameWidth, gameHeight){
			if(this.yPos - this.radius > gameHeight - 0 + 10)
				return true;
			else if(this.yPos + this.radius < -10)
				return true;
			else if(this.xPos - this.radius > gameWidth - 300 + 10)
				return true;
			else if(this.xPos + this.radius < -10)
				return true;
			else
				return false;
		}
	};

	return {
		spawnEnemy: spawnEnemy
	};
})
