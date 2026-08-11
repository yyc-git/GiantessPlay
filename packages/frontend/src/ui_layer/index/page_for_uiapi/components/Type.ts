import { api } from "type-api/src/Type"
import { state } from "../../../../scene3d_layer/type/StateType"
import { nullable } from "block/src/Type"

export enum uiType {
    Text,
    Selector,
    SelectorImage,
    // Switch,
    Button,
}

export type selector = {
    options: Array<{
        value: string,
        label: string
    }>,
    getDefaultValueFunc: (api: api, state: state) => string,
}

export type selectorImage = {
    options: Array<{
        value: string,
        label?: string,
        imageSrc?: string,
        imageWidth?: number,
        imageHeight?: number,
    }>,
    getDefaultValueFunc: (api: api, state: state) => string,
}

export type text = {
    getTextFunc: (api: api, state: state) => string,
}

// export type switch = {
//     uncheckedText: string,
//     checkedText: string,
// }

export type handlerFunc = (api: api, dispatchFunc: any, value: any) => Promise<void>


export type uiDataItem = {
    type: uiType,
    name: string,
    // key: string,

    text?: text,

    selector?: selector,
    selectorImage?: selectorImage,
    // switch?: switch,

    // handler?: (api: api, [dispatchFunc, setStoreFunc]: any, value: any) => Promise<void>,
    handlerFunc?: handlerFunc,
}

export type uiData = Array<uiDataItem>