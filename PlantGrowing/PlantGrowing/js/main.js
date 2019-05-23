//ARTG/CMPM 120 game first prototype by Team 49: Anthony Diaz, David Magnusson, and Alain Kassarjian
// https://github.com/DavidMagnussonUCSC/PhaserGame

//Initialize game
var game = new Phaser.Game(1000, 800, Phaser.AUTO, 'phaser',);

//All global variables

//an array that holds all the plant groups
var plants = [];

//an array that holds standable on plant matter
var plantMatter = []

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
var rKey;

//variable to store and describe mouse input information
var mouse;

//variable for group
var platforms;

//group for all the UI Elements
var UIGroup;

//scale goes from 1-2x zoom
var cameraScale = 2;

//global variable to keep track of what plant players clicked last
var activeGroup;

//allows the fixing of body anchors while the camera zooms in/out to keep sprites aligned
var bodyAnchor = 0.5;

//where the timer is stored for the zoom out/in animation
var zoomLoop;

//the player needed a group object to belong to
//so that the getObjectsUnderPointer function
//could process it. var player should be the only
//object in this group
var players;

//Var for level exits/victory
var exits;

//has the player hit a plant
var plantImpacted;

var cameraMoving = true;

// MAIN MENU STATE START -----------------------------------------------------------------------------------------------

var MainMenu = function(game) {};
MainMenu.prototype = {
	
	preload: function() {

		//setup for advanced timing (ex. fps debug)
		game.time.advancedTiming = true;

		//image setup/assets
		game.load.path = 'assets/img/';
		game.load.image('box', 'Box.png');
		game.load.image('ui', 'UI.png');
		game.load.image('player', 'Player.png');
		game.load.image('plant', 'Plant.png');
		game.load.image('lightMode', 'Player_LightMode.png');
		game.load.image('platform', 'platform.png');
		game.load.image('exit', 'exit.png');
		game.load.image('fade', 'blackfade.png');
		game.load.image('highlight', 'PlantHighlight.png');

		//audio setup/assets
		game.load.path = 'assets/audio/';
		game.load.audio('pop', 'pop01.mp3');
		game.load.audio('loop', 'shortambientloop.wav');
		game.load.audio('oof', 'hurt.mp3');
		 game.load.audio('plantImpact', 'Plant.mp3')
		
		//allows for access to mouse information
		game.input.mouse.capture = true;
		
		//object to store keyboard inputs
		input = game.input.keyboard.createCursorKeys();

		//adds spacebar information to spacekey
		spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);

		//adds mouse information to mouse
		mouse = game.input.activePointer;
	},

	create: function(){
		//sets main menu background color to forestgreen
		game.stage.backgroundColor = "#228B22";
		
		//Adds instruction text
		var text = game.add.text(16, 18, 'Plant Platformer', { fontSize: '32px', fill: '#000'});
		text.addColor('#fff', 0);

		var text = game.add.text(16, 108, '* Use the "ARROW KEYS" to move and jump, Hold the "UP"', { fontSize: '32px', fill: '#000' });
		//  And now we'll color in some of the letters
    	text.addColor('#ffff00', 10);
    	text.addColor('#000', 23);
    	text.addColor('#ffff00', 50);
		var text = game.add.text(16, 148, '  key while falling for a slow descent. ', { fontSize: '32px', fill: '#000' });

		var text = game.add.text(16, 208, '* Press "SPACE" to switch forms. While in the "BLUE"', { fontSize: '32px', fill: '#000' });
		text.addColor('#ffff00', 8);
		text.addColor('#000', 15);
		text.addColor('#0000FF', 45);
		var text = game.add.text(16, 248, '  form you cannot move but you will be able to click', { fontSize: '32px', fill: '#000' });
		var text = game.add.text(16, 288, '  and drag on the brown earth to grow platforms!', { fontSize: '32px', fill: '#000' });
		
		var text = game.add.text(16, 358, '* If a Plant isnt to your liking, click on the plant', { fontSize: '32px', fill: '#000' });
		var text = game.add.text(16, 398, '  and press "R" to reset your most recent active plant! ', { fontSize: '32px', fill: '#000' });
		text.addColor('#ffff00', 12);
		text.addColor('#000', 15);
		var text = game.add.text(16, 438, '  (plant highlighted by yellow)', { fontSize: '32px', fill: '#000' });

		var text = game.add.text(16, 508, "* If you can't see whats ahead, \"PEEK\" the Camera ", { fontSize: '32px', fill: '#000' });
		text.addColor('#ffff00', 31);
		text.addColor('#000', 39);
		var text = game.add.text(16, 548, '  using "W,A,S,D" to nudge the camera just a little.', { fontSize: '32px', fill: '#000' });
		text.addColor('#ffff00', 8);
		text.addColor('#000', 17);

		var text = game.add.text(16, 678, 'Try to make it to the platform on the other side!', { fontSize: '32px', fill: '#000' });
		var text = game.add.text(16, 718, 'Press "SPACE" to start', { fontSize: '32px', fill: '#000' });
		text.addColor('#fff', 0);
	},

	update: function() {
		if(spaceKey.isDown)
		{
			//Starts the gameplay state if space is held down/pressed
			game.state.start('GamePlay', true, false, 0);
		}
	}
}

