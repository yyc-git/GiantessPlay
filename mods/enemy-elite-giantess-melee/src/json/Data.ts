import { modelData } from "enemy-elite-giantess-protocol/src/state/StateType"
import { getBlockName, getShareBlockName, getShareProtocolName } from "../script/Utils"
import { api } from "type-api/src/Type"
import { armyValue, eliteGiantessValue, emitPrecision, scale } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { armorRatio, armorStrength, defenseFactor, excitement, attackFactor, emitSpeedFactor, critRatioFactor, hp, speed, armorType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { service } from "enemy-elite-giantess-share-protocol/src/service/ServiceType"

enum animationClipIndex {
    Walk = 0,
    StompLight = 1,
    KickLight = 2,
    Death = 3,
    DeathHeadshot = 4,
    Shake = 5,
    Idle = 6,
    PickedControlled = 7,
    Lie = 8,
    StandupFromLie = 9,
    // FlyBack = 9,
    // StandupFromFlyBack = 10,
    // Dizzy = 11,
}

export let getPath = (name) => `./${getBlockName()}/src/asset/${name}.fbx`

export let getSnapshot = () => `./${getBlockName()}/src/asset/snapshot.png`

export let getStompLightSoundResourceId = () => "stomp_light"

export let getSoundPath = (name) => `./${getBlockName()}/src/asset/${name}.mp3`


export let getAnimationData = (api: api, state) => {
    let shareService = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return [
        shareService.getWalkData(),
        shareService.getStompLightData(),
        shareService.getKickLightData(),
        shareService.getDeathData(),
        shareService.getDeathHeadshotData(),
        shareService.getShakeData(),
        shareService.getIdleData(),
        shareService.getPickedControlledData(),
        shareService.getLieData(),
        shareService.getStandupFromLieData(),
    ]
}

export let getModelData = (): modelData => {
    return {
        // name: modelName.MeleeGiantess,
        resourceId: getMeleeGiantessResourceId(),
        resourcePath: getPath(getMeleeGiantessResourceId()),

        scalar: 0.01,
        positionOffset: [0, 0, 0],
    }
}

// export let getModelData = (state: state, modelName) => {
//     return NullableUtils.getExn(getConfigData(state).eliteGiantessModelData.find(d => d.name == modelName))
// }

export let getMeleeGiantessResourceId = () => "melee_giantess"

export let getValue = (api: api, state) => {
    return api.updateEliteGiantessValue(state, {
        excitement: excitement.MostHigh,

        defenseFactor: defenseFactor.Low,
        armorType: armorType.Giantess,
        armorRatio: armorRatio.Light2,
        armorStrength: armorStrength.Low * 1.5,
        // attackFactor: attackFactor.Low,
        attackFactor: attackFactor.VeryLow,
        // emitSpeedFactor: emitSpeedFactor.Low,
        emitSpeedFactor: emitSpeedFactor.VeryLow2,
        critRatioFactor: critRatioFactor.VeryLow,
        //missRatio: missRatio.VeryLow,

        hp: hp.VeryHigh2,

        // moveSpeed: speed.High2,
        // moveSpeed: speed.VeryHigh,
        moveSpeed: speed.VeryHigh / 22,

        emitPrecision: emitPrecision.Low,

        scale: scale.High,
    })
}



export let getIdleClipIndex = (name) => {
    return animationClipIndex.Idle
}

// let _getShootClipIndex = (name) => {
//     return animationClipIndex.Shoot
// }


export let getStompLightClipIndex = (name) => {
    return animationClipIndex.StompLight
}

export let getKickLightClipIndex = (name) => {
    return animationClipIndex.KickLight
}

export let getControlledClipIndex = (name) => {
    return animationClipIndex.PickedControlled
}

export let getShakeClipIndex = (name, damageType_) => {
    return animationClipIndex.Shake
}

export let getWalkClipIndex = (name) => {
    return animationClipIndex.Walk
}

export let getLieClipIndex = (name) => {
    return animationClipIndex.Lie
}

export let getStandupClipIndex = (name) => {
    return animationClipIndex.StandupFromLie
}

export let getDeathClipIndex = (api: api, state) => api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName()).getDeathClipIndex(api, animationClipIndex.Death, animationClipIndex.DeathHeadshot, animationClipIndex.Lie)
