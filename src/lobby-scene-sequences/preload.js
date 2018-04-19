import SkyBackground from "../assets/sky.png";
// import greyedTOBackground from "../assets/toronto_greyed.png";
import NewGameButton from "../assets/new_game_button.png";

export default function() {
  // this.load.image("toronto_greyed", greyedTOBackground);
	this.load.image("background", SkyBackground);
	this.load.image("new-game-button", NewGameButton);
}
