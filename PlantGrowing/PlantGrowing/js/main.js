//ARTG/CMPM 120 game by Team 49: Anthony Diaz, David Magnusson, and Alain Kassarjian
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

//variable to store and describe R key input information
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

//has the player landed on the ground
var landed;

//a camera moving check to prevent the player from moving
var cameraMoving = true;

//Var for level exits/victory
var invisCameraBody;

//for some parralax scrolling
var farground;

//timing for player light blink/scale
//Variables in charge of the player back light
var plight;
var blink;
var blinkScale;

//shows most recent plant through particles(still buggy)
var plantEmitter;

//a check for pressing space
var readyStart = false;

//Variable for text displayed at start of level(s)
var startText;

//Variable for regulating wall collision for player
var wallCollision = true;

//Variable for regulating player eye position
var pEyes;

//Variable for checking if exit is reached for gameOver transition purposes
var exitReached = false;

//Global Functions

//creates a plant group and adds 
//a new initial plant object to the game 
//at position (x,y)
function createPlant(x, y){

	addLightPulse(x, y)
	var plantGroup = game.add.group();
	plantGroup.enableBody = true;
	plant = plantGroup.create(x, y, 'plant');
	plant.body.immovable = true;
	plant.anchor.set(0.5);
	plant.body.syncBounds = true;
	plant.alpha = 0; //to make more clear these can't be stood on
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
		//console.log(activeGroup);
		//NOTE: if I dont add the second check, a reset plant bottom/base will have getBottom be undefined. I want to understand why - David
		if (activeGroup != undefined && activeGroup.getBottom() != undefined)
			activeGroup.getBottom().loadTexture('plant'); //resets the highlighted plant group's texture
		
		//Destroys the theoretical plant
		plant.destroy();
		
		if(activeGroup != undefined && activeGroup.game != null && activeGroup.getBottom().x != plantGroup.getBottom().x && plantEmitter != undefined){
			plantEmitter.destroy();
		}
		activeGroup = plantGroup;
		//Highlights the selected plant base
		plantGroup.getBottom().loadTexture('highlight');

		//this is how the particle system is created when plant is active
		if(plantEmitter == undefined || plantEmitter.game == null){
			plantEmitter = game.add.emitter(plantGroup.getBottom().x, plantGroup.getBottom().y, 100);

		    plantEmitter.makeParticles('particle');

		    plantEmitter.setRotation(0, 0);
		    plantEmitter.maxParticleScale = 0.35;
		    plantEmitter.minParticleScale = 0.15;
		    plantEmitter.setAlpha(0.15,0.45);
		    plantEmitter.tint = 0xFFFF00;
		    plantEmitter.gravity = -120;

	   		//	false means don't explode all the sprites at once, but instead release at a rate of one particle per 250ms
	    	//	The 2500 value is the lifespan of each particle before it's killed
	    	plantEmitter.start(false, 2000, 200);
    	}
    	//console.log(plantEmitter); 
	}
	else{
		//Destroys the theoretical plant
		plant.destroy();
	}
}

//this function receives a phaser group of one
//of the plants and processes it to grow.
function growPlant(plantGroup){

	//scales the plant down the further it goes to make it slightly skinner
	var plantScale = 1.1-(plantGroup.total/135);
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

		//Plays the plant growing sound
		if (!plantGrowingSound.isPlaying)
			plantGrowingSound.play();

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
				//Destroys the theoretical plant
				plant.destroy();
				plant = plantGroup.create(game.input.mousePointer.worldX, game.input.mousePointer.worldY, 'box');
				plant.body.immovable = true;
				plant.anchor.set(0.5);
				plant.scale.set(plantScale,plantScale);
				plant.body.syncBounds = true;
				if(plantGroup.total > 50 && plantGroup.total < 100){
					plant.tint = ((((50-plantGroup.total))*3) * 0xFFFFFF);
				}
				else if(plantGroup.total <= 50){
					plant.loadTexture('plant2');;
				}
				else if(plantGroup.total == 100){
					plant.loadTexture('endBox');
					plant.alpha = 0.5;
					plantFinishedSound.play();
				}
				plantMatter.push(plant);
			}
			else
				//destroys the theoretical plant
				plant.destroy();
		}
		else
		{
			//Destroys the theoretical plant
			plant.destroy();
		}

		//outputs to console the total remain plant "links" in a group
		//console.log('total plants: ' + plantGroup.total);

	}

}

