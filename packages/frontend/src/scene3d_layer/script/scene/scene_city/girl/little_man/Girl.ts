import { Event, NullableUtils, Scene, Device, SkinAnimation, Loader, ModelLoader, Camera, DisposeUtils, ThirdPersonControls, Layer } from "meta3d-jiehuo-abstract"
// import { state } from "../../type/StateType"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../state/State"
// import { damageType, collisionPart, girl, mmdCharacter, stompPhase, walkPhase, soundType, force, objectStateName, thirdPersonCameraTarget, pose, actionState, scaleState, result, giantessStrength, giantessScale } from "../type/StateType"
import { AnimationClip, AxesHelper, Box3, Box3Helper, CompressedArrayTexture, Euler, Matrix3, Matrix4, Mesh, MeshPhongMaterial, Object3D, Quaternion, Vector3 } from "three"
// import { setTarget } from "./Camera"
import { getThirdPersonCameraTarget, getOrbitControlsTarget, isCameraCollision, updateThirdPersonControlsForChangeScale } from "../../Camera"
import { Flow, Capsule } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { SkinBlendAnimation } from "meta3d-jiehuo-abstract"
import { Map } from "immutable"
import { ScreenShake } from "meta3d-jiehuo-abstract"
import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera"
// import { getGiantessStatusUpdateEventName, getPickupEventName, getPickdownEventName, getPinchJudageDamageEventName, getEatEventName, getStandToCrawlEventName, getCrawlToStandEventName, getLittleManStatusUpdateEventName, } from "../../../../utils/EventUtils"
// import { actionName, animationName, articluatedAnimationName, effect, excitement, forceSize, frameIndex, particle, track } from "../data/DataType"
import { move } from "../Move"
import { computeGirlBox, computeHeight, getGirlBox, getCurrentHeight, getScale, getScaleByHeight, setGirlRotation, markGirlVisible, markGirlNotVisible, getScaleIncreaseTimes, updateMMDPhysicsConfigForScale, getDamagePartFactor, getWeaponTypeFactor, getForceFactor, getSkillStateFactor, getCollisionPartFactor, getScaleFactor, setHeight } from "../Utils"
import { getAllAnimationNames, getCurrentAnimationName, isChangeScaling, isCompletelyPlayingAnimation, isKeepPoseAnimation, isPlayingAnimation, isPlayingAnimationByWeight, playBiggerAnimation, playSmallerToHalfSizeAnimation, updateAnimation, updateAnimationDuration } from "../Animation"
import { updateAnimationCollision } from "../Collision"
import * as PickPose from "../PickPose"
import { createDestroyingState, createInitialState, createStressingState, getStateMachine, isChangeCrawlPoseState, isSkillState, setStateMachine, update as updateFSMState } from "../FSMState"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { girlValue, weaponType } from "../../data/ValueType"
import { buildGiantessStatusUpdateEventNameEventData, getGiantessStatusUpdateEventName } from "../../../../../utils/EventUtils"
import { actionName, animationName, articluatedAnimationName, effect, excitement, forceSize, frameIndex, particle, track } from "../../data/DataType"
import { damageType, collisionPart, girl, stompPhase, walkPhase, soundType, force, objectStateName, thirdPersonCameraTarget, pose, actionState, scaleState, result, giantessStrength, giantessScale, damagePart } from "../../type/StateType"
import { state } from "../../../../../type/StateType"
import { getLittleManSetting } from "../../CityScene"
import { getGirlState, getHp, setGirlState } from "../Girl"
import { isCloth } from "../Cloth"
import { Console } from "meta3d-jiehuo-abstract"

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();

// export let getValue = (name): girlValue => {
//     let state = readState()

