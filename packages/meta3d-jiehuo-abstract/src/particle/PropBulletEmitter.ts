import { bulletEmitter, bulletEmitterParam, bulletParticle, particle, state } from "../type/StateType"
import { getEmpty, getExn, return_ } from "../utils/NullableUtils";
import * as EmitterUtils from "./EmitterUtils";
import { getParticleState } from "../state/State";
import { List } from "immutable";
import { Vector3 } from "three";
import { push } from "../utils/ArrayUtils";
import { getDelta, getDeltaFactor } from "../Device";
import * as BulletEmitter from "./BulletEmitter"

const _v1 = new Vector3();
const _v2 = new Vector3();

let _getState = (state: state): bulletEmitter => {
	return getExn(getParticleState(state).propBulletEmitter)
}

let _setState = (state: state, bulletEmitterState: bulletEmitter) => {
	return {
		...state,
		particle: {
			...getParticleState(state),
			propBulletEmitter: return_(bulletEmitterState)
		}
	}
}

export let createState = BulletEmitter.createState


export let init = (state: state, scene) => {
	return EmitterUtils.initWithoutRotation(state, (state, geometry) => {
		return _setState(state, {
			..._getState(state),
			geometry: return_(geometry)
		})
	}, scene, "meta3d-jiehuo-abstract/particle/propBullet.png", "#ffffff")
}

export let buildParticle = BulletEmitter.buildParticle

export let emit = (state: state, {
	// rotation,
	fromName,
	speed,
	life,
	size,
	position,
	direction
}: bulletEmitterParam) => {
	let particles = push(_getState(state).particles,
		buildParticle(state, {
			// rotation,
			fromName,
			speed, life, size,
			position,
			direction
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

export let updateParticle = BulletEmitter.updateParticle


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