import "./LittleManSetting.scss"

import React, { useState } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { readState, writeState } from "../../../../business_layer/State";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { setPage, setTargetScene } from "../../../global/store/GlobalStore";
import { page, scene } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import { renderButton, renderImage as renderButtonImage } from "../../../utils/ButtonUtils";
import { getClickLargeSoundResourceId, getClickMiddleSoundResourceId } from "../../../../business_layer/Loader";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Device } from "meta3d-jiehuo-abstract";
import { renderImage } from "../../../utils/ImageUtils";
import { road } from "meta3d-jiehuo-abstract/src/type/StateType";
import Text from 'antd/es/typography/Text';
import { Selector, Switch } from "antd-mobile";
import { getLittleManSetting, setLittleManSettingArmyCount, setLittleManSettingBiggerFrequency, setLittleManSettingGiantessScale, setLittleManSettingGiantessStrength, setLittleManSettingIsBiggerNoLimit, setLittleManSettingLittleManStrength, setLittleManSettingPropCount } from "../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { armyCount, biggerFrequency, giantessScale, giantessStrength, littleManStrength, propCount } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { set } from "../../../utils/SettingUtils";

let LittleManSetting: React.FC = () => {
    let dispatch: AppDispatch = useDispatch()

    return <Layout className="little-man-setting-main"  >
        <Flex justify="center" align="center">
            <Title className="title">小人路线设置</Title>
        </Flex>


        <Row justify="center">
            {
                renderButton(state => {
                    // dispatch(setPage(page.SelectLittleMan))
                    dispatch(setPage(page.SelectLevel))

                    return Promise.resolve(state)
                }, "enter", "确定", "", getClickMiddleSoundResourceId())
            }
            {
                renderButton(state => {
                    dispatch(setPage(page.SelectRoad))

                    return Promise.resolve(state)
                }, "back", "返回", "tab", getClickLargeSoundResourceId(), "default")
            }
        </Row>

        <section className="setting">
            <Row justify="center">
                <Text>道具数量：</Text>
                <Selector
                    defaultValue={String(getLittleManSetting(readState()).propCount)}
                    onChange={arr => {
                        set(setLittleManSettingPropCount, arr, propCount.Middle)
                    }}
                    options={
                        [
                            { value: String(propCount.Low), label: "低" },
                            { value: String(propCount.Middle), label: "中" },
                            { value: String(propCount.High), label: "高" },
                            { value: String(propCount.Infinity), label: "无限" },
                        ]
                    }
                />
            </Row>

            <Row justify="center">
                <Text>军队数量：</Text>
                <Selector
                    defaultValue={String(getLittleManSetting(readState()).armyCount)}
                    onChange={arr => {
                        set(setLittleManSettingArmyCount, arr, armyCount.Middle)
                    }}
                    options={
                        [
                            { value: String(armyCount.None), label: "无" },
                            { value: String(armyCount.Low), label: "低" },
                            { value: String(armyCount.Middle), label: "中" },
                            { value: String(armyCount.High), label: "高" },
                        ]
                    }
                />
            </Row>

            <Row justify="center">
                <Text>小人强度：</Text>
                <Selector
                    defaultValue={String(getLittleManSetting(readState()).littleManStrength)}
                    onChange={arr => {
                        set(setLittleManSettingLittleManStrength, arr, littleManStrength.Low)
                    }}
                    options={
                        [
                            { value: String(littleManStrength.Low), label: "低" },
                            { value: String(littleManStrength.Middle), label: "中" },
                            { value: String(littleManStrength.High), label: "高" },
                        ]
                    }
                />
            </Row>

            <Row justify="center">
                <Text>巨大娘强度：</Text>
                <Selector
                    defaultValue={String(getLittleManSetting(readState()).giantessStrength)}
                    onChange={arr => {
                        set(setLittleManSettingGiantessStrength, arr, giantessStrength.Middle)
                    }}
                    options={
                        [
                            { value: String(giantessStrength.Low), label: "低" },
                            { value: String(giantessStrength.Middle), label: "中" },
                            { value: String(giantessStrength.High), label: "高" },
                            { value: String(giantessStrength.VeryHigh), label: "非常高" },
                        ]
                    }
                />
            </Row>

            <Row justify="center">
                <Text>巨大娘高度：</Text>
                <Selector
                    defaultValue={String(getLittleManSetting(readState()).giantessScale)}
                    onChange={arr => {
                        set(setLittleManSettingGiantessScale, arr, giantessScale.Low)
                    }}
                    options={
                        [
                            { value: String(giantessScale.Low), label: "低" },
                            { value: String(giantessScale.Middle), label: "中" },
                            { value: String(giantessScale.High), label: "高" },
                            { value: String(giantessScale.VeryHigh), label: "非常高" },
                            { value: String(giantessScale.MostHigh), label: "最高" },
                        ]
                    }
                />
            </Row>

            <Row justify="center">
                <Text>巨大娘变大频率：</Text>
                <Selector
                    defaultValue={String(getLittleManSetting(readState()).biggerFrequency)}
                    onChange={arr => {
                        set(setLittleManSettingBiggerFrequency, arr, biggerFrequency.Low)
                    }}
                    options={
                        [
                            { value: String(biggerFrequency.Low), label: "低" },
                            { value: String(biggerFrequency.Middle), label: "中" },
                            { value: String(biggerFrequency.High), label: "高" },
                        ]
                    }
                />
            </Row>


            <Row justify="center">
                <Text>是否无限变大：</Text>
                <Switch
                    defaultChecked={getLittleManSetting(readState()).isBiggerNoLimit}
                    uncheckedText='否' checkedText='是'
                    onChange={val => {
                        writeState(setLittleManSettingIsBiggerNoLimit(readState(), val))
                    }}
                />
            </Row>
        </section>

    </Layout >
};

export default LittleManSetting;