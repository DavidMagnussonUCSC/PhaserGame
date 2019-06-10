// MAIN MENU STATE START -----------------------------------------------------------------------------------------------

var MainMenu = function(game) {};
MainMenu.prototype = {
	
	preload: function() {
		//setup for advanced timing (ex. fps debug)
		game.time.advancedTiming = true;

		
		
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