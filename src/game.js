// const path = require("path");
import PidgeonIcon from "./assets/pigeon_ph.png";
import SkyBackground from "./assets/sky.png";

function start() {
  const gameOptions = {
    spriteSize: 40,
    gameWidth: window.innerWidth * window.devicePixelRatio,
    gameHeight: window.innerHeight * window.devicePixelRatio,
    gameSpeed: 100
  };

  window.onload = function() {
    const gameConfig = {
      type: Phaser.AUTO,
      width: gameOptions.gameWidth,
      height: gameOptions.gameHeight,
      physics: {
        default: "arcade",
        arcade: {
          // gravity: { y: 20 }
        }
      },
      scene: [playGame]
    };

    const game = new Phaser.Game(gameConfig);
    // resize();
    // window.addEventListener("resize", resize, false);
  };

  let player;
  let cursors;

  const playGame = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function playGame() {
      Phaser.Scene.call(this, { key: "PlayGame" });
    },

    preload: function() {
      this.load.image("background", SkyBackground);
      this.load.image("pigeon", PidgeonIcon, 129, 84);
    },

    create: function() {
      const background = this.add.image(
        gameOptions.gameWidth / 2,
        gameOptions.gameHeight / 2,
        "background"
      );

      background.setScale(window.devicePixelRatio * 2);

      player = this.physics.add.sprite(
        gameOptions.gameWidth / 2,
        gameOptions.gameHeight / 2,
        "pigeon"
      );
      // let fly = player.animations.add('right', [0,1,2,3,4,5]);
      player.setBounce(0.4);
      player.setCollideWorldBounds(true);

      cursors = this.input.keyboard.createCursorKeys();
    },

    update: function() {
      if (cursors.left.isDown) {
        player.setVelocityX(-800);
      } else if (cursors.right.isDown) {
        player.setVelocityX(800);
        // } else {
        //   player.setVelocityX(0);
      }
      if (cursors.up.isDown) {
        player.setVelocityY(-800);
      } else if (cursors.down.isDown) {
        player.setVelocityY(800);
        // } else {
        //   player.setVelocityY(0);
        // player.body.setGravity(100);
      }
    }
  });

  function resize() {
    const canvas = document.querySelector("canvas");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    const gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
      canvas.style.width = windowWidth + "px";
      canvas.style.height = windowWidth / gameRatio + "px";
    } else {
      canvas.style.width = windowHeight * gameRatio + "px";
      canvas.style.height = windowHeight + "px";
    }
  }
}

export default start;
