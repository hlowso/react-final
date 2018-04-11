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

	this.vars.playerTexts = {};

	const addPlayer = (player_id, playerNumber) => {
		let player = this.entities.players.group.create(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			"pigeon"
		);

		let colour = generateHexColor();

		player.id = player_id;
		player.name = 'Player' + (playerNumber + 1).toString();
		player.colour = colour;
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
		addPlayerTexts(player, playerNumber);
	};

	const addPlayerTexts = (player, index) => {
		let playerLabelText = this.add.text(100, 100 + index * 60, player.name, { font: "32px Arial", fill: player.colour });
		let healthText = this.add.text(225, 100 + index * 60, 'Health:' + player.health, { font: "32px Arial", fill: player.colour });
		healthText.id = player.id;
		const playerTexts = this.vars.playerTexts[player.id]= {};
		let killcountText = this.add.text(225, 125 + index * 60, 'Kill Count:' + player.killcount, { font: "32px Arial", fill: player.colour });
		killcountText.id = player.id;
		playerTexts.health = healthText;
		playerTexts.killcount = killcountText;

	};

	for (let i = 0; i < this.vars.player_ids.length; i++) {
		let player_id = this.vars.player_ids[i];
		let newPlayer = addPlayer(player_id, i);

	}

	// console.log(this.vars.playerTexts);

	function generateHexColor() {
    return '#' + ((0.5 + 0.5 * Math.random()) * 0xFFFFFF << 0).toString(16);
	}

			// textGroup.add(game.make.text(100, 64 + i * 32, 'here is a colored line of text',  { font: "32px Arial", fill: generateHexColor() }));

	// this.vars.player_ids.forEach(function(player_id) {
	// 	addPlayer(player_id);
	// });

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

	// this.vars.healthText = this.add.text(100, 120, "Health: " + this.vars.health);

	this.entities.bullets = this.physics.add.group({
		key: "laser",
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
