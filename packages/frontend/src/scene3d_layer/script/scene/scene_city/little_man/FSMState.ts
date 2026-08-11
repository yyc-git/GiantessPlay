import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Quaternion, Matrix4, Vector3, Vector2, AxesHelper, Box3, Object3D, SkinnedMesh, Mesh, MeshPhongMaterial, LoopRepeat, Euler } from "three";
import { state } from "../../../../type/StateType";
import { getState, setState, getName as getCitySceneName, getScene, getConfigData, isLittleCharacterType, getOrbitControlsTarget, getSceneChapter, restoreCameraFromSavedData } from "../CityScene";
import { actionState, attackRange, fireWay, littleMan, littleManActionState, objectStateName } from "../type/StateType";
import { ModelLoader } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { Loader } from "meta3d-jiehuo-abstract";
import { actionName, animationName } from "../little_man_data/DataType";
import { SkinAnimation } from "meta3d-jiehuo-abstract";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { fsm_state, labelAnimation } from "meta3d-jiehuo-abstract/src/type/StateType";
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { getIsDebug } from "../../Scene";
import { SkinBlendAnimation } from "meta3d-jiehuo-abstract";
import { changeToPhongMaterial } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils";
import { addBox3Helper } from "../utils/ConfigUtils";
import { getAnimationBlendDuration } from "../little_man_data/Data";
import { getAnimationFrameCount } from "../little_man_data/Const";
import { littleManValue } from "../little_man_data/ValueType";
import { Device } from "meta3d-jiehuo-abstract";
import { NewThreeInstance } from "meta3d-jiehuo-abstract";
import { Object3DUtils } from "meta3d-jiehuo-abstract";
import { move } from "./Move";
import { ThirdPersonControls } from "meta3d-jiehuo-abstract";
import { Shadow } from "meta3d-jiehuo-abstract";
import { Render } from "meta3d-jiehuo-abstract";
import { getLittleHandTransform, getLittleHandTransformForDebug, getLittleHandTransformPrefix } from "../utils/SkeletonUtils";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { Billboard } from "meta3d-jiehuo-abstract";
import { ScreenUtils } from "meta3d-jiehuo-abstract";
import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { getHeight, getWidth } from "meta3d-utils/src/View";
import { getLittleManShootStartEventName, getLittleManStatusUpdateEventName, getLittleManSwipingEndEventName, getLittleManSwipingStartEventName, getMissionFailEventName } from "../../../../utils/EventUtils";
import { Event } from "meta3d-jiehuo-abstract";
import { isNotDamageState } from "../utils/FSMStateUtils"
import { getRandomCollisionPart, isInGirlAttackRange, isNearGirl } from "../utils/CollisionUtils";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { emitPrecision, emitterLife, emitterSize, emitterSpeed } from "../data/ValueType";
import { updateAnimationCollision } from "./Collision";
import { Map } from "immutable";
import { getCameraPosition, getCameraType, getControlsTarget, getDistance, hasNeedRestoreData, restoreControlsForChangePosition, saveNeedRestoreData, restoreControlsForNotChangePosition, updateControlsWhenZoomOutToThirdPersonControls, updateControlsWhenZoomOutToThirdPersonControls2, useThirdPersonControls, isThirdPersonCamera, clearNeedRestoreData } from "../LittleManCamera";
import * as DamageUtils from "../utils/DamageUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { Flow } from "meta3d-jiehuo-abstract";
import { getDeathAnimationResourcePath } from "../data/Const";
import { hp } from "../data/DataType";
import { addToScene, computeBox, getBox, getBoxCenter, getBoxSizeForCompute, getCurrentModelData, getFireWay, getFullHp, getLittleMan, getLittleManState, getMovableRanges, getName, getStateMachine, hide, setGunInititalTransform, setHp, setLittleManState, setStateMachine, show } from "./LittleMan";
import { getActionState, isActionTriggering, isTriggerAction, resetAction, resetIsTriggerAction, setActionState, setTriggerAction, triggerAction } from "./Action";
import { getInitialPosition, getPosition, initTransform, setPositionAndComputeBox } from "./Transform";
import { addBlood } from "../utils/CharacterUtils";
import { updateAnimation } from "./Animation";
import * as Soldier from "../manage/city1/soldier/Soldier"
import { Console } from "meta3d-jiehuo-abstract";
import { getPivotWorldPosition } from "../girl/Utils";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { setBonePositionYOffset } from "../utils/BoneUtils";
import { buildDestroyedEventData, getDestroyedEventName } from "../utils/EventUtils";
import { getCrowdData, getPositionY } from "../manage/city1/Army";
import { getNow } from "../Time";
import { handleLifeCount, isLifeCountWork, selectRandomNearArmyCrowdPoisition } from "../StaticDynamic";
import { getPlayerPosition } from "../utils/PlayerUtils";
import { hideAim, showAim } from "./AimUtils";
import { changeStandBoxToLieBox } from "../utils/LieUtils";
import { disposePlayerData as disposeBuffData } from "../buff/Buff";
import { isPicked, removeFromAllData } from "../girl/PickPoseUtils";
import { updateCharacterBackend, updateCharacterWhenNotAlive } from "../character/Character";
import { swallowError } from "../../../../../ui_layer/utils/ErrorUtils";
import { getFastRunBlockService, getSwipBlockService } from "../../../../mod/SkillLittleManMod";
import { getLittleManPositionYKey } from "../manage/biwu/level3/ArmyManager";
import { isNotInMovableRanges } from "./Utils";
import { getCameraFar, getCameraNear } from "../Camera";
// import { getAllAttackActionNames, isAllAttackActionNamesNotTriggering } from "../../../../mod/SkillLittleManMod";

