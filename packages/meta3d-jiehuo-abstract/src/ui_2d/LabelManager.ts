import { List } from "immutable"
import { fontType, label, labelAnimation, needToShowData, state } from "../type/StateType"
import { getIsDebug, getLabelState, setLabelState } from "../state/State"
import { createLabal } from "./Billboard"
import { getEmpty, getWithDefault, return_ } from "../utils/NullableUtils"
import { addTween, createTween, removeTweens } from "../animation/ArticluatedAnimation"
import { getCurrentScene } from "../scene/Scene"
import { convertWorldCoordniateToScreenCoordniate, isOutsideScreen } from "../utils/ScreenUtils"
import { getCurrentCamera } from "../scene/Camera"
import { MutableMapUtils, NullableUtils, Object3DUtils, Scene } from "../Main"
import { addDeferExecFuncData } from "../Flow"
import { requireCheck, test } from "../utils/Contract"
import { pushArrs } from "../utils/ArrayUtils"
import { Sprite } from "three"
import { removeAndDispose } from "../scene/utils/DisposeUtils"

export let createState = (): label => {
	return {
		needToShowList: List(),
		labelTweensMap: MutableMapUtils.create(),
		aliveLabelCountMap: MutableMapUtils.create(),
		needRemoveLabelMap: MutableMapUtils.create(),
	}
}


export let addLabel = (state: state, data: needToShowData) => {
	return setLabelState(state, {
		...getLabelState(state),
		needToShowList: getLabelState(state).needToShowList.push(data)
	})
}

let _buildLabelName = () => "label"

export let clearLabel = (state: state) => {
	let scene = getCurrentScene(state)

	let labels = []
	scene.traverse(obj => {
		if (obj.name == _buildLabelName()) {
			labels.push(obj)
		}
	})
	labels.forEach(label => {
		removeAndDispose(scene, label)
	})

	return setLabelState(state, {
		...getLabelState(state),
		needToShowList: List()
	})
}

let _getColor = (fontType_) => {
	switch (fontType_) {
		case fontType.NormalAttack:
			return [getEmpty(), "white"]
		case fontType.HeavyAttack:
			return [return_("rgba(51,155,185, 0.5)"), "white"]
		case fontType.WeaknessAttack:
			return [return_("rgba(51,0,102, 0.5)"), "white"]
		case fontType.NormalDamage:
			return [getEmpty(), "red"]
		case fontType.HeavyDamage:
			return [return_("rgba(255,255, 0.5)"), "red"]
		default:
			throw new Error("error")
	}
}

let _handlePositionRecur = (position, camera, minPositionY) => {
	let screenCoordniate = convertWorldCoordniateToScreenCoordniate(position, camera)

	if (position.y < minPositionY) {
		return position
	}

	if (isOutsideScreen(screenCoordniate, 0.1)) {
		// return _handlePosition(position.setY(position.y / 2), camera)
		return _handlePositionRecur(position.setY(position.y - 1), camera, minPositionY)
	}

	return position
}

let _handlePosition = (position, camera) => {
	return _handlePositionRecur(position, camera, position.y / 2)
}

let _removeLabel = (aliveLabelCountMap, scene, label: Sprite, targetName, isDebug) => {
	requireCheck(() => {
		test("aliveLabelCount should >= 1", () => {
			return MutableMapUtils.getExn(aliveLabelCountMap, targetName) >= 1
		})
	}, isDebug)

	MutableMapUtils.set(aliveLabelCountMap, targetName, MutableMapUtils.getExn(aliveLabelCountMap, targetName) - 1)

	removeAndDispose(scene, label)
	// scene.remove(label)
}

let _removeLabelData = (state, targetName) => {
	let scene = getCurrentScene(state)

	let { labelTweensMap, aliveLabelCountMap, needRemoveLabelMap } = getLabelState(state)

	_removeLabel(aliveLabelCountMap, scene, MutableMapUtils.getExn(needRemoveLabelMap, targetName), targetName, getIsDebug(state))

	let tweens = MutableMapUtils.getExn(labelTweensMap, targetName)

	removeTweens(state, tweens)

	MutableMapUtils.remove(labelTweensMap, targetName)
}

export let update = (state: state) => {
	let { needToShowList } = getLabelState(state)

	if (needToShowList.count() == 0) {
		return Promise.resolve(state)
	}

	let camera = getCurrentCamera(state)
	let scene = getCurrentScene(state)


	let { labelTweensMap, aliveLabelCountMap, needRemoveLabelMap } = getLabelState(state)

	state = needToShowList.reduce((state, data) => {
		let [backgroundColor, textColor] = _getColor(data.fontType)

		let label = createLabal(
			data.text,
			// data.isAddToSpecifyPosition ? data.position : _handlePosition(data.position, camera),
			_handlePosition(data.position, camera),
			{
				isSizeAttenuation: data.isSizeAttenuation,
				isAlwaysShow: true,
				width: 160 * data.sizeFactor,
				size: 52 * data.sizeFactor,
				scaleFactor: 0.05,
				backgroundColor,
				textColor
			}
		)
		label.name = _buildLabelName();

		scene.add(label)

		MutableMapUtils.set(aliveLabelCountMap, data.targetName, getWithDefault(MutableMapUtils.get(aliveLabelCountMap, data.targetName), 0) + 1)

		if (!data.isAddToSpecifyPosition && MutableMapUtils.has(labelTweensMap, data.targetName)) {
			_removeLabelData(state, data.targetName)
		}

		switch (data.animation) {
			case labelAnimation.Normal:
				let object1 = {
					y: 0
				}
				let tween1 = createTween(state, object1)
					.to({
						y: NullableUtils.getExn(data.height)
					}, data.time / 2)
					.onUpdate(() => {
						label.position.setY(data.position.y + object1.y)
					})
				// .onStart(() => {
				// 	// if (!data.isAddToSpecifyPosition) {
				// 	// 	MutableMapUtils.set(labelTweensMap, data.targetName, tween1)

				// 	// }

				// 	if (!data.isAddToSpecifyPosition) {
				// 		MutableMapUtils.set(labelTweensMap, data.targetName, [tween1, tween2])
				// 	}
				// })

				addTween(state, tween1)

				let object2 = {
					opacity: 1
				}
				let tween2 = createTween(state, object2)
					.to({
						opacity: 0
					}, data.time / 2)
					// }, 100000)
					.onUpdate(() => {
						label.material.opacity = object2.opacity
					})
					// .onStart(() => {
					// 	if (!data.isAddToSpecifyPosition) {
					// 		MutableMapUtils.set(labelTweensMap, data.targetName, tween2)
					// 	}
					// })
					.onComplete(() => {
						_removeLabelData(
							state, data.targetName
						)
					})

				addTween(state, tween2)

				if (!data.isAddToSpecifyPosition) {
					MutableMapUtils.set(labelTweensMap, data.targetName, [tween1, tween2])
					MutableMapUtils.set(needRemoveLabelMap, data.targetName, label)
				}

				tween1.chain(tween2)
				tween1.start()
				break
			case labelAnimation.None:
				state = addDeferExecFuncData(state, (state) => {
					_removeLabel(aliveLabelCountMap, scene, label, data.targetName, getIsDebug(state))

					return Promise.resolve(state)
				}, Math.max(Math.floor(data.time / MutableMapUtils.getExn(aliveLabelCountMap, data.targetName)), 5))
				break
			default:
				throw new Error("error")
		}

		return state
	}, state)


	return Promise.resolve(setLabelState(state, {
		...getLabelState(state),
		needToShowList: List(),
	}))
}

export let dispose = (state) => {
	return setLabelState(state, createState())
}
