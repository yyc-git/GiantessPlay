import "./MissionFail.scss"

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Layout, Button, Row } from 'antd';
import { Modal } from 'antd-mobile';
import { AppDispatch, AppState } from "../../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { readState, setAbstractState, writeState } from "../../../../../business_layer/State";
import { setPage, setTargetScene } from "../../../../global/store/GlobalStore";
import { page, scene } from "../../../../global/store/GlobalStoreType";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import Title from "antd/es/typography/Title";
import * as  CityScene3D from '../../../../../business_layer/CityScene3D';
import { off, on } from "../../../../../business_layer/Event";
import { getDestroyedEventName } from "../../../../../scene3d_layer/script/scene/scene_city/utils/EventUtils";
import { isGirl } from "../../../../../scene3d_layer/script/scene/scene_city/girl/Girl";
import { getLevelNumber, getSceneChapter, isGiantessRoad, isLittleRoad } from "../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { Camera } from "meta3d-jiehuo-abstract";
import { getAbstractState } from "../../../../../scene3d_layer/state/State";
import { getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { startLoop } from "../../../../../business_layer/Loop";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { defaultIconPrefixCls } from "antd/es/config-provider";
import { enterLevel, exit } from "../../../../utils/MissionUtils";

let MissionFail: React.FC = () => {
	let [isShowModal, setIsShowModal] = useState(true)

	let currentSceneData = useSelector<AppState>((state) => state.global.currentSceneData)

	let dispatch: AppDispatch = useDispatch()

	// let _destroyedEventHandler = (state, { userData }) => {
	// 	let { name } = NullableUtils.getExn(userData)

	// 	if (isGirl(name)) {
	// 		setIsShowModal(_ => true)
	// 	}

	// 	return Promise.resolve(state)
	// }

	let _getTitle = () => {

		// return isGiantessRoad(readState()) ? "小人胜利了" : "巨大娘胜利了"
		// return "你倒下了"
		return "再接再厉"
	}

	let _isContinue = (state) => {
		switch (getSceneChapter(state)) {
			case scene.Biwu:
				return false
			default:
				return isLittleRoad(state)
		}
	}

	// useEffect(() => {
	// 	writeState(on(readState(), getDestroyedEventName(), _destroyedEventHandler))

	// 	return () => {
	// 		writeState(off(readState(), getDestroyedEventName(), _destroyedEventHandler))
	// 	};
	// }, []);

	return <Modal getContainer={LandscapeUtils.getRootDom()}
		visible={isShowModal}
		closeOnMaskClick={false}
		showCloseButton={false}
		className="mission_fail"
		title={
			<Title className="title">{_getTitle()}</Title>
		}
		content={
			<>
				<Row justify="center" className="row">
					<Title className="game_time">{`游戏时间：${CityScene3D.getGameTime(readState())}`}</Title>
				</Row>
				<Row justify="center" className="button">
					{
						_isContinue(readState()) ?
							<Button key={"continue"} className="continue" onClick={_ => {
								let state = readState()

								state = setAbstractState(state, CameraControls.lock(getAbstractState(state)))

								writeState(startLoop(state))

								setIsShowModal(() => false)
							}}>
								{`继续游戏`}
							</Button >
							: null
					}
					<Button key={"continue"} className="continue" type="primary" onClick={_ => {
						let state = readState()

						return enterLevel([
							setIsShowModal,
							dispatch
						], [getSceneChapter(state), getLevelNumber(state)], page.Scene).then(writeState)
					}}>
						{`重新开始`}
					</Button >

					<Button key={"index"} className="index" onClick={_ => {
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

export default MissionFail;