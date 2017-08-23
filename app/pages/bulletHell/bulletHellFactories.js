app.service("BH_player", function(){
	var	lives = 3;
	var	lifePieces = 0;
	var shotType;

	const width = 20;
	const height = 20;

	function spawnPlayer(pos, spd, type){
		// Player stats
		this.xPos = pos[0], this.yPos = pos[1],
		this.xSpd = spd[0], this.ySpd = spd[1],
		shotType = type,
		// Get Lives/Life pieces
		this.getLives = function(){
			return lives;
		},
		this.getLifePieces = function(){
			return lifePieces;
		},
		// Get player width/height
		this.getWidth = function(){
			return width;
		},
		this.getHeight = function(){
			return height;
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
				this.gainLife();
			}
		},
		// reset player settings
		this.reset = function(){
			this.xPos = pos[0], this.yPos = pos[1],
			this.xSpd = spd[0], this.ySpd = spd[1],
			lives = 3;
			lifePieces = 0;
			shotType = type;
		}
	};

	return {
		spawnPlayer: spawnPlayer
	};
})
.service("BH_playerBullet", function(){
	var power;
	var width;
	var height;

	function spawnBullet(pos, spd, size, pow){
		this.xPos = pos[0], this.yPos = pos[1],
		this.xSpd = spd[0], this.ySpd = spd[1],
		width = size[0], height = size[1],
		power = pow,
		this.getWidth = function(){
			return width;
		},
		this.getHeight = function(){
			return height;
		},
		this.getPower = function(){
			return power;
		}
	};
	return {
		spawnBullet: spawnBullet
	};
})
.factory("BH_enemy", function(){
	var hp;
	var width;
	var height;

	function spawnEnemy(pos, spd, initHP){
		// enemy stats
		this.xPos = pos[0], this.yPos = pos[1],
		this.xSpd = spd[0], this.ySpd = spd[1],
		hp = initHP,
		// get enemy HP
		this.getHP = function(){
			return hp;
		}
		// take damage
		this.takeDmg = function(dmg){
			hp - dmg >= 0 ? hp -= dmg : hp = 0;	
		}
	};

	return {
		spawnEnemy: spawnEnemy
	};
})