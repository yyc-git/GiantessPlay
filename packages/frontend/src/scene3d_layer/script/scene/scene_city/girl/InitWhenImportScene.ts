import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType"
import { getIsDebug } from "../../Scene";
import { getConfigData, getGirlScale, getScene, getSceneChapter, restoreCollisionShapeData, setConfigData } from "../CityScene";
import { addExcitement, isZeroExcitement, setExcitement, setExcitementByUsedGirl, subExcitement } from "./Excitement";
import { addHp, clearNeedUpdateStatus, getFullHp, getGirl, getGirlByUsedGirl, getGirlMesh, getGirlMeshByUsedGirl, getHp, getStatusUpdateLoops, getValue, hideGirl, isActionState, isGirl, resetIsTriggerAction, setActionState, setCurrentMMDCharacter, setHp, setInitialTransform, setLastScaleChangeTime, triggerAction, getGirlState, setAllUsedGirlData, setUsedGirlData, getUsedGirlData, setCurrentMMDCharacterByUsedGirl, getValueByUsedGirl, createUsedGirlData, isPlayerGirl, getCurrentMMDCharacterName, activateAllActions, isUseGirl, getBodyHp, isPlayerGoddess, hasCurrentMMDCharacterByUsedGirl, hasGirlByUsedGirl, changeToInitialScale, setNeedUpdateStatusDamagePart, getIsCanActiveSmallerFuncExn, getBiggerCount, resetAction, isPlayerGirlOrGiantess, buildNameByUsedGirl, getUsedGirlByName, getCurrentUsedGirls, isPlayerGirlByUsedGirl } from "./Girl"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { MMD } from "meta3d-jiehuo-abstract"
import { computeGirlBoxAndSetToState, computeHeight, getGirlBox, getGirlPosition, getScale, markGirlGroupIsVisible, markGirlVisible, offAllEvents, setGirlPosition, setGirlRotation, setHeight } from "./Utils"
import { Collision } from "meta3d-jiehuo-abstract"
import { AxesHelper, Box3 } from "three";
import { Event } from "meta3d-jiehuo-abstract";
import { buildLevelStatusUpdateEventData, getDestroyedEventName, getDestroyingEventName } from "../utils/EventUtils";
import { actionState, attackTarget, camp, objectStateName, pose, usedGirl, usedGirlEnum } from "../type/StateType";
import { getAllAnimationNames, isChangeScaling, resetAnimation, dispose as disposeAnimation, stopAndClearTweens, getCurrentAnimationName } from "./Animation";
import { SkinBlendAnimation } from "meta3d-jiehuo-abstract";
import { NewThreeInstance } from "meta3d-jiehuo-abstract";
import { getDamageFuncs } from "../StaticDynamic";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { MMDLoaderAnimationObject2 } from "meta3d-jiehuo-abstract/src/three/MMDLoader";
import { Object3DUtils } from "meta3d-jiehuo-abstract";
import { Loader } from "meta3d-jiehuo-abstract";
import { changeToPhongMaterial, fixMaterial } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils";
import { Capsule } from "meta3d-jiehuo-abstract";
import { getCurrentMMDData, getUniqueUsedMMDDataData, isEnablePhysics, isPMX, hasPlayerUsedMMDData, disposeMMDResource, getMMDData, getCurrentMMDDataByUsedGirl } from "../utils/MMDUtils";
import { Flow } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getCrawlToStandEventName, getEatEventName, getLevelStatusUpdateEventName, getPickdownEventName, getPickupEventName, getPinchJudageDamageEventName, getStandToCrawlEventName, getGiantessStatusUpdateEventName, buildGiantessStatusUpdateEventNameEventData, getInsertEventName, getPutToBreastEventName, getPutToShoeEventName, buildSkillStatusData, getBossSkillStatusUpdateEventName, getBossStatusUpdateEventName } from "../../../../utils/EventUtils";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { createInitialState, getStateMachine, setStateMachine } from "./FSMState";
import { addBox3Helper } from "../utils/ConfigUtils";
import { updateAllCollisionShapes } from "./Collision";
import { eatHandler, insertUBHandler, pickdownHandler, pickupHandler, pinchJudgeDamageHandler, putToBreastHandler, putToShoeHandler } from "./PickPose";
// import { setNeedShowSkillBar } from "../UI";
import { changeToStandPosePivot, crawlToStandHandler, standToCrawlHandler } from "./Crawl";
import { actionName, animationName } from "../data/DataType";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { updateHpData } from "./Cloth";
import { getBody, getClothHpData, getMMDMaterialFixData, mmdCharacter } from "../data/mmd/MMDData";
import { getAllCollisionParts } from "../utils/CollisionUtils";
import { resetAttackUnits, setCamp } from "../manage/city1/Army";
import { Map } from "immutable";
import { getPlayerCamp } from "../utils/PlayerUtils";
import { changePose, getCurrentPose, isPose } from "./Pose";
import { disposeShoe } from "../data/mmd/Shoe";
import * as CollisionShapeData from "../data/CollisionShapeData"
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType";
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { restoreHp } from "../utils/HpUtils";
import { initWhenImportScene as initWhenImportScenePlayerGirl, getBiggerEnhanceLevel, getEnhanceBiggerFullTime, setSavedStudyActions } from "./player/Girl";
import { getNow, getStartTime } from "../Time";
import { isControlledState, isDestoryRelatedStates } from "../utils/FSMStateUtils";
import { getGetClothHpDataFunc, initClothHpData } from "../utils/ClothUtils";
import { DisposeUtils } from "meta3d-jiehuo-abstract";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { setAttribute } from "../utils/build/GiantessBuildUtils";
import { buildFuncData } from "../data/FuncData";
import { getModAPI } from "../Mod";
import { getPlayerUsedGirl, getUsedGirl, isPlayerLevelGiantess } from "../../../../mod/LevelGiantessMod";
import { getOrbitControlsTarget } from "../LittleManCamera";
import { removePlayerFiniteTimeBuffs } from "../buff/Buff";
import { restorePartialScale } from "../utils/PartialScaleGiantessUtils";
import { getJumpStompBlockService, getLeftStompBlockService, getStompBlockService, getStompRubBlockService } from "../../../../mod/SkillGiantessMod";
import { getAnimationData } from "../data/Const";
import { getPickObjectData, getPutToBreastObjectData, getPutToShoeObjectData, getUBObjectData, hasControlledData } from "./PickPoseUtils";
// import { getCurrentUsedGirl, isCurrentUsedGirl, removeCurrentUsedGirl, setCurrentUsedGirl } from "../BossStateStatus";

