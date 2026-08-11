import { state } from "../../../../../type/StateType"
import { funcData } from "../../data/FuncData"
import { usedGirl, usedGirlEnum } from "../../type/StateType"
import { actionName, armorRatio, armorStrength } from "../../data/DataType"
import { getNow } from "../../Time"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { setGirlScaleAndKeepCamera } from "../../girl/Girl"
import { getScale } from "../../girl/Utils"
// import { getAffectedUsedGirls } from "../../build/Talent"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { getPlayerUsedGirl } from "../../../../../mod/LevelGiantessMod"
import { getScaleRatio } from "../../girl/player/Girl"

let _setAttribute = (state: state, funcData: funcData, setFunc, usedGirl: usedGirl) => {
    if (!funcData.hasGirlValue(state, usedGirl)) {
        return state
    }

    state = funcData.setConfigData(state, {
        ...funcData.getConfigData(state),
        girlValueMap: funcData.getConfigData(state).girlValueMap.set(
            usedGirl,
            setFunc(funcData.getValueByUsedGirl(state, usedGirl))
        ),
    }
    )

    return state
}

export let setAttribute = (state: state, funcData: funcData, setFunc, usedGirl: usedGirl) => {
    // let affectedUsedGirls = getAffectedUsedGirls(state)

    // if (affectedUsedGirls.length > 0) {
    //     return ArrayUtils.reduce(affectedUsedGirls, (state, affectedUsedGirl) => {
    //         return _setAttribute(state, funcData, setFunc, affectedUsedGirl)
    //     }, state)
    // }

    return _setAttribute(state, funcData, setFunc, usedGirl)
}

export let setFullHp = (state: state, funcData: funcData, computeFunc, isSetToFullHp: boolean, usedGirl: usedGirl) => {
    if (!funcData.hasGirlValue(state, usedGirl)) {
        return state
    }

    state = setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            hp: NumberUtils.greaterThan(Math.round(
                computeFunc(
                    state,
                    // funcData.getValueByUsedGirl(state, usedGirl).hp
                    girlValue.hp
                ),
            ), 1)
        }
    }, usedGirl)

    state = funcData.initClothHpData(state, funcData.getGetClothHpDataFunc(state), funcData.getAllUsedMMDData(state))

    if (isSetToFullHp) {
        state = funcData.updateHpData(state, usedGirl)
    }

    return state
}

export let setLuck = (state: state, funcData: funcData, computeFunc, usedGirl: usedGirl) => {
    if (!funcData.hasGirlValue(state, usedGirl)) {
        return state
    }

    state = setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            luck: computeFunc(
                state,
                // funcData.getValueByUsedGirl(state, usedGirl).luck)
                girlValue.luck)
        }
    }, usedGirl)

    return state
}

export let setActionSpeedFactor = (state: state, funcData: funcData, computeFunc, usedGirl: usedGirl) => {
    if (!funcData.hasGirlValue(state, usedGirl)) {
        return state
    }

    state = setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            actionSpeedFactor: computeFunc(
                state,
                // funcData.getValueByUsedGirl(state, usedGirl).actionSpeedFactor)
                girlValue.actionSpeedFactor)
        }
    }, usedGirl)

    return state
}

export let setStressingRateFactor = (state: state, funcData: funcData, computeFunc, usedGirl: usedGirl) => {
    if (!funcData.hasGirlValue(state, usedGirl)) {
        return state
    }

    state = setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            stressingRateFactor: computeFunc(
                state,
                // funcData.getValueByUsedGirl(state, usedGirl).stressingRateFactor)
                girlValue.stressingRateFactor)
        }
    }, usedGirl)

    return state
}

export let increaseArmor = (state: state, funcData: funcData, level, usedGirl: usedGirl) => {
    if (!funcData.hasGirlValue(state, usedGirl)) {
        return state
    }

    state = setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            armorRatio: girlValue.armorRatio * (1 + 0.1 * level),
            armorStrength: girlValue.armorStrength * (1 + 0.1 * level),
        }
    }, usedGirl)

    return state
}

