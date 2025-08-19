import { buildPickdownFromIdleWorkEventNameEventData, getBackRightLightStompEndEventName, getHangRightLightStompEndEventName, getPickdownFromIdleWorkEventName } from "../../../../../../utils/EventUtils"
import { getIsDebug } from "../../../../Scene"
import { collisionPart } from "../../../type/StateType"
import { getLastFrameIndex } from "../../../utils/DataUtils"
import { animationBlendData, animationCollisionData, track } from "../../DataType"
import { getAnimationFrameCountWithoutState, getPickdownFromIdleWorkFrameIndex } from "./Const"
import { actionName, animationName } from "./DataType"

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
    ]
}