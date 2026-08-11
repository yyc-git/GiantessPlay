import { service } from "scene-protocol/src/service/ServiceType"
import { getBlockServiceExn, dispose as disposeAllMods, init as initAllMods, initAllBlocks, registerAllBlocks } from "./Mod"
import { modProtocolName } from "./data/ModData"
import { state } from "../type/StateType"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { getBlockState, setAbstractState, setBlockState } from "../state/State"
import { Scene } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../business_layer/State"
import { getAllScenes } from "../script/scene/Scene"
import { getScene, loadResource } from "../script/scene/scene_city/CityScene"
import { scene } from "../../ui_layer/global/store/GlobalStoreType"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getLanguageTextData, languageKey } from "../internation/Data"
import { api } from "type-api/src/Type"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getAllNotRelatedToSceneBlockNames, getAllServiceWithCache, getModAPI, getSceneAllBlockNames, setAllBlockNames } from "../script/scene/scene_city/Mod"
import * as BlockManager from "block/src/BlockManager"
import { blockName } from "block/src/BlockManagerType"
import { buildNameByUsedGirl, getCurrentUsedGirls, hasCurrentUsedGirl, isEnemyGiantess, isPlayerGiantess, isUseGirl, isWildGiantess } from "../script/scene/scene_city/girl/Girl"
import { getAttackTarget, getAttackTargetUsedGirl, getCampExn, setAttackTarget, setAttackTargetUsedGirl } from "../script/scene/scene_city/manage/city1/Army"
import { attackTarget, camp, usedGirlEnum } from "../script/scene/scene_city/type/StateType"
import { getPlayerAttackTarget, hasAttackTarget, isNotAttackLittleMan } from "../script/scene/scene_city/utils/AttackTargetUtils"
import { isNearGirl, isVeryNearGirl } from "../script/scene/scene_city/utils/CollisionUtils"
import { getPlayerCamp, isPlayerCamp } from "../script/scene/scene_city/utils/PlayerUtils"
import { getLockedAttackTargetToPlayer } from "../script/scene/scene_city/manage/mission/Mission"
import { nullable } from "block/src/Type"
import { meleeRange } from "../script/scene/scene_city/data/ValueType"

let _getPureAllBlockNames = () => {
    return [
        "scene-protect",
    ]
}

let _getAllBlockNames = (state) => {
    return getSceneAllBlockNames(state, _getPureAllBlockNames())
}


let _getAllServicesDirectly = (state) => {
    return _getAllBlockNames(state).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.SceneProtocol, blockName)
    })
}

let _getAllServices = (state): Array<service> => {
    return getAllServiceWithCache(state, _getAllServicesDirectly, "scene")
}

let _handlePromise = (state: state, func: (service: service, api: api, state: state) => Promise<state>, scene: string) => {
    let api = getModAPI(state)

    return ArrayUtils.reducePromise<state, service>(
        _getAllServices(state),
        (state, service) => {
            if (service.getScene() != scene) {
                return Promise.resolve(state)
            }

            return func(service, api, state)
        },
        state
    )
}

// export let init = (state: state, scene: string) => {
//     return _handlePromise(state, (service, api, state) => service.handleInit(api, state), scene)
// }

export let update = (state: state, scene: string) => {
    return _handlePromise(state, (service, api, state) => service.handleUpdate(api, state), scene)
}

export let dispose = (state: state, scene: string) => {
    return _handlePromise(state, (service, api, state) => service.handleDispose(api, state), scene)
}

export let importScene = (state: state, renderer, scene: string, levelNumber) => {
    return _handlePromise(state, (service, api, state) => {
        state = service.buildScene(api, state, renderer, levelNumber)

        state = setAbstractState(state, Scene.setCurrentScene(getAbstractState(state), getAllScenes(state), getScene(state)))

        return service.handleInitWhenImportScene(api, state)
    }, scene)
}

export let loadSceneResource = (state: state, setPercentFunc, scene: string, character) => {
    return _handlePromise(state, (service, api, state) => {
        return service.handleBeforeLoadResource(api, state, character).then(state => {
            return loadResource(
                state,
                service.getLoadData(api, state),
                setPercentFunc,
            )
        })
    }, scene)
}

