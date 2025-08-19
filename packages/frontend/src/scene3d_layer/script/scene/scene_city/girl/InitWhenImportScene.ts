import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType"
import { getIsDebug } from "../../Scene";
import { getConfigData, getGirlScale, getScene, isLittleRoad, setClothHpData } from "../CityScene";
import { addExcitement, isZeroExcitement, setExcitement, subExcitement } from "./Excitement";
import { addHp, getFullHp, getGirl, getGirlMesh, getGirlState, getHp, getName, getStatusUpdateLoops, getValue, hideGirl, isGirl, isScaleState, setGirlScale, setGirlState, setHp, setNeedUpdateStatus, setScaleState, triggerAction } from "./Girl"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { MMD } from "meta3d-jiehuo-abstract"
import { computeGirlBox, computeHeight, getGirlPosition, getScale, setGirlPosition, setGirlRotation, setHeight } from "./Utils"
import { Collision } from "meta3d-jiehuo-abstract"
import { AxesHelper, Box3, Euler, Object3D, Quaternion } from "three";
import { Event } from "meta3d-jiehuo-abstract";
import { buildLevelStatusUpdateEventData, getDestroyedEventName } from "../utils/EventUtils";
import { camp, objectStateName, scaleState } from "../type/StateType";
import { getAllAnimationNames } from "./Animation";
import { SkinBlendAnimation } from "meta3d-jiehuo-abstract";
import { NewThreeInstance } from "meta3d-jiehuo-abstract";
import { getDamageFuncs } from "../StaticDynamic";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { MMDLoaderAnimationObject2 } from "meta3d-jiehuo-abstract/src/three/MMDLoader";
import { Object3DUtils } from "meta3d-jiehuo-abstract";
import { Loader } from "meta3d-jiehuo-abstract";
import { getMikuResourceId, getLukaResourceId, getNeruResourceId, getMeikoResourceId } from "../data/Const";
import { changeToPhongMaterial, fixMaterial } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils";
import { Capsule } from "meta3d-jiehuo-abstract";
import { getCurrentMMDData, isEnablePhysics, isPMX } from "../utils/MMDUtils";
import { Flow } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getCrawlToStandEventName, getEatEventName, getLevelStatusUpdateEventName, getPickdownEventName, getPickupEventName, getPinchJudageDamageEventName, getStandToCrawlEventName, getGiantessStatusUpdateEventName } from "../../../../utils/EventUtils";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { getStateMachine } from "./FSMState";
import { addBox3Helper } from "../utils/ConfigUtils";
import { updateAllCollisionShapes } from "./Collision";
import { eatHandler, pickdownHandler, pickupHandler, pinchJudgeDamageHandler } from "./PickPose";
import { setNeedUpdateSkillBar } from "../UI";
import { crawlToStandHandler, standToCrawlHandler } from "./Crawl";
import { actionName } from "../data/DataType";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getHpData } from "./Cloth";
import { getBody, getMMDMaterialFixData } from "../data/mmd/MMDData";
import { getAllCollisionParts } from "../utils/CollisionUtils";
import { setCamp } from "../manage/city1/Army";

let _initWeights = (state: state) => {
	let abstractState = getAbstractState(state)

	abstractState = SkinBlendAnimation.setWeights(abstractState, SkinBlendAnimation.getWeights(abstractState).set(getConfigData(state).girlAllAnimationNames[0], 1))


	return getConfigData(state).girlAllAnimationNames.slice(1).reduce((abstractState, name) => {
		return SkinBlendAnimation.setWeights(abstractState, SkinBlendAnimation.getWeights(abstractState).set(name, 0))
	}, abstractState)
}

