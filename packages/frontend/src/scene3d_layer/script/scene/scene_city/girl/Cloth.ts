import { Object3DUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { getCurrentMMDCharacterName, getFullHp, getGirlMesh, getHp, getValue, setHp, getGirlState, getCurrentMMDCharacterNameByUsedGirl, setHpByUsedGirl, getHpByUsedGirl, getAllUsedMMDData, buildNameByUsedGirl } from "./Girl";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { setMaterialVisibleByName } from "../utils/MMDUtils";
import { clothName, collisionPart, damagePart, usedGirl } from "../type/StateType";
import { getGirlPosition, getPivotWorldPosition, getScale, isCanStressing } from "./Utils";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { Vector3 } from "three";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getClothDestroyedSoundResourceId, getConfigData, setCollisionShapeData } from "../CityScene";
import { getIsDebug } from "../../Scene";
import { getGirlVolume } from "../utils/SoundUtils";
import { isNotDamageState } from "../utils/FSMStateUtils";
import { getStateMachine, setStateMachine } from "./FSMState";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { getBody } from "../data/mmd/MMDData";
import { getCollisionPartOBB } from "./Collision";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { ensureCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { getGetClothHpDataFunc, initClothHpData } from "../utils/ClothUtils";
import { disposeShoe, restoreShoe } from "../data/mmd/Shoe";
// import { generateReward } from "../reward/RewardGenerator";
// import { buildGiantessClothDestroyedName } from "../data/play/level1/reward/RewardData";
// import { findMeshByMaterialName } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils";
import * as CollisionShapeData from "../data/CollisionShapeData"
import { singleClothCollisionData } from "mmd-character-protocol/src/service/ServiceType";

// const _q = new Quaternion();
// const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();


export let hideCloth = (state: state, usedGirl, name: clothName) => {
    // NullableUtils.getExn(Object3DUtils.findObjectByName(getGirlMesh(state, usedGirl), name)).visible = false
    // NullableUtils.getExn(findMeshByMaterialName(getGirlMesh(state, usedGirl), name)).visible = false
    setMaterialVisibleByName(getGirlMesh(state, usedGirl), name, false)

    return state
}

export let showCloth = (state: state, usedGirl, name: clothName) => {
    // NullableUtils.getExn(findMeshByMaterialName(getGirlMesh(state, usedGirl), name)).visible = true
    setMaterialVisibleByName(getGirlMesh(state, usedGirl), name, true)

    return state
}

// export let updateAllClothVisible = (state: state, handleClothFunc) => {
//     return NullableUtils.getWithDefault(
//         NullableUtils.map(
//             (data) => {
//                 let [allDamageParts, allDamagePartsHasMaterial] = data.reduce(([allDamageParts, allDamagePartsHasMaterial], d) => {
//                     if (NullableUtils.isNullable(d.damageParts)) {
//                         allDamagePartsHasMaterial = ArrayUtils.push(allDamagePartsHasMaterial, d.damagePart)
//                     }

//                     allDamagePartsHasMaterial = ArrayUtils.pushArrs(allDamagePartsHasMaterial, NullableUtils.getExn(d.damageParts))

//                     allDamageParts = ArrayUtils.push(
//                         allDamageParts, d.damagePart
//                     )

//                     return [allDamageParts, allDamagePartsHasMaterial]
//                 }, [[], []])

//                 // .reduce((state, [allDamageParts, allDamagePartsHasMaterial]) => {
//                 //     // showCloth(state, damagePart)
//                 //     return handleClothFunc(state, [allDamageParts, allDamagePartsHasMaterial])
//                 // }, state)

//                 return handleClothFunc(state, [allDamageParts, allDamagePartsHasMaterial])
//             },
//             _getCurrentClothCollisionData(state)
//         ),
//         state
//     )
// }

let _getDamagePartHasMaterial = (d) => {
    return NullableUtils.getWithDefault(
        d.damageParts,
        [d.damagePart],
    )
}

let _showAllCloths = (state, usedGirl, data: Array<singleClothCollisionData<collisionPart>>) => {
    return data.reduce((state, d) => {
        let damagePartHasMaterial = _getDamagePartHasMaterial(d)

        state = damagePartHasMaterial.reduce((state, damagePartHasMaterial) => showCloth(state, usedGirl, damagePartHasMaterial), state)

        return _showAllCloths(state, usedGirl, d.children)
    }, state)
}

export let showAllCloths = (state: state, usedGirl) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(
            (data) => {
                return _showAllCloths(state, usedGirl, data)
            },
            _getCurrentClothCollisionData(state, usedGirl)
        ),
        state
    )
}

