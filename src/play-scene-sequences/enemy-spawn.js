import gameAttributes from "../game-attributes.js";

export default function() {
	let numberOfEnemies = Math.floor(this.vars.score / 10000) + 1;
	let step = 1;

	while (step <= numberOfEnemies) {

		let path = [];
		let curve;
		let points;
		let xOrY;
		let enemyPath;
		let xCoord;
		let yCoord;
		let leftOrRight;

		const createPath = (x, y) => {
			// path = { t: 0, vec: new Phaser.Math.Vector2() };

			points = [x, y];

			for (
				let point = 0;
				point < Math.floor(Math.random() * (12 - 6) + 6);
				point++
			) {
				points.push(Math.random() * gameAttributes.gameWidth);
				points.push(Math.random() * gameAttributes.gameHeight);
			}

			points.push(gameAttributes.gameWidth);
			points.push(Math.random() * gameAttributes.gameHeight);

			curve = new Phaser.Curves.Spline(points);
			return curve;
		};

		xOrY = Math.floor(Math.random() * Math.floor(2));
		if (xOrY === 0) {
			xCoord = Math.floor(Math.random() * Math.floor(gameAttributes.gameWidth));
			yCoord = 0;
			enemyPath = createPath(xCoord, yCoord);
		} else {
			yCoord = Math.floor(Math.random() * Math.floor(gameAttributes.gameHeight));
			leftOrRight = Math.floor(Math.random() * Math.floor(2));
			if (leftOrRight === 0) {
				xCoord = 0;
				enemyPath = createPath(xCoord, yCoord);
			} else {
				xCoord = gameAttributes.gameWidth;
				enemyPath = createPath(xCoord, yCoord);
			}
		}
		let enemy = this.entities.enemies.create(
			enemyPath.points[0].x,
			enemyPath.points[0].y,
			"falcon"
		);

		enemy.anims.play("falconFly");

		enemy.setCollideWorldBounds(true);

		for (let i = 1; i < enemyPath.points.length; i++) {
			path.push({
				x: enemyPath.points[i].x,
				y: enemyPath.points[i].y
			});
		}

		path.push({
				x: enemyPath.points[0].x,
				y: enemyPath.points[0].y
			});

		let enemyTimeline = this.tweens.timeline({
			targets: enemy,
			duration: 1000,
			loop: -1,
			ease: "Sine.easeInOut",
			tweens: path
		});

		step++;
	}
}
