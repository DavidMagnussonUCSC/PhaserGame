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

// MAIN MENU STATE START -----------------------------------------------------------------------------------------------

var MainMenu = function(game) {};
MainMenu.prototype = {
	
	preload: function() {

		//setup for advanced timing (ex. fps debug)
		game.time.advancedTiming = true;

		//image setup/assets
		game.load.path = 'assets/img/';
		game.load.image('box', 'Box1.png');
		game.load.image('ui', 'UI.png');
		game.load.image('player', 'Player1.png');
		game.load.image('plant', 'Plant.png');
		game.load.image('particle', 'particle.png');
		game.load.image('plant2', 'Box2.png');
		game.load.image('endBox', 'endBox.png');
		game.load.image('lightMode', 'Player_LightMode1.png');
		game.load.image('platform', 'platform.png');
		game.load.image('exit', 'exit.png');
		game.load.image('fade', 'blackfade.png');
		game.load.image('highlight', 'PlantHighlight.png');
		game.load.image('leaf1', 'leaf1.png');
		game.load.image('leaf2', 'leaf21.png');
		game.load.image('leaf3', 'leaf3.png');
		game.load.image('lightfade', 'lightfade.png');
		game.load.image('blackout', 'blackout.png');
		game.load.image('eyes', 'eyes.png');
		game.load.image('creditfloor', 'creditfloor.png');
		game.load.image('credittree', 'credittree.png');

		//first level image assets
		game.load.image('plantlights', 'plantlights.png');
		game.load.image('floor', 'floor.png');
		game.load.image('plantlocations', 'plantlocations.png');
		game.load.image('foreground', 'foreground.png');
		game.load.image('bforeground', 'bforeground.png');
		game.load.image('farground', 'farground.png');

		//tutorial image assets
		game.load.image('tutplantlocations', 'tutplantlocations.png');
		game.load.image('tutplatforms', 'tutplatforms.png');
		game.load.image('tutfloor', 'tutfloor.png');
		game.load.image('tutforeground', 'tutforeground.png');
		game.load.image('tutbforeground', 'tutbforeground.png');
		game.load.image('tutfarground', 'tutfarground.png');

		//audio setup/assets
		game.load.path = 'assets/audio/';
		game.load.audio('pop', 'Jump_pop.wav');
		game.load.audio('slowBgMusic', 'Plant_Growing_Song.wav');
		game.load.audio('oof', 'Death.wav');
		game.load.audio('plantImpact', 'Plant_landing.mp3');
		game.load.audio('plantFinished', 'Plant_finishing.wav');
		game.load.audio('plantGrowing', 'Plant_growing.wav');
		game.load.audio('plantReset', 'Plant_reset.wav');
		game.load.audio('backgroundSound', 'Background_noise.wav');
		game.load.audio('lightModeSoundOn', 'Light_mode_on.wav');
		game.load.audio('lightModeSoundOff', 'Light_mode_off.wav');
		
		//allows for access to mouse information
		game.input.mouse.capture = true;
		
		//object to store keyboard inputs
		input = game.input.keyboard.createCursorKeys();

		//adds spacebar information to spacekey
		spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		//adds r key information to rKey
		rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);

		//adds mouse information to mouse
		mouse = game.input.activePointer;
	},

	create: function(){
		//sets main menu background color to forest green
		game.stage.backgroundColor = "#081f1f";
		game.world.setBounds(0, 0, 1000, 800);

		//leaf background stuff
	    var back_emitter = game.add.emitter(game.world.centerX, -32, 500);
    	back_emitter.makeParticles(['leaf2']);
	    back_emitter.maxParticleScale = 0.35;
	    back_emitter.minParticleScale = 0.15;
	    back_emitter.maxParticleAlpha = 0.75;
	    back_emitter.minParticleAlpha = 0.5;
	    back_emitter.setYSpeed(20, 100);
	    back_emitter.gravity = 0;
	    back_emitter.width = game.world.width * 1.25;
	    back_emitter.minRotation = 0;
	    back_emitter.maxRotation = 40;

	    //This will emit a quantity of 1 leaf particle every 450ms. Each particle will live for 30000ms.
	    back_emitter.start(false, 30000, 450);

		//Creates the background tree
		var tree = game.add.sprite(game.world.centerX-220, game.world.centerY, 'credittree');
		tree.anchor.set(0.5);
		tree.scale.x = 0.75;
		tree.scale.y = 0.75;
		
		//Adds instruction text
		var text = game.add.text(game.world.centerX, 250, '~ Flourish ~', { fontSize: '128px', fill: '#fff'});
		text.addColor('#fff', 0);
		text.anchor.set(0.5);

		//Play button to start game
		var button1 = game.add.button(game.world.centerX, game.world.centerY+100, 'platform', function(){fadeOut(1, 1, 'Tutorial');}, this, 2, 1, 0);
		button1.anchor.set(0.5);
		button1.scale.y = 2;
		var text1 = game.add.text(game.world.centerX, game.world.centerY+100, 'Play', { fontSize: '32px', fill: '#000' });
		text1.anchor.set(0.5);
		button1.onInputOver.add(function(){button1.scale.x = 1.15; text1.addColor('#f3f38c', 0);}, this);
		button1.onInputOut.add(function(){button1.scale.x = 1; text1.addColor('#000', 0);}, this);
    	button1.onInputUp.add(function(){button1.scale.x = 1.15; text1.addColor('#fff', 0);}, this);
		
		//Credits button for credits screen
		var button3 = game.add.button(game.world.centerX+400, 750, 'platform', function(){fadeOut(1, 1, 'Credits');}, this, 2, 1, 0);
		button3.anchor.set(0.5);
		button3.scale.y = 2;
		button3.alpha = 0;
		var text3 = game.add.text(game.world.centerX+400, 750, 'Credits', { fontSize: '32px', fill: '#fff' });
		text3.anchor.set(0.5);
		text3.alpha = 0.1;
		button3.onInputOver.add(function(){button3.scale.x = 1.15; text3.addColor('#f3f38c', 0);}, this);
		button3.onInputOut.add(function(){button3.scale.x = 1; text3.addColor('#fff', 0);}, this);
    	button3.onInputUp.add(function(){button3.scale.x = 1.15; text3.addColor('#000', 0);}, this);

		//Fade in for opening screen
		fadeIn(1.25, 1.5);
	},

	update: function() {
	}
}

