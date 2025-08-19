import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Quaternion, Matrix4, Vector3, Vector2, AxesHelper, Box3, Object3D, SkinnedMesh, Mesh, MeshPhongMaterial, LoopRepeat, Euler } from "three";
import { state } from "../../../../type/StateType";
import { getState, setState, getName as getCitySceneName, getScene, getConfigData, isLittleRoad, getOrbitControlsTarget } from "../CityScene";
import { attackRange, littleMan, littleManActionState, objectStateName } from "../type/StateType";
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
import { getLittleManShootStartEventName, getMissionFailEventName } from "../../../../utils/EventUtils";
import { Event } from "meta3d-jiehuo-abstract";
import { getGirlPositionParrelToArmy, getParticleNeedCollisionCheckLoopCount, } from "../utils/ArmyUtils";
import { isNotDamageState } from "../utils/FSMStateUtils"
import { getRandomCollisionPart, isInGirlAttackRange, isNearGirl } from "../utils/CollisionUtils";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { emitPrecision, emitterLife, emitterSize, emitterSpeed } from "../data/ValueType";
import { updateAnimationCollision } from "./Collision";
import { Map } from "immutable";
import { getCameraPosition, getCameraType, getControlsTarget, getDistance, hasNeedRestoreData, saveNeedRestoreData, updateControlsWhenRestore, updateControlsWhenZoomOutToThirdPersonControls, updateControlsWhenZoomOutToThirdPersonControls2, updateThirdPersonControls, useThirdPersonControls } from "../LittleManCamera";
import * as DamageUtils from "../utils/DamageUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { Flow } from "meta3d-jiehuo-abstract";
import { getDeathAnimationResourcePath } from "../data/Const";
import { hp } from "../data/DataType";
import { addToScene, computeBox, getBox, getBoxCenter, getBoxSizeForCompute, getCurrentModelData, getFullHp, getLittleMan, getLittleManState, getName, getStateMachine, hide, setGunInititalTransform, setHp, setLittleManState, setStateMachine, show } from "./LittleMan";
import { isTriggerAction, resetIsTriggerAction, triggerAction } from "./Action";
import { getPosition, initTransform, setPositionAndComputeBox } from "./Transform";
import { getPickObjectName, hasPickData, removePickData } from "../girl/PickPose";
import { clearPick } from "./Utils";
import { hideAim, showAim } from "./Shoot";
import { RenderSetting } from "meta3d-jiehuo-abstract";
import { addBlood } from "../utils/CharacterUtils";
import { updateAnimation } from "./Animation";
import * as Soldier from "../manage/city1/soldier/Soldier"
import { Console } from "meta3d-jiehuo-abstract";
import { getPivotWorldPosition } from "../girl/Utils";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { setBonePositionYOffset } from "../utils/BoneUtils";
import { buildDestroyedEventData, getDestroyedEventName } from "../utils/EventUtils";
import { getCameraNear, getCameraFar } from "../utils/LittleManCameraUtils";

const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();


let _selectNearGirlRebornPosition = (state: state) => {
    let data = Soldier.getCrowdData(state)

    // let result = data.filter(position => {
    //     return !isInGirlAttackRange(state, position, attackRange.Big)
    // })

    let girlPosition = getPivotWorldPosition(state)

    let result = data.filter(position => {
        return !isInGirlAttackRange(state, position, attackRange.Middle, NullableUtils.getEmpty())
    })

    if (result.length == 1) {
        return result[0]
    }
    else if (result.length == 0) {
        return data[0]
    }

    return TupleUtils.getTuple2First(result.slice(1).reduce<[Vector3, number]>((result, position) => {
        let distance = position.distanceToSquared(girlPosition)

        if (distance < result[1]) {
            return [position, distance]
        }

        return result
    }, [result[0], result[0].distanceToSquared(girlPosition)]))
}

export let _getProtectTime = () => 10000

export let isProtected = (state: state) => {
    return performance.now() - getLittleManState(state).rebornTime < _getProtectTime()
}


export let createRebornState = (): fsm_state<state> => {
    return {
        name: objectStateName.Reborn,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, _) => {
            requireCheck(() => {
                test("currentAnimationName should be Death", () => {
                    return getLittleManState(state).currentAnimationName == animationName.Death
                })
            }, getIsDebug(state))

            // Console.log("reborn")
            SkinAnimation.getAction(getAbstractState(state), getName(), animationName.Death).reset()

            state = setHp(state, getFullHp(state))

            state = addToScene(state)

            state = show(state)

            state = initTransform(state)
            state = setPositionAndComputeBox(state, _selectNearGirlRebornPosition(state))

            state = clearPick(state)

            state = useThirdPersonControls(state)


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
                        rebornTime: performance.now()
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

            return Promise.resolve(state)
        },
        exitFunc: (state: state) => Promise.resolve(state),
    }
}

