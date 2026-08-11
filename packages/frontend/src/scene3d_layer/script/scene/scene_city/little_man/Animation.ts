import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Quaternion, Matrix4, Vector3, Vector2, AxesHelper, Box3, Object3D, SkinnedMesh, Mesh, MeshPhongMaterial, LoopRepeat, Euler } from "three";
import { state } from "../../../../type/StateType";
import { getState, setState, getName as getCitySceneName, getScene, getConfigData, isLittleCharacterType, getOrbitControlsTarget } from "../CityScene";
import { littleMan, littleManActionState, littleManStrength, objectStateName } from "../type/StateType";
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
import { buildLittleManAnimationChangeEventData, getLittleManAnimationChangeEventName, getLittleManShootStartEventName, getMissionFailEventName } from "../../../../utils/EventUtils";
import { Event } from "meta3d-jiehuo-abstract";
import { isDestoryRelatedStates, isNotDamageState } from "../utils/FSMStateUtils"
import { getRandomCollisionPart } from "../utils/CollisionUtils";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { emitPrecision, emitSpeed, emitterLife, emitterSize, emitterSpeed } from "../data/ValueType";
import { updateAnimationCollision } from "./Collision";
import { Map } from "immutable";
import * as DamageUtils from "../utils/DamageUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { Flow } from "meta3d-jiehuo-abstract";
import { getDeathAnimationResourcePath } from "../data/Const";
import { hp } from "../data/DataType";
import { computeBox, getCurrentModelData, getFullHp, getLittleMan, getLittleManState, getName, getStateMachine, getValue, setGunInititalTransform, setHp, setLittleManState, setStateMachine } from "./LittleMan";
import { isTriggerAction, resetIsTriggerAction } from "./Action";
import { createClimbState, createInitialState, createShootState, createSwipingState } from "./FSMState";
import { getCurrentGunValue } from "./Gun";
import { setBonePositionYOffset } from "../utils/BoneUtils";
import { isClimbing } from "./climb/ClimbManager";
import * as SwipingWeapon from "../weapon/SwipingWeapon"
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getCrazyLevel, getEmitSpeedIncreaseRatio } from "../StaticDynamic";
import { getAllAnimationNames as getAllAnimationNamesMod, getAllAttackAnimationNames, getSwipBlockService } from "../../../../mod/SkillLittleManMod";

export let getAllAnimationNames = (state: state) => [
    animationName.Idle,
    animationName.Run,
    animationName.Shoot,
    // animationName.Swiping,
    animationName.Shake,
    animationName.Death,

    animationName.PickedControlled,

    animationName.Lie,
    animationName.Standup,

    animationName.ClimbToTop,
    animationName.ClimbToDown,
].concat(
    getAllAnimationNamesMod(state)
)

export let initWeights = (abstractState, state: state) => {
    abstractState = SkinBlendAnimation.setWeights(abstractState, SkinBlendAnimation.getWeights(abstractState).set(getAllAnimationNames(state)[0], 1))

    return getAllAnimationNames(state).slice(1).reduce((abstractState, name) => {
        return SkinBlendAnimation.setWeights(abstractState, SkinBlendAnimation.getWeights(abstractState).set(name, 0))
    }, abstractState)
}

export let getCurrentAnimationName = (state: state) => {
    return getLittleManState(state).currentAnimationName
}

let _playAnimationLoop = (state: state, animationName) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        nextBlendingAnimationName: animationName,
        isCurrentAnimationOnlyPlayOnce: false
    })
}

let _playAnimationOnlyOnce = (state: state, animationName) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        nextBlendingAnimationName: animationName,
        isCurrentAnimationOnlyPlayOnce: true
    })
}

export let isEnd = (state, animationName_, isDebug: boolean) => {
    return SkinAnimation.isSpecificFrameIndex(
        SkinAnimation.getFrameIndex(
            // MMD.findAnimationAction(getAbstractState(state), getLittleMan(state), animationName_),
            SkinAnimation.getAction(getAbstractState(state), getName(), animationName_),

            getAnimationFrameCount(state, animationName_)
        ),
        getAnimationFrameCount(state, animationName_),
        getAnimationFrameCount(state, animationName_),
        0,
        isDebug
    )
}

export let isCompletelyPlayingAnimation = (state, animationName) => {
    return isPlayingAnimationByWeight(state, animationName, 1)
}

