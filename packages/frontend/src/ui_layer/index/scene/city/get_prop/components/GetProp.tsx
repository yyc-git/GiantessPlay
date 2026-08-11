import "./GetProp.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Mask } from "antd-mobile";
import Title from "antd/es/typography/Title";
import { getPropData } from "../../../store/SceneStoreType";
import { renderImage } from "../../../../../utils/ImageUtils";
import { readState } from "../../../../../../scene3d_layer/state/State";
import { getLanguageTextVariableData, languageVariableKey } from "../../../../../../scene3d_layer/internation/Data";

let GetProp: React.FC = () => {
	let getProp = useSelector<AppState>((state) => state.scene.getProp) as getPropData

	return <Layout className="get-prop-main" >
		{
			NullableUtils.getWithDefault(
				NullableUtils.map(getProp => {
					return <Mask
						visible={true}
						opacity={0.3}
						color={"black"}
						stopPropagation={[]}
					>
						<Flex justify="center" align="center">
							<Title className="title"><>
								{renderImage(getProp.imageSrc, "prop_image", false)}
								<span>{getProp.title} {getLanguageTextVariableData(readState(), languageVariableKey.GetPropTitle)(getProp.count)}</span>
							</></Title>
						</Flex>

						<Row justify="center" className="row">
							<Col className="col" span={18}>
								<Title className="level3" >{getProp.description}</Title>
							</Col>
						</Row>
					</Mask>
				}, getProp),
				null
			)
		}
	</Layout >
};

export default GetProp;