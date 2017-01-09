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
var SOUND_BTN_X = 740;
var SOUND_BTN_Y = 25;
var backgroundMusic = undefined;

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
var scoreText = undefined;

var SCORE = 0;

var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

  game.load.image('background', 'resources/img/Background.png');
  game.load.image('startButton', 'resources/img/Start_Button.png');
  game.load.image('rooftop', 'resources/img/Winter_Roof.png');
  game.load.image('snowflakes', 'resources/img/Snowflake.png');
  game.load.image('snowflakes_large', 'resources/img/Snowflake.png');
  game.load.image('fire', 'resources/img/Fire.png');
  game.load.image('sound_icon', 'resources/img/Sound_Icon.png');

  game.load.audio('bells', 'resources/sound/Sleigh_Bells.mp3');

  Chimney.preload(game);
  Santa.preload(game);
};

function create() {

  var backgroundLayer = game.add.group();
  var chimneyLayer = game.add.group();
  rooftopLayer = game.add.group();
  var santaLayer = game.add.group();
  var interfaceLayer = game.add.group();
  var textStyle = { font: "20px Arial", fill: "#FFF"};
  scoreText = this.game.add.text(25, 20, "Score:" + SCORE, textStyle);
  scoreText.fixedToCamera = true;

  // CREATE MESSAGE TEXT AND HIDE IT

  backgroundLayer.create(BACKGROUND_X, BACKGROUND_Y, 'background');
  startButton = game.add.button(START_BTN_X, START_BTN_Y, 'startButton', startNewGame, interfaceLayer);

  backgroundMusic = game.add.audio('bells');
  backgroundMusic.loop = true;  
  backgroundMusic.volume = 0.1;
  backgroundMusic.play();
  var soundButton = game.add.button(SOUND_BTN_X, SOUND_BTN_Y, 'sound_icon', audioButton);

  game.physics.startSystem(Phaser.Physics.P2JS);

  jetpack_emitter = game.add.emitter(0, 0, 10);
  jetpack_emitter.makeParticles('fire');
  jetpack_emitter.setAlpha(1, 0, 300);
  jetpack_emitter.setRotation(0, 0);
  jetpack_emitter.setYSpeed(20, 50);
  jetpack_emitter.setXSpeed(-25, 50);
  game.input.onDown.add(particleBurst, this);
  jetpack_emitter.on = false;

  back_emitter = game.add.emitter(game.world.centerX + 350, -32, 1000);
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

  mid_emitter = game.add.emitter(game.world.centerX + 350, -32, 500);
  mid_emitter.makeParticles('snowflakes_large', [0, 1, 2, 3, 4, 5]);
  mid_emitter.maxParticleScale = 0.3;
  mid_emitter.minParticleScale = 0.1;
  mid_emitter.setYSpeed(100, 150);
  mid_emitter.setXSpeed(-120, -120);
  mid_emitter.gravity = 0;
  mid_emitter.width = game.world.width * 1.5;
  mid_emitter.minRotation = 0;
  mid_emitter.maxRotation = 40;
  mid_emitter.lifeSpan = 4500;

  front_emitter = game.add.emitter(game.world.centerX + 350, -32, 500);
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
  
  if (!GameState.getStopped()) {
    SCORE = SCORE + 1;
    scoreText.text = "Score: " + SCORE;
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
  // SHOW MESSAGE TEXT IF SCORE > 0 (i.e if this is after a death)
};

function startNewGame() {
  game.physics.p2.resume();
  GameState.setStopped(false);
  Santa.show();
  startButton.visible = false;
  // HIDE MESSAGE TEXT 
  SCORE = 0;
};

function audioButton() {
  if (backgroundMusic.volume === 0.1) {
    backgroundMusic.volume = 0.0;
  }
  else if (backgroundMusic.volume === 0.0) {
    backgroundMusic.volume = 0.1;
  }
};

function particleBurst(pointer) {

  //  Position the emitter where the mouse/touch event was
  jetpack_emitter.x = Santa.getSantaX() - 35 ;
  jetpack_emitter.y = Santa.getSantaY() + 25;

  //  The first parameter sets the effect to "explode" which means all particles are emitted at once
  //  The second gives each particle a 2000ms lifespan
  //  The third is ignored when using burst/explode mode
  //  The final parameter (10) is how many particles will be emitted in this single burst
  if (!GameState.getStopped()) {
      jetpack_emitter.start(true, 350, null, 5);
  }

}