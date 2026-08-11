import { NullableUtils } from "meta3d-jiehuo-abstract"
import { attackTarget, secondUnit } from "../type/StateType"
import { state } from "../../../../type/StateType"
import { getAttackTarget, getCampExn, getIsNotAttackLittleManTime, setAttackTarget, setIsNotAttackLittleManTime } from "../manage/city1/Army"
import { isLevelGiantessExceptPlayer, isPlayerGoddess, isPlayerGirl, isWildGiantess, isPlayerGiantess, isEnemyGiantess, getCurrentUsedGirls } from "../girl/Girl"
import { isNearGirl, isVeryNearGirl } from "./CollisionUtils"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getPlayerCamp } from "./PlayerUtils"
import { getSceneChapter, isGiantessCharacterType, isGiantessCharacterTypeByUsedGirl, isLittleCharacterType } from "../CityScene"
import { getNow } from "../Time"
import { addBuff } from "../buff/Buff"
import { buffName } from "../data/buff/BuffData"
import { getName } from "../little_man/LittleMan"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getAllFlattenAliveArmyData } from "./ArmyUtils"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getClickLargeSoundResourceId } from "../../../../../business_layer/Loader"
import { getIsDebug } from "../../Scene"
import { getOriginSystemVolume } from "./SoundUtils"
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType"
import { updateAttackTarget as updateAttackTargetMod } from "../../../../mod/SceneMod"
import { clearTarget, isLittleManTarget } from "../behaviour_tree/BehaviourTreeManager"
import { getIsControlledUnitCanAttack } from "../build/Career"
import { isBreastControlledState, isControlledStateExceptStressing, isGiantessControlledState, isPickedControlledState, isShoeControlledState, isUBControlledState } from "./FSMStateUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getIsControlledData } from "../girl/PickPoseUtils"

export let hasAttackTarget = (attackTarget_) => {
    return !NullableUtils.isNullable(attackTarget_)
        && NullableUtils.getExn(attackTarget_) !== attackTarget.None
}

export let isNotAttackLittleMan = (state: state) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(time => {
            return true
        }, getIsNotAttackLittleManTime(state)),
        false
    )
}

// let _updateAttackTargetForGiantess = (state, name, position, rate) => {
//     let attackTarget_
//     if (isEnemyGiantess(state, usedGirl)) {
//         attackTarget_ = attackTarget.LittleMan
//     }
//     else {
//         attackTarget_ = getAttackTarget(state, name)

//         if (isNotAttackLittleMan(state)) {
//             attackTarget_ = attackTarget.Giantess
//         }
//         else {
//             if (hasAttackTarget(attackTarget_)) {
//                 return state
//             }

//             if (
//                 (isVeryNearGirl(state, position) && NumberUtils.isRandomRate(
//                     // NumberUtils.getRandomFloat(0.3, 1)
//                     rate
//                 )
//                 )
//                 // || isNotAttackLittleMan(state)
//             ) {
//                 attackTarget_ = attackTarget.Giantess
//             }
//             else {
//                 attackTarget_ = attackTarget.LittleMan
//             }
//         }
//     }

//     return setAttackTarget(state, name, attackTarget_)
// }

export let getPlayerAttackTarget = (state: state) => {
    if (isLittleCharacterType(state)) {
        return attackTarget.LittleMan
    }

    // // if (!isGiantessCharacterType(state)) {
    // if (!isGiantessCharacterType(state)) {
    //     // throw new Error("should be player girl")
    //     return attackTarget.None
    // }

    return attackTarget.Giantess
}

export let updateAttackTarget = (state: state, name, position, box, meleeRange, stateMachine) => {
    let camp_ = getCampExn(state, name)

    if (getIsControlledUnitCanAttack(state) && isGiantessControlledState(stateMachine)
        && isGiantessCharacterTypeByUsedGirl(state, TupleUtils.getTuple2Last(getIsControlledData(state, name)))

    ) {
        return setAttackTarget(state, name, attackTarget.Giantess)
    }

    return updateAttackTargetMod(state, getSceneChapter(state), name, position, box, meleeRange, camp_)
}

let _getClearHatredBuffTime = (): secondUnit => 30

export let useClearHatredProp = (state: state) => {
    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getClickLargeSoundResourceId(), getIsDebug(state), getOriginSystemVolume(state))
    ))

    // state = getAllFlattenAliveArmyData(state).reduce((state, { name }) => {
    //     return setAttackTarget(state, name, attackTarget.None)
    // }, state)

    state = setIsNotAttackLittleManTime(state, NullableUtils.return_(getNow(state)))


    state = ArrayUtils.reduce(getCurrentUsedGirls(state), (state, usedGirl) => {
        if (isLittleManTarget(state, usedGirl)) {
            state = clearTarget(state, usedGirl)
        }

        return state
    }, state)

    return addBuff(state, buffName.ClearHatred, getName(), NullableUtils.getEmpty(), _getClearHatredBuffTime(), 1, characterType.LittleMan)
}

export let getNotAttackLittleManRemainTime = (state: state): secondUnit => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(time => {
            return NumberUtils.lessThan(_getClearHatredBuffTime() - Math.round((getNow(state) - time) / 1000), _getClearHatredBuffTime())
        }, getIsNotAttackLittleManTime(state)),
        0
    )
}