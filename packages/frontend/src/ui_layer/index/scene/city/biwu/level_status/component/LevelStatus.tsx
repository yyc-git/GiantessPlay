import "./LevelStatus.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import Title from "antd/es/typography/Title";
import { renderImage, renderImage2 } from "../../../../../../utils/ImageUtils";
import { levelStatus } from "../../../../store/SceneStoreType";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";

let LevelStatus: React.FC = () => {
	let levelStatus = useSelector<AppState>((state) => state.scene.levelStatus) as nullable<levelStatus>

	return <Layout className="biwu_level_status-main">
	</Layout >
};

export default LevelStatus;