//     let hp, restoreHpTime, biggerMaxTime, initialScale
//     switch (getLittleManSetting(state).giantessStrength) {
//         case giantessStrength.Low:
//             hp = 100000
//             restoreHpTime = 60000
//             biggerMaxTime = 40000
//             break
//         case giantessStrength.Middle:
//             hp = 150000
//             restoreHpTime = 50000
//             biggerMaxTime = 60000
//             break
//         case giantessStrength.High:
//             hp = 200000
//             restoreHpTime = 40000
//             biggerMaxTime = 100000
//             break
//         case giantessStrength.VeryHigh:
//             hp = 250000
//             restoreHpTime = 30000
//             biggerMaxTime = 150000
//             break
//         default:
//             throw new Error("err")
//     }

//     switch (getLittleManSetting(state).giantessScale) {
//         case giantessScale.Low:
//             initialScale = 10
//             break
//         case giantessScale.Middle:
//             initialScale = 20
//             break
//         case giantessScale.High:
//             initialScale = 40
//             break
//         case giantessScale.VeryHigh:
//             initialScale = 100
//             break
//         case giantessScale.MostHigh:
//             initialScale = 400
//             break
//         default:
//             throw new Error("err")
//     }



//     return {
//         maxExcitement: 100,
//         scaleFactorWithExcitement: 1,
//         initialScale: initialScale,

//         minScaleAsSmallGiantess: 10,
//         minScaleAsMiddleGiantess: 30,
//         volumeFactorForGiantess: 0.01,
//         volumeFactorForNotGiantess: 0.01,

//         minScale: 10,
//         // maxScale: 200,
//         maxScale: 400,

//         screenShakeDistanceFactor: 0.25,
//         screenShakeTime: 150,

//         excitementIncreaseFactor: 1,

//         hp: hp,
//         // hp: 3000000,
//         defenseFactor: 1,


//         restoreHpTime: restoreHpTime,
//         restoreHpSpeedRate: 1 / 100,
//         abstorbHpRate: 10 / 100,

//         allSkillData: [
//             {
//                 name: actionName.Bigger,
//                 excitement: excitement.MostHigh
//             },
//             {
//                 name: actionName.Smaller,
//                 excitement: excitement.Zero
//             },

//             {
//                 name: actionName.Pickup,
//                 excitement: excitement.High
//             },
//             {
//                 name: actionName.Stomp,
//                 excitement: excitement.Zero
//             },
//             {
//                 name: actionName.Run,
//                 excitement: excitement.Zero
//             },
//             {
//                 name: actionName.StandToCrawl,
//                 excitement: excitement.VeryHigh
//             },
//             {
//                 name: actionName.Eat,
//                 excitement: excitement.High
//             },
//             {
//                 name: actionName.Pinch,
//                 excitement: excitement.Middle
//             },
//             {
//                 name: actionName.Pickdown,
//                 excitement: excitement.Zero
//             },
//             {
//                 name: actionName.BreastPress,
//                 excitement: excitement.High
//             },
//             {
//                 name: actionName.CrawlToStand,
//                 excitement: excitement.Zero
//             },
//         ],


//         // biggerSubExcitementTime: 20000,
//         // biggerSubExcitementScalar: excitement.VeryLow,
//         biggerMaxTime: biggerMaxTime,
//     }
// }

