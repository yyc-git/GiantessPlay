import "./GiantessBar.scss"

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
import { isCloth } from "../../../../../../../scene3d_layer/script/scene/scene_city/girl/Cloth";

let GiantessBar: React.FC = () => {
	let giantessStatus = useSelector<AppState>((state) => state.scene.giantessStatus) as nullable<giantessStatus>

	let _getHpBarImageSrc = (giantessStatus) => {
		return isCloth(giantessStatus.target) ? "./resource/ui/in_game/bar_cloth.png" : "./resource/ui/in_game/bar_hp.png"
	}

	return <Layout className="bar-main">
		{

			NullableUtils.getWithDefault(
				NullableUtils.map(giantessStatus => {
					return <>
						<section className="giantess-hp">
							<Row justify="center" className="row">
								<Col className="col" >
									<Title className="title">{`巨大娘->${giantessStatus.target}`}</Title>
								</Col>
							</Row>
							<Row justify="center" className="row hp_background_row">
								<Col className="col" >
									{

										renderImage("./resource/ui/in_game/bar_background.png",
											"bar_hp_background",
											false
										)
									}

								</Col>
							</Row>
							<Row justify="center" className="row hp_row">
								<Col className="col" >
									{
										renderImage2(_getHpBarImageSrc(giantessStatus),
											"bar_hp",
											giantessStatus.hpStyle
										)
									}
								</Col>
							</Row>

							<Row justify="center" className="row row_hp_number">
								<Col className="col" >
									<Title className="hp_number" >{`${giantessStatus.hp}/${giantessStatus.fullHp}`}</Title>
								</Col>
							</Row>

						</section>
					</>
				}, giantessStatus),
				null
			)
		}
	</Layout >
};

export default GiantessBar;