import { MMDLoaderAnimationObject2 } from "meta3d-jiehuo-abstract/src/three/MMDLoader"
import { state } from "../../../../type/StateType"
import { resourceId } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as Const from "../data/Const"
import { animationName } from "../data/DataType"
import { getConfigData, getName, getScene, getSceneChapter } from "../CityScene"
import { getCurrentMMDCharacterName, getUsedGirlData, isUsePlayerGiantessByUsedGirl, setUsedGirlData } from "../girl/Girl"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Device } from "meta3d-jiehuo-abstract"
import { getAbstractState, getBlockState, setAbstractState } from "../../../../state/State"
import type { Material, SkinnedMesh, Mesh, Bone, Object3D } from "three"
import { Loader } from "meta3d-jiehuo-abstract"
import { deepDispose, removeAndDispose } from "meta3d-jiehuo-abstract/src/scene/utils/DisposeUtils"
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { usedGirlEnum } from "../type/StateType"
import { getAllRandomUsedMMDData as getRandomUsedMMDDataPlay } from "../data/play/level1/MMDUtils"
import { getAllRandomUsedMMDData as getRandomUsedMMDDataBiwu } from "../data/biwu/MMDUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
// import { mmdCharacter as mmdCharacterBiwuLevel3 } from "../data/biwu/level3/CollisionShapeData"
import { modProtocolName } from "../../../../mod/data/ModData"
import { mmdCharacterData } from "mmd-character-protocol/src/service/ServiceType"
import { mmdCharacter } from "../data/mmd/MMDData"
import { getRenderSetting } from "../../../../mod/SettingMod"
import { physicsLevel } from "setting-default/src/Type"
// import { mmdCharacter } from "type-default/src/Type"
// import { mmdCharacter } from "type-default/src/Type"
import * as BlockManager from "block/src/BlockManager"
// import { mmdCharacter } from "mmd-character-extend/src/json/Type"

// import { mmdCharacter as mmdCharacterExtend } from "mmd-character-extend/src/json/Type"


// let _getVMDData = () => {
// 	return [
// 		[
// 			animationName.Idle,
// 			Const.getIdleAnimationResourcePath(getName())
// 		],
// 		[
// 			animationName.Walk,
// 			Const.getWalkAnimationResourcePath(getName())
// 		],
// 		[
// 			animationName.Stomp,
// 			Const.getStompAnimationResourcePath(getName())
// 		],
// 		[
// 			animationName.HeavyStressing,
// 			Const.getHeavyStressingAnimationResourcePath(getName())
// 		],
// 		[
// 			animationName.HeavyStressingBreast,
// 			Const.getHeavyStressingBreastAnimationResourcePath(getName())
// 		],
// 		[
// 			animationName.HeavyStressingTrigoneAndButt,
// 			Const.getHeavyStressingTrigoneAndButtAnimationResourcePath(getName())
// 		],
// 		[
// 			animationName.Death,
// 			Const.getDeathAnimationResourcePath(getName())
// 		],

// 		[
// 			animationName.Hello,
// 			Const.getHelloAnimationResourcePath(getName())
// 		],
// 	]
// }


export let isEnablePhysics = (state: state, usedGirl) => {
	return false
	// if (getSceneChapter(state) == scene.Biwu) {
	// 	return true
	// }

	// if (getRenderSetting(state).physics == physicsLevel.VeryLow) {
	// 	return false
	// }

	// if (getRenderSetting(state).physics == physicsLevel.VeryHigh) {
	// 	return true
	// }

	// switch (getUsedGirlData(state, usedGirl).currentMMDCharacter) {
	// 	// case mmdCharacter.Meiko:
	// 	// case mmdCharacter.Vanilla:
	// 	// case mmdCharacter.Meibiwusi:
	// 	// // case mmdCharacter.Miku1:
	// 	// // case mmdCharacter.XiaHui:
	// 	// // case mmdCharacter.Changee:
	// 	// // case mmdCharacter.Haku_Lady:
	// 	// case mmdCharacter.Haku_QP:
	// 		// case mmdCharacter.Nero:
	// 		// return true
	// 	default:
	// 		return getAllBlockServiceFuncWithDefault2(state, (result, service) => {
	// 			if (result) {
	// 				return result
	// 			}

	// 			return service.isEnablePhysics(getUsedGirlData(state, usedGirl).currentMMDCharacter)
	// 		}, modProtocolName.MMDCharacterProtocol, [])
	// }
	// return getAllBlockServiceFuncWithDefault2(state, (result, service) => {
	// 	if (result) {
	// 		return result
	// 	}

	// 	return service.isEnablePhysics(getUsedGirlData(state, usedGirl).currentMMDCharacter)
	// }, modProtocolName.MMDCharacterProtocol, false)
}

