import { Vector2, Vector3 } from "three"
import { buildPickdownFromIdleWorkEventNameEventData, getBackLeftLightStompEndEventName, getBackRightLightStompEndEventName, getHangLeftLightStompEndEventName, getHangRightLightStompEndEventName, getHeavyStressingLieBeginMaxEventName, getHeavyStressingLieEndEventName, getHeavyStressingLieEndMaxEventName } from "../../../../../../utils/EventUtils"
import { getIsDebug } from "../../../../Scene"
import { getLateFrameIndex } from "../../../utils/DataUtils"
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
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.HangRightHand)
            },
            currentAnimationNames: [animationName.KeepLie],
            noBlend: true,
            nextAnimationName: animationName.HangRightHand,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.HangRightHand, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.HangRightHand],
            nextAnimationName: animationName.KeepRightHandDefault,
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.HangTwoHands)
            },
            currentAnimationNames: [animationName.KeepLie],
            noBlend: true,
            nextAnimationName: animationName.HangTwoHands,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.HangTwoHands, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.HangTwoHands],
            nextAnimationName: animationName.KeepTwoHandsDefault,
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.HangLeftHandRightHand)
            },
            currentAnimationNames: [animationName.KeepLie],
            noBlend: true,
            nextAnimationName: animationName.HangLeftHandRightHand,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.HangLeftHandRightHand, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.HangLeftHandRightHand],
            nextAnimationName: animationName.KeepLeftHandRightHand,
            noBlend: true
        },


        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.BackRightHand)
            },
            currentAnimationNames: [animationName.KeepRightHandDefault],
            noBlend: true,
            nextAnimationName: animationName.BackRightHand,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.BackRightHand, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.BackRightHand],
            nextAnimationName: animationName.KeepLie,
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.BackTwoHands)
            },
            currentAnimationNames: [animationName.KeepTwoHandsDefault],
            noBlend: true,
            nextAnimationName: animationName.BackTwoHands,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.BackTwoHands, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.BackTwoHands],
            nextAnimationName: animationName.KeepLie,
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.BackLeftHandRightHand)
            },
            currentAnimationNames: [animationName.KeepLeftHandRightHand],
            noBlend: true,
            nextAnimationName: animationName.BackLeftHandRightHand,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.BackLeftHandRightHand, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.BackLeftHandRightHand],
            nextAnimationName: animationName.KeepLie,
            noBlend: true
        },


        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.RightHandDefaultToOneFinger)
            },
            currentAnimationNames: [animationName.KeepRightHandDefault],
            noBlend: true,
            nextAnimationName: animationName.RightHandDefaultToOneFinger,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.RightHandDefaultToOneFinger, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.RightHandDefaultToOneFinger],
            nextAnimationName: animationName.KeepRightHandOneFinger,
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.RightHandDefaultToBeat)
            },
            currentAnimationNames: [animationName.KeepRightHandDefault],
            noBlend: true,
            nextAnimationName: animationName.RightHandDefaultToBeat,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.RightHandDefaultToBeat, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.RightHandDefaultToBeat],
            nextAnimationName: animationName.KeepRightHandBeat,
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.RightHandDefaultToAdd)
            },
            currentAnimationNames: [animationName.KeepRightHandDefault],
            noBlend: true,
            nextAnimationName: animationName.RightHandDefaultToAdd,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.RightHandDefaultToAdd, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.RightHandDefaultToAdd],
            nextAnimationName: animationName.KeepRightHandAdd,
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.TwoHandsDefaultToOneFinger)
            },
            currentAnimationNames: [animationName.KeepTwoHandsDefault],
            noBlend: true,
            nextAnimationName: animationName.TwoHandsDefaultToOneFinger,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.TwoHandsDefaultToOneFinger, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.TwoHandsDefaultToOneFinger],
            nextAnimationName: animationName.KeepTwoHandsOneFinger,
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.TwoHandsDefaultToBeat)
            },
            currentAnimationNames: [animationName.KeepTwoHandsDefault],
            noBlend: true,
            nextAnimationName: animationName.TwoHandsDefaultToBeat,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.TwoHandsDefaultToBeat, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.TwoHandsDefaultToBeat],
            nextAnimationName: animationName.KeepTwoHandsBeat,
            noBlend: true
        },


        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.RightHandOneFingerToDefault)
            },
            currentAnimationNames: [animationName.KeepRightHandOneFinger],
            noBlend: true,
            nextAnimationName: animationName.RightHandOneFingerToDefault,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.RightHandOneFingerToDefault, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.RightHandOneFingerToDefault],
            nextAnimationName: animationName.KeepRightHandDefault,
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.RightHandBeatToDefault)
            },
            currentAnimationNames: [animationName.KeepRightHandBeat],
            noBlend: true,
            nextAnimationName: animationName.RightHandBeatToDefault,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.RightHandBeatToDefault, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.RightHandBeatToDefault],
            nextAnimationName: animationName.KeepRightHandDefault,
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.RightHandAddToDefault)
            },
            currentAnimationNames: [animationName.KeepRightHandAdd],
            noBlend: true,
            nextAnimationName: animationName.RightHandAddToDefault,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.RightHandAddToDefault, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.RightHandAddToDefault],
            nextAnimationName: animationName.KeepRightHandDefault,
            noBlend: true
        },


        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.TwoHandsOneFingerToDefault)
            },
            currentAnimationNames: [animationName.KeepTwoHandsOneFinger],
            noBlend: true,
            nextAnimationName: animationName.TwoHandsOneFingerToDefault,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.TwoHandsOneFingerToDefault, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.TwoHandsOneFingerToDefault],
            nextAnimationName: animationName.KeepTwoHandsDefault,
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.TwoHandsBeatToDefault)
            },
            currentAnimationNames: [animationName.KeepTwoHandsBeat],
            noBlend: true,
            nextAnimationName: animationName.TwoHandsBeatToDefault,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.TwoHandsBeatToDefault, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.TwoHandsBeatToDefault],
            nextAnimationName: animationName.KeepTwoHandsDefault,
            noBlend: true
        },


        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.HeavyStressingLie)
            },
            currentAnimationNames: [
                animationName.KeepLie,
            ],
            weight: 0.0,
            noBlend: true,
            nextAnimationName: animationName.HeavyStressingLie
        },

        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.HeavyStressingLie, getIsDebug(state), 3)
            },
            currentAnimationNames: [animationName.HeavyStressingLie],
            nextAnimationName: animationName.KeepLie,
            noBlend: true
        },

    ]
}

