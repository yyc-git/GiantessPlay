import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { state } from "../../../../type/StateType";
import { getCenter, getGirlMesh, getUsedGirlData, setUsedGirlData } from "./Girl";
import { changePivotByAdd, computeGirlBoxAndSetToState, getGirlPosition, getGirlRotation, getPivotWorldPosition, setPivotToOrigin } from "./Utils";
import { getIsDebug } from "../../Scene";
import { Vector3 } from "three";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getGirlScale } from "../CityScene";
import { getCurrentPose } from "./Pose";
import { pose } from "../type/StateType";
import { getStateMachine, isChangeCrawlPoseState } from "./FSMState";
import { Console } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { Vector3Utils } from "meta3d-jiehuo-abstract";

let _computeGirlMeshDiff = (state: state, usedGirl) => {
    return getGirlPosition(state, usedGirl).clone().sub(getCenter(state, usedGirl)).setY(0)
        .applyQuaternion(
            getGirlRotation(state, usedGirl).clone().invert()
        )

}

export let changeToCrawlPosePivot = (state: state, usedGirl) => {
    // requireCheck(() => {
    //     test("girlMesh's position should be zero", () => {
    //         return Vector3Utils.isNearlyEqual(getGirlMesh(state, usedGirl).position, new Vector3(0, 0, 0), 0.1)
    //     })
    // }, getIsDebug(state))
    if (
        !Vector3Utils.isNearlyEqual(getGirlMesh(state, usedGirl).position, new Vector3(0, 0, 0), 0.1)
    ) {
        console.warn("girlMesh's position should be zero:", getGirlMesh(state, usedGirl).position)
        getGirlMesh(state, usedGirl).position.set(0, 0, 0)
    }


    state = computeGirlBoxAndSetToState(state, usedGirl)

    // let diff = getCenter(state).clone().sub(getGirlPosition(state, usedGirl)).setY(0).applyQuaternion(NullableUtils.getExn(getUsedGirlData(state, usedGirl).initialQuaternion))
    // let diff = getCenter(state).clone().sub(getGirlPosition(state, usedGirl)).setY(0)


    // let diff = getCenter(state).clone().sub(getGirlPosition(state, usedGirl)).setY(0)
    // .applyQuaternion(
    //     getGirlRotation(state, usedGirl)
    // )



    // let diff = new Vector3(0, 0, -5 * getGirlScale(state, usedGirl) / getValue(state).scaleIncrease)
    // let diff = new Vector3(0, 0, -20)



    let d = _computeGirlMeshDiff(state, usedGirl)
    let girlMeshDiff = d.clone()
    // .multiplyScalar(getValue(state).scaleIncrease / getGirlScale(state, usedGirl))

    let girlGroupDiff = d.clone()
        .applyQuaternion(getGirlRotation(state, usedGirl))


    state = setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        girlGroupPositionDiffForChangePivot: NullableUtils.return_(
            // girlGroupDiff
            d.clone()
        )
    })

    // Console.log(
    //     getCenter(state),
    //     getGirlPosition(state, usedGirl),

    //     getCenter(state).clone().sub(getGirlPosition(state, usedGirl)).setY(0)
    //         .applyQuaternion(
    //             getGirlRotation(state, usedGirl).clone().invert()
    //         ),
    //     diff
    // )

    // Console.log(getGirlPosition(state, usedGirl))
    state = changePivotByAdd(state, usedGirl, girlMeshDiff, girlGroupDiff)

    // Console.log(getGirlPosition(state, usedGirl))

    return state
}

export let changeToStandPosePivot = (state: state, usedGirl) => {
    state = computeGirlBoxAndSetToState(state, usedGirl)


    // let diff = _computeGirlMeshDiff(state)

    // Console.log("crawlToStandHandler:", diff,
    //     getGirlPosition(state, usedGirl).clone().sub(getCenter(state)).setY(0)
    // )


    // Console.log(getGirlPosition(state, usedGirl))
    state = setPivotToOrigin(state,
        usedGirl,
        /*! fix bug
        * 
        */
        // NullableUtils.getExn(getUsedGirlData(state, usedGirl).girlGroupPositionDiffForChangePivot)
        NullableUtils.getWithDefault(getUsedGirlData(state, usedGirl).girlGroupPositionDiffForChangePivot,
            _computeGirlMeshDiff(state, usedGirl)
        )
            // .multiplyScalar(getGirlScale(state, usedGirl) / getValue(state).scaleIncrease)
            .applyQuaternion(getGirlRotation(state, usedGirl))
    )

    state = setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        girlGroupPositionDiffForChangePivot: NullableUtils.getEmpty()
    })



    // Console.log(getGirlPosition(state, usedGirl))

    return state
}

export let updateCrawlPosePivot = (state: state, usedGirl) => {
    if (getCurrentPose(state, usedGirl) != pose.Crawl
        || isChangeCrawlPoseState(state, usedGirl)
    ) {
        return state
    }

    state = changeToStandPosePivot(state, usedGirl)
    state = changeToCrawlPosePivot(state, usedGirl)

    return state
}

export let standToCrawlHandler = (state: state, { userData }) => {
    let { usedGirl } = userData

    state = changeToCrawlPosePivot(state, usedGirl)

    return Promise.resolve(state)
}

export let crawlToStandHandler = (state: state, { userData }) => {
    let { usedGirl } = userData

    state = changeToStandPosePivot(state, usedGirl)

    return Promise.resolve(state)
}
