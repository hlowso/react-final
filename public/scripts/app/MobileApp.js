define([], () => {
	const getMotionHandler = ws => {
		return function(event) {
			ws.send(JSON.stringify({
				ac_vector: event.accelerationIncludingGravity
			}));
		};
	};

	class MobileApp extends React.Component {
		render() {
		  this.props.ws.onopen = () => {
				window.addEventListener(
					'devicemotion', 
					getMotionHandler(this.props.ws), 
					true
				);
			};
			return (
				<h1>This is for the Mobile App</h1>
			);
		}
	}

	return MobileApp;
});