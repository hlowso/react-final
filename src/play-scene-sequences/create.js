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
				let index = this.vars.player_ids.findIndex(id => id === player.id);
				this.vars.player_ids.splice(index, 1);
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
			}
		})
	};

	this.entities.emitters = {};

	this.vars.playerTexts = {};

	const addPlayer = (player_id, player_name, index) => {
		let player = this.entities.players.group.create(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			"pigeon"
		);

		let colour = generateHexColor();

		player.id = player_id;
		player.name = player_name;
		player.colour = colour;
		player.alive = true;
		player.killcount = 0;
		player.health = 3;
		player.shooting = false;
		player.bulletTime = 0;
		player.disabled = false;
		player.setCollideWorldBounds(true);
		player.setVelocityX(0);
		player.setVelocityY(0);
		player.x = Math.random() * gameAttributes.gameWidth;
		player.y = Math.random() * gameAttributes.gameHeight;
		this.entities.players.individuals[player_id] = player;
		addPlayerTexts(player, index);

		return player;
	};

	const addPlayerTexts = (player, index) => {
		let playerLabelText = this.add.text(100, 100 + index * 60, player.name, {
			font: "32px Arial",
			fill: player.colour
		});
		let healthText = this.add.text(
			225,
			100 + index * 60,
			"Health:" + player.health,
			{ font: "32px Arial", fill: player.colour }
		);
		healthText.id = player.id;
		const playerTexts = (this.vars.playerTexts[player.id] = {});
		let killcountText = this.add.text(
			225,
			125 + index * 60,
			"Kill Count:" + player.killcount,
			{ font: "32px Arial", fill: player.colour }
		);
		killcountText.id = player.id;
		playerTexts.health = healthText;
		playerTexts.killcount = killcountText;
	};

	this.anims.create({
		key: "pigeonfly",
		frames: this.anims.generateFrameNumbers("pigeon", {
			start: 0,
			end: 3,
			first: 0
		}),
		frameRate: 20,
		repeat: -1
	});

	for (let i = 0; i < this.vars.player_ids.length; i++) {
		let player_id = this.vars.player_ids[i];
		let player_name = this.vars.player_names[player_id];
		let newPlayer = addPlayer(player_id, player_name, i);

		newPlayer.anims.play("pigeonfly");
		let emitter = this.add.particles("white_emitter");

		let colour = newPlayer.colour.toString();
		colour = colour.split("");
		colour.shift();
		colour = colour.join("");
		let colourGood = "0xff" + colour;

		let newPlayerEmitter = emitter.createEmitter({
			speed: 100,
			tint: { start: parseInt(colourGood, 16), end: parseInt(colourGood, 16) },
			blendMode: "NORMAL",
			gravity: { x: 0, y: 200 },
			scale: { start: 0.1, end: 1 },
			follow: this.entities.players.individuals[this.vars.player_ids[i]]
		});

		this.entities.emitters[player_id] = newPlayerEmitter;
	}

	function generateHexColor() {
		return "#" + (((0.5 + 0.5 * Math.random()) * 0xffffff) << 0).toString(16);
	}

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

	this.anims.create({
		key: "explode",
		frames: this.anims.generateFrameNumbers("explosion", {
			start: 0,
			end: 23,
			first: 0
		}),
		frameRate: 20
	});

	this.vars.gameScoreText = this.add.text(100, 100, `${this.vars.score}`);

	this.entities.bullets = this.physics.add.group({
		key: "laser",
		setCollideWorldBounds: true
	});

	let firstBullet = this.entities.bullets.getChildren();
	firstBullet[0].destroy();

	this.physics.add.overlap(
		this.entities.enemies,
		this.entities.bullets,
		this.bulletEnemyCollision,
		null,
		this
	);

	this.physics.add.overlap(
		this.entities.enemies,
		this.entities.players.group,
		this.playerEnemyCollision,
		null,
		this
	);
}