let _initWeights = (state: state) => {
	let abstractState = getAbstractState(state)

	abstractState = SkinBlendAnimation.setWeights(abstractState, SkinBlendAnimation.getWeights(abstractState).set(getConfigData(state).girlAllAnimationNames[0], 1))


	return getConfigData(state).girlAllAnimationNames.slice(1).reduce((abstractState, name) => {
		return SkinBlendAnimation.setWeights(abstractState, SkinBlendAnimation.getWeights(abstractState).set(name, 0))
	}, abstractState)
}

let _createCollisionShapes = (state: state, usedGirl) => {
	// let rightFootPrint = Collision.createOBB(getScene(state), getAbstractState(state), 0xfff333)
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

	let collisionShapeMap = getAllCollisionParts(state, usedGirl).reduce((collisionShapeMap, collisionPart_) => {
		return collisionShapeMap.set(collisionPart_, Collision.createOBB(getScene(state), getAbstractState(state), 0xff3f33))
	}, getUsedGirlData(state, usedGirl).collisionShapeMap)

	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		collisionShapeMap: collisionShapeMap
		// getUsedGirlData(state, usedGirl).collisionShapeMap
		// 	.set(collisionPart.LeftFoot, leftFoot)
		// 	.set(collisionPart.RightFoot, rightFootPrint)
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

export let getExcitementByName = (state, name) => {
	let func = getDamageFuncs

	return TupleUtils.getTuple2Last(func(state).reduce((data, { isSelfFunc, getValueFunc }) => {
		if (data[0] == true) {
			return data
		}

		if (isSelfFunc(name)) {
			return [true, getValueFunc(state, name).excitement]
		}

		return data
	}, [false, 0]))
}

// export let destroyedHandler = (state: state, { userData }) => {
// 	let { fromName, toName } = NullableUtils.getExn(userData)

// 	if (!isGirl(fromName)) {
// 		return Promise.resolve(state)
// 	}

// 	let excitement = getExcitementByName(state, toName)

// 	// return addExcitement(state, usedGirl, excitement / 4)
// 	let excitementFactor
// 	if (isUseGirl(state, usedGirl)) {
// 		excitementFactor = NullableUtils.getWithDefault(
// 			NullableUtils.map(
// 				data => {
// 					return data.experienceFactor
// 				},
// 				getAnimationData(state, getCurrentAnimationName(state, usedGirl))
// 			),
// 			1
// 		)
// 	}
// 	else {
// 		excitementFactor = 1
// 	}

// 	state = addExcitement(state, usedGirl, excitement * excitementFactor)

// 	// if (isGiantessCharacterType(state) && getBiggerWay(state) == biggerWay.Passive) {
// 	// 	state = addScale(state, excitement)
// 	// }

// 	return Promise.resolve(state)
// }

export let destroyingHandler = (state: state, { userData }) => {
	let { fromName, toName } = NullableUtils.getExn(userData)

	if (!isGirl(fromName)) {
		return Promise.resolve(state)
	}

	let excitement = getExcitementByName(state, toName)
	let usedGirl = getUsedGirlByName(fromName)

	// return addExcitement(state, usedGirl, excitement / 4)
	let excitementFactor
	if (isUseGirl(state, usedGirl)) {
		excitementFactor = NullableUtils.getWithDefault(
			NullableUtils.map(
				data => {
					return data.experienceFactor
				},
				getAnimationData(state, getCurrentAnimationName(state, usedGirl))
			),
			1
		)
	}
	else {
		excitementFactor = 1
	}

	state = addExcitement(state, usedGirl, excitement * excitementFactor)

	// if (isGiantessCharacterType(state) && getBiggerWay(state) == biggerWay.Passive) {
	// 	state = addScale(state, excitement)
	// }

	return Promise.resolve(state)
}

let _getMMDMaterialFixData = (state: state, mmdCharacter) => {
	return NullableUtils.getWithDefault(
		NullableUtils.map(data => {
			return {
				noBlendingMaterialNamesInVivo: data.noBlendingMaterialNamesInVivo,
				diffuseFactor: data.diffuseFactor
			}
		}, getMMDMaterialFixData(state).find(data => {
			// return data.mmdCharacter == getUsedGirlData(state, usedGirl).currentMMDCharacter
			return data.mmdCharacter == mmdCharacter
		})),
		{
			noBlendingMaterialNamesInVivo: [],
		} as any
	)
}

let _addUsedMMDCharacterData = (state, usedGirl, mesh, girlGroup, MMDLoaderAnimationObject2) => {
	state = setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		girlMesh: NullableUtils.return_(mesh),
		// girlMMDAnimation: MMDLoaderAnimationObject2.animation,
		girlGroup: NullableUtils.return_(girlGroup)
	})




	state = setAbstractState(state, MMD.createAndSetHelper(getAbstractState(state), usedGirl))

	let helper = MMD.getMMDAnimationHelperByUsedGirl(getAbstractState(state), usedGirl)

	let enablePhysics = isEnablePhysics(state, usedGirl)

	// helper.add(getGirlMesh(state, usedGirl), {
	helper.add(mesh, {
		// animation: getGirlMMDAnimation(state, usedGirl),
		animation: MMDLoaderAnimationObject2.animation,
		physics: enablePhysics
	});


	if (isPMX(state)) {
		helper.configuration.pmxAnimation = true
	}

	return state
}

