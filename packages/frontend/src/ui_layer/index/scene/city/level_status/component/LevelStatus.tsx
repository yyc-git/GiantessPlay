import "./LevelStatus.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { renderImage, renderImage2 } from "../../../../../utils/ImageUtils";
import { levelStatus } from "../../../store/SceneStoreType";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { isGiantessCharacterType, isLittleCharacterType } from "../../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { readState } from "../../../../../../scene3d_layer/state/State";
import { getGameTime, getSpecialTime } from "../../../../../../scene3d_layer/script/scene/scene_city/manage/mission/Mission";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getLanguageTextData, languageKey } from "../../../../../../scene3d_layer/internation/Data";
import { getAutoDifficulty } from "../../../../../../scene3d_layer/script/scene/scene_city/difficulty/Difficulty";
import { getAutoDifficultyClassName } from "../../../../../utils/DifficultyUtils";
import { isStartSepcialTime } from "../../../../../../scene3d_layer/script/scene/scene_city/Time";

let LevelStatus: React.FC = () => {
	let levelStatus = useSelector<AppState>((state) => state.scene.levelStatus) as nullable<levelStatus>

	let _getGemTop = () => {
		if (isLittleCharacterType(readState())) {
			return "4.5rem"
		}

		return "6.5rem"
	}

	let _getCoinTop = () => {
		if (isLittleCharacterType(readState())) {
			return "6.5rem"
		}

		return "8.5rem"
	}

	let _getTimeTop = () => {
		if (isLittleCharacterType(readState())) {
			return "2.5rem"
		}

		return "4.5rem"
	}

	let _getGameTimeString = (state) => {
		let value
		if (isStartSepcialTime(state)) {
			value = getSpecialTime(state)
		}
		else {
			value = getGameTime(state)
		}

		let str
		if (value.hours() >= 1) {
			str = `${value.hours()}${getLanguageTextData(state, languageKey.Hour)}`
		}
		else {
			str = ""
		}

		// return `${str}${value.minutes()}分${NumberUtils.greaterThan(value.seconds(), 0)}秒`
		return `${str}${value.minutes()}${getLanguageTextData(state, languageKey.Minute)}${value.seconds()}${getLanguageTextData(state, languageKey.Second)}`
	}

	// let _getHeightTop = () => {
	// 	if (isLittleCharacterType(readState())) {
	// 		return "5rem"
	// 	}

	// 	return "6rem"
	// }


	return <Layout className="level_status-main" >
		{
			NullableUtils.getWithDefault(
				NullableUtils.map(levelStatus => {
					return <Row justify="center" className="row">
						<Col span={6}>
							<Row justify="center" className="row time" style={{
								"top": `${_getTimeTop()}`
							}}>
								<Text className={`${isStartSepcialTime(readState()) ? "time_text_sepecial" : "time_text_normal"}`} >{_getGameTimeString(readState())}</Text>
							</Row>
							<Row justify="center" className="row autodifficulty" style={{
								"top": `${_getTimeTop()}`
							}}>
								{/* <Text className="ad_text" >{`${getLanguageTextData(readState(), languageKey.Difficulty)}:`}</Text> */}
								<Text className="autodifficulty_description" >{`${getLanguageTextData(readState(), languageKey.Difficulty)}:`}</Text>
								<Text className={`autodifficulty_value ${getAutoDifficultyClassName(getAutoDifficulty(readState()))}`} >{getAutoDifficulty(readState()) + 1}</Text>
							</Row>
							<Row justify="center" className="row gem" style={{
								"top": `${_getGemTop()}`
							}}>
								{renderImage("meta3d-jiehuo-abstract/particle/gem.png", "image", false)}
								<Text className="text" >{levelStatus.gem}</Text>
							</Row>
							<Row justify="center" className="row coin" style={{
								"top": `${_getCoinTop()}`
							}}>
								{renderImage("meta3d-jiehuo-abstract/particle/coin.png", "image", false)}
								<Text className="text" >{levelStatus.coin}</Text>
							</Row>
							{
								isGiantessCharacterType(readState()) ?
									<Row justify="center" className="row">
										<Title className="height_title"

										>{levelStatus.height}{getLanguageTextData(readState(), languageKey.Meter)}</Title>
									</Row>
									: null
							}
						</Col>
						<Col span={12}>
							{/* <Title className="task_title">{`破坏率${levelStatus.destroyedRate}%`}</Title> */}
						</Col>
						<Col span={6}>
						</Col>
					</Row>

				}, levelStatus),
				null
			)
		}
	</Layout >
};

export default LevelStatus;