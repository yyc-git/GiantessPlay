import { modelData } from "enemy-elite-giantess-protocol/src/state/StateType"
import { getBlockName, getShareBlockName, getShareProtocolName } from "../script/Utils"
import { api } from "type-api/src/Type"
import { armyValue, eliteGiantessValue, emitPrecision, scale } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { armorRatio, armorStrength, defenseFactor, excitement, attackFactor, emitSpeedFactor, critRatioFactor, hp, speed, armorType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { service } from "enemy-elite-giantess-share-protocol/src/service/ServiceType"

enum animationClipIndex {
    Walk = 0,
    StompHeavy = 1,
    MagicAttack1 = 2,
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

export let getSoundPath = (name) => `./${getBlockName()}/src/asset/${name}.mp3`

export let getMagicAttack1EmitSoundResourceId = () => "magic_attack1_emit"

export let getStompHeavySoundResourceId = () => "stomp_heavy"

export let getAnimationData = (api: api, state) => {
    let shareService = api.blockAPI.getBlockService<service>(state, getShareProtocolName(), getShareBlockName())

    return [
        shareService.getWalkData(),
        shareService.getStompHeavyData(),
        shareService.getMagicAttack1Data(),
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
        resourceId: getMagicGiantessResourceId(),
        resourcePath: getPath(getMagicGiantessResourceId()),

        scalar: 0.01,
        positionOffset: [0, 3000, 0],
    }
}

// export let getModelData = (state: state, modelName) => {
//     return NullableUtils.getExn(getConfigData(state).eliteGiantessModelData.find(d => d.name == modelName))
// }

export let getMagicGiantessResourceId = () => "magic_giantess"

export let getValue = (api: api, state) => {
    return api.updateEliteGiantessValue(state, {
        excitement: excitement.MostHigh,

        defenseFactor: defenseFactor.VeryLow,
        armorType: armorType.Giantess,
        armorRatio: armorRatio.Light3,
        // armorRatio: armorRatio.Light,
        armorStrength: armorStrength.Low * 1.5,
        // armorStrength: armorStrength.VeryLow * 1.5,
        // armorStrength: armorStrength.VeryLow2,
        attackFactor: attackFactor.VeryLow,
        emitSpeedFactor: emitSpeedFactor.VeryLow2,
        critRatioFactor: critRatioFactor.VeryLow,
        //missRatio: missRatio.VeryLow,

        hp: hp.High,

        moveSpeed: speed.High2 / 16,

        emitPrecision: emitPrecision.Low,

        scale: scale.Middle,
    })
}



export let getIdleClipIndex = (name) => {
    return animationClipIndex.Idle
}

// let _getShootClipIndex = (name) => {
//     return animationClipIndex.Shoot
// }


export let getStompHeavyClipIndex = (name) => {
    return animationClipIndex.StompHeavy
}

export let getMagicAttack1ClipIndex = (name) => {
    return animationClipIndex.MagicAttack1
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