let _handle = (state: state, func: (service: service, api: api, state: state) => state, scene: string) => {
    // let api = getModAPI(state)
    let api = getModAPI(state)

    return ArrayUtils.reduce<state, service>(
        _getAllServices(state),
        (state, service) => {
            if (service.getScene() != scene) {
                return state
            }

            return func(service, api, state)
        },
        state
    )
}



// let _updateAttackTargetForGiantess = (state, name, position, rate) => {
//     let attackTarget_ = getAttackTarget(state, name)

//     if (isNotAttackLittleMan(state)) {
//         attackTarget_ = attackTarget.Giantess
//     }
//     else {
//         if (hasAttackTarget(attackTarget_)) {
//             return state
//         }

//         if (isVeryNearGirl(state, position)
//             || (
//                 isNearGirl(state, position) && NumberUtils.isRandomRate(rate)
//             )
//         ) {
//             attackTarget_ = attackTarget.Giantess
//         }
//         else {
//             attackTarget_ = attackTarget.LittleMan
//         }
//     }


//     return setAttackTarget(state, name, attackTarget_)
// }


let _judgeDistance = (api: api, state: state, func, currentAttackTarget, name, position, distanceSquared) => {
    switch (currentAttackTarget) {
        case attackTarget.LittleMan:
        case attackTarget.Giantess:
            let pos = api.getPlayerPosition(state)
            return func(api.getPositionParrelToObj(position, api.vector3.getY(pos)), pos, distanceSquared)
        default:
            return api.NullableUtils.getWithDefault(
                api.NullableUtils.map(data => {
                    return func(position, data.getPositionFunc(state), distanceSquared)
                }, api.getAttackTargetObjectData(state, name)),
                false
            )
    }
}

let _isTooFar = (api: api, state: state, currentAttackTarget, name, position, distanceSquared) => {
    return _judgeDistance(api, state, (pos1, pos2, distanceSquared) => api.vector3.distanceToSquared(pos1, pos2) > distanceSquared,
        currentAttackTarget, name, position, distanceSquared)
}

let _isBiggerThanAttackTarget = (api: api, state: state, name, currentAttackTarget, box) => {
    switch (currentAttackTarget) {
        case attackTarget.LittleMan:
            return true
        case attackTarget.Giantess:
            let usedGirl = getAttackTargetUsedGirl(state, name)

            if (usedGirl == usedGirlEnum.None) {
                return false
            }

            return api.getHeightByBox(box) >= api.getActualGirlHeight(state, usedGirl)
        default:
            return true
    }
}

let _isTooNear = (api: api, state: state, currentAttackTarget, name, position, meleeRange: nullable<meleeRange>) => {
    return api.NullableUtils.getWithDefault(
        api.NullableUtils.map(
            meleeRange => {
                return _judgeDistance(api, state, (pos1, pos2, distanceSquared) => {
                    if (distanceSquared < 100) {
                        return false
                    }

                    return api.vector3.distanceToSquared(pos1, pos2) < distanceSquared * 0.25
                }, currentAttackTarget, name, position, meleeRange * meleeRange)
            }, meleeRange
        ),
        false
    )
}

// let _isNearPlayerGiantess = (api: api, state, position, nearDistance) => {
//     return api.NumberUtils.isRandomRate(0.6)
//         && api.isPlayerGiantess(state, usedGirl)
//         // && api.isNearGirl(state, position)
//         && api.isNearObject(position, api.getPivotWorldPosition(state, usedGirl), nearDistance)
// }

export let isEnemeyGiantessWithRate = (api: api, state, rate, selfCamp_) => {
    return ArrayUtils.reduce(getCurrentUsedGirls(state), (result, usedGirl) => {
        if (result != usedGirlEnum.None) {
            return result
        }

        if (getCampExn(state, buildNameByUsedGirl(usedGirl)) != selfCamp_
            && api.NumberUtils.isRandomRate(rate)) {
            return usedGirl
        }

        return result
    }, usedGirlEnum.None)

}

