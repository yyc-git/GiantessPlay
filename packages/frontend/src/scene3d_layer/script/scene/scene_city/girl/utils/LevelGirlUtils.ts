import { cameraType, state } from "../../../../../type/StateType"
import { setCamp } from "../../manage/city1/Army"
import { autoDifficulty, bossStateStatusName, camp, personality, usedGirl, usedGirlEnum, wildGiantessData } from "../../type/StateType"
import { getPlayerCamp } from "../../utils/PlayerUtils"
import { clearNeedUpdateStatus, damageUtils, getCurrentMMDCharacterName, getAllUsedMMDData, setGirlScale, getValue, getValueByUsedGirl, getGirl, getGirlState, setGirlState, hasGirlMesh, isActionTriggering, isDamageAction, setTriggerAction, setActionState, setLastScaleChangeTime, isTriggerAction, resetIsTriggerAction, getActiveBiggerIncreaseScale, changeToInitialScale, isSmallerAction, setBiggerCount, setUpgradeFuncs, getUpgradeFuncs as getUpgradeFuncsGirl, isPlayerGiantess, getHpByUsedGirl, getNeedUpdateStatusName, updateDamageType, computeForce, setAddScaleByBiggerCount, clearAddScaleByBiggerCount, getBodyHp, addCurrentUsedGirl, removeCurrentUsedGirl, setUsedGirlData, getUsedGirlData, buildNameByUsedGirl } from "../Girl"
import { addGirl, isSmallestToZeroBiggerCount, refreshBiggerTime, removeGirl } from "../InitWhenImportScene"
import { Event, NullableUtils, Scene, Device, SkinAnimation, Loader, ModelLoader, Camera, DisposeUtils, ThirdPersonControls, Layer } from "meta3d-jiehuo-abstract"
// import { state } from "../../type/StateType"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../state/State"
// import { damageType, collisionPart, girl, mmdCharacter, stompPhase, walkPhase, soundType, force, objectStateName, thirdPersonCameraTarget, pose, actionState, result, giantessStrength, giantessScale } from "../type/StateType"
import { AnimationClip, AxesHelper, Box3, Box3Helper, CompressedArrayTexture, Euler, Matrix3, Matrix4, Mesh, MeshPhongMaterial, Object3D, Quaternion, Vector3 } from "three"
// import { setTarget } from "./Camera"
import { getThirdPersonCameraTarget, getOrbitControlsTarget, isCameraCollision, updateThirdPersonControlsForChangeScale, getCameraType, updateFirstPersonControls, updateCameraNearAndFar } from "../../Camera"
import { Flow, Capsule } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { SkinBlendAnimation } from "meta3d-jiehuo-abstract"
import { List, Map } from "immutable"
import { ScreenShake } from "meta3d-jiehuo-abstract"
import { getCurrentCamera, getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera"
// import { getGiantessStatusUpdateEventName, getPickupEventName, getPickdownEventName, getPinchJudageDamageEventName, getEatEventName, getStandToCrawlEventName, getCrawlToStandEventName, getLittleManStatusUpdateEventName, } from "../../../../utils/EventUtils"
// import { actionName, animationName, articluatedAnimationName, effect, excitement, forceSize, frameIndex, particle, track } from "../data/DataType"
import { move } from "../Move"
import { computeGirlBoxAndSetToState, computeHeight, getGirlBox, getCurrentHeight, getScale, getScaleByHeight, setGirlRotation, markGirlVisible, markGirlNotVisible, getScaleIncreaseTimes, updateMMDPhysicsConfigForScale, getDamagePartFactor, getForceFactor, getSkillStateFactor, getCollisionPartFactor, getScaleFactor, setHeight, isCanStressing, unlockGirlRotation, getGirlPosition, getDamageTypeFactor, getBaseFactor, getStressingFactorByJudgeLastStressingTime, triggerScaleAction, handlePickDataWhenExecuteDestroyed, getMaxScale, handleWhenDestroying, getPivotWorldPosition, } from "../Utils"
import { getAllAnimationNames, getCurrentAnimationName, isChangeScaling, isCompletelyPlayingAnimation, isKeepPoseAnimation, isPlayingAnimation, isPlayingAnimationByWeight, playBiggerAnimation, playSmallerAnimation, updateAnimation, updateAnimationDuration } from "../Animation"
import { getCollisionPartCenter, updateAnimationCollision } from "../Collision"
import * as PickPose from "../PickPose"
import { getStateMachine, isChangeCrawlPoseState, isSkillState, setStateMachine } from "../FSMState"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { buildBossStatusUpdateEventNameEventData, buildCaptureLevelGiantessEventData, buildGiantessStatusUpdateEventNameEventData, getBossStatusUpdateEventName, getCaptureLevelGiantessEventName, getGiantessStatusUpdateEventName, getLevelStatusUpdateEventName } from "../../../../../utils/EventUtils"
import { actionName, animationName, articluatedAnimationName, effect, excitement, forceSize, frameIndex, particle, track } from "../../data/DataType"
import { damageType, collisionPart, girl, stompPhase, walkPhase, soundType, force, objectStateName, thirdPersonCameraTarget, pose, actionState, result, giantessStrength, giantessScale, damagePart } from "../../type/StateType"
import { getConfigData, getGirlScale, removeBehaviourTreeData, setGirlValue } from "../../CityScene"
import { getDamagePartByCollisionPart, getDamagePartByJudge, hideCloth, isCloth, resetCloth, showCloth, updateAllClothVisibleByJudgeHp, updateHpData } from "../Cloth"
import { buildDestroyedEventData, buildLevelStatusUpdateEventData, getDestroyedEventName } from "../../utils/EventUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { isControlledState, isDestoryRelatedStates, isNotDamageState } from "../../utils/FSMStateUtils"
import { StateMachine } from "meta3d-jiehuo-abstract"
import * as BehaviourTreeManager from "../../behaviour_tree/BehaviourTreeManager"
import { setExcitement, setExcitementByUsedGirl } from "../Excitement"
import { getNow } from "../../Time"
import { generateReward } from "../../reward/RewardGenerator"
import { updateGirlValue } from "../../difficulty/DifficultyUtils"
import { handleLightStressing } from "../../utils/LightStressingGiantessUtils"
import { getKey, markWhetherNotExecuteGiantessAI, removeTree } from "../../behaviour_tree/BehaviourTreeManager"
import * as GirlFSMState from "../FSMState"
import { hasPickData } from "../PickPoseUtils"
import { buildPickdownEventData, getPickdownEventName } from "../../../../../utils/EventUtils"
// import { setNeedShowSkillBar } from "../../UI"
import { clearAllStatus } from "../../BossStateStatus"
// import * as WildGiantessData from "../../data/play/level1/wild/GirlData"
// import * as EnemyGiantessData from "../../data/play/level1/enemy/GirlData"
// import * as PlayerGoddessData from "../../data/play/level1/player_goddess/GirlData"
import { getPlayerGiantessBlockService, resetLevelGirlValue as resetLevelGirlValueMod } from "../../../../../mod/LevelGiantessMod"
import { getName as getLittleManName } from "../../little_man/LittleMan"
import { getEnhenceLevelGiantessLevel } from "../../difficulty/HeatImplementer"
import { getPassiveBiggerBlockService, getUpgradeFuncs } from "../../../../../mod/UpgradeMod"
import { girlType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { applyUpgradeFuncsByRandomLevel, getGiantessUpgradeFuncs, removeUpgradeFuncs } from "../../build/Upgrade"
import { getAutoDifficulty } from "../../difficulty/Difficulty"
import * as CollisionShapeData from "../../data/CollisionShapeData"
import { getModAPI } from "../../Mod"
import { getIsDebug } from "../../../Scene"
import { getDamagePositionForLabel } from "../../utils/DamageUtils"
import { restorePartialScale, smallByTime } from "../../utils/PartialScaleGiantessUtils"
import { isActionValid as isActionValidMod, triggerAction as triggerActionMod } from "../../../../../mod/SkillGiantessMod"
import { Console } from "meta3d-jiehuo-abstract"

// let _setCurrentStudyActions = (state: state) => {
//     state = setCurrentStudyActions(state, List([
//         {
//             name: actionName.Stomp,
//             time: getNow(state)
//         },
//         {
//             name: actionName.Bigger,
//             time: getNow(state)
//         },
//         {
//             name: actionName.Smallest,
//             time: getNow(state)
//         },
//         {
//             name: actionName.StandToCrawl,
//             time: getNow(state)
//         },
//         {
//             name: actionName.CrawlToStand,
//             time: getNow(state)
//         },
//         {
//             name: actionName.Pickup,
//             time: getNow(state)
//         },
//         {
//             name: actionName.Eat,
//             time: getNow(state)
//         },
//         {
//             name: actionName.Pinch,
//             time: getNow(state)
//         },
//         {
//             name: actionName.Pickdown,
//             time: getNow(state)
//         },
//         {
//             name: actionName.BreastPress,
//             time: getNow(state)
//         },
//         {
//             name: actionName.Run,
//             time: getNow(state)
//         },
//     ]))

//     return state
// }

let _addUpgradeFuncs = (state: state, usedGirl) => {
    let autoDifficulty_ = getAutoDifficulty(state)

    let enhenceLevelGiantessLevel = getEnhenceLevelGiantessLevel(state)
    // let enhenceLevelGiantessLevel = 10
    // let countFactor = Math.round(autoDifficulty_ / 3)
    let countFactor = Math.round(autoDifficulty_ / 2)

    // let upgradeFuncCount = enhenceLevelGiantessLevel


    let upgradeFuncs
    let upgradeFuncCount
    if (usedGirl == usedGirlEnum.PlayerGoddess) {
        // upgradeFuncCount = +Infinity
        upgradeFuncCount = 10

        upgradeFuncs = getUpgradeFuncs(state, girlType.PlayerGoddess)
    }
    else if (usedGirl == getPlayerGiantessBlockService(state).getUsedGirl()) {
        // upgradeFuncCount = +Infinity
        upgradeFuncCount = 5

        let playerGirlUpgradeFuncs = getGiantessUpgradeFuncs(state)

        upgradeFuncs = getUpgradeFuncs(state, girlType.PlayerGoddess).filter(data => {
            return !NullableUtils.isNullable(playerGirlUpgradeFuncs.find(data2 => data2.name == data.name))
        })
    }
    else {
        upgradeFuncCount = Math.round(enhenceLevelGiantessLevel / 2) + countFactor
        // upgradeFuncCount = Math.round(enhenceLevelGiantessLevel / 3) + countFactor
        upgradeFuncs = getUpgradeFuncs(state, girlType.LevelGiantess)

        if (!getIsDebug(state) && autoDifficulty_ <= autoDifficulty.VeryHard) {
            let filterNames = [
                getPassiveBiggerBlockService(state).getName()
            ]

            upgradeFuncs = upgradeFuncs.filter(d => !filterNames.includes(d.name))
        }

        if (getIsDebug(state)) {
            upgradeFuncs = upgradeFuncs.concat(getUpgradeFuncs(state, girlType.LevelGiantessHard))
        }
    }

    if (getIsDebug(state)) {
        upgradeFuncCount = +Infinity
    }

    let funcs = NumberUtils.randomSelectCount(
        upgradeFuncs, upgradeFuncCount
    )

    state = setUpgradeFuncs(state, usedGirl, funcs)

    return applyUpgradeFuncsByRandomLevel(
        state,
        funcs,
        usedGirl
    )
}

let _selectRandomPersonality = (state: state, usedGirl) => {
    let result = NumberUtils.randomSelect(
        BehaviourTreeManager.getAllPersonalities()
    )

    Console.log(`select personality: ${result}`)

    return BehaviourTreeManager.setPersonality(state, usedGirl,
        result
    )
}

export let addLevelGiantess = (state: state, usedGirl, camp_, worldPosition, worldQuaternion) => {
    // state = setCurrentUsedGirl(state, usedGirl)
    state = addCurrentUsedGirl(state, usedGirl)
    state = setCamp(state, buildNameByUsedGirl(usedGirl), camp_)

    state = _selectRandomPersonality(state, usedGirl)

    state = smallByTime(state, usedGirl)

    return resetLevelGirlValue(state, usedGirl, true).then(state => {
        // state = updateGirlValueByAutoDifficulty(state, usedGirl)
        state = updateGirlValue(state, usedGirl)


        // state = _setCurrentStudyActions(state)

        state = setExcitement(state, usedGirl, 0)

        state = changeToInitialScale(state, usedGirl)


        // state = resetCloth(state, usedGirl, getAllUsedMMDData(state), CollisionShapeData.getData(state))
        state = resetCloth(state, usedGirl)

        state = updateCameraNearAndFar(state)

        return addGirl(state, usedGirl, getAllUsedMMDData(state), worldPosition, worldQuaternion).then(state => {
            // if (isFirstAdd(state, usedGirl)) {
            return _addUpgradeFuncs(state, usedGirl)
            // }

            // return state
        })
    })
}

export let resetLevelGirlValue = (state: state, usedGirl, isApplyTalent) => {
    // state = setGirlValue(state, usedGirlEnum.WildGiantess, WildGiantessData.getValue(state))
    // state = setGirlValue(state, usedGirlEnum.EnemyGiantess, EnemyGiantessData.getValue(state))
    // state = setGirlValue(state, usedGirlEnum.PlayerGoddess, PlayerGoddessData.getValue(state))

    return resetLevelGirlValueMod(state, usedGirl, isApplyTalent)
}

export let removeLevelGiantess = (state: state, handleFunc: (state: state) => Promise<state>, usedGirl) => {
    state = setBiggerCount(state, usedGirl, 0)
    state = clearAddScaleByBiggerCount(state, usedGirl)
    state = clearAllStatus(state, usedGirl)

    state = restorePartialScale(state, usedGirl)

    // state = setIsFirstAdd(state, usedGirl, false)

    if (isPlayerGiantess(state, usedGirl)) {
        state = updateAllClothVisibleByJudgeHp(state, usedGirlEnum.PlayerGirl)
    }

    return removeUpgradeFuncs(state, getUpgradeFuncsGirl(state, usedGirl), usedGirl).then(state => {
        state = setUpgradeFuncs(state, usedGirl, [])

        return handleFunc(state)
    }).then(state => {
        return Event.trigger(state, getAbstractState, getModAPI(state).event.getLevelGiantessDestoyedEventName(), NullableUtils.return_(
            {
                targetName: buildNameByUsedGirl(usedGirl),
                gemAndCoinPosition: getCollisionPartCenter(state, usedGirl, collisionPart.TrigoneAndButt),
                propPosition: getGirlPosition(state, usedGirl),
            }
        ))
    }).then(state => {
        return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData(
            getLittleManName(),
            buildNameByUsedGirl(usedGirl)))
            .then(state => {
                return removeGirl(state, usedGirl, getAllUsedMMDData(state))
            })
            .then(state => {
                state = unlockGirlRotation(state, usedGirl)

                state = removeBehaviourTreeData(state, BehaviourTreeManager.getKey())

                return BehaviourTreeManager.remove(state, usedGirl)
            })
            // .then(state => {
            //     return Event.trigger(state, getAbstractState, getBossStatusUpdateEventName(), NullableUtils.getEmpty())
            // }
            // )
            .then(state => {
                // state = setCurrentUsedGirl(state, usedGirlEnum.None)
                state = removeCurrentUsedGirl(state, usedGirl)

                return state
            })
    })
}

export let updateUtils = (state: state, usedGirl: usedGirl, updateFSMStateFunc) => {
    state = setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        isMoveCollisioned: false,
        // isRotationLock: false,
    })


    let velocity

    if (isPlayingAnimation(state, usedGirl, animationName.Walk)
        || isPlayingAnimation(state, usedGirl, animationName.Run)
        || isPlayingAnimation(state, usedGirl, animationName.CrawlMove)
    ) {
        let data = move(state, usedGirl)
        state = data[0]
        velocity = data[1]
    }
    else {
        velocity = new Vector3(0, 0, 0)
    }


    return updateAnimation(state, usedGirl).then(state => {
        return updateAnimationCollision(state, usedGirl, velocity)
    }).then(state => {
        return updateFSMStateFunc(state, usedGirl)
    }).then(state => {
        let { screenShake } = getUsedGirlData(state, usedGirl)
        screenShake.update(state, getCurrentCamera(getAbstractState(state)))

        let promise
        let newHeight = computeHeight(state, usedGirl)
        let oldHeight = getCurrentHeight(state, usedGirl)
        if (newHeight != oldHeight) {
            state = computeGirlBoxAndSetToState(state, usedGirl)

            state = setHeight(state, usedGirl, newHeight)


            state = updateAnimationDuration(state, usedGirl, getScale(state, usedGirl))


            state = updateMMDPhysicsConfigForScale(state, usedGirl)

            // state = setIsNeedUpdateStatus(state, true)


            promise = Promise.resolve(state)
        }
        else {
            promise = Promise.resolve(state)
        }

        return promise
    })
        // .then(state => {
        //     if (!NullableUtils.isNullable(getUsedGirlData(state, usedGirl).needUpdateStatus) && getIsNeedUpdateStatus(state)) {
        //         let { name, damagePart } = NullableUtils.getExn(getUsedGirlData(state, usedGirl).needUpdateStatus)

        //         return Event.trigger(state, getAbstractState, getBossStatusUpdateEventName(),
        //             buildBossStatusUpdateEventNameEventData(
        //                 damagePart,
        //                 name
        //             )
        //         )
        //     }

        //     return state
        // })
        .then(state => PickPose.update(state, usedGirl))
        .then(state => {
            state = computeGirlBoxAndSetToState(state, usedGirl)

            return state
        })
    // .then(clearNeedUpdateStatus)
    // .then(state => setIsNeedUpdateStatus(state, false))
}