let _createCollisionShapes = (state: state) => {
	// let rightFoot = Collision.createOBB(getScene(state), getAbstractState(state), 0xfff333)
	// let leftFoot = Collision.createOBB(getScene(state), getAbstractState(state), 0xff3f33)

	// let rightShank = Collision.createOBB(getScene(state), getAbstractState(state), 0xfff333)
	// let leftShank = Collision.createOBB(getScene(state), getAbstractState(state), 0xff3f33)

	// let rightThigh = Collision.createOBB(getScene(state), getAbstractState(state), 0xfff333)
	// let leftThigh = Collision.createOBB(getScene(state), getAbstractState(state), 0xff3f33)

	// // let trigoneAndButtAABB = Collision.createAABB(getScene(state), getAbstractState(state), 0xff1111)

	// // let leftBreastAABB = Collision.createAABB(getScene(state), getAbstractState(state), 0xfff333)
	// // let rightBreastAABB = Collision.createAABB(getScene(state), getAbstractState(state), 0xff3f33)

	// let trigoneAndButt = Collision.createOBB(getScene(state), getAbstractState(state), 0xff1111)

	// let leftBreast = Collision.createOBB(getScene(state), getAbstractState(state), 0xfff333)
	// let rightBreast = Collision.createOBB(getScene(state), getAbstractState(state), 0xff3f33)

	// let head = Collision.createOBB(getScene(state), getAbstractState(state), 0xff3f33)

	// let torso = Collision.createOBB(getScene(state), getAbstractState(state), 0xff3f33)

	// let leftUpperArm = Collision.createOBB(getScene(state), getAbstractState(state), 0xfff333)
	// let rightUpperArm = Collision.createOBB(getScene(state), getAbstractState(state), 0xff3f33)

	// let leftLowerArm = Collision.createOBB(getScene(state), getAbstractState(state), 0xfff333)
	// let rightLowerArm = Collision.createOBB(getScene(state), getAbstractState(state), 0xff3f33)

	// let leftHand = Collision.createOBB(getScene(state), getAbstractState(state), 0xfff333)
	// let rightHand = Collision.createOBB(getScene(state), getAbstractState(state), 0xff3f33)

	let collisionShapeMap = getAllCollisionParts(state).reduce((collisionShapeMap, collisionPart_) => {
		return collisionShapeMap.set(collisionPart_, Collision.createOBB(getScene(state), getAbstractState(state), 0xff3f33))
	}, getGirlState(state).collisionShapeMap)

	return setGirlState(state, {
		...getGirlState(state),
		collisionShapeMap: collisionShapeMap
		// getGirlState(state).collisionShapeMap
		// 	.set(collisionPart.LeftFoot, leftFoot)
		// 	.set(collisionPart.RightFoot, rightFoot)
		// 	.set(collisionPart.LeftShank, leftShank)
		// 	.set(collisionPart.RightShank, rightShank)
		// 	.set(collisionPart.LeftThigh, leftThigh)
		// 	.set(collisionPart.RightThigh, rightThigh)
		// 	.set(collisionPart.TrigoneAndButt, trigoneAndButt)
		// 	.set(collisionPart.LeftBreast, leftBreast)
		// 	.set(collisionPart.RightBreast, rightBreast)
		// 	.set(collisionPart.Head, head)
		// 	.set(collisionPart.Torso, torso)
		// 	.set(collisionPart.LeftUpperArm, leftUpperArm)
		// 	.set(collisionPart.RightUpperArm, rightUpperArm)
		// 	.set(collisionPart.LeftLowerArm, leftLowerArm)
		// 	.set(collisionPart.RightLowerArm, rightLowerArm)
		// 	.set(collisionPart.LeftHand, leftHand)
		// 	.set(collisionPart.RightHand, rightHand)
	})
}

export let destroyedHandler = (state: state, { userData }) => {
	let { fromName, toName } = NullableUtils.getExn(userData)

	if (!isGirl(fromName)) {
		return Promise.resolve(state)
	}

	let excitement = 0
	// let name_, func
	let func

	// if (container.isLODContainer) {
	// let lodContainer = container
	// name_ = lodContainer.name

	func = getDamageFuncs
	// }
	// else {
	// 	// let sourceLOD = container
	// 	// name_ = sourceLOD.name

	// 	func = getDynamicFuncs
	// }

	excitement = TupleUtils.getTuple2Last(func(state).reduce((data, { isSelfFunc, getValueFunc }) => {
		if (data[0] == true) {
			return data
		}

		if (isSelfFunc(toName)) {
			return [true, getValueFunc(state, toName).excitement]
		}

		return data
	}, [false, excitement]))

	// return addExcitement(state, excitement / 4)
	return Promise.resolve(addExcitement(state, excitement))
}

