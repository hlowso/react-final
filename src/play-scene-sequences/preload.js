// import PidgeonIcon from "../assets/pigeon_ph.png";
// import EnemyIcon from "../assets/falcon_ph.png";
import EnemyIcon from "../assets/falcon.png";
import SkyBackground from "../assets/sky.png";
import GreenLaser from "../assets/bullet38.png";
import Emitter from "../assets/white_emitter.png";
//import yellowEmitter from "../assets/yellow.png";
import Explosion from "../assets/explosion.png";
import Pigeon from "../assets/pigeon .png";

export default function() {
	this.load.image("background", SkyBackground);
	// this.load.image("pigeon", PidgeonIcon, 129, 84);
	// this.load.image("falcon", EnemyIcon, 85, 56);
	this.load.image("laser", GreenLaser);
  this.load.image("white_emitter", Emitter);
  //this.load.image("yellow_emitter", yellowEmitter);


  this.load.spritesheet("pigeon", Pigeon, { frameWidth: 120, frameHeight: 120, endFrame: 3 });
  this.load.spritesheet("falcon", EnemyIcon, { frameWidth: 150, frameHeight: 150, endFrame: 3 });
  this.load.spritesheet("explosion", Explosion, { frameWidth: 64, frameHeight: 64, endFrame: 23 });
}
