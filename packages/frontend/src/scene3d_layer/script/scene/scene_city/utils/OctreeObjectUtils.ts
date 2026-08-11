import { name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { state } from "../../../../type/StateType";
import * as Buildings from "../manage/city1/Buildings";
import * as TreesAndProps from "../manage/city1/TreesAndProps";
import * as Cars from "../manage/city1/Cars";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { LOD } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { disposeData as disposeDataStatus, getStatusKeyByName } from "../Status";
import { armorStrength, armorRatio, armorType } from "../data/DataType";
import { getLanguageTextData, languageKey } from "../../../../internation/Data";
import { removeCamp } from "../manage/city1/Army";

let _handle = (state, [handleNotEmptyFunc, handleEmptyFunc], name) => {
    if (Buildings.isBuildings(name)) {
        return handleNotEmptyFunc(state, Buildings, name)
    }
    else if (TreesAndProps.isTreesAndProps(name)) {
        return handleNotEmptyFunc(state, TreesAndProps, name)
    }
    else if (Cars.isCars(name)) {
        return handleNotEmptyFunc(state, Cars, name)
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

// export let getNamePrefix = (state: state, name: name) => {
//     let result
//     if (Buildings.isBuildings(name)) {
//         result = getLanguageTextData(state, languageKey.Building)
//     }
//     else if (TreesAndProps.isTreesAndProps(name)) {
//         result = getLanguageTextData(state, languageKey.Prop)
//     }
//     else if (Cars.isCars(name)) {
//         result = getLanguageTextData(state, languageKey.Car)
//     }
//     else {
//         return NullableUtils.getEmpty<name>()
//     }

//     return NullableUtils.return_(result)
// }

export let getBox = (state: state, name: name) => {
    return NullableUtils.map(index => {
        return LOD.getBox(getAbstractState(state), index)
    }, LOD.getIndexNullable(getAbstractState(state), name))
}

export let isAlive = (state: state, name): nullable<boolean> => {
    // return _handle(state, [
    //     (state, module, name) => {
    //         return NullableUtils.return_(LOD.isAlive(
    //             getAbstractState(state),
    //             LOD.getIndex(getAbstractState(state), name)
    //         ))
    //     },
    //     (state, name) => {
    //         return NullableUtils.getEmpty()
    //     },
    // ], name)
    return LOD.isAliveNullable(getAbstractState(state), name)
}


export let isStatic = (state: state, name) => {
    return _handle(state, [
        (state, module, name) => {
            return true
        },
        (state, name) => {
            return false
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

export let disposeAllData = (state: state, disposeFunc, name) => {
    state = disposeFunc(state, name)

    state = disposeDataStatus(state, getStatusKeyByName(name))

    state = setAbstractState(state, LOD.disposeStaticData(getAbstractState(state), name))

    state = removeCamp(state, name)

    return state
}

// export let getZeroFactor = (state: state, name) => {
//     return 0
// }

export let getNoneArmorData = (): [armorType, armorRatio, armorStrength] => {
    return [armorType.Light, armorRatio.None, armorStrength.Zero]
}