let _parseUsedMMDCharacter = (state: state, [usedGirl, mmdCharacter, MMDLoaderAnimationObject2]: [usedGirl, mmdCharacter, MMDLoaderAnimationObject2]
) => {
	// let originScale = 0.1

	// let mesh = mmdCharacter.mesh.clone(true);
	// let mesh = mmdCharacter.mesh.clone()
	let mesh = MMDLoaderAnimationObject2.mesh
	// let mesh = mmdCharacter.mesh
	// mesh.position.y = - 10;

	// ( mesh as any ).id = mmdCharacter.mesh.id;
	// mesh.uuid = mmdCharacter.mesh.uuid

	mesh.bindMatrix = MMDLoaderAnimationObject2.mesh.bindMatrix
	mesh.bindMatrixInverse = MMDLoaderAnimationObject2.mesh.bindMatrixInverse

	mesh = Object3DUtils.changeTransformToDefault(mesh)

	// state = setUsedGirlData(state, usedGirl,{
	// 	...getUsedGirlData(state, usedGirl),
	// 	originScale
	// })


	// mesh.name = getName()
	mesh.name = buildNameByUsedGirl(usedGirl)

	// mesh = changeToPhongMaterial(mesh)
	mesh = fixMaterial(mesh, _getMMDMaterialFixData(state, mmdCharacter))
	// mesh.geometry.computeVertexNormals()

	mesh.castShadow = true
	// mesh.receiveShadow = true
	mesh.receiveShadow = false


	// let girlGroup = new Object3D()
	let girlGroup = NewThreeInstance.createObject3D()
	girlGroup.add(mesh)

	// state = setUsedGirlData(state, usedGirl,{
	// 	...getUsedGirlData(state, usedGirl),
	// 	girlMeshMap: getUsedGirlData(state, usedGirl).girlMeshMap.set(usedGirl, mesh),
	// 	girlMMDAnimationMap: getUsedGirlData(state, usedGirl).girlMMDAnimationMap.set(usedGirl, MMDLoaderAnimationObject2.animation),
	// 	girlGroupMap: getUsedGirlData(state, usedGirl).girlGroupMap.set(usedGirl, girlGroup)
	// })
	return _addUsedMMDCharacterData(state, usedGirl, mesh, girlGroup, MMDLoaderAnimationObject2)
}

