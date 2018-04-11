import PidgeonIcon from "../assets/pigeon_ph.png";
import EnemyIcon from "../assets/falcon_ph.png";
import SkyBackground from "../assets/sky.png";
import GreenLaser from "../assets/bullet38.png";
import redEmitter from "../assets/red.png";
import yellowEmitter from "../assets/yellow.png";

export default function() {
	this.load.image("background", SkyBackground);
	this.load.image("pigeon", PidgeonIcon, 129, 84);
	this.load.image("falcon", EnemyIcon, 85, 56);
	this.load.image("laser", GreenLaser);
  this.load.image("red_emitter", redEmitter);
  this.load.image("yellow_emitter", yellowEmitter);
}
