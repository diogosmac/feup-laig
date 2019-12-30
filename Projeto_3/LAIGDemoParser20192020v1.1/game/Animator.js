/**
 * Animator - Class that encapsulates all the animation logic of the microbes
 */
class Animator {
	/**
	 * Constructor for the class
	 * @param {GameOrchestrator} - reference to the game orchestrator
	 */
	constructor(orchestrator) {
		this.orchestrator = orchestrator;
		this.scheduledConverts = [];
		this.animationsDone = false;
		this.animationsPending = false;
		this.lastAnimFrame = 0;
	}


	/**
	 * Method that resets the animator fields for the start of a new game
	 */
	reset() {
		this.scheduledConverts = [];
		this.animationsDone = false;
		this.animationsPending = false;
		this.lastAnimFrame = 0;
	}


	/**
	 * Method that generates an animation for a newly created microbe
	 * @param {char} player - player A or B
	 * @param {Tile} newObject - destination tile of the animation
	 */
	assignCreateAnimation(player, newTile) {
		let sideBoard = this.orchestrator.board.generateMicrobeSideBoard(player);

		if (sideBoard.microbe != null) {
			let transX = newTile.x - sideBoard.x;
			let transY = newTile.y - sideBoard.y;

			let raise = new MyKeyframe([0, 3, 0], [0, 0, 0], [1, 1, 1], 0.5);
			let hold = new MyKeyframe([(3/4) * transY, 2, (3/4) * transX], [0, 0, 0], [1, 1, 1], 1.0);
			let strike = new MyKeyframe([transY, 0.05, transX], [0, 0, 0], [1, 1, 1], 1.5);

			let keyframes = [raise, hold, strike];

			sideBoard.microbe.animation = new KeyframeAnimation(this.orchestrator.scene, keyframes);
			this.animationsDone = false;
			this.animationsPending = true;

			if(this.lastAnimFrame < this.orchestrator.currentTime + 2.0)
				this.lastAnimFrame = this.orchestrator.currentTime + 2.0;
		}
	}


	/**
	 * Method that generates a leaping animation, for when the microbe on this tile moves
	 * @param {Tile} oldTile - source tile of the animation
	 * @param {Tile} newTile - destination tile of the animation
	 */
	assignMoveAnimation(oldTile, newTile) {
		if (oldTile.microbe != null) {

			let transX = newTile.x - oldTile.x;
			let transY = newTile.y - oldTile.y;

			let raise = new MyKeyframe([transY / 4, 2, transX / 4], [0, 0, 0], [1, 1, 1], 0.5);
			let hold = new MyKeyframe([(3/4) * transY, 2, (3/4) * transX], [0, 0, 0], [1, 1, 1], 1.0);
			let strike = new MyKeyframe([transY, 0, transX], [0, 0, 0], [1, 1, 1], 1.5);

			let keyframes = [raise, hold, strike];

			oldTile.microbe.animation = new KeyframeAnimation(this.orchestrator.scene, keyframes);
			this.animationsDone = false;
			this.animationsPending = true;

			if(this.lastAnimFrame < this.orchestrator.currentTime + 2.0)
				this.lastAnimFrame = this.orchestrator.currentTime + 2.0;
		}
	}


	/**
	 * Method that generates a conversion animation, for when a microbe is contaminated
	 * @param {Tile} tile - tile where the microbe is standing on
	 */
	assignConvertAnimation(tile) {
		if (tile.microbe != null) {
			let start = new MyKeyframe([0, 0, 0], [0, 0, 0], [1, 1, 1], 2.0);
			// let jump = new MyKeyframe([0, 2, 0], [0, 0, 0], [1, 1, 1], 2.4);
			// let expand = new MyKeyframe([0, 2, 0], [0, Math.PI / 2, 0], [3, 1, 3], 2.7);
			// let twirl = new MyKeyframe([0, 1.8, 0], [0, Math.PI, 0], [1, 1, 1], 3);
			// let restore = new MyKeyframe([0, 0, 0], [0, Math.PI * 4, 0], [1, 1, 1], 3.5);

			// let keyframes = [start, jump, expand, twirl, restore];

			let expand = new MyKeyframe([0, 0, 0], [0, Math.PI / 2, 0], [2, 1, 2], 2.4);
			let restore = new MyKeyframe([0, 0, 0], [0, Math.PI * 4, 0], [1, 1, 1], 2.8);

			let keyframes = [start, expand, restore];

			tile.microbe.animation = new KeyframeAnimation(this.orchestrator.scene, keyframes);
			this.animationsDone = false;
			this.animationsPending = true;

			// if(this.lastAnimFrame < this.orchestrator.currentTime + 4.5)
			// 	this.lastAnimFrame = this.orchestrator.currentTime + 4.5;

			if(this.lastAnimFrame < this.orchestrator.currentTime + 2.8)
				this.lastAnimFrame = this.orchestrator.currentTime + 2.8;

			this.scheduleConversion(tile, this.orchestrator.currentTime + 2.4);
		}
	}


	/**
	 * Method that schedules the conversion process of a microbe
	 * @param {Tile} tile - tile where the microbe is at 
	 * @param {float} time - time at when the conversion should be made
	 */
	scheduleConversion(tile, time) {
		this.scheduledConverts.push({tile: tile, time: time});
	}


	/**
	 * Method that converts a microbe to the opponent side
	 * @param {Tile} tile - tile where the microbe is on
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
	}


	/**
	 * Update method for all the animations
	 */
	update() {
		for(let i = this.scheduledConverts.length - 1; i >= 0; i--) {
			let scheduledConvert = this.scheduledConverts[i];
			if (scheduledConvert.time <= this.orchestrator.currentTime) {
				this.convert(scheduledConvert.tile);
				this.scheduledConverts.splice(i, 1);
			}
		}

		if (this.animationsPending && !this.animationsDone && this.orchestrator.currentTime > this.lastAnimFrame) {
			this.animationsDone = true;
			this.animationsPending = false;
		}
	}
}
