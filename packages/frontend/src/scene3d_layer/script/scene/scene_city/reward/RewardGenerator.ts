import { ParticleManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../state/State"
import { state } from "../../../../type/StateType"
// import { emitterLife, emitterSize, emitterSpeed } from "../data/ValueType"
import { getPlayerBox, getPlayerPosition, isNearObject, isPlayer, isPlayerCamp, isPlayerGiantess } from "../utils/PlayerUtils"
import { Vector3 } from "three"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getParticleNeedCollisionCheckLoopCount } from "../utils/ArmyUtils2"
import { addGemInLevel, getActualLevelGem, getValue, setGem } from "./Gem"
import { Billboard } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getCoinResourceId, getConfigData, getGetCoinResourceId, getGetPropResourceId, getGirlScale, getScene, getState, isGiantessCharacterType, isGiantessCharacterTypeByUsedGirl, isLittleCharacterType, mutableSetState, setState } from "../CityScene"
import { propData, propDataBackend, propName, propNotOutLevelBuild, propOnGround, reward, usedGirlEnum } from "../type/StateType"
import { List } from "immutable"
import { name, characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { getCountFunc, propData as propDataRewardData, rewardData as rewardDataType, rewardSingleData } from "../data/reward/RewardDataType"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { getGiantessExperienceValue, getLittleManExperienceValue, setExperienceValue } from "../build/Upgrade"
import * as Backend from "backend/src/Main"
import { addPropCount, buildAllProps, findOriginPropData, getPropByName, initProps, isPropExist } from "./Prop"
import { Event } from "meta3d-jiehuo-abstract"
import { buildGetPropEventData, getGetPropEventName, getPickPropRangeDistanceFactorForLittleManEventName } from "../../../../utils/EventUtils"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getIsDebug, getIsProduction } from "../../Scene"
import { getSystemVolume } from "../utils/SoundUtils"
import { isEnteringNextLevel } from "../manage/mission/Mission"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { computeGemFactor, computePropRewardFactor, getAutoDifficulty, getCurrentDifficultyData } from "../difficulty/Difficulty"
import { getCamp, getCampExn } from "../manage/city1/Army"
import { computeHeight, getFactorByScale, getPositionParrelToObj } from "../girl/Utils"
import { addCoinInLevel, getValue as getCoinValue, getLevelCoin, setCoin } from "./Coin"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { isGirl, isPlayerGirl, isPlayerGoddess as isPlayerGoddessGirl, isUseGirl, getValue as getValueGirl, getSkillData, isPlayerGirlByName, getUsedGirlByName, isPlayerGirlOrGiantess } from "../girl/Girl"
import { isLittleMan, getValue as getValueLittleMan } from "../little_man/LittleMan"
import { getExpFactor, isUseCareer } from "../build/Career"
import { Scene } from "meta3d-jiehuo-abstract"
import { getTotalCoinConvertFromHp, isUseFullHpReplaceCoinCharacterTypes } from "../../../../mod/CareerMod"
import { luck } from "../data/ValueType"
import { getAnimationData } from "../data/Const"
import { getCurrentAnimationName } from "../girl/Animation"
import { getIsShowCoinAnimation, getIsShowGemAnimation, getIsGenerateProp } from "../UI"
import { isArtifact, isReviveOrCapture } from "../../../../mod/PropOtherMod"
import { isActive } from "../User"
import { getPosition } from "../little_man/Transform"

type rewardDataBackend = {
    gem: number,

    props: Array<propDataBackend>,
}

type rewardData = {
    gem: number,

    props: Array<propData>,
}

const _v1 = new Vector3();
const _v2 = new Vector3();

export let getRewardState = (state): reward => {
    return getState(state).reward
}

export let setRewardState = (state, rewardState: reward) => {
    return setState(state, {
        ...getState(state),
        reward: rewardState
    })
}

export let mutableSetRewardState = (state, rewardState: reward) => {
    // return mutableSetState(state, {
    //     ...getState(state),
    //     reward: rewardState
    // })
    // getState(state).reward = rewardState
    readState().cityScene.reward = rewardState
    // console.log(readState().cityScene.reward)

    // return mutableSetState(state, {
    //     ...getState(state),
    //     reward: rewardState
    // })
    return state
}


