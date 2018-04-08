// TODO ensure that while the user is configuring, if they're straddling the line between -180 and 180, then that's taken into account
// TODO make it so that it doesn't matter if they have their phone with their right thumb on the home button, or their left thumb on the home button
// TODO click n hold is for mouse click events! You've got to find the equivalent for touch events.
import React, { Button } from "react";
// import { Holdable, defineHold, holdProgress } from "react-touch";

const initial_alphas = [];
const initial_gammas = [];

class MobileApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			step: 1,
			instruction:
				"Enter the code on your desktop's screen to connect this phone.",
			ovec: {
				alpha: 0.0,
				beta: 0.0,
				gamma: 0.0
			},
			alpha_offset: 0.0,
			velocity: {
				x: 0.0,
				y: 0.0
			},
			useOrientation: () => {}
		};
		this.ws = new WebSocket(window.location.origin.replace(/^http/, "ws"));
		this.calibrationHandler = this.calibrationHandler.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.shootHandler = this.shootHandler.bind(this);
		this.ceaseFireHandler = this.ceaseFireHandler.bind(this);
	}

	componentDidMount() {
		const orientationHandler = event => {
			// SO THE ONLY PREPROCESSING WE DO ON THE OVEC
			// IS TO GIVE ALPHA THE SAME RANGE AS BETA

			const adjusted_alpha = event.alpha - 180.0;
			const normalized_alpha = adjusted_alpha - this.state.alpha_offset;
			let readjusted_alpha;

			if (normalized_alpha > 180) {
				readjusted_alpha = normalized_alpha - 360.0;
			} else if (normalized_alpha < -180.0) {
				readjusted_alpha = normalized_alpha + 360.0;
			} else {
				readjusted_alpha = normalized_alpha;
			}

			this.setState(
				{
					ovec: {
						alpha: readjusted_alpha,
						beta: event.beta,
						gamma: event.gamma
					}
				},
				this.state.useOrientation()
			);
		};

		this.ws.onopen = () => {
			this.ws.onmessage = incoming_message => {
				const message = JSON.parse(incoming_message.data);
				if (message.success) {
					this.setState({
						step: 2,
						instruction:
							"Turn your phone 90 degrees to the left. Press 'Calibrate' when your phone is in a comfortable position.",
						error: ""
					});
					window.addEventListener(
						"deviceorientation",
						orientationHandler,
						true
					);
				} else {
					this.setState({
						error: message.error
					});
				}
			};
		};
	}

	send(data) {
		const message = {
			device: "mobile"
		};
		for (let key in data) {
			message[key] = data[key];
		}
		this.ws.send(JSON.stringify(message));
	}

	calibrationHandler(event) {
		this.setState(
			{
				step: 3,
				instruction: "Now hold still!",
				useOrientation: () => {
					initial_alphas.push(this.state.ovec.alpha);
					initial_gammas.push(this.state.ovec.gamma);
				}
			},
			() => {
				setTimeout(() => {
					const alpha_sum = initial_alphas.reduce((sum, a) => sum + a);
					const gamma_sum = initial_gammas.reduce((sum, a) => sum + a);

					const alpha_offset = alpha_sum / initial_alphas.length;
					const gamma_offset = alpha_sum / initial_gammas.length;

					const y_zero =
						gamma_offset > 0.0
							? -1.0 * (gamma_offset - 90.0)
							: -1.0 * (gamma_offset + 90.0);

					this.setState({
						step: 4,
						alpha_offset,
						y_zero,
						useOrientation: () => {
							const a = this.state.ovec.alpha;
							const b = this.state.ovec.beta;
							const g = this.state.ovec.gamma;
							const C = Math.abs(g) / 90.0;

							let beta_component_for_x, alpha_component_for_x, x, y;

							if (g > 0.0) {
								if (b > 0.0) {
									beta_component_for_x = b - 180.0;
								} else {
									beta_component_for_x = b + 180.0;
								}
								if (a > 0.0) {
									alpha_component_for_x = a - 180.0;
								} else {
									alpha_component_for_x = a + 180.0;
								}
								y = -1.0 * (g - 90.0);
							} else {
								beta_component_for_x = b;
								alpha_component_for_x = a;
								y = -1.0 * (g + 90.0);
							}

							x =
								-1.0 *
								((1.0 - C) * beta_component_for_x + C * alpha_component_for_x);
							y = y - this.state.y_zero;

							const x_normalized = Math.pow(10.0 * (x / 90.0), 2);
							const y_normalized = Math.pow(10.0 * (y / 90.0), 2);

							this.setState(
								{
									velocity: {
										x: x < 0.0 ? -1.0 * x_normalized : x_normalized,
										y: y < 0.0 ? -1.0 * y_normalized : y_normalized
									}
								},
								() => {
									this.send({
										subject: "push",
										velocity: this.state.velocity
									});
								}
							);
						}
					});
				}, 5000);
			}
		);
	}

	handleSubmit(event) {
		event.preventDefault();
		const code =
			event.target.c0.value +
			event.target.c1.value +
			event.target.c2.value +
			event.target.c3.value +
			event.target.c4.value +
			event.target.c5.value;

		console.log("sending message: code:", code);
		this.send({
			subject: "connect",
			code
		});
	}

	shootHandler(event) {
		console.log("I'm shooting");
		event.preventDefault();
		this.send({
			subject: "shoot",
			shooting: true
		});
	}

	ceaseFireHandler(event) {
		console.log("I'm no longert shooting");

		event.preventDefault();
		this.send({
			subject: "shoot",
			shooting: false
		});
	}

	render() {
		const CodeFormView = (
			<div>
				<h1>{this.state.instruction}</h1>
				<form onSubmit={this.handleSubmit}>
					<input type="text" name="c0" maxlength="1" />
					<input type="text" name="c1" maxlength="1" />
					<input type="text" name="c2" maxlength="1" />
					<input type="text" name="c3" maxlength="1" />
					<input type="text" name="c4" maxlength="1" />
					<input type="text" name="c5" maxlength="1" />
					<input type="submit" value="Connect" />
				</form>
				<h1>{this.state.error}</h1>
			</div>
		);

		const CalibrationButton = this.state.step === 2 && (
			<button onClick={this.calibrationHandler}>Calibrate</button>
		);

		const CalibrationView = (
			<div>
				<h1>{this.state.instruction}</h1>
				<ul>
					<li>alpha: {this.state.ovec.alpha}</li>
					<li>beta: {this.state.ovec.beta}</li>
					<li>gamma: {this.state.ovec.gamma}</li>

					<li> PROCESSED </li>

					<li>x velocity: {this.state.velocity.x}</li>
					<li>y velocity: {this.state.velocity.y}</li>
				</ul>
				{CalibrationButton}
			</div>
		);

		// const hold = defineHold({ updateEvery: 50, holdFor: 500 });

		const GameView = (
			<div>
				<h1>{this.state.instruction}</h1>
				<div
					style={{ width: "100px", height: "100px", backgroundColor: "blue" }}
					onTouchStart={this.shootHandler}
					onTouchEnd={this.ceaseFireHandler}
				/>
			</div>
		);

		switch (this.state.step) {
			case 1:
				return CodeFormView;
			case 2:
				return CalibrationView;
			case 3:
				return CalibrationView;
			case 4:
				return GameView;
		}
	}
}

export default MobileApp;
