define([], () => {

	class MobileApp extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				message: "This is the Mobile App"
			};
			this.ws = new WebSocket(
				window.location.origin.replace(/^http/, 'ws')
			);
		}

		// getMotionHandler() {
		// 	return function(event) {
		// 		ws.send(JSON.stringify({
		// 			device: 'mobile',
					
		// 		}));
		// 	};
		// };

		componentDidMount() {

			const motionHandler = (event) => {
				this.send({
					subject: 'push',
					acv: event.acceleration
				});
			};

			const orientationHandler = (event) => {
				this.send({
					subject: 'push',
					ovec: {
						alpha: event.alpha,
						beta: event.beta + 180.0,
						gamma: event.gamma + 90.0
					}
				});
			};

			this.ws.onopen = () => {
		  	this.send({
		  		subject: 'connect',
		  		code: 'buster'
		  	});
			};

			this.ws.onmessage = () => {
				this.setState({
					message: "Found your laptop!"
				});
				window.addEventListener(
					'deviceorientation',
					orientationHandler,
					//'devicemotion', 
					//motionHandler, 
					true
				);
			};
		}

		send(data) {
			const message = {
				device: 'mobile'
			};
			for(let key in data) {
				message[key] = data[key];
			}
			this.ws.send(JSON.stringify(message));
		}

		render() {
			return (
				<h1>{this.state.message}</h1>
			);
		}
	}

	return MobileApp;
});