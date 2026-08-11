import { registerDamageData } from "../script/scene/scene_city/StaticDynamic"
import { rewardData } from "../script/scene/scene_city/data/reward/RewardDataType"
import { generateEliteGiantesses as generateEliteGiantesses_ } from "../script/scene/scene_city/manage/city1/generator/ArmyGenerator"
import { mergeRewardData } from "../script/scene/scene_city/reward/RewardGenerator"
import { state } from "../type/StateType"
import { getBlockServiceExn, getBlockStateExn, setBlockState } from "./Mod"
import { service } from "enemy-elite-giantess-protocol/src/service/ServiceType"
import { service as shareService } from "enemy-elite-giantess-share-protocol/src/service/ServiceType"
import { state as shareState } from "enemy-elite-giantess-share-protocol/src/state/StateType"
import { modProtocolName } from "./data/ModData"
import { getAllServiceWithCache, getModAPI, getSceneAllBlockNames } from "../script/scene/scene_city/Mod"
import { readState } from "../state/State"
import { api } from "type-api/src/Type"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { setAnimationDurationFactor, getAnimationDurationFactor as getAnimationDurationFactorGPUSkinAnimation } from "meta3d-jiehuo-abstract/src/gpu_skin/GPUSkinAnimation"
import { computeAnimationDurationFactor } from "../script/scene/scene_city/utils/GiantessUtils"
import { getAbstractState, setAbstractState } from "../../business_layer/State"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getAnimationDurationFactor } from "../script/scene/scene_city/EliteGiantess"

let _getMeleeGiantessesBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.EnemyEliteGiantessProtocol, "enemy-elite-giantess-melee")
}

let _getMagicGiantessesBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.EnemyEliteGiantessProtocol, "enemy-elite-giantess-magic")
}

let _getShareProtocolName = () => modProtocolName.EnemyEliteGiantessShareProtocol

let _getShareBlockName = () => "enemy-elite-giantess-share-default"


let _getEliteGiantessesShareBlockService = (state: state) => {
    return getBlockServiceExn<shareService>(state, _getShareProtocolName(), _getShareBlockName())
}

export let generateEliteGiantesses = generateEliteGiantesses_

export let generateMeleeGiantesses = (state) => {
    return _getMeleeGiantessesBlockService(state).generateEliteGiantesses(getModAPI(state))
}

export let generateMagicGiantesses = (state) => {
    return _getMagicGiantessesBlockService(state).generateEliteGiantesses(getModAPI(state))
}


let _getAllBlockNames = (state) => {
    return getSceneAllBlockNames(state, [
        "enemy-elite-giantess-melee",
        "enemy-elite-giantess-magic",
    ])
}

let _getAllServicesDirectly = (state) => {
    return _getAllBlockNames(state).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.EnemyEliteGiantessProtocol, blockName)
    })
}

let _getAllServices = (state):Array<service> => {
    return getAllServiceWithCache(state, _getAllServicesDirectly, "eliteGiantess")
}

export let registerAllEliteGiantessDamageData = (state: state) => {
    let api = getModAPI(state)

    return _getAllServices(state).reduce((state, service) => {
        return registerDamageData(state, { isSelfFunc: (name) => service.isEliteGiantess(api, state, name), damageFunc: service.damage(api, state), getValueFunc: state => service.getValue(api, state) })
    }, state)
}

let _isFailResult = (result) => {
    return result === false
}

