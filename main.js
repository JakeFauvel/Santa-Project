window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')

var Chimney = require("./chimney.js");
var Santa = require("./santa.js");

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;
var BACKGROUND_X = 0;
var BACKGROUND_Y = 0;

var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
  // You can fill the preloader with as many assets as your game requires
  // Here we are loading an image. The first parameter is the unique
  // String by which we'll identify the image later in our code.
  // The second parameter is the URL of the image (relative)
  game.load.image('background', 'resources/img/Background.png');

  Chimney.preload(game);
  Santa.preload(game);
}

function create() {
  game.add.sprite(BACKGROUND_X, BACKGROUND_Y, 'background');

  game.physics.startSystem(Phaser.Physics.P2JS);

  var santaCollionGroup = game.physics.p2.createCollisionGroup();
  var chimneyCollisionGroup = game.physics.p2.createCollisionGroup();
  game.physics.p2.updateBoundsCollisionGroup();

  Santa.registerCollionGroups(santaCollionGroup, chimneyCollisionGroup);
  Chimney.registerCollionGroups(santaCollionGroup, chimneyCollisionGroup);

  Chimney.create(game);
  Santa.create(game);

  game.physics.p2.updateBoundsCollisionGroup();
}

function update() {
  Chimney.update();
  Santa.update(game);
};
