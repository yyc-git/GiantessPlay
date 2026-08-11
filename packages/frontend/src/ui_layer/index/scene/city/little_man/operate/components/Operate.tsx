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
import { renderBackgroundImage, renderButton, renderImage, renderImage2 } from "../../../../../../utils/ButtonUtils";
import { actionName, animationName } from "../../../../../../../scene3d_layer/script/scene/scene_city/data/DataType";
import { Device } from "meta3d-jiehuo-abstract";
import { getCurrentPose } from "../../../../../../../scene3d_layer/script/scene/scene_city/girl/Pose";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getConfigData, isLittleCharacterType } from "../../../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import * as LittleManDataType from "../../../../../../../scene3d_layer/script/scene/scene_city/little_man_data/DataType";
import * as LittleManAction from "../../../../../../../scene3d_layer/script/scene/scene_city/little_man/Action";
import { play } from "../../../../../../../business_layer/Sound";
import { buildNeedToPlaySoundData } from "meta3d-jiehuo-abstract/src/audio/SoundManager";
import { getIsDebug } from "meta3d-jiehuo-abstract/src/state/State";
import { getCurrentStudyActionNames, getCurrentStudyActions, isBurstFire } from "../../../../../../../scene3d_layer/script/scene/scene_city/little_man/LittleMan";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { littleManOperateData } from "../../../../../../../scene3d_layer/script/scene/scene_city/little_man_data/OperateData";
import { Object3DUtils } from "meta3d-jiehuo-abstract";
import { handleEndShoot, handleStartShoot } from "../../../../../../../scene3d_layer/script/scene/scene_city/little_man/Shoot";
import { singleOperateData } from "../../../../../../../scene3d_layer/script/scene/scene_city/data/PoseData";
import { serialize } from "../../../../../../../scene3d_layer/utils/LogUtils";
import { handleEventHandler } from "../../../../../../utils/ErrorUtils";
import { getFastRunBlockService, getSwipBlockService } from "../../../../../../../scene3d_layer/mod/SkillLittleManMod";
import { getIsStartDrag, getSavedOperatePosition, saveOperatePosition, setSavedOperatePosition } from "../../../../../../../scene3d_layer/script/scene/scene_city/Operate";
import { Scene } from "meta3d-jiehuo-abstract";
import { buildSectionStyle, filterOperateData, onTouchEnd, onTouchMove, onTouchStart, triggerDownActionForBurstFire, triggerDownActionForContinueFire, triggerUpActionForBurstFire, triggerUpActionForContinueFire } from "../../../../../../utils/OperateUtils";

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


	let _renderMask = (state, value) => {
		if (LittleManAction.isActionTriggering(state, value.name)) {
			return <div className="using-mask"></div>
		}

		if (!LittleManAction.isActionValid(state, value.name)) {
			return <div className="unusable-mask"></div>
		}

		let remainCoolingTime = LittleManAction.getRemainCoolingTime(state, value.name)

		if (remainCoolingTime > 0) {
			return <div className="cooling-mask">{
				Math.round(remainCoolingTime / 1000)
			}</div>
		}

		return null
	}

	let _getSectionDom = (event) => {
		// return event.target.parentElement
		return event.target
	}


	let _render = () => {
		let state = readState()

		if (!isLittleCharacterType(state)) {
			return null
		}


		let currentStudyActionNames = getCurrentStudyActionNames(state)
		let currentStudyActions = getCurrentStudyActions(state)

		// console.log("render: ", currentStudyActionNames, getConfigData(state).littleManOperateRenderData);


		// if (!currentStudyActionNames.includes(LittleManDataType.actionName.Shoot) || NullableUtils.isNullable(getConfigData(state).littleManOperateRenderData.find(d => d.name == LittleManDataType.actionName.Shoot))) {
		// 	throw new Error(`not find Shoot action! currentStudyActionNames are ${serialize(currentStudyActionNames)}, littleManOperateRenderData are ${serialize(getConfigData(state).littleManOperateRenderData)}`)
		// }


		// let d2 = getConfigData(state).littleManOperateRenderData.filter(d => {
		// 	return currentStudyActionNames.includes(d.name)
		// }).map(d => {
		// 	return [
		// 		d,
		// 		NullableUtils.getExn(currentStudyActions.find(a => {
		// 			return a.name == d.name
		// 		})).time
		// 	]
		// })
		let d2 = filterOperateData(state, NullableUtils.getEmpty(), getConfigData(state).littleManOperateRenderData, currentStudyActionNames, currentStudyActions)

		let d3 = MutableRecordUtils.values<littleManOperateData>(
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
						// let bottom = value.rowIndex == 1 ? "2rem" : "7rem"

						let downHandler = (state, isBurstFire) => {
							if (isBurstFire) {
								return triggerDownActionForBurstFire(state, value.name)
							}
							return triggerDownActionForContinueFire(state, value.name)
						}
						let upHandler = (state, isBurstFire) => {
							if (isBurstFire) {
								return triggerUpActionForBurstFire(state, value.name)
							}
							return triggerUpActionForContinueFire(state, value.name)
						}


						return <section key={index} className="button" style={buildSectionStyle(state, value, index, 2)}

							onMouseDown={handleEventHandler(event => {
								event.preventDefault()
								if (isMobile()) {
									return
								}

								downHandler(readState(), isBurstFire(readState())).then(state => {
									// NullableUtils.forEach(soundId => {
									// 	play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
									// }, soundId)

									writeState(state)
								})
							})}
							onMouseUp={handleEventHandler(event => {
								event.preventDefault()
								if (isMobile()) {
									return
								}

								upHandler(readState(), isBurstFire(readState())).then(state => {
									// NullableUtils.forEach(soundId => {
									// 	play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
									// }, soundId)

									writeState(state)
								})
							})}

							onTouchStart={handleEventHandler(event => {
								// event.preventDefault()
								downHandler(readState(), isBurstFire(readState())).then(state => {
									// NullableUtils.forEach(soundId => {
									// 	play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
									// }, soundId)

									writeState(state)

									// event.preventDefault()
									// event.stopPropagation()

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
								// .then(_ => {
								// 	event.preventDefault()
								// })
							})}
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
							onTouchEnd={handleEventHandler(event => {
								// event.preventDefault()

								upHandler(readState(), isBurstFire(readState())).then(state => {
									// NullableUtils.forEach(soundId => {
									// 	play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
									// }, soundId)

									writeState(state)

									// event.preventDefault()
									// event.stopPropagation()

									return onTouchEnd(
										event, _getSectionDom,
										// left, top,
										// right, bottom,
										value)
								})
								// .then(_ => {
								// 	event.preventDefault()
								// })
							})}
						>
							{
								renderBackgroundImage(
									// 	state => {
									// 	return _triggerDownAction(state, value.name)
									// },
									// 	state => {
									// 		return _triggerUpAction(state, value.name)
									// 	},
									value.imageBase64, "image")
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
								_renderMask(state, value)
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