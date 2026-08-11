import { buildPickdownFromIdleWorkEventNameEventData, getBackRightLightStompEndEventName, getHangRightLightStompEndEventName, getPickdownFromIdleWorkEventName } from "../../../../../../utils/EventUtils"
import { getIsDebug } from "../../../../Scene"
import { collisionPart } from "../../../type/StateType"
import { getLateFrameIndex } from "../../../utils/DataUtils"
import { animationBlendData, animationCollisionData, track } from "../../DataType"
import { getAnimationFrameCountWithoutState, getPickdownFromIdleWorkFrameIndex } from "./Const"
import { actionName, animationName } from "./DataType"

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
    ]
}