class Play extends Phaser.Scene {
    constructor(){ 
        super("playScene");
        console.log("The scene is playing...");
    }

    //Preloads sprites
    preload(){
        this.load.image('background', 'assets/starwarspace.png');
        this.load.image('rocket', 'assets/rocket.png');
        this.load.image('spaceship', 'assets/spaceship.png');
        this.load.image('Deathstar', 'assets/deathstar.png');
        this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 5});
        this.load.image('gameOver', 'assets/gameOver.png');

        this.load.audio('bgm', ['assets/starwar.mp3']);
        this.load.audio('backgroundshooting', ['assets/guns.mp3']);
    }

    //Create Function
    create(){
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        

        //Background sprite
        this.background = this.add.tileSprite(0,0,640,480, 'background').setOrigin(0,0);
        //Rocket sprite
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket').setOrigin(0.5, 0);

        //Spaceship
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*6, 'spaceship', 0, 10).setOrigin(0,0);
        this.shipFast = new FastEnemy(this, game.config.width, borderUISize*2 + borderPadding*5, 'Deathstar', 0, 100).setOrigin(0,0);

        //Music
        this.backgroundMusic = this.sound.add('bgm');
        var musicConfig = {
            mute: false,
            volume: .2,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.backgroundMusic.play(musicConfig);//Starts the music

        //Typing sfx
        this.bgtyping = this.sound.add('backgroundshooting');
        var typingConfig = {
            mute: false,
            volume: .70,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.bgtyping.play(typingConfig);//Starts the typing
        

        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 3, first: 0}),
            frameRate: 10
        });

        // initialize score
        this.p1Score = 0;

        //Score Background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 215483).setOrigin(0,0);

        // display score
        let scoreConfig = {
        fontFamily: 'Consolas',
        fontSize: '28px',
        backgroundColor: '#ff0000',
        color: '#0400ff',
        align: 'center',
        padding: {
             top: 5,
             bottom: 5,
            },
        fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);



        // GAME OVER flag
        this.gameOver = false;

        //Game timer
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            //Custom restart menu
            this.gameOver = this.add.tileSprite(0,0,640,480, 'gameOver').setOrigin(0,0);//EndGame Screen
            this.scoreCenter = this.add.text(game.config.width/2, game.config.height/2+50, this.p1Score, scoreConfig);//end score

            this.backgroundMusic.stop(musicConfig);//Ends music loop on GAME OVER
            this.bgtyping.stop(typingConfig);//Ends typing loop
            this.gameOver = true;
        }, null, this);


        
        //Game border
        this.add.rectangle(0, 0, game.config.width, borderUISize, 202047).setOrigin(0 ,0);
        this.add.rectangle(0, 0, 0, game.config.height, 202047).setOrigin(0 ,0);
    }

    //Update Function
    update(){
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {

            this.scene.restart();
        }

        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.shipFast.update();
        } 

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.shipFast)) {
            this.p1Rocket.reset();
            this.shipExplode(this.shipFast);   
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    //Collision Function
    checkCollision(rocket, ship){
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    //Explosion Function
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after ani completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
            });
            
        // score add and repaint
        this.p1Score += ship.points;            //Increase score
        ship.moveSpeed += .2;                  //Increase destroyed ship speed
        this.scoreLeft.text = this.p1Score;     //Score text update
        this.sound.play('sfx_explosion');       //Explosion sfx
        }
    
    highScoreFunc(scoreVar){
        
        console.log('High score: '+scoreVar);
    }
}