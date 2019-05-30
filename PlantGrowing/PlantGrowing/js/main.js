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

//a camera moving check to prevent the player from moving
var cameraMoving = true;

//Var for level exits/victory
var invisCameraBody;

//for some parralax scrolling
var farground;

//timing for player light blink/scale
//variable in charge of the player back light
var plight;
var blink;
var blinkScale;

//shows most recent plant through particles(still buggy)
var plantEmitter;

//a check for pressing space
var readyStart = false;

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
		game.load.image('lightMode', 'Player_LightMode1.png');
		game.load.image('platform', 'platform.png');
		game.load.image('exit', 'exit.png');
		game.load.image('fade', 'blackfade.png');
		game.load.image('highlight', 'PlantHighlight.png');
		game.load.image('floor', 'floor.png');
		game.load.image('plantlocations', 'plantlocations.png');
		game.load.image('foreground', 'foreground.png');
		game.load.image('bforeground', 'bforeground.png');
		game.load.image('farground', 'farground.png');
		game.load.image('leaf1', 'leaf1.png');
		game.load.image('leaf2', 'leaf21.png');
		game.load.image('leaf3', 'leaf3.png');
		game.load.image('plantlights', 'plantlights.png');
		game.load.image('lightfade', 'lightfade.png');

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

		var text = game.add.text(16, 108, '* Use the "W,A,S,D" to move and jump, Hold the "W"', { fontSize: '32px', fill: '#000' });
		//  And now we'll color in some of the letters
    	text.addColor('#ffff00', 10);
    	text.addColor('#000', 20);
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

		var text = game.add.text(16, 508, "* While the holding SHIFT, PEEK the Camera ", { fontSize: '32px', fill: '#000' });
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

