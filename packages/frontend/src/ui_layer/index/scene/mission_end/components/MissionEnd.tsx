import "./MissionEnd.scss"

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
import { getLevelNumber, getSceneChapter, isGiantessCharacterType, isLittleCharacterType } from "../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { Camera } from "meta3d-jiehuo-abstract";
import { getAbstractState } from "../../../../../scene3d_layer/state/State";
import { getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { startLoop } from "../../../../../business_layer/Loop";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { defaultIconPrefixCls } from "antd/es/config-provider";
import { enterNextLevel, exit } from "../../../../utils/MissionUtils";
import { getWholeGameTimeString } from "../../../../../scene3d_layer/script/scene/scene_city/manage/mission/Mission";
import { getLanguageTextData, languageKey } from "../../../../../scene3d_layer/internation/Data";
import { handleEventHandler } from "../../../../utils/ErrorUtils";

let MissionEnd: React.FC = () => {
	let [isShowModal, setIsShowModal] = useState(true)

	let dispatch: AppDispatch = useDispatch()

	let _getTitle = () => {
		return getLanguageTextData(readState(), languageKey.MissionEndTitle)
	}

	return <Modal getContainer={LandscapeUtils.getRootDom()}
		visible={isShowModal}
		closeOnMaskClick={false}
		showCloseButton={false}
		className="mission_end"
		title={
			<Title className="title">{_getTitle()}</Title>
		}
		content={
			<>
				<Row justify="center" className="row">
					<Title className="game_time">{`${getLanguageTextData(readState(), languageKey.TotalGameTime)}：${getWholeGameTimeString(readState())}`}</Title>
				</Row>
				<Row justify="center" className="button">
					<Button key={"index"} className="index" onClick={handleEventHandler(_ => {
						return exit(dispatch)
					})}>
						{getLanguageTextData(readState(), languageKey.BackToIndex)}
					</Button >
				</Row>
			</>
		}
	>
	</Modal >
};

export default MissionEnd;