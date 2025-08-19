import { getSkinAnimationState, setSkinAnimationState } from "../state/State"
import { skinAnimation, skinAnimationName, skinTargetName, state } from "../type/StateType"
import { Map, List } from "immutable"
import type { Object3D, AnimationClip, SkinnedMesh, AnimationAction } from "three"
import { AnimationMixer, LoopRepeat, LoopOnce } from "three"
import { forEach, getEmpty, getExn, getWithDefault, return_ } from "../utils/NullableUtils"
import { MMDAnimationHelper } from "../three/MMDAnimationHelper"
import { getMMDAnimationHelper } from "../mmd/MMD"
import { NullableUtils } from "../Main"
import { isMobile } from "../Device"
import { between } from "../utils/NumberUtils"
import { requireCheck, test } from "../utils/Contract"

export let createState = (): skinAnimation => {
    return {
        animationClips: Map(),
        animationNames: Map(),
        mixerMap: Map(),
        weights: Map()
    }
}

export let addSkinAnimation = (state: state, targetName: skinTargetName, name, data: AnimationClip) => {
    let animationNames = getSkinAnimationState(state).animationNames

    return setSkinAnimationState(state, {
        ...getSkinAnimationState(state),
        animationClips: getSkinAnimationState(state).animationClips.set(name, data),
        animationNames: animationNames.set(targetName, animationNames.has(targetName) ? getExn(animationNames.get(targetName)).push(name) : List([name]))
    })
}

export let removeSkinAnimation = (state: state, name) => {
    return setSkinAnimationState(state, {
        ...getSkinAnimationState(state),
        animationClips: getSkinAnimationState(state).animationClips.remove(name)
    })
}

export let addSkinAnimationMixer = (state: state, target: Object3D, targetName: skinTargetName) => {
    return setSkinAnimationState(state, {
        ...getSkinAnimationState(state),
        mixerMap: getSkinAnimationState(state).mixerMap.set(targetName, new AnimationMixer(target))
    })
}

export let getClip = (state: state, name: skinAnimationName) => {
    return getExn(getSkinAnimationState(state).animationClips.get(name))
}

export let getAction = (state: state, targetName: skinTargetName, name: skinAnimationName) => {
    let mixer = getExn(getSkinAnimationState(state).mixerMap.get(targetName))

    // return mixer.clipAction(getExn(getSkinAnimationState(state).animationClips.get(name)))
    return mixer.clipAction(getClip(state, name))
}

export let setDuration = (action: AnimationAction, duration: number) => {
    // requireCheck(() => {
    //     test("duration should > 0.5", () => {
    //         return duration > 0.5
    //     })
    // }, isDebug)

    action.setDuration(duration)
}

export let playSkinAnimation = (state: state, name: skinAnimationName, targetName: skinTargetName, loop = true) => {
    let animationAction = getAction(state, targetName, name)

    animationAction.setLoop(
        loop ? LoopRepeat : LoopOnce,
        Infinity,
    )
    animationAction.play().fadeIn(0.1)

    return state
}

export let stopSkinAnimation = (state: state, name: skinAnimationName, targetName: skinTargetName) => {
    let animationAction = getAction(state, targetName, name)

    animationAction.stop()

    return state
}

export let stopTargetAllSkinAnimations = (state: state, targetName: skinTargetName) => {
    let { animationNames } = getSkinAnimationState(state)

    return getWithDefault(
        animationNames.get(targetName),
        List()
    ).reduce((state, animationName) => {
        return stopSkinAnimation(state, animationName, targetName)
    }, state)
}

export let updateSkinAnimation = (state: state, targetName: skinTargetName, deltaTime: number) => {
    forEach(mixer => {
        mixer.update(deltaTime)
    }, getSkinAnimationState(state).mixerMap.get(targetName))

    return state
}

