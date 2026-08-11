import "./QTE.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../store/AppStore";
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../business_layer/State";
import { getActiveLineLeft, getIsStart, getMoveLineLeft, } from "../../../../../../scene3d_layer/script/scene/scene_city/data/biwu/level2/behaviour_tree_data/action_node/utils/QTEUtils";

let QTE: React.FC = () => {
	let _ = useSelector<AppState>((state) => state.scene.qteRandomValue)

	return <Layout className="qte-main">
		{
			getIsStart(readState()) ? <>
				<Row justify="center" className="row background-line">
				</Row>
				<Row justify="center" className="row active-line" style={{
					"left": `${getActiveLineLeft(readState())}rem`
				}}>
				</Row>
				<Row justify="center" className="row move-line" style={{
					"left": `${getMoveLineLeft(readState())}rem`
				}}>
				</Row>
			</> : null
		}
	</Layout >
};

export default QTE;