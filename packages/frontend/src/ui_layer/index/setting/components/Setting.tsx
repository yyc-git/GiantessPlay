import "./Setting.scss"

import React, { useState } from 'react';
import { Flex, Layout, Row } from 'antd';
import { Card, Selector, Switch } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { readState, writeState } from "../../../../business_layer/State";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { setPage, setTargetScene } from "../../../global/store/GlobalStore";
import { page, scene } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import { Content } from "antd/es/layout/layout";
import { renderButton } from "../../../utils/ButtonUtils";
import { getClickMiddleSoundResourceId, getClickSmallSoundResourceId } from "../../../../business_layer/Loader";
import Text from 'antd/es/typography/Text';
import { Device } from "meta3d-jiehuo-abstract";
import { crowdSize, hdLevel, physicsLevel, renderAccuracyLevel, shadowLevel } from "meta3d-jiehuo-abstract/src/type/StateType";
import { set } from "../../../utils/SettingUtils";

let Setting: React.FC = () => {
    let dispatch: AppDispatch = useDispatch()

    return <Layout className="setting-main"  >
        <Flex justify="center" align="center">
            <Title className="title">画面设置</Title>
        </Flex>

        <Row justify="center">
            <Text>分辨率：</Text>
            <Selector
                defaultValue={String(CityScene3D.getRenderSetting(readState()).hd)}
                onChange={arr => {
                    set(CityScene3D.setHD, arr, hdLevel.Middle)
                }}
                options={
                    [
                        { value: String(hdLevel.Low), label: "低" },
                        { value: String(hdLevel.Middle), label: "中" },
                        { value: String(hdLevel.High), label: "高" },
                    ]
                }
            />
        </Row>
        <Row justify="center">
            <Text>渲染精度：</Text>
            <Selector
                defaultValue={String(CityScene3D.getRenderSetting(readState()).renderAccuracy)}
                onChange={arr => {
                    set(CityScene3D.setRenderAccuracy, arr, renderAccuracyLevel.Middle)
                }}
                options={
                    [
                        { value: String(renderAccuracyLevel.Low), label: "低" },
                        { value: String(renderAccuracyLevel.Middle), label: "中" },
                        { value: String(renderAccuracyLevel.High), label: "高" },
                        { value: String(renderAccuracyLevel.VeryHigh), label: "非常高" },
                    ]
                }
            />
        </Row>
        <Row justify="center">
            <Text>阴影：</Text>
            <Selector
                defaultValue={String(CityScene3D.getRenderSetting(readState()).shadow)}
                onChange={arr => {
                    set(CityScene3D.setShadow, arr, shadowLevel.Middle)
                }}
                options={
                    [
                        { value: String(shadowLevel.Low), label: "低" },
                        { value: String(shadowLevel.Middle), label: "中" },
                        { value: String(shadowLevel.High), label: "高" },
                    ]
                }
            />
        </Row>
        <Row justify="center">
            <Text>显示番茄酱：</Text>
            <Switch
                defaultChecked={CityScene3D.getRenderSetting(readState()).isShowBlood}
                uncheckedText='关' checkedText='开'
                onChange={val => {
                    writeState(CityScene3D.setIsShowBlood(readState(), val))
                }}
            />
        </Row>
        <Row justify="center">
            <Text>人群数量：</Text>
            <Selector
                defaultValue={String(CityScene3D.getRenderSetting(readState()).crowdSize)}
                onChange={arr => {
                    set(CityScene3D.setCrowdSize, arr, crowdSize.Small)
                }}
                options={
                    [
                        { value: String(crowdSize.Small), label: "小" },
                        { value: String(crowdSize.Middle), label: "中" },
                        { value: String(crowdSize.Big), label: "大" },
                        { value: String(crowdSize.VeryBig), label: "极大" },
                    ]
                }
            />
        </Row>
        <Row justify="center">
            <Text>物理：</Text>
            <Selector
                defaultValue={String(CityScene3D.getRenderSetting(readState()).physics)}
                onChange={arr => {
                    set(CityScene3D.setPhysics, arr, physicsLevel.Middle)
                }}
                options={
                    [
                        { value: String(physicsLevel.VeryLow), label: "极低" },
                        { value: String(physicsLevel.Low), label: "低" },
                        { value: String(physicsLevel.Middle), label: "中" },
                        { value: String(physicsLevel.High), label: "高" },
                        { value: String(physicsLevel.VeryHigh), label: "极高" },
                    ]
                }
            />
        </Row>

        <Row justify="center">
            {
                renderButton(state => {
                    dispatch(setPage(page.IndexMain))

                    return Promise.resolve( state)
                }, "back", "返回", "", getClickSmallSoundResourceId())
            }
        </Row>
    </Layout >
};

export default Setting;