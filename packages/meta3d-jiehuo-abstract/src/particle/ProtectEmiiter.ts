import { protectEmitter, protectEmitterParam, state } from "../type/StateType"
import { getEmpty, getExn, return_ } from "../utils/NullableUtils";
import * as EmitterUtils from "./EmitterUtils";
import { getParticleState } from "../state/State";
import { List } from "immutable";
import { BufferAttribute, BufferGeometry, Euler, Points, PointsMaterial, Texture, TextureLoader, Vector3 } from "three";
import { buildOffsetParticle, buildRepeatOffsetParticle, getCurrentFrameImageData, initForOffset, updateGeometryAttributeForOffset, updateGeometryAttributeForRepeatOffset, updateOffsetParticle, updateRepeatOffsetParticle } from "./ParticleUtils";
import { push } from "../utils/ArrayUtils";

const _v1 = new Vector3();
const _v2 = new Vector3();

let _getState = (state: state): protectEmitter => {
	return getExn(getParticleState(state).protectEmitter)
}

let _setState = (state: state, waterBloomEmitterState: protectEmitter) => {
	return {
		...state,
		particle: {
			...getParticleState(state),
			protectEmitter: return_(waterBloomEmitterState)
		}
	}
}

export let createState = (): protectEmitter => {
	return {
		geometry: getEmpty(),
		particles: []
	}
}

let _getColCount = () => 2

let _getRowCount = () => 7

export let init = (state: state, scene) => {
	return initForOffset(state, (state, geometry) => {
		return _setState(state, {
			..._getState(state),
			geometry: return_(geometry)
		})
	}, scene, "meta3d-jiehuo-abstract/particle/protect.png", "#ffffff",
		false
	)
}

let _getRepeat = () => [1 / _getColCount(), 1 / _getRowCount()]

export let emit = (
	state: state,
	// getAbstractStateFunc,
	{
		speed,
		life,
		size,
		getPositionFunc,
		// repeatCount
		getIsFinishFunc
	}: protectEmitterParam) => {
	let frameData = getCurrentFrameImageData(0, _getColCount(), _getRowCount())

	// let state = getAbstractStateFunc(specificState)

	let particles = push(_getState(state).particles,
		buildRepeatOffsetParticle({
			speed, life, size,

			getPositionFunc,
			getIsFinishFunc,

			offset: frameData.offset,
			repeat: _getRepeat()
		}, 0.2),
	)

	return _setState(state, {
		..._getState(state),
		particles
	})
}

export let getAllParticles = (state: state) => {
	return _getState(state).particles
}

export let update = <specificState>(specificState: specificState, [getAbstractStateFunc, setAbstractStateFunc]) => {
	let state = getAbstractStateFunc(specificState)

	state = EmitterUtils.update(state, [
		getAllParticles,
		(state, particles) => {
			return _setState(state, {
				..._getState(state),
				particles
			})
		},
		(particle, _, i, now) => {
			return updateRepeatOffsetParticle(specificState, particle, now, _getColCount(), _getRowCount())
		},
		updateGeometryAttributeForRepeatOffset(specificState)
	], getExn(_getState(state).geometry))

	return setAbstractStateFunc(specificState, state)
}