import { List } from "immutable"
import { fontType, label, labelAnimation, labelEffect, name, needToShowData, state } from "../type/StateType"
import { getIsDebug, getLabelState, setLabelState } from "../state/State"
import { createLabal, setIsAlwaysShow } from "./Billboard"
import { getEmpty, getWithDefault, return_ } from "../utils/NullableUtils"
import { addTween, createTween, removeTweens } from "../animation/ArticluatedAnimation"
import { getCurrentScene, getScene } from "../scene/Scene"
import { convertWorldCoordniateToScreenCoordniate, handlePositionRecur, isOutsideScreen } from "../utils/ScreenUtils"
import { getCurrentCamera } from "../scene/Camera"
import { ArrayUtils, MutableMapUtils, NullableUtils, Object3DUtils, Scene, TupleUtils } from "../Main"
import { addDeferExecFuncData } from "../Flow"
import { requireCheck, test } from "../utils/Contract"
import { pushArrs } from "../utils/ArrayUtils"
import { Sprite, Vector2 } from "three"
import { deepDispose, removeAndDispose } from "../scene/utils/DisposeUtils"
import { nullable } from "../utils/nullable"

// const _q = new Quaternion();
// const _v1 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();


export let createState = (): label => {
	return {
		labelPool: MutableMapUtils.create(),
		needToShowList: List(),
		labelTweensMap: MutableMapUtils.create(),
		aliveLabelCountMap: MutableMapUtils.create(),
		needRemoveLabelMap: MutableMapUtils.create(),
	}
}


export let addLabel = (state: state, data: needToShowData, isHideUI) => {
	if (isHideUI) {
		return state
	}

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
		case fontType.CritAttack:
			// return [return_("rgba(51,255,185, 0.5)"), "white"]
			return [getEmpty(), "white"]
		// case fontType.MissAttack:
		// 	return [getEmpty(), "white"]

		case fontType.NormalDamage:
			return [getEmpty(), "red"]
		case fontType.HeavyDamage:
			return [return_("rgba(255,215,0, 0.5)"), "red"]
		case fontType.WeaknessDamage:
			return [return_("rgba(51,0,102, 0.5)"), "red"]
		case fontType.CritDamage:
			// return [return_("rgba(255,255,0, 0.5)"), "red"]
			return [getEmpty(), "red"]
		// case fontType.MissDamage:
		// 	return [getEmpty(), "red"]

		case fontType.Heal:
			return [getEmpty(), "green"]

		default:
			throw new Error("error")
	}
}

let _getText = (text, fontType_,) => {
	// switch (fontType_) {
	// 	case fontType.MissAttack:
	// 	case fontType.MissDamage:
	// 		return "Miss"
	// 	default:
	// 		return text
	// }
	return text
}

let _getEffect = (fontType_) => {
	switch (fontType_) {
		case fontType.CritAttack:
		case fontType.CritDamage:
			return labelEffect.BiggerSize
		default:
			return labelEffect.None
	}
}

let _handleUpCameraPosition = (position, cameraPosition, animation) => {
	if (animation == labelAnimation.None
		&& position.y > cameraPosition.y + 10
	) {
		let yFactor = 0.5

		let xzFactor
		if (_v1_1.set(position.x, position.z).distanceTo(_v1_2.set(cameraPosition.x, cameraPosition.z)) < 10) {
			xzFactor = 2
		}
		else {
			xzFactor = 1
		}

		return position.setY(
			position.y + (position.y - cameraPosition.y) * yFactor * xzFactor
		)

	}

	return position
}

let _handlePosition = (position, camera, animation) => {
	// return _handleUpCameraPosition(_handlePositionRecur(position, camera, position.y / 2), camera.position, animation)
	return _handleUpCameraPosition(handlePositionRecur(position, camera, camera.position.y), camera.position, animation)
}

