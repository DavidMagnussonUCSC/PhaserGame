
var game = new Phaser.Game(1000, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() 
{
	//image assets
	game.load.image('box', 'assets/Box.png');
	game.load.image('player', 'assets/Player.png');
	game.load.image('plant', 'assets/Plant.png');
	game.load.image('lightMode', 'assets/Player_LightMode.png');

	//Borrowed from first phaser game, replace post first prototype
	game.load.image('platform', 'assets/platform.png');
}

//global variables

//an array that holds all the plant groups
var plants = [];

//this is used in various functions to temporarily
//store a plant
var plant;

//the main player object
var player;

//variable to store and describe arrow key input information
var input;

//boolean for if light mode is on or off
var isLightMode = false;

//variable to store and describe spacebar input information
var spaceKey;

//variable to store and describe mouse input information
var mouse;

//variable for group
var platforms;

//the player needed a group object to belong to
//so that the getObjectsUnderPointer function
//could process it. var player should be the only
//object in this group
var players;

function create() 
{

	//enable arcade physics
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//Set world size
	game.world.setBounds(0, 0, game.width*2, game.height*2);

	//allows for access to mouse information
	game.input.mouse.capture = true;
	
	//Create the plants in positions modeled after the paper prototype
	createPlant(350, 1200);
	createPlant(450, 50);
	createPlant(675, 610);
	createPlant(1425, 100);
	createPlant(1525, 800);

	//Adds platforms  Groups and enables physics for them
	platforms = game.add.group();
	platforms.enableBody = true;
	
	//Creates starting and ending ledge
	var ledge = platforms.create(-200,125, 'platform');
	ledge.body.immovable = true;
	ledge = platforms.create(game.world.width - 200, 275, 'platform');
	ledge.body.immovable = true;

	//makes the player object and adds it to its group
	//Turns on world boundaries for player
	//adds bounce to the player
	//sets player gravity
	players = game.add.group();
	players.enableBody = true;
	player = players.create(80, 50, 'player');
	player.anchor.set(0.5);
	player.body.collideWorldBounds = true;
	player.body.bounce.y = .02;
	player.body.gravity.y = 200;

	//object to store keyboard inputs
	input = game.input.keyboard.createCursorKeys();

	//adds spacebar information to spacekey
	spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	//adds mouse information to mouse
	mouse = game.input.activePointer;
	
	//Camera follows player
	game.camera.follow(player,Phaser.Camera.FOLLOW_PLATFORMER, 0.5, 0.5);
}

function update() 
{
	//sets player velocity to 0 if nothing is being pressed
	player.body.velocity.x = 0;
	//player.body.velocity.y = 0; removed so gravity works
	
	//if UP is held while falling, it makes a "floaty" fall
	if(player.body.velocity.y > 50 && input.up.isDown)
	{
		player.body.velocity.y = 50;
	}

	//treats the plant objects as walls
	game.physics.arcade.collide(player, plants);
	
	//collision detection boolean for ground/platforms and player
	var hitPlatform = game.physics.arcade.collide(player, platforms);

	//isDown will be true if the left click
	//is down. The forEach function will browse
	//through all existing plant groups to see
	//which one is being clicked, so that the 
	//right plant will grow
	if (game.input.activePointer.isDown)
		plants.forEach(identifyPlantGroup);

	//the following if/else statements allows for player movement
	if (input.left.isDown && !isLightMode)
		player.body.velocity.x = -150;

	else if (input.right.isDown && !isLightMode)
		player.body.velocity.x = 150;

	if (input.up.isDown && !isLightMode && player.body.touching.down)//Jumping, works if touching the ground and not in lgiht mode
		player.body.velocity.y = -225;

/* 	//outdated downwards movement before gravity
	else if (input.down.isDown && !isLightMode)
		player.body.velocity.y = 150; */

	//upon pressing the spacebar, you can alternate
	//from player mode and light mode as long as player is on a surface
	if (spaceKey.downDuration(1) && !isLightMode && player.body.touching.down)
	{
		isLightMode = true;
		player.loadTexture('lightMode');
	}
	else if(spaceKey.downDuration(1) && isLightMode)
	{
		isLightMode = false;
		player.loadTexture('player');
	}

	if(player.y > game.world.height-50){
		player.reset(80,50);
	}

	//used for debugging purposes
	render();
}


//creates a plant group and adds 
//a new initial plant object to the game 
//at position (x,y)
function createPlant(x, y)
{
	var plantGroup = game.add.group();
	plantGroup.enableBody = true;
	plant = plantGroup.create(x, y, 'plant');
	plant.body.immovable = true;
	plant.anchor.set(0.5);

	//adds the new plant group to the array
	//of plants
	plants.push(plantGroup);
}

//function that determines which plant group
//the mouse is on. It uses the same logic as
//growPlant that creates a theoretical plant,
//and sees if it is connected with the group
//being looked at in the moment. If so, the
//right plant group has been found, and it can
//proceed to grow.
function identifyPlantGroup(plantGroup)
{	

	plant = game.add.sprite(mouse.worldX, mouse.worldY, 'box');
	game.physics.arcade.enable(plant);
	plant.anchor.set(0.5);

	if(game.physics.arcade.overlap(plant, plantGroup))
	{
		plant.destroy();
		//console.log(plantGroup)
		growPlant(plantGroup);
	}
	else
		plant.destroy();
}

//this function receives a phaser group of one
//of the plants and processes it to grow.
function growPlant(plantGroup)
{
	//plant growing is only allowed if there is no plant
	//where the mouse is, if the length has not surpassed
	//100 plants, and if the player is in light mode.
	if (plantGroup.total < 100 && isLightMode)
	{

		//makes a theoretical plant to see if it a plant
		//can officially be made here
		plant = game.add.sprite(mouse.worldX, mouse.worldY, 'box');
		game.physics.arcade.enable(plant);
		plant.anchor.set(0.5);

		//checks if the plant part you just made is connected
		//to the main plant.
		//If it isn't, get rid of the theoretical plant
		//also checks to see if the player is in the way
		if (game.physics.arcade.overlap(plant, plantGroup) && !isBlockedByPlayer())
		{
			//checks to see if the sprite is within a range of distance
			//to be able to create the plant
			if (inRange(distanceBetween(plantGroup.getChildAt(plantGroup.total - 1), plant), 5, 20))
			{
				plant.destroy();
				plant = plantGroup.create(game.input.mousePointer.worldX, game.input.mousePointer.worldY, 'box');
				plant.body.immovable = true;
				plant.anchor.set(0.5);
			}
			else
				plant.destroy();
		}
		else
		{
			plant.destroy();
		}

		//outputs to console the total remain plant "links" in a group
		console.log('total plants: ' + plantGroup.total);

	}

}

//uses the distance formula and the (x,y) coordinates of
//two plants to find the distance between 2 plants
function distanceBetween(plantOne, plantTwo)
{
	var distance = Math.sqrt(Math.pow((plantTwo.x - plantOne.x), 2) + Math.pow((plantTwo.y - plantOne.y), 2));
	console.log('distance: ' + distance);
	return distance;
}

//checks to see if number is inclusively between low and high
function inRange(number, low, high)
{
	if (number >= low && number <= high)
		return true;
	else
		return false;
}

//checks to see if the mouse is on the player
function isBlockedByPlayer()
{
	if(game.physics.arcade.getObjectsUnderPointer(mouse, players) != 0)
		return true;
	else
		return false;
}

//used for debug info
function render() 
{
    // display some debug info of the camera
    game.debug.cameraInfo(game.camera, 32, 32);
    // display some debug info of the camera
    game.debug.spriteInfo(player, 32, game.height - 120);
}