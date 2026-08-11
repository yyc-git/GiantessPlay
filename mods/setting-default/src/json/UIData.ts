import { uiData, uiType } from "setting-protocol/src/service/ServiceType"
import { maxUnitCount, hdLevel, mapSize, mapSparse, physicsLevel, renderAccuracyLevel, shadowLevel } from "../Type"
import { api } from "type-api/src/Type"

export let getUIData = (api: api): uiData => {
    if (api.internation.isChinese()) {
        return [
            {
                name: "分辨率",
                type: uiType.Selector,
                options: [
                    { value: String(hdLevel.Low), label: "低" },
                    { value: String(hdLevel.Middle), label: "中" },
                    { value: String(hdLevel.High), label: "高" },
                ],
                key: "hd"
            },
            {
                name: "渲染精度",
                type: uiType.Selector,
                options: [
                    { value: String(renderAccuracyLevel.Low), label: "低" },
                    { value: String(renderAccuracyLevel.Middle), label: "中" },
                    { value: String(renderAccuracyLevel.High), label: "高" },
                    { value: String(renderAccuracyLevel.VeryHigh), label: "非常高" },
                    // { value: String(renderAccuracyLevel.MostHigh), label: "最高" },
                ],
                key: "renderAccuracy"
            },
            {
                name: "阴影",
                type: uiType.Selector,
                options: [
                    { value: String(shadowLevel.Low), label: "低" },
                    { value: String(shadowLevel.Middle), label: "中" },
                    { value: String(shadowLevel.High), label: "高" },
                ],
                key: "shadow"
            },


            {
                name: "显示番茄酱",
                type: uiType.Switch,
                uncheckedText: "关",
                checkedText: "开",
                key: "isShowBlood"
            },

            {
                name: "最大单位数量",
                type: uiType.Selector,
                options: [
                    { value: String(maxUnitCount.Small), label: "小" },
                    { value: String(maxUnitCount.Middle), label: "中" },
                    { value: String(maxUnitCount.Big), label: "大" },
                    { value: String(maxUnitCount.VeryBig), label: "极大" },
                ],
                key: "maxUnitCount"
            },
            {
                name: "物理",
                type: uiType.Selector,
                options: [
                    { value: String(physicsLevel.VeryLow), label: "极低" },
                    { value: String(physicsLevel.Low), label: "低" },
                    { value: String(physicsLevel.Middle), label: "中" },
                    { value: String(physicsLevel.High), label: "高" },
                    { value: String(physicsLevel.VeryHigh), label: "极高" },
                ],
                key: "physics"
            },
            // {
            //     name: "相机旋转速度",
            //     type: uiType.Selector,
            //     options: [
            //         { value: String(cameraRotateSpeed.VeryLow), label: "极低" },
            //         { value: String(cameraRotateSpeed.Low), label: "低" },
            //         { value: String(cameraRotateSpeed.Middle), label: "中" },
            //         { value: String(cameraRotateSpeed.High), label: "高" },
            //         { value: String(cameraRotateSpeed.VeryHigh), label: "极高" },
            //     ],
            //     key: "cameraRotateSpeed"
            // },
            {
                name: "地图大小",
                type: uiType.Selector,
                options: [
                    { value: String(mapSize.Small), label: "小" },
                    { value: String(mapSize.Middle), label: "中" },
                    { value: String(mapSize.Big), label: "大" },
                    // { value: String(mapSize.VeryBig), label: "非常大" },
                ],
                key: "mapSize"
            },
            {
                name: "地图稀疏度",
                type: uiType.Selector,
                options: [
                    { value: String(mapSparse.Small), label: "小" },
                    { value: String(mapSparse.Middle), label: "中" },
                    { value: String(mapSparse.Big), label: "大" },
                    { value: String(mapSparse.VeryBig), label: "非常大" },
                ],
                key: "mapSparse"
            },
        ]
    }

    return [
        {
            name: "Resolution",
            type: uiType.Selector,
            options: [
                { value: String(hdLevel.Low), label: "Low" },
                { value: String(hdLevel.Middle), label: "Middle" },
                { value: String(hdLevel.High), label: "High" },
            ],
            key: "hd"
        },
        {
            name: "RenderAccuracy",
            type: uiType.Selector,
            options: [
                { value: String(renderAccuracyLevel.Low), label: "Low" },
                { value: String(renderAccuracyLevel.Middle), label: "Middle" },
                { value: String(renderAccuracyLevel.High), label: "High" },
                { value: String(renderAccuracyLevel.VeryHigh), label: "Very High" },
            ],
            key: "renderAccuracy"
        },
        {
            name: "Shadow",
            type: uiType.Selector,
            options: [
                { value: String(shadowLevel.Low), label: "Low" },
                { value: String(shadowLevel.Middle), label: "Middle" },
                { value: String(shadowLevel.High), label: "High" },
            ],
            key: "shadow"
        },


        {
            name: "Display Blood",
            type: uiType.Switch,
            uncheckedText: "Close",
            checkedText: "Open",
            key: "isShowBlood"
        },

        {
            name: "Max Unit Count",
            type: uiType.Selector,
            options: [
                { value: String(maxUnitCount.Small), label: "Small" },
                { value: String(maxUnitCount.Middle), label: "Middle" },
                { value: String(maxUnitCount.Big), label: "Big" },
                { value: String(maxUnitCount.VeryBig), label: "Very Big" },
            ],
            key: "maxUnitCount"
        },
        {
            name: "Physics",
            type: uiType.Selector,
            options: [
                { value: String(physicsLevel.VeryLow), label: "Very Low" },
                { value: String(physicsLevel.Low), label: "Low" },
                { value: String(physicsLevel.Middle), label: "Middle" },
                { value: String(physicsLevel.High), label: "High" },
                { value: String(physicsLevel.VeryHigh), label: "Very High" },
            ],
            key: "physics"
        },
        // {
        //     name: "Camera Rotate Speed",
        //     type: uiType.Selector,
        //     options: [
        //         { value: String(cameraRotateSpeed.VeryLow), label: "Very Low" },
        //         { value: String(cameraRotateSpeed.Low), label: "Low" },
        //         { value: String(cameraRotateSpeed.Middle), label: "Middle" },
        //         { value: String(cameraRotateSpeed.High), label: "High" },
        //         { value: String(cameraRotateSpeed.VeryHigh), label: "Very High" },
        //     ],
        //     key: "cameraRotateSpeed"
        // },
        {
            name: "Map Size",
            type: uiType.Selector,
            options: [
                { value: String(mapSize.Small), label: "Small" },
                { value: String(mapSize.Middle), label: "Middle" },
                { value: String(mapSize.Big), label: "Big" },
                // { value: String(mapSize.VeryBig), label: "Very Big" },
            ],
            key: "mapSize"
        },
        {
            name: "Map Sparse",
            type: uiType.Selector,
            options: [
                { value: String(mapSparse.Small), label: "Small" },
                { value: String(mapSparse.Middle), label: "Middle" },
                { value: String(mapSparse.Big), label: "Big" },
                { value: String(mapSparse.VeryBig), label: "Very Big" },
            ],
            key: "mapSparse"
        },
    ]
}

export let getSettingType = (api: api) => {
    if (api.internation.isChinese()) {
        return "渲染设置"
    }


    return "Render Setting"
}