// MAIN MENU STATE END -----------------------------------------------------------------------------------------------

// PLAY STATE START -----------------------------------------------------------------------------------------------

//TUTORIAL State
var Tutorial = function(game) {};
Tutorial.prototype = {
	
	create: function(){
		
		//sets game background color to light dark green
		game.stage.backgroundColor = "#235347"; 
		
		//enable arcade physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//Set game world size to double the viewable area of the game
		game.world.setBounds(0, 0, game.width*7, game.height*2);

		//Tutorial background and farground art
		var tutfarground = game.add.sprite(0, 0, 'tutfarground');
		var tutbforeground = game.add.sprite(0, 0, 'tutbforeground');

		//leaf background stuff
	    var back_emitter = game.add.emitter(game.world.centerX, -32, 500);
    	back_emitter.makeParticles(['leaf2']);
	    back_emitter.maxParticleScale = 0.35;
	    back_emitter.minParticleScale = 0.15;
	    back_emitter.maxParticleAlpha = 0.75;
	    back_emitter.minParticleAlpha = 0.5;
	    back_emitter.setYSpeed(20, 100);
	    back_emitter.gravity = 0;
	    back_emitter.width = game.world.width * 1.25;
	    back_emitter.minRotation = 0;
	    back_emitter.maxRotation = 40;

	    //This will emit a quantity of 1 leaf particle every 450ms. Each particle will live for 30000ms.
	    back_emitter.start(false, 30000, 450);
		
		//Tutorial Text
		game.add.text(32, game.world.height - 600, 'Use W,A,S,D to move', { fontSize: '32px', fill: '#f3f38c' });
		game.add.text(32, game.world.height - 500, 'Use the W arrow to jump! (Hold for slow fall)', { fontSize: '32px', fill: '#f3f38c' });
		game.add.text(1150, game.world.height - 600, 'You can peek the camera to view things a bit away!', { fontSize: '32px', fill: '#f3f38c' });
		game.add.text(1150, game.world.height - 500, 'Press space to switch forms to root yourself and stop moving', { fontSize: '32px', fill: '#f3f38c' });
		game.add.text(1150, game.world.height - 400, 'While rooted, Use the WASD keys to peek the camera', { fontSize: '32px', fill: '#f3f38c' });
		game.add.text(2100, game.world.height - 600, 'Jump off the edge and hold the jump', { fontSize: '22px', fill: '#f3f38c' });
		game.add.text(2100, game.world.height - 550, 'key to slow fall to this platform!', { fontSize: '22px', fill: '#f3f38c' });
		game.add.text(3260, game.world.height - 600, 'While in the rooted form,', { fontSize: '16px', fill: '#f3f38c' });
		game.add.text(3260, game.world.height - 575, 'you can grow plants!', { fontSize: '16px', fill: '#f3f38c' });
		game.add.text(3260, game.world.height - 525, 'Click and drag on glowing plant nodes', { fontSize: '16px', fill: '#f3f38c' });
		game.add.text(3260, game.world.height - 500, 'to grow plant platforms! Only one can be', { fontSize: '16px', fill: '#f3f38c' });
		game.add.text(3260, game.world.height - 475, 'grown at a time per node, and once created', { fontSize: '16px', fill: '#f3f38c' });
		game.add.text(3260, game.world.height - 450, 'the platform is always grown from its end.', { fontSize: '16px', fill: '#f3f38c' });
		game.add.text(3260, game.world.height - 400, '(If you mess up, press R to reset the', { fontSize: '16px', fill: '#f3f38c' });
		game.add.text(3260, game.world.height - 375, 'currently selected plant. You can', { fontSize: '16px', fill: '#f3f38c' });
		game.add.text(3260, game.world.height - 350, 'select a plant by clicking any', { fontSize: '16px', fill: '#f3f38c' });
		game.add.text(3260, game.world.height - 325, 'part of it.)', { fontSize: '16px', fill: '#f3f38c' });
		game.add.text(3800, game.world.height - 580	, 'Each plant platform does have a', { fontSize: '22px', fill: '#f3f38c' });
		game.add.text(3800, game.world.height - 550	, 'maximum length, shown when the', { fontSize: '22px', fill: '#f3f38c' });
		game.add.text(3800, game.world.height - 520	, 'end of it becomes yellow.', { fontSize: '22px', fill: '#f3f38c' });
		game.add.text(4260, game.world.height - 480	, 'Sometimes plant nodes are out of view.', { fontSize: '22px', fill: '#f3f38c' });
		game.add.text(4260, game.world.height - 450	, 'You will need to grow while peeking to', { fontSize: '22px', fill: '#f3f38c' });
		game.add.text(4260, game.world.height - 420	, 'use the plant node in the upper right!', { fontSize: '22px', fill: '#f3f38c' });
		game.add.text(5500, game.world.height - 875	, 'Good job, now heres one last trick!', { fontSize: '22px', fill: '#f3f38c' });
		game.add.text(5500, game.world.height - 825	, 'You can stand on something else, reset', { fontSize: '22px', fill: '#f3f38c' });
		game.add.text(5500, game.world.height - 800	, 'a plant, and grow it in another direction', { fontSize: '22px', fill: '#f3f38c' });
		game.add.text(5500, game.world.height - 775	, 'to progress! Try with the offscreen plant!', { fontSize: '22px', fill: '#f3f38c' });
		game.add.text(6750, game.world.height - 800, 'Good luck!', { fontSize: '22px', fill: '#f3f38c' });
		
		//makes the player object and adds it to its group
		//adds bounce to the player
		//sets player gravity and physic variables
		players = game.add.group();
		players.enableBody = true;
		player = players.create(264, game.world.height-190, 'player');
		player.anchor.set(0.5);
		player.body.bounce.y = .02;
		player.body.gravity.y = 200;
		player.body.maxVelocity = 0;
		player.body.syncBounds = true;

		//player eyes
		pEyes = game.add.sprite(player.x, player.y, 'eyes');
		pEyes.anchor.set(0.5);

		//creating the pulse behind the player then in light mode
		plight = game.add.sprite(player.x, player.y, 'lightfade');
		plight.anchor.set(0.5);
		plight.alpha = 0.0;
		plight.moveDown();

		//where the camera is connected to and controlled manually if needed
		invisCameraBody = game.add.sprite(player.x, player.y, 'box');
		invisCameraBody.enableBody = true;
		invisCameraBody.alpha = 0;
		invisCameraBody.anchor.set(0.5);
		//Camera follows invisible body
		game.camera.follow(invisCameraBody, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);
		
		//setup for audio stuff
		
		//audio for jump
		pop = game.add.audio('pop');
		pop.volume = 0.5;
	   
	    //audio for fall off map sound
	    oof = game.add.audio('oof');
	    oof.volume = 0.5;

	    //looping background music
	    songLoop = game.add.audio('slowBgMusic');
	    songLoop.volume = 0.05;
	    songLoop.loop = true;
	    songLoop.play();

	    //sound when landing on plants
		plantImpact = game.add.audio('plantImpact');
		plantImpact.volume = 0.25;

		//sound triggered when plant limit is reached
		plantFinishedSound = game.add.audio('plantFinished');
		plantFinishedSound.volume = 0.5;

		//sound looped while growing plants
		plantGrowingSound = game.add.audio('plantGrowing');
		plantGrowingSound.volume = 0.5;
		plantGrowingSound.loop = true;

		//sound played when a plant is reset
		plantResetSound = game.add.audio('plantReset');
		plantResetSound.volume = 0.5;

		//ambient background noises
		ambientSound = game.add.audio('backgroundSound');
		ambientSound.volume = 0.16;

		//sound played when entering light mode
		lightModeSoundOn = game.add.audio('lightModeSoundOn');
		lightModeSoundOn.volume = 0.1;

		//sound played when exiting light mode
		lightModeSoundOff = game.add.audio('lightModeSoundOff');
		lightModeSoundOff.volume = 0.0625;

		//Adds platforms Group and enables physics for them
		platforms = game.add.group();
		platforms.enableBody = true;
		
		//Creates tutorial platforms
		createLedge(-200,game.world.height-125, 'platform', 1.1, 100);
		createLedge(200, game.world.height-125, 'platform', 1.1, 100);
		createLedge(632, game.world.height-221, 'platform', 1.1, 100);
		createLedge(1064, game.world.height-317, 'platform', 1.1, 100);
		createLedge(1464, game.world.height-317, 'platform', 1, 100);

		createLedge(2400, game.world.height-217, 'platform', 1, 100);
		createLedge(3050, game.world.height-217, 'platform', 1, 100);

		createLedge(3600, game.world.height-400, 'platform', 0.5, 100);
		createLedge(3700, game.world.height-280, 'platform', 0.5, 100);
		createLedge(3800, game.world.height-175, 'platform', 1, 100);

		createLedge(4810, game.world.height-700, 'platform', 1, 100); //plant platform
		createLedge(4950, game.world.height-622, 'platform', 1, 100);
		createLedge(5150, game.world.height-515, 'platform', 1, 100);

		createLedge(6200, game.world.height - 512, 'platform', 0.1, 100);
		createLedge(6850, game.world.height - 532, 'platform', 1, 100);

		//adds tutorial floor and the plant lights
		var tutfloor = game.add.sprite(0, 0, 'tutfloor');
		var plantlights = game.add.sprite(0, 0, 'tutplantlocations');

		//Create the plants in positions modeled after the paper prototype(some modifications)
		createPlant(3600, game.world.height - 400);
		createPlant(4810, game.world.height - 690);
		createPlant(6220, game.world.height - 490);

		//sprite to make it look like a pit at the botom of the screen
		var pit = game.add.sprite(0, game.world.height-200, 'fade');
		pit.scale.x = 10; //improvised extension for tutorial
		pit.scale.y = 0.2;

		//these are acting as the boundary around the game (off screen)
		walls = game.add.group();
		walls.enableBody = true;
		createWall(-32, -game.world.height/2, 'box', 1, 75, 0);
		createWall(game.world.width+1, -game.world.height/2, 'box', 1, 75, 0);
		
		//adds exit door at the end of the level to transition to first level
		exits = game.add.group();
		exits.enableBody = true;
		var exit = exits.create(7000, 1000, 'exit');
		exit.alpha = 0;
		exit.anchor.set(0.5);
		
		//Sets flags used for animations/lightmode to false
		cameraMoving = false;
		isLightMode = false;

		//fades in to the level
		fadeIn(1.25, 1.5);
	
	},
	
	update: function(){

		//moves the invis camera body to the player
		invisCameraBody.x = player.x;
		invisCameraBody.y = player.y;

		//moving player light pulse
		plight.x = player.x;
		plight.y = player.y;

		//Sets player eye positions, accounting for transition at tutorial end
		if(wallCollision == false){
			pEyes.x = (player.x+14);	
		}
		else{
			pEyes.x = player.x;
		}
		pEyes.y = (player.y+4);

		//collision detection for player and plants
		//collision detection for ground/platforms and player
		//collision detection for walls (Able to be turned off)
		game.physics.arcade.collide(player, plantMatter, plantSound);
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(player, walls, null, function(){ return wallCollision});

		//play ambient noises at random intervals
		if (Math.random() < 0.001)
    	{
    		ambientSound.play();
   		}

		//isDown will be true if the left click
		//is down. The forEach function will browse
		//through all existing plant groups to see
		//which one is being clicked, so that the 
		//right plant will grow
		if (game.input.activePointer.isDown){
			plants.forEach(identifyPlantGroup);
			if(activeGroup != undefined){
				//console.log(activeGroup);
				growPlant(activeGroup);
			}
		}
		else if(plantGrowingSound.isPlaying) //plantgrowing sound stops when plant growing stops
			plantGrowingSound.stop();

		//resets plant to original state
		if(rKey.downDuration(1)){
			resetPlant(activeGroup);
			plantResetSound.play(); //plant resetting sound
		}

		//upon pressing the spacebar, you can alternate
		//from player mode and light mode as long as player is on a surface
		if (spaceKey.downDuration(1) && player.body.touching.down && isLightMode == false && !cameraMoving)
		{
			//lightmode transition sound
			lightModeSoundOn.play();
			//sets player to lightmode
			isLightMode = true;
			player.loadTexture('lightMode');
			//player tweening blink in light mode
			blink = game.add.tween(plight).to( { alpha: 0.45 }, 1500, Phaser.Easing.Linear.None, true, 0, 1500, true);
			blinkScale = game.add.tween(plight.scale).to( { x: 2.5, y: 2.5 }, 1500, Phaser.Easing.Linear.None, true, 0, 1500, true);
		}
		else if(spaceKey.downDuration(1) && isLightMode == true && !cameraMoving)
		{
			//lightmode transition sound, exiting lightmode
			lightModeSoundOff.play();
			//sets player out of lightmode
			isLightMode = false;
			player.loadTexture('player');
			//stops the player blinking effect
			blink.stop();
			blinkScale.stop();
			plight.alpha = 0;
			plight.scale.x = 1;
			plight.scale.y = 1;
		}
		
		//a bunch of camera checks to prevent the player from moving
		if(isLightMode == true && !cameraMoving){
			//prevents player sliding when changing forms
			if(player.body.velocity.x != 0)
			{
				player.body.velocity.x = 0;
			}
			//camera Panning
			cameraPanControls();
		}
		else if(!cameraMoving){
			//the following if/else statements allows for player movement
			if (game.input.keyboard.isDown(Phaser.Keyboard.A) && !isLightMode){
				player.body.velocity.x = -150;
				pEyes.x -= 14;
			}
			else if (game.input.keyboard.isDown(Phaser.Keyboard.D) && !isLightMode){
				player.body.velocity.x = 150;
				pEyes.x += 14;
			}
			else
			{
				//sets player velocity to 0 if nothing is being pressed
				player.body.velocity.x = 0;
			}

			//Jumping, works if touching the ground and not in light mode
			if (game.input.keyboard.isDown(Phaser.Keyboard.W) && !isLightMode && player.body.touching.down){
				player.body.velocity.y = -225;
				pop.play();//jumping sound
				//variables for regulating landing sounds
				plantImpacted = false;
				landed = false;
			}
		}

		//if UP is held while falling, it makes a "floaty" fall
		if(player.body.velocity.y > 50 && game.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			player.body.velocity.y = 50;
		}

		//if the player falls to the bottom of the screen it resets them to starting point
		//flashes the player for a couple seconds
		//if they were in light mode resets them and their pulse
		if(player.y > game.world.height+player.height){
			//player "death" fadeout
			fadeOut(0.5, 1, 'null');

			// "death" sound
			oof.play();
	
			//Makes sure player can't move while being reset, and stops/loads necessary player elements
			isLightMode = true;
			cameraMoving = true;
			player.loadTexture('player');
			if(blink != undefined){
				blink.stop();
				blinkScale.stop();
			}
			plight.alpha = 0;
			plight.scale.x = 1;
			plight.scale.y = 1;

			//Resets the player after a second and fades in to player position
			game.time.events.add(1000, function() { 
				isLightMode = false;
				cameraMoving = false;
				player.reset(80,game.world.height-250);
				fadeIn(0, 1);
			});

		}

/* 		//manual camera zoom in
		if(game.input.keyboard.isDown(Phaser.Keyboard.O)){
			zoomLoop = game.time.events.repeat(10, 150, cameraZoomIn, this);
	    }
	    //manual camera zoom out
	    if(game.input.keyboard.isDown(Phaser.Keyboard.P)){
	    	zoomLoop = game.time.events.repeat(10, 150, cameraZoomOut, this);
	    } 
		Useful dev tool, commented out for final build as it will crash the tutorial and cause bugs in level
		*/
		
		//Goes to game over screen if exit is reached
		if(game.physics.arcade.collide(player, exits))
		{
			//Exit animation
			game.physics.arcade.moveToXY(player, player.body.x + 120, player.body.y, 60, 2000);//player tutorial exit animation
			wallCollision = false; //allows animation to go through wall
			cameraMoving = true;
			lightMode = true;
			//Level fadeout and song loop destruction
			game.time.events.add(500, function() {fadeOut(1, 1, 'GamePlay');});
			game.time.events.add(1500, function() {songLoop.destroy();});
		}

		//used for debugging purposes
		//render();
	}
}

