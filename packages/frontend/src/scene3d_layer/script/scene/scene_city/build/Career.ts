import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { career, secondUnit } from "../type/StateType"
import { getBuildState, setBuildState } from "./Build"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { careerFeatureData, careerFeatureName, careerFeatureValue } from "../data/build/CareerFeatureData"
import { deapply, getDefaultBlockService } from "../../../../mod/CareerMod"
import { getNow, getPassTimeFromNow } from "../Time"
import { getModAPI } from "../Mod"
import { getStartNowForLevel } from "../manage/mission/Mission"
import { getCareerCache, setCareerCache } from "meta3d-jiehuo-abstract/src/storage/Storage"
import { setGem } from "../reward/Gem"
import { getTotalGem } from "../reward/RewardGenerator"
import { getBreastObjectTotalBoxVolume, getShoeObjectTotalBoxVolume, getUBObjectTotalBoxVolume } from "../girl/PickPoseUtils"
import { getBoxVolumn } from "../utils/Box3Utils"
import { getGirlBox } from "../girl/Utils"
import { NumberUtils } from "meta3d-jiehuo-abstract"
// import { getStartGameTimeForLevel } from "../manage/mission/Mission"

export let createData = (): career => {
    return {
        // littleManData: NullableUtils.getEmpty(),
        // giantessData: NullableUtils.getEmpty(),
        littleManData: [],
        giantessData: [],

        isUseFullHpReplaceCoinCharacterTypes: ArrayUtils.create(),
        lastTime: MutableRecordUtils.create(),
        ubCapacityFactor: 0,
        isControlledUnitCanAttack: false,
        enhenceByCarryLevel: 0,
        expFactor: MutableRecordUtils.create(),

        needGem: MutableRecordUtils.create(),
    }
}

export let getCareerData = (state: state, characterType_) => {
    switch (characterType_) {
        case characterType.LittleMan:
            return getBuildState(state).career.littleManData
        case characterType.Giantess:
            return getBuildState(state).career.giantessData
        default:
            // return NullableUtils.getEmpty<any>()
            return []
    }
}

export let getAllCareerFeatureData = (state: state, characterType_): Record<
    careerFeatureName, careerFeatureValue
> => {
    return ArrayUtils.reduce(
        // NullableUtils.getWithDefault(getCareerData(state, characterType_), []),
        getCareerData(state, characterType_),
        (result, data) => {
            return MutableRecordUtils.concat(
                result,
                data.getCareerFeatureData(state)
            )
        },
        MutableRecordUtils.create()
    )
}

export let isUseCareer = (state: state, characterType_, name) => {
    // return NullableUtils.getWithDefault(
    //     NullableUtils.map(data => data.name == name,
    //         getCareerData(state, characterType_)
    //     ),
    //     false
    // )
    return !NullableUtils.isNullable(getCareerData(state, characterType_).find(data => data.name == name))
}

export let setSelectedCareerData = (state: state, characterType_, value) => {
    switch (characterType_) {
        case characterType.LittleMan:
            return setBuildState(state, {
                ...getBuildState(state),
                career: {
                    ...getBuildState(state).career,
                    littleManData: value
                }
            })
        case characterType.Giantess:
            return setBuildState(state, {
                ...getBuildState(state),
                career: {
                    ...getBuildState(state).career,
                    giantessData: value
                }
            })
        default:
            throw new Error("err")
    }
}


export let getIsUseFullHpReplaceCoinCharacterTypes = (state: state) => {
    return getBuildState(state).career.isUseFullHpReplaceCoinCharacterTypes
}

export let setIsUseFullHpReplaceCoinType = (state: state, characterType_) => {
    return setBuildState(state, {
        ...getBuildState(state),
        career: {
            ...getBuildState(state).career,
            isUseFullHpReplaceCoinCharacterTypes: ArrayUtils.push(
                getBuildState(state).career.isUseFullHpReplaceCoinCharacterTypes,
                characterType_
            )
        }
    })
}

export let getLastTime = (state: state, careerFeatureName, key) => {
    return NullableUtils.bind(map => {
        return MutableRecordUtils.get(map, key)
    }, MutableRecordUtils.get(getBuildState(state).career.lastTime, careerFeatureName))
}

export let getPassTime = (state: state, careerFeatureName, key): secondUnit => {
    return getPassTimeFromNow(state, getLastTime(state, careerFeatureName, key)) / 1000
}


export let setLastTime = (state: state, careerFeatureName, key, time) => {
    return setBuildState(state, {
        ...getBuildState(state),
        career: {
            ...getBuildState(state).career,
            lastTime: MutableRecordUtils.set(getBuildState(state).career.lastTime, careerFeatureName,
                MutableRecordUtils.set(
                    NullableUtils.getWithDefault(
                        MutableRecordUtils.get(getBuildState(state).career.lastTime, careerFeatureName),
                        MutableRecordUtils.create()
                    ),
                    key,
                    time
                )
            )
        }
    })
}

