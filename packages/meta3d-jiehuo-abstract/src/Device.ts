import { Clock } from "three"
import { state } from "./type/StateType"
import { getDeviceState, setDeviceState } from "./state/State"
import * as View from "meta3d-utils/src/View"

export let createState = () => {
    return {
        clock: new Clock(),
        delta: 0,
        isMobile: false,
    }
}

export let getDeltaFactor = () => 70

export let getDelta = (state: state) => {
    return getDeviceState(state).delta
}

// export let getWidth = (state: state) => {
//     return getDeviceState(state).width
// }

// export let getHeight = (state: state) => {
//     return getDeviceState(state).height
// }


export let isMobile = () => {
    // 屏幕尺寸检测
    const isLargeScreen = window.innerWidth >= 768;

    // 触摸支持检测
    const hasTouch = 'ontouchstart' in window;

    // return !!window.navigator.ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    if (!!window.navigator.userAgent.match(/(phone|pad|pod|tablet|iPad|iPod|ios|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|OPPO Pad|XiaomiPad|HuaweiPad|LenovoTab|GalaxyTab|Nexus 10|Nexus 9|Nexus 7|Kindle|Silk|PlayBook)/i)) {
        return true
    }

    if (!isLargeScreen && hasTouch) {
        return true
    }

    return false
}

export let init = (state: state) => {
    state.device.clock.start()

    state = setDeviceState(state, {
        ...getDeviceState(state),
        isMobile: isMobile()
    })

    return Promise.resolve(state)
}

export let update = (state: state) => {
    state = setDeviceState(state, {
        ...getDeviceState(state),
        delta: Math.min(0.05, state.device.clock.getDelta()),
        // delta: Math.min(0.016, state.device.clock.getDelta()),
    })

    return Promise.resolve(state)
}

export let isMobileByState = (state: state) => {
    return getDeviceState(state).isMobile
}

export let isIOS = () => {
    return /(iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent)
}

export let isAndroid = () => {
    return isMobile() && !isIOS()
}

export let isMac = () => {
    return navigator.userAgent.indexOf('Mac OS X') != -1 && !isIOS()
}

export let isChrome = () => {
    let ua = navigator.userAgent.toLowerCase();

    // return ua.indexOf('chrome') > -1 && ua.indexOf('edge') === -1;
    return ua.indexOf('chrome') > -1 && ua.indexOf('edg') === -1;
}

// export let isVivo = () => {
//     // return window.navigator.ua.toLowerCase().match(/vivo/i)
//     return window.navigator.ua.toLowerCase().includes("vivo")
// }

export let computeValue = (value) => {
    return isMobile() ? value * 2 : value
}

let _isAlookBrowser = () => {
    try {
        const ua = navigator.userAgent.toLowerCase();
        // 主检测规则：标准Alook标识
        const isAlook = /alookbrowser|alook/i.test(ua);

        // // 华为设备备用规则：检查鸿蒙UA + Alook特征
        // const isHarmonyOS = /harmonyos|huawei/i.test(ua);
        // const isAlookMode = localStorage.getItem('alook_debug') === 'true'; // 需结合Alook的特定行为

        return isAlook
            // || (isHarmonyOS && isAlookMode) 
            || (/harmonyos|huawei/i.test(ua) && /chrome/.test(ua))
            || !!(window as any).AlookBridge
    } catch (e) {
        // 鸿蒙系统可能抛出异常（如权限拦截）
        console.error("Alook检测失败:", e);
        return false;
    }
}

export let detectBrowser = () => {
    const ua = navigator.userAgent.toLowerCase();
    const isWeChat = /micromessenger/.test(ua);
    const isAlook = _isAlookBrowser()

    // // 检测Chrome需排除其他基于Chromium的浏览器（Edge/Opera/三星等）
    // const isChrome =
    //     /chrome|crios/.test(ua) &&    // 匹配Chrome或CriOS（iOS版Chrome）
    //     !/edg|edga|edgios|opr|opt|samsungbrowser/.test(ua); // 排除Edge/Opera/三星等
    // 精确 Chrome 检测 (需排除常见非 Chrome 浏览器)
    const isChrome =
        /chrome|crios/.test(ua) &&    // 基础 Chrome 标识
        !/edg|edga|edgios|opr|opt/.test(ua) && // 排除 Edge/Opera
        !/samsungbrowser|miuibrowser|hbrowser|vivobrowser/.test(ua) && // 排除安卓厂商浏览器
        !/qqbrowser|qq\//.test(ua) &&  // 排除 QQ 浏览器
        !/ucbrowser|uc\/|ubrowser/.test(ua) && // 排除 UC 浏览器
        !/baidubrowser|baiduboxapp/.test(ua) && // 排除百度浏览器
        !/quark|qii|meta/.test(ua) && // 排除夸克等
        !/huawei|honor|oppo|vivo|xiaomi|redmi|mi|hm|sm/.test(ua); // 排除其他安卓定制浏览器

    // const isAndroidDefault = /Android/.test(ua) || /Adr/.test(ua)

    // const isSafari = /Safari/.test(ua) || /safari/.test(ua)




    let isInApp = false

    // 1. 用户代理检测
    const uaIndicators = [
        // Android WebView
        /wv/.test(ua),
        // iOS WebView
        /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/.test(ua),
        // 常见App WebView标识
        /; wv\)/.test(ua),
    ];

    if (uaIndicators.some(indicator => indicator)) {
        isInApp = true;
    }

    // // 2. 功能检测
    // // WebView通常缺少某些浏览器功能
    // if (!window.chrome && !window.opr && !window.browser) {
    //     isInApp = true;
    // }

    // 3. 特定API检测
    // 某些WebView环境会暴露特定API
    if ((window as any).JSBridge || (window as any).webkit && (window as any).webkit.messageHandlers) {
        isInApp = true;
    }



    // console.log(isWeChat, isAlook, /chrome|crios/.test(ua), !/edg|edga|edgios|opr|opt|samsungbrowser/.test(ua), isChrome)
    // console.log(ua)

    return {
        isWeChat,
        isAlook,
        isChrome,
        // isAndroidDefault,
        // isSafari,
        isInApp,
    };
}

// // 使用示例
// const browser = detectBrowser();
// console.log("是否微信:", browser.isWeChat);
// console.log("是否ALook:", browser.isAlook);
// console.log("是否Chrome:", browser.isChrome);