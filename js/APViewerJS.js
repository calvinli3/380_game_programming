var game = new Phaser.Game(1200, 750, Phaser.AUTO, '', { preload: preload, create: create, update: update });
												// should be 750
var platforms;
var graphics;
var keyLEFT;
var keyRIGHT;
var keyUP;
var keyZ;
var keyX;
var keyD;
var keyQ;
var keyW;
var playDeathAnim = false;

function preload() {
	game.load.image('darksky', 'assets/darksky.png');
	game.load.image('platform', 'assets/darkplatform.png');
	game.load.spritesheet('villain', 'assets/Villain_spritesheet.png', 64, 96);
}

function create() {
	// STATIC SET-UP
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.add.sprite(0, 0, 'darksky');
	// PLATFORMS
	platforms = game.add.group();
	platforms.enableBody = true;
	var ground = platforms.create(0, game.world.height - 50, 'platform');
	ground.scale.setTo(2, 2);
	ground.body.immovable = true;
	// LEDGES
	var ledge = platforms.create(700, 400, 'platform');
	ledge.body.immovable = true;
	var ledge = platforms.create(-150, 500, 'platform');
	ledge.body.immovable = true;
	// PLAYER
	player = game.add.sprite(32, game.world.height - 150, 'villain');
	game.physics.arcade.enable(player);
	player.body.bounce.y = 0.1;
	player.body.gravity.y = 300;
	player.body.collideWorldBounds = true;
	keyLEFT = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	// LEFT / RIGHT : WALKING_LEFT / WALKING_RIGHT
	keyRIGHT = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	// SPACE: if press space WHILE walking left or right, jump and do one iteration of jumping animation. then go back to walking or idle.
	keyUP = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	// Z / X : ATTACKING_LEFT/ ATTACKING_RIGHT. if held down, keep playing.
	keyZ = game.input.keyboard.addKey(Phaser.Keyboard.Z);
	keyX = game.input.keyboard.addKey(Phaser.Keyboard.X);
	// D: Play dying then return to idle
	keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
	// Q / W: DAMAGED_LEFT / DAMAGED_RIGHT.
	keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
	keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);

	// IMPORT SPRITE ANIMATIONS FROM JSON
	importAPSprite(game, 'assets/Villain_spritesheet.png', 'assets/Villain_json.json');
}

function update() {
	// SET-UP COLLISIONS / CONTROLS
	var hitPlatform = game.physics.arcade.collide(player, platforms);
	player.body.velocity.x = 0;
	
	if (keyUP.isDown && player.body.touching.down && hitPlatform) {
		player.body.velocity.y = -400;
	}
	if (keyUP.isDown) {
		// if left is down
		if (keyLEFT.isDown) {
		player.body.velocity.x = -200;
		player.animations.play('JUMPING_LEFT'); 
		}
		// if right is down
		if (keyRIGHT.isDown) {
		player.body.velocity.x = 200;
		player.animations.play('JUMPING_RIGHT');
		}
	} else if (keyLEFT.isDown) {
		player.body.velocity.x = -200;
		player.animations.play('WALKING_LEFT');
	} else if (keyRIGHT.isDown) {
		player.body.velocity.x = 200;
		player.animations.play('WALKING_RIGHT');
	} else if (keyZ.isDown) {
		player.animations.play('ATTACKING_LEFT');
	} else if (keyX.isDown) {
		player.animations.play('ATTACKING_RIGHT');
	} else if (keyD.isDown) {
		player.animations.play('DYING');
	} else if (keyQ.isDown) {
		player.animations.play('DAMAGED_LEFT');
	} else if (keyW.isDown) {
		player.animations.play('DAMAGED_RIGHT');
	}
	else {
		player.animations.play('IDLE');
	}
}