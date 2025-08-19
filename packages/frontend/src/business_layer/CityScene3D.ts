// import { SceneUtils } from 'meta3d-jiehuo-abstract';
import { RenderSetting } from 'meta3d-jiehuo-abstract';
import * as CityScene from '../scene3d_layer/script/scene/scene_city/CityScene';
import { firstPersonCameraTarget, thirdPersonCameraTarget } from '../scene3d_layer/script/scene/scene_city/type/StateType';
import { cameraType, state } from '../scene3d_layer/type/StateType';
import { getAbstractState, setAbstractState } from '../scene3d_layer/state/State';
import { crowdSize, renderAccuracyLevel } from 'meta3d-jiehuo-abstract/src/type/StateType';
import { getCurrentCamera } from 'meta3d-jiehuo-abstract/src/scene/Camera';
import { getCurrentScene, getScene } from 'meta3d-jiehuo-abstract/src/scene/Scene';
import { setPivotWorldPositionAndUpdateBox } from '../scene3d_layer/script/scene/scene_city/girl/Utils';
import * as ManageScenePlayLevel1 from '../scene3d_layer/script/scene/scene_city/manage/city1/ManageScene';
import * as ManageSceneBiwuLevel1 from '../scene3d_layer/script/scene/scene_city/manage/biwu/level1/ManageScene';
import * as ManageSceneBiwuLevel2 from '../scene3d_layer/script/scene/scene_city/manage/biwu/level2/ManageScene';
import * as ManageSceneBiwuLevel3 from '../scene3d_layer/script/scene/scene_city/manage/biwu/level3/ManageScene';

// export let getResourceId = levelNumber => SceneUtils.buildResourceId(CityScene.getName, levelNumber)

export let loadCity1Resource = (state: state,
    setPercentFunc) => {
    state = ManageScenePlayLevel1.handleBeforeLoadResource(state)

    return CityScene.loadResource(
        state,
        CityScene.getCity1LoadData(),
        setPercentFunc
    )
}

export let loadBiwuLevel1Resource = (state: state,
    setPercentFunc) => {
    state = ManageSceneBiwuLevel1.handleBeforeLoadResource(state)

    return CityScene.loadResource(
        state,
        CityScene.getBiwuLevel1LoadData(),
        setPercentFunc
    )
}

export let loadBiwuLevel2Resource = (state: state,
    setPercentFunc) => {
    state = ManageSceneBiwuLevel2.handleBeforeLoadResource(state)

    return CityScene.loadResource(
        state,
        CityScene.getBiwuLevel2LoadData(),
        setPercentFunc
    )
}

export let loadBiwuLevel3Resource = (state: state,
    setPercentFunc) => {
    state = ManageSceneBiwuLevel3.handleBeforeLoadResource(state)

    return CityScene.loadResource(
        state,
        CityScene.getBiwuLevel3LoadData(),
        setPercentFunc
    )
}

// export let loadResource = CityScene.loadResource

// export let getAllSceneIndices = CityScene.getAllSceneIndices

export let useOrbitControls = CityScene.useOrbitControls

// export let useThirdPersonControls = CityScene.useThirdPersonControls

export let getCameraType = (state) => {
    switch (CityScene.getCameraType(state)) {
        case cameraType.ThirdPerson:
            return "第三人称相机"
        case cameraType.FirstPerson:
            return "第一人称相机"
        case cameraType.Orbit:
        default:
            return "轨道相机"
    }
}

// export let getAllCameraTypes = () => ["轨道相机", "第三人称相机"]
export let getAllCameraTypes = () => ["轨道相机"]

export let getAllSceneNumbers = CityScene.getAllSceneNumbers

export let setGirlScale = CityScene.setGirlScale

export let getGirlScale = CityScene.getGirlScale

export let setGirlPosition = CityScene.setGirlPosition

export let transportGirl = (state, position) => {
    getCurrentCamera(getAbstractState(state)).position.copy(position)

    return setPivotWorldPositionAndUpdateBox(state, position)
}

export let getGirlCenter = CityScene.getGirlCenter

export let triggerAction = CityScene.triggerAction

export let triggerLittleManAction = CityScene.triggerLittleManAction

export let setActionState = CityScene.setActionState

export let setLittleManActionState = CityScene.setLittleManActionState

export let setCurrentMMDCharacter = CityScene.setCurrentMMDCharacter

export let setCurrentModelName = CityScene.setCurrentModelName

export let getThirdPersonCameraTarget = state => {
    switch (CityScene.getThirdPersonCameraTarget(state)) {
        case thirdPersonCameraTarget.Chest:
            return "chest"
        case thirdPersonCameraTarget.Foot:
            return "foot"
        default:
            throw new Error("err")
    }
}

export let setThirdPersonCameraTarget = CityScene.setThirdPersonCameraTarget

export let getFirstPersonCameraTarget = state => {
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

export let getGameTime = CityScene.getGameTime

export let getRenderSetting = (state) => {
    return RenderSetting.getRenderSetting(getAbstractState(state))
}

export let setHD = (state, value) => {
    return setAbstractState(state, RenderSetting.setHD(getAbstractState(state), value))
}

export let setShadow = (state, value) => {
    return setAbstractState(state, RenderSetting.setShadow(getAbstractState(state), value))
}

export let setRenderAccuracy = (state, renderAccuracy) => {
    return setAbstractState(state, RenderSetting.setRenderAccuracy(getAbstractState(state), renderAccuracy))
}

export let setIsShowBlood = (state, isShowBlood) => {
    return setAbstractState(state, RenderSetting.setIsShowBlood(getAbstractState(state), isShowBlood))
}

export let setCrowdSize = (state, value) => {
    return setAbstractState(state, RenderSetting.setCrowdSize(getAbstractState(state), value))
}

export let setPhysics = (state, value) => {
    return setAbstractState(state, RenderSetting.setPhysics(getAbstractState(state), value))
}



export let setHp = CityScene.setHp

export let setGirlHp = CityScene.setGirlHp

export let restoreHp = CityScene.restoreHp

export let isHPMax = CityScene.isHPMax

export let showDynamicName = CityScene.showDynamicName

export let showStaticName = CityScene.showStaticName

export let setRoad = CityScene.setRoad

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