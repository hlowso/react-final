import gameAttributes from "../game-attributes.js";

export default function() {
	this.vars.ws.onmessage = incoming_message => {
		const message = JSON.parse(incoming_message.data);
		const player = this.entities.players.individuals[message.player_id];
		switch (message.subject) {
			case "push":
				let x_velocity = message.velocity.x;
				let y_velocity = message.velocity.y;

				if (y_velocity > 0) {
					player.rotation = Math.atan(x_velocity / y_velocity);
				} else if (y_velocity === 0.0) {
					if (x_velocity < 0) {
						player.rotation = 0.5 * Math.PI;
					} else {
						player.rotation = 1.5 * Math.PI;
					}
				} else {
					player.rotation = Math.atan(x_velocity / y_velocity) + Math.PI;
				}
				player.setVelocityX(8000.0 * x_velocity);
				player.setVelocityY(-8000.0 * y_velocity);

				break;
			case "shoot":
				player.shooting = message.shooting;
				break;
			case "disconnect":
				player.alive = false;
				player.disableBody(true, true);
				break;
		}
	};

	const background = this.add.image(
		gameAttributes.gameWidth / 2,
		gameAttributes.gameHeight / 2,
		"background"
	);

	background.setScale(window.devicePixelRatio * 2);

	this.entities.players = {
		individuals: {},
		group: this.physics.add.group({
			key: "pigeon",
			setXY: {
				x: -50,
				y: -50
				// stepX: 60
			}
		})
	};

	const addPlayer = player_id => {
		let player = this.entities.players.group.create(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			"pigeon"
		);
		player.id = player_id;
		player.alive = true;
		player.killcount = 0;
		player.health = 3;
		player.shooting = false;
		player.disabled = false;
		player.setCollideWorldBounds(true);
		player.setVelocityX(0);
		player.setVelocityY(0);
		player.x = Math.random() * gameAttributes.gameWidth;
		player.y = Math.random() * gameAttributes.gameHeight;
		this.entities.players.individuals[player_id] = player;
	};

	this.vars.player_ids.forEach(function(player_id) {
		addPlayer(player_id);
	});

	this.entities.enemies = this.physics.add.group({
		key: "falcon",
		setXY: {
			x: -50,
			y: -50
		}
	});

	this.time.addEvent({
		delay: 5000,
		callback: this.enemySpawn,
		callbackScope: this,
		loop: true
	});

	this.vars.gameScoreText = this.add.text(100, 100, `${this.vars.score}`);
	this.vars.healthText = this.add.text(100, 120, "Health: " + this.vars.health);

	this.entities.bullets = this.physics.add.group({
		defaultKey: "laser",
		setCollideWorldBounds: true
	});

	this.physics.add.collider(
		this.entities.enemies,
		this.entities.bullets,
		this.bulletEnemyCollision,
		null,
		this
	);
	this.physics.add.collider(
		this.entities.enemies,
		this.entities.players.group,
		this.playerEnemyCollision,
		null,
		this
	);
}
