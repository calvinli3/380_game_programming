var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var platforms;
var baddies;
var stars;
var graphics;
var button;
var win_label;
var timer;
var hit_timer;
var player_alive = true;
var game_running = true;
var health = 5;
var score = 0;
var scoreText;

function preload() {
	game.load.image('sky', 'assets/sky.png');
	game.load.image('ground', 'assets/platform.png');
	game.load.image('star', 'assets/star.png');
	game.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	game.load.spritesheet('baddie_sprite', 'assets/baddie.png', 32, 32);
	game.load.spritesheet('death', 'assets/death.png', 32, 32);
}

function create() {
	// STATIC SET-UP
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.add.sprite(0, 0, 'sky');
	scoreText = game.add.text(16, 16, 'Score: 0', { fontsize: '32px', fill: '#000' });
	// PLATFORMS
	platforms = game.add.group();
	platforms.enableBody = true;
	var ground = platforms.create(0, game.world.height - 64, 'ground');
	ground.scale.setTo(2, 2);
	ground.body.immovable = true;
	// LEDGES
	var ledge = platforms.create(400, 400, 'ground');
	ledge.body.immovable = true;
	var ledge = platforms.create(-150, 250, 'ground');
	ledge.body.immovable = true;
	// PLAYER
	player = game.add.sprite(32, game.world.height - 150, 'dude');
	game.physics.arcade.enable(player);
	player.body.bounce.y = 0.1;
	player.body.gravity.y = 350;
	player.body.collideWorldBounds = true;
	player.animations.add('left', [0, 1, 2, 3], 10, true);
	player.animations.add('right', [5, 6, 7, 8], 10, true);
	player.animations.add('death', [9, 10], 5, true);
	// PLAYER HEALTH BAR
	player.healthbar1 = game.add.graphics(0, 0);
	player.healthbar2 = game.add.graphics(0, 0);
	player.healthbar3 = game.add.graphics(0, 0);
	player.healthbar4 = game.add.graphics(0, 0);
	player.healthbar5 = game.add.graphics(0, 0);
	player.healthbar1.beginFill(0x00ff00);
	player.healthbar2.beginFill(0x00ff00);
	player.healthbar3.beginFill(0x00ff00);
	player.healthbar4.beginFill(0x00ff00);
	player.healthbar5.beginFill(0x00ff00);
	player.healthbar1.drawRect(0, 50, 40, 20);
	player.healthbar2.drawRect(40, 50, 80, 20);
	player.healthbar3.drawRect(80, 50, 120, 20);
	player.healthbar4.drawRect(120, 50, 160, 20);
	player.healthbar5.drawRect(160, 50, 200, 20);
	player.healthbar1.endFill();
	player.healthbar2.endFill();
	player.healthbar3.endFill();
	player.healthbar4.endFill();
	player.healthbar5.endFill();
	// STARS
	stars = game.add.group();
	stars.enableBody = true;
	for (var i = 0; i < 12; i++) {
		var star = stars.create(i * 70, 0, 'star');
		star.body.gravity.y = 60;
		star.body.bounce.y = 0.7 + Math.random() * 0.2;
	}
	// BADDIES
	baddies = game.add.group();
	baddies.enableBody = true;
	for (var k = 0; k < 5; k++) {
		baddie = game.add.sprite(game.world.width/5*k, 0, 'baddie_sprite');
		game.physics.arcade.enable(baddie);
		baddie.body.bounce.y = 0.3;
		baddie.body.gravity.y = 300;
		baddie.body.bounce.setTo(1,1);
		baddie.body.velocity.x = 100+Math.random() * 20;
		baddie.body.collideWorldBounds = true;
		baddie.animations.add('left', [0, 1], 10, true);
		baddie.animations.add('right', [2, 3], 10, true);
		baddies.add(baddie);
	}
}

function update() {
	// SET-UP COLLISIONS / CONTROLS
	var hitPlatform = game.physics.arcade.collide(player, platforms);
	cursors = game.input.keyboard.createCursorKeys();
	// PLAYER
	player.body.velocity.x = 0;
	//move if you have health or score is less than 120
	if (health >= 1 & score < 120) {
	 	if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
	 		player.body.velocity.y = -350;
	 	} if (cursors.left.isDown) {
			player.body.velocity.x = -150;
			player.animations.play('left');
		} else if (cursors.right.isDown) {
			player.body.velocity.x = 150;
			player.animations.play('right');
		} else {
			player.animations.stop();
			player.frame = 4;
		}
	} else if (player_alive & score < 120) {
		player.animations.play('death');
		if (player.animations.currentAnim.frame == 10) {
			player_alive = false;
			win_overlay(false);
		}
 	}
	// STARS
	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.overlap(player, stars, collectStar, null, this);
	function collectStar (player, star) {
		star.kill();
		score += 10;
		scoreText.text = 'Score: ' + score;
		if (score === 120) {
			win_overlay(true);
			game_running = false;
		}
	}
	function win_overlay(win_status) {
		player.animations.stop();
		var overlay = game.add.graphics(0, 0);
		overlay.beginFill(0x740f0f);
		overlay.drawRect(0, 0, game.world.width, game.world.height/3);
		overlay.endFill();
		button = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);
    button.onInputOver.add(over, this);
    button.onInputOut.add(out, this);
    button.onInputUp.add(up, this);
		if (win_status === true) {
			win_label = game.add.text(game.world.centerX/1.5, 100, 'You win! Play again?', { font: '24px Arial', fill: '#fff' });
		}
		else {
			win_label = game.add.text(game.world.centerX/1.5, 100, 'You lose. Play again?', { font: '24px Arial', fill: '#fff' });
		}
	}
	// BADDIES
	baddies.forEach(randomMovement, this, true);
	function randomMovement(baddie) {
		if (baddie.body.velocity.x < 0) {
			baddie.animations.play('left');
		} else {
			baddie.animations.play('right');
		}
		if ((game.world.width - baddie.world.x) < 5) {
			baddie.body.position.x += 5;
			baddie.body.velocity.x *= -1;
		}
	}
	game.physics.arcade.collide(baddies, platforms);
	game.physics.arcade.collide(player, baddies, hitBaddie, null, this);
  function hitBaddie (player, baddie) {
			if (health === 5) {
				player.healthbar5.clear();
				health--;
				//baddie.kill();
			} else if (health === 4) {
				player.healthbar4.clear();
				health--;
				//baddie.kill();
			} else if (health === 3) {
				player.healthbar3.clear();
				health--;
				//baddie.kill();
			} else if (health === 2) {
				player.healthbar2.clear();
				health--;
				//baddie.kill();
			} else if (health === 1) {
				player.healthbar1.clear();
				health--;
				//baddie.kill();
			}
		}
	function actionOnClick () {
		location.reload();
	}
	function up(){console.log('button up', arguments);}
	function over(){console.log('button over');}
	function out(){console.log('button out');}
}
