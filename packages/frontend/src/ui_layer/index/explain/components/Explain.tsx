import "./Explain.scss"

import React, { useState } from 'react';
import { Button, Col, Flex, Image, Layout, Row, Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { getAbstractState, readState, writeState } from "../../../../business_layer/State";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { setPage, setTargetScene } from "../../../global/store/GlobalStore";
import { page, scene } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import { renderButton, renderImage as renderButtonImage } from "../../../utils/ButtonUtils";
import { getClickLargeSoundResourceId } from "../../../../business_layer/Loader";
import { Device } from "meta3d-jiehuo-abstract";
import { renderImage } from "../../../utils/ImageUtils";
import { getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { getIsDebug } from "../../../../scene3d_layer/script/scene/Scene";
import { Camera } from "meta3d-jiehuo-abstract";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getLanguageTextData, languageKey } from "../../../../scene3d_layer/internation/Data";
import { mmdCharacter } from "mmd-character-default/src/json/Type";
import { getCurrentMMDCharacterName, getCurrentMMDCharacterNameByUsedGirl } from "../../../../scene3d_layer/script/scene/scene_city/girl/Girl";
import { addPropCount, subPropCount } from "../../../../scene3d_layer/script/scene/scene_city/reward/Prop";
import { getUseGiantessCharacterBlockService } from "../../../../scene3d_layer/mod/PropOtherMod";
import { handleNetworkRequest } from "../../../utils/BackendUtils";
import { updateRewardBackend } from "../../../../scene3d_layer/script/scene/scene_city/reward/RewardGenerator";
import { removeCareerNeedTotalGem } from "../../../../scene3d_layer/script/scene/scene_city/build/Career";
import { deferSwitchPageForGetNewestState } from "../../../utils/SwitchPageUtils";
import { isNeedUseGiantessProp } from "../../../../scene3d_layer/script/scene/scene_city/User";

let Explain: React.FC = () => {
    let character = useSelector<AppState>((state) => state.global.character) as any

    let dispatch: AppDispatch = useDispatch()

    let _render = () => {
        if (Device.isMobile()) {
            return <>
                {/* <Row justify="center" className="">
                    <Title className="level1" >
                        屏幕左下方的圆形区域控制移动
                    </Title>
                </Row>

                <Row justify="center" className="">
                    <Title className="level1" >
                        点击屏幕右下方的按钮进行“踩踏”
                    </Title>
                </Row>

                <Row justify="center" className="">
                    <Title className="level1" >
                        屏幕其余区域可控制相机
                    </Title>
                </Row> */}

                {/* <Row justify="center" className="">
                    <Title className="level1" >
                        左手控制移动，右手控制相机或者踩踏
                    </Title>
                </Row> */}

                {/* {
                    renderImage("./resource/ui/not_in_game/mobile_explain.jpg", "mobile")
                } */}
                {
                    renderButtonImage(state => {
                        dispatch(setPage(page.Scene))

                        return Promise.resolve(state)

                    }, "./resource/ui/not_in_game/mobile_explain.jpg", "mobile", false, NullableUtils.return_(getClickLargeSoundResourceId()))
                }
            </>
        }



        const columns = [
            {
                title: getLanguageTextData(readState(), languageKey.KeyTitle),
                dataIndex: 'keyboard',
                key: 'keyboard',
            },
            {
                title: getLanguageTextData(readState(), languageKey.FunctionTitle),
                dataIndex: 'function',
                key: 'function',
            },
        ];

        const dataSource = [
            {
                key: '1',
                keyboard: 'W、A、S、D',
                function: getLanguageTextData(readState(), languageKey.Key1Function),
            },
            {
                key: '2',
                keyboard: 'G',
                function: getLanguageTextData(readState(), languageKey.Key2Function),
            },
        ];


        return <>
            {/* <Row justify="center" className="">
                <Title className="level1" >W、A、S、D：控制移动</Title>
            </Row>

            <Row justify="center" className="">
                <Title className="level1" >
                E：踩踏
                </Title>
            </Row> */}
            <Table className="pc" pagination={false} dataSource={dataSource} columns={columns} />;
        </>
    }

    return <Layout className="explain-main"  >
        <Flex justify="center" align="center">
            <Title className="title">{getLanguageTextData(readState(), languageKey.ExplainTitle)}</Title>
        </Flex>

        {
            _render()
        }

        <Row justify="center" className="button">
            {
                renderButton(state => {
                    if (isNeedUseGiantessProp(state, character)) {
                        state = subPropCount(state, getUseGiantessCharacterBlockService(state).getName(), 1)
                    }

                    writeState(state)

                    return handleNetworkRequest(state => {
                        return updateRewardBackend(state).then(writeState)
                    }, (state) => {
                        // dispatch(setPage(page.Scene))

                        // if (Camera.isCanLock(getAbstractState(state))) {
                        //     getOrbitControls(getAbstractState(state)).lock()
                        // }

                        // return Promise.resolve(state)
                        // return removeCareerNeedTotalGem().then(_ => state)
                        return removeCareerNeedTotalGem().then(_ => {
                            deferSwitchPageForGetNewestState(dispatch, setPage(page.Scene))

                            return state
                        })
                    }, state => {
                        state = addPropCount(state, getUseGiantessCharacterBlockService(state).getName(), 1)

                        return Promise.resolve(state)
                    })

                }, "enter", getLanguageTextData(readState(), languageKey.EnterGame), "tab", getClickLargeSoundResourceId())
            }
            {
                renderButton(state => {
                    dispatch(setPage(page.IndexMain))

                    return Promise.resolve(state)
                }, "back", getLanguageTextData(readState(), languageKey.BackToIndex), "tab", getClickLargeSoundResourceId(), "default")
            }
        </Row>
    </Layout >
};

export default Explain;