let _removeLabel = (labelPool, key, aliveLabelCountMap, needRemoveLabelMap, scene, label: Sprite, targetName, isDebug) => {
	requireCheck(() => {
		test("aliveLabelCount should >= 1", () => {
			// return NullableUtils.getWithDefault(MutableMapUtils.get(aliveLabelCountMap, targetName), 1) >= 1
			return MutableMapUtils.getExn(aliveLabelCountMap, targetName) >= 1
		})
	}, isDebug)


	NullableUtils.forEach(count => {
		if (count - 1 <= 0) {
			MutableMapUtils.remove(aliveLabelCountMap, targetName)
			MutableMapUtils.remove(needRemoveLabelMap, targetName)
		}
		else {
			MutableMapUtils.set(aliveLabelCountMap, targetName, count - 1)
		}
	}, MutableMapUtils.get(aliveLabelCountMap, targetName))


	let _ = _addToPool(labelPool, label, key)

	// removeAndDispose(scene, label)
	scene.remove(label)
}

let _removeLabelData = (state, targetName) => {
	let scene = getCurrentScene(state)

	let { labelPool, labelTweensMap, aliveLabelCountMap, needRemoveLabelMap } = getLabelState(state)


	NullableUtils.forEach(([key, label]) => {
		_removeLabel(labelPool, key, aliveLabelCountMap, needRemoveLabelMap, scene, label, targetName, getIsDebug(state))
	}, MutableMapUtils.get(needRemoveLabelMap, targetName))


	NullableUtils.forEach(tweens => {
		removeTweens(state, tweens)
	}, MutableMapUtils.get(labelTweensMap, targetName))

	MutableMapUtils.remove(labelTweensMap, targetName)
}

let _buildKey = (
	text,
	width,
	size,
	// scaleFactor,
	backgroundColor,
	textColor
) => {
	// return `${text}_${width}_${size}_${scaleFactor}_${backgroundColor}_${textColor}`
	return `${text}_${width}_${size}_${backgroundColor}_${textColor}`
}

let _addToPool = (labelPool, label: Sprite, key: string) => {
	// let { labelPool } = getLabelState(state)

	// const maxTotalCount = 100
	// const maxTotalCount = 500
	const maxTotalCount = 200

	if (MutableMapUtils.reduce(labelPool, (count, value) => {
		return count + value.length
	}, 0) >= maxTotalCount) {
		NullableUtils.getWithDefault(
			MutableMapUtils.get(labelPool, key),
			[]
		).forEach(deepDispose)

		labelPool = MutableMapUtils.remove(labelPool, key)
	}

	let _ = MutableMapUtils.set(labelPool, key,
		ArrayUtils.push(
			NullableUtils.getWithDefault(
				MutableMapUtils.get(labelPool, key),
				[]
			),
			label
		)
	)

	return labelPool
}

let _popLabelFromPool = (state: state, key: string): [state, nullable<Sprite>] => {
	let { labelPool } = getLabelState(state)

	return [state,
		ArrayUtils.popLastOne(
			NullableUtils.getWithDefault(
				MutableMapUtils.get(labelPool, key),
				[]
			)
		)
	]
}

let _updatePositionToInScreen = (needToShowList: List<needToShowData>, camera) => {
	return needToShowList.map(data => {
		return {
			...data,
			position: _handlePosition(data.position, camera, data.animation)
		}
	})
}

// let _onlyShowBiggestNumberInOneZone = (needToShowList: List<needToShowData>, camera) => {
// 	const step = 5

// 	return TupleUtils.getTuple2First(needToShowList.reduce<[Array<needToShowData>, Record<number, number>]>(([result, zoneData], data) => {
// 		let screenCoordniate = convertWorldCoordniateToScreenCoordniate(data.position, camera)

// 		let girdIndexX = Math.floor(
// 			screenCoordniate.x / step,
// 		)
// 		let girdIndexY = Math.floor(
// 			screenCoordniate.y / step,
// 		)

// 		let key = girdIndexX * 1000 + girdIndexY
// 		let number = Number(data.text)

// 		if (NullableUtils.getWithDefault(
// 			MutableMapUtils.get(
// 				zoneData,
// 				key
// 			),
// 			-Infinity
// 		) < number
// 		) {
// 			return [
// 				ArrayUtils.push(result, data),
// 				MutableMapUtils.set(
// 					zoneData,
// 					key,
// 					number
// 				)
// 			]
// 		}