let _isStressingByRate = (state: state, usedGirl, damage, damageType_: damageType, collisionPart_: collisionPart, damagePart: damagePart) => {
    let damageTypeFactor = getDamageTypeFactor(damageType_)

    let collisionPartFactor = getCollisionPartFactor(collisionPart_)

    let forceFactor = getForceFactor(getBodyHp(state, usedGirl), damage, 0.0025)

    let settingFactor

    // switch (getLittleManSetting(state).giantessStrength) {
    //     case giantessStrength.Low:
    //         settingFactor = 2
    //         break
    //     case giantessStrength.Middle:
    settingFactor = 1
    //         break
    //     case giantessStrength.High:
    //         settingFactor = 0.5
    //         break
    //     case giantessStrength.VeryHigh:
    //         settingFactor = 0.15
    //         break
    //     default:
    //         throw new Error("err")
    // }

    let scaleFactor = getScaleFactor(state, usedGirl)


    // const factor = 0.8
    const factor = getBaseFactor()
    // const factor = 0.2 


    let damagePartFactor = getDamagePartFactor(state, usedGirl, damagePart)

    let timeFactor = getStressingFactorByJudgeLastStressingTime(state, usedGirl)

    // console.log(timeFactor)

    // let rate = NumberUtils.clamp(1 * (1 / Math.sqrt(scale)) * (damage / forceSize.Middle) * damageTypeFactor * collisionPartFactor * factor, 0, 1)
    let rate = NumberUtils.clamp(1 * scaleFactor * forceFactor * damageTypeFactor * collisionPartFactor * factor * settingFactor * damagePartFactor * getSkillStateFactor(state, usedGirl)
        * getValue(state, usedGirl).stressingRateFactor, 0, 1) * timeFactor

    // Console.warn(rate,
    //     damage, weaponType_, collisionPart_
    // )

    return Math.random() < rate
}

