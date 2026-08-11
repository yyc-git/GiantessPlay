import { api } from "type-api/src/Type";
import { getInitialQuaternion, getStateMachine, setStateMachine } from "./Utils";
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { createFallState } from "./FSMState";

export let getPickedTransform = (api: api, categoryName) => api.getGiantessTransformFunc(
    (state) => getInitialQuaternion(api, state, categoryName),

    api.getPickTransformPrefix(),

    Math.PI / 2,
    // new Vector3(1, 0, 0),
    Math.PI / 2,
    // new Vector3(0, 1, 0),
    0,
    // new Vector3(0, 0, 1),
)

export let getUBControlledTransform = (api: api, categoryName) => api.getGiantessUBControlledTransformFunc(
    (state) => getInitialQuaternion(api, state, categoryName),

    api.getUBControlledTransformPrefix(),

    0,
    0,
    0,
)

export let getPutToBreastTransform = (api: api, categoryName) => api.getGiantessPutToBreastTransformFunc(
    (state) => getInitialQuaternion(api, state, categoryName),

    api.getPutToBreastTransformPrefix(),

    0,
    0,
    0,
)

export let getPutToShoeTransform = (api: api, categoryName) => api.getGiantessPutToShoeTransformFunc(
    (state) => getInitialQuaternion(api, state, categoryName),

    api.getPutToShoeTransformPrefix(),

    -1.7,
    0,
    0,
)


export let handlePickup = (api: api, state: state, createControlledStateFunc, name: name) => {
    // state = removeShadow(state, name)

    return api.StateMachine.changeAndExecuteState(state, setStateMachine(api), getStateMachine(api)(state, name), createControlledStateFunc(), name, api.NullableUtils.getEmpty())
}

export let updateTransform = (api: api) => api.updateTransform

export let handlePickdown = (
    api: api,
    createInitialStateFunc,
    // getShadowQueueFunc
) => {
    return (state: state, name: name, index, targetPoint, queue, originTransform, originBox): Promise<[state, boolean]> => {
        return api.handlePickdown(state,
            (state, name) => {
                return api.StateMachine.changeAndExecuteState(state, setStateMachine(api), getStateMachine(api)(state, name), createInitialStateFunc(), name, api.NullableUtils.return_(name))
            },
            name, index, targetPoint, queue, api.NullableUtils.getEmpty(), originTransform, originBox
        )
    }
}

export let handleFall = (
    api: api,
    getIdleClipIndexFunc, getStandupClipIndexFunc, clipIndex
) => {
    return (state: state, name: name, index, queue, originTransform, originBox): Promise<[state, boolean]> => {
        let stateMachine = getStateMachine(api)(state, name)

        if (!api.isChangeToFallState(state, stateMachine)) {
            return Promise.resolve([state, false])
        }

        return api.StateMachine.changeAndExecuteState(state, setStateMachine(api), stateMachine, createFallState(
            api,
        )(getIdleClipIndexFunc, getStandupClipIndexFunc, clipIndex), name, api.NullableUtils.return_([
            name, index, queue,
            api.NullableUtils.getEmpty(),
            originTransform,
            // originBox
        ]))
            .then(state => [state, true])
    }
}

export let handleUBControl = (api: api, state: state, createControlledStateFunc, name: name) => {
    return api.removePickData(state, name).then(state => {
        // state = api.clearTargetByName(state, name)

        return api.StateMachine.changeAndExecuteState(state, setStateMachine(api), getStateMachine(api)(state, name), createControlledStateFunc(), name, api.NullableUtils.getEmpty())
    })
}

export let handlePutToBreast = handleUBControl

export let handlePutToShoe = handleUBControl

export let updateUBControlledTransform = (api: api) => api.updateUBControlledTransform

export let updatePutToBreastTransform = (api: api) => api.updatePutToBreastTransform

export let updatePutToShoeTransform = (api: api) => api.updatePutToShoeTransform

export let getLocalTransform = (api: api) => api.getLocalTransform

export let getBoxForPick = (api: api) => api.getBoxForPick