// MAIN MENU STATE END -----------------------------------------------------------------------------------------------

// PLAY STATE START -----------------------------------------------------------------------------------------------

//Gameplay State
var GamePlay = function(game) {};
GamePlay.prototype = {
	
	create: function(){

		//sets game background color to navy blue
		game.stage.backgroundColor = "#000d1a"; 
		
		//enable arcade physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//Set game world size to double the viewable area of the game
		game.world.setBounds(0, 0, game.width*2, game.height*2);

		//Adds platforms Group and enables physics for them
		platforms = game.add.group();
		platforms.enableBody = true;
		createLedge(-200,game.world.height-125, 'platform');
		createLedge(game.world.width-175, 275, 'platform');

		//Create the plants in positions modeled after the paper prototype(some modifications)
		createPlant(350, 1200);
		createPlant(450, 110);
		createPlant(675, 610);
		createPlant(1425, 100);
		createPlant(1525, 800);

		//makes the player object and adds it to its group
		//adds bounce to the player
		//sets player gravity
		players = game.add.group();
		players.enableBody = true;
		player = players.create(80, game.world.height-250, 'player');
		player.anchor.set(0.5);
		player.body.bounce.y = .02;
		player.body.gravity.y = 200;
		player.body.maxVelocity = 0;
		player.body.syncBounds = true;

		//Camera follows player
		game.camera.follow(player,Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);

		//setup for audio stuff
		//temp audio for jump
		pop = game.add.audio('pop');
		pop.volume = 0.5;
	   
	    //temp audio fall off map sound
	    oof = game.add.audio('oof');
	    oof.volume = 0.1;

	    //temp audio looping background music
	    songLoop = game.add.audio('loop');
	    songLoop.volume = 0.05;
	    songLoop.loop = true;
	    songLoop.play();

	    //sound when landing on plants
		plantImpact = game.add.audio('plantImpact');
		plantImpact.volume = 0.05;

		//adds exit door at the end of the level to trigger GameOver
		exits = game.add.group();
		exits.enableBody = true;
		var exit = exits.create(game.world.width - 100, 210, 'exit');
		exit.anchor.set(0.5);

		//temp sprite to make it look like a pit at the botom of the screen
		var pit = game.add.sprite(0, game.world.height-200, 'fade');
		pit.scale.x = 1.1;
		pit.scale.y = 0.2;

		//these are acting as the boundary around the game (off screen)
		walls = game.add.group();
		walls.enableBody = true;
		createWall(-32, -game.world.height/2, 'box', 1, 75);
		createWall(game.world.width+32, -game.world.height/2, 'box', 1, 75);

		//creates the walls as a passage block (seen on screen)
		createWall(1409, -253, 'box', 1, 10);
		createWall(659, 643, 'box', 1, 35);

		//creation of UI elements
		UIGroup = game.add.group();
		//createUIElement(game.camera.width-50, 50, 'ui');
		//createUIElement(game.camera.width-100, 50, 'ui');
		//createUIElement(game.camera.width-150, 50, 'ui');


		//keeps player from moving during the zoom out/zoom inu until time has passed
		//the timing on how the camera zooms in/zooms out
		isLightMode = true;
		game.time.events.add(2000, function() { 
			zoomLoop = game.time.events.repeat(10, 200, cameraZoomOut, this);
		});
		game.time.events.add(7500, function() { 
			zoomLoop = game.time.events.repeat(10, 200, cameraZoomIn, this);
		});
		game.time.events.add(10500, function() { 
			isLightMode = false;
			cameraMoving = false;
		});
	
	
	},

	update: function(){

		//sets player velocity to 0 if nothing is being pressed
		player.body.velocity.x = 0;
		//player.body.velocity.y = 0; removed so gravity works
		
		//if UP is held while falling, it makes a "floaty" fall
		if(player.body.velocity.y > 50 && input.up.isDown && !cameraMoving)
		{
			player.body.velocity.y = 50;
		}

		//collision detection for player and plants
		//collision detection for ground/platforms and player
		//collision detection for walls
		game.physics.arcade.collide(player, plantMatter, plantSound);
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(player, walls);

		//isDown will be true if the left click
		//is down. The forEach function will browse
		//through all existing plant groups to see
		//which one is being clicked, so that the 
		//right plant will grow
		if (game.input.activePointer.isDown && !cameraMoving){
			plants.forEach(identifyPlantGroup);
			if(activeGroup != undefined){
				//console.log(activeGroup);
				growPlant(activeGroup);
			}
		}

		//resets plant to original state
		if(rKey.downDuration(1) && !cameraMoving){
			resetPlant(activeGroup);
		}

		//the following if/else statements allows for player movement
		if (input.left.isDown && !isLightMode && !cameraMoving)
			player.body.velocity.x = -150;

		else if (input.right.isDown && !isLightMode && !cameraMoving)
			player.body.velocity.x = 150;

		//Jumping, works if touching the ground and not in light mode
		if (input.up.isDown && !isLightMode && player.body.touching.down && !cameraMoving){
			player.body.velocity.y = -225;
			pop.play();
			plantImpacted = false;
		}

		//upon pressing the spacebar, you can alternate
		//from player mode and light mode as long as player is on a surface
		if (spaceKey.downDuration(1) && !isLightMode && player.body.touching.down && !cameraMoving)
		{
			isLightMode = true;
			player.loadTexture('lightMode');
		}
		else if(spaceKey.downDuration(1) && isLightMode && !cameraMoving)
		{
			isLightMode = false;
			player.loadTexture('player');
		}


		//camera panning using W,A,S,D to allow players to peek around things they cant see
		if(game.input.keyboard.isDown(Phaser.Keyboard.W) && !cameraMoving){
			game.camera.y -= 200;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.A) && !cameraMoving){
			game.camera.x -= 200;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.S) && !cameraMoving){
			game.camera.y += 200;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.D) && !cameraMoving){
			game.camera.x += 200;	
		}

		//if the player falls to the bottom of the screen it resets them to starting point
		//flashes the player for a couple seconds
		if(player.y > game.world.height+player.height){
			oof.play();
			
			player.reset(80,game.world.height-250);

			isLightMode =true;

			game.time.events.add(2000, function() { 
				isLightMode = false;
			});

			flash(player);
		}

		//manual camera zoom in
		if(game.input.keyboard.isDown(Phaser.Keyboard.O)){
			zoomLoop = game.time.events.repeat(10, 150, cameraZoomIn, this);
	    }
	    //manual camera zoom out
	    if(game.input.keyboard.isDown(Phaser.Keyboard.P)){
	    	zoomLoop = game.time.events.repeat(10, 150, cameraZoomOut, this);
	    }
		
		//Goes to game over screen if exit is reached
		if(game.physics.arcade.collide(player, exits))
		{
			songLoop.destroy();
			game.state.start('GameOver', true, false, 0);
		}

		//used for debugging purposes
		//render();
	}
}