export let updateAllClothVisibleByJudgeHp = (state: state, usedGirl) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(
            (data) => {
                return data.reduce((state, d) => {
                    let damagePartHasMaterial = _getDamagePartHasMaterial(d)

                    let func
                    if (getHpByUsedGirl(state, usedGirl, d.damagePart) <= 0) {
                        func = hideCloth
                    }
                    else {
                        func = showCloth
                    }

                    return damagePartHasMaterial.reduce((state, name) => {
                        return func(state, usedGirl, name)
                    }, state)
                }, state)
            },
            _getCurrentClothCollisionData(state, usedGirl)
        ),
        state
    )
}

// let _reduceData = (data, func, initialValue) => {
// //TODO implement
// return {} as any
// }

// let _isBelongToDamagePart = (data, collisionPart_, damagePart) => {
//     return !NullableUtils.isNullable(data.find(d => {
//         if( d.collisionPart.includes(collisionPart_) && d.damagePart == damagePart){
//             return true
//         }

//         return _isBelongToDamagePart( d.children, collisionPart_, damagePart)
//     }))
// }

// export let isBelongToDamagePart = (collisionPart_, damagePart) => {
//     return !NullableUtils.isNullable(_getData().find(d => {
//         return d.collisionPart.includes(collisionPart_) && d.damagePart == damagePart
//     }))
// }

let _getDamagePartByCollisionPart = (result, usedGirl, data, state: state, collisionPart_) => {
    return data.reduce((result, d) => {
        if (d.collisionPart.includes(collisionPart_)) {
            result = [d.damagePart,
            NullableUtils.getWithDefault(
                d.damageParts,
                [d.damagePart],
            )]

            if (getHp(state, usedGirl, d.damagePart) <= 0) {
                return _getDamagePartByCollisionPart(result, usedGirl, d.children, state, collisionPart_)
            }

            return result
        }

        return result
    }, result)
}

let _getCurrentClothCollisionData = (state: state, usedGirl) => {
    let clothCollisionData = getConfigData(state).clothCollisionData

    return NullableUtils.getWithDefault(
        NullableUtils.map(d => d.data,
            clothCollisionData.find(d => d.mmdCharacter == getCurrentMMDCharacterName(state, usedGirl))
        ),
        []
    )
}

export let getDamagePartByCollisionPart = (state: state, usedGirl, collisionPart_: collisionPart): [damagePart, Array<damagePart>] => {
    // return _getDamagePartByCollisionPart([getBody(), [getBody()]], NullableUtils.getExn(getClothCollisionData().find(d => d.mmdCharacter == getCurrentMMDCharacterName(state, usedGirl))).data, state, collisionPart_)
    return _getDamagePartByCollisionPart([getBody(), [getBody()]], usedGirl,
        _getCurrentClothCollisionData(state, usedGirl), state, collisionPart_)
}

export let getDamagePartByJudge = (state: state, usedGirl, damagePart, actuallyDamageParts): [damagePart, Array<damagePart>] => {
    // if (getScale(state, usedGirl) < getValue(state).scaleIncrease * 4
    if (getScale(state, usedGirl) < 16
        || getHp(state, usedGirl, damagePart) <= 0) {
        return [getBody(), [getBody()]]
    }

    return [damagePart, actuallyDamageParts]
}

export let getDamagePartByJudgeWithoutJudgeScale = (state: state, usedGirl, damagePart, actuallyDamageParts): [damagePart, Array<damagePart>] => {
    if (getHp(state, usedGirl, damagePart) <= 0) {
        return [getBody(), [getBody()]]
    }

    return [damagePart, actuallyDamageParts]
}

export let isCloth = (damagePart_) => {
    return damagePart_ != getBody()
}

let _convertDamagePartToClothName = (damagePart): clothName => {
    if (damagePart == getBody()) {
        throw new Error("err")
    }

    return damagePart
}

