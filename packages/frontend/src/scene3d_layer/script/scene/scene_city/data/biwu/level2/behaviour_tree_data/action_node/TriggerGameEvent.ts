import { Vector3, Bone, Object3D, LinearTransfer } from "three";
import { actionNodeFunc, behaviourTreeNodeExecuteResult, collisionPart, damageType,  result } from "../../../../../type/StateType";
import { actionName, animationName, articluatedAnimationName } from "../../DataType";
import { isFinish } from "../../../../../scenario/Command";
import { getAllArmyCount } from "../../../../../manage/biwu/level1/ManageScene";
import { triggerMainEvent } from "../../../../../game_event/GameEvent";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Console } from "meta3d-jiehuo-abstract";
import { markIsRunning } from "../../../../../utils/BehaviourManagerUtils";
import { Event } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../../../../../state/State";
import { getMarkFinishEventName } from "../../../../../../../../utils/EventUtils";
import { state } from "../../../../../../../../type/StateType";
import { getIdExn, markFinish, setId } from "../../../../../behaviour_tree/BehaviourTreeManager";
import { scenarioName } from "../../ScenarioData";

const _v1 = /*@__PURE__*/ new Vector3();

let _markFinishEndHandler = (state: state, { userData }) => {
    if (!NullableUtils.isNullable(userData)
        && (
            NullableUtils.getExn(userData) == scenarioName.PickdownArmy_Normal
            || NullableUtils.getExn(userData) == scenarioName.PickdownArmy_Hard
        )
    ) {
        state = setAbstractState(state, Event.off(getAbstractState(state), getMarkFinishEventName(), _markFinishEndHandler))

        return markFinish(state, getIdExn(state, _buildKey()), behaviourTreeNodeExecuteResult.Success)
    }

    return Promise.resolve(state)
}

let _buildKey = () => "triggerGameEvent"

export let triggerGameEvent: actionNodeFunc = (state, id, config) => {
    Console.log("triggerGameEvent")

    if (getAllArmyCount(state) < 5) {
        state = markIsRunning(state, true)

        state = setId(state, _buildKey(), id)

        return triggerMainEvent(state, NullableUtils.getExn(config)).then(state => {
            state = setAbstractState(state, Event.on(getAbstractState(state), getMarkFinishEventName(), _markFinishEndHandler))

            return [state, behaviourTreeNodeExecuteResult.Success]
        })
    }

    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
}
