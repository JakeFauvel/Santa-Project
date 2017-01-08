var CHIMNEY_SPAWN_HEIGHT_BASE = 555;
var CHIMNEY_SPAWN_HEIGHT_VARIATION = 200;
var CHIMNEY_SPAWN_POSITION = 1035;
var CHIMNEY_SPAWN_TIMER = 2000;
var CHIMNEY_VELOCITY_X = 150;

var GameState = require("./gameState.js");
var game = undefined;
var santaCollionGroup = undefined;
var chimneyCollisionGroup = undefined;
var chimneys = [];
var layer = undefined;

var preload = function(inputGame) {
  game = inputGame;
  game.load.image('chimney0','resources/img/Chimney0.png');
};

var registerCollionGroups = function(_santaCollionGroup, _chimneyCollisionGroup) {
  santaCollionGroup = _santaCollionGroup;
  chimneyCollisionGroup = _chimneyCollisionGroup;
};

var create = function(inputLayer) {
  layer = inputLayer;
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
  if (!GameState.getStopped()) {
    var FINALHEIGHT = CHIMNEY_SPAWN_HEIGHT_BASE + (Math.random() * CHIMNEY_SPAWN_HEIGHT_VARIATION);
    var chimneySprite = layer.create(CHIMNEY_SPAWN_POSITION, FINALHEIGHT, 'chimney0');

    game.physics.p2.enable(chimneySprite);
    chimneySprite.body.fixedRotation = true;
    chimneySprite.body.setCollisionGroup(chimneyCollisionGroup);
    chimneySprite.body.collides(santaCollionGroup);
    chimneySprite.body.collideWorldBounds = false;
    chimneySprite.body.dynamic = false;
    chimneys.push(chimneySprite);   
  }
};

function reset() {
  for (var i = 0; i < chimneys.length; i++) {
    var chimney = chimneys[i];
    chimney.destroy();
  }
  chimneys = [];
};

// Things exported for use in other files.
// Formate is externalName: internalName,
module.exports = {
  registerCollionGroups: registerCollionGroups,
  preload: preload,
  create: create,
  update: update,
  reset: reset
};
