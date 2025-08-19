import { shellEmitter, shellEmitterParam, shellParticle, particle, state, loopCount } from "../type/StateType"
import { getEmpty, getExn, return_ } from "../utils/NullableUtils";
import * as EmitterUtils from "./EmitterUtils";
import { getParticleState } from "../state/State";
import { List } from "immutable";
import { Vector3 } from "three";
import { buildParticle, updateParticle } from "./BulletEmitter";
import { push } from "../utils/ArrayUtils";

const _v1 = new Vector3();
const _v2 = new Vector3();

let _getState = (state: state): shellEmitter => {
	return getExn(getParticleState(state).shellEmitter)
}

let _setState = (state: state, shellEmitterState: shellEmitter) => {
	return {
		...state,
		particle: {
			...getParticleState(state),
			shellEmitter: return_(shellEmitterState)
		}
	}
}

export let createState = (): shellEmitter => {
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
	}, scene, "meta3d-jiehuo-abstract/particle/shell.png", "#ffffff")
}

// let _buildParticle = ({  speed, life, size, position, direction }): shellParticle => {
// 	return {
// 		// rotation,

// 		opacity: 1,
// 		life,
// 		size,
// 		createTime: Date.now(),
// 		updateTime: Date.now(),
// 		speed,
// 		position,
// 		direction,
// 	}
// }

export let emit = (state: state, shellEmitterParam: shellEmitterParam) => {
	let particles = push(_getState(state).particles,
		buildParticle(state, shellEmitterParam),
	)

	return _setState(state, {
		..._getState(state),
		particles
	})
}

export let getAllParticles = (state: state) => {
	return _getState(state).particles
}

export let update = (state: state) => {
	return EmitterUtils.update(state, [
		getAllParticles,
		(state, particles) => {
			return _setState(state, {
				..._getState(state),
				particles
			})
		},
		updateParticle
	], getExn(_getState(state).geometry))
}