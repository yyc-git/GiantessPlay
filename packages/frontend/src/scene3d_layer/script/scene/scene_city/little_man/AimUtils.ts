import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getLittleManState, setLittleManState } from "./LittleMan"

export let showAim = (state: state) => {
    NullableUtils.forEach(aim => {
        aim.visible = true
    }, getLittleManState(state).aim)

    return state
}

export let showAimCrossWhenDamage = (state: state) => {
    NullableUtils.getExn(getLittleManState(state).aimCrossWhenDamage).visible = true

    return state
}

export let showAimCrossWhenDestroy = (state: state) => {
    NullableUtils.getExn(getLittleManState(state).aimCrossWhenDestroy).visible = true

    return state
}

export let showHeadShot = (state: state) => {
    NullableUtils.getExn(getLittleManState(state).headShot).visible = true

    return state
}

export let hideAim = (state: state) => {
    // NullableUtils.getExn(getLittleManState(state).aim).visible = false
    NullableUtils.forEach(aim => {
        aim.visible = false
    }, getLittleManState(state).aim)

    return state
}

export let hideAimCrossWhenDamage = (state: state) => {
    NullableUtils.getExn(getLittleManState(state).aimCrossWhenDamage).visible = false

    return state
}

export let hideAimCrossWhenDestroy = (state: state) => {
    NullableUtils.getExn(getLittleManState(state).aimCrossWhenDestroy).visible = false

    return state
}

export let hideHeadShot = (state: state) => {
    NullableUtils.getExn(getLittleManState(state).headShot).visible = false

    return state
}

export let getIsShowingHeadShot = (state: state) => {
    return getLittleManState(state).isShowingHeadShot
}

export let setIsShowingHeadShot = (state: state, value) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        isShowingHeadShot: value
    })
}

export let getHeadShotExn = (state: state) => {
    return NullableUtils.getExn(getLittleManState(state).headShot)
}
