import "./GameEventTip.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Mask } from "antd-mobile";
import Title from "antd/es/typography/Title";
import { gameEventTipData, getPropData } from "../../../store/SceneStoreType";
import { renderImage } from "../../../../../utils/ImageUtils";
import { readState } from "../../../../../../scene3d_layer/state/State";

let GameEventTip: React.FC = () => {
	let gameEventTip = useSelector<AppState>((state) => state.scene.gameEventTip) as gameEventTipData

	return <Layout className="game-event-tip-main" >
		{
			NullableUtils.getWithDefault(
				NullableUtils.map(gameEventTip => {
					// return <Mask
					// 	visible={true}
					// 	opacity={0.3}
					// 	color={"black"}
					// 	stopPropagation={[]}
					// >
					// 	<Flex justify="center" align="center">
					// 		<Title className="title" >{gameEventTip.description}</Title>
					// 	</Flex>
					// </Mask>
					return <Title className="title" >{gameEventTip.description}</Title>
				}, gameEventTip),
				null
			)
		}
	</Layout >
};

export default GameEventTip;