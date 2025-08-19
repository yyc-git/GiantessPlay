import { Vector2, Vector3 } from "three"
import { buildPickdownFromIdleWorkEventNameEventData, getBackLeftLightStompEndEventName, getBackRightLightStompEndEventName, getHangLeftLightStompEndEventName, getHangRightLightStompEndEventName, getPickdownFromIdleWorkEventName } from "../../../../../../utils/EventUtils"
import { getIsDebug } from "../../../../Scene"
import { getLastFrameIndex } from "../../../utils/DataUtils"
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
            condition: state => {
                return isTriggerActionFunc(state, actionName.PickdownFromIdle)
            },
            currentAnimationNames: [animationName.Idle],
            noBlend: true,
            nextAnimationName: animationName.PickdownFromIdle,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.PickdownFromIdle, getIsDebug(state))
            },
            currentAnimationNames: [animationName.PickdownFromIdle],
            nextAnimationName: animationName.Idle,
            noBlend: true
        },


        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.HangRightLightStomp)
            },
            currentAnimationNames: [animationName.Idle],
            noBlend: true,
            // weight: 0.5,
            nextAnimationName: animationName.HangRightLightStomp,
            // isOnlyPlayOnce: true,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.HangRightLightStomp, getIsDebug(state))
            },
            currentAnimationNames: [animationName.HangRightLightStomp],
            nextAnimationName: animationName.KeepRightLightStomp,
            noBlend: true
        },

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.HangLeftLightStomp)
            },
            currentAnimationNames: [animationName.Idle],
            noBlend: true,
            // weight: 0.5,
            nextAnimationName: animationName.HangLeftLightStomp,
            // isOnlyPlayOnce: true,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.HangLeftLightStomp, getIsDebug(state))
            },
            currentAnimationNames: [animationName.HangLeftLightStomp],
            nextAnimationName: animationName.KeepLeftLightStomp,
            noBlend: true
        },

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.BackRightLightStomp)
            },
            currentAnimationNames: [animationName.KeepRightLightStomp],
            noBlend: true,
            nextAnimationName: animationName.BackRightLightStomp,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.BackRightLightStomp, getIsDebug(state))
            },
            currentAnimationNames: [animationName.BackRightLightStomp],
            nextAnimationName: animationName.Idle,
            noBlend: true
        },

        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.BackLeftLightStomp)
            },
            currentAnimationNames: [animationName.KeepLeftLightStomp],
            noBlend: true,
            nextAnimationName: animationName.BackLeftLightStomp,
        },
        {
            condition: state => {
                return isEndFunc(state, animationName.BackLeftLightStomp, getIsDebug(state))
            },
            currentAnimationNames: [animationName.BackLeftLightStomp],
            nextAnimationName: animationName.Idle,
            noBlend: true
        },



        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.HeavyStressingRightLightStomp)
            },
            currentAnimationNames: [
                animationName.KeepRightLightStomp,
            ],
            weight: 0.0,
            noBlend: true,
            nextAnimationName: animationName.HeavyStressingRightLightStomp
        },

        {
            condition: state => {
                return isEndFunc(state, animationName.HeavyStressingRightLightStomp, getIsDebug(state))
            },
            currentAnimationNames: [animationName.HeavyStressingRightLightStomp],
            nextAnimationName: animationName.Idle,
            noBlend: true
        },


        {
            condition: state => {
                return isTriggerActionFunc(state, actionName.HeavyStressingLeftLightStomp)
            },
            currentAnimationNames: [
                animationName.KeepLeftLightStomp,
            ],
            weight: 0.0,
            noBlend: true,
            nextAnimationName: animationName.HeavyStressingLeftLightStomp
        },

        {
            condition: state => {
                return isEndFunc(state, animationName.HeavyStressingLeftLightStomp, getIsDebug(state))
            },
            currentAnimationNames: [animationName.HeavyStressingLeftLightStomp],
            nextAnimationName: animationName.Idle,
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
            name: animationName.PickdownFromIdle,

            shapeDamage: [],
            timeline: [
                {
                    frameIndex: getPickdownFromIdleWorkFrameIndex(),

                    track: track.Event,
                    value: (state, {
                        force
                    }): any => {
                        return {
                            eventName: getPickdownFromIdleWorkEventName(),
                            eventData: buildPickdownFromIdleWorkEventNameEventData(
                                // getShapeFunc(state, collisionPart.RightHand).center
                                getShapeFunc(state, collisionPart.RightHand).center.clone().setY(0)
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
                    frameIndex: getLastFrameIndex(getAnimationFrameCountWithoutState(animationName.HangRightLightStomp)),

                    track: track.Event,
                    value: (state, {
                        force
                    }): any => {
                        return {
                            eventName: getHangRightLightStompEndEventName(),
                            eventData: null
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
                    frameIndex: getLastFrameIndex(getAnimationFrameCountWithoutState(animationName.HangLeftLightStomp)),

                    track: track.Event,
                    value: (state, {
                        force
                    }): any => {
                        return {
                            eventName: getHangLeftLightStompEndEventName(),
                            eventData: null
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
                    frameIndex: getLastFrameIndex(getAnimationFrameCountWithoutState(animationName.BackRightLightStomp)),

                    track: track.Event,
                    value: (state, {
                        force
                    }): any => {
                        return {
                            eventName: getBackRightLightStompEndEventName(),
                            eventData: null
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
                    frameIndex: getLastFrameIndex(getAnimationFrameCountWithoutState(animationName.BackLeftLightStomp)),

                    track: track.Event,
                    value: (state, {
                        force
                    }): any => {
                        return {
                            eventName: getBackLeftLightStompEndEventName(),
                            eventData: null
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
                    frameIndex: getLastFrameIndex(getAnimationFrameCountWithoutState(animationName.HeavyStressingRightLightStomp)),

                    track: track.Event,
                    value: (state, {
                        force
                    }): any => {
                        return {
                            eventName: getBackRightLightStompEndEventName(),
                            eventData: null
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
                    frameIndex: getLastFrameIndex(getAnimationFrameCountWithoutState(animationName.HeavyStressingLeftLightStomp)),

                    track: track.Event,
                    value: (state, {
                        force
                    }): any => {
                        return {
                            eventName: getBackLeftLightStompEndEventName(),
                            eventData: null
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