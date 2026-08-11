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
import { getGetCoinResourceId } from "../CityScene"
import { _getState } from "../LittleManCamera"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getNow } from "../Time"
import { isUseFullHpReplaceCoinCharacterTypes, setHpConvertFromTotalCoin } from "../../../../mod/CareerMod"

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();

let _handleCoinHit = (state: state, handleFunc) => {
    state = addCoinInLevel(state, 1)

    // let hitPositionVec = computeHitPosition(position, pointBox, direction, 0.8)

    if (_isCanPlayCoinHitSound(state)) {
        state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
            SoundManager.buildNeedToPlaySoundData(getGetCoinResourceId(), getIsDebug(state), getSystemVolume(state))
        ))
        state = setLastCoinHitTime(state, getNow(state))
    }

    // state = emitShellEmitOrExplode(state,
    //     hitPositionVec.toArray(),
    //     explodeSize.Big)

    return handleFunc(state).then(TupleUtils.getTuple2First)

}

export let handleCoinHitGirl = (state: state, handleFunc, usedGirl, position,
    pointBox: Box3,
    direction: [number, number, number]
) => {
    return _handleCoinHit(state, handleFunc)
}

export let handleCoinHitLittleMan = (state: state, handleFunc, position,
    pointBox: Box3,
    direction: [number, number, number]
) => {
    return _handleCoinHit(state, handleFunc)
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

export let getRealLevelCoin = (state: state) => {
    return getRewardState(state).levelCoin
}

export let getLevelCoin = (state: state) => {
    // return getRewardState(state).levelCoin
    return Math.floor(getRealLevelCoin(state))
}

export let setLevelCoin = (state: state, value) => {
    return setRewardState(state, {
        ...getRewardState(state),
        levelCoin: value
    })
}

export let setTotalCoin = (state: state, totalCoin) => {
    if (isUseFullHpReplaceCoinCharacterTypes(state)) {
        return setHpConvertFromTotalCoin(state, totalCoin)
    }

    return setRewardState(state, {
        ...getRewardState(state),
        coin: totalCoin - getLevelCoin(state)
    })
}

// export let getCoin = (state: state) => {
//     return getRewardState(state).coin
// }

export let setCoin = (state: state, coin) => {
    if (coin < 0) {
        // throw new Error(`coin shouldn't be negative, but is ${coin}`)
        console.warn(`coin shouldn't be negative, but is ${coin}`)
        coin = 0
    }

    return setRewardState(state, {
        ...getRewardState(state),
        coin: coin
    })
}

export let addCoinInLevel = (state: state, coin) => {
    // if (coin < 0) {
    //     throw new Error(`coin shouldn't be negative, but is ${coin}`)
    // }

    // return setRewardState(state, {
    //     ...getRewardState(state),
    //     coin: getRewardState(state).coin + coin
    // })

    return setRewardState(state, {
        ...getRewardState(state),
        // levelCoin: getRewardState(state).levelCoin + computeCoinByCoinFactor(coin, state),
        levelCoin: getRewardState(state).levelCoin + coin,
    })
}

let _isCanPlayCoinHitSound = (state: state) => {
    return getNow(state) - NullableUtils.getWithDefault(
        getRewardState(state).lastCoinHitTime,
        0
    ) > 500
}

export let setLastCoinHitTime = (state: state, time) => {
    return setRewardState(state, {
        ...getRewardState(state),
        lastCoinHitTime: NullableUtils.return_(time)
    })
}