export let getNeedGem = (state: state, characterType_) => {
    return MutableRecordUtils.getWithDefault(
        getBuildState(state).career.needGem,
        characterType_,
        0
    )
}

export let setNeedGem = (state: state, characterType_, value) => {
    return setBuildState(state, {
        ...getBuildState(state),
        career: {
            ...getBuildState(state).career,
            needGem: MutableRecordUtils.set(
                getBuildState(state).career.needGem,
                characterType_,
                // MutableRecordUtils.getWithDefault(
                //     getBuildState(state).career.needGem,
                //     characterType_,
                //     0
                // ) + value
                value
            )
        }
    })
}


export let dispose = (state: state): Promise<state> => {
    // return ArrayUtils.reducePromise<state, careerFeatureData>(
    //     MutableRecordUtils.toArray(
    //         NullableUtils.getExn(getBuildState(state).career.littleManData).getCareerFeatureData(state)
    //     ).concat(
    //         MutableRecordUtils.toArray(
    //             NullableUtils.getExn(getBuildState(state).career.giantessData).getCareerFeatureData(state)
    //         )
    //     ), (state, data) => {
    //         return NullableUtils.getWithDefault(
    //             NullableUtils.map(deapplyFunc => {
    //                 return deapplyFunc(state, data.characterType, data.name)
    //             }, data.deapplyFunc),
    //             Promise.resolve(state)
    //         )
    //     }, state
    // )
    return deapply(state).then(state => {
        return setBuildState(state, {
            ...getBuildState(state),
            career: createData()
        })
    })
}


export let generateKey = () => Math.random()

export let setDefaultCareer = (state: state) => {
    let d = getDefaultBlockService(state).getCareerData(getModAPI(state), state)
    state = setSelectedCareerData(state, characterType.LittleMan, [d])
    state = setSelectedCareerData(state, characterType.Giantess, [d])
    return state
}

let _buildCareerUpdateKey = () => "_buildCareerUpdateKey"

export let getCareerNeedTotalGem = () => {
    return getCareerCache(_buildCareerUpdateKey())
}

export let getCareerNeedTotalGemFromBackend = (state: state) => {
    return getCareerNeedTotalGem().then(needTotalGem => {
        return removeCareerNeedTotalGem().then(_ => {
            return NullableUtils.getWithDefault(
                NullableUtils.map(needTotalGem => {
                    return setGem(state, getTotalGem(state) + needTotalGem)
                }, needTotalGem),
                state
            )
        })
    })
}

export let saveCareerNeedTotalGem = (needTotalGem) => {
    return setCareerCache(_buildCareerUpdateKey(), needTotalGem)
}

export let saveAddedCareerNeedTotalGem = (needTotalGem) => {
    return getCareerNeedTotalGem().then(value => {
        return setCareerCache(_buildCareerUpdateKey(), NullableUtils.getWithDefault(value, 0) + needTotalGem)
    })
}

export let removeCareerNeedTotalGem = () => {
    return setCareerCache(_buildCareerUpdateKey(), NullableUtils.getEmpty())
}


export let getUBCapacityFactor = (state: state) => {
    return getBuildState(state).career.ubCapacityFactor
}

export let setUBCapacityFactor = (state: state, value) => {
    return setBuildState(state, {
        ...getBuildState(state),
        career: {
            ...getBuildState(state).career,
            ubCapacityFactor: value
        }
    })
}

export let getIsControlledUnitCanAttack = (state: state) => {
    return getBuildState(state).career.isControlledUnitCanAttack
}

export let setIsControlledUnitCanAttack = (state: state, value) => {
    return setBuildState(state, {
        ...getBuildState(state),
        career: {
            ...getBuildState(state).career,
            isControlledUnitCanAttack: value
        }
    })
}

export let getEnhenceByCarryLevel = (state: state) => {
    return getBuildState(state).career.enhenceByCarryLevel
}

export let setEnhenceByCarryLevel = (state: state, value) => {
    return setBuildState(state, {
        ...getBuildState(state),
        career: {
            ...getBuildState(state).career,
            enhenceByCarryLevel: value
        }
    })
}

export let computeEnhenceValueByCarryLevel = (state: state, usedGirl, factor, maxValue) => {
    let level = getEnhenceByCarryLevel(state)

    let currentVolumn = getUBObjectTotalBoxVolume(state, usedGirl) + getBreastObjectTotalBoxVolume(state, usedGirl) + getShoeObjectTotalBoxVolume(state, usedGirl)
    let volumnRatio = currentVolumn / getBoxVolumn(getGirlBox(state, usedGirl))

    return NumberUtils.lessThan(volumnRatio * level * factor, maxValue)
}

export let getExpFactor = (state: state, characterType) => {
    return MutableRecordUtils.getWithDefault(getBuildState(state).career.expFactor, characterType, 0)
}

export let setExpFactor = (state: state, characterType, value) => {
    return setBuildState(state, {
        ...getBuildState(state),
        career: {
            ...getBuildState(state).career,
            expFactor: MutableRecordUtils.set(getBuildState(state).career.expFactor, characterType, value)
        }
    })
}
