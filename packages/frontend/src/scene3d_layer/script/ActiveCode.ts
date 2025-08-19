import { createInstance, getItem, setItem } from "localforage"
import { NullableUtils } from "meta3d-jiehuo-abstract"

let store = createInstance({ name: "store_activeCode" })

let _get9Code = () => "c777"

let _get29Code = () => "a211"

let _get9CacheKey = () => "active_code_9"

let _get29CacheKey = () => "active_code_29"

export let is9Active = (code: string) => {
    return code.toLowerCase() == _get9Code().toLowerCase()
}

export let is29Active = (code: string) => {
    return code.toLowerCase() == _get29Code().toLowerCase()
}

export let getNoActiveCodeInfo = () => "请输入激活码"

export let get9ActiveCodeOutdateInfo = () => "9元激活码已过期，请输入最新激活码"

export let get29ActiveCodeOutdateInfo = () => "29元激活码已过期，请输入最新激活码"

export let getIs9ActiveInfo = () => "9"

export let getIs29ActiveInfo = () => "29"

let _isNoActiveCodeInfo = (info) => {
    return info == getNoActiveCodeInfo()
}

export let getActiveInfo = () => {
    return store.getItem<string>(_get29CacheKey()).then(code => {
        return NullableUtils.getWithDefault(
            NullableUtils.map(
                code => {
                    if (is29Active(code)) {
                        return getIs29ActiveInfo()
                    }

                    return get29ActiveCodeOutdateInfo()
                },
                code,
            ),
            getNoActiveCodeInfo())
    }).then(info => {
        if (_isNoActiveCodeInfo(info)) {
            return store.getItem<string>(_get9CacheKey()).then(code => {
                return NullableUtils.getWithDefault(
                    NullableUtils.map(
                        code => {
                            if (is9Active(code)) {
                                return getIs9ActiveInfo()
                            }

                            return get9ActiveCodeOutdateInfo()
                        },
                        code,
                    ),
                    getNoActiveCodeInfo())
            })
        }

        return info
    })
}

export let is9ActiveSuccess = (info) => {
    return info == getIs9ActiveInfo()
}

export let is29ActiveSuccess = (info) => {
    return info == getIs29ActiveInfo()
}

export let handlePageData = (pageData) => {
    return NullableUtils.map(pageData => {
        if (is9ActiveSuccess(pageData) || is29ActiveSuccess(pageData)) {
            return ""
        }

        return pageData
    }, pageData)
}

export let isActiveSuccess = (info) => {
    return is9ActiveSuccess(info) || is29ActiveSuccess(info)
}

export let active9 = (code: string) => {
    return store.setItem(_get9CacheKey(), code)
}

export let active29 = (code: string) => {
    return store.setItem(_get29CacheKey(), code)
}

export let getGetActiveCodeData = () => {
    return {
        main: "https://afdian.com/a/gts-play",

        chargeLink_9: "https://ifdian.net/order/create?plan_id=a5069a4065e111ef98455254001e7c00&product_type=0&remark=",
        getLink_9: "https://ifdian.net/p/b5e8ecc866a411ef912b52540025c377",

        chargeLink_29: "https://ifdian.net/order/create?plan_id=6f6cb360932c11efb14e5254001e7c00&product_type=0&remark=",
        getLink_29: "https://afdian.com/p/d4a9815e932c11ef95ec5254001e7c00",
    }
}