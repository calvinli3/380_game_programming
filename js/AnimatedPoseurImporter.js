// extract data from JSON file and use it to load the sprite
// into the game object with its proper animation states.

// @param game : phaser game object.
// @param sheetPath: path to sprite sheet image.
// @param animPath: path to JSON file.

var currentStateName;
var lastStateName;
var beginningIndex;

function importAPSprite(game, sheetPath, animPath) {
  $.getJSON(animPath, function(json) {
    frames = new Array();
    for (var i = 0; i <= json.frameData.length; i++) {
      //get current frame name
      currentStateName = json.frameData[i].state;
      
      //if at first index, set last statename = current statename
      if (i === 0) {
        lastStateName = currentStateName;
        beginningIndex = 0;
      }
      //check if current frame name was different from last frame name
      if (currentStateName !== lastStateName) {
        //if so, loop from beginning frame to i; set beginning frame = i
        for (var l = beginningIndex; l < i; l++) {
          frames.push(l);
        }
				beginningIndex = i;
        //add the animation frames
        player.animations.add(lastStateName, frames, 10, true);
        frames = [];
      }
      //lastframename = current frame name
      lastStateName = currentStateName;
    }
	});
}
