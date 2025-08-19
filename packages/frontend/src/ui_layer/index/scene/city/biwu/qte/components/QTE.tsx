import "./QTE.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import Title from "antd/es/typography/Title";
import { renderImage, renderImage2 } from "../../../../../../utils/ImageUtils";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { Flow } from "meta3d-jiehuo-abstract";
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../../business_layer/State";
import { state } from "../../../../../../../scene3d_layer/type/StateType";
import { off, on, trigger } from "../../../../../../../business_layer/Event";
import { getPointerDownEventName } from "meta3d-jiehuo-abstract/src/Event";
import { getActiveLineLeft, getIsStart, getMoveLineLeft, } from "../../../../../../../scene3d_layer/script/scene/scene_city/data/biwu/level2/behaviour_tree_data/action_node/utils/QTEUtils";

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