const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();


// let _selectNearGirlRebornPosition = (state: state) => {
//     // let data = Soldier.getCrowdData(state)
//     let data = getCrowdData(state)

//     // let result = data.filter(position => {
//     //     return !isInGirlAttackRange(state, usedGirl, position, attackRange.Big)
//     // })

//     let girlPosition = getPivotWorldPosition(state, usedGirl)

//     let result = data.filter(position => {
//         return !isInGirlAttackRange(state, usedGirl, position, attackRange.Middle, NullableUtils.getEmpty())
//     })

//     if (result.length == 1) {
//         return result[0]
//     }
//     else if (result.length == 0) {
//         return data[0]
//     }

//     return TupleUtils.getTuple2First(result.slice(1).reduce<[Vector3, number]>((result, position) => {
//         let distance = position.distanceToSquared(girlPosition)

//         if (distance < result[1]) {
//             return [position, distance]
//         }

//         return result
//     }, [result[0], result[0].distanceToSquared(girlPosition)]))
// }

let _getProtectTime = () => 10000
// export let _getProtectTime = () => 1000

export let isProtected = (state: state) => {
    let rebornTime = getLittleManState(state).rebornTime

    if (rebornTime == 0) {
        return false
    }

    return getNow(state) - rebornTime < _getProtectTime()
}


export let createRebornState = (): fsm_state<state> => {
    return {
        name: objectStateName.Reborn,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, position) => {
            requireCheck(() => {
                test("currentAnimationName should be Death", () => {
                    return getLittleManState(state).currentAnimationName == animationName.Death
                })
            }, getIsDebug(state))

            // Console.log("reborn")
            SkinAnimation.getAction(getAbstractState(state), getName(), animationName.Death).reset()

            state = resetAction(state)

            // state = setHp(state, getFullHp(state))

            state = addToScene(state)

            state = show(state)

            state = initTransform(state)
            // state = setPositionAndComputeBox(state, _selectNearGirlRebornPosition(state))
            state = setPositionAndComputeBox(state, NullableUtils.getExn(position))

            return removeFromAllData(state, getName()).then(state => {
                // state = useThirdPersonControls(state)
                // if (hasNeedRestoreData(state)) {
                // state = restoreControlsForChangePosition(state)
                state = clearNeedRestoreData(state)
                state = restoreCameraFromSavedData(state)

                // }

                let life = 2000
                state = setAbstractState(state, ParticleManager.emitProtect(getAbstractState(state), {
                    speed: 1,
                    life: life,
                    size: getBox(state).getSize(_v1).length() * 3,

                    getPositionFunc: (state) => {
                        return getBox(state).getCenter(_v1).toArray()
                    },
                    getIsFinishFunc: (state) => {
                        return !isProtected(state)
                    },

                    // repeatCount: _getProtectTime() / life
                }))

                return triggerAction(state, actionName.Reborn)
                    /*! make sure that change to Initial state
                    * 
                    */
                    .then(updateAnimation).then(state => {
                        return setLittleManState(state, {
                            ...getLittleManState(state),
                            rebornTime: getNow(state)
                        })
                    })
            })
        },
        exitFunc: (state: state) => Promise.resolve(state),
    }
}

