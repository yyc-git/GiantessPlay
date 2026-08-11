import { coinEmitter, coinEmitterParam, coinParticle, particle, state } from "../type/StateType"
import { getEmpty, getExn, return_ } from "../utils/NullableUtils";
import * as EmitterUtils from "./EmitterUtils";
import { getParticleState } from "../state/State";
import { List } from "immutable";
import { Vector3 } from "three";
import { buildParticleId } from "./IDUtils";
import { push } from "../utils/ArrayUtils";
import { getDelta, getDeltaFactor } from "../Device";
import * as GemEmiter from "./GemEmitter"

const _v1 = new Vector3();
const _v2 = new Vector3();

let _getState = (state: state): coinEmitter => {
	return getExn(getParticleState(state).coinEmitter)
}

let _setState = (state: state, coinEmitterState: coinEmitter) => {
	return {
		...state,
		particle: {
			...getParticleState(state),
			coinEmitter: return_(coinEmitterState)
		}
	}
}

export let createState = (): coinEmitter => {
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
	}, scene, "meta3d-jiehuo-abstract/particle/coin.png", "#ffffff")
}

export let buildParticle = GemEmiter.buildParticle

export let emit = (state: state, {
	// rotation,
	fromName,
	camp,
	speed,
	life,
	size,
	position,
	getDirectionFunc
}: coinEmitterParam) => {
	let particles = push(_getState(state).particles,
		buildParticle(state, {
			// rotation,
			fromName,
			camp,
			speed, life, size,
			position,
			getDirectionFunc
		}),
	)

	return _setState(state, {
		..._getState(state),
		particles
	})
}

export let getAllParticles = (state: state) => {
	return _getState(state).particles
}

export let update = <specificState>(state, specificState: specificState) => {
	// let state = getAbstractStateFunc(specificState)

	state = EmitterUtils.update(state, [
		getAllParticles,
		(state, particles) => {
			return _setState(state, {
				..._getState(state),
				particles
			})
		},
		(particle, delta, i, now) => {
			let speed = particle.speed * delta * getDeltaFactor()

			particle.position = _v1.fromArray(particle.position).add(_v2.fromArray(particle.getDirectionFunc(specificState, particle.position)).multiplyScalar(speed)).toArray()

			return particle
		}
	], getExn(_getState(state).geometry))

	// return setAbstractStateFunc(specificState, state)
	return state
}