let _parseUsedMMDCharacters = (state: state, usedMMDData: Array<any>) => {
	requireCheck(() => {
		/*! otherwise, first girlGroup's children will be empty
		* 
		*/
		test("usedMMDData->mmdCharacter shouldn't be duplicate", () => {
			return getUniqueUsedMMDDataData(usedMMDData).length == usedMMDData.length
		})
	}, getIsDebug(state))

	let originScale = 0.1

	state = setAllUsedGirlData(state, (state, usedGirlData) => {
		return {
			...usedGirlData,
			originScale
		}
	})


	state = usedMMDData.map<[usedGirl, mmdCharacter, MMDLoaderAnimationObject2]>(d => {
		let data = d.data

		return [d.usedGirl, data[0],
		Loader.getResource<MMDLoaderAnimationObject2>(getAbstractState(state),
			data[1]
		)
		]
	}).reduce((state, data) => {
		return _parseUsedMMDCharacter(state, data)
	}, state)

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

// let _getUsedMMDs = (state: state) => {
// 	return getAllUsedMMDData(state).map(d => {
// 		return [

// 			d[0],
// 			Loader.getResource<MMDLoaderAnimationObject2>(getAbstractState(state),
// 				d[1]
// 			)]
// 	})
// }

let _hideGirl = (state: state, usedGirl) => {
	state = hideGirl(state, usedGirl)

	// Layer.setAllToNotVisibleLayer(girl)

	// if (getIsDebug(state)) {
	// 	let capsuleMesh = getUsedGirlData(state, usedGirl).capsuleMesh
	// 	capsuleMesh.visible = false
	// 	// Layer.setAllToNotVisibleLayer(capsuleMesh)
	// }

	// return setAbstractState(state, SkinAnimation.stopTargetAllSkinAnimations(getAbstractState(state), girl.name))
	let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)

	SkinBlendAnimation.deactivateAllActions(getGirlMesh(state, usedGirl), helper, getConfigData(state).girlAllAnimationNames)


	// helper.enable("physics", false)

	let abstractState = _initWeights(state)

	return setAbstractState(state, abstractState)
}

let _getRestoreHpKey = (usedGirl) => `${usedGirl}_girl_restoreHp`

// let _restoreHp = (state: state) => {
// 	return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
// 		let { restoreHpTime, restoreHpSpeedRate } = getValue(state)

// 		let elapsed = getNow(state) - getUsedGirlData(state, usedGirl).lastDamageTime

// 		// let promise
// 		if (elapsed > restoreHpTime && !StateMachine.isState(
// 			getStateMachine(state),
// 			objectStateName.Destroyed
// 		)) {
// 			state = addHp(state, getBody(), getFullHp(state) * restoreHpSpeedRate)

// 			// promise = Event.trigger(state, getAbstractState, getGiantessStatusUpdateEventName(), null)
// 		}
// 		// else {
// 		// 	promise = Promise.resolve(state)
// 		// }

// 		return Promise.resolve(_restoreHp(state))
// 	}, getStatusUpdateLoops(), _getRestoreHpKey()))
// }

let _getBiggerElapsed = (state: state, usedGirl) => {
	return getNow(state) - getUsedGirlData(state, usedGirl).lastScaleChangeTime
}

export let refreshBiggerTime = (state: state, usedGirl) => {
	return setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		lastScaleChangeTime: getNow(state)
	})
}

export let getFullBiggerTime = (state, usedGirl) => {
	// if (isGiantessCharacterType(state)) {
	if (isPlayerGirlOrGiantess(state, usedGirl)) {
		return getEnhanceBiggerFullTime(state, getValue(state, usedGirl).biggerMaxTime, getBiggerEnhanceLevel(state))
	}

	return getValue(state, usedGirl).biggerMaxTime
}

export let getBiggerRemainTime = (state: state, usedGirl) => {
	if (getBiggerCount(state, usedGirl) <= 0) {
		return 0
	}

	return Math.max(getFullBiggerTime(state, usedGirl) - _getBiggerElapsed(state, usedGirl), 0)
}

export let isSmallestToZeroBiggerCount = (state: state, usedGirl) => {
	// return getGirlScale(state, usedGirl) <= getValue(state).initialScale
	return getBiggerCount(state, usedGirl) <= 0
}

export let isCanActiveSmaller = (state: state, usedGirl) => {
	// return !isSmallestToZeroBiggerCount(state) && getBiggerWay(state) != biggerWay.Passive
	return !isSmallestToZeroBiggerCount(state, usedGirl) && getIsCanActiveSmallerFuncExn(state)(state, usedGirl)
}

let _getHandleSmallerKey = (usedGirl) => `${usedGirl}_handle_smaller`

