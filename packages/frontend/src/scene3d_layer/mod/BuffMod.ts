import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { buffData } from "../script/scene/scene_city/data/buff/BuffData"
import { state } from "../type/StateType"
import { buildAPI, getBlockServiceExn, getBlockStateExn, setBlockState } from "./Mod"
import { service } from "buff-protocol/src/service/ServiceType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { modProtocolName } from "./data/ModData"
import { getAllServiceWithCache, getModAPI, getSceneAllBlockNames } from "../script/scene/scene_city/Mod"
import { weaponType } from "../script/scene/scene_city/data/ValueType"
import { buildFuncData } from "../script/scene/scene_city/data/FuncData"
import { usedGirl } from "../script/scene/scene_city/type/StateType"

export let getBuffProtocolName = () => "buff-protocol"

export let getBuffArmyCharmBlockName = () => "buff-army-charm"

export let getBuffCharmBlockName = () => "buff-emit-charm"

export let getBuffCrippledBlockName = () => "buff-emit-crippled"

export let getBuffGirlExcitementBlockName = () => "buff-excitement-girl"

export let getBuffLevelGiantessExcitementBlockName = () => "buff-excitement-level-giantess"

// export let getStrongBlockName = () => "buff-strong"

// export let getStrongBlockService = (state: state) => {
//     return getBlockServiceExn<service>(state, "buff-protocol", "buff-strong")
// }

export let getCallGoddessBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-callgoddess")
}

// export let getExcitementGirlBlockService = (state: state) => {
//     return getBlockServiceExn<service>(state, "buff-protocol", "buff-excitement-girl")
// }

export let getAbsorbBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-giantess-absorb")
}


export let getEatBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-giantess-eat")
}




export let getEmitExcitementBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-excitement")
}

export let getEmitBlurBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-blur")
}

export let getEmitCharmBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-charm")
}


export let getEmitCrippledBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-crippled")
}



export let getEmitDefenseIncreaseDefenseBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-defense-increasedefense")
}



export let getEmitBackStabBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-backstab")
}


export let getEmitHpRatioDirectBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-hpratio")
}

export let getEmitHpRatioInverseBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-hpratio-inverse")
}


export let getEmitShootDistanceInverseBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-shoot-distance-inverse")
}



export let getEmitShootDistanceDirectBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-shoot-distance-direct")
}


export let getEmitPullBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-pull")
}


export let getEmitDecreaseScaleBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-decreasescale")
}


export let getEmitDoorShieldBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-defense-doorshield")
}


export let getEmitFragileGrowthBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-fragilegrowth")
}

export let getEmitStressprotectBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-defense-stressprotect")
}

export let getEmitPoisonSingleBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-poison-single")
}

export let getEmitIceSingleBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-emit-ice-single")
}

export let getEliteGiantessPassiveBiggerBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-elite-giantess-passivebigger")
}

export let getEliteGiantessDamageBiggerBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "buff-protocol", "buff-elite-giantess-damagebigger")
}


// export let getHardBlockService = (state: state) => {
//     return getBlockServiceExn<service>(state, "buff-protocol", "buff-giantess-hard")
// }


let _getAllBlockNames = (state: state) => {
    return getSceneAllBlockNames(state, [
        "buff-emit-defense-increasedefense",
        "buff-emit-backstab",
        "buff-emit-hpratio",
        "buff-emit-hpratio-inverse",
        "buff-emit-shoot-distance-inverse",
        "buff-emit-shoot-distance-direct",
        "buff-emit-pull",
        "buff-emit-decreasescale",
        "buff-emit-defense-doorshield",
        "buff-emit-fragilegrowth",
        "buff-emit-defense-stressprotect",
        "buff-emit-poison-single",
        "buff-emit-ice-single",

        "buff-emit-crippled",
        "buff-army-crippled",
        "buff-littleman-crippled",

        "buff-emit-blur",
        "buff-army-blur",
        "buff-littleman-blur",

        "buff-emit-charm",
        "buff-army-charm",
        "buff-littleman-charm",

        "buff-emit-excitement",
        "buff-army-excitement",
        "buff-littleman-excitement",

        "buff-elite-giantess-passivebigger",
        "buff-elite-giantess-damagebigger",

        "buff-giantess-eat",
        "buff-giantess-absorb",
        "buff-littleman-masochism",
        "buff-giantess-masochism",
        "buff-giantess-sadism",
        "buff-army-sadism",
        "buff-littleman-excitement-increaseattack",
        "buff-army-stressprotect",
        "buff-littleman-stressprotect",
        "buff-giantess-stressprotect",
        "buff-bossstatus-stressprotect",

        "buff-playerstatus-damagebigger",
        "buff-bossstatus-damagebigger",
        "buff-playerstatus-passivebigger",
        "buff-bossstatus-passivebigger",

        "buff-army-increasedefense",
        "buff-army-ice-overwrite",
        "buff-army-ice-single",
        "buff-army-poison-single",
        "buff-army-injure-single",
        "buff-giantess-increasedefense",
        "buff-giantess-ice-overwrite",
        "buff-giantess-ice-single",
        "buff-giantess-poison-single",
        "buff-giantess-injure-single",
        "buff-littleman-increasedefense",
        "buff-littleman-ice-single",
        "buff-littleman-poison-single",

        "buff-strong",
        "buff-run",
        "buff-callgoddess",
        "buff-excitement-girl",
        "buff-excitement-level-giantess",
        "buff-tired-girl",
        "buff-tired-level-giantess",
        "buff-holywater",
        "buff-giantessstimulator",
        "buff-giantesscontroller",
        "buff-giantess-smallerwater",
        "buff-giantess-hard",
    ])
}



