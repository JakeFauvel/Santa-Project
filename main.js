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
var START_BTN_X = 312.5;
var START_BTN_Y = 275;

var ROOFTOP_SPAWN_POSITION = 1035;
var ROOFTOP_VELOCITY_X = 150;
var ROOFTOP_SPAWN_TIMER = 3100;
var ROOFTOP_SPAWN_HEIGHT_BASE = 690;
var ROOFTOP_SPAWN_HEIGHT_VARIATION = -100;

var max = 0;
var front_emitter;
var mid_emitter;
var back_emitter;
var update_interval = 4 * 60;
var i = 0;

var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
  // You can fill the preloader with as many assets as your game requires
  // Here we are loading an image. The first parameter is the unique
  // String by which we'll identify the image later in our code.
  // The second parameter is the URL of the image (relative)
  game.load.image('background', 'resources/img/Background.png');
  game.load.image('startButton', 'resources/img/Start_Button.png');
  game.load.image('rooftop', 'resources/img/Winter_Roof.png');
  game.load.image('snowflakes', 'resources/img/Snowflake.png');
  game.load.image('snowflakes_large', 'resources/img/Snowflake.png');

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

  back_emitter = game.add.emitter(game.world.centerX + 325, -32, 1000);
  back_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
  back_emitter.maxParticleScale = 0.2;
  back_emitter.minParticleScale = 0.05;
  back_emitter.setYSpeed(70, 100);
  back_emitter.setXSpeed(-120, -120);
  back_emitter.gravity = 0;
  back_emitter.width = game.world.width * 1.5;
  back_emitter.minRotation = 0;
  back_emitter.maxRotation = 40;
  back_emitter.lifeSpan = 4500;

  mid_emitter = game.add.emitter(game.world.centerX + 325, -32, 500);
  mid_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
  mid_emitter.maxParticleScale = 0.3;
  mid_emitter.minParticleScale = 0.1;
  mid_emitter.setYSpeed(100, 150);
  mid_emitter.setXSpeed(-120, -120);
  mid_emitter.gravity = 0;
  mid_emitter.width = game.world.width * 1.5;
  mid_emitter.minRotation = 0;
  mid_emitter.maxRotation = 40;
  mid_emitter.lifeSpan = 4500;

  front_emitter = game.add.emitter(game.world.centerX + 325, -32, 500);
  front_emitter.makeParticles('snowflakes_large', [0, 1, 2, 3, 4, 5]);
  front_emitter.maxParticleScale = 0.45;
  front_emitter.minParticleScale = 0.25;
  front_emitter.setYSpeed(150, 200);
  front_emitter.setXSpeed(-120, -120);
  front_emitter.gravity = 0;
  front_emitter.width = game.world.width * 1.5;
  front_emitter.minRotation = 0;
  front_emitter.maxRotation = 40;
  front_emitter.lifeSpan = 4500;

  back_emitter.start(false, 14000, 10);
  mid_emitter.start(false, 12000, 20);
  front_emitter.start(false, 6000, 500);

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