let _getYOffset = () => 1.5

let _addOffset = (position, offset) => {
    return position.clone().set(position.x + offset * NumberUtils.getRandomValue1(), position.y + _getYOffset(), position.z + offset * NumberUtils.getRandomValue1())
}

let _computeCountByLuck = (count, luck_) => {
    if (luck_ == luck.Middle) {
        return count
    }

    luck_ = NumberUtils.greaterThan(luck_, 0.1)

    // return NumberUtils.greaterThan(Math.round(NumberUtils.getRandomFloat(
    //     luck_ / 2, luck_ * 2
    // ) * count), 1)
    return NumberUtils.greaterThan(NumberUtils.getRandomFloat(
        luck_ / 2, luck_ * 2
    ) * count, 1)
}

export let computeCountByLuck = (state, count) => {
    let luck_ = _getLuck(state)

    return Math.round(_computeCountByLuck(count, luck_))
}

let _getGeneratePropRate = (state: state, data: propDataRewardData) => {
    if (isArtifact(state, data.name)) {
        let factor
        if (isActive(state)) {
            // factor = 1.3
            // factor = 1.5
            factor = 2
        }
        else {
            factor = 1
        }

        return data.getRateFunc(state) * computePropRewardFactor(state, getCurrentDifficultyData(state)) * factor
    }
    else if (isReviveOrCapture(state, data.name)) {
        let factor
        if (isActive(state)) {
            // factor = 1.5
            factor = 2
        }
        else {
            factor = 1
        }

        return data.getRateFunc(state) * factor
    }

    return data.getRateFunc(state)
}

// export let generateProp = (state: state, prop: Array<propDataRewardData>, countFactor, luck, position, offset) => {
export let generateProp = (state: state, prop: Array<propDataRewardData>, luck, position, offset) => {
    return prop.reduce((state, data) => {
        // return ArrayUtils.range(0, data.getCountFunc(state) - 1).reduce((state, i) => {
        // }, state)

        if (!NumberUtils.isRandomRate(_getGeneratePropRate(state, data))) {
            return state
        }

        let count = NumberUtils.greaterThan(computePropCountByPropCountFactor(Math.round(_computeCountByLuck(data.getCountFunc(state), luck)), state), 1)

        if (count <= 0) {
            return state
        }

        let newPosition = _addOffset(position, offset)

        let image = Billboard.createImage(getAbstractState(state),
            data.name,
            NullableUtils.return_(
                newPosition,
            ),
            NullableUtils.getEmpty(),
            {
                isSizeAttenuation: true,
                isAlwaysShow: false,
                width: 2,
                height: 2,
            }
        )

        getScene(state).add(image)

        let prop = getPropByName(state, data.name)

        return setRewardState(state, {
            ...getRewardState(state),
            propsOnGround: getRewardState(state).propsOnGround.push({
                name: data.name,
                title: prop.title,
                description: prop.description,
                position: newPosition,
                image: image,
                // count: _attenuationByHeight(state, _computeCountByLuck(data.getCountFunc(state), luck), fromName, 0.2),
                // count: Math.ceil(_computeCountByLuck(data.getCountFunc(state), luck) * countFactor),
                count: count,
                imageSrc: prop.imageSrc
            })
        })
    }, state)
}

// let _generateCoin = (state: state, coin: getCountFunc, position, offset) => {
//     return ArrayUtils.range(0, coin(state) - 1).reduce((state, i) => {
//         let newPosition = _addOffset(position, offset)

//         let image = Billboard.createImage(getAbstractState(state),
//             getCoinResourceId(),
//             NullableUtils.return_(
//                 newPosition,
//             ),
//             NullableUtils.getEmpty(),
//             {
//                 isSizeAttenuation: true,
//                 isAlwaysShow: false,
//                 width: 1.5,
//                 height: 1.5,
//             }
//         )

//         getScene(state).add(image)

//         return setRewardState(state, {
//             ...getRewardState(state),
//             coinsOnGround: getRewardState(state).coinsOnGround.push({
//                 position: newPosition,
//                 image: image,
//             })
//         })
//     }, state)
// }