let _handleSmaller = (state: state, usedGirl) => {
	return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
		// if (!isCanActiveSmaller(state)) {
		if (isChangeScaling(state, usedGirl) || !isCanActiveSmaller(state, usedGirl)) {
			return Promise.resolve(_handleSmaller(state, usedGirl))
		}

		// let {
		// 	// biggerSubExcitementTime,
		// 	biggerMaxTime,
		// 	// biggerSubExcitementScalar,
		// } = getValue(state)

		// let elapsed = _getBiggerElapsed(state)

		// if (elapsed > biggerSubExcitementTime && !StateMachine.isState(
		// 	getStateMachine(state),
		// 	objectStateName.Destroyed
		// )) {
		// 	state = subExcitement(state,usedGirl, biggerSubExcitementScalar / 6 * (getScale(state, usedGirl) * getScale(state, usedGirl) / 20))

		// 	if (
		// 		!state.config.isKeepBig
		// 		&&
		// 		(
		// 			isZeroExcitement(state)
		// 			|| elapsed > biggerMaxTime
		// 		)
		// 	) {
		// 		state = playSmallerAnimation(state, (state) => {
		// 			state = setLastScaleChangeTime(state, scaleState.Normal)
		// 			state = setNeedShowSkillBar(state, usedGirl, false)

		// 			return Promise.resolve(state)
		// 		})
		// 	}
		// }

		let promise
		if (
			!state.config.isKeepBig
			&&
			// (
			// 	elapsed > biggerMaxTime
			// )
			// getBiggerCount(state, usedGirl) <= 0
			getBiggerRemainTime(state, usedGirl) <= 0
		) {
			// state = playSmallerAnimation(state, (state) => {
			// 	state = setLastScaleChangeTime(state, scaleState.Normal)
			// 	state = setNeedShowSkillBar(state, usedGirl, false)

			// 	return Promise.resolve(state)
			// })
			promise = triggerAction(state, usedGirl, actionName.SmallerToLastBiggerCount).then(TupleUtils.getTuple2First)
		}
		else {
			promise = Promise.resolve(state)
		}

		return promise.then(state => _handleSmaller(state, usedGirl))
	}, getStatusUpdateLoops(), _getHandleSmallerKey(usedGirl)))
}

let _initPlayerGirl = (state: state) => {
	// let currentUsedGirls = getCurrentUsedGirls(state)

	// state = setCurrentUsedGirl(state, usedGirlEnum.PlayerGirl)

	let usedGirl = usedGirlEnum.PlayerGirl


	state = setSavedStudyActions(state, [
		{
			name: actionName.Reborn,
			time: getStartTime(state)
		},
		{
			name: actionName.SmallerToLastBiggerCount,
			time: getStartTime(state)
		},
		{
			name: getStompBlockService(state).getActionName(),
			time: getNow(state)
		},
	])



	// state = _setCurrentMMDCharacter(state, usedMMDData)

	state = updateHpData(state, usedGirl)

	state = changeToInitialScale(state, usedGirl)


	if (getIsDebug(state)) {
		state = setExcitement(state, usedGirl, 100)
	}
	else {
		state = setExcitement(state, usedGirl, 0)
	}




	// state = setCurrentUsedGirl(state, currentUsedGirl)

	return initWhenImportScenePlayerGirl(state)
}

let _shareMMDCharacterBetweenPlayerMMD = (state: state) => {
	// let source, target

	// if (hasGirlByUsedGirl(state, usedGirlEnum.PlayerGirl)) {
	// 	source = usedGirlEnum.PlayerGirl
	// 	target = usedGirlEnum.PlayerGoddess
	// }
	// else if (hasGirlByUsedGirl(state, usedGirlEnum.PlayerGoddess)) {
	// 	source = usedGirlEnum.PlayerGoddess
	// 	target = usedGirlEnum.PlayerGirl
	// }
	// else {
	// 	return state
	// }

	// return _addUsedMMDCharacterData(state, target, getGirlMeshByUsedGirl(state, source), getGirlByUsedGirl(state, source), Loader.getResource<MMDLoaderAnimationObject2>(getAbstractState(state),
	// 	getCurrentMMDDataByUsedGirl(state, source)[1]
	// ))
	let arr = [
		usedGirlEnum.PlayerGirl,
		usedGirlEnum.PlayerGoddess,
		...getPlayerUsedGirl(state)
	]

	let [source, target] = arr.reduce(([source, target], usedGirl) => {
		if (target.length > 0) {
			return [source, target]
		}

		if (hasGirlByUsedGirl(state, usedGirl)) {
			return [usedGirl, arr.filter(value => value != usedGirl)]
		}

		return [source, target]
	}, [arr[0], []])

	if (target.length == 0) {
		return state
	}

	return target.reduce((state, targetUsedGirl) => {
		return _addUsedMMDCharacterData(state, targetUsedGirl, getGirlMeshByUsedGirl(state, source), getGirlByUsedGirl(state, source), Loader.getResource<MMDLoaderAnimationObject2>(getAbstractState(state),
			getCurrentMMDDataByUsedGirl(state, source)[1]
		))
	}, state)
}

