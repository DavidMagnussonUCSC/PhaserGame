
//Loading state for loading all the assets.
var Loading = {
	
	
	preload: function() 
	{
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
		
		},
		
		create: function() {
			//Starts MainMenu after loading
			game.state.start('MainMenu');
		}
};