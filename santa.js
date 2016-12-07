
var SANTA_SPAWN_X = 400;
var SANTA_SPAWN_Y = 200;
var DEFAULT_GRAVITY_AMOUNT = 2000;
var GRAVITY_INCREASE = 0;
var SANTA_VELOCITY_Y = -800;

var game = undefined;
var santaCollionGroup = undefined;
var chimneyCollisionGroup = undefined;
var santa = undefined;
var gravityAmount = DEFAULT_GRAVITY_AMOUNT;

var preload = function(inputGame) {
  game = inputGame;
  game.load.image('santa', 'resources/img/Santa.png');
};

var registerCollionGroups = function(_santaCollionGroup, _chimneyCollisionGroup) {
  santaCollionGroup = _santaCollionGroup;
  chimneyCollisionGroup = _chimneyCollisionGroup;
};

var create = function() {
  santa = game.add.sprite(SANTA_SPAWN_X, SANTA_SPAWN_Y, 'santa');
  // Do santas gravity
  game.physics.p2.enable(santa);
  santa.body.fixedRotation = true;
  santa.body.setCollisionGroup(santaCollionGroup);
  santa.body.collides(chimneyCollisionGroup);

  game.input.onDown.add(thrust, this);

  santa.body.onBeginContact.add(onContact, this);
};

var update = function() {
  gravityAmount += GRAVITY_INCREASE;
  santa.body.force.y = gravityAmount;
};

function thrust() {
  santa.body.velocity.y = SANTA_VELOCITY_Y;
}

function onContact (santa, object) {
  if (object.shapes[0].collisionGroup === chimneyCollisionGroup.mask) {
    console.log("Chimney Hit! - Dead :( ");
  } else {
    console.log("Wall Hit! - Deadd :( ");
  }
}

// Things exported for use in other files.
// Formate is externalName: internalName,
module.exports = {
  registerCollionGroups: registerCollionGroups,
  preload: preload,
  create: create,
  update: update
};
