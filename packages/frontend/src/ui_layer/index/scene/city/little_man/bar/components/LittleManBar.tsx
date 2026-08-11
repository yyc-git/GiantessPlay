import "./LittleManBar.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import Title from "antd/es/typography/Title";
import { renderImage, renderImage2 } from "../../../../../../utils/ImageUtils";
import { giantessStatus, littleManStatus } from "../../../../store/SceneStoreType";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";

let LittleManBar: React.FC = () => {
	let littleManStatus = useSelector<AppState>((state) => state.scene.littleManStatus) as nullable<littleManStatus>

	return <Layout className="little-man-bar-main">
		{
			NullableUtils.getWithDefault(
				NullableUtils.map(littleManStatus => {
					return <>
						<Row justify="center" className="little-man-hp">
							<Row justify="center" className="row">
								<Col className="col" >
									{
										renderImage("./resource/ui/in_game/bar_background.png",
											"bar_hp_background",
											false
										)
									}

								</Col>
							</Row>
							<Row justify="center" className="row">
								<Col className="col" >
									{
										renderImage2("./resource/ui/in_game/bar_hp.png",
											"bar_hp",
											littleManStatus.hpStyle
										)
									}
								</Col>
							</Row>

							<Row justify="center" className="row row_hp_number">
								<Col className="col" >
									<Title className="hp_number" >{`${littleManStatus.hp}/${littleManStatus.fullHp}`}</Title>
								</Col>
							</Row>


							<Row justify="center" className="row row_life_count">
								<Col className="col" span={12}>
									{
										renderImage("./resource/ui/in_game/life_count.png",
											"life_count",
											false
										)
									}
								</Col>
								<Col className="col" span={12}>
									<Title className="life_count_text" >{`${littleManStatus.lifeCount}`}</Title>
								</Col>
							</Row>

						</Row>
					</>
				}, littleManStatus),
				null
			)
		}
	</Layout >
};

export default LittleManBar;