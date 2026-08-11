import { Event } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { cameraType, state } from "../../../../../type/StateType"
import { getAnimationBlendDataParam, getBossCompleteSoundResourceId, getCharacterBloodResourceId, getCharacterShadowResourceId, getConfigData, getGirlScale, getLevelData, getLevelDataExn, getName, getScene, isLittleCharacterType, setBehaviourTreeData, setConfigData, setLevelData, setCharacterType } from "../../CityScene"
import { addCurrentUsedGirl, createUsedGirlData, getAllUsedMMDData, setUsedGirlData } from "../../girl/Girl"
import { littleManStrength, propName, propType, usedGirlEnum } from "../../type/StateType"
import * as MissionBiwu from "../biwu/Mission"
import { getDestroyedEventName, getGirlDestroyingEventName } from "../../utils/EventUtils"
import { markWhetherNotExecuteGiantessAI } from "../../behaviour_tree/BehaviourTreeManager"
import * as Mission from "../mission/Mission"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { isLittleMan } from "../../little_man/LittleMan"
import { setIsStopGameEvent } from "../../game_event/GameEvent"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../Scene"
import { setUsedMMDData } from "../../utils/MMDUtils"
import * as WholeScene from "../city1/WholeScene"
import * as MapWall from "../city1/MapWall"
import { initClothHpData } from "../../utils/ClothUtils"
import { hasLifeCount, isLifeCountWork } from "../../StaticDynamic"
import { createAllUsedGirlData, destroyedHandler, setCurrentMMDCharacter, updateUtils2 } from "../city1/ManageScene"
import { disposeAllData, isStatic } from "../../utils/OctreeObjectUtils"
import { getAllRandomUsedMMDData } from "../../data/biwu/MMDUtils"
import { isPicked, removePickData } from "../../girl/PickPoseUtils"
import { getUsedGirl } from "./Utils"
// import { initPlayerConfigDataForBossGiantessLevel } from "../../utils/PlayerUtils"


// let _setByDiffiuculty = (state: state) => {
//     let littleManStrength_
//     switch (getAutoDifficulty(state)) {
//         case autoDifficulty.VeryEasy:
//             littleManStrength_ = littleManStrength.High
//             break
//         case autoDifficulty.Easy:
//         case autoDifficulty.Middle:
//         case autoDifficulty.Hard:
//             littleManStrength_ = littleManStrength.Middle
//             break
//         case autoDifficulty.VeryHard:
//             littleManStrength_ = littleManStrength.Low
//             break
//     }
// state = setlimanst(state, littleManStrength_)

//     return state
// }

export let handleBeforeLoadResource = (state: state, getGirlValueFunc, getClothHpDataFunc, getAllRandomUsedMMDDataFunc) => {
    // state = _setByDiffiuculty(state)

    state = createAllUsedGirlData(state)


    // state = setCurrentUsedGirl(state, usedGirlEnum.BossGiantess)
    // state = addCurrentUsedGirl(state, usedGirlEnum.BossGiantess)

    state = setConfigData(state, {
        ...getConfigData(state),

        // girlValueMap: Mission.isEnteringNextLevel(state) ? getConfigData(state).girlValueMap : getConfigData(state).girlValueMap.set(
        //     usedGirlEnum.BossGiantess,
        //     getGirlValueFunc(state)
        // ),
        girlValueMap: getConfigData(state).girlValueMap.set(
            usedGirlEnum.BossGiantess,
            getGirlValueFunc(state)
        ),
    })

    // state = setConfigData(state, {
    //     ...getConfigData(state),
    //     clothHpDataMap: getConfigData(state).clothHpDataMap.set(usedGirlEnum.BossGiantess, getClothHpDataFunc(state)),
    // })

    let allUsedMMDData = getAllRandomUsedMMDDataFunc(state)

    state = initClothHpData(state, getClothHpDataFunc, allUsedMMDData)

    // state = initPlayerConfigDataForBossGiantessLevel(state)


    // state = setUsedGirlData(state, usedGirl,{
    //     ...getUsedGirlData(state, usedGirl),
    //     usedMMDData: getAllUsedMMDData(state)
    // })
    state = setUsedMMDData(state, allUsedMMDData)

    state = setCurrentMMDCharacter(state, allUsedMMDData)

    return state
}


export let update = (state: state): Promise<state> => {
    return MissionBiwu.update(state)
        .then(updateUtils2)
}

// let _destroyedHandler = (state: state, { userData }) => {
//     let { fromName, toName } = NullableUtils.getExn(userData)

//     if (isPicked(state, toName)) {
//         state = removePickData(state)
//     }

//     if (isStatic(state, toName)) {
//         state = disposeAllData(state, toName)

//         return Promise.resolve(state)
//     }

//     if (!hasLifeCount(state) && isLittleMan(toName)) {
//         return Mission.handleMissionFail(state)
//     }

//     return Promise.resolve(state)
// }

export let buildGirlDestroyingHandlerKey = (usedGirl) => `${usedGirl}_buildGirlDestroyingHandlerKey`

let _girlDestroyingHandler = (state: state, { userData }) => {
    let usedGirl = getUsedGirl()
    // state = markWhetherNotExecuteGiantessAI(state,usedGirl, true)

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getBossCompleteSoundResourceId(), getIsDebug(state), 1, false)))

    return getLevelDataExn<any>(state, buildGirlDestroyingHandlerKey(usedGirl))(state).then(state => {
        return setIsStopGameEvent(state, true)
    }).then(state => {
        return Mission.handleMissionComplete(state, 10)
    })
}


export let bindEvents = (state: state) => {
    state = setAbstractState(state, Event.on(getAbstractState(state), getDestroyedEventName(), destroyedHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getGirlDestroyingEventName(), _girlDestroyingHandler))

    return state
}

export let unbindEvents = (state: state) => {
    state = setAbstractState(state, Event.off(getAbstractState(state), getDestroyedEventName(), destroyedHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getGirlDestroyingEventName(), _girlDestroyingHandler))

    return state

}

export let initWhenImportScene = (state: state, sceneResourceId) => {
    // state = setDisabledProps(state, List([
    //     propName.BiggerBullet,
    //     propName.SmallerToLastBiggerCount,

    //     propName.Revive,
    // ]))

    return WholeScene.initWhenImportScene(state, sceneResourceId).then(
        MapWall.initWhenImportScene
    )
}
