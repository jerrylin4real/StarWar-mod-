class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.image('start', 'assets/start.png');
        this.load.audio('sfx_explosion', './assets/baozha.wav');
        this.load.audio('sfx_rocket', './assets/rocketsound.wav');
    }

    create(){
        this.add.rectangle(0, 0, 640, 480, 0x008080).setOrigin(0 ,0);
        this.start = this.add.tileSprite(0,0,640,480, 'start').setOrigin(0,0);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
           game.settings = {
             spaceshipSpeed: 3,
             gameTimer: 60000    
           }
           this.scene.start('playScene');    
         }
         if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            game.settings = {
              spaceshipSpeed: 4,
              gameTimer: 40000
              
           }
           this.scene.start('playScene');    
         }
     }
}