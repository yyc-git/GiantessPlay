import { Quaternion } from "three";
import { army, camp } from "../../type/StateType";
import { Map } from "immutable";
import { state } from "../../../../../type/StateType";
import { getCitySceneState, setCitySceneState } from "../../../../../state/State";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { name } from "meta3d-jiehuo-abstract/src/type/StateType";

// const _q = new Quaternion();
// const _e = new Euler();
// const _m = new Matrix4();
// const _v1 = new Vector3();
// const _v2 = new Vector3();
// const _v1_1 = new Vector2();
// const _v1_2 = new Vector2();

export let createState = (): army => {
    return {
        campMap: Map(),
        attackTargetMap: Map(),
        getPositionYFuncMap: Map(),
    }
}

export let getState = (state: state) => {
    return NullableUtils.getExn(getCitySceneState(state).army)
}

export let setState = (state: state, value: army) => {
    return setCitySceneState(state, {
        ...getCitySceneState(state),
        army: NullableUtils.return_(value)
    })
}


export let getCampExn = (state: state, name: name) => {
    return NullableUtils.getExn(getState(state).campMap.get(name))
}

export let getCamp = (state: state, name: name, defaultCamp: camp) => {
    return NullableUtils.getWithDefault(getState(state).campMap.get(name), defaultCamp)
}

export let setCamp = (state: state, name, value) => {
    return setState(state, {
        ...getState(state),
        campMap: getState(state).campMap.set(name, value)
    })
}

export let getAttackTarget = (state: state, name: name) => {
    return NullableUtils.getExn(getState(state).attackTargetMap.get(name))
}

export let setAttackTarget = (state: state, name, value) => {
    return setState(state, {
        ...getState(state),
        attackTargetMap: getState(state).attackTargetMap.set(name, value)
    })
}

export let dispose = (state: state) => {
    return setState(state, createState())
}

export let getGetPositionYFuncDefaultKey = () => "GetPositionYFuncDefaultKey"

// export let getPositionYWithoutKey = (state: state, name: name, x, z) => {
//     return 0
// }

export let getPositionY = (state: state, key: name, x, z) => {
    // return NullableUtils.getExn(getState(state).getPositionYFuncMap.get(key))(state, x, z)
    return NullableUtils.getWithDefault(
        NullableUtils.map(func => {
            return func(state, x, z)
        }, getState(state).getPositionYFuncMap.get(key)),
        0
    )
}

export let setGetPositionYFunc = (state: state, key, func) => {
    return setState(state, {
        ...getState(state),
        getPositionYFuncMap: getState(state).getPositionYFuncMap.set(key, func)
    })
}