// PLAY STATE END -----------------------------------------------------------------------------------------------

// GAME OVER START -----------------------------------------------------------------------------------------------

//Game over state
var GameOver = function(game) {};
GameOver.prototype = {
	create: function(){

		//sets main menu background color to a warm red
		game.stage.backgroundColor = "#cd5c5c";
		
		//victory and instruction text
		game.add.text(16, 16, 'You did it!', { fontSize: '32px', fill: '#000' });
		game.add.text(16, 68, 'Press space to restart.', { fontSize: '32px', fill: '#000' });
		
	},

	update: function(){

		if(spaceKey.isDown){
				game.state.start('MainMenu', true, false, 0); //Starts the gameplay state if space is held down/pressed
		}
	
	}

}

// GAME OVER STATE END -----------------------------------------------------------------------------------------------



//Global Functions (Might be made local later if only 1 large level is made)

//creates a plant group and adds 
//a new initial plant object to the game 
//at position (x,y)
function createPlant(x, y){

	var plantGroup = game.add.group();
	plantGroup.enableBody = true;
	plant = plantGroup.create(x, y, 'plant');
	plant.body.immovable = true;
	plant.anchor.set(0.5);
	plant.body.syncBounds = true;
	plant.alpha = 0.5; //to make more clear these can't be stood on
	//adds the new plant group to the array of plants
	plants.push(plantGroup);
}

