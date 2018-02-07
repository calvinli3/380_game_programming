var game = new Phaser.Game(1920, 1080, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var playerVelocity = 200;

function preload() {
    game.load.tilemap('tilemap', 'assets/tilemaps/PathfinderTilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('gameTiles', 'assets/images/simples_pimples.png');
    game.load.image('greencup', 'assets/images/greencup.png');
    game.load.image('bluecup', 'assets/images/bluecup.png');
    game.load.image('player', 'assets/images/player.png');
    game.load.image('browndoor', 'assets/images/browndoor.png');
  	game.load.spritesheet('player', 'assets/images/dude.png', 32, 48);
}

function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    map = game.add.tilemap('tilemap');
    //first parameter is the tileset name specified in Tiled, second is the key to the asset
    map.addTilesetImage('simples_pimples', 'gameTiles');

    //create layers
    layer = map.createLayer('backgroundLayer');
    //blocked layer
    layer2 = map.createLayer('blockedLayer');
    //collision
    map.setCollisionBetween(1, 2000, true, 'blockedLayer');
    layer.resizeWorld();

    //create player and focus camera on it
    player = game.add.sprite(game.world.width/2, game.world.height/2, 'player');
	game.physics.arcade.enable(player);
    game.camera.follow(player);
    game.input.onDown.add(movePlayer, this);

    //add input for M and N to inc/dec velocity
    keyM = game.input.keyboard.addKey(Phaser.Keyboard.M);
	keyN = game.input.keyboard.addKey(Phaser.Keyboard.N);
}

function movePlayer() {

    game.physics.arcade.moveToPointer(player, playerVelocity);

}

function update() {
    game.physics.arcade.collide(player, layer2);
    // for sprite rotation: use angular velocity
    // player.angle = 0;

    if (keyM.isDown) {
        playerVelocity -= 50;
        console.log(playerVelocity);
    } if (keyN.isDown) {
        playerVelocity += 50;
        console.log(playerVelocity);
    }
    
}