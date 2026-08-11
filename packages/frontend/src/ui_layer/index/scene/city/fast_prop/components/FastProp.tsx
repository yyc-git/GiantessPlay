import "./FastProp.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../store/AppStore";
import Text from "antd/es/typography/Text";
import { renderImage, renderImage2, renderImageDom } from "../../../../../utils/ImageUtils";
import { readState } from "../../../../../../scene3d_layer/state/State";
import { Grid } from "antd-mobile";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { buildFastPropItemClassName, useProp } from "../../../../../utils/PropUtils";
import { getAbstractState, writeState } from "../../../../../../business_layer/State";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getPropCount, isDisable } from "../../../../../../scene3d_layer/script/scene/scene_city/reward/Prop";
import { getCharacterType } from "meta3d-jiehuo-abstract/src/scene/Scene";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { Event } from "meta3d-jiehuo-abstract";
import { getManualUIUpdateEventName } from "../../../../../../scene3d_layer/utils/EventUtils";
import { Device } from "meta3d-jiehuo-abstract";
import { getFastPropData } from "../../../../../../scene3d_layer/script/scene/scene_city/FastProp";

let FastProp: React.FC = () => {
    // let fastPropData = useSelector<AppState>((state) => state.scene.fastPropData)
    // let _ = useSelector<AppState>((state) => state.scene.manualUIUpdateRandomValue)
    let _ = useSelector<AppState>((state) => state.scene.operateRandomValue)

    let dispatch: AppDispatch = useDispatch()

    let _handleFastPropData = (fastPropData) => {
        // return ArrayUtils.removeDuplicateItemsWithBuildKeyFunc(
        //     MutableRecordUtils.entries(
        //         MutableRecordUtils.concat(
        //             ArrayUtils.range(1, 5).reduce((map, index) => {
        //                 return MutableRecordUtils.set(map, index, NullableUtils.getEmpty())
        //             }, MutableRecordUtils.create()),
        //             fastPropData
        //         )
        //     ).map(([index, d]) => d as any),
        //     (d) => d.data[0]
        // )

        let state = readState()

        let d
        switch (getCharacterType(getAbstractState(state))) {
            case characterType.LittleMan:
                d = fastPropData.littleMan
                break
            case characterType.Giantess:
                d = fastPropData.giantess
                break
            default:
                throw new Error("err")
        }

        d = d.toObject()

        return MutableRecordUtils.entries(
            MutableRecordUtils.concat(
                ArrayUtils.range(0, 4).reduce((map, index) => {
                    return MutableRecordUtils.set(map, index, NullableUtils.getEmpty())
                }, MutableRecordUtils.create()),
                d
            )
        ).map(([index, d]) => d as any)
    }


    let _renderItem = (
        { usePropFunc, propName, propImageSrc },
        index
    ) => {
        let isDisable_ = isDisable(readState(), propName)
        let count = getPropCount(readState(), propName)

        return < div className="item">
            {
                renderImageDom(propImageSrc, `${buildFastPropItemClassName(index)} image ${isDisable_ ? "disabled" : ""}`, (state) => {
                    if (isDisable_) {
                        return Promise.resolve(state)
                    }

                    writeState(state)

                    return useProp([
                        usePropFunc,
                        (state, _) => {
                            // dispatch(setFastPropData({
                            //     characterType_: getCharacterType(getAbstractState(state)),
                            //     index: index,
                            //     value: { usePropFunc, propName, propImageSrc }
                            // }))

                            // return Event.trigger(state, getAbstractState, getManualUIUpdateEventName(), null).then(writeState)
                            writeState(state)
                            return Promise.resolve()
                        },
                        dispatch
                    ], propName).then(_ => {
                        return readState()
                    })
                })
            }
            {
                isFinite(count) ?
                    <span className="count">{count}</span>
                    : null
            }
            {
                !Device.isMobile() ? <span className="text" >{index + 1}</span> : null
            }
        </div>
    }

    let _render = () => {
        return <>
            {
                <Grid columns={5}>
                    {
                        _handleFastPropData(getFastPropData(readState())).map((d, index) => {
                            return <Grid.Item>
                                {
                                    NullableUtils.isNullable(d) ? null : _renderItem(NullableUtils.getExn(d), index)
                                }
                            </Grid.Item>
                        })
                    }
                </Grid >
            }
        </>

    }

    return <Layout className="fastprop-main">
        {_render()}
    </Layout >

};

export default FastProp;