let _getMMDMaterialFixData = (state: state) => {
	return NullableUtils.getWithDefault(
		NullableUtils.map(data => {
			return {
				noBlendingMaterialNamesInVivo: data.noBlendingMaterialNamesInVivo,
				diffuseFactor: data.diffuseFactor
			}
		}, getMMDMaterialFixData().find(data => {
			return data.mmdCharacter == getGirlState(state).currentMMDCharacter
		})),
		{
			noBlendingMaterialNamesInVivo: [],
		} as any
	)
}

let _parseMMDCharacter = (state: state, mmdCharacter: MMDLoaderAnimationObject2) => {
	let originScale = 0.1

	// let mesh = mmdCharacter.mesh.clone(true);
	// let mesh = mmdCharacter.mesh.clone()
	let mesh = mmdCharacter.mesh
	// let mesh = mmdCharacter.mesh
	// mesh.position.y = - 10;

	// ( mesh as any ).id = mmdCharacter.mesh.id;
	// mesh.uuid = mmdCharacter.mesh.uuid

	mesh.bindMatrix = mmdCharacter.mesh.bindMatrix
	mesh.bindMatrixInverse = mmdCharacter.mesh.bindMatrixInverse

	mesh = Object3DUtils.changeTransformToDefault(mesh)

	state = setGirlState(state, {
		...getGirlState(state),
		originScale
	})


	mesh.name = getName()

	// mesh = changeToPhongMaterial(mesh)
	mesh = fixMaterial(mesh, _getMMDMaterialFixData(state))
	// mesh.geometry.computeVertexNormals()

	mesh.castShadow = true
	// mesh.receiveShadow = true
	mesh.receiveShadow = false


	let girlGroup = new Object3D()
	girlGroup.add(mesh)

	state = setGirlState(state, {
		...getGirlState(state),
		girlMesh: NullableUtils.return_(mesh),
		girlGroup: girlGroup
	})

	state = setGirlPosition(state, NullableUtils.getExn(getGirlState(state).initialPosition))
	state = setGirlRotation(state, NullableUtils.getExn(getGirlState(state).initialQuaternion))

	// state = setGirlState(state, {
	// 	...getGirlState(state),
	// 	rotationYForThirdPersonControl: -4.71238898038469,
	// 	lastRotationYForThirdPersonControl: NullableUtils.return_(-4.71238898038469),
	// 	quaternionForThirdPersonControl: new Quaternion(0, -0.7071067811865476, 0, -0.7071067811865475),
	// })






	// state = setAbstractState(state, MMD.createAndSetNewMMDAnimationHelper(getAbstractState(state)))

	let helper = MMD.getMMDAnimationHelper(getAbstractState(state))

	let enablePhysics = isEnablePhysics(state)

	helper.add(mesh, {
		animation: mmdCharacter.animation,
		// animation: mmdCharacter.animation.map(([name, clip]) => {
		// 	return [
		// 		name,
		// 		clip.clone()
		// 	]
		// }),
		physics: enablePhysics
		// physics: true
	});


	if (isPMX(state)) {
		helper.configuration.pmxAnimation = true
	}





	state = setGirlScale(state, getValue(state).initialScale)


	return state
}

