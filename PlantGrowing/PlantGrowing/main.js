//code created by Alain Kassarjian
var game = new Phaser.Game(800, 1000, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() 
{
	//image assets
	game.load.image('box', 'assets/Box.png');
	game.load.image('player', 'assets/Player.png');
	game.load.image('plant', 'assets/Plant.png');
	game.load.image('lightMode', 'assets/Player_LightMode.png');
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

//the player needed a group object to belong to
//so that the getObjectsUnderPointer function
//could process it. var player should be the only
//object in this group
var players;

function create() 
{
	//enable arcade physics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//allows for access to mouse information
	game.input.mouse.capture = true;

	//makes two plants to grow from in the world
	//there are two to test if multiple plants
	//can exist
	createPlant(game.world.width / 2, game.world.height / 2);
	createPlant(game.world.width / 4, game.world.height / 4);

	//makes the player object and adds it to
	//its group
	players = game.add.group();
	players.enableBody = true;
	player = players.create(0, 0, 'player');

	//object to store keyboard inputs
	input = game.input.keyboard.createCursorKeys();

	//adds spacebar information to spacekey
	spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	//adds mouse information to mouse
	mouse = game.input.activePointer;
}

function update() 
{
	//sets player velocity to 0 if nothing is being pressed
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;

	//treats the plant objects as walls
	game.physics.arcade.collide(player, plants);

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

	else if (input.up.isDown && !isLightMode)
		player.body.velocity.y = -150;

	else if (input.down.isDown && !isLightMode)
		player.body.velocity.y = 150;

	//upon pressing the spacebar, you can alternate
	//from player mode and light mode
	if (spaceKey.downDuration(1) && !isLightMode)
	{
		isLightMode = true;
		player.loadTexture('lightMode');
	}
	else if(spaceKey.downDuration(1) && isLightMode)
	{
		isLightMode = false;
		player.loadTexture('player');
	}
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

	//adds the new plant group to the array
	//of plants
	plants.push(plantGroup);
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
		plant = game.add.sprite(mouse.x, mouse.y, 'box');
		game.physics.arcade.enable(plant);

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
				plant = plantGroup.create(game.input.mousePointer.x, game.input.mousePointer.y, 'box');
				plant.body.immovable = true;
			}
			else
				plant.destroy();
		}
		else
		{
			plant.destroy();
		}
	}

	console.log('total plants: ' + plantGroup.total);
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
	plant = game.add.sprite(mouse.x, mouse.y, 'box');
	game.physics.arcade.enable(plant);

	if(game.physics.arcade.overlap(plant, plantGroup))
	{
		plant.destroy();
		growPlant(plantGroup);
	}
	else
		plant.destroy();
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