//TUTORIAL State
var Tutorial = function(game) {};
Tutorial.prototype = {
	
	create: function(){
		//sets game background color to navy blue
		game.stage.backgroundColor = "#228B22"; 
		
		//enable arcade physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//Set game world size to double the viewable area of the game
		game.world.setBounds(0, 0, game.width*7, game.height*2);
		
		//makes the player object and adds it to its group
		//adds bounce to the player
		//sets player gravity
		players = game.add.group();
		players.enableBody = true;
		player = players.create(164, game.world.height-250, 'player');
		player.anchor.set(0.5);
		player.body.bounce.y = .02;
		player.body.gravity.y = 200;
		player.body.maxVelocity = 0;
		player.body.syncBounds = true;

		//where the camera is connected to and controlled manually if needed
		invisCameraBody = game.add.sprite(player.x, player.y, 'box');
		invisCameraBody.enableBody = true;
		invisCameraBody.alpha = 0;
		invisCameraBody.anchor.set(0.5);
		//Camera follows invisible body
		game.camera.follow(invisCameraBody, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);
		
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
		plantImpact.volume = 0.5;

		//Adds platforms Group and enables physics for them
		platforms = game.add.group();
		platforms.enableBody = true;
		createLedge(-200,game.world.height-125, 'platform', 1, 1);
		createLedge(200, game.world.height-125, 'platform', 1, 1);
		createLedge(632, game.world.height-221, 'platform', 1, 1);
		createLedge(1064, game.world.height-317, 'platform', 1, 1);
		createLedge(1464, game.world.height-317, 'platform', 1, 1);
		createLedge(2450, game.world.height-200, 'platform', 1, 1);
		createLedge(2850, game.world.height-200, 'platform', 1, 1);
		createLedge(3582, game.world.height-532, 'platform', 1, 1);
		createLedge(3982, game.world.height-532, 'platform', 1, 1);
		createLedge(5750, game.world.height-532, 'platform', 1, 1);
		createLedge(4760, game.world.height-630, 'platform', 0.25, 1);

		//Create the plants in positions modeled after the paper prototype(some modifications)
		addLightPulse(3550, game.world.height - 516);
		createPlant(3550, game.world.height - 516);
		addLightPulse(4810, game.world.height - 580);
		createPlant(4810, game.world.height - 580);

		//temp sprite to make it look like a pit at the botom of the screen
		var pit = game.add.sprite(0, game.world.height-200, 'fade');
		pit.scale.x = 10; //improvised extension for tutorial
		pit.scale.y = 0.2;

		//these are acting as the boundary around the game (off screen)
		walls = game.add.group();
		walls.enableBody = true;
		createWall(-32, -game.world.height/2, 'box', 1, 75, 0);
		createWall(game.world.width+32, -game.world.height/2, 'box', 1, 75, 0);

		//creates the walls as a passage block (seen on screen)
		createWall(600, game.world.height-221, 'box', 1, 4);
		createWall(1032, game.world.height-317, 'box', 1, 4);

		//Tutorial Text
		game.add.text(32, game.world.height - 600, 'Use W,A,S,D to move', { fontSize: '32px', fill: '#000' });
		game.add.text(32, game.world.height - 500, 'Use the W arrow to jump! (Hold for slow fall)', { fontSize: '32px', fill: '#000' });
		game.add.text(1150, game.world.height - 600, 'You can peek the camera to view things a bit away!', { fontSize: '32px', fill: '#000' });
		game.add.text(1150, game.world.height - 500, 'While Blue, Use the WASD keys to peek the camera', { fontSize: '32px', fill: '#000' });
		game.add.text(2100, game.world.height - 600, 'Jump off the edge and hold the jump', { fontSize: '22px', fill: '#000' });
		game.add.text(2100, game.world.height - 550, 'key to slow fall to this platform!', { fontSize: '22px', fill: '#000' });
		game.add.text(3300, game.world.height - 400, 'Press space to swap into unmoving plant growing form!', { fontSize: '16px', fill: '#000' });
		game.add.text(3300, game.world.height - 325, 'While in this form, click and drag on roots', { fontSize: '16px', fill: '#000' });
		game.add.text(3300, game.world.height - 300, 'to grow plant platforms!', { fontSize: '16px', fill: '#000' });
		game.add.text(3300, game.world.height - 225, '(If you mess up, press R to reset the last', { fontSize: '16px', fill: '#000' });
		game.add.text(3300, game.world.height - 200, 'clicked plants)', { fontSize: '16px', fill: '#000' });
		game.add.text(3300, game.world.height - 150, '(Unfortunately, roots cannot be stood on as', { fontSize: '16px', fill: '#000' });
		game.add.text(3300, game.world.height - 125, 'they are too fragile', { fontSize: '16px', fill: '#000' });
		game.add.text(4200, game.world.height - 480	, 'You can grow a plant, reset it (R), and', { fontSize: '22px', fill: '#000' });
		game.add.text(4200, game.world.height - 450	, 'grow it another way to progress!', { fontSize: '22px', fill: '#000' });
		game.add.text(4200, game.world.height - 420	, 'Try it now!', { fontSize: '22px', fill: '#000' });
		game.add.text(5800, game.world.height - 800	, 'Good job, and good luck!', { fontSize: '22px', fill: '#000' });
		
		//adds exit door at the end of the level to trigger GameOver
		exits = game.add.group();
		exits.enableBody = true;
		var exit = exits.create(5900, 1000, 'exit');
		exit.anchor.set(0.5);
		
		//creation of UI elements
		UIGroup = game.add.group();
		createUIElement(game.camera.width-50, 50, 'ui');
		createUIElement(game.camera.width-100, 50, 'ui');
		createUIElement(game.camera.width-150, 50, 'ui');
	
	},
	
	update: function(){

		//moves the invis camera body to the player
		invisCameraBody.x = player.x;
		invisCameraBody.y = player.y;

		//sets player velocity to 0 if nothing is being pressed
		player.body.velocity.x = 0;
		//player.body.velocity.y = 0; removed so gravity works

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
		if (game.input.activePointer.isDown && isLightMode){
			plants.forEach(identifyPlantGroup);
			if(activeGroup != undefined){
				//console.log(activeGroup);
				growPlant(activeGroup);
			}
		}

		//resets plant to original state
		if(rKey.downDuration(1)){
			resetPlant(activeGroup);
		}

		//upon pressing the spacebar, you can alternate
		//from player mode and light mode as long as player is on a surface
		if (spaceKey.downDuration(1) && player.body.touching.down && isLightMode == false)
		{
			isLightMode = true;
			player.loadTexture('lightMode');
		}
		else if(spaceKey.downDuration(1) && isLightMode == true){
			isLightMode = false;
			player.loadTexture('player');
		}

		if(isLightMode == true){
			//camera Panning
			cameraPanControls();
		}
		else{
			//the following if/else statements allows for player movement
			if (game.input.keyboard.isDown(Phaser.Keyboard.A) && !isLightMode)
				player.body.velocity.x = -150;

			else if (game.input.keyboard.isDown(Phaser.Keyboard.D) && !isLightMode)
				player.body.velocity.x = 150;

			//Jumping, works if touching the ground and not in light mode
			if (game.input.keyboard.isDown(Phaser.Keyboard.W) && !isLightMode && player.body.touching.down){
				player.body.velocity.y = -225;
				pop.play();
				plantImpacted = false;
			}
		}

		//if UP is held while falling, it makes a "floaty" fall
		if(player.body.velocity.y > 50 && game.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			player.body.velocity.y = 50;
		}

		//if the player falls to the bottom of the screen it resets them to starting point
		//flashes the player for a couple seconds
		if(player.y > game.world.height+player.height){
			oof.play();
			
			player.reset(164,game.world.height-250);

			isLightMode = true;

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
			game.state.start('GamePlay', true, false, 0);
		}

		//used for debugging purposes
		render();
	}
}

