import "./BiwuSetting.scss"

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
import Text from 'antd/es/typography/Text';
import { Selector, Switch } from "antd-mobile";
import { getBiwuSetting, setBiwuSettingDifficulty } from "../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { difficulty } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { set } from "../../../utils/SettingUtils";

let BiwuSetting: React.FC = () => {
    let dispatch: AppDispatch = useDispatch()

    return <Layout className="biwu-setting-main"  >
        <Flex justify="center" align="center">
            <Title className="title">比武设置</Title>
        </Flex>


        <Row justify="center">
            {
                renderButton(state => {
                    dispatch(setPage(page.SelectLittleMan))

                    return Promise.resolve(state)
                }, "enter", "确定", "", getClickMiddleSoundResourceId())
            }
            {
                renderButton(state => {
                    dispatch(setPage(page.SelectLevel))

                    return Promise.resolve(state)
                }, "back", "返回", "tab", getClickLargeSoundResourceId(), "default")
            }
        </Row>

        <section className="setting">
            <Row justify="center">
                <Text>难度：</Text>
                <Selector
                    defaultValue={String(getBiwuSetting(readState()).difficulty)}
                    onChange={arr => {
                        set(setBiwuSettingDifficulty, arr, difficulty.Middle)
                    }}
                    options={
                        [
                            { value: String(difficulty.VeryEasy), label: "非常简单" },
                            { value: String(difficulty.Easy), label: "简单" },
                            { value: String(difficulty.Middle), label: "中" },
                            { value: String(difficulty.Hard), label: "难" },
                            { value: String(difficulty.VeryHard), label: "非常难" },
                        ]
                    }
                />
            </Row>
        </section>

    </Layout >
};

export default BiwuSetting;