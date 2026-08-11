import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, getParticleBlockName, getParticleProtocolName, getParticleShareBlockName, getParticleShareProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { damageType, secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { armorPiercingForceRatio, critRatio, weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"

export let getName = () => "Buff_Army_Injure_Single"

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

let _getMaxSuperPositionCount = () => 19

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
            // let v = sumValue
            let api = funcData.getModAPI(state)

            // let force = funcData.getFullHp(state, name) * 0.2
            let force = funcData.getFullHp(state, name) * 0.1
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
                1, 0, 0
            ], funcData.limitValueNotExceedOne(_computeVForColor(superPositionCount))
            )

            let promise
            if (superPositionCount == _getMaxSuperPositionCount()) {
                promise = api.damageWithSingleData(
                    state, [[force, forceDirection], [damageType_, weaponType_]],
                    weaponValue_,
                    api.getLittleManName(),
                    api.NullableUtils.getEmpty(),
                    [
                        transform,
                        box,
                        name
                    ]
                ).then(([state, _]) => {
                    return api.blockAPI.getBlockService<any>(state, getParticleShareProtocolName(), getParticleShareBlockName()).emit(state,
                        [
                            api.blockAPI.getBlockService(state, getParticleProtocolName(), getParticleBlockName()),
                            state => api.blockAPI.getBlockState<any>(state, getParticleProtocolName(), getParticleBlockName()),
                            (state, blockState) => {
                                return api.blockAPI.setBlockState(state, getParticleProtocolName(), getParticleBlockName(), blockState)
                            }
                        ],
                        api.blockAPI.getBlockService<any>(state, getParticleProtocolName(), getParticleBlockName()).getParticleType(),
                        {
                            speed: 1,
                            life: 1000,
                            size: api.getHeightByBox(box) * 2,
                            position: api.box3.getCenter(
                                box,
                                api.vector3.getTempVector1(),
                            ).toArray(),
                        })
                })
            }
            else {
                promise = Promise.resolve(state)
            }

            return promise.then(state => {
                state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
                    {
                        ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                        oldValue: funcData.NullableUtils.return_(superPositionCount)
                    }
                )

                return state
            })
        },
        deapplyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            state = funcData.ArmyBuildUtils.setInstanceColor(state, funcData, name, [
                -1, 0, 0
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

export let getLastTime = (): secondUnit => 5

export let getCharacterType = () => characterType.None

export let isPositive = () => false

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

// export let getTargetName = (api) => api.getLittleManName()

// export let addBuff = (api: api, state: state, targetName, usedGirl, lastTime, value) => {
export let addBuff = (api: api, state: state, targetName, usedGirl, value) => {
    return api.addBuff(state, getName(), targetName, usedGirl, getLastTime(), 1, getCharacterType(), value)
}