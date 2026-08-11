import { setUIData } from "../index/scene/store/SceneStore"
import { deferSwitchPageForGetNewestState } from "./SwitchPageUtils"

export let buildDispatchFunc = (dispatch) => {
    return (data) => dispatch(setUIData(data))
    // return (data) => deferSwitchPageForGetNewestState(dispatch, setUIData(data))
}