//uses the distance formula and the (x,y) coordinates of
//two plants to find the distance between 2 plants
function distanceBetween(plantOne, plantTwo){

	var distance = Math.sqrt(Math.pow((plantTwo.x - plantOne.x), 2) + Math.pow((plantTwo.y - plantOne.y), 2));
	//console.log('distance: ' + distance);
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

//once a plant is touched by the player,
//a flag will change to prevent looping the sound
function plantSound(player){
	if(!plantImpacted)
	{
		plantImpact.play();
		plantImpacted = true;
	}
}

//creates a light pulse at the plant locations
function addLightPulse(x, y){
	var rand = (Math.random() * (2 - 1) + 1) * 1000;
	var light = game.add.sprite(x, y, 'lightfade');
	light.anchor.set(0.5);
	light.alpha = 0.15;
	light.moveDown();
	game.add.tween(light).to( { alpha: 0.35 }, rand, Phaser.Easing.Linear.None, true, 0, rand, true);
	game.add.tween(light.scale).to( { x: 2.5, y: 2.5 }, rand, Phaser.Easing.Linear.None, true, 0, rand, true);
}

//controls to move eveything then in light mode
//checks if the player is too close to the edge of the map and increases the peek distance acordingly
function cameraPanControls(){

	//camera panning using W,A,S,D to allow players to peek around things they cant see
	if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
		var temp = (game.world.height-250) - invisCameraBody.y;
		if(temp < 0){
			invisCameraBody.y -= 250-temp;
		}
		else
			invisCameraBody.y -= 250;

		pEyes.y -= 4;
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
		var temp = (game.world.width-350) - invisCameraBody.x;
		if(temp < 0){
			invisCameraBody.x -= 250-temp;
		}
		else
			invisCameraBody.x -= 250;

		pEyes.x -= 12;
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
		var temp = 250 - invisCameraBody.y;
		if(temp > 0){
			invisCameraBody.y += 250+temp;
		}
		else
			invisCameraBody.y += 250;

		pEyes.y += 2;
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
		var temp = 350 - invisCameraBody.x;
		if(temp > 0){
			invisCameraBody.x += 250+temp;
		}
		else
			invisCameraBody.x += 250;	

		pEyes.x += 12;
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
	uiElement.syncBounds = true;

}

//for creating UI Elements fixed to the camera
function createLedge(x, y, pic, scaleX, scaleY){

	var ledge = platforms.create(x, y, pic);
	ledge.scale.x = scaleX;
	ledge.scale.y = scaleY;
	if(game.state.getCurrentState().key != "Tutorial")
	{
		ledge.alpha = 0;
	}

	ledge.body.immovable = true;
	ledge.body.syncBounds = true;

}

//for creating UI Elements fixed to the camera
function createWall(x, y, pic, scaleX, scaleY, rotation){

	var wall = walls.create(x, y, pic);
	wall.scale.x = scaleX;
	wall.scale.y = scaleY;
	if(game.state.getCurrentState().key != "Tutorial")
	{
		wall.alpha = 0;
	}
	wall.body.immovable = true;
	wall.body.syncBounds = true;
	wall.angle = rotation;
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

//resets the last selected plant
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
        pEyes.anchor.set(bodyAnchor);
        //console.log(bodyAnchor);

        cameraScale += 0.005;
    	//console.log(cameraScale);
    }
}
//camera zoom out
function cameraZoomOut(){
	if(cameraScale >= 1.005){
    	cameraScale -= 0.0025;
    	game.camera.scale.x -= 0.0025;
    	game.camera.scale.y -= 0.0025;

        bodyAnchor -= 0.0025;
        player.anchor.set(bodyAnchor);
        pEyes.anchor.set(bodyAnchor);
        //console.log(bodyAnchor);

        cameraScale -= 0.0025;
    	//console.log(cameraScale);
    	//console.log(game.camera.width);
    }
}

//Resets the camera view, for use after cameraZoomOut
function cameraReset(){
    	game.camera.scale.x = 1;
    	game.camera.scale.y = 1;

        bodyAnchor = 0.5;
        player.anchor.set(bodyAnchor);
        pEyes.anchor.set(bodyAnchor);
        //console.log(bodyAnchor);

        cameraScale = 2;
    	//console.log(cameraScale);
    	//console.log(game.camera.width);
}

//flashes the player by repeatly making alpha 1 then 0
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
}

//Fades in the current state by starting with black and fading into the current state after a given delay and over a given duration
function fadeIn(delay, duration){
	//the black-in effect
        var blackout = game.add.sprite(0,0, 'blackout');	
        blackout.alpha = 1.0;
        game.time.events.add(Phaser.Timer.SECOND * delay, function() { game.add.tween(blackout).to({ alpha: 0 }, Phaser.Timer.SECOND * duration, "Linear", true);});
        game.time.events.add(Phaser.Timer.SECOND * (delay+duration), function() { blackout.destroy();});
}

//Fades the view to black and starts the given game state after a given delay, over a given duration, with an optional parameter for running cameraReset
function fadeOut(delay, duration, newGameState, camReset = false){
	//the black-in effect
        var blackout = game.add.sprite(0, 0, 'blackout');
        blackout.alpha = 0.0;
        if(newGameState != 'null'){
        	game.time.events.add(Phaser.Timer.SECOND * 0, function() { game.add.tween(blackout).to({ alpha: 1 }, 1500, "Linear", true);});
        	game.time.events.add(Phaser.Timer.SECOND * 1.75, function() { game.state.start(newGameState, true, false, camReset);});
    	}
    	else{
    		game.time.events.add(Phaser.Timer.SECOND * delay, function() { game.add.tween(blackout).to({ alpha: 1 }, Phaser.Timer.SECOND * duration, "Linear", true);});
    	}

    	game.time.events.add(Phaser.Timer.SECOND * (delay+duration), function() { blackout.destroy();});
}
// STATES -----------------------------------------------------------------------------------------------

// add states to StateManager and starts Loading
game.state.add('Loading', Loading);
game.state.add('MainMenu', MainMenu);
game.state.add('GamePlay', GamePlay);
game.state.add('Tutorial', Tutorial);
game.state.add('Credits' , Credits);
game.state.start('Loading');
