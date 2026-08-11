import { cameraType, state } from "../../../../type/StateType";
import { buildCameraFar, setCameraFar } from "../Camera";
import { isGiantessCharacterType } from "../CityScene";
import { buildCameraFar as buildLittleManCameraFar } from "../LittleManCamera";
import { getScale } from "../girl/Utils";
import { usedGirlEnum } from "../type/StateType";

export let getRemainCameraType = (getDefaultCameraTypeFunc, currentCameraType) => {
    let remainCameraType
    switch (currentCameraType) {
        case cameraType.ThirdPerson:
        case cameraType.FirstPerson:
            remainCameraType = currentCameraType
            break
        default:
            remainCameraType = getDefaultCameraTypeFunc()
            break
    }

    return remainCameraType
}

export let updateCameraFar = (state: state) => {
    if (isGiantessCharacterType(state)) {
        state = setCameraFar(state, buildCameraFar(state, getScale(state, usedGirlEnum.PlayerGirl)))
    }
    else {
        state = setCameraFar(state, buildLittleManCameraFar(state))
    }

    return state
}