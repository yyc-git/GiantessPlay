import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../../type/StateType"
import { objectStateName, usedGirlEnum } from "../../type/StateType"
import { Event } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../../state/State"
import { getGirlDestroyingEventName } from "../../utils/EventUtils"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { getStateMachine, setStateMachine } from "../../girl/FSMState"
import { markWhetherNotExecuteGiantessAI } from "../../behaviour_tree/BehaviourTreeManager"

export let createDestroyedState = (): fsm_state<state> => {
    return {
        name: objectStateName.Destroyed,
        enterFunc: (state) => {
            return Promise.resolve(state)
        },
        executeFunc: (state, _) => {
            return Promise.resolve(state)
        },
        exitFunc: (state: state) => {
            return Promise.resolve(state)
        }
    }
}

export let createDestroyingState = (usedGirl): fsm_state<state> => {
    return {
        name: objectStateName.Destroying,
        enterFunc: (state) => {
            // return Promise.resolve(markWhetherNotExecuteGiantessAI(state,usedGirl, true))
            return Promise.resolve(state)
        },
        executeFunc: (state, _) => {
            state = markWhetherNotExecuteGiantessAI(state,usedGirl, true)

            return Event.trigger(state, getAbstractState, getGirlDestroyingEventName(), null).then(state => {
                return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine(usedGirl), getStateMachine(state, usedGirl), createDestroyedState(), null)
            })
        },
        exitFunc: (state: state) => {
            // return Promise.resolve(markWhetherNotExecuteGiantessAI(state,usedGirl, false))
            return Promise.resolve(state)
        }
    }
}