export let damage = (state: state,
    createStressingStateFunc,
    usedGirl,
    [force, damageType, weaponType],
    fromName, collisionPart_: collisionPart, damagePosition: nullable<Vector3>, weaponValue_,
) => {
    return damageUtils(state,
        [
            (state, collisionPart_) => {
                let [damagePartByCollisionPart, actuallyDamagePartsByCollisionPart] = getDamagePartByCollisionPart(state, usedGirl, collisionPart_)
                let [damagePartByJudge, actuallyDamagePartsByJudge] = getDamagePartByJudge(state, usedGirl, damagePartByCollisionPart, actuallyDamagePartsByCollisionPart)

                return [damagePartByCollisionPart, damagePartByJudge, actuallyDamagePartsByJudge]
            },
            updateDamageType,
            computeForce,
            getDamagePositionForLabel,
            (state, stateMachine, damage, weaponType, collisionPart_, damagePartByCollisionPart, fromName) => {
                state = handleLightStressing(state, usedGirl, damage, collisionPart_, false)

                if (
                    isCanStressing(state, usedGirl, stateMachine)
                    && _isStressingByRate(state, usedGirl, damage, damageType, collisionPart_, damagePartByCollisionPart)
                ) {
                    return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
                        return setStateMachine(usedGirl)(state, stateMachine)
                        // }, stateMachine, createStressingState(), getName(), [collisionPart_, fromName, getCollisionPartCenter(state,usedGirl,  collisionPart_)])
                    }, stateMachine, createStressingStateFunc(usedGirl), buildNameByUsedGirl(usedGirl), [collisionPart_, fromName, damagePosition])
                }

                return Promise.resolve(state)
            },
            createStressingStateFunc,
        ],
        usedGirl,
        [force, damageType, weaponType],
        fromName,
        collisionPart_, damagePosition, weaponValue_,
    )
}

