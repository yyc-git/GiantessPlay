import { Vector3, Bone, Object3D, LinearTransfer } from "three";
import { actionNodeFunc, behaviourTreeNodeExecuteResult, collisionPart, damageType, result } from "../../../../../type/StateType";
import { actionName, animationName, articluatedAnimationName } from "../../DataType";
import { isFinish } from "../../../../../scenario/Command";
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
import { getAllAliveArmyCount } from "../../../../../utils/ArmyUtils";
import { getUsedGirl } from "../../../../../manage/biwu/Utils";

const _v1 = /*@__PURE__*/ new Vector3();

let _markFinishEndHandler = (state: state, { userData }) => {
    // let { usedGirl } = userData
    let usedGirl = getUsedGirl()

    if (!NullableUtils.isNullable(userData)
        && (
            NullableUtils.getExn(userData) == scenarioName.PickdownArmy_Normal
            || NullableUtils.getExn(userData) == scenarioName.PickdownArmy_Hard
        )
    ) {
        state = setAbstractState(state, Event.off(getAbstractState(state), getMarkFinishEventName(), _markFinishEndHandler))

        return markFinish(state, usedGirl, getIdExn(state, usedGirl, _buildKey(usedGirl)), behaviourTreeNodeExecuteResult.Success)
    }

    return Promise.resolve(state)
}

let _buildKey = (usedGirl) => `${usedGirl}_triggerGameEvent`

export let triggerGameEvent: actionNodeFunc = (state, usedGirl, id, config) => {
    Console.log("triggerGameEvent")

    if (getAllAliveArmyCount(state) < 5) {
        state = markIsRunning(state, usedGirl, true)

        state = setId(state, usedGirl, _buildKey(usedGirl), id)

        return triggerMainEvent(state, NullableUtils.getExn(config)).then(state => {
            state = setAbstractState(state, Event.on(getAbstractState(state), getMarkFinishEventName(), _markFinishEndHandler))

            return [state, behaviourTreeNodeExecuteResult.Success]
        })
    }

    return Promise.resolve([state, behaviourTreeNodeExecuteResult.Fail])
}