export let selectArmy = (api, state, position, nearDistance, camp_) => {
    let attackTarget_, visibleData
    attackTarget_ = attackTarget.None
    visibleData = api.NullableUtils.getEmpty()

    if (api.NumberUtils.isRandomRate(0.5)) {
        api.NullableUtils.forEach(data => {
            attackTarget_ = attackTarget.Object
            visibleData = data
        }, api.findRandomNearData(state, api.getAllAliveMilltaryBuildingData, position, nearDistance, camp_))
    }

    if (api.NullableUtils.isNullable(visibleData)
        && api.NumberUtils.isRandomRate(0.5)) {
        api.NullableUtils.forEach(data => {
            attackTarget_ = attackTarget.Object
            visibleData = data
        }, api.findRandomNearData(state, api.getAllAliveSoldierData, position, nearDistance, camp_))
    }

    if (api.NullableUtils.isNullable(visibleData)
        && api.NumberUtils.isRandomRate(0.5)) {
        api.NullableUtils.forEach(data => {
            attackTarget_ = attackTarget.Object
            visibleData = data
        }, api.findRandomNearData(state, api.getAllAliveMilltaryVehicleData, position, nearDistance, camp_))
    }
    else if (api.NumberUtils.isRandomRate(0.5)) {
        api.NullableUtils.forEach(data => {
            attackTarget_ = attackTarget.Object
            visibleData = data
        }, api.findRandomNearData(state, api.getAllAliveEliteGiantessData, position, nearDistance, camp_))
    }

    return [attackTarget_, visibleData]
}

export let preHandleAttackTarget = (api, state, name, position, box, meleeRange, camp_, enemyCamp, armyDistance): [state, boolean] => {
    let currentAttackTarget = api.getAttackTarget(state, name)

    // let giantessDistance = api.getNearGirlDistance(state, api.getHeightByBox(box))

    if (
        (
            api.isNotAttackLittleMan(state)
            &&
            (
                currentAttackTarget == attackTarget.LittleMan
                // || (currentAttackTarget == attackTarget.Giantess && api.isGiantessCharacterType(state))
            )
        )
        || (_isBiggerThanAttackTarget(api, state, name, currentAttackTarget, box) && _isTooNear(api, state, currentAttackTarget, name, position, meleeRange))
    ) {
        state = api.clearAttackTargetObjectOrBuilding(state, name)
    }
    else {
        let farDistanceSqu
        switch (camp_) {
            case camp.Player:
                farDistanceSqu = 5000
                break
            // case camp.Giantess:
            case enemyCamp:
                // farDistanceSqu = giantessDistance * giantessDistance * 1.5
                farDistanceSqu = armyDistance * armyDistance * 1.5
                break
        }

        if (api.hasAttackTarget(currentAttackTarget)
            && !_isTooFar(api, state, currentAttackTarget, name, position, farDistanceSqu)
        ) {
            return [state, true]
        }
    }

    return [state, false]
}

let _updateAttackTargetForAttackCity = (state: state, name, position, box, meleeRange, camp_) => {
    let api = getModAPI(state)

    // let currentAttackTarget = api.getAttackTarget(state, name)
    const armyDistance = 500

    let data = preHandleAttackTarget(api, state, name, position, box, meleeRange, camp_, camp.Enemy, armyDistance)
    state = data[0]
    let isFinish = data[1]

    if (isFinish) {
        return state
    }


    let attackTarget_, visibleData
    attackTarget_ = attackTarget.None
    visibleData = api.NullableUtils.getEmpty()

    let usedGirl = usedGirlEnum.None

    switch (camp_) {
        case camp.Player:
            // if (api.isLevelGiantessExceptPlayer(state, usedGirl)
            //     && api.NumberUtils.isRandomRate(0.5)
            // ) {
            usedGirl = isEnemeyGiantessWithRate(api, state, 0.5, camp.Player)
            if (usedGirl != usedGirlEnum.None) {
                attackTarget_ = attackTarget.Giantess
            }
            else {
                [attackTarget_, visibleData] = selectArmy(api, state, position, armyDistance, camp_)
            }
            break
        // case camp.Giantess:
        case camp.Enemy:
            // if (_isNearPlayerGiantess(api, state, position, nearDistance)) {
            usedGirl = isEnemeyGiantessWithRate(api, state, 0.5, camp.Enemy)
            if (usedGirl != usedGirlEnum.None) {
                attackTarget_ = attackTarget.Giantess

                state = api.setAttackTargetUsedGirl(state, name, usedGirl)

                return api.setAttackTarget(state, name, attackTarget_)
            }

            [attackTarget_, visibleData] = selectArmy(api, state, position, armyDistance, camp_)

            if (api.NullableUtils.isNullable(visibleData)
                && !api.isNotAttackLittleMan(state)
            ) {
                attackTarget_ = api.getPlayerAttackTarget(state)
                state = api.setAttackTargetUsedGirl(state, name, usedGirlEnum.PlayerGirl)

                return api.setAttackTarget(state, name, attackTarget_)
            }

            break
        default:
            // throw new Error("error")
            return state
    }

    state = api.setAttackTarget(state, name, attackTarget_)
    state = api.setAttackTargetUsedGirl(state, name, usedGirl)

    return api.NullableUtils.getWithDefault(
        api.NullableUtils.map(visibleData => {
            return api.setAttackTargetObjectDataByVisibleData(state, name, visibleData)
        }, visibleData),
        state
    )
}

