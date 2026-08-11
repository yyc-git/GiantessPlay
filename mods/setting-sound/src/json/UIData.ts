import { uiData, uiType } from "setting-protocol/src/service/ServiceType"
import { soundLevel } from "../Type"
import { api } from "type-api/src/Type"

export let getUIData = (api: api): uiData => {
    if (api.internation.isChinese()) {
        return [
            {
                name: "巨大娘语音声音大小",
                type: uiType.Selector,
                options: [
                    { value: String(soundLevel.None), label: "无" },
                    { value: String(soundLevel.VeryLow), label: "非常低" },
                    { value: String(soundLevel.Low), label: "低" },
                    { value: String(soundLevel.Middle), label: "中" },
                    { value: String(soundLevel.High), label: "高" },
                    { value: String(soundLevel.VeryHigh), label: "非常高" },
                ],
                key: "giantessSaySoundLevel"
            },
            {
                name: "页面声音大小",
                type: uiType.Selector,
                options: [
                    { value: String(soundLevel.None), label: "无" },
                    { value: String(soundLevel.VeryLow), label: "非常低" },
                    { value: String(soundLevel.Low), label: "低" },
                    { value: String(soundLevel.Middle), label: "中" },
                    { value: String(soundLevel.High), label: "高" },
                    { value: String(soundLevel.VeryHigh), label: "非常高" },
                ],
                key: "pageSoundLevel"
            },
            {
                name: "场景音效大小",
                type: uiType.Selector,
                options: [
                    { value: String(soundLevel.None), label: "无" },
                    { value: String(soundLevel.VeryLow), label: "非常低" },
                    { value: String(soundLevel.Low), label: "低" },
                    { value: String(soundLevel.Middle), label: "中" },
                    { value: String(soundLevel.High), label: "高" },
                    { value: String(soundLevel.VeryHigh), label: "非常高" },
                ],
                key: "sceneSoundLevel"
            },
        ]
    }

    return [
        {
            name: "Giantess Voice Sound Volumn",
            type: uiType.Selector,
            options: [
                { value: String(soundLevel.None), label: "None" },
                { value: String(soundLevel.VeryLow), label: "Very Low" },
                { value: String(soundLevel.Low), label: "Low" },
                { value: String(soundLevel.Middle), label: "Middle" },
                { value: String(soundLevel.High), label: "High" },
                { value: String(soundLevel.VeryHigh), label: "Very High" },
            ],
            key: "giantessSaySoundLevel"
        },
        {
            name: "Page Sound Volumn",
            type: uiType.Selector,
            options: [
                { value: String(soundLevel.None), label: "None" },
                { value: String(soundLevel.VeryLow), label: "Very Low" },
                { value: String(soundLevel.Low), label: "Low" },
                { value: String(soundLevel.Middle), label: "Middle" },
                { value: String(soundLevel.High), label: "High" },
                { value: String(soundLevel.VeryHigh), label: "Very High" },
            ],
            key: "pageSoundLevel"
        },
        {
            name: "Scene Sound Volumn",
            type: uiType.Selector,
            options: [
                { value: String(soundLevel.None), label: "None" },
                { value: String(soundLevel.VeryLow), label: "Very Low" },
                { value: String(soundLevel.Low), label: "Low" },
                { value: String(soundLevel.Middle), label: "Middle" },
                { value: String(soundLevel.High), label: "High" },
                { value: String(soundLevel.VeryHigh), label: "Very High" },
            ],
            key: "sceneSoundLevel"
        },
    ]
}

export let getSettingType = (api: api) => {
    if (api.internation.isChinese()) {
        return "声音设置"
    }


    return "Sound Setting"
}