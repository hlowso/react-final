import gameAttributes from "../game-attributes.js";

const MIN_SPEED_SQUARED = 250000;

export default function() {
	this.vars.ws.onmessage = incoming_message => {
		const message = JSON.parse(incoming_message.data);
		const player = this.entities.players.individuals[message.player_id];
		switch (message.subject) {
			case "push":
				let x_velocity = message.velocity.x;
				let y_velocity = message.velocity.y;

				let x_sign = 0;
				let y_sign = 0;

				if (x_velocity !== 0.0) {
					x_sign = x_velocity / Math.abs(x_velocity);
				}
				if (y_velocity !== 0.0) {
					y_sign = y_velocity / Math.abs(y_velocity);
				}

				if (Math.pow(x_velocity, 2) + Math.pow(y_velocity, 2) < 0.02) {
					y_velocity = Math.sqrt(
						MIN_SPEED_SQUARED / (1.0 + Math.pow(x_velocity / y_velocity, 2))
					);
					x_velocity = Math.sqrt(MIN_SPEED_SQUARED - Math.pow(y_velocity, 2));
					y_velocity *= y_sign;
					x_velocity *= x_sign;
				} else {
					x_velocity *= 5000.0;
					y_velocity *= 5000.0;
				}

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

				player.setVelocityX(x_velocity);
				player.setVelocityY(-1.0 * y_velocity);

				break;
			case "shoot":
				player.shooting = message.shooting;
				break;
			case "disconnect":
				let index = this.vars.player_ids.findIndex(id => id === player.id);
				this.vars.player_ids.splice(index, 1);
				player.alive = false;
				player.disableBody(true, true);
				this.entities.emitters[player.id].on = false;
				delete this.entities.players.individuals[player.id];
				this.vars.playerTexts[player.id].health.setText("DISCONNECTED");
				this.vars.playerTexts[player.id].killcount.setVisible(false);
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
				x: -200,
				y: -200
			}
		})
	};

	let firstChild = this.entities.players.group.getChildren();
	firstChild[0].destroy();

	this.entities.emitters = {};
	this.vars.playerTexts = {};
	this.entities.bonuses = {
		types: ["heart", "bomb"],
		group: this.physics.add.group({
			key: "heart",
			setXY: {
				x: -400,
				y: -400
			}
		})
	};

	this.anims.create({
		key: "falconFly",
		frames: this.anims.generateFrameNumbers("falcon", {
			start: 0,
			end: 3,
			first: 0
		}),
		frameRate: 20,
		repeat: -1
	});

	this.entities.enemies = this.physics.add.group({
		key: "falcon",
		setXY: {
			x: -600,
			y: -600
		}
	});
	firstChild = this.entities.enemies.getChildren();
	firstChild[0].destroy();

	this.entities.dummies = this.physics.add.group({
		key: "falcon",
		setXY: {
			x: -1000,
			y: -1000
		}
	});
	firstChild = this.entities.dummies.getChildren();
	firstChild[0].destroy();


	// TODO: REFACTOR MAYBE
	let tut1 = this.entities.dummies.create(gameAttributes.gameWidth - 100, 100, "falcon");
	tut1.anims.play("falconFly");
	let tut2 = this.entities.dummies.create(100, gameAttributes.gameHeight - 100, "falcon");
	tut2.anims.play("falconFly");
	let tut3 = this.entities.dummies.create(gameAttributes.gameWidth - 100, gameAttributes.gameHeight - 100, "falcon");
	tut3.anims.play("falconFly");
	let tut4 = this.entities.dummies.create(100, 100, "falcon");
	tut4.anims.play("falconFly");

	this.anims.create({
		key: "explode",
		frames: this.anims.generateFrameNumbers("explosion", {
			start: 0,
			end: 23,
			first: 0
		}),
		frameRate: 20
	});

	// let testBomb = this.entities.bonuses.group.create(400, 100, "gem");
	// testBomb.type = "gem";
	// console.log(this.entities.bonuses);
	// firstChild = this.entities.bonusus.group.getChildren();
	// firstChild[0].destroy();

	const addPlayer = (player_id, player_name, index) => {
		let startingPosition;
		switch (index) {
			case 0:
				if (this.vars.player_ids.length === 2) {
					startingPosition = gameAttributes.gameWidth / 2 - 160;
				} else {
					startingPosition = gameAttributes.gameWidth / 2;
				}
				break;
			case 1:
				if (this.vars.player_ids.length === 2) {
					startingPosition = gameAttributes.gameWidth + 160;
				} else {
					startingPosition = gameAttributes.gameWidth / 2 - 320;
				}
				break;
			case 2:
			startingPosition = gameAttributes.gameWidth / 2 + 320;
		}

		let player = this.entities.players.group.create(
			startingPosition,
			gameAttributes.gameHeight / 2,
			"pigeon"
		);

		player.id = player_id;
		player.name = player_name;
		player.colour = this.vars.player_colours[player_id];
		player.alive = true;
		player.killcount = 0;
		player.health = 3;
		player.shooting = false;
		player.bulletTime = 0;
		player.disabled = false;
		player.setCollideWorldBounds(true);
		player.setVelocityX(0);
		player.setVelocityY(0);
		player.originX = 0.5;
		player.originY = 0.5;
		// player.x = Math.random() * gameAttributes.gameWidth;
		// player.y = Math.random() * gameAttributes.gameHeight;
		this.entities.players.individuals[player_id] = player;
		addPlayerTexts(player, index);

		return player;
	};

	const addPlayerTexts = (player, index) => {
		let playerLabelText = this.add.text(100, 100 + index * 100, player.name, {
			font: "48px Arial",
			fill: player.colour
		});
		let healthText = this.add.text(
			290,
			100 + index * 100,
			`Health: ${"❤️".repeat(player.health)}`,
			{ font: "48px Arial", fill: player.colour }
		);
		healthText.id = player.id;
		const playerTexts = (this.vars.playerTexts[player.id] = {});
		let killcountText = this.add.text(
			290,
			140 + index * 100,
			"Kill Count: " + player.killcount,
			{ font: "48px Arial", fill: player.colour }
		);
		killcountText.id = player.id;
		playerTexts.health = healthText;
		playerTexts.killcount = killcountText;
	};

	this.anims.create({
		key: "pigeonFly",
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

		newPlayer.anims.play("pigeonFly");
		let emitter = this.add.particles(
			`${this.vars.player_colours[player_id]}_emitter`
		);

		let newPlayerEmitter = emitter.createEmitter({
			speed: 100,
			lifespan: 250,
			blendMode: "NORMAL",
			gravity: { x: 0, y: 200 },
			scale: { start: 0.1, end: 1 },
			follow: this.entities.players.individuals[this.vars.player_ids[i]]
		});

		this.entities.emitters[player_id] = newPlayerEmitter;
	}

	const tutContent = 	[
		`To fly, tilt the phone back and forth.`,
		`To turn, turn the phone left and right.`,
		`Press anywhere on the phone to shoot.`,
		`Shoot the four birds to start the game!`
	];

	this.vars.tutorialText = this.add.text(
		gameAttributes.gameWidth / 2,
		600,
		tutContent,
		{ font: "48px Arial", fill: "black" }
	);
	this.vars.tutorialText.setOrigin(0.5);

	this.vars.gameScoreText = this.add.text(
		gameAttributes.gameWidth / 2,
		100,
		`Score: ${this.vars.score}`,
		{ font: "48px Arial", fill: "black" }
	);
	this.vars.gameScoreText.setOrigin(0.5);
	this.vars.gameScoreText.visible = false;

	this.vars.flyText = this.add.text(
		gameAttributes.gameWidth / 2,
		gameAttributes.gameHeight / 2,
		`FLY!`,
		{ font: "256px Arial", fill: "black" }
	);
	this.vars.flyText.setOrigin(0.5);
	this.vars.flyText.visible = false;

	this.entities.bullets = this.physics.add.group({
		key: "laser",
		setCollideWorldBounds: true
	});

	firstChild = this.entities.bullets.getChildren();
	firstChild[0].destroy();

	this.physics.add.overlap(
		this.entities.enemies,
		this.entities.bullets,
		this.bulletEnemyCollision,
		null,
		this
	);

	this.physics.add.overlap(
		this.entities.dummies,
		this.entities.bullets,
		this.bulletDummyCollision,
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

	this.physics.add.overlap(
		this.entities.players.group,
		this.entities.bonuses.group,
		this.playerBonusCollision,
		null,
		this
	);

	const music = this.sound.add("playSong", { loop: true });
	console.log(music);
	music.play();
}