export let setCritRatioFactor = (state: state, funcData: funcData, computeFunc, usedGirl: usedGirl) => {
    if (!funcData.hasGirlValue(state, usedGirl)) {
        return state
    }

    state = setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            critRatioFactor: computeFunc(
                state,
                // funcData.getValueByUsedGirl(state, usedGirl).critRatioFactor)
                girlValue.critRatioFactor)
        }
    }, usedGirl)

    return state
}


export let setRestoreHpTime = (state: state, funcData: funcData, computeFunc, usedGirl: usedGirl) => {
    if (!funcData.hasGirlValue(state, usedGirl)) {
        return state
    }

    state = setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            restoreHpTime: computeFunc(
                state,
                // funcData.getValueByUsedGirl(state, usedGirl).restoreHpTime)
                girlValue.restoreHpTime)
        }
    }, usedGirl)

    return state
}

export let setRestoreHpSpeedRate = (state: state, funcData: funcData, computeFunc, usedGirl: usedGirl) => {
    if (!funcData.hasGirlValue(state, usedGirl)) {
        return state
    }

    state = setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            restoreHpSpeedRate: computeFunc(
                state,
                // funcData.getValueByUsedGirl(state, usedGirl).restoreHpSpeedRate)
                girlValue.restoreHpSpeedRate)
        }
    }, usedGirl)

    return state
}

export let setDefenseFactor = (state: state, funcData: funcData, computeFunc, usedGirl: usedGirl) => {
    if (!funcData.hasGirlValue(state, usedGirl)) {
        return state
    }

    state = setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            defenseFactor: computeFunc(
                state,
                // funcData.getValueByUsedGirl(state, usedGirl).defenseFactor)
                girlValue.defenseFactor)
        }
    }, usedGirl)

    return state
}

export let setAttackFactor = (state: state, funcData: funcData, computeFunc, usedGirl: usedGirl) => {
    if (!funcData.hasGirlValue(state, usedGirl)) {
        return state
    }

    state = setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            attackFactor: computeFunc(
                state,
                // funcData.getValueByUsedGirl(state, usedGirl).attackFactor)
                girlValue.attackFactor)
        }
    }, usedGirl)

    return state
}

// export let setInitialScale = (state: state, funcData: funcData, computeFunc, usedGirl_) => {
//     let oldValue = funcData.getValueByUsedGirl(state, usedGirl_).initialScale
//     let newValue = computeFunc(
//         state,
//         oldValue)


//     state = setAttribute(state, funcData, (girlValue) => {
//         return {
//             ...girlValue,
//             initialScale: newValue
//         }
//     }, usedGirl_)


//     state = setGirlScale(state, newValue)

//     return state
// }

export let setScaleIncrease = (state: state, funcData: funcData, computeFunc, usedGirl) => {
    // let oldGirlValue = funcData.getValueByUsedGirl(state, usedGirl)

    // let oldValue = oldGirlValue.scaleIncrease
    // let newValue = computeFunc(
    //     state,
    //     oldValue,
    //     oldGirlValue)


    state = setAttribute(state, funcData, (girlValue) => {
        // let oldGirlValue = funcData.getValueByUsedGirl(state, usedGirl)
        let oldGirlValue = girlValue

        let oldValue = oldGirlValue.scaleIncrease
        let newValue = computeFunc(
            state,
            oldValue,
            oldGirlValue)

        return {
            ...girlValue,
            scaleIncrease: newValue
        }
    }, usedGirl)

    return state
}

export let setInitialScaleAndUpdateScale = (state: state, funcData: funcData, computeFunc, usedGirl, setGirlScaleFunc = setGirlScaleAndKeepCamera, getIncreasedScaleFunc = (oldValue, newValue) => newValue - oldValue) => {
    // let usedGirl = usedGirl

    let oldGirlValue = funcData.getValueByUsedGirl(state, usedGirl)

    let oldValue = oldGirlValue.initialScale
    let newValue = computeFunc(
        state,
        oldValue,
        oldGirlValue)


    state = setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            initialScale: newValue
        }
    }, usedGirl)


    state = setGirlScaleFunc(state, usedGirl, getScale(state, usedGirl) + getIncreasedScaleFunc(oldValue, newValue))

    return state
}

