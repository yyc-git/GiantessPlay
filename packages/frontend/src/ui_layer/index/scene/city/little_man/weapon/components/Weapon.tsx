import "./Weapon.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../../store/AppStore";
import Title from "antd/es/typography/Title";
import { renderImage, renderImage2 } from "../../../../../../utils/ImageUtils";
import { readState } from "../../../../../../../scene3d_layer/state/State";
import { isLittleCharacterType } from "../../../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { getCurrentBulletCount, getCurrentGunName, getGunImageSrc } from "../../../../../../../scene3d_layer/script/scene/scene_city/little_man/Gun";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getLanguageTextData, languageKey } from "../../../../../../../scene3d_layer/internation/Data";

let Weapon: React.FC = () => {
	let _ = useSelector<AppState>((state) => state.scene.operateRandomValue)

	let _render = () => {
		let state = readState()

		if (!isLittleCharacterType(state)) {
			return null
		}

		return NullableUtils.getWithDefault(
			NullableUtils.map(bulletCount => {
				let imageSrc = getGunImageSrc(state)

				let bulletCountStr
				if (isFinite(bulletCount)) {
					bulletCountStr = String(bulletCount)
				}
				else {
					bulletCountStr = getLanguageTextData(state, languageKey.Infinity)
				}


				return <>
					<Title className="bullet-count" >
						{bulletCountStr}
					</Title>
					{
						renderImage(imageSrc, "image", false)
					}
				</>
			}, getCurrentBulletCount(state)),
			null
		)
	}

	return <Layout className="weapon-main">
		{_render()}
	</Layout >

};

export default Weapon;