//function that determines which plant group
//the mouse is on. It uses the same logic as
//growPlant that creates a theoretical plant,
//and sees if it is connected with the group
//being looked at in the moment. If so, the
//right plant group has been found, and it can
//proceed to grow.
function identifyPlantGroup(plantGroup){	

	plant = game.add.sprite(mouse.worldX, mouse.worldY, 'box');
	game.physics.arcade.enable(plant);
	plant.anchor.set(0.5);

	if(game.physics.arcade.overlap(plant, plantGroup))
	{
		console.log(activeGroup);
		//NOTE: if I dont add the second check, a reset plant bottom/base will have getBottom be undefined. I want to understand why - David
		if (activeGroup != undefined && activeGroup.getBottom() != undefined)
			activeGroup.getBottom().loadTexture('plant'); //resets the highlighted plant group's texture
		
		plant.destroy();
		activeGroup = plantGroup;
		
		//Highlights the selected plant base
		plantGroup.getBottom().loadTexture('highlight');
	}
	else{
		plant.destroy();
	}
}

//this function receives a phaser group of one
//of the plants and processes it to grow.
function growPlant(plantGroup){

	//scales the plant down the further it goes to make it slightly skinner
	var plantScale = 1.25-(plantGroup.total/135);
	//console.log(plantScale);

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
				plant.scale.set(plantScale,plantScale);
				plant.body.syncBounds = true;
				if(plantGroup.total == 100){
					plant.tint = 0xffff00;
				}
				plantMatter.push(plant);
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
function distanceBetween(plantOne, plantTwo){

	var distance = Math.sqrt(Math.pow((plantTwo.x - plantOne.x), 2) + Math.pow((plantTwo.y - plantOne.y), 2));
	console.log('distance: ' + distance);
	return distance;

}

//checks to see if number is inclusively between low and high
function inRange(number, low, high){

	if (number >= low && number <= high){
		return true;
	}
	else{
		return false;
	}

}

function plantSound(player){

	//once a plant is touched by the player,
	//a flag will change to prevent looping the sound
	if(!plantImpacted)
	{
		plantImpact.play();
		plantImpacted = true;
	}
}

//checks to see if the mouse is on the player
function isBlockedByPlayer(){

	if(game.physics.arcade.getObjectsUnderPointer(mouse, players) != 0){
		return true;
	}
	else{
		return false;
	}

}

//for creating UI Elements fixed to the camera
function createUIElement(x, y, pic){

	uiElement = UIGroup.create(x, y, pic);
	uiElement.fixedToCamera = true;
	uiElement.anchor.set(0.5);

}

//for creating UI Elements fixed to the camera
function createLedge(x, y, pic){

	var ledge = platforms.create(x, y, pic);
	ledge.body.immovable = true;
	ledge.body.syncBounds = true;
	//ledge.anchor.set(0.5);

}

//for creating UI Elements fixed to the camera
function createWall(x, y, pic, scaleX, scaleY){

	var wall = walls.create(x, y, pic);
	wall.scale.x = scaleX;
	wall.scale.y = scaleY;
	//wall.anchor.set(0.5);
	wall.body.immovable = true;
	wall.body.syncBounds = true;
}

//used for debug info
function render() {

    // display some debug info of the camera
    game.debug.cameraInfo(game.camera, 32, 32);
    // display some debug info of the camera
    game.debug.spriteInfo(player, 32, game.height - 120);
    game.debug.body(player);

    game.debug.text(game.time.fps || '--', 2, 14, "#00ff00"); 

}

//resets the plants
function resetPlant(activeGroup){

	for(i = 0 ; i < plants.length ; i++){
		if(activeGroup != null && plants[i] === activeGroup){

			var temp = activeGroup.getBottom();
			activeGroup.destroy();
			createPlant(temp.x,temp.y);
			plants[i] = null;
			console.log(activeGroup);
		}
	}
}

//camera zoom in
function cameraZoomIn(){

	if(cameraScale <= 1.995){
		game.camera.scale.x += 0.0025;
		game.camera.scale.y += 0.0025;

        bodyAnchor += 0.0025;
        player.anchor.set(bodyAnchor);
        console.log(bodyAnchor);

        cameraScale += 0.005;
    	//console.log(cameraScale);
    }
}

function cameraZoomOut(){
	if(cameraScale >= 1.005){
    	cameraScale -= 0.0025;
    	game.camera.scale.x -= 0.0025;
    	game.camera.scale.y -= 0.0025;

        bodyAnchor -= 0.0025;
        player.anchor.set(bodyAnchor);
        //console.log(bodyAnchor);

        cameraScale -= 0.0025;
    	//console.log(cameraScale);
    	//console.log(game.camera.width);
    }
}

function flash(sprite){

	//creates the fade out white
	game.time.events.repeat(125,16,function(){

		if(sprite.alpha == 0){
			sprite.alpha = 1;
		}
		else if(sprite.alpha == 1){
			sprite.alpha = 0;
		}
		
	},this);
    //game.add.tween(sprite).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true);
}

// STATES -----------------------------------------------------------------------------------------------


// add states to StateManager and starts MainMenu
game.state.add('MainMenu', MainMenu);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');