export let initWhenImportScene = (state: state, usedMMDData) => {
	// if (getIsDebug(state)) {
	// 	let { capsuleRadius, capsuleLengthBetweenStartAndEnd } = getCapsuleConfig(1)

	// 	let capsuleMesh = Capsule.createCapsuleMesh({
	// 		radius: capsuleRadius,
	// 		length: capsuleLengthBetweenStartAndEnd
	// 	}, "red")

	// 	// scene.add(capsuleMesh)

	// 	state = setUsedGirlData(state, usedGirl,{
	// 		...getUsedGirlData(state, usedGirl),
	// 		capsuleMesh: NullableUtils.return_(capsuleMesh)
	// 	})
	// }




	// state = _setCurrentMMDCharacter(state, usedMMDData)



	let uniqueUsedMMDData = ArrayUtils.removeDuplicateItemsWithBuildKeyFunc(usedMMDData, data => data.data[0])
	state = _parseUsedMMDCharacters(state, uniqueUsedMMDData)

	state = _shareMMDCharacterBetweenPlayerMMD(state)




	// if (getIsDebug(state)) {
	// 	state = setExcitement(state, 100)
	// }
	// else {
	// 	if (isLittleCharacterType(state)) {
	// 		state = setExcitement(state, 20)
	// 	}
	// 	else {
	// 		state = setExcitement(state, 0)
	// 	}
	// }
	// state = setExcitement(state, 0)

	// state = _hideGirl(state)

	// state = hideGirl(state)

	// let scene = getScene(state)


	// let girlBox = new Box3()
	state = setAllUsedGirlData(state, (state, usedGirlData) => {
		return {
			...usedGirlData,
			// box: girlBox,
			box: new Box3(),
		}
	})


	// if (getIsDebug(state)) {
	// 	// scene.add(
	// 	// 	NullableUtils.getExn(getUsedGirlData(state, usedGirl).capsuleMesh)
	// 	// )
	// 	addBox3Helper(getAbstractState(state), scene, girlBox, 0x3fff00)

	// 	let axesHelper = new AxesHelper(5)

	// 	axesHelper.position.copy(getGirlPosition(state, usedGirl))

	// 	scene.add(axesHelper)
	// }

	let abstractState = _initWeights(state)

	state = setAbstractState(state, abstractState)

	// state = _createCollisionShapes(state)
	// state = updateAllCollisionShapes(state, getGirl(state, usedGirl))


	// state = computeGirlBoxAndSetToState(state, usedGirl)

	// state = setHeight(state, computeHeight(state, usedGirl))


	// state = setClothHpData(state)
	// state = getHpData(state, usedGirl).reduce((state, d) => {
	// 	return setHp(state, d.damagePart, d.hp)
	// }, state)
	// state = setNeedUpdateStatus(state, getBody())


	// if (state.config.isGirlRestoreHp) {
	// 	state = _restoreHp(state)
	// }

	// state = _handleSmaller(state)


	// Object3DUtils.markNotFrustumCulled(getGirl(state, usedGirl))
	uniqueUsedMMDData.forEach(d => {
		Object3DUtils.markNotFrustumCulled(getGirlByUsedGirl(state, d.usedGirl))
	})


	if (hasPlayerUsedMMDData(state, uniqueUsedMMDData)) {
		return _initPlayerGirl(state)
	}


	// scene.add(getGirl(state, usedGirl))



	// state = setCamp(state, getName(), camp.Enemy)


	// state = setAbstractState(state, Event.on(getAbstractState(state), getDestroyedEventName(), destroyedHandler))
	// state = setAbstractState(state, Event.on(getAbstractState(state), getPickupEventName(), pickupHandler))
	// state = setAbstractState(state, Event.on(getAbstractState(state), getPinchJudageDamageEventName(), pinchJudgeDamageHandler))
	// state = setAbstractState(state, Event.on(getAbstractState(state), getEatEventName(), eatHandler))
	// state = setAbstractState(state, Event.on(getAbstractState(state), getPickdownEventName(), pickdownHandler))
	// state = setAbstractState(state, Event.on(getAbstractState(state), getStandToCrawlEventName(), standToCrawlHandler))
	// state = setAbstractState(state, Event.on(getAbstractState(state), getCrawlToStandEventName(), crawlToStandHandler))

	// return Event.trigger(state, getAbstractState, getLevelStatusUpdateEventName(), buildLevelStatusUpdateEventData(state))

	return Promise.resolve(state)
}

