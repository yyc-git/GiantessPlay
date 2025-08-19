import "./GiantessSetting.scss"

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
import { getGiantessSetting, setGiantessSettingArmyCount, setGiantessSettingExcitementIncrease, setGiantessSettingGiantessScale, setGiantessSettingGiantessStrength, setGiantessSettingIsBiggerNoLimit } from "../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { armyCount, excitementIncrease, giantessScale, giantessStrength, littleManStrength } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { set } from "../../../utils/SettingUtils";

let GiantessSetting: React.FC = () => {
    let dispatch: AppDispatch = useDispatch()

    return <Layout className="giantess-setting-main"  >
        <Flex justify="center" align="center">
            <Title className="title">巨大娘路线设置</Title>
        </Flex>

        <Row justify="center">
            {
                renderButton(state => {
                    // dispatch(setPage(page.SelectCharacter))
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
                <Text>军队数量：</Text>
                <Selector
                    defaultValue={String(getGiantessSetting(readState()).armyCount)}
                    onChange={arr => {
                        set(setGiantessSettingArmyCount, arr, armyCount.Middle)
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
                <Text>巨大娘强度：</Text>
                <Selector
                    defaultValue={String(getGiantessSetting(readState()).giantessStrength)}
                    onChange={arr => {
                        set(setGiantessSettingGiantessStrength, arr, giantessStrength.Middle)
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
                    defaultValue={String(getGiantessSetting(readState()).giantessScale)}
                    onChange={arr => {
                        set(setGiantessSettingGiantessScale, arr, giantessScale.Low)
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
                <Text>兴奋获取速度：</Text>
                <Selector
                    defaultValue={String(getGiantessSetting(readState()).excitementIncrease)}
                    onChange={arr => {
                        set(setGiantessSettingExcitementIncrease, arr, excitementIncrease.Middle)
                    }}
                    options={
                        [
                            { value: String(excitementIncrease.Low), label: "低" },
                            { value: String(excitementIncrease.Middle), label: "中" },
                            { value: String(excitementIncrease.High), label: "高" },
                        ]
                    }
                />
            </Row>


            <Row justify="center">
                <Text>是否无限变大：</Text>
                <Switch
                    defaultChecked={getGiantessSetting(readState()).isBiggerNoLimit}
                    uncheckedText='否' checkedText='是'
                    onChange={val => {
                        writeState(setGiantessSettingIsBiggerNoLimit(readState(), val))
                    }}
                />
            </Row>
        </section>
    </Layout >
};

export default GiantessSetting;