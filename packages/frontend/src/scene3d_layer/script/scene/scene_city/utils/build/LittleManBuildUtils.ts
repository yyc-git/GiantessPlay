import { NumberUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { getNow } from "../../Time"
import { funcData } from "../../data/FuncData"
import { actionName } from "../../little_man_data/DataType"
import { armorStrength, armorRatio } from "../../data/DataType"
import { getLittleMan, getSkinMeshs } from "../../little_man/LittleMan"
import { computeColor } from "../ColorUtils"
import { setMaterialColor } from "../../girl/Girl"

let _setAttribute = (state: state, funcData: funcData, setFunc) => {
    state = funcData.setConfigData(state, {
        ...funcData.getConfigData(state),
        littleManValue: funcData.NullableUtils.return_(
            setFunc(funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue))
        ),
    }
    )

    return state
}

export let setMoveSpeed = (state: state, funcData: funcData, computeFunc) => {
    return _setAttribute(state, funcData, (littleManValue) => {
        return {
            ...littleManValue,
            moveSpeed: computeFunc(state, funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).moveSpeed)
        }
    })
}

export let setDefenseFactor = (state: state, funcData: funcData, computeFunc) => {
    return _setAttribute(state, funcData, (littleManValue) => {
        return {
            ...littleManValue,
            defenseFactor: computeFunc(state, funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).defenseFactor)
        }
    })
}

export let setAttackFactor = (state: state, funcData: funcData, computeFunc) => {
    return _setAttribute(state, funcData, (littleManValue) => {
        return {
            ...littleManValue,
            attackFactor: computeFunc(state, funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).attackFactor)
        }
    })
}

export let setCritRatioFactor = (state: state, funcData: funcData, computeFunc) => {
    return _setAttribute(state, funcData, (littleManValue) => {
        return {
            ...littleManValue,
            critRatioFactor: computeFunc(state, funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).critRatioFactor)
        }
    })
}


export let setArmorStrength = (state: state, funcData: funcData, computeFunc) => {
    return _setAttribute(state, funcData, (littleManValue) => {
        return {
            ...littleManValue,
            armorStrength: computeFunc(state, funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).armorStrength)
        }
    })
}

export let setEmitSpeedFactor = (state: state, funcData: funcData, computeFunc) => {
    return _setAttribute(state, funcData, (littleManValue) => {
        return {
            ...littleManValue,
            emitSpeedFactor: computeFunc(state, funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).emitSpeedFactor)
        }
    })
}


export let setEmitterLifeFactor = (state: state, funcData: funcData, computeFunc) => {
    return _setAttribute(state, funcData, (littleManValue) => {
        return {
            ...littleManValue,
            emitterLifeFactor: computeFunc(state, funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).emitterLifeFactor)
        }
    })
}

export let setStressingRateFactor = (state: state, funcData: funcData, computeFunc) => {
    return _setAttribute(state, funcData, (littleManValue) => {
        return {
            ...littleManValue,
            stressingRateFactor: computeFunc(state, funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).stressingRateFactor)
        }
    })
}

export let setHp = (state: state, funcData: funcData, computeFunc, isSetToFullHp) => {
    state = _setAttribute(state, funcData, (littleManValue) => {
        return {
            ...littleManValue,
            hp: NumberUtils.greaterThan(Math.round(computeFunc(state, funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).hp)), 1)
        }
    })

    if (isSetToFullHp) {
        state = funcData.setLittleManHp(state, funcData.getLittleManFullHp(state))
    }

    return state
}

export let setLuck = (state: state, funcData: funcData, computeFunc) => {
    return _setAttribute(state, funcData, (littleManValue) => {
        return {
            ...littleManValue,
            luck: computeFunc(state, funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).luck)
        }
    })
}


export let setRestoreHpTime = (state: state, funcData: funcData, computeFunc) => {
    return _setAttribute(state, funcData, (littleManValue) => {
        return {
            ...littleManValue,
            restoreHpTime: computeFunc(state, funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).restoreHpTime)
        }
    })
}

export let setRestoreHpSpeedRate = (state: state, funcData: funcData, computeFunc) => {
    return _setAttribute(state, funcData, (littleManValue) => {
        return {
            ...littleManValue,
            restoreHpSpeedRate: computeFunc(state, funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).restoreHpSpeedRate)
        }
    })
}


export let increaseArmor = (state: state, funcData: funcData, level) => {
    return _setAttribute(state, funcData, (littleManValue) => {
        return {
            ...littleManValue,
            // armorRatio: NumberUtils.lessThan(funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).armorRatio + 0.1 * level, armorRatio.VeryHeavy),
            armorRatio: NumberUtils.lessThan(funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).armorRatio * (1 + 0.1 * level), armorRatio.VeryHeavy),
            // armorStrength: NumberUtils.lessThan(funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).armorStrength + 10 * level, armorStrength.VeryHigh),
            armorStrength: NumberUtils.lessThan(funcData.NullableUtils.getExn(funcData.getConfigData(state).littleManValue).armorStrength * (1 + 0.1 * level), armorStrength.VeryHigh),
        }
    })
}

export let studyActions = (state: state, funcData: funcData, actions: Array<actionName>) => {
    state = funcData.setLittleManCurrentStudyActions(state, funcData.getLittleManCurrentStudyActions(state).concat(
        actions.map(a => {
            return {
                name: a,
                time: getNow(state)
            }
        })
    ))

    return state
}

export let hasStudyAction = (state: state, funcData: funcData, action: actionName) => {
    return funcData.getLittleManCurrentStudyActions(state).find(({ name }) => {
        return name == action
    })
}

export let setColor = (state: state, newColorArr, value) => {
    newColorArr = computeColor(newColorArr, state, value)

    getSkinMeshs(getLittleMan(state)).forEach(mesh => {
        setMaterialColor(mesh.material, newColorArr)
    })

    return state
}
