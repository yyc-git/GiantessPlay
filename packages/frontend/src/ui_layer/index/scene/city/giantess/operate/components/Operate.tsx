import "./Operate.scss"

import React, { useState, useEffect } from 'react';
import { Select, Layout, Button } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { getAbstractState, readState, writeState } from "../../../../../../../business_layer/State";
import * as  CityScene3D from "../../../../../../../business_layer/CityScene3D";
import { AppDispatch, AppState } from "../../../../../../store/AppStore";
import { setPage } from "../../../../../../global/store/GlobalStore";
import { page } from "../../../../../../global/store/GlobalStoreType";
import { stop } from "../../../../../../../business_layer/Scene3D";
import { getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { isMobile } from "../../../../../../../business_layer/Device";
import { thirdPersonCameraTarget, littleManActionState, pose } from "../../../../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { renderButton, renderImage, renderImage2 } from "../../../../../../utils/ButtonUtils";
import { actionName, animationName } from "../../../../../../../scene3d_layer/script/scene/scene_city/data/DataType";
import { getValue, isActionValid, isActionTriggering, getScaleState } from "../../../../../../../scene3d_layer/script/scene/scene_city/girl/Girl";
import { Device } from "meta3d-jiehuo-abstract";
import { getCurrentPose } from "../../../../../../../scene3d_layer/script/scene/scene_city/girl/Pose";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getConfigData, isGiantessRoad } from "../../../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { isEnter } from "../../../../../../../scene3d_layer/script/scene/scene_city/scenario/ScenarioManager";

let Operate: React.FC = () => {
	let _ = useSelector<AppState>((state) => state.scene.operateRandomValue)

	let _triggerAction = (state, name) => {
		return CityScene3D.triggerAction(state, name, true)
	}

	let _renderMask = (state, value) => {
		let isActionTriggeringFunc, isActionValidFunc
		isActionTriggeringFunc = isActionTriggering
		isActionValidFunc = isActionValid

		return isActionTriggeringFunc(state, value.name) ?
			<div className="using-mask"></div> : !isActionValidFunc(state, value.name, true) ?
				<div className="unusable-mask"></div> : null
	}

	let _render = () => {
		let state = readState()

		// if (isEnter(state)) {
		// 	return null
		// }

		let value = getConfigData(state).operateRenderData.filter(value => {
			return value.pose == getCurrentPose(state) && value.scaleState == getScaleState(state)
		})[0].value


		return <>
			{
				value.map((value, index) => {
					return <section key={index} className="button" style={{
						"bottom": `${value.bottom}`,
						"right": `${value.right}`
					}}>
						{
							renderImage(state => {
								return _triggerAction(state, value.name)
							}, value.imageSrc, "image")
						}
						{
							!Device.isMobile() ? <span className="text"
								style={
									NullableUtils.getWithDefault(
										NullableUtils.map(
											textWidth => {
												return {
													"width": `${textWidth}`
												}
											},
											value.textWidth
										), {} as any)
								}
							>{value.key}</span> : null
						}
						{
							_renderMask(state, value)
						}

					</section >
				})
			}

		</>
	}

	return <Layout className="operate">
		{_render()}
	</Layout >
};

export default Operate;