export let updateAttackTarget = (state: state, scene_: string, name, position, box, meleeRange, camp_) => {
    if (getLockedAttackTargetToPlayer(state) && camp_ !== getPlayerCamp()) {
        state = setAttackTargetUsedGirl(state, name, usedGirlEnum.PlayerGirl)

        return setAttackTarget(state, name, getPlayerAttackTarget(state))
    }

    switch (scene_) {
        case scene.Play:
            // if (isEnemyGiantess(state, usedGirl)) {
            //     return setAttackTarget(state, name, attackTarget.LittleMan)
            // }
            // if (isWildGiantess(state, usedGirl)) {
            //     return _updateAttackTargetForGiantess(state, name, position, NumberUtils.getRandomFloat(0.4, 1))
            // }
            // if (isPlayerGiantess(state, usedGirl)) {
            //     return _updateAttackTargetForGiantess(state, name, position, NumberUtils.getRandomFloat(0.8, 1))
            // }

            // let attackTarget_
            // if (camp_ === getPlayerCamp()) {
            //     attackTarget_ = attackTarget.None
            // }
            // else {
            //     attackTarget_ = getPlayerAttackTarget(state)
            // }

            // // console.log("updateAttackTarget: ", name, attackTarget_)

            // return setAttackTarget(state, name, attackTarget_)

            return _updateAttackTargetForAttackCity(state, name, position, box, meleeRange, camp_)
        case scene.Biwu:
            return setAttackTarget(state, name, attackTarget.LittleMan)
        default:
            return _handle(state, (service, api, state) => service.updateAttackTarget(api, state,
                name, position, box, meleeRange, camp_
            ), scene_)
    }
}

let _getData = <Data>(state: state, func: (service: service, api: api, state: state) => Data, scene: string, allServices = _getAllServices(state)) => {
    // let api = getModAPI(state)
    let api = getModAPI(state)

    return ArrayUtils.reduce<Data, service>(
        allServices,
        (result, service) => {
            if (service.getScene() != scene) {
                return result
            }

            return NullableUtils.return_(func(service, api, state))
        },
        NullableUtils.getEmpty()
    )
}


let _getAllServicesByBlockState = (blockState): Array<service> => {
    return _getPureAllBlockNames().map(blockName => {
        return BlockManager.getBlockServiceExn(blockState, modProtocolName.SceneProtocol, blockName)
    })
}