export let addGirl = (state: state, usedGirl, usedMMDData, worldPosition, worldQuaternion) => {
	// state = _hideGirl(state)

	return Event.trigger(state, getAbstractState, getModAPI(state).event.getBeforeAddGirlEventName(), NullableUtils.getEmpty()).then(state => {
		// if (!isPlayerGirlByUsedGirl(usedGirl)) {
		// 	state = setCurrentUsedGirl(state, usedGirl)
		// }

		state = setNeedUpdateStatusDamagePart(state, usedGirl, getBody())


		let scene = getScene(state)


		// let girlBox = new Box3()
		// state = setUsedGirlData(state, usedGirl,{
		// 	...getUsedGirlData(state, usedGirl),
		// 	box: girlBox,
		// })

		// if (getIsDebug(state)) {
		// 	// scene.add(
		// 	// 	NullableUtils.getExn(getUsedGirlData(state, usedGirl).capsuleMesh)
		// 	// )
		// 	addBox3Helper(getAbstractState(state), scene, girlBox, 0x3fff00)

		// 	let axesHelper = new AxesHelper(5)

		// 	axesHelper.position.copy(getGirlPosition(state, usedGirl))

		// 	scene.add(axesHelper)
		// }

		// let abstractState = _initWeights(state)

		// state = setAbstractState(state, abstractState)



		scene.add(getGirl(state, usedGirl))



		// let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)

		// let enablePhysics = isEnablePhysics(state)

		// helper.add(getGirlMesh(state, usedGirl), {
		// 	animation: getGirlMMDAnimation(state),
		// 	physics: enablePhysics
		// });





		state = setInitialTransform(state, usedGirl, worldPosition, worldQuaternion)

		state = setGirlPosition(state, usedGirl, worldPosition)
		state = setGirlRotation(state, usedGirl, worldQuaternion)





		state = _createCollisionShapes(state, usedGirl)

		state = restoreCollisionShapeData(state)
		state = updateAllCollisionShapes(state, usedGirl, getGirl(state, usedGirl))


		state = computeGirlBoxAndSetToState(state, usedGirl)


		if (getIsDebug(state)) {
			addBox3Helper(getAbstractState(state), scene, getGirlBox(state, usedGirl), 0x3fff00)

			let axesHelper = new AxesHelper(5)

			axesHelper.position.copy(getGirlPosition(state, usedGirl))

			scene.add(axesHelper)
		}


		state = setHeight(state, usedGirl, computeHeight(state, usedGirl))



		state = hideGirl(state, usedGirl)
		state = activateAllActions(state, usedGirl)
		state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
			// state = showGirl(state)
			if (isUseGirl(state, usedGirl)) {
				state = markGirlVisible(state, usedGirl)
			}

			return Promise.resolve(state)
		}, 2))

		// state = setNeedUpdateStatus(state, getBody())


		if (state.config.isGirlRestoreHp) {
			state = restoreHp(state,
				[
					state => {
						let { restoreHpTime, restoreHpSpeedRate } = getValue(state, usedGirl)

						return [restoreHpTime, restoreHpSpeedRate]
					},
					state => getUsedGirlData(state, usedGirl).lastDamageTime,
					(state, hp) => {
						return addHp(state, usedGirl, getBody(), hp)
					},
					(state) => {
						return getBodyHp(state, usedGirl)
					},
					(state) => {
						return getFullHp(state, usedGirl)
					},
					(state) => {
						return getStateMachine(state, usedGirl)
					},
				],
				_getRestoreHpKey(usedGirl),
				characterType.Giantess
			)
		}

		state = _handleSmaller(state, usedGirl)




		// MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl).isDisablePhysicsTranslation = true




		// Object3DUtils.markNotFrustumCulled(getGirl(state, usedGirl))


		// state = setCamp(state, getName(), getPlayerCamp())



		state = setAbstractState(state, CameraControls.resetGiantessDirectionData(getAbstractState(state), usedGirl))


		// state = resumePlayerData(state, getName(), usedGirl)



		state = setAbstractState(state, Event.on(getAbstractState(state), getDestroyingEventName(), destroyingHandler))
		state = setAbstractState(state, Event.on(getAbstractState(state), getPickupEventName(), pickupHandler))
		state = setAbstractState(state, Event.on(getAbstractState(state), getPinchJudageDamageEventName(), pinchJudgeDamageHandler))
		state = setAbstractState(state, Event.on(getAbstractState(state), getEatEventName(), eatHandler))
		state = setAbstractState(state, Event.on(getAbstractState(state), getPickdownEventName(), pickdownHandler))
		state = setAbstractState(state, Event.on(getAbstractState(state), getStandToCrawlEventName(), standToCrawlHandler))
		state = setAbstractState(state, Event.on(getAbstractState(state), getCrawlToStandEventName(), crawlToStandHandler))
		state = setAbstractState(state, Event.on(getAbstractState(state), getInsertEventName(), insertUBHandler))
		state = setAbstractState(state, Event.on(getAbstractState(state), getPutToBreastEventName(), putToBreastHandler))
		state = setAbstractState(state, Event.on(getAbstractState(state), getPutToShoeEventName(), putToShoeHandler))

		// return Event.trigger(state, getAbstractState, getLevelStatusUpdateEventName(), buildLevelStatusUpdateEventData(state)).then(state => {
		return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
			return setStateMachine(usedGirl)(state, stateMachine)
		}, getStateMachine(state, usedGirl), createInitialState(), buildNameByUsedGirl(usedGirl), NullableUtils.getEmpty()).then(state => {
			return Event.trigger(state, getAbstractState, getGiantessStatusUpdateEventName(), buildGiantessStatusUpdateEventNameEventData(
				getBody(), usedGirl
			))
		})
		// })
	})
}