//Gameplay State --------------------------------------------------------------------------------------------------------
var GamePlay = function(game) {};
GamePlay.prototype = {
	
	create: function(){
		//Turns off wall collision for entry animation
		wallCollision = false;

		//sets game background color to light dark green
		game.stage.backgroundColor = "#235347"; 
		
		//enable arcade physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//Set game world size to double the viewable area of the game
		game.world.setBounds(0, 0, game.width*2, game.height*2);

		//Adds farground art and sends it to the back
		farground = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'farground');
		farground.sendToBack();
		//Adds background art
		var bforeground = game.add.sprite(0, 0, 'bforeground');

		//leaf background stuff
	    var back_emitter = game.add.emitter(game.world.centerX, -32, 500);
    	back_emitter.makeParticles(['leaf2']);
	    back_emitter.maxParticleScale = 0.35;
	    back_emitter.minParticleScale = 0.15;
	    back_emitter.maxParticleAlpha = 0.75;
	    back_emitter.minParticleAlpha = 0.5;
	    back_emitter.setYSpeed(20, 100);
	    back_emitter.gravity = 0;
	    back_emitter.width = game.world.width * 1.25;
	    back_emitter.minRotation = 0;
	    back_emitter.maxRotation = 40;

	    //  This will emit a quantity of leaf 1 particle every 450ms. Each particle will live for 30000ms.
	    back_emitter.start(false, 30000, 450);
		
		//makes the player object and adds it to its group
		//adds bounce to the player
		//sets player gravity and physics variables
		players = game.add.group();
		players.enableBody = true;
		player = players.create(-64, game.world.height-157, 'player');
		player.anchor.set(0.5);
		player.body.bounce.y = .02;
		player.body.gravity.y = 200;
		player.body.maxVelocity = 0;
		player.body.syncBounds = true;

		//player eyes
		pEyes = game.add.sprite(player.x, player.y, 'eyes');
		pEyes.anchor.set(0.5);

		//creating the pulse behind the player then in light mode
		plight = game.add.sprite(player.x, player.y, 'lightfade');
		plight.anchor.set(0.5);
		plight.alpha = 0.0;
		plight.moveDown();

		//code to be able to move the camera manually or automatically
		invisCameraBody = game.add.sprite(player.x, player.y, 'box');
		invisCameraBody.enableBody = true;
		invisCameraBody.alpha = 0;
		invisCameraBody.anchor.set(0.5);
		
		//Camera follows player
		game.camera.follow(invisCameraBody,Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);

		//Adds platforms Group and enables physics for them
		platforms = game.add.group();
		platforms.enableBody = true;
		//adds level platforms
		createLedge(-200,game.world.height-125, 'platform', 1, 1);
		createLedge(game.world.width-175, 275, 'platform', 1, 1);

		//setup for audio stuff
		
		//audio for jump
		pop = game.add.audio('pop');
		pop.volume = 0.5;
	   
	    //audio fall off map sound
	    oof = game.add.audio('oof');
	    oof.volume = 0.5;

	    //slow audio looping background music
	    songLoop = game.add.audio('slowBgMusic');
	    songLoop.volume = 0.05;
	    songLoop.loop = true;
	    songLoop.play();

	    //sound when landing on plants
		plantImpact = game.add.audio('plantImpact');
		plantImpact.volume = 0.25;

		//sound triggered when plant limit is reached
		plantFinishedSound = game.add.audio('plantFinished');
		plantFinishedSound.volume = 0.5;

		//sound looped while growing plants
		plantGrowingSound = game.add.audio('plantGrowing');
		plantGrowingSound.volume = 0.5;
		plantGrowingSound.loop = true;

		//sound played when a plant is reset
		plantResetSound = game.add.audio('plantReset');
		plantResetSound.volume = 0.5;

		//ambient background noises
		ambientSound = game.add.audio('backgroundSound');
		ambientSound.volume = 0.16;

		//sound played when entering light mode
		lightModeSoundOn = game.add.audio('lightModeSoundOn');
		lightModeSoundOn.volume = 0.1;

		//sound played when exiting light mode
		lightModeSoundOff = game.add.audio('lightModeSoundOff');
		lightModeSoundOff.volume = 0.0625;

		//adds exit door at the end of the level to trigger GameOver
		exits = game.add.group();
		exits.enableBody = true;
		var exit = exits.create(game.world.width - 10, 210, 'exit');
		exit.body.immovable = true;
		exit.alpha= 0.1 ;
		exit.anchor.set(0.5);

		//sprite to make it look like a pit at the botom of the screen
		var pit = game.add.sprite(0, game.world.height-200, 'fade');
		pit.scale.x = 1.1;
		pit.scale.y = 0.2;

		//these are acting as the boundary around the game (off screen)
		walls = game.add.group();
		walls.enableBody = true;
 		createWall(-32, -game.world.height/2, 'box', 1, 75);
		createWall(game.world.width+1, -game.world.height/2, 'box', 1, 75);

		//creates the walls as a passage block (seen on screen)
		createWall(1015, -253, 'box', 1, 10, 0);
		createWall(616, 615, 'box', 3.9, 35, 0);

		//sprite for initial floor
		var floor = game.add.sprite(0, 0, 'floor');
		//adds foreground art
		var foreground = game.add.sprite(0, 0, 'foreground');
		
		//adds plantlights
		var plantlights = game.add.sprite(0, 0, 'plantlights');

		//Create the plants in positions modeled after the paper prototype(some modifications)
		createPlant(355, 1200);
		createPlant(678, 610);
		createPlant(1022, 98);
		createPlant(1526, 804);

		//Player entry animation with accompanying necessary flags
		game.physics.arcade.moveToXY(player, 80, game.world.height-189, 60, 2000);//player entry animation
		wallCollision = false;
		cameraMoving = true;
		lightMode = true;
		//Delay for turning off the flag for when player has finished entry animation
		game.time.events.add(2100, function() { 
					cameraMoving = false;
					lightMode = false;
					console.log('start');
					wallCollision = true;
				});

		//level fade in
		fadeIn(1.25, 1.5);

	},

	update: function(){

		//slight background paralax scrolling
		farground.x = -game.camera.x/12;

		//moving camera body
		invisCameraBody.x = player.x;
		invisCameraBody.y = player.y;

		//moving player light pulse
		plight.x = player.x;
		plight.y = player.y;

		//play ambient noises at random intervals
		if (Math.random() < 0.001)
    	{
    		ambientSound.play();
   		}

		//Sets player eye positions, accounting for transition at level start
		if(wallCollision == false){
			pEyes.x = (player.x+14);	
		}
		else{
			pEyes.x = player.x;
		}
		pEyes.y = (player.y+4);

		//collision detection for player and plants
		//collision detection for ground/platforms and player
		//collision detection for walls (Able to be turned off)
		game.physics.arcade.collide(player, plantMatter, plantSound);
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(player, walls, null, function(){ return wallCollision}); //Collision detection for walls, added like so so player can slide in from offscreen.


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
		else if(plantGrowingSound.isPlaying) //plantgrowing sound stops when plant growing stops
			plantGrowingSound.stop();

		//resets plant to original state
		if(rKey.downDuration(1) && !cameraMoving){
			resetPlant(activeGroup);
			plantResetSound.play(); //plant resetting sound
		}

		//upon pressing the spacebar, you can alternate
		//from player mode and light mode as long as player is on a surface
		//sets and resets the pulsing player behaviour
		if (spaceKey.downDuration(1) && player.body.touching.down && isLightMode == false && !cameraMoving)
		{
			//lightmode transition sound
			lightModeSoundOn.play();
			//sets player to lightmode
			isLightMode = true;
			player.loadTexture('lightMode');
			//player tweening blink in light mode
			blink = game.add.tween(plight).to( { alpha: 0.45 }, 1500, Phaser.Easing.Linear.None, true, 0, 1500, true);
			blinkScale = game.add.tween(plight.scale).to( { x: 2.5, y: 2.5 }, 1500, Phaser.Easing.Linear.None, true, 0, 1500, true);
		}
		else if(spaceKey.downDuration(1) && isLightMode == true && !cameraMoving)
		{
			//lightmode transition sound, exiting lightmode
			lightModeSoundOff.play();
			//sets player out of lightmode
			isLightMode = false;
			player.loadTexture('player');
			//stops the player blinking effect
			blink.stop();
			blinkScale.stop();
			plight.alpha = 0;
			plight.scale.x = 1;
			plight.scale.y = 1;
		}
		
		//a bunch of camera checks to prevent the player from moving
		if(isLightMode == true && !cameraMoving){
			//prevents player sliding when changing forms
			if(player.body.velocity.x != 0)
			{
				player.body.velocity.x = 0;
			}
			//camera Panning
			cameraPanControls();
		}
		else if(!cameraMoving){
			//the following if/else statements allows for player movement
			if (game.input.keyboard.isDown(Phaser.Keyboard.A) && !isLightMode){
				player.body.velocity.x = -150;
				pEyes.x -= 14;
			}

			else if (game.input.keyboard.isDown(Phaser.Keyboard.D) && !isLightMode){
				player.body.velocity.x = 150;
				pEyes.x += 14;
			}
			else{
				//sets player velocity to 0 if nothing is being pressed
				player.body.velocity.x = 0;
			}

			//Jumping, works if touching the ground and not in light mode
			if (game.input.keyboard.isDown(Phaser.Keyboard.W) && !isLightMode && player.body.touching.down){
				player.body.velocity.y = -225;
				pop.play(); //jumping sound
				//variables for regulating landing sound
				plantImpacted = false;
				landed = false;
			}
		}

		//if UP is held while falling, it makes a "floaty" fall
		if(player.body.velocity.y > 50 && game.input.keyboard.isDown(Phaser.Keyboard.W) && !cameraMoving)
		{
			player.body.velocity.y = 50;
		}

		//if the player falls to the bottom of the screen it resets them to starting point
		//flashes the player for a couple seconds
		//if they were in light mode resets them and their pulse
		if(player.y > game.world.height+player.height){
			//player "death" fadeout
			fadeOut(0.5, 1, 'null');

			// "death" sound
			oof.play();
	
			//Makes sure player can't move while being reset, and stops/loads necessary player elements
			isLightMode = true;
			cameraMoving = true;
			player.loadTexture('player');
			if(blink != undefined){
				blink.stop();
				blinkScale.stop();
			}
			plight.alpha = 0;
			plight.scale.x = 1;
			plight.scale.y = 1;

			//Resets the player after a second and fades in to player position
			game.time.events.add(1000, function() { 
				isLightMode = false;
				cameraMoving = false;
				player.reset(80,game.world.height-250);
				fadeIn(0, 1);
			});

		}

/* 		//manual camera zoom in
		if(game.input.keyboard.isDown(Phaser.Keyboard.O)){
			zoomLoop = game.time.events.repeat(10, 150, cameraZoomIn, this);
	    }
	    //manual camera zoom out
	    if(game.input.keyboard.isDown(Phaser.Keyboard.P)){
	    	zoomLoop = game.time.events.repeat(10, 150, cameraZoomOut, this);
	    } 
		Useful dev tool, commented out for final build as it will crash the tutorial and cause bugs in level
		*/
		
		//Goes to game over screen if exit is reached
		if(game.physics.arcade.collide(player, exits) && exitReached == false)
		{
			//sets flags
			exitReached = true;
			cameraMoving = true;
			//zoom out animation
			game.time.events.add(1000, function() { 
				zoomLoop = game.time.events.repeat(10, 200, cameraZoomOut, this);
			});
			//Fades to game over after delay
			game.time.events.add(7500, function() { 
				readyStart = false;
				fadeOut(1,1,"Credits", true);
				game.time.events.add(1000, function() {songLoop.destroy();}); //destroys song loop after fade out
			});
		}


		//used for debugging purposes
		//render();
	}
}

