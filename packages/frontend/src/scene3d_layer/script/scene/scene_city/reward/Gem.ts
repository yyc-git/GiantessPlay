import { SoundManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { state } from "../../../../type/StateType"
import { Box3, Vector3 } from "three"
import { getSystemVolume, getVolume } from "../utils/SoundUtils"
import { getIsDebug } from "../../Scene"
import { computeHitPosition } from "../utils/WeaponUtils"
import { armorPiercingForceRatio, critRatio, emitSpeed, emitterCollisionSize, emitterCount, emitterLife, emitterSize, emitterSpeed, emitterVolume, explodeRange, weaponName, weaponType, weaponValue } from "../data/ValueType"
import { forceSize } from "../data/DataType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getRewardState, setRewardState } from "./RewardGenerator"
import { getGetGemResourceId } from "../CityScene"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getNow } from "../Time"
import { computeActiveGemFactor, computeGemFactor, getCurrentDifficultyData } from "../difficulty/Difficulty"
import { isActive } from "../User"

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();

let _handleGemHit = (state: state, handleFunc) => {
    state = addGemInLevel(state, 1)


    // let hitPositionVec = computeHitPosition(position, pointBox, direction, 0.8)

    if (_isCanPlayGemHitSound(state)) {
        state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
            SoundManager.buildNeedToPlaySoundData(getGetGemResourceId(), getIsDebug(state), getSystemVolume(state))
        ))
        state = setLastGemHitTime(state, getNow(state))
    }


    // state = emitShellEmitOrExplode(state,
    //     hitPositionVec.toArray(),
    //     explodeSize.Big)

    return handleFunc(state).then(TupleUtils.getTuple2First)
}

export let handleGemHitGirl = (state: state, handleFunc, usedGirl, position,
    pointBox: Box3,
    direction: [number, number, number]
) => {
    return _handleGemHit(state, handleFunc)
}

export let handleGemHitLittleMan = (state: state, handleFunc, position,
    pointBox: Box3,
    direction: [number, number, number]
) => {
    return _handleGemHit(state, handleFunc)
}



export let getName = () => {
    return weaponName.Other
}


export let getValue = (state: state): weaponValue => {
    return {
        force: forceSize.RewardForce,
        armorPiercingForceRatio: armorPiercingForceRatio.None,
        type: weaponType.Magic,

        emitSpeed: emitSpeed.Middle,
        critRatio: critRatio.Zero,
        explodeRange: explodeRange.Zero,


        emitterSpeed: emitterSpeed.VeryFast,
        emitterLife: emitterLife.VeryLong,
        emitterSize: emitterSize.Middle,
        emitterCollisionSize: emitterCollisionSize.VeryBig3,
        emitterVolume: emitterVolume.Big,
        emitterCount: emitterCount.One,

        meleeRange: NullableUtils.getEmpty(),
    }
}

export let getLevelGem = (state: state) => {
    return getRewardState(state).levelGem
}

export let getActualLevelGem = (state: state) => {
    return Math.round(getLevelGem(state) * computeGemFactor(state, getCurrentDifficultyData(state)) * computeActiveGemFactor(state))
}

export let setGem = (state: state, gem) => {
    if (gem < 0) {
        throw new Error(`gem shouldn't be negative, but is ${gem}`)
    }

    return setRewardState(state, {
        ...getRewardState(state),
        // gem: gem
        gem: Math.round(gem)
    })
}

export let addGemInLevel = (state: state, gem) => {
    // state = setGem(state, getRewardState(state).gem + gem)

    return setRewardState(state, {
        ...getRewardState(state),
        // gem: getRewardState(state).gem + gem,
        levelGem: getRewardState(state).levelGem + gem,
    })
}

// export let subGem = (state: state, gem) => {
//     return setRewardState(state, {
//         ...getRewardState(state),
//         gem: getRewardState(state).gem - gem
//     })
// }

let _isCanPlayGemHitSound = (state: state) => {
    return getNow(state) - NullableUtils.getWithDefault(
        getRewardState(state).lastGemHitTime,
        0
    ) > 500
}

export let setLastGemHitTime = (state: state, time) => {
    return setRewardState(state, {
        ...getRewardState(state),
        lastGemHitTime: NullableUtils.return_(time)
    })
}