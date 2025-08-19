import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import * as DamageUtils from "./DamageUtils"
import { Vector3 } from "three"
import { getAbstractState, readState, writeState } from "../../../../state/State"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../data/DataUtils"
import { articluatedAnimationName } from "../data/DataType"
import * as StateMachine from "meta3d-jiehuo-abstract/src/fsm/StateMachine"
import { TransformUtils } from "meta3d-jiehuo-abstract"

const _v1 = new Vector3();
const _v2 = new Vector3();

export let playStressingAnimation = (state, [getFullHpFunc, updateTweenFunc, getLocalTransformFunc,
	getStateMachineFunc,
	setStateMachineFunc,
	createStateFunc
], [matrix, box, name, damage]) => {
	let articluatedAnimationData = findArticluatedAnimationData(state,articluatedAnimationName.Stressing_Move1)

	// let [position, quat, scale] = getLocalTransformFunc(obj, matrix)
	// let position = obj.position.clone()
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
				let damageRadio = DamageUtils.computeDamageRadio(damage, getFullHpFunc(state))


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
			}
		],
		articluatedAnimationData
	)

	return state

}

export let playDestroyingAnimation = (state, [getFullHpFunc, updateTweenFunc, getLocalTransformFunc,
	getStateMachineFunc,
	setStateMachineFunc,
	createDestroyedStateFunc
], fromName, [matrix, box, name, damage]) => {
	let articluatedAnimationData = findArticluatedAnimationData(state,articluatedAnimationName.Destroyed_Move1)

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
				let damageRadio = DamageUtils.computeDamageRadio(damage, getFullHpFunc(state))
				let timeScalar = DamageUtils.clamp(1 * damageRadio, 1)


				let height = box.getSize(_v1).y

				let endY = position.y - height * 4 / 5

				return [position, endY, timeScalar]
			},
			(allTweens) => {
				allTweens[allTweens.length - 1].onComplete(() => {
					let state = readState()

					ArticluatedAnimation.removeTweens(getAbstractState(state), allTweens)

					return StateMachine.changeAndExecuteState(state, setStateMachineFunc, getStateMachineFunc(state, name), createDestroyedStateFunc(), name, [fromName, name]).then(writeState)
				})

			}
		],
		articluatedAnimationData
	)

	return state

}