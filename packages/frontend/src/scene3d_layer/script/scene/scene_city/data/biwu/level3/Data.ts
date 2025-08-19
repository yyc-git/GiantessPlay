import { Vector2, Vector3 } from "three"
import { buildPickdownFromIdleWorkEventNameEventData, getBackLeftLightStompEndEventName, getBackRightLightStompEndEventName, getHangLeftLightStompEndEventName, getHangRightLightStompEndEventName, getHeavyStressingLieBeginMaxEventName, getHeavyStressingLieEndEventName, getHeavyStressingLieEndMaxEventName } from "../../../../../../utils/EventUtils"
import { getIsDebug } from "../../../../Scene"
import { getLastFrameIndex } from "../../../utils/DataUtils"
import { actionData, animationBlendData, animationCollisionData, articluatedAnimationData, phaseData, track } from "../../DataType"
import { getAnimationFrameCountWithoutState, getHeavyStressingLieBeginMaxFrameIndex, getHeavyStressingLieEndMaxFrameIndex } from "./Const"
import { actionName, animationName, articluatedAnimationName, heavyStressingLiePhase } from "./DataType"
import { collisionPart } from "../../../type/StateType"
import { NumberUtils } from "meta3d-jiehuo-abstract"

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();

export let getAnimationBlendData = ([{ isMoveFunc, isTriggerActionFunc, isActionStateFunc }, getFrameIndexFunc, isSpecificFrameIndexFunc, isEndFunc, isPreviousAnimationFunc, hasPickDataFunc]): animationBlendData<animationName> => {
    return [

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.HangRightHand)
            },
            currentAnimationNames: [animationName.KeepLie],
            noBlend: true,
            nextAnimationName: animationName.HangRightHand,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.HangRightHand, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.HangRightHand],
            nextAnimationName: animationName.KeepRightHandDefault,
            noBlend: true
        },

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.HangTwoHands)
            },
            currentAnimationNames: [animationName.KeepLie],
            noBlend: true,
            nextAnimationName: animationName.HangTwoHands,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.HangTwoHands, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.HangTwoHands],
            nextAnimationName: animationName.KeepTwoHandsDefault,
            noBlend: true
        },

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.HangLeftHandRightHand)
            },
            currentAnimationNames: [animationName.KeepLie],
            noBlend: true,
            nextAnimationName: animationName.HangLeftHandRightHand,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.HangLeftHandRightHand, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.HangLeftHandRightHand],
            nextAnimationName: animationName.KeepLeftHandRightHand,
            noBlend: true
        },


        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.BackRightHand)
            },
            currentAnimationNames: [animationName.KeepRightHandDefault],
            noBlend: true,
            nextAnimationName: animationName.BackRightHand,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.BackRightHand, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.BackRightHand],
            nextAnimationName: animationName.KeepLie,
            noBlend: true
        },

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.BackTwoHands)
            },
            currentAnimationNames: [animationName.KeepTwoHandsDefault],
            noBlend: true,
            nextAnimationName: animationName.BackTwoHands,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.BackTwoHands, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.BackTwoHands],
            nextAnimationName: animationName.KeepLie,
            noBlend: true
        },

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.BackLeftHandRightHand)
            },
            currentAnimationNames: [animationName.KeepLeftHandRightHand],
            noBlend: true,
            nextAnimationName: animationName.BackLeftHandRightHand,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.BackLeftHandRightHand, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.BackLeftHandRightHand],
            nextAnimationName: animationName.KeepLie,
            noBlend: true
        },


        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.RightHandDefaultToOneFinger)
            },
            currentAnimationNames: [animationName.KeepRightHandDefault],
            noBlend: true,
            nextAnimationName: animationName.RightHandDefaultToOneFinger,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.RightHandDefaultToOneFinger, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.RightHandDefaultToOneFinger],
            nextAnimationName: animationName.KeepRightHandOneFinger,
            noBlend: true
        },

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.RightHandDefaultToBeat)
            },
            currentAnimationNames: [animationName.KeepRightHandDefault],
            noBlend: true,
            nextAnimationName: animationName.RightHandDefaultToBeat,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.RightHandDefaultToBeat, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.RightHandDefaultToBeat],
            nextAnimationName: animationName.KeepRightHandBeat,
            noBlend: true
        },

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.RightHandDefaultToAdd)
            },
            currentAnimationNames: [animationName.KeepRightHandDefault],
            noBlend: true,
            nextAnimationName: animationName.RightHandDefaultToAdd,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.RightHandDefaultToAdd, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.RightHandDefaultToAdd],
            nextAnimationName: animationName.KeepRightHandAdd,
            noBlend: true
        },

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.TwoHandsDefaultToOneFinger)
            },
            currentAnimationNames: [animationName.KeepTwoHandsDefault],
            noBlend: true,
            nextAnimationName: animationName.TwoHandsDefaultToOneFinger,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.TwoHandsDefaultToOneFinger, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.TwoHandsDefaultToOneFinger],
            nextAnimationName: animationName.KeepTwoHandsOneFinger,
            noBlend: true
        },

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.TwoHandsDefaultToBeat)
            },
            currentAnimationNames: [animationName.KeepTwoHandsDefault],
            noBlend: true,
            nextAnimationName: animationName.TwoHandsDefaultToBeat,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.TwoHandsDefaultToBeat, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.TwoHandsDefaultToBeat],
            nextAnimationName: animationName.KeepTwoHandsBeat,
            noBlend: true
        },


        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.RightHandOneFingerToDefault)
            },
            currentAnimationNames: [animationName.KeepRightHandOneFinger],
            noBlend: true,
            nextAnimationName: animationName.RightHandOneFingerToDefault,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.RightHandOneFingerToDefault, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.RightHandOneFingerToDefault],
            nextAnimationName: animationName.KeepRightHandDefault,
            noBlend: true
        },

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.RightHandBeatToDefault)
            },
            currentAnimationNames: [animationName.KeepRightHandBeat],
            noBlend: true,
            nextAnimationName: animationName.RightHandBeatToDefault,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.RightHandBeatToDefault, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.RightHandBeatToDefault],
            nextAnimationName: animationName.KeepRightHandDefault,
            noBlend: true
        },

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.RightHandAddToDefault)
            },
            currentAnimationNames: [animationName.KeepRightHandAdd],
            noBlend: true,
            nextAnimationName: animationName.RightHandAddToDefault,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.RightHandAddToDefault, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.RightHandAddToDefault],
            nextAnimationName: animationName.KeepRightHandDefault,
            noBlend: true
        },


        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.TwoHandsOneFingerToDefault)
            },
            currentAnimationNames: [animationName.KeepTwoHandsOneFinger],
            noBlend: true,
            nextAnimationName: animationName.TwoHandsOneFingerToDefault,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.TwoHandsOneFingerToDefault, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.TwoHandsOneFingerToDefault],
            nextAnimationName: animationName.KeepTwoHandsDefault,
            noBlend: true
        },

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.TwoHandsBeatToDefault)
            },
            currentAnimationNames: [animationName.KeepTwoHandsBeat],
            noBlend: true,
            nextAnimationName: animationName.TwoHandsBeatToDefault,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.TwoHandsBeatToDefault, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.TwoHandsBeatToDefault],
            nextAnimationName: animationName.KeepTwoHandsDefault,
            noBlend: true
        },


        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.HeavyStressingLie)
            },
            currentAnimationNames: [
                animationName.KeepLie,
            ],
            weight: 0.0,
            noBlend: true,
            nextAnimationName: animationName.HeavyStressingLie
        },

        {
            condition: state => {
                return isEndFunc(state, animationName.HeavyStressingLie, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.HeavyStressingLie],
            nextAnimationName: animationName.KeepLie,
            noBlend: true
        },

    ]
}

