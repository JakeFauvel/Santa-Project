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
var layer = undefined;
var contactCallback = undefined;

var preload = function(inputGame) {
  game = inputGame;
  game.load.image('santa', 'resources/img/Santa.png');
};

var registerCollionGroups = function(_santaCollionGroup, _chimneyCollisionGroup) {
  santaCollionGroup = _santaCollionGroup;
  chimneyCollisionGroup = _chimneyCollisionGroup;
};

var registerContactCallback = function(_contactCallback) {
  contactCallback = _contactCallback;
};

var create = function(inputLayer) {
  layer = inputLayer;
  santa = layer.create(SANTA_SPAWN_X, SANTA_SPAWN_Y, 'santa');
  // Do santas gravity
  game.physics.p2.enable(santa);
  santa.body.fixedRotation = true;
  santa.body.setCollisionGroup(santaCollionGroup);
  santa.body.collides(chimneyCollisionGroup);

  santa.body.onBeginContact.add(onContact, this);
};

var update = function() {
  gravityAmount += GRAVITY_INCREASE;
  santa.body.force.y = gravityAmount;
  santa.body.x = SANTA_SPAWN_X;
};

function thrust() {
  santa.body.velocity.y = SANTA_VELOCITY_Y;
};

function onContact (santa, object) {
  contactCallback();
  // if (object.shapes[0].collisionGroup === chimneyCollisionGroup.mask) {
  //   console.log("Chimney Hit! - Dead :( ");
  // } else {
  //   console.log("Wall Hit! - Deadd :( ");
  // }
};

function reset() {
  santa.body.x = SANTA_SPAWN_X;
  santa.body.y = SANTA_SPAWN_Y;
  santa.body.setZeroVelocity();
  santa.visible = false;
  game.input.onDown.remove(thrust, this);
};

function getSantaX() {
  return santa.body.x;
};

function getSantaY() {
  return santa.body.y;
};

function show() {
    santa.visible = true;
    game.input.onDown.add(thrust, this);  
};

// Things exported for use in other files.
// Formate is externalName: internalName,
module.exports = {
  registerCollionGroups: registerCollionGroups,
  registerContactCallback: registerContactCallback,
  preload: preload,
  create: create,
  update: update,
  reset: reset,
  getSantaX: getSantaX,
  getSantaY: getSantaY,
  show: show
};