export let createStressingStateUtils = (buildGiantessStressingNameFunc) => {
    return (usedGirl) => {
        return {
            name: objectStateName.Stressing,
            enterFunc: (state) => {
                return Promise.resolve(markWhetherNotExecuteGiantessAI(state, usedGirl, true))
            },
            executeFunc: (state, [collisionPart_, fromName, damagePosition]) => {
                return GirlFSMState.executeStressing(state, usedGirl, collisionPart_, fromName).then(state => {
                    if (NullableUtils.isNullable(buildGiantessStressingNameFunc)) {
                        return state
                    }

                    return generateReward(state, fromName, NullableUtils.getExn(buildGiantessStressingNameFunc)(), buildNameByUsedGirl(usedGirl), damagePosition, getGirlPosition(state, usedGirl), 3)
                })
            },
            exitFunc: (state: state) => {
                state = GirlFSMState.handleStressingStateExit(state, usedGirl)

                return Promise.resolve(markWhetherNotExecuteGiantessAI(state, usedGirl, false))
            }
        }
    }
}

export let createDestroyedStateUtils = ([removeGiantessFunc, disposeBuffDataFunc]) => {
    return (usedGirl) => {
        return {
            name: objectStateName.Destroyed,
            enterFunc: (state) => {
                return Promise.resolve(state)
            },
            executeFunc: (state, _) => {
                return disposeBuffDataFunc(state, buildNameByUsedGirl(usedGirl), NullableUtils.return_(usedGirl)).then(state => {
                    return handlePickDataWhenExecuteDestroyed(state, usedGirl).then(removeGiantessFunc)
                })
            },
            exitFunc: (state: state) => {
                return Promise.resolve(state)
            }
        }
    }
}

