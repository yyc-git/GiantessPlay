import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { mission, missionFinishStatus } from "../../type/StateType"
import { getCelebrateSoundResourceId, getFailSoundResourceId, getLevelNumber, getSceneChapter, getState, isGiantessCharacterType, markIsMustStopLoop, setState } from "../../CityScene"
import { ensureCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { getIsDebug } from "../../../Scene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../state/State"
import { buildMissionFinishEventData, getCloseAllUIEventName, getLevelStatusUpdateEventName, getMissionCompleteEventName, getMissionEndEventName, getMissionFailEventName, getMissionFinishEventName } from "../../../../../utils/EventUtils"
import moment from 'moment'
import { SoundManager } from "meta3d-jiehuo-abstract"
import { Camera } from "meta3d-jiehuo-abstract"
// import { Device } from "meta3d-jiehuo-abstract"
// import { buildLevelStatusUpdateEventData } from "../../utils/EventUtils"
// import * as GiantessMission from "./giantess/Mission"
// import * as LittleManMission from "./little_man/Mission"
// import { getAllAliveArmyCount, isGenerateComplete } from "./generator/ArmyGenerator"
import { Flow } from "meta3d-jiehuo-abstract"
import { List } from "immutable"
import { scene } from "../../../../../../ui_layer/global/store/GlobalStoreType"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { restoreWhenUpdateRewardWhenMissionFinishError, updateRewardAfterMissionWait, updateRewardWhenMissionFinish } from "../../reward/RewardGenerator"
// import { updateCharacterWhenMissionFinish } from "../../character/Character"
import { updateAutoDifficultyWhenMissionFinish } from "../../difficulty/DifficultyUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { getNow, getSepcialTimeDuration, updateGameTime, updateWholeGameTime } from "../../Time"
import { getLanguageTextData, languageKey } from "../../../../../internation/Data"
import { handleNetworkRequest } from "../../../../../../ui_layer/utils/BackendUtils"
import { getOriginSystemVolume } from "../../utils/SoundUtils"
import { updateCharacterBackend, updateCharacterWhenNotAlive } from "../../character/Character"
import { getActualLevelGem } from "../../reward/Gem"
import { getLevelCoin } from "../../reward/Coin"

export let getMissionState = (state: state) => {
    return NullableUtils.getExn(getState(state).mission)
}

export let setMissionState = (state: state, taskState: mission) => {
    return setState(state, {
        ...getState(state),
        mission: NullableUtils.return_(taskState)
    })
}

export let createState = (): mission => {
    return {
        startGameTimeForLevel: moment(),
        startGameTimeForWhole: moment(),
        isMissionFinish: false,
        allBuildingCount: 0,
        destroyedBuildingCount: 0,

        startNowForLevel: 0,

        lastDestroyedRate: 0,
        isEnteringNextLevel: false,
        completeLevelData: List(),
        applyFuncsForNextLevel: List(),

        doorImage: NullableUtils.getEmpty(),
        // isWaiting: false,
        isShowEnterDoorToast: false,

        lockedAttackTargetToPlayer: NullableUtils.getEmpty(),
    }
}

export let getIsMissionFinish = (state) => {
    return getMissionState(state).isMissionFinish
}

export let setIsMissionFinish = (state, value) => {
    return setMissionState(state, {
        ...getMissionState(state),
        isMissionFinish: value
    })
}

export let hasDoorImage = (state) => {
    return !NullableUtils.isNullable(getMissionState(state).doorImage)
}

export let getDoorImageExn = (state) => {
    return NullableUtils.getExn(getMissionState(state).doorImage)
}

export let setDoorImage = (state, value) => {
    return setMissionState(state, {
        ...getMissionState(state),
        doorImage: NullableUtils.return_(value)
    })
}

// export let getIsWaiting = (state) => {
//     return getMissionState(state).isWaiting
// }

// export let setIsWaiting = (state, value) => {
//     return setMissionState(state, {
//         ...getMissionState(state),
//         isWaiting: value
//     })
// }

export let getIsShowEnterDoorToast = (state) => {
    return getMissionState(state).isShowEnterDoorToast
}

export let setIsShowEnterDoorToast = (state, value) => {
    return setMissionState(state, {
        ...getMissionState(state),
        isShowEnterDoorToast: value
    })
}


export let addBuilding = (state: state) => {
    return setMissionState(state, {
        ...getMissionState(state),
        allBuildingCount: getMissionState(state).allBuildingCount + 1
    })
}

export let addDestroyedBuilding = (state: state) => {
    return setMissionState(state, {
        ...getMissionState(state),
        destroyedBuildingCount: getMissionState(state).destroyedBuildingCount + 1
    })
}

export let getDestroyedRate = (state: state) => {
    let { allBuildingCount, destroyedBuildingCount } = getMissionState(state)

    let value = allBuildingCount == 0 ? 0 : destroyedBuildingCount / allBuildingCount

    value = Math.floor(NumberUtils.getDecimal(value, 2) * 100)

    return ensureCheck(value, value => {
        test("should between [0, 100]", () => {
            return NumberUtils.between(value, 0, 100)
        })
    }, getIsDebug(state))
}

export let getStartNowForLevel = (state) => {
    return getMissionState(state).startNowForLevel
}


export let initWhenImportScene = (state: state) => {
    state = setMissionState(state, {
        ...getMissionState(state),
        startGameTimeForLevel: moment(),
        startNowForLevel: getNow(state)
    })

    return Promise.resolve(state)
}

export let initAfterImportScene = (state: state) => {
    if (!isEnteringNextLevel(state)) {
        state = setMissionState(state, {
            ...getMissionState(state),
            completeLevelData: List(),
            startGameTimeForWhole: moment(),
        })
    }

    state = markIsEnteringNextLevel(state, false)

    return state
}

// export let getLevelNow = (state: state) => {
//     return getNow(state) - getMissionState(state).startGameTimeForLevel.milliseconds()
// }

// export let getStartGameTimeForLevel = (state: state) => {
//     return getMissionState(state).startGameTimeForLevel.milliseconds()
// }


export let getGameTime = (state) => {
    // return moment.duration(moment().diff(getMissionState(state).startGameTimeForLevel))
    return updateGameTime(state, moment.duration(moment().diff(getMissionState(state).startGameTimeForLevel)))
}

export let getGameTimeIncludeSpecialTime = (state) => {
    // return moment.duration(moment().diff(getMissionState(state).startGameTimeForLevel))
    return updateWholeGameTime(state, moment.duration(moment().diff(getMissionState(state).startGameTimeForLevel)))
}

export let getSpecialTime = (state) => {
    // return updateSpecialTime(state, moment.duration())
    // return updateSpecialTime(state, moment.duration(moment().diff(getMissionState(state).startGameTimeForLevel)))
    return moment.duration(getSepcialTimeDuration(state) * 1000)
}

let _getWholeGameTime = (state) => {
    return updateWholeGameTime(state, moment.duration(moment().diff(getMissionState(state).startGameTimeForWhole)))
}

export let getGameTimeIncludeSpecialTimeMinutes = (state) => {
    return getGameTimeIncludeSpecialTime(state).asMinutes()
}

// export let getGameTimeMinutes = (state) => {
//     return getGameTime(state).asMinutes()
// }


export let getWholeGameTimeMinutes = (state) => {
    return _getWholeGameTime(state).asMinutes()
}

export let getGameTimeString = (state): string => {
    let value = getGameTime(state)

    return `${value.hours()}${getLanguageTextData(state, languageKey.Hour)}${value.minutes()}${getLanguageTextData(state, languageKey.Minute)}${value.seconds()}${getLanguageTextData(state, languageKey.Second)}`
}

export let getWholeGameTimeString = (state) => {
    let value = _getWholeGameTime(state)

    return `${value.hours()}${getLanguageTextData(state, languageKey.Hour)}${value.minutes()}${getLanguageTextData(state, languageKey.Minute)}${value.seconds()}${getLanguageTextData(state, languageKey.Second)}`
}

export let handleMissionComplete = (state: state, deferTime) => {
    state = setIsMissionFinish(state, true)

    state = setMissionState(state, {
        ...getMissionState(state),
        completeLevelData: getMissionState(state).completeLevelData.push(
            {
                sceneChapter: getSceneChapter(state),
                levelNumber: getLevelNumber(state)
            }
        )
    })

    // if (isGiantessCharacterType(state)) {

    return Promise.resolve(setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
        return _handleMissionComplete(state, updateRewardWhenMissionFinish)
    }, deferTime)))
    // }
}