export let createInitialState = (): fsm_state<state> => {
    return {
        name: objectStateName.Initial,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, _) => {
            // state = setLittleManState(state, {
            //     ...getLittleManState(state),
            //     currentAnimationName: animationName.Idle,
            // })

            state = showAim(state)

            state = resetAction(state)

            return Promise.resolve(state)
        },
        exitFunc: (state: state) => Promise.resolve(state),
    }
}

let _createControlledState = (objectStateName, actionName): fsm_state<state> => {
    return {
        name: objectStateName,
        enterFunc: (state) => {
            state = hideAim(state)

            return Promise.resolve(state)
        },
        executeFunc: (state, _, stateMachine) => {
            return triggerAction(state, actionName)
        },
        exitFunc: (state: state, stateMachine) => {
            state = showAim(state)

            return Promise.resolve(state)
        },
    }
}

export let createPickedControlledState = (): fsm_state<state> => {
    return _createControlledState(objectStateName.PickedControlled, actionName.PickedControlled)
}

export let createUBControlledState = (): fsm_state<state> => {
    return _createControlledState(objectStateName.UBControlled, actionName.PickedControlled)
}

export let createBreastControlledState = (): fsm_state<state> => {
    return _createControlledState(objectStateName.BreastControlled, actionName.PickedControlled)
}

export let createShoeControlledState = (): fsm_state<state> => {
    return _createControlledState(objectStateName.ShoeControlled, actionName.PickedControlled)
}


// export let createLieStateUtils = (updateControlsWhenZoomOutToThirdPersonControlsFunc) => {
//     return (): fsm_state<state> => {
//         return {
//             name: objectStateName.Lie,
//             enterFunc: (state) => {
//                 state = setBonePositionYOffset(state, getLittleMan(state), 0)

//                 return Promise.resolve(state)
//             },
//             executeFunc: (state, _, stateMachine) => {
//                 if (!hasNeedRestoreData(state)) {
//                     state = saveNeedRestoreData(state, getCameraNear(state), getCameraFar(state), getDistance(state), getCameraType(state))

//                     state = updateControlsWhenZoomOutToThirdPersonControlsFunc(state)

//                     // state = updateControlsWhenZoomOutToThirdPersonControls(state, getCameraNear(state), getCameraFar(state), getBoxSizeForCompute(state, usedGirl) * 6)
//                     state = updateControlsWhenZoomOutToThirdPersonControls(state,
//                         getBoxCenter(state).add(
//                             new Vector3(getBoxSizeForCompute(state, usedGirl) * 6, getBoxSizeForCompute(state, usedGirl) * 2, 0).multiplyScalar(3)
//                         ),
//                         getBoxCenter(state)
//                     )
//                 }

//                 return triggerAction(state, usedGirl, actionName.Lie)
//             },
//             exitFunc: (state: state, stateMachine) => {
//                 state = setBonePositionYOffset(state, getLittleMan(state), getCurrentModelData(state).positionYOffset)

//                 return Promise.resolve(state)
//             },
//         }
//     }
// }

