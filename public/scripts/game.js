function preload () {
  game.load.spritesheet('pigeon', 'assets/pigeon_sprite_ph.png', 129, 84)
}

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  let pigeon = game.add.sprite(0, 0, 'pigeon')
  let fly = pigeon.animations.add('right', [0,1,2,3,4,5])

  game.physics.arcade.enable(pigeon);
}

function update () {
  pigeon.body.velocity.x = 20;
  pigeon.animations.play('fly', 10, true)
}