let _getValue = (state: state, getValueFunc, fromName, startPosition) => {
    let { emitterSpeed, emitterLife, emitterSize } = getValueFunc(state)

    let factor, lifeFactor
    if (isPlayerGirlOrGiantess(state, getUsedGirlByName(fromName))) {
        factor = getFactorByScale(state, getUsedGirlByName(fromName), [
            {
                scale: 30,
                factor: 1
            },
            {
                scale: 60,
                factor: 2
            },
            {
                scale: 100,
                factor: 3
            },
            {
                scale: 500,
                factor: 4
            },
            {
                scale: 1000,
                factor: 6
            },
            {
                scale: 2000,
                factor: 8
            },
            {
                scale: 4000,
                factor: 13
            },
            {
                scale: 8000,
                factor: 19
            },
            {
                scale: 15000,
                factor: 25
            },
            {
                factor: 35
            },
        ])
        lifeFactor = 1
    }
    else if (isLittleCharacterType(state)) {
        factor = NumberUtils.clamp(getPosition(state).distanceTo(startPosition) / 100, 1, 5)
        lifeFactor = factor * 2
    }
    else {
        factor = 1
        lifeFactor = 1
    }

    if (isGiantessCharacterTypeByUsedGirl(state, getUsedGirlByName(fromName))) {
        emitterSize *= factor
        lifeFactor = factor
    }

    emitterSpeed *= factor
    emitterLife *= lifeFactor

    return [emitterSize, emitterSpeed, emitterLife]
}

// let _attenuationByHeight = (state: state, value: number, fromName: name, factor = 0.5) => {
// let _attenuationByHeight = (state: state, value: number, fromName: name, factor = 0.1) => {
let _attenuationByHeight = (state: state, value: number, fromName: name, factor = 0.07) => {
    if (isPlayerGirlOrGiantess(state, getUsedGirlByName(fromName))) {
        // value /= NumberUtils.clamp(Math.sqrt(computeHeight(state, usedGirl)) * factor, 1, 4)
        // value /= NumberUtils.clamp(Math.sqrt(computeHeight(state, usedGirl)) * factor, 1, 3)
        value /= NumberUtils.clamp(Math.sqrt(computeHeight(state, getUsedGirlByName(fromName))) * factor, 1, 5)

        // if (value > 1) {
        //     return Math.round(value)
        // }

        // return NumberUtils.isRandomRate(NumberUtils.greaterThan(value, 0.3)) ? 1 : 0
        // return NumberUtils.greaterThan(Math.round(value), 1)
        // return NumberUtils.greaterThan(Math.ceil(value), 1)
        return value
    }

    return value
}

let _generateGem = (state, fromName, gemCount, name, position, camp) => {
    let startPosition = _addOffset(position, 2)

    let [emitterSize, emitterSpeed, emitterLife] = _getValue(state, getValue, fromName, startPosition)

    return ArrayUtils.range(0, gemCount - 1).reduce((state, i) => {
        let speed = NumberUtils.getRandomFloat(emitterSpeed / 3, emitterSpeed * 1.5)

        return setAbstractState(state, ParticleManager.emitGem(getAbstractState(state), {
            // isGem:true,
            fromName: name,
            camp,
            speed,
            life: emitterLife,
            size: emitterSize,
            position: startPosition.toArray(),
            getDirectionFunc: (state, position) => {
                return getPlayerBox(state).getCenter(_v1).clone().sub(_v1.fromArray(position)).normalize().toArray()
            },
        }, getParticleNeedCollisionCheckLoopCount(state, speed)))
    }, state)
}

let _generateCoin = (state, fromName, coinCount, name, position, camp) => {
    let startPosition = _addOffset(position, 2)
    let [emitterSize, emitterSpeed, emitterLife] = _getValue(state, getCoinValue, fromName, startPosition)

    return ArrayUtils.range(0, coinCount - 1).reduce((state, i) => {
        let speed = NumberUtils.getRandomFloat(emitterSpeed / 3, emitterSpeed * 1.5)

        return setAbstractState(state, ParticleManager.emitCoin(getAbstractState(state), {
            // iscoin:true,
            fromName: name,
            camp,
            speed,
            life: emitterLife,
            size: emitterSize,
            position: startPosition.toArray(),
            getDirectionFunc: (state, position) => {
                return getPlayerBox(state).getCenter(_v1).clone().sub(_v1.fromArray(position)).normalize().toArray()
            },
        }, getParticleNeedCollisionCheckLoopCount(state, speed)))
    }, state)
}