export let createLieState = (box): fsm_state<state> => {
    // let originBox = box.clone()

    return {
        name: objectStateName.Lie,
        enterFunc: (state) => {
            state = setBonePositionYOffset(state, getLittleMan(state), 0)
            // changeStandBoxToLieBox(box)

            state = setActionState(state, littleManActionState.Lie)

            state = hideAim(state)

            return Promise.resolve(state)
        },
        executeFunc: (state, _, stateMachine) => {
            if (!hasNeedRestoreData(state)
                && !isThirdPersonCamera(state)
            ) {
                // state = saveNeedRestoreData(state, getCameraNear(state), getCameraFar(state), getDistance(state), getCameraType(state))
                state = saveNeedRestoreData(state, getCameraNear(state), getCameraFar(state), getCameraPosition(state).clone(), getControlsTarget(state).clone(), getCameraType(state))

                state = getLittleManState(state).updateControlsWhenZoomOutToThirdPersonControlsFunc(state)
                //     // state = updateControlsWhenZoomOutToThirdPersonControls(state, getCameraNear(state), getCameraFar(state), getBoxSizeForCompute(state, usedGirl) * 6)
                //     state = updateControlsWhenZoomOutToThirdPersonControls(state,
                //         getBoxCenter(state).add(
                //             new Vector3(getBoxSizeForCompute(state, usedGirl) * 6, getBoxSizeForCompute(state, usedGirl) * 2, 0).multiplyScalar(3)
                //         ),
                //         getBoxCenter(state)
                //     )
            }

            return triggerAction(state, actionName.Lie)
        },
        exitFunc: (state: state, stateMachine) => {
            state = setBonePositionYOffset(state, getLittleMan(state), getCurrentModelData(state).positionYOffset)

            // getBox(state).copy(originBox)
            state = resetAction(state)

            return Promise.resolve(state)
        },
    }
}

export let createStandupState = (): fsm_state<state> => {
    return {
        name: objectStateName.Standup,
        enterFunc: (state) => {
            state = setActionState(state, littleManActionState.Lie)

            state = setBonePositionYOffset(state, getLittleMan(state), 0)

            return Promise.resolve(state)
        },
        executeFunc: (state, _, stateMachine) => {
            return triggerAction(state, actionName.Standup)
        },
        exitFunc: (state: state, stateMachine) => {
            // state = setActionState(state, littleManActionState.Initial)
            state = resetAction(state)

            state = showAim(state)

            state = setBonePositionYOffset(state, getLittleMan(state), getCurrentModelData(state).positionYOffset)

            if (stateMachine.currentState.name != objectStateName.Lie) {
                state = restoreControlsForNotChangePosition(state)
            }

            return Promise.resolve(state)
        },
    }
}

export let createClimbState = (): fsm_state<state> => {
    return {
        name: objectStateName.Climb,
        enterFunc: (state) => {
            state = hideAim(state)

            return Promise.resolve(state)
        },
        executeFunc: (state, _, stateMachine) => {
            // state = setLittleManState(state, {
            //     ...getLittleManState(state),
            //     currentAnimationName: animationName.PickedControlled,
            // })

            return Promise.resolve(state)
        },
        exitFunc: (state: state, stateMachine) => {
            state = showAim(state)

            return Promise.resolve(state)
        },

    }
}

// export let createRunState = (): fsm_state<state> => {
//     return {
//         name: objectStateName.Run,
//         enterFunc: (state) => Promise.resolve(state),
//         executeFunc: (state, _) => {
//             state = setLittleManState(state, {
//                 ...getLittleManState(state),
//                 currentAnimationName: animationName.Run,
//             })

//             return Promise.resolve(state)
//         },
//         exitFunc: (state: state) => Promise.resolve(state),
//     }
// }

export let createShootState = (): fsm_state<state> => {
    return {
        name: objectStateName.RemoteAttack,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, _) => {
            // Console.log("shoot")
            // state = setLittleManState(state, {
            //     ...getLittleManState(state),
            //     currentAnimationName: animationName.Shoot,
            // })

            return Promise.resolve(state)
        },
        exitFunc: (state: state) => Promise.resolve(state),
    }
}

