// GAMEPLAY STATE START -----------------------------------------------------------------------------------------------
var GamePlay = function(game) {};
GamePlay.prototype = {
	
	create: function(){
		//Variable for checking if exit is reached for gameOver transition purposes
		var exitReached = false;
		
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
		ambientSound.volume = 0.14;

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
		exit.alpha= 0.0 ;
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

// GAMEPLAY STATE END -----------------------------------------------------------------------------------------------