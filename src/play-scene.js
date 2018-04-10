import initialize from "./play-scene-sequences/initialize.js";
import preload from "./play-scene-sequences/preload.js";
import create from "./play-scene-sequences/create.js";
import update from "./play-scene-sequences/update.js";
import fireBullet from "./play-scene-sequences/fire-bullet.js";
import bulletEnemyCollision from "./play-scene-sequences/bullet-enemy-collision.js";
import playerEnemyCollision from "./play-scene-sequences/player-enemy-collision.js";
import enemySpawn from "./play-scene-sequences/enemy-spawn.js";

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