let _isEnableLuckDog = (state: state) => {
    if (isLittleCharacterType(state)) {
        return getRewardState(state).isEnableLuckDogForLittleMan
    }

    return getRewardState(state).isEnableLuckDogForGiantess
}

export let setIsEnableLuckDog = (state: state, value, characterType_) => {
    switch (characterType_) {
        case characterType.LittleMan:
            state = setRewardState(state, {
                ...getRewardState(state),
                isEnableLuckDogForLittleMan: value
            })
            break
        case characterType.Giantess:
            state = setRewardState(state, {
                ...getRewardState(state),
                isEnableLuckDogForGiantess: value
            })
            break
    }

    return state
}

let _handleLuckDog = (state, gem) => {
    if (
        _isEnableLuckDog(state)
        &&
        NumberUtils.isRandomRate(0.2)
    ) {
        return gem * 2
    }

    return gem
}

let _getLuck = (state) => {
    if (isLittleCharacterType(state)) {
        return getValueLittleMan(state).luck
    }

    return getValueGirl(state, usedGirlEnum.PlayerGirl).luck
}

let _computeExperienceValue = (state, experienceValue, fromName) => {
    if (isPlayerGirlByName(state, fromName)) {
        experienceValue = NullableUtils.getWithDefault(
            NullableUtils.map(
                data => {
                    return data.experienceFactor * experienceValue
                },
                getAnimationData(state, getCurrentAnimationName(state, getUsedGirlByName(fromName)))
            ),
            experienceValue
        )
    }

    // console.log(experienceValue)

    return experienceValue * (1 + getExpFactor(state, Scene.getCharacterType(getAbstractState(state))))
}

export let generateReward = (state: state, fromName, rewardDataKey, name, gemAndCoinPosition, propPosition, propOffset = 5) => {
    if (
        // (!isPlayer(state, fromName) && !isPlayerGiantess(state, usedGirl, fromName))
        !isPlayer(state, fromName)
        || isPlayerCamp(state, name)
    ) {
        return state
    }

    let usedGirl = getUsedGirlByName(fromName)

    let countFactor = NumberUtils.greaterThan(getAutoDifficulty(state) / 4, 1)
    if (isPlayerGiantess(state, usedGirl, fromName)) {
        countFactor *= 0.25
    }

    return NullableUtils.getWithDefault(
        NullableUtils.map(camp => {
            let { gem, prop, coin, experienceValue } = findRewardData(state, rewardDataKey)

            let luck = _getLuck(state)
            // let gemCount = Math.round(_handleLuckDog(state, _computeCountByLuck(_attenuationByHeight(state, gem(state), fromName), luck)))
            let gemCount = Math.ceil(
                _attenuationByHeight(state,
                    _handleLuckDog(state, _computeCountByLuck(gem(state), luck)), fromName)
                * countFactor
            )
            // let coinCount = Math.round(_computeCoinByCoinFactor(_handleLuckDog(state, _computeCountByLuck(_attenuationByHeight(state, coin(state), fromName), luck)), state))
            let coinCount = Math.ceil(
                _attenuationByHeight(state,
                    _computeCoinByCoinFactor(
                        _handleLuckDog(state, _computeCountByLuck(coin(state), luck)), state
                    ), fromName)
                * countFactor
            )

            if (getIsGenerateProp(state)) {
                state = generateProp(state, prop, luck, propPosition, propOffset)
            }

            if (getIsShowGemAnimation(state)) {
                state = _generateGem(state, fromName, gemCount, name, gemAndCoinPosition, camp)
            }
            else {
                state = addGemInLevel(state, gemCount)
            }

            if (getIsShowCoinAnimation(state)) {
                state = _generateCoin(state, fromName, coinCount, name, gemAndCoinPosition, camp)
            }
            else {
                state = addCoinInLevel(state, coinCount)
            }


            if (!getIsDebug(state) && !isPlayerGiantess(state, usedGirl, fromName)) {
                // if (getIsProduction(state) && !isPlayerGiantess(state, usedGirl, fromName)) {
                // if ( !isPlayerGiantess(state, usedGirl, fromName)) {
                state = setExperienceValue(state, usedGirl, fromName, _computeExperienceValue(state, experienceValue, fromName))
            }

            return state
        }, getCamp(state, name)),
        state
    )
}

