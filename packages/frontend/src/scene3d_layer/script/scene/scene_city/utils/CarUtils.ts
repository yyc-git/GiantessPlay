import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import * as DamageUtils from "./DamageUtils"
import { Vector3 } from "three"
import { getAbstractState, readState, writeState } from "../../../../state/State"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../data/DataUtils"
import { articluatedAnimationName } from "../data/DataType"
import * as StateMachine from "meta3d-jiehuo-abstract/src/fsm/StateMachine"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"

const _v1 = new Vector3();
const _v2 = new Vector3();

export let playStressingAnimation = (state, [
	addTweensFunc,
	getFullHpFunc, updateTweenFunc, getLocalTransformFunc,
	getStateMachineFunc,
	setStateMachineFunc,
	createStateFunc
], [matrix, box, name, damage, damageType_]) => {
	let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName.Stressing_Move1)

	// let [position, quat, scale] = getLocalTransformFunc(obj, matrix)
	// let position = obj.position.clone()
	let position = TransformUtils.getPositionFromMatrix4(matrix)

	let allTweens = playArticluatedAnimation(state,
		[
			object => {
				updateTweenFunc(object, matrix)
			},
			state => {
				return position
			},
			state => {
				let damageRadio = DamageUtils.computeDamageRadio(damage, getFullHpFunc(state, name))


				let width = box.getSize(_v1).x

				let amplitude = DamageUtils.clamp(width / 4 * damageRadio, width / 5)

				let timeScalar = DamageUtils.getStressingTimeScalar(damageRadio)

				return [position, amplitude, timeScalar]
			},
			(allTweens) => {
				// DamageUtils.handleTweenRepeatComplete2([updateDamageStatusFunc, handleRestoreFunc], tweenFirst, tweenLast, articluatedAnimationData.repeatCount, name)
				DamageUtils.handleTweenRepeatComplete([
					getStateMachineFunc,
					setStateMachineFunc,
					createStateFunc
				], allTweens, articluatedAnimationData.repeatCount, name)
			},
			NullableUtils.getEmpty()
		],
		articluatedAnimationData
	)

	state = addTweensFunc(state, allTweens)

	return state

}

export let playDestroyingAnimation = (state, [
	removeAndClearTweensFunc,
	getFullHpFunc, updateTweenFunc, getLocalTransformFunc,
	getStateMachineFunc,
	setStateMachineFunc,
	// createDestroyedStateFunc
	handleDestroyedFunc
], fromName, [matrix, box, name, damage, damageType_]) => {
	state = removeAndClearTweensFunc(state)

	let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName.Destroyed_Move1)

	// let [position, quat, scale] = getLocalTransformFunc(container, matrix)
	let position = TransformUtils.getPositionFromMatrix4(matrix)

	playArticluatedAnimation(state,
		[
			object => {
				updateTweenFunc(object, matrix)
			},
			state => {
				return position
			},
			state => {
				let damageRadio = DamageUtils.computeDamageRadio(damage, getFullHpFunc(state, name))
				let timeScalar = DamageUtils.clamp(1 * damageRadio, 1)


				let height = box.getSize(_v1).y

				let endY = position.y - height * 4 / 5

				return [position, endY, timeScalar]
			},
			(allTweens) => {
				allTweens[allTweens.length - 1].onComplete(() => {
					let state = readState()

					ArticluatedAnimation.removeTweens(getAbstractState(state), allTweens)

					let data = handleDestroyedFunc(state)
					state = data[0]
					let destroyedState = data[1]

					return StateMachine.changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, name), destroyedState, name, [fromName, name]).then(writeState)
				})

			},
			NullableUtils.getEmpty()
		],
		articluatedAnimationData
	)

	return state

}