export let isPlayingAnimationByWeight = (state, animationName, weight) => {
    return SkinBlendAnimation.getWeightForNotMMD(SkinAnimation.getAction(getAbstractState(state), getName(), animationName)) >= weight
}

let _updateAnimationBlendAndFSMState = (state) => {
    // let littleMan = getLittleMan(state)

    state = getConfigData(state).littleManAnimationBlendData.reduce((state, data) => {
        if (
            // data.condition(state)
            // && getLittleManState(state).currentAnimationName == data.currentAnimationName
            // && isPlayingAnimationByWeight(state, data.currentAnimationName, NullableUtils.getWithDefault(data.weight, 1))
            data.condition(state)
            && data.currentAnimationNames.includes(getLittleManState(state).currentAnimationName)
            // (
            // 	NullableUtils.getWithDefault(
            // 		NullableUtils.map(
            // 			isCurrentAnimationName => {
            // 				return isCurrentAnimationName(state)
            // 			}, data.isCurrentAnimationName
            // 		),
            // 		getUsedGirlData(state, usedGirl).currentAnimationName == NullableUtils.getExn( data.currentAnimationName)
            // 	)
            // )
            && data.currentAnimationNames.reduce((result, animationName_) => {
                if (result) {
                    return result
                }

                return isPlayingAnimationByWeight(state, animationName_, NullableUtils.getWithDefault(data.weight, 1))
                // return isPlayingAnimation(state, usedGirl,  animationName_)
            }, false)

        ) {
            // return setLittleManState(state, {
            // 	...getLittleManState(state),
            // 	nextBlendingAnimationName: data.nextAnimationName
            // })


            state = setLittleManState(state, {
                ...getLittleManState(state),
                noBlend: NullableUtils.getWithDefault(data.noBlend, false)
            })

            // TODO play keepDeath animation instead
            // if (
            //     data.nextAnimationName == animationName.Death
            // ) {
            let isOnlyPlayOnce = NullableUtils.getWithDefault(data.isOnlyPlayOnce, false)
            if (isOnlyPlayOnce === true) {
                return _playAnimationOnlyOnce(state, data.nextAnimationName)
            }

            return _playAnimationLoop(state, data.nextAnimationName)
        }

        return state
    }, state)


    let { currentAnimationName, noBlend, isCurrentAnimationOnlyPlayOnce } = getLittleManState(state)

    return NullableUtils.getWithDefault(
        NullableUtils.map(nextBlendingAnimationName => {
            if (currentAnimationName !== nextBlendingAnimationName) {
                if (isTriggerAction(state, currentAnimationName)) {
                    state = resetIsTriggerAction(state)
                }
                // Console.log(
                //     currentAnimationName, nextBlendingAnimationName

                // )

                // let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)

                if (noBlend) {
                    SkinBlendAnimation.executeCrossFade(
                        SkinAnimation.getAction(getAbstractState(state), getName(), currentAnimationName),
                        SkinAnimation.getAction(getAbstractState(state), getName(), nextBlendingAnimationName),
                        0
                    )
                }
                else {
                    SkinBlendAnimation.executeCrossFade(
                        SkinAnimation.getAction(getAbstractState(state), getName(), currentAnimationName),
                        SkinAnimation.getAction(getAbstractState(state), getName(), nextBlendingAnimationName),
                        getAnimationBlendDuration(
                            currentAnimationName, nextBlendingAnimationName
                        )
                    )
                }

                // if (!isForScenario) {
                state = setLittleManState(state, {
                    ...getLittleManState(state),
                    // isResetActionCollision: false,
                    currentAnimationName: nextBlendingAnimationName,
                    previousAnimationName: NullableUtils.return_(currentAnimationName)
                })



                let fsmState
                // if (!StateMachine.isState(getStateMachine(state), objectStateName.Climb)) {
                switch (nextBlendingAnimationName) {
                    case animationName.Idle:
                        if (isClimbing(state)) {
                            fsmState = createClimbState()
                        }
                        else {
                            fsmState = createInitialState()
                        }
                        break
                    // case animationName.Run:
                    //     fsmState = createRunState()
                    //     break
                    case animationName.Shoot:
                        fsmState = createShootState()
                        break
                    // case animationName.Swiping:
                    case getSwipBlockService(state).getAnimationName():
                        fsmState = createSwipingState()
                        break

                    // case animationName.PickedControlled:
                    //     fsmState = createControlledState()
                    //     break


                    default:
                        // state = setLittleManState(state, {
                        //     ...getLittleManState(state),
                        //     currentAnimationName: nextBlendingAnimationName
                        // })

                        fsmState = null
                        break
                }



                let promise
                if (NullableUtils.isNullable(fsmState)
                    || isDestoryRelatedStates(getStateMachine(state))
                ) {
                    promise = Promise.resolve(state)
                }
                else {
                    promise = StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), NullableUtils.getExn(fsmState), null)
                }

                return promise.then(state => {
                    return Event.trigger(state, getAbstractState, getLittleManAnimationChangeEventName(), buildLittleManAnimationChangeEventData(
                        currentAnimationName, nextBlendingAnimationName
                    ))
                })
            }

            return Promise.resolve(state)
        }, getLittleManState(state).nextBlendingAnimationName),
        Promise.resolve(state)
    )
}

