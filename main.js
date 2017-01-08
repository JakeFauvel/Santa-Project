window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')

var Chimney = require("./chimney.js");
var Santa = require("./santa.js");
var GameState = require("./gameState.js");
var rooftops = [];
var rooftopLayer = undefined;
var santaCollionGroup = undefined;
var chimneyCollisionGroup = undefined;
var startButton = undefined;

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;

var BACKGROUND_X = 0;
var BACKGROUND_Y = 0;
var START_BTN_X = 400;
var START_BTN_Y = 300;

var ROOFTOP_SPAWN_POSITION = 1035;
var ROOFTOP_VELOCITY_X = 150;
var ROOFTOP_SPAWN_TIMER = 3100;
var ROOFTOP_SPAWN_HEIGHT_BASE = 690;
var ROOFTOP_SPAWN_HEIGHT_VARIATION = -100;

var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
  // You can fill the preloader with as many assets as your game requires
  // Here we are loading an image. The first parameter is the unique
  // String by which we'll identify the image later in our code.
  // The second parameter is the URL of the image (relative)
  game.load.image('background', 'resources/img/Background.png');
  game.load.image('startButton', 'resources/img/Start_Button.png');
  game.load.image('rooftop', 'resources/img/Winter_Roof.png');

  Chimney.preload(game);
  Santa.preload(game);
};

function create() {

  var backgroundLayer = game.add.group();
  var chimneyLayer = game.add.group();
  rooftopLayer = game.add.group();
  var santaLayer = game.add.group();
  var interfaceLayer = game.add.group();

  backgroundLayer.create(BACKGROUND_X, BACKGROUND_Y, 'background');
  startButton = game.add.button(START_BTN_X, START_BTN_Y, 'startButton', startNewGame, interfaceLayer);

  game.physics.startSystem(Phaser.Physics.P2JS);

  santaCollionGroup = game.physics.p2.createCollisionGroup();
  chimneyCollisionGroup = game.physics.p2.createCollisionGroup();
  game.physics.p2.updateBoundsCollisionGroup();

  Santa.registerCollionGroups(santaCollionGroup, chimneyCollisionGroup);
  Santa.registerContactCallback(reset);
  Chimney.registerCollionGroups(santaCollionGroup, chimneyCollisionGroup);

  Chimney.create(chimneyLayer);
  Santa.create(santaLayer);

  game.physics.p2.updateBoundsCollisionGroup();

  game.time.events.loop(ROOFTOP_SPAWN_TIMER, spawnRooftop, this);

  reset();
};

function spawnRooftop() {
  if (!GameState.getStopped()) {
    var FINALHEIGHT = ROOFTOP_SPAWN_HEIGHT_BASE + (Math.random() * ROOFTOP_SPAWN_HEIGHT_VARIATION);
    var rooftopSprite = rooftopLayer.create(ROOFTOP_SPAWN_POSITION, FINALHEIGHT, 'rooftop');

    game.physics.p2.enable(rooftopSprite);
    rooftopSprite.body.fixedRotation = true;
    rooftopSprite.body.setCollisionGroup(chimneyCollisionGroup);
    rooftopSprite.body.collides(santaCollionGroup);
    rooftopSprite.body.collideWorldBounds = false;
    rooftopSprite.body.dynamic = false;
    rooftops.push(rooftopSprite);
  }
};

function update() {
  for (var i = 0; i < rooftops.length; i++) {
    var rooftop = rooftops[i];
    rooftop.body.setZeroVelocity();
    rooftop.body.moveLeft(ROOFTOP_VELOCITY_X);
  }
  Chimney.update();
  Santa.update(game);
};

function reset() {
  game.physics.p2.pause();
  GameState.setStopped(true);

  for (var i = 0; i < rooftops.length; i++) {
    var rooftop = rooftops[i];
    rooftop.destroy();
  }
  rooftops = [];

  Santa.reset();
  Chimney.reset();
  startButton.visible = true;
};

function startNewGame() {
  game.physics.p2.resume();
  GameState.setStopped(false);
  Santa.show();
  startButton.visible = false;
};