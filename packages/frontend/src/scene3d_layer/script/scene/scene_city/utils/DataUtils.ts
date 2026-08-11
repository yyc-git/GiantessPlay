export let getLateFrameIndex = (frameCount) => {
    return frameCount * 0.9
}

export let getLastFrameIndex = (frameCount) => {
    return frameCount - 1
}

export let getEarlyFrameIndex = () => {
    return 2
}

export let getFirstFrameIndex = () => {
    return 0
}