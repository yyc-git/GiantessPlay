import "./BossSkillBar.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import Title from "antd/es/typography/Title";
import { renderImage, renderImage2 } from "../../../../../utils/ImageUtils";
import { skillStatus } from "../../../store/SceneStoreType";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { isPlayerGirl, isUseGirl } from "../../../../../../scene3d_layer/script/scene/scene_city/girl/Girl";
import { readState } from "../../../../../../business_layer/State";

let BossSkillBar: React.FC = () => {
	let skillStatus = useSelector<AppState>((state) => state.scene.bossSkillStatus) as nullable<skillStatus>

	return <Layout className="boss-skill-bar-main">
		{
			NullableUtils.getWithDefault(
				NullableUtils.map(skillStatus => {
					// if (isPlayerGirl(readState())) {
					// 	return null
					// }

					return <>
						<section className="skill">
							<Row justify="center" className="row">
								<Col className="col" >
									{
										renderImage("./resource/ui/in_game/bar_skill_background.png",
											"bar_skill_background",
											false
										)
									}

								</Col>
							</Row>
							<Row justify="center" className="row">
								<Col className="col" >
									{
										renderImage2("./resource/ui/in_game/bar_skill.png",
											"bar_skill",
											skillStatus.skillStyle
										)
									}
								</Col>
							</Row>
							{/* 
							<Row justify="center" className="row row_skill_number">
								<Col className="col" >
									<Title className="skill_number" >{`${skillStatus.value}/${skillStatus.fullValue}`}</Title>
								</Col>
							</Row> */}

						</section>
					</>
				}, skillStatus),
				null
			)
		}
	</Layout >
};

export default BossSkillBar;