// PLAY STATE END -----------------------------------------------------------------------------------------------

// CREDITS STATE -----------------------------------------------------------------------------------------------

//Credits state
var Credits = function(game) {};
Credits.prototype = {
	
	//If a camera reset is needed, resets the camera.
	init: function(camReset)
	{
		if(camReset == true)
		{
			cameraReset();
		}
	},
	
	create: function(){

		//sets world boundaries
		game.world.setBounds(0, 0, 1000, 800);
		//sets credits background color to light dark green
		game.stage.backgroundColor = "#235347";

		//leaf background stuff
	    var back_emitter = game.add.emitter(game.world.centerX, -32, 500);
    	back_emitter.makeParticles(['leaf2']);
	    back_emitter.maxParticleScale = 0.35;
	    back_emitter.minParticleScale = 0.15;
	    back_emitter.maxParticleAlpha = 0.75;
	    back_emitter.minParticleAlpha = 0.5;
	    back_emitter.setYSpeed(20, 100);
	    back_emitter.gravity = 0;
	    back_emitter.width = game.world.width * 1.25;
	    back_emitter.minRotation = 0;
	    back_emitter.maxRotation = 40;

		//This will emit a quantity of 1 leaf particle every 450ms. Each particle will live for 30000ms.
	    back_emitter.start(false, 30000, 450);

		//adds credits screen background tree
		var tree = game.add.sprite(game.world.centerX-220, game.world.centerY, 'credittree');
		tree.anchor.set(0.5);
		tree.scale.x = 0.75;
		tree.scale.y = 0.75;
		
		//Creates player character on credits screen
		players = game.add.group();
		players.enableBody = true;
		player = players.create(game.world.centerX, game.world.centerY, 'lightMode');
		player.anchor.set(0.5);
		player.body.bounce.y = .02
		player.body.maxVelocity = 0;
		player.body.syncBounds = true;

		//player eyes
		pEyes = game.add.sprite(player.x-14, player.y+4, 'eyes');
		pEyes.anchor.set(0.5);

		//creating the pulse behind the player then in light mode
		plight = game.add.sprite(player.x, player.y, 'lightfade');
		plight.anchor.set(0.5);
		plight.alpha = 0.0;
		plight.moveDown();

		//Adds tweening for player pulsing
		blink = game.add.tween(plight).to( { alpha: 0.45 }, 1500, Phaser.Easing.Linear.None, true, 0, 1500, true);
		blinkScale = game.add.tween(plight.scale).to( { x: 2.5, y: 2.5 }, 1500, Phaser.Easing.Linear.None, true, 0, 1500, true);
		
		//Adds art asset for credits screen floor
		var floor = game.add.sprite(game.world.centerX+200, game.world.centerY+220, 'creditfloor');
		floor.anchor.set(0.5);
		floor.scale.x = 3;
		floor.scale.y = 3;

		//Credits
		var text = game.add.text(game.world.centerX, 64, 'Thanks for Playing!', { fontSize: '64px', fill: '#fff' });
		text.anchor.set(0.5);
		var text = game.add.text(16, 466, 'Made By:', { fontSize: '24px', fill: '#f3f38c' });
		var text = game.add.text(16, 518, '- Anthony Diaz, Alain Kassarjian, and David Magnusson', { fontSize: '24px', fill: '#fff' });
		var text = game.add.text(16, 570, 'Special Thanks to:', { fontSize: '24px', fill: '#f3f38c' });
		var text = game.add.text(16, 610, '- Varick, for game conception and other various contributions', { fontSize: '24px', fill: '#fff' });
		var text = game.add.text(16, 660, '- Elizabeth and Nathan, for being wonderful and great Professors!', { fontSize: '24px', fill: '#fff' });
		var text = game.add.text(16, 710, 'And all the wonderful TAs for 120 in 2019', { fontSize: '24px', fill: '#fff' });
		//instruction text
		var text = game.add.text(700, 750, '[SPACEBAR] Main Menu', { fontSize: '24px', fill: '#f3f38c' }); 
		text.addColor('#fff', 10);

		//credits fade in
		fadeIn(1.25, 1.5);
		
	},

	update: function(){

		//Checks for space bar being pressed for return to main menu
		if(spaceKey.isDown){
				fadeOut(1.25,1.5,"MainMenu");//Fades back to main menu if spacebar is pressed
		}
	
	}

}

// CREDITS STATE END -----------------------------------------------------------------------------------------------


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


// add states to StateManager and starts MainMenu
game.state.add('MainMenu', MainMenu);
game.state.add('GamePlay', GamePlay);
game.state.add('Tutorial', Tutorial);
game.state.add('Credits' , Credits);
game.state.start('MainMenu');