export let computeTimeSecond = (frameCount: number) => {
    // return (frameCount * 30 / 60) / 1000
    // return (frameCount * 60 / 30) / 1000
    return (frameCount / 30)
}