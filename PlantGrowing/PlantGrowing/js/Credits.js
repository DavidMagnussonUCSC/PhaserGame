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