export let getMMDData = (state: state, mmdCharacter): [mmdCharacter, resourceId, any, mmdCharacterData] => {
	return getConfigData(state).allMMDData.filter(data => {
		return data[0] == mmdCharacter
	})[0]
}

let _getAllMMDDataExcept = (state: state, except: Array<mmdCharacter>) => {
	let allMMDData = getConfigData(state).allMMDData.filter(d => !except.includes(d[0]))

	if (allMMDData.length <= 0) {
		throw new Error("err")
	}

	return allMMDData
}

export let getRandomMMDData = (state: state, except: Array<mmdCharacter>, specificMMDCharacter?: mmdCharacter): [mmdCharacter, resourceId, any, mmdCharacterData] => {
	let allMMDData = _getAllMMDDataExcept(state, except)

	// return allMMDData.find(a => a[0] == "Ciming")
	// return allMMDData.find(a => a[0] == "Sunxiaomei")
	// return allMMDData.find(a => a[0] == "Moye")
	// return allMMDData.find(a => a[0] == "Changee")
	// return allMMDData.find(a => a[0] == "Lipusi")
	// return allMMDData.find(a => a[0] == "Qiyana")
	// return allMMDData.find(a => a[0] == "Youye")
	// return allMMDData.find(a => a[0] == "Kongzhilvzhe")
	// return allMMDData.find(a => a[0] == "Vanilla")
	// return allMMDData.find(a => a[0] == "Meibiwusi")
	// return allMMDData.find(a => a[0] == "Nero")
	// return allMMDData.find(a => a[0] == "Haku_QP")
	// return allMMDData.find(a => a[0] == "Haku_Lady")
	// return allMMDData.find(a => a[0] == "Baixi_Maid")
	// return allMMDData.find(a => a[0] == "XiaHui")
	// return allMMDData.find(a => a[0] == "Xiaye1")
	// return allMMDData.find(a => a[0] == "Xiaye2")
	// return allMMDData.find(a => a[0] == "Miku1")
	// return allMMDData.find(a => a[0] == "Noah")
	if (NullableUtils.isNullable(specificMMDCharacter)) {
		return allMMDData[NumberUtils.getRandomInteger(0, allMMDData.length - 1)]
		// return allMMDData.find(a => a[0] == "Haku_QP")
	}

	return allMMDData.find(a => a[0] == NullableUtils.getExn(specificMMDCharacter))

	// return allMMDData[NumberUtils.getRandomInteger(0, allMMDData.length - 1)]
	// return allMMDData[0]
}

export let getRandomMMDDataExceptMMDData = (state: state, except: Array<[mmdCharacter, resourceId, any, mmdCharacterData]>): [mmdCharacter, resourceId, any, mmdCharacterData] => {
	return getRandomMMDData(state, except.map(e => e[0]))
}


let _getSpecificWildGiantessBlockState = (state: state) => {
	return BlockManager.getBlockStateExn<any>(getBlockState(state), modProtocolName.PropOtherProtocol, "prop-artifact-specificgiantess")
}

export let getSpecificGiantessMMDDataExceptMMDData = (state: state, except: Array<[mmdCharacter, resourceId, any, mmdCharacterData]>): [mmdCharacter, resourceId, any, mmdCharacterData] => {
	let mmdCharacter = _getSpecificWildGiantessBlockState(state).mmdCharacter

	return NullableUtils.getWithDefaultFunc(_getAllMMDDataExcept(state, except.map(e => e[0])).find(a => a[0] == NullableUtils.getExn(mmdCharacter)),
		() => getRandomMMDDataExceptMMDData(state, except)
	)
}

export let getCurrentMMDDataByUsedGirl = (state: state, usedGirl): [mmdCharacter, resourceId, any, mmdCharacterData] => {
	return getMMDData(state, getUsedGirlData(state, usedGirl).currentMMDCharacter)
}

export let getCurrentMMDData = (state: state, usedGirl): [mmdCharacter, resourceId, any, mmdCharacterData] => {
	return getMMDData(state, getUsedGirlData(state, usedGirl).currentMMDCharacter)
}

// let _randomSelectOneMMDDataExceptCurrent = (state: state) => {
// 	let d = getConfigData(state).allMMDData.filter(data => {
// 		return data[0] != getUsedGirlData(state, usedGirl).currentMMDCharacter
// 	})

// 	return NullableUtils.getExn(d[NumberUtils.getRandomInteger(0, d.length - 1)])
// }

// export let getAllRandomUsedMMDData = (state: state) => {
// 	switch (getSceneChapter(state)) {
// 		case scene.Play:
// 			return getRandomUsedMMDDataPlay(state)
// 		case scene.Biwu:
// 			return getRandomUsedMMDDataBiwu(state)
// 		default:
// 			throw new Error("err")
// 	}
// }

