import { stompDustEmitter, stompDustEmitterParam, stompDustParticle, particle, state } from "../type/StateType"
import { getEmpty, getExn, return_ } from "../utils/NullableUtils";
import * as EmitterUtils from "./EmitterUtils";
import { getIsDebug, getParticleState } from "../state/State";
import { List } from "immutable";
import { isInteger } from "../utils/NumberUtils";
import { ensureCheck, test } from "../utils/Contract";
import { push, pushArrs } from "../utils/ArrayUtils";
import { Console } from "../Main";

let _getState = (state: state): stompDustEmitter => {
	return getExn(getParticleState(state).stompDustEmitter)
}

let _setState = (state: state, stompDustEmitterState: stompDustEmitter) => {
	return {
		...state,
		particle: {
			...getParticleState(state),
			stompDustEmitter: return_(stompDustEmitterState)
		}
	}
}

export let createState = (): stompDustEmitter => {
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
	}, scene, "meta3d-jiehuo-abstract/particle/smoke512.png", "#B2AA98")
}

let _buildParticle = ({ speed, life, changeLife, size, position }): stompDustParticle => {
	// let opacityFactor = 0.4
	// let scaleFactor = 2

	// let createTime = Date.now()
	// let updateTime = Date.now()

	// // 水平方向的扩散
	// let speedAround = Math.random() * speed / 10
	// if (speedAround < speed / 20) {
	// 	speedAround -= speed / 6
	// }
	// else {
	// 	speedAround += speed / 30
	// }

	return {
		life,
		changeLife,

		size,
		//  range,
		opacity: 0,

		// opacity: 1 * opacityFactor,
		// opacityFactor,
		// // scale: 1 + scaleFactor * (updateTime - createTime) / param.life, // 初始1，到达生命周期时为3
		// scale: 1,
		// scaleFactor,
		createTime: Date.now(),
		updateTime: Date.now(),
		// speed: [
		// 	speedAround,
		// 	Math.random() * speed / 3 + speed,
		// 	speedAround,
		// ],
		speed,

		// position: [
		// 	Math.random() * 2 * range + position[0] - range,
		// 	position[1],
		// 	Math.random() * 2 * range + position[2] - range,
		// ],
		position: position.slice()
	}
}

export let emit = (state: state, {
	// range,
	speed,
	life,
	changeLife,
	size,
	position
}: stompDustEmitterParam) => {
	// let [x, y, z] = position
	// let offset = size / 5
	// let yOffset = size / 5

	let particles = pushArrs(_getState(state).particles,
		[
			_buildParticle({
				speed, life, changeLife, size,
				position
			}),
			_buildParticle({
				speed, life, changeLife, size,
				position
			}),
			_buildParticle({
				speed, life, changeLife, size,
				position
			}),
			_buildParticle({
				speed, life, changeLife, size,
				position
			}),
			_buildParticle({
				speed, life, changeLife, size,
				position
			}),
			_buildParticle({
				speed, life, changeLife, size,
				position
			}),
			_buildParticle({
				speed, life, changeLife, size,
				position
			}),
			_buildParticle({
				speed, life, changeLife, size,
				position
			}),
		]
	)

	return _setState(state, {
		..._getState(state),
		particles
	})
}

let _getParticles = (state) => {
	let value = _getState(state).particles

	if (value.length % 8 !== 0) {
		Console.warn("should be 8's times")
	}

	// return ensureCheck(
	// 	value,
	// 	(value) => {
	// 		test("should be 8's times", () => {
	// 			return value.length % 8 === 0
	// 		})
	// 	}, getIsDebug(state))

	return value
}

export let update = (state: state) => {
	return EmitterUtils.update(state, [
		_getParticles,
		(state, particles) => {
			return _setState(state, {
				..._getState(state),
				particles
			})
		},
		(particle, _, i, now) => {
			let time = now - particle.updateTime
			let notChangeLife = particle.life - particle.changeLife
			let passedTime = (now - particle.createTime)


			if (passedTime <= particle.changeLife) {
				// 更新位置
				let speed = particle.speed
				let obliqueSpeed = speed * Math.cos(Math.PI / 4)

				switch (i % 8) {
					case 0:
						EmitterUtils.updatePosition(particle.position, 0, speed, time, true)
						break
					case 1:
						EmitterUtils.updatePosition(particle.position, 0, obliqueSpeed, time, true)
						EmitterUtils.updatePosition(particle.position, 2, obliqueSpeed, time, true)
						break
					case 2:
						EmitterUtils.updatePosition(particle.position, 2, speed, time, true)
						break
					case 3:
						EmitterUtils.updatePosition(particle.position, 0, obliqueSpeed, time, false)
						EmitterUtils.updatePosition(particle.position, 2, obliqueSpeed, time, true)
						break
					case 4:
						EmitterUtils.updatePosition(particle.position, 0, speed, time, false)
						break
					case 5:
						EmitterUtils.updatePosition(particle.position, 0, obliqueSpeed, time, false)
						EmitterUtils.updatePosition(particle.position, 2, obliqueSpeed, time, false)
						break
					case 6:
						EmitterUtils.updatePosition(particle.position, 2, speed, time, false)
						break
					case 7:
						EmitterUtils.updatePosition(particle.position, 0, obliqueSpeed, time, true)
						EmitterUtils.updatePosition(particle.position, 2, obliqueSpeed, time, false)
						break
					default:
						throw new Error("err")
				}

				// 计算粒子透明度
				// particle.opacity = (time / particle.life) * 0.5
				particle.opacity = passedTime / particle.changeLife



				//set size
				// particle.size *= (1 + (passedTime / particle.changeLife) / 20)
				particle.size *= 1.01

			}
			else {
				// Console.log(particle.opacity)
				particle.opacity = 1 - ((passedTime - particle.changeLife) / notChangeLife)
			}

			return particle
		}

	], getExn(_getState(state).geometry))
}