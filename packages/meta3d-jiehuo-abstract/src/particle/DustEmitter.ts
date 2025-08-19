import { dustEmitter, dustEmitterParam, dustParticle, particle, state } from "../type/StateType"
import { getEmpty, getExn, return_ } from "../utils/NullableUtils";
import * as EmitterUtils from "./EmitterUtils";
import { getParticleState } from "../state/State";
import { List } from "immutable";
import { push, pushArrs } from "../utils/ArrayUtils";

let _getState = (state: state): dustEmitter => {
	return getExn(getParticleState(state).dustEmitter)
}

let _setState = (state: state, dustEmitterState: dustEmitter) => {
	return {
		...state,
		particle: {
			...getParticleState(state),
			dustEmitter: return_(dustEmitterState)
		}
	}
}

export let createState = (): dustEmitter => {
	return {
		geometry: getEmpty(),
		particles: []
	}
}

export let init = (state: state, scene) => {
	return EmitterUtils.initWithoutRotation(state, (state, geometry) => {
		return _setState(state, {
			..._getState(state),
			geometry: return_(geometry)
		})
	}, scene, "meta3d-jiehuo-abstract/particle/smokeparticle.png", "#666")
}

let _buildParticle = ({ speed, life, size, position }): dustParticle => {
	// let opacityFactor = 0.4
	// let scaleFactor = 2

	// let createTime = Date.now()
	// let updateTime = Date.now()

	// 水平方向的扩散
	let speedAround = Math.random() * speed / 10
	if (speedAround < speed / 20) {
		speedAround -= speed / 6
	}
	else {
		speedAround += speed / 30
	}

	return {
		// life, size, range,
		// opacity: 1 * opacityFactor,
		// opacityFactor,
		// // scale: 1 + scaleFactor * (updateTime - createTime) / param.life, // 初始1，到达生命周期时为3
		// scale: 1,
		// scaleFactor,
		// createTime: Date.now(),
		// updateTime: Date.now(),
		// speed: [
		// 	speedAround,
		// 	Math.random() * speed / 3 + speed,
		// 	speedAround,
		// ],
		// position: [
		// 	Math.random() * 2 * range + position[0] - range,
		// 	position[1],
		// 	Math.random() * 2 * range + position[2] - range,
		// ],
		life,

		size,
		opacity: 1,
		createTime: Date.now(),
		updateTime: Date.now(),
		speed: [
			speedAround,
			Math.random() * speed / 3 + speed,
			speedAround,
		],
		// position: [
		// 	Math.random() * 2 * range + position[0] - range,
		// 	position[1],
		// 	Math.random() * 2 * range + position[2] - range,
		// ],

		position,

	}
}

let _buildRandomLife = (life) => {
	return life * (1 + Math.random())
}

export let emit = (state: state, {
	speed,
	life,
	size,
	position
}: dustEmitterParam) => {
	let [x, y, z] = position
	let offset = size / 5
	let yOffset = size / 5

	let particles = pushArrs(_getState(state).particles,
		// _buildParticle({
		// 	speed, life, size, range,
		// 	position: [x, y + yOffset, z]
		// }),
		// _buildParticle({
		// 	speed, life, size, range,
		// 	position: [x - offset, y + yOffset, z]
		// }),
		// _buildParticle({
		// 	speed, life, size, range,
		// 	position: [x + offset, y + yOffset, z]
		// }),
		// _buildParticle({
		// 	speed, life, size, range,
		// 	position: [x, y + yOffset, z - offset]
		// }),
		// _buildParticle({
		// 	speed, life, size, range,
		// 	position: [x, y + yOffset, z + offset]
		// }),

		[
			_buildParticle({
				speed, life: _buildRandomLife(life), size,
				position: [x, y + yOffset, z]
			}),
			_buildParticle({
				speed, life: _buildRandomLife(life), size,
				position: [x - offset, y + yOffset, z]
			}),
			_buildParticle({
				speed, life: _buildRandomLife(life), size,
				position: [x + offset, y + yOffset, z]
			}),
			_buildParticle({
				speed, life: _buildRandomLife(life), size,
				position: [x, y + yOffset, z - offset]
			}),
			_buildParticle({
				speed, life: _buildRandomLife(life), size,
				position: [x, y + yOffset, z + offset]
			}),
		]

	)

	return _setState(state, {
		..._getState(state),
		particles
	})
}

export let update = (state: state) => {
	return EmitterUtils.update(state, [
		state => _getState(state).particles,
		(state, particles) => {
			return _setState(state, {
				..._getState(state),
				particles
			})
		},
		(particle, _, i, now) => {
			const time = now - particle.updateTime

			let upLife = particle.life / 3
			let downLife = particle.life - upLife
			let passedTime = (now - particle.createTime)

			if (passedTime <= upLife) {
				let speed = particle.speed

				EmitterUtils.updatePosition(particle.position, 0, speed[0] / 2, time, true)
				EmitterUtils.updatePosition(particle.position, 1, speed[1], time, true)
				EmitterUtils.updatePosition(particle.position, 2, speed[2] / 2, time, true)


				particle.opacity = 1


				particle.size *= 1.01
			}
			else {
				let speed = particle.speed

				EmitterUtils.updatePosition(particle.position, 1, speed[1], time, false)


				particle.opacity = 1 - ((passedTime - upLife) / downLife)


				particle.size /= 1.01
			}

			return particle
		}
	], getExn(_getState(state).geometry))
}