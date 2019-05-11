
//set up initial camera size here
var game = new Phaser.Game(800, 1000, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//setting up variables for the game to access
var score = 0;
var scoreText;
var size = new Phaser.Rectangle();

// loading the assets we need for our game
function preload() {

	//	sets each variable with their respective sprite asset
    game.load.image('sky', 'assets/img/sky.png');
    game.load.image('ground', 'assets/img/platform.png');
    game.load.image('star', 'assets/img/star.png');
    game.load.image('diamond', 'assets/img/diamond.png');
    game.load.image('health', 'assets/img/firstaid.png');
    game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
    game.load.spritesheet('baddie', 'assets/img/baddie.png', 32, 32);

}

// placing the assets here to be prepared to use
function create() {

	//  This is the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // set world bounds to bg image (nebula) size
    game.world.setBounds(0, 0, game.width*2, game.height*2);
    //size.setTo(-800, -1000, game.width*2, game.height*2);

    //  A simple background sprite that is used for our game
    game.add.sprite(0, 0, 'sky');

    //  The "Platform" group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  Enableing physics for anything within the "Platform" group
    platforms.enableBody = true;

    // Creating the "ground"
    var ground = platforms.create(0, game.world.height - 32, 'ground');
    //  Scaling "ground" sprite to fit the width of the game
    //ground.scale.setTo(2, 2);
    ground.body.immovable = true;
    ground.scale.x = 3;

    //  Creating "ledge" #1
    var ledge = platforms.create(600, 400, 'ground');
    ledge.body.immovable = true;

    //  Creating "ledge" #2
    ledge = platforms.create(-200, 250, 'ground');
    ledge.body.immovable = true;

    //  Creating "ledge" #3
    ledge = platforms.create(-100, 650, 'ground');
    ledge.body.immovable = true;

    //  Creating "ledge" #4
    ledge = platforms.create(500, 800, 'ground');
    ledge.body.immovable = true;

    // Adding the player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  Enabling physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. 
    //  Give the little guy a slight bounce.
    //  dictates the players gravity
    //  makes the player not go off screen
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 50;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //creating a group called stars
    stars = game.add.group();
    //enabling a "hitbox"
    stars.enableBody = true;

    //  Creating 12 stars of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Creating a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Star gravity
        star.body.gravity.y = 300;

        //  Gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
	}

	//creating a group called diamond
    diamonds = game.add.group();
    //enabling a "hitbox" for diamond
    diamonds.enableBody = true;

    //  Creating a diamond inside of the 'diamonds' group at a random position on screen
    var diamond = diamonds.create(Phaser.Math.between(100,game.world.width-100), Phaser.Math.between(100,game.world.height-100), 'diamond');
    //  diamond gravity
    diamond.body.gravity.y = 0;

    //  Creating baddie #1 with its respective traits
    baddie1 = game.add.sprite(50, 200, 'baddie');
    game.physics.arcade.enable(baddie1);
    baddie1.enableBody = true;
    baddie1.body.gravity.y = 200;
    baddie1.animations.add('left', [0, 1], 10, true);

    //  Creating baddie #1 with its respective traits
    baddie2 = game.add.sprite(600, 750, 'baddie');
    game.physics.arcade.enable(baddie2);
    baddie2.enableBody = true;
    baddie2.body.gravity.y = 200;
    baddie2.animations.add('right', [2, 3], 10, true);

	//creating the scoreboard in the top left corner
	scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    // let's log some debug info
    console.log(game.stage);
    console.log(game.world);
    console.log(game.camera);
    console.log(game.stage.getLocalBounds());

    // make camera follow player ship
    game.camera.follow(player,Phaser.Camera.FOLLOW_PLATFORMER, 0.5, 0.5);

    health = game.add.sprite(game.camera.width-50, 50, 'health');
    health.fixedToCamera = true;
    health.anchor.set(0.5);

    //  Our player controls
    cursors = game.input.keyboard.createCursorKeys();
}

// run game loop
// update function is called by the core game loop every frame
function update() {

	//  Checking Collision of the player with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    // checks if left arrow is down every frame
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -200;

        player.animations.play('left');
    }
    // checks if right arrow is down every frame
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 200;

        player.animations.play('right');
    }
    // checks if nothing is pressed down every frame
    else
    {
        //  Stand still
        player.animations.stop();
        //  this is the specific frame of the animation of being idle
        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
    	//brings the player down
        player.body.velocity.y = -350;
    }

    // makes baddie #1 play the animation of running left
    baddie1.animations.play('left');

    // makes baddie #2 play the animation of running right
    baddie2.animations.play('right');

    //  Checking Collision of the stars with the platforms
    game.physics.arcade.collide(stars, platforms);

    //  Checking Collision of the baddies with the platforms
    game.physics.arcade.collide(baddie1, platforms);
    game.physics.arcade.collide(baddie2, platforms);

    //  Checking Collision of the player with the stars and send to the collectstar function if successful
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Checking Collision of the player with the diamonds and send to the collectdiamond function if successful
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);

    //  Checking Collision of the player with the baddies and send to the hitbyBaddie function if successful
    game.physics.arcade.overlap(player, baddie1, hitByBaddie, null, this);
    game.physics.arcade.overlap(player, baddie2, hitByBaddie, null, this);

    if(game.input.keyboard.isDown(Phaser.Keyboard.O)){
        if(game.camera.y <= game.height){
            game.camera.scale.x += 0.005;
            game.camera.scale.y += 0.005;
        }

        // game.camera.bounds.x = size.x * game.camera.scale.x;
        // game.camera.bounds.y = size.y * game.camera.scale.y;
        // game.camera.bounds.width = size.width * game.camera.scale.x;
        // game.camera.bounds.height = size.height * game.camera.scale.y;
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.P)){
        
        if(game.camera.y >= 2){
            game.camera.scale.x -= 0.005;
            game.camera.scale.y -= 0.005;
        }

        // game.camera.bounds.x = size.x * game.camera.scale.x;
        // game.camera.bounds.y = size.y * game.camera.scale.y;
        // game.camera.bounds.width = size.width * game.camera.scale.x;
        // game.camera.bounds.height = size.height * game.camera.scale.y;
    }

    render();
}

//  the collect star function
function collectStar (player, star) {

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

//  the collect diamond function
function collectDiamond (player, diamond) {

    // Removes the diamond from the screen
    diamond.kill();

    //  Add and update the score
    score += 50;
    scoreText.text = 'Score: ' + score;

}

//  the hitByBaddie diamond function
function hitByBaddie (player, baddie) {

    // Removes the baddie from the screen
    baddie.kill();

    //  Subtract and update the score
    score -= 25;
    scoreText.text = 'Score: ' + score;

}

function render() {
    // display some debug info
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteInfo(player, 32, game.height - 120);
    //game.debug.rectangle({x:game.camera.bounds.x, y:game.camera.bounds.y, width:game.camera.bounds.width, height:game.camera.bounds.height});
}
