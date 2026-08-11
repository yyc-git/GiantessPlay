// import screenfull from "screenfull";

export let getActualWidth = () => {
    // return document.documentElement.clientWidth
    return window.innerWidth || document.documentElement.clientWidth
}

export let getActualHeight = () => {
    // return document.documentElement.clientHeight
    return window.innerHeight || document.documentElement.clientHeight
}

// let _isMobile = () => {
//     return !!window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
// }

// let _checkOrientationIsHorrizon = () => {
//     if (typeof window.orientation !== 'undefined') {
//         if (window.orientation === 90 || window.orientation === -90) {
//             return true
//         } else {
//             return false
//         }
//     } else {
//         return null; // 不支持window.orientation
//     }
// }

export let isNeedHandleLandscape = () => {
    // return !screenfull.isFullscreen && getActualWidth() <= getActualHeight()
    return getActualWidth() <= getActualHeight()

    // let isHorrizon = _checkOrientationIsHorrizon()

    // if (!_isMobile() || isHorrizon == null) {
    //     return getActualWidth() <= getActualHeight()
    // }

    // return !isHorrizon
}

export let getWidth = () => {
    return isNeedHandleLandscape() ? getActualHeight() : getActualWidth()
}

export let getHeight = () => {
    return isNeedHandleLandscape() ? getActualWidth() : getActualHeight()
}