export let handleGetPropOnGround = (state, image, name, count) => {
    getScene(state).remove(image)

    if (count == 0) {
        return state
    }

    state = addPropCount(state, name, count)

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getGetPropResourceId(), getIsDebug(state), getSystemVolume(state))
    ))

    return state
}

// let _playCoinAnimation = (state: state, getCoinsOnGround) => {
//     let playerBoxCenter = getPlayerBox(state).getCenter(_v1).toArray()

//     let v1 = new Vector3()

//     getCoinsOnGround.forEach(({ position, image }) => {
//         let object = {
//             position: position.toArray()
//         }
//         let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
//             .to({
//                 position: playerBoxCenter
//             },
//                 NumberUtils.getRandomFloat(200, 400)
//             )
//             .onUpdate(() => {
//                 image.position.copy(v1.fromArray(object.position))
//             })
//             .onComplete(() => {
//                 let state = readState()

//                 ArticluatedAnimation.removeTween(getAbstractState(state), tween)

//                 getScene(state).remove(image)

//                 state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
//                     SoundManager.buildNeedToPlaySoundData(getGetCoinResourceId(), getIsDebug(state), getSystemVolume(state))
//                 ))

//                 let _ = writeState(setCoin(state, getTotalCoin(state) + 1))


//                 return Promise.resolve()
//             })

//         ArticluatedAnimation.addTween(getAbstractState(state), tween)

//         tween.start()
//     })

//     return state
// }

// let _handleGetCoinsOnGround = (state, getCoinsOnGround) => {
//     // state = getCoinsOnGround.reduce((state, { image }) => {
//     //     getScene(state).remove(image)

//     //     return setCoin(state, getTotalCoin(state) + 1)
//     // }, state)

//     // state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
//     //     SoundManager.buildNeedToPlaySoundData(getGetCoinResourceId(), getIsDebug(state), getSystemVolume(state))
//     // ))
//     state = _playCoinAnimation(state, getCoinsOnGround)

//     return state
// }

// export let handleRemovePropOnGround = (state, image, name) => {
//     getScene(state).remove(image)

//     return state
// }

// export let handleRemoveCoinOnGround = (state, image) => {
//     getScene(state).remove(image)

//     return state
// }

export let markIsHandleGetPropOnGround = (state: state, value) => {
    return setRewardState(state, {
        ...getRewardState(state),
        isHandleGetPropOnGround: value
    })
}

// export let markIsHandleGetCoinOnGround = (state: state, value) => {
//     return setRewardState(state, {
//         ...getRewardState(state),
//         isHandleGetCoinOnGround: value
//     })
// }

let _getDistance = (state: state) => {
    // let factor = 1

    if (isLittleCharacterType(state)) {
        // let distance = 3
        let distance = 5

        let factor = Event.triggerForGetData(state, getAbstractState, getPickPropRangeDistanceFactorForLittleManEventName(), 0)

        return distance * (1 + factor)
    }

    // return Math.pow(getGirlScale(state, usedGirl), 0.7) * 2 * NumberUtils.greaterThan(factor / 1.5, 1)
    return Math.pow(getGirlScale(state, usedGirlEnum.PlayerGirl), 0.7) * 2 * NumberUtils.greaterThan(1 / 1.5, 1)
}

