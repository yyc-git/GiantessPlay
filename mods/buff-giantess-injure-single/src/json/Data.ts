import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, getParticleBlockName, getParticleProtocolName, getParticleShareBlockName, getParticleShareProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { damageType, secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { armorPiercingForceRatio, critRatio, weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { collisionPart } from "mmd-character-protocol/src/service/ServiceType"

export let getName = () => "Buff_Giantess_Injure_Single"

export enum languageKey {
    Description,
}

let _getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "致伤攻击"
        },
        [language.English]: {
            [languageKey.Description]: "Injure Attack"
        },
    }
}

let _buildIntervalName = (name) => `${getName()}_${name}`

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

        maxSuperPositionCount: _getMaxSuperPositionCount(),

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl, superPositionCount: number, sumValue: number) => {
            // let v = sumValue

            let api = funcData.getModAPI(state)

            // let force = funcData.getGirlFullHp(state, usedGirl) * 0.2
            let force = funcData.getGirlFullHp(state, usedGirl) * 0.1
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
            //     1, 0, 0
            // ], funcData.limitValueNotExceedOne(_computeVForColor(superPositionCount)), usedGirl
            // )

            let promise
            if (superPositionCount == _getMaxSuperPositionCount()) {
                promise = api.damageGiantess(
                    state,
                    usedGirl,
                    [force, damageType_, weaponType_],
                    api.girl.buildNameByUsedGirl(usedGirl),
                    collisionPart.BoundingBox,
                    api.NullableUtils.return_(
                        api.getPivotWorldPosition(state, usedGirl)
                    ),
                    weaponValue_,
                ).then(state => {
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
                            size: api.getActualGirlHeight(state, usedGirl) * 2,
                            position: api.girl.getCenter(state, usedGirl).toArray(),
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
                        // oldValue: funcData.NullableUtils.return_(superPositionCount)
                        oldValue: api.MutableRecordUtils.set(funcData.block.getBlockState(state, getProtocolName(), getBlockName()), usedGirl, superPositionCount)
                    }
                )

                return state
            })
        },
        deapplyFunc: (state, funcData, name, usedGirl, superPositionCount: number, sumValue: number) => {
            // state = funcData.GiantessBuildUtils.setAllColor(state, funcData, [
            //     -1, 0, 0
            // ], funcData.limitValueNotExceedOne(_computeVForColor(superPositionCount)), usedGirl
            // )

            let api = funcData.getModAPI(state)

            state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
                {
                    ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                    // oldValue: funcData.NullableUtils.getEmpty()
                    oldValue: api.MutableRecordUtils.remove(funcData.block.getBlockState(state, getProtocolName(), getBlockName()), usedGirl)
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

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

// export let getTargetName = (api) => api.getLittleManName()

export let addBuff = (api: api, state: state, targetName, usedGirl, value) => {
    return api.addBuff(state, getName(), targetName, usedGirl, getLastTime(), 1, getCharacterType(), value)
}