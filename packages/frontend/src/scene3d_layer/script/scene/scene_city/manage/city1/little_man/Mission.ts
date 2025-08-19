import { SoundManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../state/State"
import { state } from "../../../../../../type/StateType"
import { getFailSoundResourceId, isGiantessRoad } from "../../../CityScene"
import { getIsDebug } from "../../../../Scene"
import { Event } from "meta3d-jiehuo-abstract"
import { getMissionFailEventName } from "../../../../../../utils/EventUtils"
import { Camera } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"

export let getFinishDestroyedRate = (state: state) => {
    return 60
}

export let handleMissionFail = (state: state) => {
    if (Camera.isCanLock(getAbstractState(state))) {
        state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
    }
    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getFailSoundResourceId(), getIsDebug(state), 1, false)))

    return Event.trigger<state>(state, getAbstractState, getMissionFailEventName(), null)
}