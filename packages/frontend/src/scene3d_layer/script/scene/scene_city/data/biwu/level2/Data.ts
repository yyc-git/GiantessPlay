import { Vector2, Vector3 } from "three"
import { buildPickdownFromIdleWorkEventNameEventData, getBackLeftLightStompEndEventName, getBackRightLightStompEndEventName, getHangLeftLightStompEndEventName, getHangRightLightStompEndEventName, getPickdownFromIdleWorkEventName } from "../../../../../../utils/EventUtils"
import { getIsDebug } from "../../../../Scene"
import { getLateFrameIndex } from "../../../utils/DataUtils"
import { animationBlendData, animationCollisionData, articluatedAnimationData, track } from "../../DataType"
import { getAnimationFrameCountWithoutState, getBackRightLightStompAnimationResourcePath } from "./Const"
import { actionName, animationName, articluatedAnimationName } from "./DataType"
import { getPickdownFromIdleWorkFrameIndex } from "../level1/Const"
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
                return isTriggerActionFunc(state, usedGirl, actionName.PickdownFromIdle)
            },
            currentAnimationNames: [animationName.Idle],
            noBlend: true,
            nextAnimationName: animationName.PickdownFromIdle,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.PickdownFromIdle, getIsDebug(state))
            },
            currentAnimationNames: [animationName.PickdownFromIdle],
            nextAnimationName: animationName.Idle,
            noBlend: true
        },


        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.HangRightLightStomp)
            },
            currentAnimationNames: [animationName.Idle],
            noBlend: true,
            // weight: 0.5,
            nextAnimationName: animationName.HangRightLightStomp,
            // isOnlyPlayOnce: true,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.HangRightLightStomp, getIsDebug(state))
            },
            currentAnimationNames: [animationName.HangRightLightStomp],
            nextAnimationName: animationName.KeepRightLightStomp,
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.HangLeftLightStomp)
            },
            currentAnimationNames: [animationName.Idle],
            noBlend: true,
            // weight: 0.5,
            nextAnimationName: animationName.HangLeftLightStomp,
            // isOnlyPlayOnce: true,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.HangLeftLightStomp, getIsDebug(state))
            },
            currentAnimationNames: [animationName.HangLeftLightStomp],
            nextAnimationName: animationName.KeepLeftLightStomp,
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.BackRightLightStomp)
            },
            currentAnimationNames: [animationName.KeepRightLightStomp],
            noBlend: true,
            nextAnimationName: animationName.BackRightLightStomp,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.BackRightLightStomp, getIsDebug(state))
            },
            currentAnimationNames: [animationName.BackRightLightStomp],
            nextAnimationName: animationName.Idle,
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.BackLeftLightStomp)
            },
            currentAnimationNames: [animationName.KeepLeftLightStomp],
            noBlend: true,
            nextAnimationName: animationName.BackLeftLightStomp,
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.BackLeftLightStomp, getIsDebug(state))
            },
            currentAnimationNames: [animationName.BackLeftLightStomp],
            nextAnimationName: animationName.Idle,
            noBlend: true
        },



        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.HeavyStressingRightLightStomp)
            },
            currentAnimationNames: [
                animationName.KeepRightLightStomp,
            ],
            weight: 0.0,
            noBlend: true,
            nextAnimationName: animationName.HeavyStressingRightLightStomp
        },

        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.HeavyStressingRightLightStomp, getIsDebug(state))
            },
            currentAnimationNames: [animationName.HeavyStressingRightLightStomp],
            nextAnimationName: animationName.Idle,
            noBlend: true
        },


        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.HeavyStressingLeftLightStomp)
            },
            currentAnimationNames: [
                animationName.KeepLeftLightStomp,
            ],
            weight: 0.0,
            noBlend: true,
            nextAnimationName: animationName.HeavyStressingLeftLightStomp
        },

        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,animationName.HeavyStressingLeftLightStomp, getIsDebug(state))
            },
            currentAnimationNames: [animationName.HeavyStressingLeftLightStomp],
            nextAnimationName: animationName.Idle,
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
            name: animationName.PickdownFromIdle,

            shapeDamage: [],
            timeline: [
                {
                    frameIndex: getPickdownFromIdleWorkFrameIndex(),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getPickdownFromIdleWorkEventName(),
                            eventData: buildPickdownFromIdleWorkEventNameEventData(
                                // getShapeFunc(state, usedGirl, collisionPart.RightHand).center
                                getShapeFunc(state, usedGirl, collisionPart.RightHand).center.clone().setY(0)
                            )
                        }
                    }
                },
            ]
        },

        {
            name: animationName.HangRightLightStomp,

            shapeDamage: [],
            timeline: [
                {
                    frameIndex: getLateFrameIndex(getAnimationFrameCountWithoutState(animationName.HangRightLightStomp)),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getHangRightLightStompEndEventName(),
                            eventData: {usedGirl}
                        }
                    }
                },
            ]
        },

        {
            name: animationName.HangLeftLightStomp,

            shapeDamage: [],
            timeline: [
                {
                    frameIndex: getLateFrameIndex(getAnimationFrameCountWithoutState(animationName.HangLeftLightStomp)),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getHangLeftLightStompEndEventName(),
                            eventData: {usedGirl}
                        }
                    }
                },
            ]
        },

        {
            name: animationName.BackRightLightStomp,

            shapeDamage: [],
            timeline: [
                {
                    frameIndex: getLateFrameIndex(getAnimationFrameCountWithoutState(animationName.BackRightLightStomp)),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getBackRightLightStompEndEventName(),
                            eventData: {usedGirl}
                        }
                    }
                },
            ]
        },

        {
            name: animationName.BackLeftLightStomp,

            shapeDamage: [],
            timeline: [
                {
                    frameIndex: getLateFrameIndex(getAnimationFrameCountWithoutState(animationName.BackLeftLightStomp)),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getBackLeftLightStompEndEventName(),
                            eventData: {usedGirl}
                        }
                    }
                },
            ]
        },

        {
            name: animationName.HeavyStressingRightLightStomp,

            shapeDamage: [],
            timeline: [
                {
                    frameIndex: getLateFrameIndex(getAnimationFrameCountWithoutState(animationName.HeavyStressingRightLightStomp)),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getBackRightLightStompEndEventName(),
                            eventData: {usedGirl}
                        }
                    }
                },
            ]
        },

        {
            name: animationName.HeavyStressingLeftLightStomp,

            shapeDamage: [],
            timeline: [
                {
                    frameIndex: getLateFrameIndex(getAnimationFrameCountWithoutState(animationName.HeavyStressingLeftLightStomp)),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getBackLeftLightStompEndEventName(),
                            eventData: {usedGirl}
                        }
                    }
                },
            ]
        },

    ]
}

