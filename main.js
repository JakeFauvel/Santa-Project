window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

var santa;
var chimneys = [];


function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.image('background', 'resources/img/Background.png');
    game.load.image('santa', 'resources/img/Santa.png');
    game.load.image('chimney0', 'resources/img/Chimney0.png');
}

function create() {

    game.add.sprite(0, 0, 'background');
    santa = game.add.sprite(400, 200, 'santa');


    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.enable(santa);
    // do santas gravity

    santa.body.fixedRotation = true;
    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    game.input.onDown.add(thrust, this);

    // chimney spawn timer
    game.time.events.loop(2000, spawnChimney, this);
}

var gravityAmount = 2000;

function update() {
  // loop over all chimneys and fix there speed
  for (var i = 0; i < chimneys.length; i++) {
    var chimney = chimneys[i];
    chimney.body.velocity.x = -150;
  }

  // increase gravity over time
  gravityAmount += 10;
  santa.body.force.y = gravityAmount;
};

function thrust() {
  santa.body.velocity.y = -800;
}

function spawnChimney() {
  var baseHeight = 500;
  var randomAmount = 250;

  var finalHeight = baseHeight + (Math.random() * randomAmount);

  var chimneySprite = game.add.sprite(995, finalHeight, 'chimney0');
  game.physics.p2.enable(chimneySprite);
  chimneySprite.body.fixedRotation = true;
  chimneySprite.body.collideWorldBounds = false;
  chimneys.push(chimneySprite);
}
