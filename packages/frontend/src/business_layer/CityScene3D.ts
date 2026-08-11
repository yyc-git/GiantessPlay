// import { SceneUtils } from 'meta3d-jiehuo-abstract';
import * as CityScene from '../scene3d_layer/script/scene/scene_city/CityScene';
import * as Debug from '../scene3d_layer/script/scene/scene_city/Debug';
import { firstPersonCameraTarget, thirdPersonCameraTarget } from '../scene3d_layer/script/scene/scene_city/type/StateType';
import { cameraType, state } from '../scene3d_layer/type/StateType';
import { getAbstractState, setAbstractState } from '../scene3d_layer/state/State';
import { getCurrentCamera } from 'meta3d-jiehuo-abstract/src/scene/Camera';
import { getCurrentScene, getScene } from 'meta3d-jiehuo-abstract/src/scene/Scene';
import { setPivotWorldPositionAndUpdateBox } from '../scene3d_layer/script/scene/scene_city/girl/Utils';
import * as ManageScenePlayLevel1 from '../scene3d_layer/script/scene/scene_city/manage/city1/ManageScene';
import * as ManageSceneBiwuLevel1 from '../scene3d_layer/script/scene/scene_city/manage/biwu/level1/ManageScene';
import * as ManageSceneBiwuLevel2 from '../scene3d_layer/script/scene/scene_city/manage/biwu/level2/ManageScene';
import * as ManageSceneBiwuLevel3 from '../scene3d_layer/script/scene/scene_city/manage/biwu/level3/ManageScene';
import { NullableUtils } from 'meta3d-jiehuo-abstract';

// export let getResourceId = levelNumber => SceneUtils.buildResourceId(CityScene.getName, levelNumber)

export let loadCity1Resource = (state: state,
    setPercentFunc, character) => {

    return ManageScenePlayLevel1.handleBeforeLoadResource(state, character).then(state => {
        return CityScene.loadResource(
            state,
            CityScene.getCity1LoadData(state),
            setPercentFunc,
            // getRogueUsedMMDData(state)
        )
    })
}

// export let loadProtectResource = (state: state,
//     setPercentFunc) => {
//     state = ManageSceneProtect.handleBeforeLoadResource(state)

//     return CityScene.loadResource(
//         state,
//         CityScene.getProtectLoadData(state),
//         setPercentFunc,
//         // getRogueUsedMMDData(state)
//     )
// }


export let loadBiwuLevel1Resource = (state: state,
    setPercentFunc) => {
    state = ManageSceneBiwuLevel1.handleBeforeLoadResource(state)

    return CityScene.loadResource(
        state,
        CityScene.getBiwuLevel1LoadData(state),
        setPercentFunc,
        // getBiwuUsedMMDData(state)
    )
}

export let loadBiwuLevel2Resource = (state: state,
    setPercentFunc) => {
    state = ManageSceneBiwuLevel2.handleBeforeLoadResource(state)

    return CityScene.loadResource(
        state,
        CityScene.getBiwuLevel2LoadData(state),
        setPercentFunc,
        // getBiwuUsedMMDData(state)
    )
}

export let loadBiwuLevel3Resource = (state: state,
    setPercentFunc) => {
    state = ManageSceneBiwuLevel3.handleBeforeLoadResource(state)

    return CityScene.loadResource(
        state,
        CityScene.getBiwuLevel3LoadData(state),
        setPercentFunc,
        // getBiwuUsedMMDData(state)
    )
}

// export let loadResource = CityScene.loadResource

// export let getAllSceneIndices = CityScene.getAllSceneIndices

export let useOrbitControls = CityScene.useOrbitControls

// export let useThirdPersonControls = CityScene.useThirdPersonControls

// export let getCameraType = (state) => {
//     switch (CityScene.getCameraType(state)) {
//         case cameraType.ThirdPerson:
//             return "第三人称相机"
//         case cameraType.FirstPerson:
//             return "第一人称相机"
//         case cameraType.Orbit:
//         default:
//             return "轨道相机"
//     }
// }

// export let getAllCameraTypes = () => ["轨道相机", "第三人称相机"]
export let getAllCameraTypes = () => ["轨道相机"]

export let getAllSceneNumbers = CityScene.getAllSceneNumbers

export let setGirlScale = CityScene.setGirlScale

export let getGirlScale = CityScene.getGirlScale

export let setGirlPosition = CityScene.setGirlPosition

export let transportGirl = (state, usedGirl, position) => {
    getCurrentCamera(getAbstractState(state)).position.copy(position)

    return setPivotWorldPositionAndUpdateBox(state, usedGirl, position)
}

export let getGirlCenter = CityScene.getGirlCenter

export let triggerAction = CityScene.triggerAction