let _pickOnePropOnGround = (state: state) => {
    if (getRewardState(state).isHandleGetPropOnGround) {
        return Promise.resolve(state)
    }

    let playerPosition = getPlayerPosition(state)
    let distance = _getDistance(state)

    let data = getRewardState(state).propsOnGround.reduce<[state, propOnGround, number]>(([state, getPropOnGround, index], propOnGround, i) => {
        if (!NullableUtils.isNullable(getPropOnGround)) {
            return [state, getPropOnGround, index]
        }

        if (isNearObject(propOnGround.position, playerPosition, distance)) {
            return [state, NullableUtils.return_(propOnGround), i]
        }

        return [state, getPropOnGround, index]
    }, [state, NullableUtils.getEmpty(), -1])
    state = data[0]
    let getPropOnGround = data[1]
    let index = data[2]

    if (NullableUtils.isNullable(getPropOnGround)) {
        return Promise.resolve(state)
    }

    getPropOnGround = NullableUtils.getExn(getPropOnGround)

    state = setRewardState(state, {
        ...getRewardState(state),
        propsOnGround: getRewardState(state).propsOnGround.remove(index)
    })

    state = markIsHandleGetPropOnGround(state, true)

    return Event.trigger(state, getAbstractState, getGetPropEventName(), buildGetPropEventData(getPropOnGround.image, getPropOnGround.imageSrc, getPropOnGround.title, getPropOnGround.name, getPropOnGround.description, getPropOnGround.count))
}

// let _pickCoinsOnGround = (state: state) => {
//     let playerPosition = getPlayerPosition(state)
//     let distance = _getDistance(state, 2)

//     let [getCoinsOnGround, removedIndices] = getRewardState(state).coinsOnGround.reduce(([getCoinsOnGround, removedIndices], coinOnGround, i) => {
//         if (getPositionParrelToObj(coinOnGround.position, playerPosition.y).distanceTo(playerPosition) < distance) {
//             return [ArrayUtils.push(getCoinsOnGround, coinOnGround), ArrayUtils.push(removedIndices, i)]
//         }

//         return [getCoinsOnGround, removedIndices]
//     }, [ArrayUtils.create(), ArrayUtils.create()])

//     if (getCoinsOnGround.length == 0) {
//         return state
//     }

//     state = setRewardState(state, {
//         ...getRewardState(state),
//         coinsOnGround: getRewardState(state).coinsOnGround.filter((data, i) => {
//             return !removedIndices.includes(i)
//         })
//     })

//     state = _handleGetCoinsOnGround(state, getCoinsOnGround)

//     return state
// }

export let update = (state: state) => {
    // return _pickOnePropOnGround(state).then(_pickCoinsOnGround)
    return _pickOnePropOnGround(state)
}

export let createState = (): reward => {
    return {
        gem: 0,
        levelGem: 0,

        coin: 0,
        levelCoin: 0,
        // coinsOnGround: List(),

        props: List(),
        propsOnGround: List(),
        propsNotOutLevelBuild: List(),
        isHandleGetPropOnGround: false,
        // disabledProps: List(),

        isEnableLuckDogForLittleMan: false,
        isEnableLuckDogForGiantess: false,

        lastGemHitTime: NullableUtils.getEmpty(),
        lastCoinHitTime: NullableUtils.getEmpty(),

        itemPriceFactor: 0,
        coinFactor: 0,
        propCountFactor: 0,
    }
}

export let dispose = (state: state) => {
    if (isEnteringNextLevel(state)) {
        return setRewardState(state, {
            ...createState(),
            gem: getRewardState(state).gem,
            coin: getRewardState(state).coin,
            props: getRewardState(state).props,
            propsNotOutLevelBuild: getRewardState(state).propsNotOutLevelBuild,
        })
    }

    return setRewardState(state, {
        ...createState(),
        gem: getRewardState(state).gem,
        props: _getOutLevelBuildProps(getRewardState(state).props, getRewardState(state).propsNotOutLevelBuild)
    })
}

export let findRewardData = (state: state, rewardDataKey): rewardSingleData => {
    return MutableRecordUtils.getExn(
        NullableUtils.getExn(getConfigData(state).rewardData),
        rewardDataKey
    )
}

let _buildRewardData = (gem, props): rewardData => {
    return {
        gem: gem,
        props: props.toArray(),
    }
}

let _handleRewardDataToBackend = (rewardData: rewardData): rewardDataBackend => {
    return {
        gem: rewardData.gem,
        props: rewardData.props.map(p => {
            return {
                name: p.name,
                count: p.count
            }
        })
    }
}