export let createControlledState = (): fsm_state<state> => {
    return {
        name: objectStateName.Controlled,
        enterFunc: (state) => {
            state = hideAim(state)

            return Promise.resolve(state)
        },
        executeFunc: (state, _, stateMachine) => {
            state = setLittleManState(state, {
                ...getLittleManState(state),
                currentAnimationName: animationName.Controlled,
            })

            return Promise.resolve(state)
        },
        exitFunc: (state: state, stateMachine) => {
            state = showAim(state)

            return Promise.resolve(state)
        },
    }
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

//                     // state = updateControlsWhenZoomOutToThirdPersonControls(state, getCameraNear(state), getCameraFar(state), getBoxSizeForCompute(state) * 6)
//                     state = updateControlsWhenZoomOutToThirdPersonControls(state,
//                         getBoxCenter(state).add(
//                             new Vector3(getBoxSizeForCompute(state) * 6, getBoxSizeForCompute(state) * 2, 0).multiplyScalar(3)
//                         ),
//                         getBoxCenter(state)
//                     )
//                 }

//                 return triggerAction(state, actionName.Lie)
//             },
//             exitFunc: (state: state, stateMachine) => {
//                 state = setBonePositionYOffset(state, getLittleMan(state), getCurrentModelData(state).positionYOffset)

//                 return Promise.resolve(state)
//             },
//         }
//     }
// }

export let createLieState = (): fsm_state<state> => {
    return {
        name: objectStateName.Lie,
        enterFunc: (state) => {
            state = setBonePositionYOffset(state, getLittleMan(state), 0)

            return Promise.resolve(state)
        },
        executeFunc: (state, _, stateMachine) => {
            if (!hasNeedRestoreData(state)) {
                // state = saveNeedRestoreData(state, getCameraNear(state), getCameraFar(state), getDistance(state), getCameraType(state))
                state = saveNeedRestoreData(state, getCameraNear(state), getCameraFar(state), getCameraPosition(state).clone(), getControlsTarget(state).clone(), getCameraType(state))

                state = getLittleManState(state).updateControlsWhenZoomOutToThirdPersonControlsFunc(state)
                //     // state = updateControlsWhenZoomOutToThirdPersonControls(state, getCameraNear(state), getCameraFar(state), getBoxSizeForCompute(state) * 6)
                //     state = updateControlsWhenZoomOutToThirdPersonControls(state,
                //         getBoxCenter(state).add(
                //             new Vector3(getBoxSizeForCompute(state) * 6, getBoxSizeForCompute(state) * 2, 0).multiplyScalar(3)
                //         ),
                //         getBoxCenter(state)
                //     )
            }

            return triggerAction(state, actionName.Lie)
        },
        exitFunc: (state: state, stateMachine) => {
            state = setBonePositionYOffset(state, getLittleMan(state), getCurrentModelData(state).positionYOffset)

            return Promise.resolve(state)
        },
    }
}

export let createStandupState = (): fsm_state<state> => {
    return {
        name: objectStateName.Standup,
        enterFunc: (state) => {
            state = setBonePositionYOffset(state, getLittleMan(state), 0)

            return Promise.resolve(state)
        },
        executeFunc: (state, _, stateMachine) => {
            return triggerAction(state, actionName.Standup)
        },
        exitFunc: (state: state, stateMachine) => {
            state = setBonePositionYOffset(state, getLittleMan(state), getCurrentModelData(state).positionYOffset)

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
            //     currentAnimationName: animationName.Controlled,
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
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, _) => {
            // state = setLittleManState(state, {
            //     ...getLittleManState(state),
            //     currentAnimationName: animationName.Swiping,
            // })

            return Promise.resolve(state)
        },
        exitFunc: (state: state) => Promise.resolve(state),
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
            // 		switch (getCurrentPose(state)) {
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
            // 		switch (getCurrentPose(state)) {
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
            // 		switch (getCurrentPose(state)) {
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
                // 	SoundManager.buildNeedToPlaySoundData(soundId, getIsDebug(state), NumberUtils.clamp(getGirlVolume(state) * volumnFactor, 0, 1))
                // ))

                // return addExcitement(state, excitement_)

                return state
            })
        },
        exitFunc: (state: state) => Promise.resolve(state),
    }
}

// let _newBorn = (state: state) => {
//     return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createRebornState(), NullableUtils.getEmpty())
// }

export let executeDestroyed = (state: state) => {
    let stateMachine = getStateMachine(state)

    if (
        !StateMachine.isPreviousState(stateMachine, objectStateName.Controlled)
        && RenderSetting.getRenderSetting(getAbstractState(state)).isShowBlood
    ) {
        state = addBlood(state, [getLittleManState, setLittleManState], getPosition(state))
    }

    return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine, createRebornState(), NullableUtils.getEmpty())
}

export let createDestroyedState = (): fsm_state<state> => {
    return {
        name: objectStateName.Destroyed,
        enterFunc: (state) => Promise.resolve(state),
        executeFunc: (state, _) => {
            return Event.trigger<state>(state, getAbstractState, getDestroyedEventName(), buildDestroyedEventData(
                "unknown",
                getName()))
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

            if (StateMachine.isPreviousState(stateMachine, objectStateName.Controlled)) {
                state = hide(state)
            }

            return triggerAction(state, actionName.Death).then(state => {
                return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
                    return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine, createDestroyedState(), null)
                }, 100))
            })
        },
        exitFunc: (state: state, stateMachine) => {
            state = setBonePositionYOffset(state, getLittleMan(state), getCurrentModelData(state).positionYOffset)

            return Promise.resolve(state)
        },
    }
}

export let standupEndHandler = (state: state, { userData }) => {
    state = updateControlsWhenRestore(state)

    return Promise.resolve(state)
}