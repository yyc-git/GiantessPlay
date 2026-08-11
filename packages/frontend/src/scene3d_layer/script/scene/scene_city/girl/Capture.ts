import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getGiantessCharacters, setGiantessCharacters } from "../character/Character"
import { getCurrentMMDCharacterName, hasCurrentMMDCharacterByUsedGirl, setCurrentMMDCharacterByUsedGirl } from "./Girl"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getCaptureSuccessResourceId, getSceneChapter } from "../CityScene"
import { getIsDebug } from "../../Scene"
import { getSystemVolume } from "../utils/SoundUtils"
import { usedGirlEnum } from "../type/StateType"

export let isCanCapture = (state: state, mmdCharacter) => {
    // return getSceneChapter(state) == scene.Play && NullableUtils.isNullable(getGiantessCharacters(state).find(c => {
    return NullableUtils.isNullable(getGiantessCharacters(state).find(c => {
        return c.mmdCharacter == mmdCharacter
    }))
}

export let handleCapture = (state: state, mmdCharacter) => {
    state = setGiantessCharacters(state,
        getGiantessCharacters(state).push({
            mmdCharacter,
            isAlive: true
        })
    )

    if (!hasCurrentMMDCharacterByUsedGirl(state, usedGirlEnum.PlayerGirl)) {
        state = setCurrentMMDCharacterByUsedGirl(state, mmdCharacter, usedGirlEnum.PlayerGirl)
    }

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getCaptureSuccessResourceId(), getIsDebug(state), getSystemVolume(state))
    ))

    return state
}