export let createDestroyingStateUtils = (createDestroyedStateFunc) => {
    return (usedGirl) => {
        return {
            name: objectStateName.Destroying,
            enterFunc: (state) => {
                return Promise.resolve(markWhetherNotExecuteGiantessAI(state, usedGirl, true))
            },
            executeFunc: (state, _) => {
                return handleWhenDestroying(state).then(state => {
                    return GirlFSMState.executeDestroying(state, createDestroyedStateFunc, usedGirl)
                })
            },
            exitFunc: (state: state) => {
                return Promise.resolve(markWhetherNotExecuteGiantessAI(state, usedGirl, false))
            }
        }
    }
}




let _isActionValid = (state: state, usedGirl, name: actionName) => {
    if (!hasGirlMesh(state, usedGirl)) {
        return false
    }



    // if (!getCurrentStudyActionNames(state).includes(name)) {
    //     return false
    // }

    if (name == actionName.SmallerToLastBiggerCount
        // && (
        //     isChangeScaling(state, usedGirl) || getGirlScale(state, usedGirl) <= getValue(state).scaleIncrease
        // )
        // && getGirlScale(state, usedGirl) > getValue(state).scaleIncrease
        // && getGirlScale(state, usedGirl) > getValue(state).initialScale
        // && !isSmallestToZeroBiggerCount(state, )
        // && getGirlScale(state, usedGirl) > getValue(state).minScale
    ) {
        return true
    }

    if (name == actionName.Bigger
        && (
            isChangeScaling(state, usedGirl)

            // || (!getIsBiggerNoLimit(state) && getGirlScale(state, usedGirl) >= getMaxScale(state, getValue(state)))
            || getGirlScale(state, usedGirl) >= getMaxScale(state, getValue(state, usedGirl))
            // || (isGiantessCharacterType(state) && PlayerGirl.getBiggerCount(state, usedGirl) >= PlayerGirl.getMaxBiggerCount(state))
            // || (getBiggerCount(state, usedGirl) >= getMaxBiggerCount(state))
        )
    ) {
        return false
    }


    // if (name == actionName.Reborn) {
    //     return true
    // }


    // if (!isBelongToCurrentPoseAndScaleState(state, name)) {
    //     return false
    // }


    // if (isCheckExcitement) {
    // let { excitement } = getSkillData(state, name)

    // if (!isExcitementEnough(state, excitement)) {
    //     return false
    // }
    // }


    if (isActionTriggering(state, usedGirl, name)) {
        return false
    }


    if (name == actionName.Bigger) {
        return true
    }

    if (!isNotDamageState(getStateMachine(state, usedGirl)) || isControlledState(state, getStateMachine(state, usedGirl))) {
        return false
    }

    if (isKeepPoseAnimation(state, name, getCurrentAnimationName(state, usedGirl))) {
        return true
    }

    switch (name) {
        // case actionName.Run:
        //     if (isTriggerAction(state, actionName.Bigger)
        //     ) {
        //         return false
        //     }

        //     return getCurrentAnimationName(state, usedGirl) == animationName.Walk
        // case actionName.Stomp:
        //     // return getCurrentAnimationName(state, usedGirl) == animationName.Walk || isActionState(state, actionState.Run)
        //     return getCurrentAnimationName(state, usedGirl) == animationName.Walk
        default:
            if (isActionValidMod(state, usedGirl, name)) {
                return true
            }

            return false
    }
}