export let setUsedMMDData = (state: state, usedMMDData) => {
	return usedMMDData.reduce((state, data) => {
		return setUsedGirlData(state, data.usedGirl, {
			...getUsedGirlData(state, data.usedGirl),
			usedMMDData: NullableUtils.return_(data.data)
		})
	}, state)
}

export let getUniqueUsedMMDDataData = (usedMMDData) => {
	return ArrayUtils.removeDuplicateItemsWithBuildKeyFunc(
		usedMMDData,
		d => {
			return d.data[1]
		}
	).map(d => d.data)
}

export let hasPlayerUsedMMDData = (state: state, usedMMDData) => {
	// return !NullableUtils.isNullable(usedMMDData.find(d => d.usedGirl == usedGirlEnum.PlayerGirl))
	return !NullableUtils.isNullable(usedMMDData.find(d => isUsePlayerGiantessByUsedGirl(state, d.usedGirl)))
}

// export let getUniqueUsedMMDDataData2 = (usedMMDData2) => {
// 	return ArrayUtils.removeDuplicateItemsWithBuildKeyFunc(
// 		usedMMDData2,
// 		d => {
// 			return d[1]
// 		}
// 	)
// }


export let isPMX = (state: state) => {
	// switch (getUsedGirlData(state, usedGirl).currentMMDCharacter) {
	// case mmdCharacter.Miku:
	// 	case mmdCharacter.Meiko:
	// 	case mmdCharacter.Luka:
	// 	case mmdCharacter.Neru:
	// 		return false
	// 	default:
	// 		return true
	// }

	return true
}

export let hasBone = (girl: Object3D, boneName: string): boolean => {
	return !NullableUtils.isNullable(girl.getObjectByName(boneName))
}

export let getBone = (state: state, usedGirl, girl: Object3D, boneName: string, collisionPart_?): [state, Bone] => {
	let boneCacheMap = getUsedGirlData(state, usedGirl).boneCacheMap

	if (boneCacheMap.has(boneName)) {
		let bone = boneCacheMap.get(boneName)

		if (NullableUtils.isNullable(bone)) {
			throw new Error(`null: boneName: ${boneName}, collisionPart_:${collisionPart_}, mmdCharacterName: ${getCurrentMMDCharacterName(state, usedGirl)}`)
		}

		return [state, NullableUtils.getExn(bone)]
	}

	let bone = girl.getObjectByName(boneName) as Bone

	state = setUsedGirlData(state, usedGirl, {
		...getUsedGirlData(state, usedGirl),
		boneCacheMap: boneCacheMap.set(boneName, bone)
	})

	if (NullableUtils.isNullable(boneName) || NullableUtils.isNullable(bone)) {
		throw new Error(`null: boneName: ${boneName}, collisionPart_:${collisionPart_},
		bone is nullable: ${NullableUtils.isNullable(bone)}, mmdCharacterName: ${getCurrentMMDCharacterName(state, usedGirl)}`)
	}

	return [state, bone]
}

export let isValid = (mmdCharacter_: mmdCharacter) => {
	// if (Device.isIOS()) {
	// 	if (mmdCharacter_ == mmdCharacter.Haku_Lady) {
	// 		return false
	// 	}

	// 	return true
	// }

	return true
}

export let disposeMMDResource = (state: state, meshObj: Object3D, resourceId) => {
	// removeAndDispose(getScene(state), meshObj)
	// getScene(state).remove(meshObj)

	deepDispose(meshObj)


	let resource = Loader.getResource<any>(getAbstractState(state),
		resourceId
	)

	resource.mesh = null
	resource.animation = null


	return setAbstractState(state, Loader.removeResource(getAbstractState(state),
		resourceId
	))
}

export let disposeAllLoadedMMDResources = (state: state) => {
	return getConfigData(state).allMMDData.filter(data => {
		return Loader.isResourceLoaded(getAbstractState(state), data[1])
	}).reduce((state, data) => {
		let mmdCharacter = Loader.getResource<MMDLoaderAnimationObject2>(getAbstractState(state),
			data[1]
		)

		return disposeMMDResource(state, mmdCharacter.mesh, data[1])
	}, state)
}


export let setMaterialVisibleByName = (skinMesh: SkinnedMesh, name, visible) => {
	let materials = skinMesh.material as Array<Material>

	materials.forEach(m => {
		if (m.name == name) {
			m.visible = visible
		}
	})

	// let result = NullableUtils.getEmpty<Mesh>()

	// obj.traverse((object: any) => {
	// 	if (!NullableUtils.isNullable(result)) {
	// 		return
	// 	}

	// 	if (object.isMesh && object.material.name == name) {
	// 		result = NullableUtils.return_(object)
	// 	}
	// })

	// return NullableUtils.getExn(result)
}

export let setMaterialVisible = (material: Material, visible) => {
	material.visible = visible
}