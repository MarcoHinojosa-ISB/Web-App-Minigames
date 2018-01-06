"use strict"

// BULLET HELL POINT SERVICE
app.service("BH_points", function(){
	function initialPoints(){
		let current = 0;

		this.AddPoints = function(points){
			current += points;
		},
		this.getPoints = function(){
			return current;
		},
		this.getPointsPadded = function(){
			let str = String(current);

			while(str.length < 9){
				str = "0"+str;
			}
			return str;
		}
	};
	return {
		initialPoints: initialPoints
	};
})
// PLAYER SERVICE
.service("BH_player", function(){
	function spawnPlayer(data){
		// Player stats
		const	maxHealth = data.health;

		this.xPos = data.position[0], this.yPos = data.position[1],
		this.xSpd = data.speed[0], this.ySpd = data.speed[1],
		this.health = data.health,
		this.shotDelay = data.shotDelay,
		this.radius = data.radius,

		this.getMaxHealth = function(){
			return maxHealth;
		}
		this.takeDmg = function(dmg){
			this.health - dmg >= 0 ? this.health -= dmg : this.health = 0;
		}
		this.moveUp = function(){
			if(this.yPos - this.radius - this.ySpd < 0)
				this.yPos = this.radius;
			else
				this.yPos -= this.ySpd;
		}
		this.moveRight = function(gameWidth){
			if(this.xPos + this.radius + this.xSpd > gameWidth - 300)
					this.xPos = gameWidth - 300 - this.radius;
			else
				this.xPos += this.xSpd;
		}
		this.moveDown = function(gameHeight){
			if(this.yPos + this.radius + this.ySpd > gameHeight)
				this.yPos = gameHeight - this.radius;
			else
				this.yPos += this.ySpd;
		}
		this.moveLeft = function(){
			if(this.xPos - this.radius - this.xSpd < 0)
				this.xPos = this.radius;
			else
				this.xPos -= this.xSpd;
		}
	};

	return {
		spawnPlayer: spawnPlayer
	};
})
// ENEMY SERVICE
.service("BH_enemy", function(){
	function spawnEnemy(data){
		// enemy stats
		const	maxHealth = data.health;

		this.xPos = data.position[0], this.yPos = data.position[1],
		this.xSpd = data.speed[0], this.ySpd = data.speed[1],
		this.health = data.health,
		this.shotDelay = data.shotDelay,
		this.radius = data.radius,
		this.phase = 0,
		this.angle = 0,
		this.deadFlag = false;

		// take damage
		this.takeDmg = function(dmg){
			this.health - dmg >= 0 ? this.health -= dmg : this.health = 0;
		}
		// Get Lives
		this.getMaxHealth = function(){
			return maxHealth;
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
// ENEMY BULLET SERVICE
.service("BH_enemyBullet", function(){
	function spawnBullet(data){
		//stats
		const maxSpd = 1.0;
		const minSpd = 0.01;

		this.xPos = data.position[0], this.yPos = data.position[1],
		this.xSpd = data.speed[0], this.ySpd = data.speed[1],
		this.accel = data.acceleration,
		this.radius = data.radius,
		this.behavior = data.behavior,

		// fix direction for proper movement
		this.newTargetCoords = function(target){
			this.magnitude = Math.sqrt(target[0]*target[0] + target[1]*target[1])
			this.xDir = target[0]/this.magnitude, this.yDir = target[1]/this.magnitude
		},
		this.newTargetCoords(data.target),

		// get speed limits
		this.getMaxSpd = function(){
			return maxSpd;
		},
		this.getMinSpd = function(){
			return minSpd;
		},
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
		}
	};
	return {
		spawnBullet: spawnBullet
	};
})
