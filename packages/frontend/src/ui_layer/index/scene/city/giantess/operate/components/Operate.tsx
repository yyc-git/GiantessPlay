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
import { thirdPersonCameraTarget, littleManActionState, pose, usedGirlEnum } from "../../../../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { renderButton, renderImage, renderImage2 } from "../../../../../../utils/ButtonUtils";
import { actionName, animationName } from "../../../../../../../scene3d_layer/script/scene/scene_city/data/DataType";
import { getValue, isActionTriggering, isUseGirl } from "../../../../../../../scene3d_layer/script/scene/scene_city/girl/Girl";
import { Device } from "meta3d-jiehuo-abstract";
import { getCurrentPose } from "../../../../../../../scene3d_layer/script/scene/scene_city/girl/Pose";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getConfigData, getConfigOperateRenderData, isGiantessCharacterType } from "../../../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { isEnter } from "../../../../../../../scene3d_layer/script/scene/scene_city/scenario/ScenarioManager";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { Object3DUtils } from "meta3d-jiehuo-abstract";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { singleOperateData } from "../../../../../../../scene3d_layer/script/scene/scene_city/data/PoseData";
import { getCurrentStudyActionNames, getCurrentStudyActions, isActionValid } from "../../../../../../../scene3d_layer/script/scene/scene_city/girl/player/Girl";
import { handleEventHandler } from "../../../../../../utils/ErrorUtils";
import { getIsStartDrag, getSavedOperatePosition, saveOperatePosition, setSavedOperatePosition } from "../../../../../../../scene3d_layer/script/scene/scene_city/Operate";
import { Scene } from "meta3d-jiehuo-abstract";
import { buildSectionStyle, filterOperateData, onTouchEnd, onTouchMove, onTouchStart } from "../../../../../../utils/OperateUtils";

let Operate: React.FC = () => {
	let _ = useSelector<AppState>((state) => state.scene.operateRandomValue)

	let [startX, setStartX] = useState(0)
	let [startY, setStartY] = useState(0)
	// let [x, setX] = useState(0)
	// let [y, setY] = useState(0)
	let [right, setRight] = useState(0)
	let [bottom, setBottom] = useState(0)
	// let [left, setLeft] = useState(0)
	// let [top, setTop] = useState(0)

	let _triggerAction = (state, usedGirl, name) => {
		return CityScene3D.triggerAction(state, usedGirl, name)
	}

	let _renderMask = (state, usedGirl, value) => {
		let isActionTriggeringFunc, isActionValidFunc
		isActionTriggeringFunc = isActionTriggering
		isActionValidFunc = isActionValid

		return isActionTriggeringFunc(state, usedGirl, value.name) ?
			<div className="using-mask" ></div> : !isActionValidFunc(state, usedGirl, value.name) ?
				<div className="unusable-mask" ></div> : null
	}

	let _getSectionDom = (event) => {
		return event.target.parentElement
	}

	let _render = () => {
		let state = readState()

		let usedGirl = usedGirlEnum.PlayerGirl

		if (!isUseGirl(state, usedGirl)) {
			return null
		}

		let currentStudyActionNames = getCurrentStudyActionNames(state)
		let currentStudyActions = getCurrentStudyActions(state)



		let d1 = ArrayUtils.flatten(getConfigOperateRenderData(state).poseData.filter(value => {
			return value.pose == getCurrentPose(state, usedGirl)
			// && value.scaleState == getScaleState(state)
		}).map(v => {
			return v.names
		})).filter(name => {
			return currentStudyActionNames.includes(name)
		})

		// let d2 = getConfigOperateRenderData(state).operateData.filter(d => {
		// 	return d1.includes(d.name)
		// }).map(d => {
		// 	return [
		// 		d,
		// 		NullableUtils.getExn(currentStudyActions.find(a => {
		// 			return a.name == d.name
		// 		})).time
		// 	]
		// })
		let d2 = filterOperateData(state, usedGirl, getConfigOperateRenderData(state).operateData, d1, currentStudyActions)

		let d3 = MutableRecordUtils.values<Array<singleOperateData>>(
			MutableRecordUtils.map(Object3DUtils.group(
				d2,
				d => d[0].rowIndex
			), (arr) => {
				return arr.sort((a, b) => {
					return a[1] - b[1]
				}).map(d => d[0])
			}))

		return <>
			{
				d3.map(d => {
					return d.map((value, index) => {
						// let bottom = value.rowIndex == 1 ? "1rem" : "6rem"
						// let bottom = value.rowIndex == 1 ? 1 : 6

						return <section key={index} className="button" style={buildSectionStyle(state, value, index, 0.5)}

							onTouchStart={
								handleEventHandler(event => {
									return onTouchStart(event, [
										_getSectionDom,
										setStartX,
										setStartY,
										setRight,
										setBottom,
										// setX,
										// setY
									])
								})
							}
							onTouchMove={
								handleEventHandler(event => {
									return onTouchMove(event, [
										_getSectionDom,
										// setLeft,
										// setTop,
									], startX, startY,
										// bottom, index
										right, bottom
									)
								})
							}
							onTouchEnd={
								handleEventHandler(event => {
									return onTouchEnd(
										event, _getSectionDom,
										// left, top,
										// right, bottom,
										value)
								})
							}
						>
							{

								renderImage(state => {
									let usedGirl = usedGirlEnum.PlayerGirl

									return _triggerAction(state, usedGirl, value.name)
								}, value.imageSrc, "image", false, null)
							}
							{
								!Device.isMobileByState(getAbstractState(state)) ? <span className="text"
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
								_renderMask(state, usedGirl, value)
							}

						</section >

					})
				})
			}

		</>
	}

	return <Layout className="operate">
		{_render()}
	</Layout >
};

export default Operate;