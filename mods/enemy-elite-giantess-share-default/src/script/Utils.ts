import { state } from "enemy-elite-giantess-share-protocol/src/state/StateType"
import { readState } from "frontend/src/business_layer/State"
import { getModAPI } from "frontend/src/scene3d_layer/script/scene/scene_city/Mod"
import { scale, weaponValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { language } from "frontend/src/scene3d_layer/type/StateType"
import { api, box3 } from "type-api/src/Type"

export let getProtocolName = () => "enemy-elite-giantess-share-protocol"

export let getBlockName = () => "enemy-elite-giantess-share-default"


export let getWeaponProtocolName = () => "weapon-protocol"

export let getWeaponWalkBlockName = () => "weapon-walk"


export let getPropBulletProtocolName = () => "prop-bullet-protocol"

export let getPropBulletBiggerBlockName = () => "prop-bullet-bigger"

export let getPropBulletSmallerBlockName = () => "prop-bullet-smaller"

export let getPropOtherProtocolName = () => "prop-other-protocol"

export let getPropStrongBiggerBlockName = () => "prop-other-strong"


export let getEliteGiantessSkinMesh = api => (group) => {
    let meshes = []

    api.gameObject.forEach(group, o => {
        if (api.gameObject.isSkinnedMesh(o)) {
            meshes.push(o)
        }
    })

    if (meshes.length > 1) {
        throw new Error("err")
    }

    return meshes[0]
}

export let getState = (api: api, state) => {
    return api.blockAPI.getBlockState<state>(state,
        getProtocolName(),
        getBlockName()
    )
}

export let setState = (api: api, state, s) => {
    return api.blockAPI.setBlockState(state,
        getProtocolName(),
        getBlockName(),
        s
    )
}

export let hasQueue = (api, state, categoryName) => {
    return api.MutableMapUtils.has(getState(api, state).eliteGiantessMap, categoryName)
}

export let getQueue = (api, state, categoryName) => {
    return api.MutableMapUtils.getExn(getState(api, state).eliteGiantessMap, categoryName)
}

export let setData = (api) => {
    return (state, categoryName, queue, _) => {
        return setState(api, state,
            {
                ...getState(api, state),
                eliteGiantessMap: api.MutableMapUtils.set(getState(api, state).eliteGiantessMap, categoryName, queue),
            }
        )
    }
}

export let getClipData = (api, state, categoryName): [Array<number>, Array<number>] => {
    return [
        api.MutableMapUtils.getExn(getState(api, state).allClipDurations, categoryName),
        api.MutableMapUtils.getExn(getState(api, state).allClipSteps, categoryName),
    ]
}

export let setClipData = (api, state, categoryName, allClipDurations, allClipSteps) => {
    return setState(api, state,
        {
            ...getState(api, state),
            allClipDurations: api.MutableMapUtils.set(getState(api, state).allClipDurations, categoryName, allClipDurations),
            allClipSteps: api.MutableMapUtils.set(getState(api, state).allClipSteps, categoryName, allClipSteps),
        }
    )
}

export let getInitialQuaternion = (api: api, state, categoryName) => {
    return api.MutableMapUtils.getExn(getState(api, state).initialQuaternionMap, categoryName)
}

// export let getStateMachine = (api: api) => (state, name: string) => {
//     return api.MutableMapUtils.getExn(getState(api, state).stateMachineMap, name)
// }
export let getStateMachine = (api: api) => (state, name: string) => {
    // return api.getStateMachine(name, api.MutableMapUtils.getExn(getState(api, state).stateMachineMap, name))
    return api.getStateMachine(name, api.MutableMapUtils.get(getState(api, state).stateMachineMap, name))
}


export let setStateMachine = (api: api) => (state, name: string, stateMachine) => {
    return setState(api, state, {
        ...getState(api, state),
        stateMachineMap: api.MutableMapUtils.set(getState(api, state).stateMachineMap, name, stateMachine)
    })
}

export let getModelQueue = (api: api) => (state, name: string) => {
    return api.LOD.getLODQueue(api.getAbstractState(state), name)
}

export let getModelQueueIndex = (api: api) => (state, name) => {
    return api.MutableMapUtils.getExn(getState(api, state).lodQueueIndexMap, name)
}


export let getAllModelQueues = (api, state) => {
    return api.MutableMapUtils.values(getState(api, state).eliteGiantessMap)
}

export let getBloodDecalQueue = (api, state) => {
    return getState(api, state).bloodData.bloodDecalQueue
}


export enum languageKey {
    EliteGiantess,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.EliteGiantess]: "精英巨大娘",
        },
        [language.English]: {
            [languageKey.EliteGiantess]: "Elite Giantess",
        },
    }
}


// export let getNamePrefix = () => "elite_giantess"

// TODO refactor: not dependent on frontend
// export let getNamePrefix = () => getModAPI(readState()).getLanguageDataByData(readState(), getTextData(), languageKey.EliteGiantess)



// export let isEliteGiantess = (name: string) => {
//     return name.includes(getNamePrefix())
// }


export let computeHeight = (scale) => {
    return scale * 2.5
}


let _updateWeaponValue = (value, height) => {
    return value * (height / computeHeight(scale.Middle))
}

let _updateMeleeRange = (height, meleeRange) => {
    return height * meleeRange
}

let _updateEmitterVolume = (api: api, scale, emitterVolume) => {
    // return api.NumberUtils.clamp(Math.cbrt(scale), 1, 5) * emitterVolume
    return api.NumberUtils.clamp(Math.sqrt(scale) / 2, 0.8, 4) * emitterVolume
}

export let updateWeaponValue = (api: api, weaponValue_: weaponValue, box: box3) => {
    let height = api.getHeightByBox(box)
    let scale = api.computeScaleByBox(box)
    // let sqrtHeight = Math.sqrt(height)

    return {
        ...weaponValue_,
        force: api.computeForceByHeight(height, weaponValue_.force),
        meleeRange: api.NullableUtils.map(meleeRange => {
            return _updateMeleeRange(height, meleeRange)
        }, weaponValue_.meleeRange),

        // emitterSpeed: _updateWeaponValue(weaponValue_.emitterSpeed, sqrtHeight),
        // emitterSize: _updateWeaponValue(weaponValue_.emitterSize, sqrtHeight),
        // emitterCollisionSize: _updateWeaponValue(weaponValue_.emitterCollisionSize, sqrtHeight),
        emitterSpeed: api.limitNonBulletEmitterSpeed(_updateWeaponValue(weaponValue_.emitterSpeed, height)),
        emitterSize: _updateWeaponValue(weaponValue_.emitterSize, height),
        emitterCollisionSize: _updateWeaponValue(weaponValue_.emitterCollisionSize, height),

        explodeRange: _updateWeaponValue(weaponValue_.explodeRange, Math.cbrt(height)),
        // explodeRange: _updateWeaponValue(weaponValue_.explodeRange, height),

        emitterVolume: _updateEmitterVolume(api, scale, weaponValue_.emitterVolume),
    }
}