// export let triggerAction = (state, name: actionName, isJudgeRun = false, isSubExcitement = true): Promise<[state, result]> => {
export let triggerAction = (state, usedGirl, name: actionName): Promise<[state, result]> => {
    if (isDamageAction(state, name)) {
        state = setTriggerAction(state, usedGirl, name)
        // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
        return Promise.resolve([state, result.Success])
    }


    // if (isJudgeRun && name == actionName.Run) {
    // if (name == actionName.Run) {
    //     if (isActionTriggering(state, actionName.Run)) {
    //         state = setActionState(state, actionState.Initial)
    //     }
    //     else {
    //         state = setActionState(state, actionState.Run)
    //     }


    //     // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
    //     return Promise.resolve([state, result.Success])
    // }




    // if (!_isActionValid(state, name, isSubExcitement)) {
    if (!_isActionValid(state, usedGirl, name)) {
        return Promise.resolve([state, result.Fail])
    }


    // if (isSubExcitement) {
    // let { excitement } = getSkillData(state, name)

    // state = subExcitement(state,usedGirl, excitement)
    // }



    if (!isSmallerAction(name)) {
        state = setTriggerAction(state, usedGirl, name)
    }

    state = triggerScaleAction(state, usedGirl, (state) => {
        return getActiveBiggerIncreaseScale(state, usedGirl)
    }, name)

    // switch (name) {
    //     case actionName.Bigger:
    //         state = setActionState(state, actionState.Initial)

    //         // if (isGiantessCharacterType(state)) {
    //         state = setBiggerCountFunc(state, getBiggerCountFunc(state) + 1)
    //         // }
    //         // if (isWildGiantess(state, usedGirl)) {
    //         //     state = WildGiantess.setBiggerCount(state,usedGirl,  WildGiantess.getBiggerCount(state, usedGirl) + 1)
    //         // }
    //         // else if (isEnemyGiantess(state, usedGirl)) {
    //         //     state = EnemyGiantess.setBiggerCount(state,usedGirl,  EnemyGiantess.getBiggerCount(state, usedGirl) + 1)
    //         // }
    //         // else if (isPlayerGoddess(state, usedGirl)) {
    //         //     state = PlayerGoddess.setBiggerCount(state,usedGirl,  PlayerGoddess.getBiggerCount(state, usedGirl) + 1)
    //         // }

    //         state = playBiggerAnimation(state, [(state) => {
    //             state = setLastScaleChangeTime(state)
    //             state = setNeedShowSkillBar(state, usedGirl, true)
    //             state = refreshBiggerTime(state, usedGirl)

    //             if (isTriggerAction(state, actionName.Bigger)) {
    //                 state = resetIsTriggerAction(state, usedGirl)
    //             }

    //             // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
    //             return Promise.resolve(state)
    //         },
    //         state => {
    //             let currentScale = getScale(state, usedGirl)

    //             let increaseScale
    //             // if (currentScale < 100) {
    //             //     increaseScale = getValue(state).scaleIncrease * 3
    //             // }
    //             // else if (currentScale < 400) {
    //             //     increaseScale = getValue(state).scaleIncrease * 6
    //             // }
    //             // else {
    //             //     increaseScale = getValue(state).scaleIncrease * 10
    //             // }
    //             increaseScale = getActiveBiggerIncreaseScale(state)



    //             // if (isGiantessCharacterType(state)) {
    //             // increaseScale = getEnhanceIncreaseScale(state, increaseScale, getBiggerEnhanceLevel(state))
    //             // }

    //             return [
    //                 currentScale + increaseScale,
    //                 1
    //             ]
    //         },
    //         ])
    //         break
    //     case actionName.SmallerToLastBiggerCount:
    //         state = setActionState(state, actionState.Initial)

    //         state = playSmallerAnimation(state, (state) => {
    //             // if (InitWhenImportScene.isSmallestToZeroBiggerCount(state)) {
    //             //     state = setNeedShowSkillBar(state, usedGirl, false)
    //             //     state = setLastScaleChangeTime(state, scaleState.Normal)
    //             // }
    //             // else {
    //             //     state = setLastScaleChangeTime(state, scaleState.Big)
    //             //     state = setNeedShowSkillBar(state, usedGirl, true)
    //             //     state = InitWhenImportScene.refreshBiggerTime(state, usedGirl)
    //             // }
    //             state = setNeedShowSkillBar(state, usedGirl, false)
    //             state = setLastScaleChangeTime(state, scaleState.Normal)

    //             // if (isGiantessCharacterType(state)) {
    //             state = setBiggerCountFunc(state, 0)
    //             // }
    //             // else if (isWildGiantess(state, usedGirl)) {
    //             //     state = WildGiantess.setBiggerCount(state,usedGirl,  0)
    //             // }
    //             // else if (isEnemyGiantess(state, usedGirl)) {
    //             //     state = EnemyGiantess.setBiggerCount(state,usedGirl,  0)
    //             // }
    //             // else if (isPlayerGoddess(state, usedGirl)) {
    //             //     state = PlayerGoddess.setBiggerCount(state,usedGirl,  0)
    //             // }

    //             if (isTriggerAction(state, actionName.Smallest)) {
    //                 state = resetIsTriggerAction(state, usedGirl)
    //             }


    //             // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
    //             return Promise.resolve(state)
    //         },
    //             getValue(state).initialScale,
    //         )
    //         break
    //     // case actionName.Run:
    //     //     state = setActionState(state, actionState.Run)
    //     //     break
    // }

    // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
    return triggerActionMod(state, usedGirl, name)
}




export let updateLevelGiantess = (state: state, usedGirl, createDestroyingStateFunc) => {
    return updateUtils(state, usedGirl, state => GirlFSMState.update(state, createDestroyingStateFunc, usedGirl))
}

export let damageLevelGiantess = damage

export let triggerLevelGiantessAction = triggerAction