let _resetPose = (state: state, usedGirl) => {
	switch (getCurrentPose(state, usedGirl)) {
		case pose.Crawl:
			state = changeToStandPosePivot(state, usedGirl)
			break
	}

	state = changePose(state, usedGirl, pose.Stand)

	return state
}

let _resetBigger = (state: state, usedGirl) => {
	// state = setNeedShowSkillBar(state, usedGirl, false)
	state = setLastScaleChangeTime(state, usedGirl)

	return state
}

// export let initClothHpData = (state: state, usedMMDData) => {
// 	return usedMMDData.reduce((state, d) => {
// 		return setConfigData(state, {
// 			...getConfigData(state),
// 			clothHpDataMap: getConfigData(state).clothHpDataMap.set(
// 				d.usedGirl,
// 				getClothHpData(state, d.usedGirl)
// 			),
// 		})
// 	}, state)
// }

export let removeGirl = (state: state, usedGirl, usedMMDData): Promise<state> => {
	let scene = getScene(state)

	state = stopAndClearTweens(state, usedGirl)

	let abstactState = Flow.removeDeferExecFuncData(getAbstractState(state), _getRestoreHpKey(usedGirl))
	abstactState = Flow.removeDeferExecFuncData(abstactState, _getHandleSmallerKey(usedGirl))

	state = setAbstractState(state, abstactState)



	state = _hideGirl(state, usedGirl)

	state = resetAction(state, usedGirl)

	state = resetAnimation(state, usedGirl, animationName.Idle)
	state = disposeAnimation(state, usedGirl)
	state = _resetPose(state, usedGirl)
	state = _resetBigger(state, usedGirl)


	return removePlayerFiniteTimeBuffs(state, buildNameByUsedGirl(usedGirl), usedGirl).then(state => {
		MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl).clearCache(getGirlMesh(state, usedGirl))


		scene.remove(getGirl(state, usedGirl))


		state = offAllEvents(state)

		return Event.trigger(state, getAbstractState, getModAPI(state).event.getAfterRemoveGirlEventName(), NullableUtils.return_({ usedMMDData, usedGirl }))
			.then(state => {
				return resetAttackUnits(state, attackTarget.Giantess)
			})

	})
		.then(state => {
			state = clearNeedUpdateStatus(state, usedGirl)

			// if (!isPlayerGirlByUsedGirl(usedGirl) && isCurrentUsedGirl(state, usedGirl)) {
			// 	let currentUsedGirl = getCurrentUsedGirl(state)

			// 	state = removeCurrentUsedGirl(state)

			// 	return Event.trigger(state, getAbstractState, getBossStatusUpdateEventName(), null)
			// 		.then(state => {
			// 			return Event.trigger(state, getAbstractState, getBossSkillStatusUpdateEventName(),
			// 				buildSkillStatusData(
			// 					false,
			// 					currentUsedGirl
			// 				)
			// 			)
			// 		})
			// }

			return state
		})
}

export let isCanSwitchToLittleMan = (state: state) => {
	let usedGirl = usedGirlEnum.PlayerGirl
	if (
		isChangeScaling(state, usedGirl)
		|| !isActionState(state, usedGirl, actionState.Initial)
		// || !isScaleState(state, scaleState.Normal)
		// || isCanActiveSmaller(state)
		|| !isPose(state, usedGirl, pose.Stand)
		|| isDestoryRelatedStates(getStateMachine(state, usedGirl))
		|| isControlledState(state, getStateMachine(state, usedGirl))
		|| hasControlledData(state, usedGirl)
	) {
		return false
	}

	return true
}