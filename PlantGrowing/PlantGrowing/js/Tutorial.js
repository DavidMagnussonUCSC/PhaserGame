// TUTORIAL STATE START -----------------------------------------------------------------------------------------------

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
		game.add.text(32, game.world.height - 500, 'Use W,A,S,D to move', { fontSize: '24px', fill: '#f3f38c' });
		game.add.text(32, game.world.height - 450, 'Use the W arrow to jump! (Hold for slow fall)', { fontSize: '24px', fill: '#f3f38c' });
		game.add.text(1150, game.world.height - 600, 'You can peek the camera to view things a bit away!', { fontSize: '24px', fill: '#f3f38c' });
		game.add.text(1150, game.world.height - 550, 'Press space to switch forms to root yourself and stop moving', { fontSize: '24px', fill: '#f3f38c' });
		game.add.text(1150, game.world.height - 500, 'While rooted, Use the WASD keys to peek the camera', { fontSize: '24px', fill: '#f3f38c' });
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
		ambientSound.volume = 0.14;

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
		//srender();
	}
}

// TUTORIAL STATE END -----------------------------------------------------------------------------------------------