export let handleClothDestroyed = (state: state,
    [createStressingStateFunc, isCanStressingFunc], usedGirl: usedGirl,
    damagePosition: Vector3, collisionPart_, damageParts: Array<damagePart>, fromName): Promise<state> => {
    let sizeLength = getCollisionPartOBB(state, usedGirl, collisionPart_).getSize(_v1).length()

    state = setAbstractState(state, ParticleManager.emitClothDestroyed(getAbstractState(state),
        {
            speed: 1,
            life: 2000,
            size: 5 * sizeLength,
            position: damagePosition.toArray()
        }
    ))

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getClothDestroyedSoundResourceId(), getIsDebug(state), getGirlVolume(state, usedGirl, getPivotWorldPosition(state, usedGirl)))))


    state = damageParts.reduce((state, damagePart) => {
        return hideCloth(state, usedGirl, _convertDamagePartToClothName(damagePart))
    }, state)


    let stateMachine = getStateMachine(state, usedGirl)
    if (isCanStressingFunc(state, usedGirl, stateMachine)) {
        return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
            return setStateMachine(usedGirl)(state, stateMachine)
        }, stateMachine, createStressingStateFunc(usedGirl), buildNameByUsedGirl(usedGirl), [collisionPart_, fromName, damagePosition])
    }
    // else {
    //     state = generateReward(state, fromName, buildGiantessClothDestroyedName(), getName(), damagePosition, getGirlPosition(state, usedGirl), 3)
    // }

    return Promise.resolve(state)
}

export let getHpDataByUsedGirl = (state: state, usedGirl) => {
    // return NullableUtils.getExn(NullableUtils.getExn(getConfigData(state).clothHpDataMap.get(usedGirl)).find(d => d.mmdCharacter == getCurrentMMDCharacterNameByUsedGirl(state, usedGirl))).data
    return NullableUtils.getWithDefault(
        NullableUtils.map(d => d.data,
            NullableUtils.getExn(getConfigData(state).clothHpDataMap.get(usedGirl)).find(d => d.mmdCharacter == getCurrentMMDCharacterNameByUsedGirl(state, usedGirl))
        ),
        []
    )
}

export let getHpData = (state: state, usedGirl) => {
    // return ensureCheck(getHpDataByUsedGirl(state, getGirlState(state).currentUsedGirl), (r) => {
    //     test("should has data", () => {
    //         return r.length > 0
    //     })
    // }, getIsDebug(state))
    return getHpDataByUsedGirl(state, usedGirl)
}

export let updateHpData = (state, usedGirl) => {
    return getHpDataByUsedGirl(state, usedGirl).reduce((state, d) => {
        return setHpByUsedGirl(state, usedGirl, d.damagePart, d.hp)
    }, state)
}

export let isClothsDestroyed = (state: state, usedGirl, damageParts) => {
    return damageParts.filter(damagePart => {
        return getHp(state, usedGirl, damagePart) > 0
    }).length == 0
}

let _getAllDamagePart = (result, data) => {
    return ArrayUtils.removeDuplicateItems(data.reduce((result, d) => {
        result = ArrayUtils.pushArrs(result,
            _getDamagePartHasMaterial(d)
        )

        return _getAllDamagePart(result, d.children)
    }, result))
}

export let restoreCloth = (state: state, usedGirl) => {
    return _getAllDamagePart([], _getCurrentClothCollisionData(state, usedGirl)).reduce((state, damagePart) => {
        return showCloth(state, usedGirl, _convertDamagePartToClothName(damagePart))
    }, state)
}

// export let resetCloth = (state: state, usedMMDData, collisionShapeData) => {
export let resetCloth = (state: state, usedGirl) => {
    let usedMMDData = getAllUsedMMDData(state)
    // let collisionShapeData = CollisionShapeData.getData(state)

    state = initClothHpData(state, getGetClothHpDataFunc(state), usedMMDData)
    state = updateHpData(state, usedGirl)

    // state = disposeShoe(state)
    state = restoreShoe(state, usedGirl)

    // state = setCollisionShapeData(state, collisionShapeData)

    // state = updateAllClothVisible(state, showCloth)
    state = showAllCloths(state, usedGirl)

    return state
}

export let getAllClothNames = (state: state, usedGirl): Array<clothName> => {
    return _getCurrentClothCollisionData(state, usedGirl).reduce((result, d) => {
        return ArrayUtils.pushArrs(
            result,
            _getDamagePartHasMaterial(d)
        )
    }, [])
}

export let getAllBodyNames = (state: state, usedGirl): Array<clothName> => {
    let allClothName = getAllClothNames(state, usedGirl)

    let materials = getGirlMesh(state, usedGirl).material as Array<any>

    return materials.reduce((result, m) => {
        if (!allClothName.includes(m.name)) {
            return ArrayUtils.push(result, m.name)
        }

        return result
    }, [])
}