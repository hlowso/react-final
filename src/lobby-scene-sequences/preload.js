import SkyBackground from "../assets/sky.png";
// import greyedTOBackground from "../assets/toronto_greyed.png";
import NewGameButton from "../assets/new_game_button.png";
import ThemeSong from "../assets/Take_Down_2.mp3";


export default function() {
  // this.load.image("toronto_greyed", greyedTOBackground);
	this.load.image("background", SkyBackground);
	this.load.image("new-game-button", NewGameButton);

  this.load.audio("playSong", [ThemeSong]);
}
