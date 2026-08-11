import { Device } from 'meta3d-jiehuo-abstract';
import screenfull from 'screenfull';

export let isEnabledFullScreen = () => {
    return screenfull.isEnabled
}

export let isFullScreen = () => {
    return screenfull.isFullscreen
}

let _isCanFullScreen = () => {
    return !screenfull.isFullscreen && screenfull.isEnabled
}

export let isCanFullScreenForMobile = () => {
    return _isCanFullScreen() && Device.isMobile()
}

export let requestFullScreen = () => {
    screenfull.request()
}

export let exitFullScreen = () => {
    screenfull.exit()
}