export let getArticluatedAnimationData = (): Array<articluatedAnimationData<articluatedAnimationName>> => {
    return [
        {
            name: articluatedAnimationName.Rub,
            initial: (state, getValueFunc) => {
                let origin = getValueFunc(state)

                return { x: origin.x, z: origin.z }
            },
            // tweens: (state, getParamFunc) => {
            //     let [position, amplitude, timeScalar] = getParamFunc(state)

            //     let isXDirection = Math.random() > 0.5

            //     let t1, t2
            //     let t3 = position
            //     if (isXDirection) {
            //         t1 = _v1_1.set(position.x - amplitude, position.z)
            //         t2 = _v1_2.set(position.x + amplitude, position.z)
            //     }
            //     else {
            //         t1 = _v1_1.set(position.x, position.z - amplitude)
            //         t2 = _v1_2.set(position.x, position.z + amplitude)
            //     }

            //     return [
            //         [{ x: t1.x, z: t1.y }, 500 * timeScalar],
            //         [{ x: t2.x, z: t2.y }, 1000 * timeScalar],
            //         [{ x: t3.x, z: t3.z }, 500 * timeScalar],
            //     ]
            // },
            tweens: (state, getParamFunc) => {
                let [position, amplitude, timeScalar] = getParamFunc(state)

                let isXDirection = NumberUtils.isRandomRate(0.5)

                amplitude = NumberUtils.isRandomRate(0.5) ? amplitude : -amplitude

                let t1
                let t3 = position
                if (isXDirection) {
                    t1 = _v1_1.set(position.x + amplitude, position.z)
                }
                else {
                    t1 = _v1_1.set(position.x, position.z + amplitude)
                }

                return [
                    [{ x: t1.x, z: t1.y }, 500 * timeScalar],
                    [{ x: t3.x, z: t3.z }, 500 * timeScalar],
                ]
            },
            repeatCount: 2,
        },
    ]
}