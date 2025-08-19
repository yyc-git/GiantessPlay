import "./MissionComplete.scss"

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Layout, Button, Row } from 'antd';
import { Modal } from 'antd-mobile';
import { AppDispatch, AppState } from "../../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getAbstractState, readState, writeState } from "../../../../../business_layer/State";
import { setPage, setTargetScene } from "../../../../global/store/GlobalStore";
import { page, scene } from "../../../../global/store/GlobalStoreType";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import Title from "antd/es/typography/Title";
import * as  CityScene3D from '../../../../../business_layer/CityScene3D';
import { Camera } from "meta3d-jiehuo-abstract";
import { getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { getLevelNumber, getSceneChapter, isGiantessRoad } from "../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { setAbstractState } from "../../../../../scene3d_layer/state/State";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { renderButton } from "../../../../utils/ButtonUtils";
import { getClickLargeSoundResourceId, getClickSmallSoundResourceId } from "../../../../../business_layer/Loader";
import { enterLevel, exit } from "../../../../utils/MissionUtils";

let MissionComplete: React.FC = () => {
    let [isShowModal, setIsShowModal] = useState(true)

    let currentSceneData = useSelector<AppState>((state) => state.global.currentSceneData)

    let dispatch: AppDispatch = useDispatch()

    let _getTitle = () => {
        // return isGiantessRoad(readState()) ? "巨大娘胜利了" : "小人胜利了"
        return "通关"
    }

    let _isContinue = (state) => {
        switch (getSceneChapter(state)) {
            case scene.Biwu:
                return false
            default:
                return true
        }
    }

    let _renderNextLevel = (state) => {
        switch (getSceneChapter(state)) {
            case scene.Play:
                return <Button key={"next"} className="next" disabled={true} >
                    {`下一关（正在开发中）`}
                </Button >
            case scene.Biwu:
                if (getLevelNumber(state) < 3) {
                    return renderButton(state => {
                        return enterLevel([
                            setIsShowModal,
                            dispatch
                            // ], [getSceneChapter(state), getLevelNumber(state) + 1], page.SelectLittleMan)
                        ], [getSceneChapter(state), getLevelNumber(state) + 1], page.BiwuSetting)
                    }, "next", "下一关", "next", getClickLargeSoundResourceId())
                }

                return <Button key={"next"} className="next" disabled={true} >
                    {`下一关（正在开发中）`}
                </Button >
            default:
                throw new Error("err")
        }
    }

    return <Modal getContainer={LandscapeUtils.getRootDom()}
        visible={isShowModal}
        closeOnMaskClick={false}
        showCloseButton={false}
        className="mission_complete"
        title={
            <Title className="title">{_getTitle()}</Title>
        }
        content={
            <>
                <Row justify="center" className="row">
                    <Title className="game_time">{`游戏时间：${CityScene3D.getGameTime(readState())}`}</Title>
                </Row>
                <Row justify="center" className="row">
                    {/* <Title className="destroyed_rate">{`破坏程度：${Math.floor(NumberUtils.getDecimal(CityScene3D.getDestroyedRate(readState()), 2) * 100)}%`}</Title> */}
                    <Title className="destroyed_rate">{`破坏程度：${CityScene3D.getDestroyedRate(readState())}%`}</Title>
                </Row>
                <Row justify="center" className="button">
                    {
                        _renderNextLevel(readState())
                    }
                    {
                        _isContinue(readState()) ?
                            <Button key={"continue"} className="continue" onClick={_ => {
                                let state = readState()

                                state = setAbstractState(state, CameraControls.lock(getAbstractState(state)))

                                setIsShowModal(() => false)
                            }}>
                                {`继续游戏`}
                            </Button >
                            : null
                    }
                    <Button key={"index"} className="index" type="primary" onClick={_ => {
                        return exit(dispatch)
                    }}>
                        {`返回首页`}
                    </Button >
                </Row>
            </>
        }
    >
    </Modal>
};

export default MissionComplete;