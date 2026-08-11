import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import {
    getBlockName, getProtocolName,
    createState, getParticleProtocolName, getParticleShareBlockName, getParticleShareProtocolName, setState, getBuffProtocolName, getBuffArmyExcitementBlockName, getBuffGiantessExcitementBlockName, getBuffLittleManExcitementBlockName, getParticleBlockName
} from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { service } from "buff-protocol/src/service/ServiceType"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let computeValue = (level) => {
    return level * 0.1
}

export let getSoundPath = (name) => _getPath(name, "mp3")


export let getName = () => "Buff_Emit_Excitement"

export enum languageKey {
    Description,
}

let _getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "TODO"
        },
        [language.English]: {
            [languageKey.Description]: "TODO"
        },
    }
}


export let getBuffData = (): singleBuffData => {
    return {
        name: getName(),
        imageSrc: getImageSrc(),

        isPositive: isPositive(),

        characterType: getCharacterType(),

        // value: 0.2,

        maxSuperPositionCount: 1,

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            // state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
            //     {
            //         ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
            //         oldValue: funcData.NullableUtils.return_(superPositionCount)
            //     }
            // )

            return Promise.resolve(state)
        },
        deapplyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            // state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
            //     {
            //         ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
            //         oldValue: funcData.NullableUtils.getEmpty()
            //     }
            // )

            return Promise.resolve(state)
        },
    }
}

// export let getLastTime = (): secondUnit => +Infinity

export let getCharacterType = () => characterType.LittleManOrNone

export let isPositive = () => true

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getSoundResourcePath = () => getSoundPath("sound")

export let getSoundResourceId = getSoundResourcePath

// let _hitEffect = (api: api, state, position) => {
//     return api.hitEffect(api, getParticleBlockName(), state, position)
// }

// export let addBuff = (api: api, state: state, targetName, usedGirl, count) => {
// export let addBuff = (api: api, state: state, targetName, usedGirl, count, lastTime, damagePosition) => {
//     // return api.addBuff(state, getName(), targetName, usedGirl, getLastTime(), count, getCharacterType())

//     // let { superPositionCount } = api.NullableUtils.getExn(buff)
//     // let level = superPositionCount

//     // let rate = 0.1
//     // // let rate = 1

//     // let armyValue = computeValue(level)
//     // // let armyValue = level * 0.8

//     // let position = userData.damagePosition

//     // if (!api.NullableUtils.isNullable(damagePosition)) {
//     state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
//         api.SoundManager.buildNeedToPlaySoundData(getSoundResourceId(), api.getIsDebug(state), api.getVolume(state, 0.7, damagePosition, 0))
//     ))
//     // }


//     let name = targetName

//     let promise
//     // if (api.girl.isGirl(name)) {
//     //     state = api.setGiantessAddHitEffectFunc(state, (state: state, fromName, damagePosition, damageType_, armorType_) => {
//     //         return _hitEffect(api, state, damagePosition)
//     //     })

//     //     let giantessBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffGiantessExcitementBlockName())

//     //     let giantessValue = api.girl.computeAttenuationByHeightForEffect(armyValue, state, userData.damagePartByJudge)

//     //     // promise = giantessBuffService.addBuff(api, state, name, api.NullableUtils.return_(usedGirl), life / 1000, giantessValue, {
//     //     //     damagePart: userData.damagePartByJudge,
//     //     //     actuallyDamageParts: userData.actuallyDamagePartsByJudge
//     //     // })
//     //     promise = giantessBuffService.addBuff(api, state, name, api.NullableUtils.return_(usedGirl), giantessValue)
//     // }
//     if (name == api.getLittleManName()) {
//         let littleManBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffLittleManExcitementBlockName())

//         promise = littleManBuffService.addBuff(api, state, name, count, lastTime)
//     }
//     else {
//         // state = api.setArmyAddHitEffectFunc(state, (state: state, fromName, targetName, damagePosition, damageType_, weaponValue_, armorType_) => {
//         //     return _hitEffect(api, state, damagePosition)
//         // })

//         let armyBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffArmyExcitementBlockName())

//         promise = armyBuffService.addBuff(api, state, name, api.NullableUtils.getEmpty(), count, lastTime)
//             .then(state => {
//                 return _hitEffect(api, state, damagePosition)
//             })
//     }

//     return promise
// }
export let addBuff = (api: api, state: state, targetName, usedGirl, count, lastTime, damagePosition) => {
    return api.addBuffEmitBuff(
        api, state, targetName, usedGirl, count, lastTime, damagePosition,
        getSoundResourceId(), getBuffLittleManExcitementBlockName(), getBuffArmyExcitementBlockName(), getParticleBlockName())
}