export let handleForPick = (state, func, name) => {
    // if (_getMeleeGiantessesBlockService(state).isEliteGiantess(getModAPI(state), state, name)) {
    //     let service = _getMeleeGiantessesBlockService(state)

    //     let api = getModAPI(state)

    //     return func({
    //         getModelQueueIndex: service.getModelQueueIndex(api, state),
    //         handlePickup: service.handlePickup(api),
    //         getPickedTransform: service.getPickedTransform(api, state),
    //         updateTransform: service.updateTransform(api, state),
    //         handlePickdown: service.handlePickdown(api, state),
    //         getValue: (state) => service.getValue(api, state),
    //         getHp: service.getHp(api, state),
    //         getLocalTransform: service.getLocalTransform(api, state),
    //         getBoxForPick: service.getBoxForPick(api, state)
    //     })
    // }

    // return false

    let api = getModAPI(state)

    return _getAllServices(state).reduce((result, service) => {
        if (!_isFailResult(result)) {
            return result
        }

        if (service.isEliteGiantess(api, state, name)) {
            return func({
                getModelQueueIndex: service.getModelQueueIndex(api, state),
                handlePickup: service.handlePickup(api),
                getPickedTransform: service.getPickedTransform(api, state),
                getUBControlledTransform: service.getUBControlledTransform(api, state),
                getPutToBreastTransform: service.getPutToBreastTransform(api, state),
                getPutToShoeTransform: service.getPutToShoeTransform(api, state),
                updateTransform: service.updateTransform(api, state),
                handlePickdown: service.handlePickdown(api, state),
                handleFall: service.handleFall(api, state, name),
                handleUBControl: service.handleUBControl(api),
                handlePutToBreast: service.handlePutToBreast(api),
                handlePutToShoe: service.handlePutToShoe(api),
                updateUBControlledTransform: service.updateUBControlledTransform(api, state),
                updatePutToBreastTransform: service.updatePutToBreastTransform(api, state),
                updatePutToShoeTransform: service.updatePutToShoeTransform(api, state),
                getValue: (state) => service.getValue(api, state),
                getHp: service.getHp(api, state),
                getLocalTransform: service.getLocalTransform(api, state),
                getBoxForPick: service.getBoxForPick(api, state)
            })
        }

        return result
    }, false)
}

export let getAllModelQueues = (state) => {
    return _getEliteGiantessesShareBlockService(state).getAllModelQueues(getModAPI(state), state)
}

export let getModelQueueIndex = (state, name) => {
    return _getEliteGiantessesShareBlockService(state).getModelQueueIndex(getModAPI(state))(state, name)
}


export let handleForLODQueueObjectUtils = (state, handleNotEmptyFunc, name) => {
    // if (_getMeleeGiantessesBlockService(state).isEliteGiantess(getModAPI(state), state, name)) {
    //     // return handleNotEmptyFunc(state, _getMeleeGiantessesBlockService(state), name)
    //     return handleNotEmptyFunc(state, {
    //         getHpRatio: _getMeleeGiantessesBlockService(state).getHpRatio(getModAPI(state))
    //     }, name)
    // }

    // return false

    let api = getModAPI(state)

    return _getAllServices(state).reduce((result, service) => {
        if (!_isFailResult(result)) {
            return result
        }

        if (service.isEliteGiantess(api, state, name)) {
            return handleNotEmptyFunc(state, {
                getHp: service.getHp(api),
                getFullHp: state => service.getFullHp(api, state),
                updateHp: (state, name, hp) => service.updateHp(api, state, name, hp),
                getNamePrefix: () => service.getNamePrefixEliteGiantess(api, state),
                getSnapshot: service.getSnapshot,
                createInitialState: service.createInitialState(api, state),
                getModelName: () => service.getNamePrefixEliteGiantess(api, state),

                getHpRatio: service.getHpRatio(api),
                handleRepel: service.handleRepel(api, state),
            }, name)
        }

        return result
    }, false)
}

// export let getNamePrefix = (state, name) => {
//     // if (_getMeleeGiantessesBlockService(state).isEliteGiantess(getModAPI(state), state, name)) {
//     //     return "近战巨大娘"
//     // }

//     // return false
// }

export let getBloodDecalQueue = (state) => {
    return _getEliteGiantessesShareBlockService(state).getBloodDecalQueue(getModAPI(state), state)
}

export let getRewardData = (state): rewardData => {
    let api = getModAPI(state)

    return _getAllServices(state).reduce((result, service) => {
        return mergeRewardData(result, service.getRewardData(api, state))
    }, {})
}

export let parseNamePrefix = (state, name) => {
    // let service = _getMeleeGiantessesBlockService(state)

    // if (service.isEliteGiantess(getModAPI(state), state, name)) {
    //     return service.getNamePrefixEliteGiantess(getModAPI(state), state)
    // }

    // return false

    let api = getModAPI(state)

    return _getAllServices(state).reduce((result, service) => {
        if (!_isFailResult(result)) {
            return result
        }

        if (service.isEliteGiantess(api, state, name)) {
            return service.getNamePrefixEliteGiantess(getModAPI(state), state)
        }

        return result
    }, false)
}