export let handleMissionFail = (state: state, missionFinishStatus_) => {
    state = setIsMissionFinish(state, true)

    return _handleMissionFail(state, missionFinishStatus_)
}

export let handleMissionEnd = (state: state) => {
    state = setIsMissionFinish(state, true)

    return _handleMissionEnd(state)
}


export let restoreToWait = (state: state) => {
    state = setIsMissionFinish(state, true)
    // state = setIsWaiting(state, true)

    state = setAbstractState(state, Flow.startLoop(getAbstractState(state)))
    state = markIsMustStopLoop(state, false)

    return state
}

export let handleMissionCompleteAfterWait = (state: state) => {
    // state = setIsWaiting(state, false)

    return _handleMissionComplete(state, updateRewardAfterMissionWait)
}

export let checkEnterDoorAfterWait = (state: state) => {
    // state = setIsWaiting(state, false)

    return state
}

export let dispose = (state: state) => {
    state = setMissionState(state, {
        ...createState(),
        isEnteringNextLevel: getMissionState(state).isEnteringNextLevel,
        completeLevelData: getMissionState(state).completeLevelData,
        applyFuncsForNextLevel: getMissionState(state).applyFuncsForNextLevel,
        startGameTimeForWhole: getMissionState(state).startGameTimeForWhole,
    })

    return Promise.resolve(state)
}

export let markIsEnteringNextLevel = (state: state, value) => {
    return setMissionState(state, {
        ...getMissionState(state),
        isEnteringNextLevel: value
    })
}

