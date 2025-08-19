import "./Pose.scss"

import React, { useState, useEffect } from 'react';
import { Select, Layout, Button } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { getAbstractState, readState, writeState } from "../../../../../../../business_layer/State";
import * as  CityScene3D from "../../../../../../../business_layer/CityScene3D";
import { AppDispatch, AppState } from "../../../../../../store/AppStore";
import { thirdPersonCameraTarget, pose } from "../../../../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { getCurrentPose } from "../../../../../../../scene3d_layer/script/scene/scene_city/girl/Pose";
import { renderImage } from "../../../../../../utils/ImageUtils";

let Pose: React.FC = () => {
	let _ = useSelector<AppState>((state) => state.scene.operateRandomValue)

	let _render = () => {
		let state = readState()

		let imageSrc
		switch (getCurrentPose(state)) {
			case pose.Stand:
				imageSrc = "./resource/ui/in_game/stand.png"
				break
			case pose.Crawl:
				imageSrc = "./resource/ui/in_game/crawl.png"
				break
			case pose.Pick:
				imageSrc = "./resource/ui/in_game/pick.png"
				break
		}

		return <>
			{
				renderImage(imageSrc, "image", false)
			}
		</>
	}

	return <Layout className="pose">
		{_render()}
	</Layout >
};

export default Pose;