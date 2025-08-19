import { MMDLoaderAnimationObject2 } from "meta3d-jiehuo-abstract/src/three/MMDLoader"
import { state } from "../../../../type/StateType"
import { physicsLevel, resourceId } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as Const from "../data/Const"
import { animationName } from "../data/DataType"
import { getConfigData, getName, getSceneChapter } from "../CityScene"
import { getGirlState, setGirlState } from "../girl/Girl"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Device } from "meta3d-jiehuo-abstract"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import type { Material, SkinnedMesh, Bone, Object3D } from "three"
import { Loader } from "meta3d-jiehuo-abstract"
import { deepDispose } from "meta3d-jiehuo-abstract/src/scene/utils/DisposeUtils"
import { mmdCharacter, mmdCharacterData } from "../data/mmd/MMDData"
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType"

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


export let isEnablePhysics = (state: state) => {
	// if (getSceneChapter(state) == scene.Biwu) {
	// 	return true
	// }

	if (RenderSetting.getRenderSetting(getAbstractState(state)).physics == physicsLevel.VeryLow) {
		return false
	}

	if (RenderSetting.getRenderSetting(getAbstractState(state)).physics == physicsLevel.VeryHigh) {
		return true
	}

	switch (getGirlState(state).currentMMDCharacter) {
		case mmdCharacter.Meiko:
		case mmdCharacter.Vanilla:
		case mmdCharacter.Meibiwusi:
		case mmdCharacter.Miku1:
		case mmdCharacter.XiaHui:
		case mmdCharacter.Changee:
		case mmdCharacter.Haku_Lady:
		case mmdCharacter.Haku_QP:
		case mmdCharacter.Nero:
			return true
		default:
			return false
	}
}

export let getCurrentMMDData = (state: state): [mmdCharacter, resourceId, any, mmdCharacterData] => {
	return NullableUtils.getExn(getConfigData(state).allMMDData.filter(data => {
		return data[0] == getGirlState(state).currentMMDCharacter
	})[0])
}

export let isPMX = (state: state) => {
	// switch (getGirlState(state).currentMMDCharacter) {
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

export let getBone = (state: state, girl: Object3D, boneName: string): [state, Bone] => {
	let boneCacheMap = getGirlState(state).boneCacheMap

	if (boneCacheMap.has(boneName)) {
		return [state, NullableUtils.getExn(boneCacheMap.get(boneName))]
	}

	let bone = girl.getObjectByName(boneName) as Bone

	state = setGirlState(state, {
		...getGirlState(state),
		boneCacheMap: boneCacheMap.set(boneName, bone)
	})

	return [state, bone]
}

export let isValid = (mmdCharacter_: mmdCharacter) => {
	if (Device.isIOS()) {
		if (mmdCharacter_ == mmdCharacter.Haku_Lady) {
			return false
		}

		return true
	}

	return true
}

export let disposeMMDResource = (state: state) => {
	return getConfigData(state).allMMDData.filter(data => {
		return Loader.isResourceLoaded(getAbstractState(state), data[1])
	}).reduce((state, data) => {
		let mmdCharacter = Loader.getResource<MMDLoaderAnimationObject2>(getAbstractState(state),
			data[1]
		)

		deepDispose(mmdCharacter.mesh)


		return setAbstractState(state, Loader.removeResource(getAbstractState(state),
			data[1]
		))
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