export let clearAndRegisterSceneAllMods = (state: state, scene_: string) => {
    let registerAllBlocksBlockState = BlockManager.createState()
    registerAllBlocksBlockState = registerAllBlocks(registerAllBlocksBlockState)

    let api = getModAPI(state)

    let allNeedRegisterBlockNames, allBlockNamesNotDisposeOrInit
    switch (scene_) {
        case scene.Play:
            allNeedRegisterBlockNames = [
                ...getAllNotRelatedToSceneBlockNames(),
                // "mmd-character-default",
                // "mmd-character-extend",
                // "sound-background-default",
                // "setting-default",
                // "setting-sound",
                // "enemy-elite-giantess-melee",
                // "enemy-elite-giantess-magic",
                // "enemy-elite-giantess-share-default",
                // "prop-bullet-basic",
                // "prop-bullet-submachine",
                // "prop-bullet-shot",
                // "prop-bullet-bigger",
                // "prop-bullet-smaller",
                // "particle-bullet-emit-submachine",
                // "particle-bullet-hit-submachine",
                // "particle-bullet-emit-basic",
                // "particle-bullet-hit-basic",
                // "particle-bullet-emit-shot",
                // "particle-bullet-hit-shot",
                // "particle-bullet-emit-fireball",
                // "particle-bullet-hit-fireball",
                // "particle-bullet-emit-bigger",
                // "particle-bullet-emit-smaller",
                // "particle-share-default",
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
                // "prop-other-strong",
                // "prop-other-run",
                // "prop-other-holywater",
                // "prop-share-default",
                // "prop-artifact-infinitybig",
                // "prop-artifact-callgoddess",
                // "prop-artifact-giantessstimulator",
                // "prop-artifact-giantesscontroller",
                // "prop-artifact-specificgiantess",
                // "prop-artifact-missioncomplete",
                // "behaviour-playergoddess",
                // "behaviour-attack-playergiantess",

                "event-game-hard",
                "event-game-callgoddess",
                "event-game-attack-callgiantess",

                "level-giantess-playergiantess",
                // "level-giantess-protect-boss1",
                // "level-giantess-protect-boss2",

                // "interaction-blessgirl",
                // "interaction-weapongirl",
            ]
            break
        case scene.Biwu:
            allNeedRegisterBlockNames = [
                ...getAllNotRelatedToSceneBlockNames(),
                // "mmd-character-default",
                // "mmd-character-extend",
                // "sound-background-default",
                // "setting-default",
                // "setting-sound",
                // "enemy-elite-giantess-melee",
                // "enemy-elite-giantess-magic",
                // "enemy-elite-giantess-share-default",
                // "prop-bullet-basic",
                // "prop-bullet-submachine",
                // "prop-bullet-shot",
                // "prop-bullet-bigger",
                // "prop-bullet-smaller",
                // "particle-bullet-emit-submachine",
                // "particle-bullet-hit-submachine",
                // "particle-bullet-emit-basic",
                // "particle-bullet-hit-basic",
                // "particle-bullet-emit-shot",
                // "particle-bullet-hit-shot",
                // "particle-bullet-emit-fireball",
                // "particle-bullet-hit-fireball",
                // "particle-bullet-emit-bigger",
                // "particle-bullet-emit-smaller",
                // "particle-share-default",
                "buff-strong",
                "buff-run",
                // "buff-callgoddess",
                // "buff-excitement-girl",
                // "buff-excitement-level-giantess",
                // "buff-tired-girl",
                // "buff-tired-level-giantess",
                "buff-holywater",
                "buff-giantessstimulator",
                "buff-giantesscontroller",
                // "prop-other-strong",
                // "prop-other-run",
                // "prop-other-holywater",
                // "prop-share-default",
                // "prop-artifact-infinitybig",
                // "prop-artifact-callgoddess",
                // "prop-artifact-giantessstimulator",
                // "prop-artifact-giantesscontroller",
                // "prop-artifact-specificgiantess",
                // "prop-artifact-missioncomplete",
                // "behaviour-playergoddess",
                // "behaviour-attack-playergiantess",
                // "event-game-callgoddess",
                // "event-game-attack-callgiantess",
                // "fsm-girl-excitement",
                // "fsm-level-giantess-excitement",
                // "fsm-girl-climax",
                // "fsm-level-giantess-climax",
                // "level-giantess-playergiantess",
            ]
            break
        default:
            allNeedRegisterBlockNames = _getData<Array<blockName>>(state, (service, api, state) => service.getAllBlockNames(api), scene_,
                _getAllServicesByBlockState(registerAllBlocksBlockState)
            )
            break
    }

    allBlockNamesNotDisposeOrInit = [
        "sound-background-default",
        "setting-default",
        "setting-sound",

    ]

    state = setAllBlockNames(state, allNeedRegisterBlockNames)

    // let oldBlockState = cloneBlockState(getBlockState(state))
    let oldBlockState = getBlockState(state)

    return disposeAllMods(state, NullableUtils.return_(allBlockNamesNotDisposeOrInit)).then(state => {
        let blockState = BlockManager.createState()

        // let oldBlockState = getBlockState(state)

        blockState = allNeedRegisterBlockNames.reduce((blockState, blockName) => {
            let blockProtocolName = BlockManager.getBlockProtocolName(registerAllBlocksBlockState, blockName)

            blockState = BlockManager.registerBlock(
                api,
                blockState,
                blockProtocolName,
                blockName,
                (api) => BlockManager.getBlockServiceExn<any>(registerAllBlocksBlockState, blockProtocolName, blockName),
                /*! keep block state
                * 
                */
                NullableUtils.getWithDefaultFunc(
                    BlockManager.getBlockState(oldBlockState, blockProtocolName, blockName),
                    () => BlockManager.getBlockStateExn(registerAllBlocksBlockState, blockProtocolName, blockName)
                )
                // BlockManager.getBlockStateExn(registerAllBlocksBlockState, blockProtocolName, blockName)
            )

            return blockState
        }, blockState)


        blockState = allBlockNamesNotDisposeOrInit.reduce((blockState, blockName) => {
            let blockProtocolName = BlockManager.getBlockProtocolName(registerAllBlocksBlockState, blockName)

            blockState = BlockManager.registerBlock(
                api,
                blockState,
                blockProtocolName,
                blockName,
                (api) => BlockManager.getBlockServiceExn<any>(registerAllBlocksBlockState, blockProtocolName, blockName),
                /*! keep block state
                * 
                */
                BlockManager.getBlockState(oldBlockState, blockProtocolName, blockName),
            )

            return blockState
        }, blockState)


        state = setBlockState(state, blockState)

        return initAllBlocks(state, NullableUtils.return_(allBlockNamesNotDisposeOrInit))
        // .then(state => {
        //     /*! keep block state
        //     * 
        //     */
        //     return setBlockState(state, copyBlockState(oldBlockState, getBlockState(state)))
        // })
    })
}

