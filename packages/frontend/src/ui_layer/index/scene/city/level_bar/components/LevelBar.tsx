import "./LevelBar.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../store/AppStore";
import Text from "antd/es/typography/Text";
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../business_layer/State";
import { computeLevelProgressRatio, getLevelByCharacter, getSelectLevels, isCanSelectItems, selectItems } from "../../../../../../scene3d_layer/script/scene/scene_city/build/Upgrade";
import { isLittleCharacterType } from "../../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { getCharacterType } from "meta3d-jiehuo-abstract/src/scene/Scene";
import { renderImage, renderImageDom } from "../../../../../utils/ImageUtils";
import { Device } from "meta3d-jiehuo-abstract";
import { handleEventHandler } from "../../../../../utils/ErrorUtils";
import { renderSpanDom } from "../../../../../utils/SpanUtils";

let LevelBar: React.FC = () => {
	let _ = useSelector<AppState>((state) => state.scene.operateRandomValue)

	// let _getBottom = () => {
	// 	if (isLittleCharacterType(readState())) {
	// 		return "2.5rem"
	// 	}

	// 	return "3.5rem"
	// }
	let _getTop = () => {
		if (isLittleCharacterType(readState())) {
			return "1.5rem"
		}

		return "2.5rem"
	}

	let _selectItemHandler = state => {
		state = selectItems(state)

		return Promise.resolve(state)
	}

	let _renderSelectItemUI = () => {
		let state = readState()

		if (!isCanSelectItems(state)) {
			return null
		}

		return <section className="select_item" >
			{
				renderImageDom("./resource/ui/in_game/select_item.png", "select_item_icon", _selectItemHandler)
			}
			{
				renderSpanDom(getSelectLevels(state), "select_item_level", _selectItemHandler)
			}
			{
				!Device.isMobileByState(getAbstractState(state)) ? <span className="select_item_text"
				>X</span> : null
			}
		</section>
	}

	return <Layout className="level-bar-main" style={{
		// "bottom": `${_getBottom()}`
		"top": `${_getTop()}`
	}}>
		<Row justify="center" className="up-row">
			{/* <Col className="col text-col" span={8} >
				<Text className="text">{`Lv:${getLevelByCharacter(readState(), getCharacterType(getAbstractState(readState())))}`}</Text>
			</Col> */}
			{/* <Col className="col bar" span={16} > */}
			<Col className="col bar" span={24} >
				{/* <Text className="text">{`Lv:${getLevelByCharacter(readState(), getCharacterType(getAbstractState(readState())))}`}</Text> */}
				<Text className="text">{`Lv${getLevelByCharacter(readState(), getCharacterType(getAbstractState(readState())))}`}</Text>

				{
					_renderSelectItemUI()
				}

				<Row justify="center" align="middle" className="row background-line">
				</Row>
				<Row justify="center" align="middle" className="row exprience-line" style={{
					"width": `${computeLevelProgressRatio(readState()) * 100}%`
				}}>
				</Row>
			</Col>
		</Row>
	</Layout >
};

export default LevelBar;