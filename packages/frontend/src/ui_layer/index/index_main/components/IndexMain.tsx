import "./IndexMain.scss"

import React, { useEffect, useState } from 'react';
import { Button, Image, Layout, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { setPage } from "../../../global/store/GlobalStore";
import { page } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import { Content, Header } from "antd/es/layout/layout";
import { renderButton, renderImage } from "../../../utils/ButtonUtils";
import { getClickMiddleSoundResourceId, getClickSmallSoundResourceId } from "../../../../business_layer/Loader";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getAbstractState, readState } from "../../../../business_layer/State";
import { getVersion } from "meta3d-jiehuo-abstract/src/version/Version";

let IndexMain: React.FC = () => {
    let [isRenderActiveCode, setIsRenderActiveCode] = useState(false)

    let dispatch: AppDispatch = useDispatch()

    let _getVersion = () => {
        let [mainVersion, subVersion] = getVersion(getAbstractState(readState()))

        return `v${mainVersion}.${subVersion}`
    }

    return <Layout className="index-main-main"  >
        {/* <Header  >
            <Title>111</Title>
        </Header> */}
        <Row justify="center" align="middle">
            {/* <Title className="title">巨大娘的玩耍</Title> */}
            {/* @ts-ignore */}
            <Image className="title" preview={false} src="./resource/ui/not_in_game/title.png"></Image>
        </Row>
        {/* <Content>
        </Content> */}
        <Layout className="body">
            <Row justify="center" align="top">
                <Title className="version">{_getVersion()}</Title>
            </Row>
            <Row justify="center" align="middle">
                {
                    // renderButton(state => {
                    //     dispatch(setPage(page.SelectCharacter))

                    //     return state
                    // }, "enter_game", "进入游戏", "", getClickSmallSoundResourceId())

                    renderImage(state => {
                        dispatch(setPage(page.SelectChapter))

                        return Promise.resolve(state)
                    }, "./resource/ui/not_in_game/enter-game-button.png", "", false, NullableUtils.return_(getClickSmallSoundResourceId()))
                }
            </Row>
            <Row justify="center" align="middle">
                {
                    // renderButton(state => {
                    //     dispatch(setPage(page.Setting))

                    //     return state
                    // }, "setting", "画面设置", "", getClickSmallSoundResourceId())

                    renderImage(state => {
                        dispatch(setPage(page.Setting))

                        return Promise.resolve(state)
                    }, "./resource/ui/not_in_game/setting-button.png", "", false, NullableUtils.return_(getClickSmallSoundResourceId()))
                }
            </Row>
            <Row justify="center" align="middle">
                {
                    // renderButton(state => {
                    //     dispatch(setPage(page.Donate))

                    //     return state
                    // }, "donate", "赞助作者", "", getClickMiddleSoundResourceId())
                    renderImage(state => {
                        dispatch(setPage(page.Website))

                        return Promise.resolve(state)
                    }, "./resource/ui/not_in_game/enter-website-button.png", "", false, NullableUtils.return_(getClickSmallSoundResourceId()))
                }
            </Row>

            <section className="fixed-button">
                {
                    renderImage(state => {
                        dispatch(setPage(page.Share))

                        return Promise.resolve(state)
                    }, "./resource/ui/not_in_game/share-button.png", "share", false, NullableUtils.return_(getClickMiddleSoundResourceId()))
                }
            </section>
        </Layout>
    </Layout >
};

export default IndexMain;