export let disposeSkinAnimation = (state: state, target: Object3D, targetName: skinTargetName) => {
    let { animationClips, animationNames, mixerMap } = getSkinAnimationState(state)

    let skinAnimationNames = getWithDefault(
        animationNames.get(targetName),
        List()
    )

    // state = skinAnimationNames.reduce((state, animationName) => {
    //     return stopSkinAnimation(state, animationName, targetName)
    // }, state)
    state = stopTargetAllSkinAnimations(state, targetName)

    NullableUtils.forEach((mixer) => {
        skinAnimationNames.forEach(animationName => {
            let clip = getExn(animationClips.get(animationName))

            mixer.uncacheClip(clip)
            mixer.uncacheAction(clip, target)
            mixer.uncacheRoot(target)
        })
    }, mixerMap.get(targetName))




    // let helper = getMMDAnimationHelper(state)

    // helper.meshes.forEach(mesh => {
    //     helper.remove(mesh as SkinnedMesh)
    // })


    return state
}

export let dispose = (state: state) => {
    return setSkinAnimationState(state, createState())
}

// export let getFrameIndex = (action: AnimationAction, weight: number, frameCount) => {
// export let getFrameIndex = (action: AnimationAction, frameCount) => {
//     let animationTime = action.time

//     // if (weight != 1) {
//     //     return getEmpty()
//     // }

//     return return_(Math.round(animationTime / action.getClip().duration * frameCount))
// }
export let getFrameIndex = (action: AnimationAction, frameCount) => {
    let animationTime = action.time

    // if (weight != 1) {
    //     return getEmpty()
    // }

    return Math.round(animationTime / action.getClip().duration * frameCount)
}

// export let getFirstFrameIndex = () => {
//     /*!in mobile, sometimes(when duration is small?) can't get first frameIndex!
//     */
//     return 0 + 1
// }

// export let getLastFrameIndex = (frameCount = 30) => {
//     /*!in mobile, sometimes(when duration is small?) can't get last frameIndex!
//     */
//     return frameCount - 1
// }


export let isSpecificFrameIndex = (frameIndex, targetFrameIndex, frameCount, offset: number, isDebug = true) => {
    requireCheck(() => {
        test("targetFrameIndex should be valid", () => {
            return between(targetFrameIndex, 0, frameCount)
        })
    }, isDebug)

    /*!may loss some frame when fps is too low!
    */


    // let offset
    // if (isMobile()) {
    //     offset = 1
    // }
    // else {
    //     offset = 0
    // }

    // if (targetFrameIndex == 0) {
    //     // return between(frameIndex, 0, 2)
    //     return between(frameIndex, 0, 1 + offset)
    // }

    // if (targetFrameIndex == frameCount) {
    //     // return between(frameIndex, frameCount - 2, frameCount)
    //     return between(frameIndex, frameCount - 1 - offset, frameCount)
    // }

    // return between(frameIndex, targetFrameIndex - 1 - offset, targetFrameIndex + 1 + offset)
    // // }



    if (targetFrameIndex == 0) {
        return between(frameIndex, 0, 2 + offset)
    }

    if (targetFrameIndex == frameCount) {
        return between(frameIndex, frameCount - 1 - offset, frameCount)
    }

    return between(frameIndex, targetFrameIndex - 1 - offset, targetFrameIndex + 1 + offset)
    // }

    // return frameIndex == targetFrameIndex
}


// export let isSpecificFrameIndex = (frameIndex, targetFrameIndex) => {
//     /*!in mobile, sometimes(when duration is small?) will skip some frameIndex!
//     */
//     if (isMobile()) {
//         return between(frameIndex, targetFrameIndex - 1, targetFrameIndex + 1)
//     }

//     return frameIndex == targetFrameIndex
// }


// /*!in mobile, sometimes(when duration is small?) can't get first frameIndex!
// */
// export let isFirstFrameIndex = (frameIndex) => {
//     if (isMobile()) {
//         return between(frameIndex, 0, 2)
//     }

//     return frameIndex == 0
// }

// /*!in mobile, sometimes(when duration is small?) can't get last frameIndex!
// */
// export let isLastFrameIndex = (frameIndex) => {
//     if (isMobile()) {
//         return between(frameIndex, 0, 2)
//     }

//     return frameIndex == 0
// }