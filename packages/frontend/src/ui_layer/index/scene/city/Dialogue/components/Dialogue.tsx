import "./Dialogue.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Mask } from "antd-mobile";
import Title from "antd/es/typography/Title";
import { dialogueData } from "../../../store/SceneStoreType";

let Dialogue: React.FC = () => {
	let dialogue = useSelector<AppState>((state) => state.scene.dialogue) as dialogueData

	let _getStyle = (dialogue) => {
		if (NullableUtils.isNullable(dialogue)) {
			return {}
		}

		dialogue = NullableUtils.getExn(dialogue)

		return dialogue.isInMiddle ? {
			"marginTop": "15%",
			"height": "20%",
			"width": "50%"
		} : {
			"marginTop": "30%"
		}
	}

	return <Layout className="dialogue-main" >
		{
			NullableUtils.isNullable(dialogue) ? null :
				<Mask
					visible={true}
					opacity={0.3}
					color={"black"}
					stopPropagation={[]}
					style={_getStyle(dialogue)}
				>
					<Flex justify="center" align="center">
						<Title className="title">{NullableUtils.getExn(dialogue).title}</Title>
					</Flex>

					<Row justify="center" className="row">
						<Col className="col" span={18}>
							<Title className="level3" >{NullableUtils.getExn(dialogue).content}</Title>
						</Col>
					</Row>
				</Mask>
		}
	</Layout >
};

export default Dialogue;