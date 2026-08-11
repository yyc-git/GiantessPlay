import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import {
    getBlockName, getProtocolName,
    createState, getParticleBlockName, getParticleProtocolName, getParticleShareBlockName, getParticleShareProtocolName, setState, getBuffProtocolName, getBuffArmyCharmBlockName, getBuffGiantessCharmBlockName, getBuffLittleManCharmBlockName
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


export let getName = () => "Buff_Emit_Charm"

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

export let isPositive = () => false

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getSoundResourcePath = () => getSoundPath("sound")

export let getSoundResourceId = getSoundResourcePath

export let addBuff = (api: api, state: state, targetName, usedGirl, count, lastTime, damagePosition) => {
    return api.addBuffEmitBuff(
        api, state, targetName, usedGirl, count, lastTime, damagePosition,
        getSoundResourceId(), getBuffLittleManCharmBlockName(), getBuffArmyCharmBlockName(), getParticleBlockName())
}