export let triggerLittleManAction = CityScene.triggerLittleManAction

export let setActionState = CityScene.setActionState

export let setLittleManActionState = CityScene.setLittleManActionState

export let setCurrentMMDCharacterByUsedGirl = CityScene.setCurrentMMDCharacterByUsedGirl

export let setCurrentModelName = CityScene.setCurrentModelName

export let getThirdPersonCameraTarget = state => {
    // return CityScene.readCameraTarget(state).then(target => {
    //     return NullableUtils.getWithDefaultFunc(target, () => {
    //         switch (CityScene.getThirdPersonCameraTarget(state)) {
    //             case thirdPersonCameraTarget.Chest:
    //                 return "chest"
    //             case thirdPersonCameraTarget.Foot:
    //                 return "foot"
    //             default:
    //                 throw new Error("err")
    //         }
    //     })
    // })
    switch (CityScene.getThirdPersonCameraTarget(state)) {
        case thirdPersonCameraTarget.Chest:
            return "chest"
        case thirdPersonCameraTarget.Foot:
            return "foot"
        case thirdPersonCameraTarget.Free:
            return "free"
        default:
            throw new Error("err")
    }
}

export let setThirdPersonCameraTarget = CityScene.setThirdPersonCameraTarget

export let getFirstPersonCameraTarget = state => {
    // return CityScene.readCameraTarget(state).then(target => {
    //     return NullableUtils.getWithDefaultFunc(target, () => {
    //         switch (CityScene.getFirstPersonCameraTarget(state)) {
    //             case firstPersonCameraTarget.Eye:
    //                 return "eye"
    //             case firstPersonCameraTarget.Leg:
    //                 return "leg"
    //             default:
    //                 throw new Error("err")
    //         }
    //     })
    // })
    switch (CityScene.getFirstPersonCameraTarget(state)) {
        case firstPersonCameraTarget.Eye:
            return "eye"
        case firstPersonCameraTarget.Leg:
            return "leg"
        default:
            throw new Error("err")
    }
}

export let setFirstPersonCameraTarget = CityScene.setFirstPersonCameraTarget

// export let setZoom = CityScene.setZoom

// export let getMaxZoom = CityScene.getMaxZoom

// export let getMinZoom = CityScene.getMinZoom

// export let getZoom = CityScene.getZoom

export let zoomIn = CityScene.zoomIn

export let zoomOut = CityScene.zoomOut

export let getDestroyedRate = CityScene.getDestroyedRate

export let getGameTimeString = CityScene.getGameTimeString

export let getRenderSetting = (state) => {
    return getRenderSetting(state)
}

// export let setHD = (state, value) => {
//     return setAbstractState(state, RenderSetting.setHD(getAbstractState(state), value))
// }

// export let setShadow = (state, value) => {
//     return setAbstractState(state, RenderSetting.setShadow(getAbstractState(state), value))
// }

// export let setRenderAccuracy = (state, renderAccuracy) => {
//     return setAbstractState(state, RenderSetting.setRenderAccuracy(getAbstractState(state), renderAccuracy))
// }

// export let setIsShowBlood = (state, isShowBlood) => {
//     return setAbstractState(state, RenderSetting.setIsShowBlood(getAbstractState(state), isShowBlood))
// }

// export let setCrowdSize = (state, value) => {
//     return setAbstractState(state, RenderSetting.setCrowdSize(getAbstractState(state), value))
// }

// export let setPhysics = (state, value) => {
//     return setAbstractState(state, RenderSetting.setPhysics(getAbstractState(state), value))
// }

// export let setCameraRotateSpeed = (state, value) => {
//     return setAbstractState(state, RenderSetting.setCameraRotateSpeed(getAbstractState(state), value))
// }

// export let setMapSize = (state, value) => {
//     return setAbstractState(state, RenderSetting.setMapSize(getAbstractState(state), value))
// }


export let setHp = Debug.setHp

export let setGirlHp = Debug.setGirlHp

export let restoreHp = Debug.restoreHp

export let isHPMax = Debug.isHPMax

export let showDynamicName = Debug.showDynamicName

export let showStaticName = Debug.showStaticName

// export let setCharacterType = CityScene.setCharacterType

// export let bigger = CityScene.bigger

// export let smaller = CityScene.smaller

export let showBox = (state, isShowBox) => {
    getScene(getAbstractState(state)).traverse(obj => {
        if (obj.type == "Box3Helper") {
            obj.visible = isShowBox
        }
    })

    return {
        ...state,
        config: {
            ...state.config,
            isShowBox
        }
    }
}

export let isCanSwitchCharacterType = CityScene.isCanSwitchCharacterType

export let switchCharacterType = CityScene.switchCharacterType