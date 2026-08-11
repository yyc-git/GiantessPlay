import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { damageType, secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { armorPiercingForceRatio, critRatio, weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { collisionPart } from "mmd-character-protocol/src/service/ServiceType"

export let getName = () => "Buff_Giantess_Poison_Single"

export enum languageKey {
    Description,
}

let _getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "毒气攻击"
        },
        [language.English]: {
            [languageKey.Description]: "Poison Attack"
        },
    }
}

let _buildIntervalName = (name) => `${getName()}_${name}`

let _getMaxSuperPositionCount = () => 29
// let _getMaxSuperPositionCount = () => 2

let _computeVForColor = (superPositionCount) => {
    return superPositionCount / _getMaxSuperPositionCount()
}


export let getBuffData = (): singleBuffData => {
    return {
        name: getName(),
        imageSrc: getImageSrc(),

        isPositive: isPositive(),

        characterType: getCharacterType(),

        // value: 0.2,

        maxSuperPositionCount: _getMaxSuperPositionCount(),

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            let v = sumValue

            let api = funcData.getModAPI(state)

            let force = funcData.getGirlFullHp(state, usedGirl_) * v
            // let forceDirection = api.buildRandomDirectionInXZ()
            let damageType_ = damageType.Global
            let weaponType_ = weaponType.EffectSelf
            let weaponValue_ = api.buildEffectWeaponValue(
                force,
                armorPiercingForceRatio.Middle,
                weaponType_,
                critRatio.Zero
            )

            // state = funcData.GiantessBuildUtils.setAllColor(state, funcData, [
            //     0, 1, 0
            // ], funcData.limitValueNotExceedOne(_computeVForColor(superPositionCount)), usedGirl_
            // )

            let fromName = api.NullableUtils.getExn(funcData.block.getBlockState(state, getProtocolName(), getBlockName()).customData.fromName)

            state = funcData.setAbstractState(state, funcData.Flow.addInterval(
                funcData.getAbstractState(state), [
                funcData.getAbstractState,
                funcData.setAbstractState,
                (state) => {
                    if (!api.isUseGirl(state, usedGirl_)) {
                        return Promise.resolve(state)
                    }

                    // console.log(
                    //     fromName,
                    //     superPositionCount,
                    //     // funcData.getBodyHp(state, usedGirl_),
                    //     force,
                    //     force / funcData.getGirlFullHp(state, usedGirl_)
                    // )


                    return api.damageGiantess(
                        state,
                        usedGirl_,
                        [force, damageType_, weaponType_],
                        fromName,
                        collisionPart.BoundingBox,
                        api.NullableUtils.return_(
                            api.getPivotWorldPosition(state, usedGirl_)
                        ),
                        weaponValue_,
                    )
                },
            ],
                2,
                _buildIntervalName(name)
            ))

            // state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
            //     {
            //         ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
            //         oldValue: funcData.NullableUtils.return_(superPositionCount)
            //     }
            // )

            return Promise.resolve(state)
        },
        deapplyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            state = funcData.setAbstractState(
                state,
                funcData.Flow.clearInterval(
                    funcData.getAbstractState(state),
                    _buildIntervalName(name)
                )
            )

            // state = funcData.GiantessBuildUtils.setAllColor(state, funcData, [
            //     0, -1, 0
            // ], funcData.limitValueNotExceedOne(_computeVForColor(superPositionCount)), usedGirl_
            // )

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

export let getLastTime = (): secondUnit => 8

export let getCharacterType = () => characterType.GiantessOrNone

export let isPositive = () => false

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

// export let getTargetName = (api) => api.getLittleManName()

export let addBuff = (api: api, state: state, fromName, usedGirl_, value) => {
    state = api.blockAPI.setBlockState(state, getProtocolName(), getBlockName(),
        {
            ...api.blockAPI.getBlockState<any>(state, getProtocolName(), getBlockName()),
            customData: {
                fromName
            }
        }
    )

    return api.addBuff(state, getName(), api.girl.buildNameByUsedGirl(usedGirl_), usedGirl_, getLastTime(), 1, getCharacterType(), value)
}