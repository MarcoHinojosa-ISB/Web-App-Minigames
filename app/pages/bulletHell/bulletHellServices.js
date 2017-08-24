// PLAYER SERVICE
app.service("BH_player", function(){
	var	lives = 3;
	var	lifePieces = 0;
	var size;

	function spawnPlayer(data){
		// Player stats
		this.xPos = data.position[0], this.yPos = data.position[1],
		this.xSpd = data.speed[0], this.ySpd = data.speed[1],
		this.bulletCount = [],
		size = data.size;

		// Get Lives/Life pieces
		this.getLives = function(){
			return lives;
		},
		this.getLifePieces = function(){
			return lifePieces;
		},
		// Get player width/height
		this.getWidth = function(){
			return size[0];
		},
		this.getHeight = function(){
			return size[1];
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
	var size;

	function spawnBullet(data){
		this.xPos = data.position[0], this.yPos = data.position[1],
		this.xSpd = data.speed[0], this.ySpd = data.speed[1],
		size = data.size,
		this.power = data.power,

		this.getWidth = function(){
			return size[0];
		},
		this.getHeight = function(){
			return size[1];
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
		this.xScale = 5,
		this.yScale = 5,
		this.angle = 0,

		// take damage
		this.takeDmg = function(dmg){
			this.health - dmg >= 0 ? this.health -= dmg : this.health = 0;
		}

		this.outOfBounds = function(gameWidth, gameHeight){
			if(this.yPos - this.radius > gameHeight)
				return true;
			else if(this.yPos + this.radius < -10)
				return true;
			else if(this.xPos - this.radius > gameWidth - 300)
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
