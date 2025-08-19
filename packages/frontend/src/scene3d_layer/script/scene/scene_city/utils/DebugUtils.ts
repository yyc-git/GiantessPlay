import { Flow } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { state } from "../../../../type/StateType";
import { triggerMainEvent } from "../game_event/GameEvent";
import { ArrayUtils } from "meta3d-jiehuo-abstract";

export let triggerAllGameEvents = (state: state, eventNames: Array<any>) => {
    return ArrayUtils.reduce(eventNames, (state, eventName, index) => {
        return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
            return triggerMainEvent(state, eventName)
        }, 5 * (index + 1)))
    }, state)
}