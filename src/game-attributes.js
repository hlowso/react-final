import generateCode from "./code-generator.js";

const gameAttributes = {
	code: generateCode(),
	spriteSize: 40,
	gameWidth: window.innerWidth * window.devicePixelRatio,
	gameHeight: window.innerHeight * window.devicePixelRatio,
	gameSpeed: 100
};

export default gameAttributes;