export let update = (state: state) => {
    state = setGirlState(state, {
        ...getGirlState(state),
        isMoveCollisioned: false,
        // isRotationLock: false,
    })


    let velocity

    if (isPlayingAnimation(state, animationName.Walk)
        || isPlayingAnimation(state, animationName.Run)
        || isPlayingAnimation(state, animationName.CrawlMove)
    ) {
        let data = move(state)
        state = data[0]
        velocity = data[1]
    }
    else {
        velocity = new Vector3(0, 0, 0)
    }


    // if (isGiantessRoad(state)) {
    //     // if (isPlayingAnimation(state, animationName.Walk)
    //     //     || isPlayingAnimation(state, animationName.Run)
    //     //     || isPlayingAnimation(state, animationName.CrawlMove)
    //     // ) {
    //     //     let data = move(state)
    //     //     state = data[0]
    //     //     velocity = data[1]
    //     // }
    //     // else {
    //     //     velocity = new Vector3(0, 0, 0)
    //     // }

    //     state = setAbstractState(state, ThirdPersonControls.updateCamera(getAbstractState(state), velocity, getOrbitControlsTarget(state),
    //         isCameraCollision(state)
    //     )
    //     )
    // }
    // else if (isLittleRoad(state)) {
    // }

    return updateAnimation(state).then(state => {
        return updateAnimationCollision(state, velocity)
    }).then(state => {
        return updateFSMState(state)
    }).then(state => {
        let { screenShake } = getGirlState(state)
        screenShake.update(state, getCurrentCamera(getAbstractState(state)))

        // state = updateByExcitement(state)

        let promise
        let newHeight = computeHeight(state)
        let oldHeight = getCurrentHeight(state)
        if (newHeight != oldHeight) {
            state = computeGirlBox(state)

            state = setHeight(state, newHeight)


            state = updateAnimationDuration(state, getScale(state))



            // if (isGiantessRoad(state)) {
            //     state = updateThirdPersonControlsForChangeScale(state,
            //         // getScaleByHeight(oldHeight) == 0 ? 1 :
            //         //     getScaleByHeight(newHeight) / getScaleByHeight(oldHeight)
            //     )
            // }

            state = updateMMDPhysicsConfigForScale(state)



            // promise = Event.trigger(state, getAbstractState, getLevelStatusUpdateEventName(), buildLevelStatusUpdateEventData(state))
            promise = Promise.resolve(state)
        }
        else {
            promise = Promise.resolve(state)
        }

        return promise
    })
        .then(state => {
            if (!NullableUtils.isNullable(getGirlState(state).needUpdateStatus)) {
                return Event.trigger(state, getAbstractState, getGiantessStatusUpdateEventName(), buildGiantessStatusUpdateEventNameEventData(
                    NullableUtils.getExn(getGirlState(state).needUpdateStatus).damagePart
                ))
            }

            return state
        })
        .then(PickPose.update)
        .then(state => {
            // if (isLittleRoad(state)) {
            state = computeGirlBox(state)
            // }

            return state
        })
        .then(state => {
            return setGirlState(state, {
                ...getGirlState(state),
                needUpdateStatus: NullableUtils.getEmpty()
            })
        })
}

export let isStressingByRate = (state: state, damage, weaponType_: weaponType, collisionPart_: collisionPart, damagePart: damagePart) => {
    let weaponTypeFactor = getWeaponTypeFactor(weaponType_)

    let collisionPartFactor = getCollisionPartFactor(collisionPart_)

    let forceFactor = getForceFactor(damage)

    let settingFactor

    switch (getLittleManSetting(state).giantessStrength) {
        case giantessStrength.Low:
            settingFactor = 2
            break
        case giantessStrength.Middle:
            settingFactor = 1
            break
        case giantessStrength.High:
            settingFactor = 0.5
            break
        case giantessStrength.VeryHigh:
            settingFactor = 0.15
            break
        default:
            throw new Error("err")
    }

    let scaleFactor = getScaleFactor(state)


    // const factor = 0.8
    const factor = 0.2 * 0.3
    // const factor = 0.2 


    let damagePartFactor = getDamagePartFactor(state, damagePart)


    // let rate = NumberUtils.clamp(1 * (1 / Math.sqrt(scale)) * (damage / forceSize.Middle) * weaponTypeFactor * collisionPartFactor * factor, 0, 1)
    let rate = NumberUtils.clamp(1 * scaleFactor * forceFactor * weaponTypeFactor * collisionPartFactor * factor * settingFactor * damagePartFactor * getSkillStateFactor(state), 0, 1)

    // Console.warn(rate,
    //     damage, weaponType_, collisionPart_
    // )

    return Math.random() < rate
}