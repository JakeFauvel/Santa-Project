
var CHIMNEY_SPAWN_HEIGHT_BASE = 500;
var CHIMNEY_SPAWN_HEIGHT_VARIATION = 250;
var CHIMNEY_SPAWN_POSITION = 995;
var CHIMNEY_SPAWN_TIMER = 2000;
var CHIMNEY_VELOCITY_X = 150;

var game = undefined;
var santaCollionGroup = undefined;
var chimneyCollisionGroup = undefined;
var chimneys = [];

var preload = function(inputGame) {
  game = inputGame;
  game.load.image('chimney0', 'resources/img/Chimney0.png');
};

var registerCollionGroups = function(_santaCollionGroup, _chimneyCollisionGroup) {
  santaCollionGroup = _santaCollionGroup;
  chimneyCollisionGroup = _chimneyCollisionGroup;
};

var create = function() {
  //Chimney spawn timer
  game.time.events.loop(CHIMNEY_SPAWN_TIMER, spawnChimney, this);
};

var update = function() {
  // Loop over all chimneys and fix there speed
  for (var i = 0; i < chimneys.length; i++) {
    var chimney = chimneys[i];
    chimney.body.setZeroVelocity();
    chimney.body.moveLeft(CHIMNEY_VELOCITY_X);
  }
};

function spawnChimney() {
  var FINALHEIGHT = CHIMNEY_SPAWN_HEIGHT_BASE + (Math.random() * CHIMNEY_SPAWN_HEIGHT_VARIATION);
  var chimneySprite = game.add.sprite(CHIMNEY_SPAWN_POSITION, FINALHEIGHT, 'chimney0');

  game.physics.p2.enable(chimneySprite);
  chimneySprite.body.fixedRotation = true;
  chimneySprite.body.setCollisionGroup(chimneyCollisionGroup);
  chimneySprite.body.collides(santaCollionGroup);
  chimneySprite.body.collideWorldBounds = false;
  chimneySprite.body.dynamic = false;
  chimneys.push(chimneySprite);
}

// Things exported for use in other files.
// Formate is externalName: internalName,
module.exports = {
  registerCollionGroups: registerCollionGroups,
  preload: preload,
  create: create,
  update: update
};
