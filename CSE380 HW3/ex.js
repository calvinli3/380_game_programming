function create() {
    map = game.add.tilemap("level1");

    map.addTilesetImage('artTiles', 'gaemTiles');

    //create layers
    layer = map.createLayer('1');
    //blocked layer
    layer2 = map.createLayer('2');

    //collision
    map.setCollisionBetween(1,2000,true,'2');


    layer.resizeWorld();

}

// for sprite rotation: use angular velocity


//camera follow
game.camera.follow(sprite);