export let isEnteringNextLevel = (state: state) => {
    return getMissionState(state).isEnteringNextLevel
}


export let isCanEnterBossLevel = (state: state) => {
    // return getSceneChapter(state) !== scene.Biwu && getMissionState(state).completeLevelData.filter(d => d.sceneChapter == scene.Play).count() >= 2
    // return getSceneChapter(state) !== scene.Biwu && getMissionState(state).completeLevelData.filter(d => d.sceneChapter == scene.Play).count() >= 1

    // return getMissionState(state).completeLevelData.filter(d => d.sceneChapter == scene.Play).count() >= 1
    if (getIsDebug(state)) {
        return true
    }

    return getMissionState(state).completeLevelData.filter(d => d.sceneChapter != scene.Biwu).count() >= 1
}

let _handleMissionFinish = (state: state, updateRewardFunc, missionFinishStatus_: missionFinishStatus, eventName) => {
    state = setAbstractState(state, Flow.stopLoop(getAbstractState(state)))
    state = markIsMustStopLoop(state, true)

    if (Camera.isCanLock(getAbstractState(state))) {
        state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
    }

    return Event.trigger<state>(state, getAbstractState, getMissionFinishEventName(), buildMissionFinishEventData(missionFinishStatus_))
        .then(state => {
            writeState(state)

            // let levelGem = getActualLevelGem(state)
            // let levelCoin = getLevelCoin(state)

            // switch (missionFinishStatus_) {
            //     case missionFinishStatus.Fail:
            //         state = updateCharacterWhenNotAlive(state)
            //         break
            // }

            // state = updateAutoDifficultyWhenMissionFinish(state, missionFinishStatus_)

            // // return Event.trigger<state>(state, getAbstractState, getCloseAllUIEventName(), null)
            // //     .then(state => {
            // //         return Event.trigger<state>(state, getAbstractState, eventName, null)
            // //     })
            // return Event.trigger<state>(state, getAbstractState, eventName, null)


            return handleNetworkRequest(state => {
                return updateRewardFunc(state)
                    //     // .then(state => updateCharacterWhenMissionFinish(state, missionFinishStatus))

                    .then(state => {
                        switch (missionFinishStatus_) {
                            case missionFinishStatus.FailByDestoyed:
                                return Promise.resolve(state)
                            default:
                                return updateCharacterBackend(state)
                        }
                    })
                    .then(writeState)
            }, state => {
                state = updateAutoDifficultyWhenMissionFinish(state, missionFinishStatus_)

                return Event.trigger<state>(state, getAbstractState, getCloseAllUIEventName(), null)
                    .then(state => {
                        return Event.trigger<state>(state, getAbstractState, eventName, null)
                    })
            }, state => {
                state = restoreWhenUpdateRewardWhenMissionFinishError(state)

                return Promise.resolve(state)
            })
        })
}

let _handleMissionComplete = (state: state, updateRewardFunc) => {
    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getCelebrateSoundResourceId(), getIsDebug(state), getOriginSystemVolume(state), false)))

    return _handleMissionFinish(state, updateRewardFunc, missionFinishStatus.Complete, getMissionCompleteEventName())
}

let _handleMissionFail = (state: state, missionFinishStatus_) => {
    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getFailSoundResourceId(), getIsDebug(state), getOriginSystemVolume(state), false)))

    return _handleMissionFinish(state, updateRewardWhenMissionFinish, missionFinishStatus_, getMissionFailEventName())
}

let _handleMissionEnd = (state: state) => {
    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getCelebrateSoundResourceId(), getIsDebug(state), getOriginSystemVolume(state), false)))

    return _handleMissionFinish(state, updateRewardWhenMissionFinish, missionFinishStatus.End, getMissionEndEventName())
}

export let findPreviousBossLevelNumber = (state: state): nullable<number> => {
    let count = getMissionState(state).completeLevelData.count()

    if (count == 0) {
        return NullableUtils.getEmpty()
    }

    for (let i = count - 1; i >= 0; i--) {
        let data = NullableUtils.getExn(getMissionState(state).completeLevelData.get(i))
        if (data.sceneChapter == scene.Biwu) {
            return data.levelNumber
        }
    }

    return NullableUtils.getEmpty()
}

export let applyFuncs = (state: state) => {
    return ArrayUtils.reducePromise(
        getMissionState(state).applyFuncsForNextLevel.toArray(),
        (state, func) => {
            return func(state)
        },
        state
    ).then(state => {
        return setMissionState(state, {
            ...getMissionState(state),
            applyFuncsForNextLevel: List()
        })
    })
}

export let addApplyFuncForNextLevel = (state, func) => {
    return setMissionState(state, {
        ...getMissionState(state),
        applyFuncsForNextLevel: getMissionState(state).applyFuncsForNextLevel.push(func)
    })
}




export let getLockedAttackTargetToPlayer = (state) => {
    return getMissionState(state).lockedAttackTargetToPlayer
}

export let setLockedAttackTargetToPlayer = (state, value) => {
    return setMissionState(state, {
        ...getMissionState(state),
        lockedAttackTargetToPlayer: value
    })
}