// let _getAllMMD = (state: state): Array<[mmdCharacter, MMDLoaderAnimationObject2]> => {
// 	return [
// 		[
// 			mmdCharacter.Miku,
// 			Loader.getResource<MMDLoaderAnimationObject2>(getAbstractState(state), getMikuResourceId()
// 			)
// 		],
// 		[
// 			mmdCharacter.Neru,
// 			Loader.getResource<MMDLoaderAnimationObject2>(getAbstractState(state), getNeruResourceId())
// 		],
// 		[
// 			mmdCharacter.Luka,
// 			Loader.getResource<MMDLoaderAnimationObject2>(getAbstractState(state), getLukaResourceId())
// 		],
// 		[
// 			mmdCharacter.Meiko,
// 			Loader.getResource<MMDLoaderAnimationObject2>(getAbstractState(state), getMeikoResourceId())
// 		],
// 		// [
// 		//     mmdCharacter.Haku_QP,
// 		//     Loader.getResource<MMDLoaderAnimationObject2>(getAbstractState(state), getHakuQPResourceId())
// 		// ],
// 		// [
// 		//     mmdCharacter.Luo,
// 		//     Loader.getResource<MMDLoaderAnimationObject2>(getAbstractState(state), getLuoResourceId())
// 		// ],
// 	]
// }

let _getMMD = (state: state) => {
	return Loader.getResource<MMDLoaderAnimationObject2>(getAbstractState(state),
		getCurrentMMDData(state)[1]
	)
}

let _hideGirl = (state: state) => {
	state = hideGirl(state)

	// Layer.setAllToNotVisibleLayer(girl)

	// if (getIsDebug(state)) {
	// 	let capsuleMesh = getGirlState(state).capsuleMesh
	// 	capsuleMesh.visible = false
	// 	// Layer.setAllToNotVisibleLayer(capsuleMesh)
	// }

	// return setAbstractState(state, SkinAnimation.stopTargetAllSkinAnimations(getAbstractState(state), girl.name))
	let helper = MMD.getMMDAnimationHelper(getAbstractState(state))

	SkinBlendAnimation.deactivateAllActions(getGirlMesh(state), helper, getConfigData(state).girlAllAnimationNames)


	// helper.enable("physics", false)

	let abstractState = _initWeights(state)

	return setAbstractState(state, abstractState)
}

let _restoreHp = (state: state) => {
	return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
		let { restoreHpTime, restoreHpSpeedRate } = getValue(state)

		let elapsed = performance.now() - getGirlState(state).lastDamageTime

		// let promise
		if (elapsed > restoreHpTime && !StateMachine.isState(
			getStateMachine(state),
			objectStateName.Destroyed
		)) {
			state = addHp(state, getBody(), getFullHp(state) * restoreHpSpeedRate)

			// promise = Event.trigger(state, getAbstractState, getGiantessStatusUpdateEventName(), null)
		}
		// else {
		// 	promise = Promise.resolve(state)
		// }

		return Promise.resolve(_restoreHp(state))
	}, getStatusUpdateLoops()))
}

let _getBiggerElapsed = (state: state) => {
	return performance.now() - getGirlState(state).lastScaleChangeTime
}

export let refreshBiggerTime = (state: state) => {
	return setGirlState(state, {
		...getGirlState(state),
		lastScaleChangeTime: performance.now()
	})
}

export let getFullBiggerTime = (state) => {
	return getValue(state).biggerMaxTime
}

export let getBiggerRemainTime = (state: state) => {
	return Math.max(getFullBiggerTime(state) - _getBiggerElapsed(state), 0)
}

export let isSmallest = (state: state) => {
	return getGirlScale(state) == getValue(state).initialScale
}

let _handleSmaller = (state: state) => {
	return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
		if (isScaleState(state, scaleState.Normal)) {
			return Promise.resolve(_handleSmaller(state))
		}

		let {
			// biggerSubExcitementTime,
			biggerMaxTime,
			// biggerSubExcitementScalar,
		} = getValue(state)

		let elapsed = _getBiggerElapsed(state)

		// if (elapsed > biggerSubExcitementTime && !StateMachine.isState(
		// 	getStateMachine(state),
		// 	objectStateName.Destroyed
		// )) {
		// 	state = subExcitement(state, biggerSubExcitementScalar / 6 * (getScale(state) * getScale(state) / 20))

		// 	if (
		// 		!state.config.isKeepBig
		// 		&&
		// 		(
		// 			isZeroExcitement(state)
		// 			|| elapsed > biggerMaxTime
		// 		)
		// 	) {
		// 		state = playSmallerToHalfSizeAnimation(state, (state) => {
		// 			state = setScaleState(state, scaleState.Normal)
		// 			state = setNeedUpdateSkillBar(state, false)

		// 			return Promise.resolve(state)
		// 		})
		// 	}
		// }

		let promise
		if (
			!state.config.isKeepBig
			&&
			(
				elapsed > biggerMaxTime
			)
		) {
			// state = playSmallerToHalfSizeAnimation(state, (state) => {
			// 	state = setScaleState(state, scaleState.Normal)
			// 	state = setNeedUpdateSkillBar(state, false)

			// 	return Promise.resolve(state)
			// })
			promise = triggerAction(state, actionName.Smaller).then(TupleUtils.getTuple2First)
		}
		else {
			promise = Promise.resolve(state)
		}

		return promise.then(_handleSmaller)
	}, getStatusUpdateLoops()))
}