export let getAnimationCollisionData = ([isCollisionWithVehicleFunc, isCollisionWithCharacterFunc, isSmallGiantessOrBiggerFunc, isMiddleGiantessOrBiggerFunc,
    getShapeFunc,
    getScaleFunc,
    getHeightFunc,
    isLittleRoadFunc
]): Array<animationCollisionData<animationName>> => {
    return [
        {
            name: animationName.HeavyStressingLie,

            shapeDamage: [
                collisionPart.RightBreast,
                collisionPart.LeftBreast,
                collisionPart.RightHand,
                collisionPart.LeftHand,
            ],
            timeline: [
                {
                    frameIndex: getHeavyStressingLieBeginMaxFrameIndex(),
                    frameRange: 5,

                    track: track.Event,
                    value: (state, {
                        force
                    }): any => {
                        return {
                            eventName: getHeavyStressingLieBeginMaxEventName(),
                            eventData: null
                        }
                    }
                },
                {
                    frameIndex: getHeavyStressingLieEndMaxFrameIndex(),
                    frameRange: 5,

                    track: track.Event,
                    value: (state, {
                        force
                    }): any => {
                        return {
                            eventName: getHeavyStressingLieEndMaxEventName(),
                            eventData: null
                        }
                    }
                },
                {
                    frameIndex: getLastFrameIndex(getAnimationFrameCountWithoutState(animationName.HeavyStressingLie)),

                    track: track.Event,
                    value: (state, {
                        force
                    }): any => {
                        return {
                            eventName: getHeavyStressingLieEndEventName(),
                            eventData: null
                        }
                    }
                },
            ]
        },
        // {
        //     name: animationName.RightHandDefaultToOneFinger,

        //     shapeDamage: [],
        //     timeline: [
        //         {
        //             frameIndex: getLastFrameIndex(getAnimationFrameCountWithoutState(animationName.RightHandDefaultToOneFinger)),

        //             track: track.Event,
        //             value: (state, {
        //                 force
        //             }): any => {
        //                 return {
        //                     eventName: getRightHandDefaultToOneFingerEndEventName(),
        //                     eventData: null
        //                 }
        //             }
        //         },
        //     ]
        // },

        // {
        //     name: animationName.TwoHandsDefaultToOneFinger,

        //     shapeDamage: [],
        //     timeline: [
        //         {
        //             frameIndex: getLastFrameIndex(getAnimationFrameCountWithoutState(animationName.TwoHandsDefaultToOneFinger)),

        //             track: track.Event,
        //             value: (state, {
        //                 force
        //             }): any => {
        //                 return {
        //                     eventName: getTwoHandsDefaultToOneFingerEndEventName(),
        //                     eventData: null
        //                 }
        //             }
        //         },
        //     ]
        // },

    ]
}