export let getAnimationCollisionData = ([isCollisionWithRigidBodyFunc, isCollisionWithCharacterFunc, isSmallGiantessOrBiggerFunc, isMiddleGiantessOrBiggerFunc,
    getShapeFunc,
    getScaleFunc,
    getHeightFunc,
    isLittleCharacterTypeFunc
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
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getHeavyStressingLieBeginMaxEventName(),
                            eventData: {usedGirl}
                        }
                    }
                },
                {
                    frameIndex: getHeavyStressingLieEndMaxFrameIndex(),
                    frameRange: 5,

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getHeavyStressingLieEndMaxEventName(),
                            eventData: {usedGirl}
                        }
                    }
                },
                {
                    frameIndex: getLateFrameIndex(getAnimationFrameCountWithoutState(animationName.HeavyStressingLie)),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getHeavyStressingLieEndEventName(),
                            eventData: {usedGirl}
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
        //             frameIndex: getLateFrameIndex(getAnimationFrameCountWithoutState(animationName.RightHandDefaultToOneFinger)),

        //             track: track.Event,
        //             value: (state, usedGirl, {
        //                 force
        //             }): any => {
        //                 return {
        //                     eventName: getRightHandDefaultToOneFingerEndEventName(),
        //                     eventData: {usedGirl}
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
        //             frameIndex: getLateFrameIndex(getAnimationFrameCountWithoutState(animationName.TwoHandsDefaultToOneFinger)),

        //             track: track.Event,
        //             value: (state, usedGirl, {
        //                 force
        //             }): any => {
        //                 return {
        //                     eventName: getTwoHandsDefaultToOneFingerEndEventName(),
        //                     eventData: {usedGirl}
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