import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, getState, setState, createState } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { secondUnit, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data } from "frontend/src/scene3d_layer/internation/Data"
import { api } from "type-api/src/Type"

export let getName = () => "Buff_Giantess_SmallerWater"

export enum languageKey {
    Description,
}

let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "缩小药水"
        },
        [language.English]: {
            [languageKey.Description]: "Smaller Water"
        },
    }
}

// let _buildDeferName = () => `${getName()}_defer`

export let getBuffData = (): singleBuffData => {
    return {
        name: getName(),
        imageSrc: getImageSrc(),

        isPositive: isPositive(),

        characterType: getCharacterType(),

        value: 0,

        maxSuperPositionCount: +Infinity,

        isWorkInContinueLevels: false,

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl, superPositionCount: number, sumValue: number) => {
            let api = funcData.getModAPI(state)

            let decreaseScale
            let scale = api.getGirlScale(state, usedGirl)
            let halfScale = scale * 0.5
            if (halfScale > 200) {
                decreaseScale = scale - 200
            }
            else if (halfScale < api.getGirlValue(state, usedGirl).minScale
            ) {
                decreaseScale = scale - api.getGirlValue(state, usedGirl).minScale
            }
            else {
                decreaseScale = halfScale
            }

            // // let decreaseScale = api.getGirlScale(state, usedGirl) * 0.5
            // let scale = api.NumberUtils.greaterThan(
            //     api.getGirlScale(state, usedGirl) - api.getGirlScale(state, usedGirl) * 0.5,
            //     api.getGirlValue(state, usedGirl).minScale
            // )
            // let decreaseScale = api.getGirlScale(state, usedGirl) - scale

            // state = api.setGirlScaleAndKeepCamera(state,usedGirl, scale)
            state = api.setGirlScaleAndKeepCamera(state, usedGirl, scale - decreaseScale)

            // state = api.girl.computeGirlBoxAndNotChangeCenterXY(state)

            // state = api.setAbstractState(state, api.Flow.addDeferExecFuncDataByTime(api.getAbstractState(state), (state) => {
            //     state = api.setGirlScaleAndKeepCamera(state,usedGirl, api.getGirlScale(state, usedGirl) + decreaseScale)

            //     return Promise.resolve(state)
            // }, getLastTime(), _buildDeferName()))

            state = setState(api, state, {
                ...getState(api, state),
                decreaseScale: getState(api, state).decreaseScale + decreaseScale
            })


            return Promise.resolve(state)
        },
        deapplyFunc: (state, funcData, name, usedGirl, superPositionCount: number, sumValue: number) => {
            // let api = funcData.getModAPI(state)

            // state = api.setAbstractState(state, api.Flow.removeDeferExecFuncData(api.getAbstractState(state), _buildDeferName()))

            return Promise.resolve(state)
        },
        removeFunc: (state, funcData, name, usedGirl, superPositionCount: number, value: number) => {
            let api = funcData.getModAPI(state)

            // state = funcData.GiantessBuildUtils.setInitialScaleAndUpdateScale(state, funcData, (state, initialScale) => {
            //     return initialScale + getState(api, state).decreaseScale

            // }, usedGirl, funcData.setGirlScale)


            api.setGirlScaleByDeferTimeout0(api.getGirlScale(state, usedGirl) + getState(api, state).decreaseScale, usedGirl)

            state = setState(api, state, {
                ...getState(api, state),
                decreaseScale: 0
            })


            // state = api.setAbstractState(state, api.Flow.addDeferExecFuncData(api.getAbstractState(state), (state) => {
            //     // state = api.setGirlScaleAndKeepCamera(state,usedGirl, api.getGirlScale(state, usedGirl) + decreaseScale)
            //     state = api.setGirlScaleAndKeepCamera(state,usedGirl, api.getGirlScale(state, usedGirl) + getState(api, state).decreaseScale)

            //     state = setState(api, state, {
            //         ...getState(api, state),
            //         decreaseScale: 0
            //     })


            //     return Promise.resolve(state)
            // }, 60))

            state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
                createState(api)
            )


            return Promise.resolve(state)
        },
    }
}

export let getLastTime = (): secondUnit => 30
// export let getLastTime = (): secondUnit => 5

export let getCharacterType = () => characterType.Giantess

export let isPositive = () => false

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

export let addBuff = (api: api, state: state, targetName, usedGirl) => {
    state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
        {
            ...api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()),
            startTime: api.MutableRecordUtils.set(api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()).startTime, usedGirl, api.getNow(state)),
        }
    )

    return api.addBuff(state, getName(), targetName, usedGirl, getLastTime(), 1, getCharacterType())
}