export let getActionData = (): actionData<animationName> => {
    return [
        {
            name: animationName.HeavyStressingLie,
            force: {
                [heavyStressingLiePhase.Up]: 3 * 0.01,
                [heavyStressingLiePhase.Other]: 1 * 0.01,
            }
        },
    ]
}

export let getPhase = (): phaseData<animationName> => {
    return [
        {
            name: animationName.HeavyStressingLie,
            value: [
                {
                    frameIndexRange: [0, 10],
                    phase: heavyStressingLiePhase.Up
                },
                {
                    frameIndexRange: [11, 60],
                    phase: heavyStressingLiePhase.Other
                },
            ]
        },
    ]
}

export let getArticluatedAnimationData = (): Array<articluatedAnimationData<articluatedAnimationName>> => {
    return [
        {
            name: articluatedAnimationName.MoveLeftHandProtect,
            initial: (state, getValueFunc) => {
                let origin = getValueFunc(state)

                return { x: origin.x }
            },
            tweens: (state, getParamFunc) => {
                let [position, amplitude, timeScalar] = getParamFunc(state)

                // let isXDirection = NumberUtils.isRandomRate(0.5)
                let isXDirection = true

                // amplitude = NumberUtils.isRandomRate(0.5) ? amplitude : -amplitude

                let t1
                // let t3 = position
                if (isXDirection) {
                    // t1 = _v1_1.set(position.x + amplitude, position.z)
                    t1 = position.x + amplitude
                }
                // else {
                //     t1 = _v1_1.set(position.x, position.z + amplitude)
                // }

                return [
                    // [{ x: t1.x, z: t1.y }, 500 * timeScalar],
                    [{ x: t1 }, 500 * timeScalar],
                    [{ x: position.x }, 500 * timeScalar],
                ]
            },
            repeatCount: 2,
        },
    ]
}