export let findGameEventBlockName = (state: state, scene: string, blockPartName) => {
    // let api = getModAPI(state)

    // return NullableUtils.map(
    //     blockName => {
    //         return api.blockAPI.getBlockService(state, blockProtocolName, blockName)
    //     }, _getData<string>(state, (service, api, state) => service.findGameEventBlockName(api, blockPartName), scene)
    // )
    return _getData<string>(state, (service, api, state) => service.findGameEventBlockName(api, blockPartName), scene)
}

export let updateArmyValue = <Data>(state: state, scene: string, value) => {
    return _getData<Data>(state, (service, api, state) => service.updateArmyValue(api, state, value), scene)
}

export let updateEliteGiantessValue = <Data>(state: state, scene: string, value) => {
    return _getData<Data>(state, (service, api, state) => service.updateEliteGiantessValue(api, state, value), scene)
}

export let getDifficultyData = <Data>(state: state, scene: string) => {
    return _getData<Data>(state, (service, api, state) => service.getDifficultyData(api, state), scene)
}


// export let getRandomScene = (state: state) => {
//     return NumberUtils.randomSelect(
//         _getAllServices(state).map(service => service.getScene())
//         // TODO add
//         // .concat(
//         //     [
//         //         scene.Play
//         //     ]
//         // )
//     )
// }

export let getSceneData = (state: state) => {
    let api = getModAPI(state)

    let registerAllBlocksBlockState = BlockManager.createState()
    registerAllBlocksBlockState = registerAllBlocks(registerAllBlocksBlockState)

    return _getAllServicesByBlockState(registerAllBlocksBlockState).map(service => service.getSceneData(api, state))
        .concat(
            [
                [
                    scene.Play,
                    getLanguageTextData(state, languageKey.PlayLevel)
                ]
            ]
        )
}


// let _clearAndRegisterAllMods = (state: state) => {
//     return disposeAllMods(state).then(initAllMods)
// }

export let getNextLevelData = (state: state) => {
    let api = getModAPI(state)

    let registerAllBlocksBlockState = BlockManager.createState()
    registerAllBlocksBlockState = registerAllBlocks(registerAllBlocksBlockState)

    return Promise.resolve(_getAllServicesByBlockState(registerAllBlocksBlockState).map(service => service.getNextLevelData(api, state))
        .concat(
            {
                name: getLanguageTextData(state, languageKey.EnterNextCityLevel),
                scene: scene.Play,
                levelNumber: 1
            }
        ))
}