export let initWhenImportScene = (state: state) => {
	// if (getIsDebug(state)) {
	// 	let { capsuleRadius, capsuleLengthBetweenStartAndEnd } = getCapsuleConfig(1)

	// 	let capsuleMesh = Capsule.createCapsuleMesh({
	// 		radius: capsuleRadius,
	// 		length: capsuleLengthBetweenStartAndEnd
	// 	}, "red")

	// 	// scene.add(capsuleMesh)

	// 	state = setGirlState(state, {
	// 		...getGirlState(state),
	// 		capsuleMesh: NullableUtils.return_(capsuleMesh)
	// 	})
	// }

	state = _parseMMDCharacter(state, _getMMD(state))

	if (getIsDebug(state)) {
		state = setExcitement(state, 100)
	}
	else {
		if (isLittleRoad(state)) {
			state = setExcitement(state, 20)
		}
		else {
			state = setExcitement(state, 0)
		}
	}

	state = _hideGirl(state)

	let scene = getScene(state)


	let girlBox = new Box3()
	state = setGirlState(state, {
		...getGirlState(state),
		box: girlBox,
	})

	if (getIsDebug(state)) {
		// scene.add(
		// 	NullableUtils.getExn(getGirlState(state).capsuleMesh)
		// )
		addBox3Helper(getAbstractState(state), scene, girlBox, 0x3fff00)

		let axesHelper = new AxesHelper(5)

		axesHelper.position.copy(getGirlPosition(state))

		scene.add(axesHelper)
	}

	let abstractState = _initWeights(state)

	state = setAbstractState(state, abstractState)

	state = _createCollisionShapes(state)
	state = updateAllCollisionShapes(state, getGirl(state))


	state = computeGirlBox(state)

	state = setHeight(state, computeHeight(state))


	// state = setClothHpData(state)
	state = getHpData(state).reduce((state, d) => {
		return setHp(state, d.damagePart, d.hp)
	}, state)
	state = setNeedUpdateStatus(state, getBody())


	if (state.config.isGirlRestoreHp) {
		state = _restoreHp(state)
	}

	state = _handleSmaller(state)


	Object3DUtils.markNotFrustumCulled(getGirl(state))


	scene.add(getGirl(state))



	state = setCamp(state, getName(), camp.Giantess)


	state = setAbstractState(state, Event.on(getAbstractState(state), getDestroyedEventName(), destroyedHandler))
	state = setAbstractState(state, Event.on(getAbstractState(state), getPickupEventName(), pickupHandler))
	state = setAbstractState(state, Event.on(getAbstractState(state), getPinchJudageDamageEventName(), pinchJudgeDamageHandler))
	state = setAbstractState(state, Event.on(getAbstractState(state), getEatEventName(), eatHandler))
	state = setAbstractState(state, Event.on(getAbstractState(state), getPickdownEventName(), pickdownHandler))
	state = setAbstractState(state, Event.on(getAbstractState(state), getStandToCrawlEventName(), standToCrawlHandler))
	state = setAbstractState(state, Event.on(getAbstractState(state), getCrawlToStandEventName(), crawlToStandHandler))

	return Event.trigger(state, getAbstractState, getLevelStatusUpdateEventName(), buildLevelStatusUpdateEventData(state))
}