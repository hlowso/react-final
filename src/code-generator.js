// Generates random character code for lobby linking

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateCode = () => {
	let code = "";
	for (let i = 0; i < 6; i++) {
		code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
	}
	return code;
};

export default generateCode;
