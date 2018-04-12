const express = require("express");
const PORT = process.env.PORT || 3000;

module.exports = routes => {
	const server = express()
		.use(express.static("dist"))
		.use("/", routes)
		.listen(PORT, () =>
			console.log(`Express server listening on port ${PORT}`)
		);

	require("./websocket-server.js")(server);
};