//Gameplay State
var GamePlay = function(game) {};
GamePlay.prototype = {
	
	create: function(){

		//sets game background color to navy blue
		game.stage.backgroundColor = "#235347"; 
		
		//enable arcade physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//Set game world size to double the viewable area of the game
		game.world.setBounds(0, 0, game.width*2, game.height*2);

		farground = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'farground');
		farground.sendToBack();
		var bforeground = game.add.sprite(0, 0, 'bforeground');
		//bforeground.sendToBack();

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

	    //  This will emit a quantity of 1 particle every 450ms. Each particle will live for 30000ms.
	    back_emitter.start(false, 30000, 450);
		
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

		//creating the pulse behind the player then in light mode
		plight = game.add.sprite(player.x, player.y, 'lightfade');
		plight.anchor.set(0.5);
		plight.alpha = 0.0;
		plight.moveDown();

		//code to able to move the camera manually or automatically
		invisCameraBody = game.add.sprite(player.x, player.y, 'box');
		invisCameraBody.enableBody = true;
		invisCameraBody.alpha = 0;
		invisCameraBody.anchor.set(0.5);
		
		//Camera follows player
		game.camera.follow(invisCameraBody,Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);

		//Adds platforms Group and enables physics for them
		platforms = game.add.group();
		platforms.enableBody = true;
		createLedge(-200,game.world.height-125, 'platform', 1, 1);
		createLedge(game.world.width-175, 275, 'platform', 1, 1);
		//createLedge(610, 595, 'platform', 0.35, 1);

		//adds exit door at the end of the level to trigger GameOver
		exits = game.add.group();
		exits.enableBody = true;
		var exit = exits.create(game.world.width - 100, 210, 'exit');
		exit.anchor.set(0.5);

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
		createWall(1015, -253, 'box', 1, 10, 0);
		//createWall(239, -183, 'box', 1, 10, -32);
		//createWall(616, 615, 'box', 3.9, 35, 0);
		//createWall(625, 643, 'box', 1, 35, 5);
		//createWall(703, 643, 'box', 1, 35, -3);

		//creation of UI elements
		//UIGroup = game.add.group();
		//createUIElement(game.camera.width-50, 50, 'ui');
		//createUIElement(game.camera.width-100, 50, 'ui');
		//createUIElement(game.camera.width-150, 50, 'ui');

		//temp sprite to make it look like a pit at the botom of the screen
		var floor = game.add.sprite(0, 0, 'floor');
		var foreground = game.add.sprite(0, 0, 'foreground');
		//foreground.alpha = (0.5);
		var plantlights = game.add.sprite(0, 0, 'plantlights');
		//var plantlocations = game.add.sprite(0, 0, 'plantlocations');

		//Create the plants in positions modeled after the paper prototype(some modifications)
		addLightPulse(355, 1200);
		createPlant(355, 1200);
		// addLightPulse(445, 104);
		// createPlant(445, 104);
		addLightPulse(678, 610);
		createPlant(678, 610);
		addLightPulse(1022, 98);
		createPlant(1022, 98);
		addLightPulse(1526, 804);
		createPlant(1526, 804);

		//keeps player from moving during the zoom out/zoom inu until time has passed
		//the timing on how the camera zooms in/zooms out
		// waits for player input (spacebar) in update() to continue sequence
		isLightMode = true;
		cameraMoving = true;
		game.time.events.add(3000, function() { 
			zoomLoop = game.time.events.repeat(10, 200, cameraZoomOut, this);
		});
		game.time.events.add(7500, function() { 
			cameraMoving = false;
			isLightMode = true;
			//cameraMoving = false;
		});
	
	},

	update: function(){

		//check for spacebar input to zoom out camera
		if(isLightMode == true && !cameraMoving && readyStart == false){
			console.log('press space to start');
			isLightMode = false;
			readyStart = true;
			cameraMoving = true;
		}
		if (spaceKey.downDuration(1) && cameraMoving && isLightMode == false && readyStart == true){
				
				//cameraMoving = true;
				lightMode = true;
				readyStart = null;
				
				game.time.events.add(500, function() { 
				zoomLoop = game.time.events.repeat(10, 200, cameraZoomIn, this);
				console.log('space pressed');
				});

				game.time.events.add(4500, function() { 
					cameraMoving = false;
					lightMode = false;
					console.log('start');
				});

		}

		//slight background paralax scrolling
		farground.x = -game.camera.x/12;

		//moving camera body
		invisCameraBody.x = player.x;
		invisCameraBody.y = player.y;

		//moving player light pulse
		plight.x = player.x;
		plight.y = player.y;

		//sets player velocity to 0 if nothing is being pressed
		player.body.velocity.x = 0;
		//player.body.velocity.y = 0; removed so gravity works

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
		if (game.input.activePointer.isDown && !cameraMoving && isLightMode){
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

		//upon pressing the spacebar, you can alternate
		//from player mode and light mode as long as player is on a surface
		//sets and resets the pulsing player behavior
		if (spaceKey.downDuration(1) && player.body.touching.down && isLightMode == false && !cameraMoving)
		{
			isLightMode = true;
			player.loadTexture('lightMode');
			blink = game.add.tween(plight).to( { alpha: 0.45 }, 1500, Phaser.Easing.Linear.None, true, 0, 1500, true);
			//blink.pause();
			blinkScale = game.add.tween(plight.scale).to( { x: 2.5, y: 2.5 }, 1500, Phaser.Easing.Linear.None, true, 0, 1500, true);
			//blinkScale.pause();
		}
		else if(spaceKey.downDuration(1) && isLightMode == true && !cameraMoving){
			isLightMode = false;
			player.loadTexture('player');
			blink.stop();
			blinkScale.stop();
			plight.alpha = 0;
			plight.scale.x = 1;
			plight.scale.y = 1;
		}
		//a bunch of camera checks to prevent the player from moving
		if(isLightMode == true && !cameraMoving){
			//camera Panning
			cameraPanControls();
		}
		else if(!cameraMoving){
			//the following if/else statements allows for player movement
			if (game.input.keyboard.isDown(Phaser.Keyboard.A) && !isLightMode)
				player.body.velocity.x = -150;

			else if (game.input.keyboard.isDown(Phaser.Keyboard.D) && !isLightMode)
				player.body.velocity.x = 150;

			//Jumping, works if touching the ground and not in light mode
			if (game.input.keyboard.isDown(Phaser.Keyboard.W) && !isLightMode && player.body.touching.down){
				player.body.velocity.y = -225;
				pop.play();
				plantImpacted = false;
			}
		}

		//if UP is held while falling, it makes a "floaty" fall
		if(player.body.velocity.y > 50 && game.input.keyboard.isDown(Phaser.Keyboard.W) && !cameraMoving)
		{
			player.body.velocity.y = 50;
		}

		//if the player falls to the bottom of the screen it resets them to starting point
		//flashes the player for a couple seconds
		//if they were in light mode it resets them and their pulse
		if(player.y > game.world.height+player.height){
			oof.play();
			
			player.reset(80,game.world.height-250);

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

			game.time.events.add(2000, function() { 
				isLightMode = false;
				cameraMoving = false;
			});

			flash(player);
		}

		//manual camera zoom in (player is NOT taught this, strictly used for playtesting reasons)
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

		    plantEmitter.makeParticles('lightfade');

		    plantEmitter.setRotation(0, 0);
		    plantEmitter.maxParticleScale = 0.225;
		    plantEmitter.minParticleScale = 0.10;
		    plantEmitter.setAlpha(0.1,0.5);
		    plantEmitter.tint = 0xFFFF00;
		    plantEmitter.gravity = -10;

	   		//	false means don't explode all the sprites at once, but instead release at a rate of one particle per 250ms
	    	//	The 2500 value is the lifespan of each particle before it's killed
	    	plantEmitter.start(false, 2500, 250);
    	}
    	//console.log(plantEmitter);
	}
	else{
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
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
		var temp = (game.world.width-350) - invisCameraBody.x;
		if(temp < 0){
			invisCameraBody.x -= 250-temp;
		}
		else
			invisCameraBody.x -= 250;
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
		var temp = 250 - invisCameraBody.y;
		if(temp > 0){
			invisCameraBody.y += 250+temp;
		}
		else
			invisCameraBody.y += 250;
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
		var temp = 350 - invisCameraBody.x;
		if(temp > 0){
			invisCameraBody.x += 250+temp;
		}
		else
			invisCameraBody.x += 250;	
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
	ledge.alpha = 0;

	ledge.body.immovable = true;
	ledge.body.syncBounds = true;
	//ledge.anchor.set(0.5);

}

//for creating UI Elements fixed to the camera
function createWall(x, y, pic, scaleX, scaleY, rotation){

	var wall = walls.create(x, y, pic);
	wall.scale.x = scaleX;
	wall.scale.y = scaleY;
	wall.alpha = 0;
	//wall.anchor.set(0.5);
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
        plight.anchor.set(bodyAnchor);
        //console.log(bodyAnchor);

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
        //plight.anchor.set(bodyAnchor);
        //console.log(bodyAnchor);

        cameraScale -= 0.0025;
    	//console.log(cameraScale);
    	//console.log(game.camera.width);
    }
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
    //game.add.tween(sprite).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true);
}

// STATES -----------------------------------------------------------------------------------------------


// add states to StateManager and starts MainMenu
game.state.add('MainMenu', MainMenu);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.add('Tutorial', Tutorial);
game.state.start('MainMenu');