let _getAllServicesDirectly = (state) => {
    return _getAllBlockNames(state).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.BuffProtocol, blockName)
    })
}

let _getAllServices = (state):Array<service> => {
    return getAllServiceWithCache(state, _getAllServicesDirectly, "buff")
}


// export let disposeAllBuffMods = (state: state, api: api) => {
//     return _getAllBlockNames(state).reduce((state, blockName) => {
//         return api.blockAPI.setBlockState<blockState>(state, modProtocolName.BuffProtocol, blockName,
//             {
//                 oldValue: NullableUtils.getEmpty(),
//                 startTime: -Infinity
//             }
//         )
//     }, state)
// }

export let addToBuffData = (state: state, buffData: buffData) => {
    return _getAllServices(state).reduce((result, service) => {
        return ArrayUtils.push(
            result,
            service.getBuffData()
        )
    }, buffData)
}

export let handleStatusWithNumber = (state: state, handleStatusWithNumberFunc, usedGirl: usedGirl) => {
    let api = getModAPI(state)
    let funcData = buildFuncData(state)

    return _getAllServices(state).reduce((state, service) => {
        return NullableUtils.getWithDefault(
            NullableUtils.map(
                getCount => {
                    return handleStatusWithNumberFunc(state, getCount(api, usedGirl), usedGirl, service.getName(),
                        service.getCharacterType(),
                        service.isPositive(),
                        !!service.getDescription ? service.getDescription(state, funcData) : "",
                        // service.getImageSrc()
                    )
                },
                service.getCount
            ),
            state
        )
    }, state)
}

export let getBuffImageSrc = (state: state, name) => {
    return NullableUtils.getExn(_getAllServices(state).find(service => service.getName() == name)).getImageSrc()
}


// let _getAllServicesWithBlockName = (state) => {
//     return _getAllBlockNames(state).map(blockName => {
//         return [getBlockServiceExn<service>(state, modProtocolName.BuffProtocol, blockName), blockName]
//     })
// }

let _getBlockNameByName = (state, name) => {
    return _getAllBlockNames(state).find(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.BuffProtocol, blockName).getName() == name
    })
}

export let getBuffState = (state: state, name) => {
    return NullableUtils.map(blockName => {
        return getBlockStateExn(state, modProtocolName.BuffProtocol, blockName)
    }, _getBlockNameByName(state, name))
}

export let setBuffState = (state: state, name, buffState) => {
    return NullableUtils.map(blockName => {
        return setBlockState(state, modProtocolName.BuffProtocol, blockName, buffState)
    }, _getBlockNameByName(state, name))
}


// export let handleDamageHandlerForEmitBuff = (api: api, state: state, computeValueFunc, buffName, data,
//     soundResourceId,

//     ) => {
//     let userData = api.NullableUtils.getExn(data.userData)

//     let buff = api.findBuff(state, buffName, userData.fromName, api.NullableUtils.getEmpty())

//     if (!api.NullableUtils.isNullable(buff)
//         && !api.isEffect(userData.weaponValue.type)
//     ) {
//         let { superPositionCount } = api.NullableUtils.getExn(buff)
//         let level = superPositionCount

//         // let rate = 0.1
//         let rate = 1

//         let armyValue = computeValueFunc(level)
//         // let armyValue = level * 0.8

//         let position = userData.damagePosition

//         if (level > 0 && api.isRandomRate(rate)) {
//             // TODO update
//             state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
//                 api.SoundManager.buildNeedToPlaySoundData(soundResourceId, api.getIsDebug(state), api.getVolume(state, 0.7, position, 0))
//             ))

//             let name = userData.name

//             let promise
//             if (api.girl.isGirl(name)) {
//                 state = api.setGiantessAddHitEffectFunc(state, (state: state, fromName, damagePosition, damageType_, armorType_) => {
//                     // TODO update
//                     return api.setAbstractState(state, api.ParticleManager.emitSparkLightHit(api.getAbstractState(state), {
//                         speed: 1,
//                         life: 600,
//                         size: 5,
//                         position: damagePosition.toArray()
//                     }))
//                 })

//                 let giantessBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffGiantessIceSingleBlockName())

//                 let giantessValue = api.girl.computeAttenuationByHeightForEffect(armyValue, state)
//                 if (api.girl.isCloth(userData.damagePartByJudge)) {
//                     giantessValue *= 0.5
//                 }

//                 // promise = giantessBuffService.addBuff(api, state, name, api.NullableUtils.return_(usedGirl), life / 1000, giantessValue, {
//                 //     damagePart: userData.damagePartByJudge,
//                 //     actuallyDamageParts: userData.actuallyDamagePartsByJudge
//                 // })
//                 promise = giantessBuffService.addBuff(api, state, name, api.NullableUtils.return_(usedGirl), giantessValue)
//             }
//             else if (name == api.getLittleManName()) {
//                 let littleManBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffLittleManIceSingleBlockName())

//                 promise = littleManBuffService.addBuff(api, state, name, armyValue)
//             }
//             else {
//                 state = api.setArmyAddHitEffectFunc(state, (state: state, fromName, targetName, damagePosition, damageType_, weaponValue_, armorType_) => {
//                     // TODO update
//                     return api.setAbstractState(state, api.ParticleManager.emitSparkLightHit(api.getAbstractState(state), {
//                         speed: 1,
//                         life: 600,
//                         size: 5,
//                         position: damagePosition.toArray()
//                     }))
//                 })

//                 let armyBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffArmyIceSingleBlockName())

//                 promise = armyBuffService.addBuff(api, state, name, api.NullableUtils.getEmpty(), armyValue)
//             }

//             return promise.then(state => [state, userData])
//         }
//     }

//     return Promise.resolve([state, userData])

// }