let _handleRewardDataFromBackend = (state, rewardData: rewardDataBackend): rewardData => {
    let gem
    if (getIsDebug(state)) {
        // if (true) {
        // gem = 100000
        gem = 1000000
    }
    else {
        gem = rewardData.gem
        // gem = 1000000
    }

    return {
        gem: gem,
        props: rewardData.props.filter(p => isPropExist(state, p.name)).map(p => {
            return {
                ...findOriginPropData(state, p.name),
                count: p.count
            }
        })
    }
}

export let getRewardDataFromBackend = (state: state) => {
    return Backend.getRewardData<rewardDataBackend>().then(rewardData => {
        // if (Math.random() < 0.5) {
        //     // if (Math.random() < 0.99) {
        //     throw new Error("network request error")
        // }
        if (getIsDebug(state)) {
            // state = setRewardState(state, {
            state = mutableSetRewardState(state, {
                ...getRewardState(state),
                // gem: 100000,
                gem: 100000000,
            })
        }

        if (NullableUtils.isNullable(rewardData)) {
            return mutableSetRewardState(state, {
                ...getRewardState(state),
                props: initProps(state, List<propData>())
            })
        }

        rewardData = _handleRewardDataFromBackend(state, NullableUtils.getExn(rewardData))

        state = setGem(state, rewardData.gem)


        // return setRewardState(state, {
        return mutableSetRewardState(state, {
            ...getRewardState(state),
            // gem: rewardData.gem,
            props: initProps(state, List<propData>(rewardData.props))
            // props: List<propData>(rewardData.props)
        })
    })
}

let _getOutLevelBuildProps = (props: List<propData>, propsNotOutLevelBuild: List<propNotOutLevelBuild>) => {
    return props.filter(p => p.isOutLevelBuild).map(p => {
        return NullableUtils.getWithDefault(
            NullableUtils.map(propNotOutLevelBuild => {
                return {
                    ...p,
                    count: NumberUtils.greaterThan(p.count - propNotOutLevelBuild.count, 0)
                }
            }, propsNotOutLevelBuild.find(p2 => p2.name == p.name)),
            p
        )
    })
}

export let updateRewardBackend = (state: state) => {
    let { gem, props, propsNotOutLevelBuild } = getRewardState(state)

    return Backend.setRewardData(
        _handleRewardDataToBackend(_buildRewardData(gem, _getOutLevelBuildProps(props, propsNotOutLevelBuild)))
    ).then(_ => state)
}


export let updateRewardWhenMissionFinish = (state: state, isGetDirectLevelGem = false) => {
    let { gem,
        coin, levelCoin
    } = getRewardState(state)

    // levelCoin = _computeCoinByCoinFactor(levelCoin, state)

    let newGem
    if (isGetDirectLevelGem) {
        newGem = gem + getRewardState(state).levelGem
    }
    else {
        newGem = gem + getActualLevelGem(state)
    }

    let newCoin = Math.round(coin + levelCoin)

    // if (newGem < 0) {
    //     throw new Error(`gem shouldn't be negative, but is ${newGem}, ${gem}, ${levelGem}, ${computeGemFactor(getCurrentDifficultyData(state))}`)
    // }


    state = setGem(state, newGem)
    state = setCoin(state, newCoin)

    // state = setRewardState(state, {
    //     ...getRewardState(state),
    //     levelGem: 0,
    //     levelCoin: 0,
    // })

    // if (newGem != gem) {
    writeState(state)

    return updateRewardBackend(state)
    // }

    // return Promise.resolve(state)
}

export let updateRewardAfterMissionWait = (state: state) => {
    return updateRewardBackend(state)
}

export let restoreWhenUpdateRewardWhenMissionFinishError = (state: state) => {
    let { gem,
        coin, levelCoin
    } = getRewardState(state)

    // levelCoin = _computeCoinByCoinFactor(levelCoin, state)

    let newGem = gem - getActualLevelGem(state)
    let newCoin = Math.round(coin - levelCoin)

    state = setGem(state, newGem)
    state = setCoin(state, newCoin)

    return state
}

