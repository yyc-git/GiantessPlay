import { nullable } from "block/src/Type"
// import { Map } from "immutable"

// export enum settingType {
//     RenderSetting,
// }

// export type settingType = "RenderSetting" | any

// export type settingValue = renderSetting | any

// export type settingType = any

export type settingValue = any

export type state = {
    // setting: Map<settingType, settingValue>
    setting: nullable<settingValue>
}