export let createSwipingState = (): fsm_state<state> => {
    return {
        name: objectStateName.MeleeAttack,
        enterFunc: (state) => {
            return Event.trigger(state, getAbstractState, getLittleManSwipingStartEventName(), NullableUtils.getEmpty())
        },
        executeFunc: (state, _) => {
            // state = setLittleManState(state, {
            //     ...getLittleManState(state),
            //     currentAnimationName: animationName.Swiping,
            // })

            return Promise.resolve(state)
        },
        exitFunc: (state: state) => {
            return Event.trigger(state, getAbstractState, getLittleManSwipingEndEventName(), NullableUtils.getEmpty())
        }
    }
}

export let createStressingState = (): fsm_state<state> => {
    return {
        name: objectStateName.Stressing,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state) => {
            let action = actionName.Shake
            //  soundId, volumnFactor, excitement_
            // switch (collisionPart_) {
            // 	case collisionPart.LeftBreast:
            // 	case collisionPart.RightBreast:
            // 		switch (getCurrentPose(state, usedGirl)) {
            // 			case pose.Stand:
            // 			case pose.Pick:
            // 				action = actionName.HeavyStressingBreast
            // 				break
            // 			case pose.Crawl:
            // 				action = actionName.CrawlHeavyStressingBreast
            // 				break
            // 		}

            // 		soundId = getHeavyStressingBreastSoundResourceId()

            // 		excitement_ = excitement.High

            // 		volumnFactor = 2

            // 		break
            // 	case collisionPart.TrigoneAndButt:
            // 		switch (getCurrentPose(state, usedGirl)) {
            // 			case pose.Stand:
            // 			case pose.Pick:
            // 				action = actionName.HeavyStressingTrigoneAndButt
            // 				break
            // 			case pose.Crawl:
            // 				action = actionName.CrawlHeavyStressingTrigoneAndButt
            // 				break
            // 		}

            // 		soundId = getHeavyStressingTrigoneAndButtSoundResourceId()

            // 		excitement_ = excitement.VeryHigh

            // 		volumnFactor = 2
            // 		break
            // 	default:
            // 		switch (getCurrentPose(state, usedGirl)) {
            // 			case pose.Stand:
            // 			case pose.Pick:
            // 				action = actionName.HeavyStressing
            // 				break
            // 			case pose.Crawl:
            // 				action = actionName.CrawlHeavyStressing
            // 				break
            // 		}

            // 		soundId = getHeavyStressingSoundResourceId()

            // 		excitement_ = excitement.Low

            // 		volumnFactor = 1
            // 		break
            // }

            return triggerAction(state, action).then(state => {
                // state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                // 	SoundManager.buildNeedToPlaySoundData(soundId, getIsDebug(state), NumberUtils.clamp(getGirlVolume(state, usedGirl) * volumnFactor, 0, 1))
                // ))

                // return addExcitement(state, usedGirl, excitement_)

                return state
            })
        },
        // exitFunc: (state: state) => Promise.resolve(state),
        exitFunc: (state: state) => {
            // if (isAllAttackActionNamesNotTriggering(state)) {
            let currentActionState = getActionState(state)

            state = resetAction(state)

            // if (getFireWay(state) == fireWay.Burst) {
            switch (currentActionState) {
                // case littleManActionState.Run:
                //     // state = setTriggerAction(state, actionName.Run)
                //     // state = setActionState(state, currentActionState)
                //     return triggerAction(state, usedGirl, getFastRunBlockService(state).getActionName())
                //     break
                case littleManActionState.Shoot:
                    state = setTriggerAction(state, actionName.Shoot)
                    state = setActionState(state, currentActionState)
                    break
                case littleManActionState.Swiping:
                    state = setTriggerAction(state, getSwipBlockService(state).getActionName())
                    state = setActionState(state, currentActionState)
                    break
            }
            // }
            // }

            return Promise.resolve(state)
        },
    }
}

