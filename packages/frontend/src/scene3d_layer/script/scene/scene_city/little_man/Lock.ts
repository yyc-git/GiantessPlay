import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getAimTarget, getShootTargetPosition } from "./Shoot"
import { getLittleManState, setLittleManState } from "./LittleMan"
import { LOD } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { isGiantessAlive } from "../girl/Utils"
import { Billboard } from "meta3d-jiehuo-abstract"
import { getLockResourceId, getLockSoundResourceId, getScene } from "../CityScene"
import { Vector3 } from "three"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../Scene"
import { getOriginSystemVolume } from "../utils/SoundUtils"
import { resetIsTriggerAction } from "./Action"
import { addStatusToShootTarget, isShootTargetNotEqual, removeStatusFromShootTarget } from "../utils/StatusUtils"

export let handleLockAction = (state: state) => {
    // state = resetIsTriggerAction(state, usedGirl)



    return NullableUtils.getWithDefaultFunc(
        NullableUtils.map(aimTarget => {
            state = _showLockImage(state)

            state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                SoundManager.buildNeedToPlaySoundData(getLockSoundResourceId(), getIsDebug(state), getOriginSystemVolume(state))
            ))

            let previousLockTarget = getLockTarget(state)

            state = setLockTarget(state, NullableUtils.return_(aimTarget))

            // if (isShootTargetNotEqual(getAimTarget(state), previousLockTarget)) {
            // state = removeStatusFromShootTarget(state, previousLockTarget)
            // }

            // state = addStatusToShootTarget(state, aimTarget)

            state = removeStatusFromShootTarget(state, previousLockTarget)

            return state
        }, getAimTarget(state)),
        () => {
            return clearLockTarget(state)
        }
    )
}

export let getLockTarget = (state: state) => {
    return getLittleManState(state).lockTarget
}

export let setLockTarget = (state: state, value) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        lockTarget: value
    })
}

export let clearLockTarget = (state: state) => {
    state = _hideLockImage(state)


    let previousLockTarget = getLockTarget(state)

    state = setLockTarget(state, NullableUtils.getEmpty())

    // if (isShootTargetNotEqual(getAimTarget(state), previousLockTarget)) {
    //     state = removeStatusFromShootTarget(state, previousLockTarget)
    // }
    state = removeStatusFromShootTarget(state, previousLockTarget)

    return state
}

let _getLockImage = (state: state) => {
    return NullableUtils.getExn(getLittleManState(state).lockImage)
}

let _hideLockImage = (state: state) => {
    _getLockImage(state).visible = false

    return state
}

let _updateLockImage = (state: state, positiion: Vector3) => {
    _getLockImage(state).position.copy(positiion)

    return state
}

let _showLockImage = (state: state) => {
    _getLockImage(state).visible = true

    return state
}


export let initWhenImportScene = (state: state) => {
    let image = Billboard.createImage(getAbstractState(state),
        getLockResourceId(),
        NullableUtils.getEmpty(),
        NullableUtils.getEmpty(),
        {
            isSizeAttenuation: false,
            // isAlwaysShow: false,
            isAlwaysShow: true,
            width: 0.1,
            height: 0.1
        }
    )

    getScene(state).add(image)

    state = setLittleManState(state, {
        ...getLittleManState(state),
        lockImage: NullableUtils.return_(image)
    })

    state = _hideLockImage(state)

    return state
}

export let update = (state: state) => {
    state = NullableUtils.getWithDefault(
        NullableUtils.map((lockTarget) => {
            let [_, staticLODContainerIndex, lodQueueData, girlData] = lockTarget

            let isAlive
            if (!NullableUtils.isNullable(staticLODContainerIndex)) {
                isAlive = LOD.isAlive(getAbstractState(state), NullableUtils.getExn(staticLODContainerIndex))
            }
            else if (!NullableUtils.isNullable(lodQueueData)) {
                let [box, name, index] = NullableUtils.getExn(lodQueueData)

                isAlive = LOD.isAliveInLODQueue(getAbstractState(state), name)
            }
            else {
                let [_, usedGirl] = NullableUtils.getExn(girlData)

                isAlive = isGiantessAlive(state, usedGirl)
            }

            if (!isAlive) {
                return clearLockTarget(state)
            }


            state = _updateLockImage(state, getShootTargetPosition(state, lockTarget))

            return state
        }, getLockTarget(state)),
        state
    )

    return state
}