import "./Share.scss"

import React, { useState } from 'react';
import { Col, Flex, Layout, Row } from 'antd';
import { Card, Selector, Switch, Toast } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { getAbstractState, readState, writeState } from "../../../../business_layer/State";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { setPage, setTargetScene } from "../../../global/store/GlobalStore";
import { page, scene } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import { Content } from "antd/es/layout/layout";
import { renderButton } from "../../../utils/ButtonUtils";
import { getClickMiddleSoundResourceId, getClickSmallSoundResourceId } from "../../../../business_layer/Loader";
import Text from 'antd/es/typography/Text';
import { Device } from "meta3d-jiehuo-abstract";
import { renderImage } from "../../../utils/ImageUtils";
import { getLanguageImageData, getLanguageTextData, languageImageKey, languageKey } from "../../../../scene3d_layer/internation/Data";
import { Clipboard } from "meta3d-jiehuo-abstract";
import { Modal } from "antd-mobile/es/components/modal/modal";
import { handleEventHandler } from "../../../utils/ErrorUtils";

let Share: React.FC = () => {
    let dispatch: AppDispatch = useDispatch()

    return <Layout className="share-main"  >
        <Flex justify="center" align="center">
            <Title className="title">{getLanguageTextData(readState(), languageKey.ShareTitle)}</Title>
        </Flex>

        <Row justify="center">
            <Col className="col" span={12}>
                <Title className="level1">{getLanguageTextData(readState(), languageKey.ShareTitle2)}</Title>
                {
                    renderImage(getLanguageImageData(readState(), languageImageKey.Code), "", false)
                }
            </Col>
            <Col className="col" span={12}>
                <Title className="level1">{getLanguageTextData(readState(), languageKey.ShareTitle3)}</Title>
                {/* <Text className="level2">gts-play.cn</Text> */}
                <input className="input" id="input" value="https://gts-play.cn" size="15" />

                {
                    renderButton(state => {
                        // Modal.alert({
                        //     content: getLanguageTextData(state, languageKey.EnableClipboard),
                        //     confirmText: getLanguageTextData(state, languageKey.Confirm),
                        //     onConfirm: handleEventHandler(() => {
                        //         return Clipboard.writeText("https://gts-play.cn/", [
                        //             () => {
                        //                 Toast.show({
                        //                     content: getLanguageTextData(readState(), languageKey.Success)
                        //                 })
                        //             },
                        //             (e) => {
                        //                 Toast.show({
                        //                     content: `${getLanguageTextData(readState(), languageKey.Fail)}: ${e.message}`
                        //                 })
                        //             },
                        //         ])
                        //     }),
                        // })


                        let input: any = document.querySelector('#input');
                        input.select();
                        document.execCommand('copy')

                        if (!Device.isMobileByState(getAbstractState(state))) {
                            Toast.show({
                                content: getLanguageTextData(readState(), languageKey.Success)
                            })
                        }

                        return Promise.resolve(state)
                    }, "clip", getLanguageTextData(readState(), languageKey.Clipboard), "", getClickMiddleSoundResourceId())
                }
            </Col>
        </Row>

        <Row justify="center">
            {
                renderButton(state => {
                    dispatch(setPage(page.IndexMain))

                    return Promise.resolve(state)
                }, "back", getLanguageTextData(readState(), languageKey.BackToIndex), "", getClickSmallSoundResourceId(), "default")
            }
        </Row>
    </Layout >
};

export default Share;