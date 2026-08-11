import { name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { state } from "../../../../type/StateType";
import * as Infantry from "../manage/city1/soldier/Infantry";
import * as Commander from "../manage/city1/soldier/Commander";
import * as Laserer from "../manage/city1/soldier/Laserer";
import * as Melee from "../manage/city1/soldier/Melee"
import * as Rocketeer from "../manage/city1/soldier/Rocketeer";
import * as Tank from "../manage/city1/milltary_vehicle/Tank";
import * as MissileVehicle from "../manage/city1/milltary_vehicle/MissileVehicle";
import * as FlameVehicle from "../manage/city1/milltary_vehicle/FlameVehicle"
import * as MissileTurret from "../manage/city1/milltary_building/MissileTurret"
import * as ShellTurret from "../manage/city1/milltary_building/ShellTurret"
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { LOD } from "meta3d-jiehuo-abstract";
import { getAbstractState } from "../../../../state/State";
import { handleForLODQueueObjectUtils } from "../../../../mod/EliteGiantessMod";
import { getLanguageTextData, languageKey } from "../../../../internation/Data";
import { Vector3 } from "three";

let _handle = (state, [handleNotEmptyFunc, handleEmptyFunc], name) => {
    if (Infantry.isInfantry(name)) {
        return handleNotEmptyFunc(state, Infantry, name)
    }
    else if (Commander.isCommander(name)) {
        return handleNotEmptyFunc(state, Commander, name)
    }
    else if (Laserer.isLaserer(name)) {
        return handleNotEmptyFunc(state, Laserer, name)
    }
    else if (Melee.isMelee(name)) {
        return handleNotEmptyFunc(state, Melee, name)
    }
    else if (Rocketeer.isRocketeer(name)) {
        return handleNotEmptyFunc(state, Rocketeer, name)
    }

    else if (Tank.isTank(name)) {
        return handleNotEmptyFunc(state, Tank, name)
    }
    else if (MissileVehicle.isMissileVehicle(name)) {
        return handleNotEmptyFunc(state, MissileVehicle, name)
    }
    else if (FlameVehicle.isFlameVehicle(name)) {
        return handleNotEmptyFunc(state, FlameVehicle, name)
    }


    else if (MissileTurret.isMissileTurret(name)) {
        return handleNotEmptyFunc(state, MissileTurret, name)
    }
    else if (ShellTurret.isShellTurret(name)) {
        return handleNotEmptyFunc(state, ShellTurret, name)
    }

    // else if(MeleeGiantess.isMeleeGiantess(name)){
    //     return handleNotEmptyFunc(state, MeleeGiantess, name)
    // }
    let result = handleForLODQueueObjectUtils(state, handleNotEmptyFunc, name)

    if (result !== false) {
        return result
    }

    return handleEmptyFunc(state, name)
}

export let getHpRatio = (state: state, name: name) => {
    return _handle(state, [
        (state, module, name) => {
            return NullableUtils.return_(module.getHpRatio(state, name))
        },
        (state, name) => {
            return NullableUtils.getEmpty()
        },
    ], name)
}

export let getHp = (state: state, name: name) => {
    return _handle(state, [
        (state, module, name) => {
            return NullableUtils.return_(module.getHp(state, name))
        },
        (state, name) => {
            return NullableUtils.getEmpty()
        },
    ], name)
}

export let getFullHp = (state: state, name: name) => {
    return _handle(state, [
        (state, module, name) => {
            // let hp = module.getHp(state, name)

            // if (hp <= 0) {
            //     return 0
            // }

            // return NullableUtils.return_(
            //     hp / module.getHpRatio(state, name)
            // )
            return NullableUtils.return_(
                module.getFullHp(state)
            )
        },
        (state, name) => {
            return NullableUtils.getEmpty()
        },
    ], name)
}

export let setHp = (state: state, name: name, value) => {
    return _handle(state, [
        (state, module, name) => {
            return module.updateHp(state, name, value)
        },
        (state, name) => {
            return state
        },
    ], name)
}

export let getSnapshot = (state: state, name: name) => {
    return _handle(state, [
        (state, module, name) => {
            return module.getSnapshot()
        },
        (state, name) => {
            return ""
        },
    ], name)
}

// export let getNamePrefix = (state, name: name) => {
//     // return NullableUtils.getEmpty<name>()

//     let result
//     if (Infantry.isInfantry(name)) {
//         result = getLanguageTextData(state, languageKey.Infantry)
//     }
//     else if (Commander.isCommander(name)) {
//         result = getLanguageTextData(state, languageKey.Commander)
//     }
//     else if (Laserer.isLaserer(name)) {
//         result = "激光兵"
//     }
//     else if (Melee.isMelee(name)) {
//         result = "近战兵"
//     }
//     else if (Rocketeer.isRocketeer(name)) {
//         result = "火箭兵"
//     }

//     else if (Tank.isTank(name)) {
//         result = "坦克"
//     }
//     else if (MissileVehicle.isMissileVehicle(name)) {
//         result = "导弹车"
//     }
//     else if (FlameVehicle.isFlameVehicle(name)) {
//         result = "喷火车"
//     }


//     else if (MissileTurret.isMissileTurret(name)) {
//         result = "导弹塔"
//     }
//     else if (ShellTurret.isShellTurret(name)) {
//         result = "炮塔"
//     }
//     else if (getInternationNameEliteGiantess(state, name) === false) {
//         result = getInternationNameEliteGiantess(state, name)
//     }
//     else {
//         return NullableUtils.getEmpty<name>()
//     }

//     return NullableUtils.return_(result)
// }

export let getBox = (state: state, name: name) => {
    return NullableUtils.bind(queue => {
        return NullableUtils.map(index => {
            return queue.getBox(index)
        }, queue.getIndex(name))
    }, LOD.getLODQueueNullable(getAbstractState(state), name))
}

export let getTransform = (state: state, name: name) => {
    return NullableUtils.bind(queue => {
        return NullableUtils.map(index => {
            return queue.getTransform(index)
        }, queue.getIndex(name))
    }, LOD.getLODQueueNullable(getAbstractState(state), name))
}

export let isAlive = (state: state, name): boolean => {
    return LOD.isAliveInLODQueue(getAbstractState(state), name)
}

export let getNamePrefix = (state: state, name: name) => {
    return _handle(state, [
        (state, module, name) => {
            return NullableUtils.return_(module.getNamePrefix())
        },
        (state, name) => {
            return NullableUtils.getEmpty()
        },
    ], name)
}

export let getModelName = (state: state, name: name) => {
    return _handle(state, [
        (state, module, name) => {
            return NullableUtils.return_(module.getModelName())
        },
        (state, name) => {
            return NullableUtils.getEmpty()
        },
    ], name)
}

export let createInitialState = (state: state, name: name) => {
    return _handle(state, [
        (state, module, name) => {
            return NullableUtils.return_(module.createInitialState())
        },
        (state, name) => {
            return NullableUtils.getEmpty()
        },
    ], name)
}

export let handleRepel = (state: state,
    direction: Vector3, distance, time,
    [matrix, box, name]
): Promise<state> => {
    return _handle(state, [
        (state, module, name) => {
            return module.handleRepel(state,
                direction, distance, time,
                [matrix, box, name]
            )
        },
        (state, name) => {
            return Promise.resolve(state)
            // throw new Error("error")
        },
    ], name)
}