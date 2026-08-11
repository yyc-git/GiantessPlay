import { NullableUtils } from "meta3d-jiehuo-abstract"

export let clickDom = (className) => {
    NullableUtils.forEach(dom => {
        dom.click()
    }, document.querySelector(`.${className}`) as any)
}


export let deferClickDomForGetNewestState = (className) => {
    setTimeout(() => {
        clickDom(className)
    }, 30)
}

export let getRemValue = (remStr: string) => {
    return Number(remStr.slice(0, -3))
}

let _getPxValue = (pxStr: string) => {
    return Number(pxStr.slice(0, -2))
}

export let convertPxToRem = (pxStr: string) => {
    return _getPxValue(
        pxStr
    ) / _getPxValue(
        document.documentElement.style.fontSize
    )
}