// 		return [
// 			result,
// 			zoneData
// 		]
// 	}, [ArrayUtils.create(), MutableMapUtils.create()]))
// }
let _onlyShowBiggestNumberInOneZone = (needToShowList: List<needToShowData>, camera) => {
	const stepX = 30
	const stepY = stepX / 2

	return MutableMapUtils.toArray(
		MutableMapUtils.map(
			needToShowList.reduce((zoneData, data) => {
				let screenCoordniate = convertWorldCoordniateToScreenCoordniate(data.position, camera)

				let girdIndexX = Math.floor(
					screenCoordniate.x / stepX,
				)
				let girdIndexY = Math.floor(
					screenCoordniate.y / stepY,
				)

				let key = girdIndexX * 10000 + girdIndexY
				let number = Number(data.text)

				if (NullableUtils.getWithDefault(
					NullableUtils.map(
						TupleUtils.getTuple2First,
						MutableMapUtils.get(
							zoneData,
							key
						)),
					-Infinity
				) < number
				) {
					return MutableMapUtils.set(
						zoneData,
						key,
						[
							number,
							data
						]
					)
				}

				return zoneData
			}, MutableMapUtils.create()),
			TupleUtils.getTuple2Last
		)
	)
}

export let update = (state: state) => {
	let { needToShowList } = getLabelState(state)

	if (needToShowList.count() == 0) {
		return Promise.resolve(state)
	}

	let camera = getCurrentCamera(state)
	let scene = getCurrentScene(state)


	let { labelPool, labelTweensMap, aliveLabelCountMap, needRemoveLabelMap } = getLabelState(state)

	state = _onlyShowBiggestNumberInOneZone(
		_updatePositionToInScreen(needToShowList, camera),
		camera
	).reduce((state, data) => {
		let [backgroundColor, textColor] = _getColor(data.fontType)
		let effect = _getEffect(data.fontType)

		let text = _getText(data.text, data.fontType)
		let width = 160 * data.sizeFactor
		let size = (effect == labelEffect.BiggerSize ? 100 : 52) * data.sizeFactor

		let key = _buildKey(text, width, size, backgroundColor, textColor)

		let labelData = _popLabelFromPool(state, key)
		state = labelData[0]
		let label = labelData[1]

		label = NullableUtils.getWithDefaultFunc(
			label,
			() => {
				let label = createLabal(
					text,
					// data.isAddToSpecifyPosition ? data.position : _handlePosition(data.position, camera),
					{
						// isSizeAttenuation: data.isSizeAttenuation,
						// isAlwaysShow: true,
						width,
						size,
						scaleFactor: 0.05,
						backgroundColor,
						textColor
					}
				)

				label.name = _buildLabelName();

				return label
			}
		)

		label.material.opacity = 1

		label.material.sizeAttenuation = data.isSizeAttenuation
		label.material = setIsAlwaysShow(label.material, true)

		// label.position.copy(_handlePosition(data.position, camera, data.animation))
		label.position.copy(data.position)

		label.updateMatrixWorld(true)

		scene.add(label)

		MutableMapUtils.set(aliveLabelCountMap, data.targetName, getWithDefault(MutableMapUtils.get(aliveLabelCountMap, data.targetName), 0) + 1)

		// if (!data.isAddToSpecifyPosition && MutableMapUtils.has(labelTweensMap, data.targetName)) {
		if (MutableMapUtils.has(labelTweensMap, data.targetName)) {
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
							state, data.targetName,
						)
					})

				addTween(state, tween2)

				// if (!data.isAddToSpecifyPosition) {
				MutableMapUtils.set(labelTweensMap, data.targetName, [tween1, tween2])
				MutableMapUtils.set(needRemoveLabelMap, data.targetName, [key, label])
				// }

				tween1.chain(tween2)
				tween1.start()
				break
			case labelAnimation.None:
				state = addDeferExecFuncData(state, (state) => {
					_removeLabel(labelPool, key, aliveLabelCountMap, needRemoveLabelMap, scene, label, data.targetName, getIsDebug(state))

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

// export let disposeData = (state: state, name: name) => {
// 	return setLabelState(state, {
// 		...getLabelState(state),
// 		aliveLabelCountMap: MutableMapUtils.remove(getLabelState(state).aliveLabelCountMap, name),
// 		needRemoveLabelMap: MutableMapUtils.remove(getLabelState(state).needRemoveLabelMap, name),
// 	})
// }

export let dispose = (state) => {
	let scene = getScene(state)

	MutableMapUtils.forEach(getLabelState(state).labelPool, labels => {
		labels.forEach(label => {
			removeAndDispose(scene, label)
		})
	})

	return setLabelState(state, createState())
}
