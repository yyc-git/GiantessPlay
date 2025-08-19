import { waterBloomEmitter, waterBloomEmitterParam, state } from "../type/StateType"
import { getEmpty, getExn, return_ } from "../utils/NullableUtils";
import * as EmitterUtils from "./EmitterUtils";
import { getParticleState } from "../state/State";
import { List } from "immutable";
import { BufferAttribute, BufferGeometry, Euler, Points, PointsMaterial, Texture, TextureLoader, Vector3 } from "three";
import { buildOffsetParticle, getCurrentFrameImageData, initForOffset, updateGeometryAttributeForOffset, updateOffsetParticle } from "./ParticleUtils";
import { push } from "../utils/ArrayUtils";

const _v1 = new Vector3();
const _v2 = new Vector3();

let _getState = (state: state): waterBloomEmitter => {
	return getExn(getParticleState(state).waterBloomEmitter)
}

let _setState = (state: state, waterBloomEmitterState: waterBloomEmitter) => {
	return {
		...state,
		particle: {
			...getParticleState(state),
			waterBloomEmitter: return_(waterBloomEmitterState)
		}
	}
}

export let createState = (): waterBloomEmitter => {
	return {
		geometry: getEmpty(),
		particles: []
	}
}

let _getColCount = () => 3

let _getRowCount = () => 5

export let init = (state: state, scene) => {
	return initForOffset(state, (state, geometry) => {
		return _setState(state, {
			..._getState(state),
			geometry: return_(geometry)
		})
	}, scene, "meta3d-jiehuo-abstract/particle/waterBloom.png", "#ffffff",
		false
	)
}

let _getRepeat = () => [1 / _getColCount(), 1 / _getRowCount()]

export let emit = (state: state, {
	speed,
	life,
	size,
	position,
}: waterBloomEmitterParam) => {
	let frameData = getCurrentFrameImageData(0, _getColCount(), _getRowCount())

	let particles = push(_getState(state).particles,
		buildOffsetParticle({
			speed, life, size: size / 2,
			position,

			offset: frameData.offset,
			repeat: _getRepeat()
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

export let update = (state: state) => {
	return EmitterUtils.update(state, [
		getAllParticles,
		(state, particles) => {
			return _setState(state, {
				..._getState(state),
				particles
			})
		},
		(particle, _, i, now) => {
			return updateOffsetParticle(particle, now, _getColCount(), _getRowCount())
		},
		updateGeometryAttributeForOffset
	], getExn(_getState(state).geometry))
}