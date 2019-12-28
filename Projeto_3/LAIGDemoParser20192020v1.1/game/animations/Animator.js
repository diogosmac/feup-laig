/**
 * Animator - Class that encapsulates all the animation logic of the microbes
 */
class Animator {
	/**
	 * Constructor for the class
	 */
	constructor(orchestrator) {
		this.orchestrator = orchestrator;

		this.time = this.orchestrator.time;
		this.scheduledConvert = {
			time: 0,
			tile: null
		}
	}

	/**
	 * Method that generates a leaping animation, for when the microbe on this tile moves
	 */
	leapAnimation(tile, newTile) {
		if (tile.microbe != null) {
			let transX = newTile.x - tile.x;
			let transY = newTile.y - tile.y;

			let raise = new MyKeyframe([transY / 4, 2, transX / 4], [0, 0, 0], [1, 1, 1], this.orchestrator.time + 0.5);
			let hold = new MyKeyframe([(3/4) * transY, 2, (3/4) * transX], [0, 0, 0], [1, 1, 1], this.orchestrator.time + 1.0);
			let strike = new MyKeyframe([transY, 0, transX], [0, 0, 0], [1, 1, 1], this.orchestrator.time + 1.5);

			let keyframes = [raise, hold, strike];

			tile.microbe.animation = new KeyframeAnimation(this.orchestrator.scene, keyframes);
		}
	}

	convertAnimation(tile) {
		if (tile.microbe != null) {
			let jump = new MyKeyframe([0, 2, 0], [0, 0, 0], [1, 1, 1], this.orchestrator.time + 0.4);
			let expand = new MyKeyframe([0, 2, 0], [0, Math.PI / 2, 0], [3, 1, 3], this.orchestrator.time + 0.7);
			let twirl = new MyKeyframe([0, 1.8, 0], [0, Math.PI, 0], [1, 1, 1], this.orchestrator.time + 1);
			let restore = new MyKeyframe([0, 0, 0], [0, Math.PI * 4, 0], [1, 1, 1], this.orchestrator.time + 1.5);

			let keyframes = [jump, expand, twirl, restore];

			tile.microbe.animation = new KeyframeAnimation(this.orchestrator.scene, keyframes);
		}

		this.scheduleConversion(tile, this.orchestrator.time + 0.7);
	}

	scheduleConversion(tile, time) {
		this.scheduledConvert.tile = tile;
		this.scheduledConvert.time = time;
	}

	/**
	 * Method that converts a microbe to the opponent side
	 */
	convert(tile) {
		let microbe = tile.microbe;

		if (microbe.type == 'A') {
			microbe.type = 'B';
			microbe.loadTemplate(this.orchestrator.templates['microbeB']);
		}
		else if (microbe.type == 'B') {
			microbe.type = 'A';
			microbe.loadTemplate(this.orchestrator.templates['microbeA']);
		}

		this.scheduledConvert.tile = null;

	}

	update(t) {
		this.time = t;
		if (this.scheduledConvert.tile != null)
			if (this.scheduledConvert.time < t) {
				this.convert(this.scheduledConvert.tile);
			}
	}


}
