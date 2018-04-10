import initialize from "./play-sequences/initialize.js";
import preload from "./play-sequences/preload.js";
import create from "./play-sequences/create.js";
import update from "./play-sequences/update.js";
import fireBullet from "./play-sequences/fire-bullet.js";
import bulletEnemyCollision from "./play-sequences/bullet-enemy-collision.js";
import playerEnemyCollision from "./play-sequences/player-enemy-collision.js";
import enemySpawn from "./play-sequences/enemy-spawn.js";

const play = new Phaser.Class({
  entities: {},

  vars: {
    score: 0,
    health: 3,
    bulletTime: 0,
    fireBullets: true,
    x_velocity: 0.0,
    y_velocity: 0.0,
    shooting: false,
    playerDisabled: false
  },

  Extends: Phaser.Scene,

  initialize,
  preload,
  create,
  fireBullet,
  bulletEnemyCollision,
  playerEnemyCollision,
  enemySpawn,
  update
});

export default play;