export let resetRewardForFirstLevel = (state: state) => {
    // requireCheck(() => {
    //     test("should only has out level build props", () => {
    //         return _getOutLevelBuildProps(getRewardState(state).props, getRewardState(state).propsNotOutLevelBuild).count() == getRewardState(state).props.count()
    //     })
    // }, getIsDebug(state))

    return setRewardState(state, {
        ...getRewardState(state),
        levelGem: 0,
        levelCoin: 0,
        // coin: getIsDebug(state) ? 100000 : 0,
        coin: getIsDebug(state) ? 10000000 : 0,
        // coin: 10000000,
        // coin:  0,
        // coin: getIsDebug(state) ? 1000: 0,
        props: initProps(state, getRewardState(state).props)
    })
}

export let initReward = (state: state) => {
    requireCheck(() => {
        test("should only has out level build props", () => {
            return _getOutLevelBuildProps(getRewardState(state).props, getRewardState(state).propsNotOutLevelBuild).count() == getRewardState(state).props.count()
        })
    }, getIsDebug(state))

    return setRewardState(state, {
        ...getRewardState(state),
        levelGem: 0,
        levelCoin: 0,
        // coin: getIsDebug(state) ? 100000 : 0,
        coin: getIsDebug(state) ? 10000000 : 0,
        // coin: 10000000,
        // coin:  0,
        // coin: getIsDebug(state) ? 1000: 0,
        props: initProps(state, getRewardState(state).props)
    })
}

export let resetRewardForContinueLevel = (state: state) => {
    // requireCheck(() => {
    //     test("should only has out level build props", () => {
    //         return _getOutLevelBuildProps(getRewardState(state).props).count() == getRewardState(state).props.count()
    //     })
    // }, getIsDebug(state))

    return setRewardState(state, {
        ...getRewardState(state),
        levelGem: 0,
        levelCoin: 0,
        // props: initProps(state, getRewardState(state).props)
    })
}

export let getTotalGem = (state: state) => {
    return getRewardState(state).gem + getRewardState(state).levelGem
}

export let getTotalCoin = (state: state) => {
    if (isUseFullHpReplaceCoinCharacterTypes(state)) {
        return getTotalCoinConvertFromHp(state)
    }

    return getRealTotalCoin(state)
}

export let getRealTotalCoin = (state: state) => {
    // return getRewardState(state).coin + getRewardState(state).levelCoin
    return getRewardState(state).coin + getLevelCoin(state)
}

export let mergeRewardData = (oldRewardData, newRewardData) => {
    return MutableRecordUtils.concat(oldRewardData, newRewardData)
}

export let mergeAllRewardData = (oldRewardData, newRewardDataArr) => {
    return newRewardDataArr.reduce((result, newRewardData) => mergeRewardData(result, newRewardData), oldRewardData)
}


export let getItemPriceFactor = (state: state) => {
    return getRewardState(state).itemPriceFactor
}

export let setItemPriceFactor = (state: state, value) => {
    return setRewardState(state, {
        ...getRewardState(state),
        itemPriceFactor: value
    })
}

export let computeCoinByItemPriceFactor = (coin: number, state: state) => {
    return Math.round(coin * (1 + getItemPriceFactor(state)))
}


export let getCoinFactor = (state: state) => {
    return getRewardState(state).coinFactor
}

export let setCoinFactor = (state: state, value) => {
    return setRewardState(state, {
        ...getRewardState(state),
        coinFactor: value
    })
}

let _computeCoinByCoinFactor = (coin: number, state: state) => {
    // return Math.round(coin * (1 + getCoinFactor(state)))
    return coin * (1 + getCoinFactor(state))
}

export let getPropCountFactor = (state: state) => {
    return getRewardState(state).propCountFactor
}

export let setPropCountFactor = (state: state, value) => {
    return setRewardState(state, {
        ...getRewardState(state),
        propCountFactor: value
    })
}

export let computePropCountByPropCountFactor = (count: number, state: state) => {
    return Math.round(count * NumberUtils.clamp((1 - getPropCountFactor(state)), 0, 1))
}






export let clearRewardData = (state: state) => {
    return setRewardState(state, createState())
}