import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { state } from "../../../../type/StateType";
import { getCenter, getGirlMesh, getGirlState, getValue, setGirlState } from "./Girl";
import { changePivotByAdd, computeGirlBox, getGirlPosition, getGirlRotation, getPivotWorldPosition, setPivotToOrigin } from "./Utils";
import { getIsDebug } from "../../Scene";
import { Vector3 } from "three";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getGirlScale } from "../CityScene";
import { getCurrentPose } from "./Pose";
import { pose } from "../type/StateType";
import { getStateMachine, isChangeCrawlPoseState } from "./FSMState";
import { Console } from "meta3d-jiehuo-abstract";

let _computeGirlMeshDiff = (state: state) => {
    return getGirlPosition(state).clone().sub(getCenter(state)).setY(0)
        .applyQuaternion(
            getGirlRotation(state).clone().invert()
        )

}

export let changeToCrawlPosePivot = (state: state) => {
    requireCheck(() => {
        test("girlMesh's position should be zero", () => {
            return getGirlMesh(state).position.equals(new Vector3(0, 0, 0))
        })
    }, getIsDebug(state))

    state = computeGirlBox(state)

    // let diff = getCenter(state).clone().sub(getGirlPosition(state)).setY(0).applyQuaternion(NullableUtils.getExn(getGirlState(state).initialQuaternion))
    // let diff = getCenter(state).clone().sub(getGirlPosition(state)).setY(0)


    // let diff = getCenter(state).clone().sub(getGirlPosition(state)).setY(0)
    // .applyQuaternion(
    //     getGirlRotation(state)
    // )



    // let diff = new Vector3(0, 0, -5 * getGirlScale(state) / getValue(state).minScale)
    // let diff = new Vector3(0, 0, -20)



    let d = _computeGirlMeshDiff(state)
    let girlMeshDiff = d.clone()
    // .multiplyScalar(getValue(state).minScale / getGirlScale(state))

    let girlGroupDiff = d.clone()
        .applyQuaternion(getGirlRotation(state))


    state = setGirlState(state, {
        ...getGirlState(state),
        girlGroupPositionDiffForChangePivot: NullableUtils.return_(
            // girlGroupDiff
            d.clone()
        )
    })

    // Console.log(
    //     getCenter(state),
    //     getGirlPosition(state),

    //     getCenter(state).clone().sub(getGirlPosition(state)).setY(0)
    //         .applyQuaternion(
    //             getGirlRotation(state).clone().invert()
    //         ),
    //     diff
    // )

    // Console.log(getGirlPosition(state))
    state = changePivotByAdd(state, girlMeshDiff, girlGroupDiff)

    // Console.log(getGirlPosition(state))

    return state
}

export let changeToStandPosePivot = (state: state) => {
    state = computeGirlBox(state)


    // let diff = _computeGirlMeshDiff(state)

    // Console.log("crawlToStandHandler:", diff,
    //     getGirlPosition(state).clone().sub(getCenter(state)).setY(0)
    // )


    // Console.log(getGirlPosition(state))
    state = setPivotToOrigin(state,
        /*! fix bug
        * 
        */
        // NullableUtils.getExn(getGirlState(state).girlGroupPositionDiffForChangePivot)
        NullableUtils.getWithDefault(getGirlState(state).girlGroupPositionDiffForChangePivot,
            _computeGirlMeshDiff(state)
        )
            // .multiplyScalar(getGirlScale(state) / getValue(state).minScale)
            .applyQuaternion(getGirlRotation(state))
    )

    state = setGirlState(state, {
        ...getGirlState(state),
        girlGroupPositionDiffForChangePivot: NullableUtils.getEmpty()
    })



    // Console.log(getGirlPosition(state))

    return state
}

export let updateCrawlPosePivot = (state: state) => {
    if (getCurrentPose(state) != pose.Crawl
        || isChangeCrawlPoseState(state)
    ) {
        return state
    }

    state = changeToStandPosePivot(state)
    state = changeToCrawlPosePivot(state)

    return state
}

export let standToCrawlHandler = (state: state, { userData }) => {
    state = changeToCrawlPosePivot(state)

    return Promise.resolve(state)
}

export let crawlToStandHandler = (state: state, { userData }) => {
    state = changeToStandPosePivot(state)

    return Promise.resolve(state)
}