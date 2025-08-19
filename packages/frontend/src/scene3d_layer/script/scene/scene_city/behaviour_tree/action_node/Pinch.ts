import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { actionNode, actionNodeFunc, behaviourTreeNodeExecuteResult, pose, targetType } from "../../type/StateType"
import { state } from "../../../../../type/StateType"
import { CullFaceBack, Euler, Quaternion, Vector2, Vector3 } from "three"
import { getGirlPosition, getGirlPositionParrelToObj, getGirlRotation, setPivotWorldPositionAndUpdateBox, setGirlRotation, setGirlRotationAndLock, unlockGirlRotation } from "../../girl/Utils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import {  getStep } from "../../manage/city1/PathFind"
import { getIsDebug } from "../../../Scene"
import { getGirlScale, setGirlPosition } from "../../CityScene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { ThirdPersonControls } from "meta3d-jiehuo-abstract"
import { Map } from "immutable"
import { road, lodQueueIndex, name, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Vector3Utils } from "meta3d-jiehuo-abstract"
import { Vector2Utils } from "meta3d-jiehuo-abstract"

import { isInGirlAttackRange } from "../../utils/CollisionUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { LOD } from "meta3d-jiehuo-abstract"
import { isMoveCollisioned } from "../../girl/Move"
import { actionName } from "../../data/DataType"
import { getCurrentPose, isPose } from "../../girl/Pose"
import { triggerAction } from "./Utils"
import { Console } from "meta3d-jiehuo-abstract"

export let pinch: actionNodeFunc = (state, id) => {
    Console.log("pinch")

    let actionName_
    switch (getCurrentPose(state)) {
        case pose.Stand:
        case pose.Crawl:
            return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
        case pose.Pick:
            actionName_ = actionName.Pinch
            break
    }

    return triggerAction(state, actionName_, id)
}