// let _newBorn = (state: state) => {
//     return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createRebornState(), NullableUtils.getEmpty())
// }

// export let handlePickDataWhenExecuteDestroyed = (state: state) => {
//     let stateMachine = getStateMachine(state)

//     if (
//         !StateMachine.isPreviousState(stateMachine, objectStateName.PickedControlled)
//         && getRenderSetting(state).isShowBlood
//     ) {
//         state = addBlood(state, [getLittleManState, setLittleManState], getPosition(state))
//     }

//     return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine, createRebornState(), NullableUtils.getEmpty())
// }

// let _selectRandomNearArmyCrowdPoisition = (state: state) => {
//     switch (getSceneChapter(state)) {
//         case scene.Play:
//             let result = findValidArmyPoints(state, getPosition(state), 0, +Infinity)

//             if (result.length == 0) {
//                 return getPlayerInitialPosition()
//             }

//             return result[0]
//         case scene.Biwu:
//             return getPlayerPosition(state)
//         default:
//             throw new Error("error")
//     }
// }

let _computeRebornPosition = (state) => {
    let pos = getPlayerPosition(state)

    let result = selectRandomNearArmyCrowdPoisition(state,
        pos.clone().setY(
            getPositionY(state, getLittleManPositionYKey(), pos.x, pos.z)
        )
    )

    if (isNotInMovableRanges(result, getMovableRanges(state))) {
        return getInitialPosition(state)
    }

    return result
}

export let createDestroyedState = (): fsm_state<state> => {
    return {
        name: objectStateName.Destroyed,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, _) => {
            if (isLifeCountWork(state, getName())) {
                state = handleLifeCount(state, getName())

                state = saveNeedRestoreData(state, getCameraNear(state), getCameraFar(state), getCameraPosition(state).clone(), getControlsTarget(state).clone(), getCameraType(state))

                return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createRebornState(), NullableUtils.return_(
                    _computeRebornPosition(state)
                ))
            }


            return disposeBuffData(state, getName(), NullableUtils.getEmpty()).then(state => {
                return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData(
                    "unknown",
                    getName()))
            })
        },
        exitFunc: (state: state) => Promise.resolve(state),
    }
}

export let createDestroyingState = (): fsm_state<state> => {
    return {
        name: objectStateName.Destroying,
        enterFunc: (state) => {
            state = setBonePositionYOffset(state, getLittleMan(state), 0)

            return Promise.resolve(state)
        },
        executeFunc: (state, _) => {
            let stateMachine = getStateMachine(state)

            // if (StateMachine.isPreviousState(stateMachine, objectStateName.PickedControlled)) {

            // TODO need handle crawl lick to eat case
            if (isPicked(state, getName())) {
                state = hide(state)
            }

            let promise
            // if (!isLifeCountWork(state, getName())) {
            //     promise = StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine, createDestroyedState(), null)
            // }
            // else {
            promise = triggerAction(state, actionName.Death).then(state => {
                return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
                    return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine, createDestroyedState(), null)
                }, 100))
            })
            // }

            return promise.then(state => {
                /*! fix 小人被踩死的时候依旧显示有一些血(一个一直有的小问题，按伤害算的话确实会死，应该是血量没及时变化)
                * 
                */
                return Event.trigger(state, getAbstractState, getLittleManStatusUpdateEventName(), null)
            })
                .then(state => {
                    if (!isLifeCountWork(state, getName())) {
                        state = updateCharacterWhenNotAlive(state)

                        return swallowError(updateCharacterBackend(state))
                        // return updateCharacterAndBackendWhenNotAlive(state)
                        // return updateCharacterWhenNotAlive(state)
                    }

                    return state
                })
        },
        exitFunc: (state: state, stateMachine) => {
            state = setBonePositionYOffset(state, getLittleMan(state), getCurrentModelData(state).positionYOffset)

            return Promise.resolve(state)
        },
    }
}

export let standupEndHandler = (state: state, { userData }) => {
    // state = restoreControlsForNotChangePosition(state)

    return Promise.resolve(state)
}