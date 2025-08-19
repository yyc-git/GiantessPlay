import { Vector3 } from "three"

export class ScreenShake {
	// When a function outside ScreenShake handle the camera it should
	// always check that ScreenShake.enabled is false before.
	public enabled = false

	private _timestampStart = 0

	private _timestampEnd = 0

	private _targetDistance = -1

	// private _movedDistance = 0



	private _getTargetFunc

	// private _startPoint = undefined

	// private _endPoint = undefined


	constructor() {
	}

	// update(camera) must be called in the loop function of the renderer
	// it will repositioned the camera according to the requested shaking.
	public update(specificState, camera) {
		if (this.enabled == true) {
			const now = Date.now()
			if (this._timestampEnd > now) {
				let interval = (Date.now() - this._timestampStart) /
					(this._timestampEnd - this._timestampStart)
				this._computePosition(specificState, camera, interval)
			}
			else {
				// camera.position.copy(this._startPoint)
				this.enabled = false




				// camera.position.set(
				// 	camera.position.x ,
				// 	camera.position.y,
				// 	camera.position.z+ this._movedDistance,
				// )

				// this._movedDistance = 0


				camera.lookAt(this._getTargetFunc(specificState))

			}
		}
	}


	// This initialize the values of the shaking.
	// vecToAdd param is the offset of the camera position at the climax of its wave.
	// public shake(camera, distance, milliseconds) {
	// public shake(distance, milliseconds) {
	public shake(getTargetFunc, distance, milliseconds) {
		this.enabled = true
		this._timestampStart = Date.now()
		this._timestampEnd = this._timestampStart + milliseconds


		this._targetDistance = distance
		// this._movedDistance = 0

		// this._startPoint = new Vector3().copy(camera.position)
		// this._endPoint = new Vector3().addVectors(camera.position, vecToAdd)

		this._getTargetFunc = getTargetFunc
	}


	private _computePosition(specificState, camera, interval) {
		// // This creates the wavy movement of the camera along the interval.
		// // The first bloc call this._getQuadra() with a positive indice between
		// // 0 and 1 then the second call it again with a negative indice between
		// // 0 and -1 etc. Variable position will get the sign of the indice and
		// // get wavy.
		// if (interval < 0.4) {
		// 	var position = this._getQuadra(interval / 0.4)
		// } else if (interval < 0.7) {
		// 	var position = this._getQuadra((interval - 0.4) / 0.3) * -0.6
		// } else if (interval < 0.9) {
		// 	var position = this._getQuadra((interval - 0.7) / 0.2) * 0.3
		// } else {
		// 	var position = this._getQuadra((interval - 0.9) / 0.1) * -0.1
		// }

		// // Here the camera is positioned according to the wavy 'position' variable.
		// // camera.position.lerpVectors(this._startPoint, this._endPoint, position)

		// let move
		// let step = this._targetDistance / 10

		// if (interval < 0.25) {
		// 	move = step
		// 	this._movedDistance += move
		// }
		// else if (interval < 0.5) {
		// 	move = - step
		// 	this._movedDistance -= move
		// }
		// else if (interval < 0.75) {
		// 	move = - step
		// 	this._movedDistance -= move
		// }
		// else {
		// 	move = step
		// 	this._movedDistance += move
		// }


		// camera.position.set(
		// 	camera.position.x ,
		// 	camera.position.y,
		// 	camera.position.z + move,
		// )

		// let position
		// if (interval < 0.4) {
		// 	position = this._getQuadra(interval / 0.4)
		// } else if (interval < 0.7) {
		// 	position = this._getQuadra((interval - 0.4) / 0.3) * -0.6
		// } else if (interval < 0.9) {
		// 	position = this._getQuadra((interval - 0.7) / 0.2) * 0.3
		// } else {
		// 	position = this._getQuadra((interval - 0.9) / 0.1) * -0.1
		// }

		let move
		let step = this._targetDistance / 10
		if (interval < 0.25) {
			move = step
		}
		else if (interval < 0.5) {
			move = - step
		}
		else {
			step = this._targetDistance / 20

			if (interval < 0.75) {
				move = - step
			}
			else {
				move = step
			}

		}

		let target = this._getTargetFunc(specificState)
		camera.lookAt(target.clone().setY(target.y + move))
		// Console.log(
		// 	target.clone().setY(target.y + move).y
		// )
	}

	// // This is a quadratic function that return 0 at first then return 0.5 when t=0.5
	// // then return 0 when t=1 
	// private _getQuadra(t) {
	// 	return 9.436896e-16 + (4 * t) - (4 * (t * t))
	// }
}