export let isEliteGiantess = (state, name) => {
    // let service = _getEliteGiantessesShareBlockService(state)

    // return service.isEliteGiantess(name)

    let api = getModAPI(state)

    return _getAllServices(state).reduce((result, service) => {
        if (!_isFailResult(result)) {
            return result
        }

        if (service.isEliteGiantess(api, state, name)) {
            return true
        }

        return result
    }, false)
}

export let getHpMap = (state) => {
    return getBlockStateExn<shareState>(state, _getShareProtocolName(), _getShareBlockName()).hpMap
}

export let setHpMap = (state, hpMap) => {
    return setBlockState(state, _getShareProtocolName(), _getShareBlockName(), {
        ...getBlockStateExn<shareState>(state, _getShareProtocolName(), _getShareBlockName()),
        hpMap
    })
}

export let isMaxHeight = (height) => {
    return height >= 1000
}

export let isMinHeight = (height) => {
    return height < 10
}

export let isMaxScale = (currentScale) => {
    return currentScale >= 400
}

export let limitScale = (currentScale, newScale) => {
    if (isMaxScale(newScale)) {
        return currentScale
    }

    return newScale
}

// export let scaleEliteGiantess = (api: api, getNewSizeYFunc, [matrix, box]) => {
export let scaleEliteGiantess = (api: api, state: state, getNewSizeYFunc, [matrix, box], name) => {
    let size = api.box3.getSize(box, api.vector3.getTempVector1())

    let newSizeY = getNewSizeYFunc(size.y)

    if (api.isEliteGiantessMaxHeight(newSizeY)
        || api.isEliteGiantessMinHeight(newSizeY)
    ) {
        return [state, [matrix, box]]
    }

    state = updateAnimationDurationFactor(state, name, newSizeY)

    let factor = newSizeY / size.y
    // if (factor < 1) {
    //     throw new Error("err")
    // }

    let offsetY = size.y * (factor - 1) * 0.5
    size = api.vector3.multiplyScalar(size, factor)

    let center = api.box3.getCenter(box, api.vector3.getTempVector2())

    let _ = api.box3.copy(
        box,
        api.box3.setFromCenterAndSize(
            api.box3.getTempBox1(),
            api.vector3.setY(
                center,
                center.y + offsetY
            ),
            size
        )
    )

    let scale = api.matrix4.getScaleFromMatrix4(matrix)
    scale = api.vector3.multiplyScalar(scale, factor)
    let _matrix = api.matrix4.setScaleToMatrix4(matrix, scale)

    return [state, [matrix, box]]
}

export let isEliteGiantessLODQueue = (state, queue: LODQueue) => {
    return isEliteGiantess(state, queue.name)
}

export let updateWeaponValue = (state, weaponValue, box) => {
    let api = getModAPI(state)

    return _getEliteGiantessesShareBlockService(state).updateWeaponValue(api, weaponValue, box)
}

export let getStateMachine = (state, name) => {
    let api = getModAPI(state)

    return _getEliteGiantessesShareBlockService(state).getStateMachine(api)(state, name)
}

export let setStateMachine = (state, name, stateMachine) => {
    let api = getModAPI(state)

    return _getEliteGiantessesShareBlockService(state).setStateMachine(api)(state, name, stateMachine)
}

export let updateAnimationDurationFactor = (state: state, name, height: number) => {
    // return setAbstractState(state, setAnimationDurationFactor(getAbstractState(state), name, NumberUtils.lessThan(computeAnimationDurationFactor(height), 4)))
    return setAbstractState(state, setAnimationDurationFactor(getAbstractState(state), name, NumberUtils.lessThan(computeAnimationDurationFactor(height) * getAnimationDurationFactor(state), 4)))
}

// export let getAnimationDurationFactor = (state: state, name) => {
//     return setAbstractState(state, getAnimationDurationFactorGPUSkinAnimation(getAbstractState(state), name))
// }

export let stopAndRemoveMoveDataAndTween = (state, name) => {
    let api = getModAPI(state)

    return _getEliteGiantessesShareBlockService(state).stopAndRemoveMoveDataAndTween(api)(state, name)
}


export let getInitialQuaternion = (state, modelName) => {
    let api = getModAPI(state)

    return _getEliteGiantessesShareBlockService(state).getInitialQuaternion(api, state, modelName)
}
