import { api } from "type-api/src/Type"
import { nullable } from "block/src/Type"
import { state } from "../../../../../../scene3d_layer/type/StateType"
import { handlerFunc } from "../../../../page_for_uiapi/components/Type"

export enum uiType {
    Text,
    Button,
    Selector,
    ImageLabel,
    Modal,
}


export type text = {
    // top?: nullable<number>,
    // bottom?: nullable<number>,
    // left?: nullable<number>,
    // right?: nullable<number>,

    top?: number,
    bottom?: number,
    left?: number,
    right?: number,

    getTextFunc: (api: api, state: state) => string,
}

export type button = {
    // top?: nullable<number>,
    // bottom?: nullable<number>,
    // left?: nullable<number>,
    // right?: nullable<number>,

    top?: number,
    bottom?: number,
    left?: number,
    right?: number,

    getTextFunc: (api: api, state: state) => string,
}

export type modalButton = {
    // getTextFunc: (api: api, state: state) => string,
    text: string,
}

export type selector = {
    options: Array<{
        value: string,
        label: string,
        // description: string,
    }>,
    getDefaultValueFunc: (api: api, state: state) => string,
}

export type imageLabel = {
    image: {
        style: any,
        src: string,
    },
    text: {
        style: any,
        text: string,
    },
}


export type modalUIDataItem = {
    type: uiType,
    name?: string,

    selector?: selector,
    button?: modalButton,
    imageLabel?: imageLabel,
    text?: text,

    handlerFunc?: handlerFunc,
}

export type handlerCloseFunc = () => Promise<void>

export type modal = {
    // name: string,
    children: Array<modalUIDataItem>,

    handlerCloseFunc: handlerCloseFunc,
}

export type uiDataItem = {
    type: uiType,
    name?: string,

    text?: text,
    // selector?: selector,
    button?: button,
    modal?: modal,

    handlerFunc?: handlerFunc,
}

export type uiData = Array<uiDataItem>

export type modalUIData = Array<modalUIDataItem>
