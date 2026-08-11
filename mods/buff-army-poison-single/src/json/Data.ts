import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { damageType, secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { armorPiercingForceRatio, critRatio, weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"

export let getName = () => "Buff_Army_Poison_Single"

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


let _buildIntervalName = (name) => `${getName()}_${name}`

let _getMaxSuperPositionCount = () => 29

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

        // maxSuperPositionCount: 1,
        maxSuperPositionCount: _getMaxSuperPositionCount(),

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            let v = sumValue

            let api = funcData.getModAPI(state)

            let force = funcData.getFullHp(state, name) * v
            let forceDirection = api.buildRandomDirectionInXZ()
            let damageType_ = damageType.Global
            let weaponType_ = weaponType.EffectSelf
            let weaponValue_ = api.buildEffectWeaponValue(
                force,
                armorPiercingForceRatio.Middle,
                weaponType_,
                critRatio.Zero
            )

            let box = api.getArmyBoxByName(state, name)
            let transform = api.getArmyTransformByName(state, name)

            state = funcData.ArmyBuildUtils.setInstanceColor(state, funcData, name, [
                0, 1, 0
            ], funcData.limitValueNotExceedOne(_computeVForColor(superPositionCount))
            )

            let fromName = api.NullableUtils.getExn(funcData.block.getBlockState(state, getProtocolName(), getBlockName()).customData.fromName)

            state = funcData.setAbstractState(state, funcData.Flow.addInterval(
                funcData.getAbstractState(state), [
                funcData.getAbstractState,
                funcData.setAbstractState,
                (state) => {
                    return api.damageWithSingleData(
                        state, [[force, forceDirection], [damageType_, weaponType_]],
                        weaponValue_,
                        // api.getLittleManName(),
                        fromName,
                        api.NullableUtils.getEmpty(),
                        [
                            transform,
                            box,
                            name
                        ]
                    ).then(([state, _]) => {
                        return state
                    })
                },
            ],
                2,
                _buildIntervalName(name)
            ))

            state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
                {
                    ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                    oldValue: funcData.NullableUtils.return_(superPositionCount)
                }
            )

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

            state = funcData.ArmyBuildUtils.setInstanceColor(state, funcData, name, [
                0, -1, 0
            ], funcData.limitValueNotExceedOne(_computeVForColor(superPositionCount))
            )


            state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
                {
                    ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                    oldValue: funcData.NullableUtils.getEmpty()
                }
            )

            return Promise.resolve(state)
        },
    }
}

export let getLastTime = (): secondUnit => 8

export let getCharacterType = () => characterType.None

export let isPositive = () => false

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

// export let getTargetName = (api) => api.getLittleManName()

// export let addBuff = (api: api, state: state, targetName, usedGirl, lastTime, value) => {
export let addBuff = (api: api, state: state, targetName, fromName, value) => {
    state = api.blockAPI.setBlockState(state, getProtocolName(), getBlockName(),
        {
            ...api.blockAPI.getBlockState<any>(state, getProtocolName(), getBlockName()),
            customData: {
                fromName
            }
        }
    )

    return api.addBuff(state, getName(), targetName, api.NullableUtils.getEmpty(), getLastTime(), 1, getCharacterType(), value)
}