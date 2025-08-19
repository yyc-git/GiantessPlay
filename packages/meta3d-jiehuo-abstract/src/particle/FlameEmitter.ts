import { flameEmitter, flameEmitterParam, flameParticle, particle, state } from "../type/StateType"
import { getEmpty, getExn, return_ } from "../utils/NullableUtils";
import * as EmitterUtils from "./EmitterUtils";
import { getParticleState } from "../state/State";
import { List } from "immutable";
import { push, pushArrs, range, } from "../utils/ArrayUtils";
import { BufferAttribute, Vector3 } from "three";
import { getDeltaFactor } from "../Device";
import { NumberUtils } from "../Main";

const _v1 = new Vector3();
const _v2 = new Vector3();

let _getState = (state: state): flameEmitter => {
	return getExn(getParticleState(state).flameEmitter)
}

let _setState = (state: state, flameEmitterState: flameEmitter) => {
	return {
		...state,
		particle: {
			...getParticleState(state),
			flameEmitter: return_(flameEmitterState)
		}
	}
}

export let createState = (): flameEmitter => {
	return {
		geometry: getEmpty(),
		particles: []
	}
}

export let init = (state: state, scene) => {
	return EmitterUtils.initByChangeColor(state, (state, geometry) => {
		return _setState(state, {
			..._getState(state),
			geometry: return_(geometry)
		})
	}, scene)
}

let _buildParticle = ({ speed, life, size, position, color, direction }, createTime): flameParticle => {
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

		size,
		opacity: 1,
		createTime,
		updateTime: createTime,
		// speed: [
		// 	speedAround,
		// 	Math.random() * speed / 3 + speed,
		// 	speedAround,
		// ],
		speed,

		position,
		color,
		direction
	}
}

// let _buildRandomLife = (life) => {
// 	return life * (1 + Math.random())
// }

export let emit = (state: state, {
	speed,
	life,
	size,
	position,
	colors,
	direction
}: flameEmitterParam) => {
	let [x, y, z] = position
	// let offset = size / 5
	// let yOffset = size / 5

	let now = Date.now()

	let particles = pushArrs(_getState(state).particles,
		range(0, 9).reduce((result, i) => {
			return range(0, 4).reduce((result, j) => {
				return push(result, _buildParticle({
					speed,
					//  life: _buildRandomLife(life), 
					life,
					size: NumberUtils.getRandomValue3(0.5 * size, 0.5 * size),
					// position: [x, y + yOffset, z]
					position: [x, y, z],
					color: colors[NumberUtils.getRandomInteger(0, colors.length - 1)],
					direction: _getRandomDirection(_v2.fromArray(direction)).toArray()
				},
					now + i * 50
				))
			}, result)
		}, [])
	)

	return _setState(state, {
		..._getState(state),
		particles
	})
}
1

let _getRandomDirection = (direction) => {
	let emitPrecision = 0.05

	return direction.clone().add(_v1.set(
		emitPrecision * NumberUtils.getRandomValue1(),
		emitPrecision * NumberUtils.getRandomValue1(),
		emitPrecision * NumberUtils.getRandomValue1(),
	)).normalize()
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
		(particle: flameParticle, delta, i, now) => {
			// const time = now - particle.updateTime

			// let upLife = particle.life / 3
			// let downLife = particle.life - upLife
			// let passedTime = (now - particle.createTime)

			// if (passedTime <= upLife) {
			// 	let speed = particle.speed

			// 	EmitterUtils.updatePosition(particle.position, 0, speed[0] / 2, time, true)
			// 	EmitterUtils.updatePosition(particle.position, 1, speed[1], time, true)
			// 	EmitterUtils.updatePosition(particle.position, 2, speed[2] / 2, time, true)


			// 	particle.opacity = 1


			// 	particle.size *= 1.01
			// }
			// else {
			// 	let speed = particle.speed

			// 	EmitterUtils.updatePosition(particle.position, 1, speed[1], time, false)


			// 	particle.opacity = 1 - ((passedTime - upLife) / downLife)


			// 	particle.size /= 1.01
			// }

			// return particle

			if (now > particle.createTime) {
				// let passedTime = now - particle.createTime

				let speed = particle.speed * delta * getDeltaFactor()

				particle.position = _v1.fromArray(particle.position).add(_v2.fromArray(particle.direction).multiplyScalar(speed)).toArray()

				// EmitterUtils.updatePosition(particle.position, 0, speed[0] / 2, time, true)


				let ratio = 1 - (now - particle.createTime) / particle.life

				let [r, g, b] = particle.color
				particle.color = [r * ratio, g * ratio, b * ratio]
			}

			return particle
		},
		(filteredParticles, geometry) => {
			// 遍历粒子,收集属性
			let [positionList, opacityList, sizeList, colorList] = filteredParticles.reduce(([positionList, opacityList, sizeList, colorList], particle,) => {
				positionList.push(particle.position[0], particle.position[1], particle.position[2])
				opacityList.push(particle.opacity)
				sizeList.push(particle.size)
				colorList.push(particle.color[0], particle.color[1], particle.color[2])

				return [positionList, opacityList, sizeList, colorList]
			}, [[], [], [], []])

			// 粒子属性写入
			geometry.setAttribute('position', new BufferAttribute(new Float32Array(positionList), 3));
			geometry.setAttribute('a_color', new BufferAttribute(new Float32Array(colorList), 3));
			geometry.setAttribute('a_opacity', new BufferAttribute(new Float32Array(opacityList), 1));
			geometry.setAttribute('a_size', new BufferAttribute(new Float32Array(sizeList), 1));
		},
	], getExn(_getState(state).geometry))
}