let _handlePlayOnce = (state: state) => {
    let { isCurrentAnimationOnlyPlayOnce, currentAnimationName } = getLittleManState(state)

    if (isCurrentAnimationOnlyPlayOnce &&
        isEnd(
            state,
            currentAnimationName,
            getIsDebug(state)
        )
    ) {
        // MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl).pause()
        SkinAnimation.getAction(getAbstractState(state), getName(), currentAnimationName).paused = true
        // state = setAbstractState(state, SkinAnimation.stopSkinAnimation(getAbstractState(state), currentAnimationName, getName()))
    }
    else {
        // state = setAbstractState(state, SkinAnimation.playSkinAnimation(getAbstractState(state), currentAnimationName, getName(), false))
    }

    return state
}

let _updateSpecificAnimationDuration = (state, factor, animationName_) => {
    let clip = SkinAnimation.getClip(getAbstractState(state), animationName_)
    let action = SkinAnimation.getAction(getAbstractState(state), getName(), animationName_)

    let duration = clip.duration

    duration *= factor

    SkinAnimation.setDuration(action, duration)

    return state
}

let _getAnimationDurationFactor = (state: state, emitSpeed_) => {
    const minFactor = 0.1

    let factor
    if (getIsDebug(state)) {
        factor = minFactor
    }
    else {
        factor = (emitSpeed_ / emitSpeed.Middle * 0.5 * getValue(state).emitSpeedFactor) / getEmitSpeedIncreaseRatio(getCrazyLevel(state))
    }

    return NumberUtils.greaterThan(factor, minFactor)
}

let _updateAnimationDuration = (state: state) => {
    // TODO move to skill service->Event

    // if (isCurrentGunNeedUpdateAnimationDuration(state)) {
    state = _updateSpecificAnimationDuration(state, _getAnimationDurationFactor(state, getCurrentGunValue(state).emitSpeed), animationName.Shoot)
    // }

    state = _updateSpecificAnimationDuration(state, _getAnimationDurationFactor(state, SwipingWeapon.getValue(state).emitSpeed),
        getSwipBlockService(state).getAnimationName()
    )

    return state
}


export let updateAnimation = (state: state): Promise<state> => {
    return _updateAnimationBlendAndFSMState(state).then(state => {
        state = setLittleManState(state, {
            ...getLittleManState(state),
            nextBlendingAnimationName: NullableUtils.getEmpty()
        })

        state = _updateAnimationDuration(state)

        state = _handlePlayOnce(state)

        state = setAbstractState(state, SkinAnimation.updateSkinAnimation(getAbstractState(state), getName(), Device.getDelta(getAbstractState(state))))

        return state
    })
}

export let isPlayingAnimation = (state, animationName) => {
    return SkinBlendAnimation.getWeightForNotMMD(SkinAnimation.getAction(getAbstractState(state), getName(), animationName)) > 0
}

// export let deathHandler = (state: state, { userData }) => {
//     state = setBonePositionYOffset(state, getLittleMan(state), 0)

//     return Promise.resolve(state)
// }

// export let standupNeedFixHandler = (state: state, { userData }) => {
//     // state = setBonePositionYOffset(state, getLittleMan(state), 0)
//     state = setBonePositionYOffset(state, getLittleMan(state), getCurrentModelData(state).positionYOffset)

//     return Promise.resolve(state)
// }


export let resetAnimation = (state: state, defaultAnimationName) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        currentAnimationName: NullableUtils.return_(defaultAnimationName),
        previousAnimationName: NullableUtils.getEmpty(),
        nextBlendingAnimationName: NullableUtils.getEmpty(),
    })
}