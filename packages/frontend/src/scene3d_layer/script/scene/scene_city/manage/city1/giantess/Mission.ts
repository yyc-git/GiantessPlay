import { SoundManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../state/State"
import { state } from "../../../../../../type/StateType"
import { getCelebrateSoundResourceId, getFailSoundResourceId, getLevelNumber, getSceneChapter, isGiantessRoad } from "../../../CityScene"
import { getIsDebug } from "../../../../Scene"
import { Event } from "meta3d-jiehuo-abstract"
import { getMissionCompleteEventName, getMissionFailEventName } from "../../../../../../utils/EventUtils"
import { Camera } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { setData } from "../../../../../LevelComplete"

export let getFinishDestroyedRate = (state: state) => {
    return 50
}

export let handleMissionComplete = (state: state) => {
    if (Camera.isCanLock(getAbstractState(state))) {
        state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
    }

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getCelebrateSoundResourceId(), getIsDebug(state), 1, false)))

    return setData(getSceneChapter(state), getLevelNumber(state)).then(_ => {
        return Event.trigger<state>(state, getAbstractState, getMissionCompleteEventName(), null)
    })
}