export let setExcitementIncreaseFactor = (state: state, funcData: funcData, computeFunc, usedGirl: usedGirl) => {
    if (!funcData.hasGirlValue(state, usedGirl)) {
        return state
    }

    state = setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            excitementIncreaseFactor: computeFunc(
                state,
                girlValue.excitementIncreaseFactor)
        }
    }, usedGirl)

    return state
}

export let setMaxExcitement = (state: state, funcData: funcData, computeFunc, usedGirl: usedGirl) => {
    if (!funcData.hasGirlValue(state, usedGirl)) {
        return state
    }

    state = setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            maxExcitement: computeFunc(
                state,
                girlValue.maxExcitement)
        }
    }, usedGirl)

    return state
}

export let studyActions = (state: state, funcData: funcData, actions: Array<actionName>) => {
    state = funcData.setSavedStudyActions(state, funcData.getSavedStudyActions(state).concat(
        actions.map(a => {
            return {
                name: a,
                time: getNow(state)
            }
        })
    ))

    state = funcData.setCurrentStudyActions(state, funcData.getSavedStudyActions(state))

    return state
}

export let hasStudyAction = (state: state, funcData: funcData, action: actionName) => {
    return funcData.getSavedStudyActions(state).find(({ name }) => {
        return name == action
    })
}

// export let getPassiveMaxBiggerScaleByLevel = (state: state, funcData: funcData, level) => {
//     // return NumberUtils.lessThan(Math.round(funcData.getGirlValue(state, usedGirl).scaleIncrease * (level * 2)), funcData.getGirlMaxScale(state, funcData.getGirlValue(state, usedGirl)))
//     // return NumberUtils.lessThan(Math.round(funcData.getGirlValue(state, usedGirl).scaleIncrease * (level * 1.5)), funcData.getGirlMaxScale(state, funcData.getGirlValue(state, usedGirl)))
//     // return NumberUtils.lessThan(Math.round(funcData.getGirlValue(state, usedGirl).scaleIncrease * (level * 1.2)), funcData.getGirlMaxScale(state, funcData.getGirlValue(state, usedGirl)) - funcData.getGirlValue(state, usedGirl).initialScale)
//     return NumberUtils.lessThan(NumberUtils.getDecimal(Math.round(funcData.getGirlValue(state, usedGirl).scaleIncrease * (level * 1.2)) + funcData.getGirlValue(state, usedGirl).initialScale, 1), funcData.getGirlMaxScale(state, funcData.getGirlValue(state, usedGirl)))
// }

export let setDurationFactor = (state: state, funcData: funcData, computeFunc, usedGirl) => {
    // if (!funcData.hasGirlValue(state, usedGirl)) {
    //     return state
    // }

    return funcData.setDurationFactor(state, computeFunc(funcData.getDurationFactor(state, usedGirl)), usedGirl)
}

// export let setPartColor = (state: state, funcData: funcData, damagePart, actuallyDamageParts, color, value, usedGirl) => {
//     return funcData.setPartColor(state, damagePart, actuallyDamageParts, color, value)
// }

export let setAllColor = (state: state, funcData: funcData, color, value, usedGirl) => {
    return funcData.setAllColor(state, color, value, usedGirl)
}

// export let setGiantessAttributes = (state, funcData, func) => {
//     return ArrayUtils.reduce(
//         getPlayerGirlAndGiantessUsedGirls(state),
//         func,
//         state
//     )

// }

// export let getPlayerGirlAndGiantessUsedGirls = (state: state) => {
//     return [
//         usedGirlEnum.PlayerGirl,
//         usedGirlEnum.PlayerGoddess,
//         ...getPlayerUsedGirl(state)
//     ]
// }