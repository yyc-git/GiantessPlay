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
import { getValue, isActionValid, isActionTriggering, getScaleState } from "../../../../../../../scene3d_layer/script/scene/scene_city/girl/Girl";
import { Device } from "meta3d-jiehuo-abstract";
import { getCurrentPose } from "../../../../../../../scene3d_layer/script/scene/scene_city/girl/Pose";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getConfigData } from "../../../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import * as LittleManDataType from "../../../../../../../scene3d_layer/script/scene/scene_city/little_man_data/DataType";
import * as LittleManAction from "../../../../../../../scene3d_layer/script/scene/scene_city/little_man/Action";
import { play } from "../../../../../../../business_layer/Sound";
import { buildNeedToPlaySoundData } from "meta3d-jiehuo-abstract/src/audio/SoundManager";
import { getIsDebug } from "meta3d-jiehuo-abstract/src/state/State";

let Operate: React.FC = () => {
	let _ = useSelector<AppState>((state) => state.scene.operateRandomValue)

	let _triggerDownAction = (state, name) => {
		// switch (name) {
		// 	case LittleManDataType.actionName.Shoot:
		// 	case LittleManDataType.actionName.Swiping:
		// 	case LittleManDataType.actionName.Blink:
		// 		return CityScene3D.triggerLittleManAction(state, name)
		// 	default:
		// 		throw new Error("err")
		// }
		return CityScene3D.triggerLittleManAction(state, name)
	}

	let _triggerUpAction = (state, name) => {
		// switch (name) {
		// 	case LittleManDataType.actionName.Shoot:
		// 	case LittleManDataType.actionName.Swiping:
		// 	case LittleManDataType.actionName.Blink:
		// 		state = CityScene3D.setLittleManActionState(state, littleManActionState.Initial)

		// 		return Promise.resolve(state)
		// 	default:
		// 		throw new Error("err")
		// }
		state = CityScene3D.setLittleManActionState(state, littleManActionState.Initial)

		return Promise.resolve(state)
	}


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

	let _render = () => {
		let state = readState()

		let value = [
			{
				name: LittleManDataType.actionName.Shoot,
				// imageSrc: "./resource/ui/in_game/little_man/shoot.png",
				// imageSrc: "/ui/in_game/little_man/shoot.png",
				imageBase64: "data:image/png;base64,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wBjbYiJlIxeZk/XxV5SqVN0PuJg7AR9xkLnHtghFyTdkx2wYacB3NLUtKAI2cQ9/MBtty1CU/KNKC8Bs5BXbckJnCw+wj7lcH39FyUT1I0Huty0nVDbyCF3N+SaJKx0VxRNSfUK8TKWfbUmhMJsH+Y9ZaVuGouQ3NQ3gmALfJHMTU0gz1syyLURRCgGpuSROZnKAbVE5UM5M0rzBFO3tK4p3ahvAKTxjW5QP1vIu05nGJLPKthRFKTxqG0AJH9HNtixX/sebTGM6H+uuvoqSO1J7Vww5No9Py1nMBNKkzQLbQhSlGJBM2+LIP/iFbWE1WM1bpJlg5toWoijFRGYDaMT7dLUtDYCNTCFNmvdNuW0pilJ8SOaN8aQX0yi1qKucd0kzgSm6eFdRokOy7YwpV3CbFUUfkSbNRLPG3k1RlKSQ3QBKeIaTYlQynwmkmWCW2L4lipIcJPve2FKHBzk7cgXfVYzrz7d9KxQleYjT5vgi3MHFEZW8hkmkSfOR7s+vKLYQt6dPrue6UEvcxFTSpHlPD+ZUFNu4GgDIz7idFoFL2jZbP80Us8F2pRVF2YYHAwBpxR85nzo5lvFxxbj+KtuVVRSlOp4MAED25y4O9ZX3QtKkmWC+tV1JRVEy49kAAORIjuco9nSJtowJTCBtPrddOUVRnPFlABVJunEUR9GdJjSu7Bas4RM+rggLdFxfUQqDHAygWvIGNKExm803tiuiKIp/AhqAoiiFTEnwLBRFKVTUABQlwagBKEqCUQNQlASjBqAoCUYNQFESjBqAoiQYNQBFSTBqAIqSYNQAFCXBqAEoSoJRA1CUBKMGoCgJRg1AURKMGoCiJBg1AEVJMGoAipJg1AAUJcGoAShKglEDUJQEowagKAlGDUBREowagKIkGDUARUkwagCKkmDUABQlwagBKEqCUQNQlASjBqAoCUYNQFESjBqAoiQYNQBFSTBqAIqSYNQAFCXBqAEoSoJRA1CUBKMGoCgJ5v8BhdwZMLAe2eQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDEtMDlUMDM6Mjk6MjErMDg6MDDm3klqAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAxLTA5VDAzOjI5OjIxKzA4OjAwl4Px1gAAAEN0RVh0c29mdHdhcmUAL3Vzci9sb2NhbC9pbWFnZW1hZ2ljay9zaGFyZS9kb2MvSW1hZ2VNYWdpY2stNy8vaW5kZXguaHRtbL21eQoAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADUxMo+NU4EAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTEyHHwD3AAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTQ2OTc1NzYxWvuEGQAAABJ0RVh0VGh1bWI6OlNpemUAMTE5OTZC1cAoCgAAAGJ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvd3d3cm9vdC9uZXdzaXRlL3d3dy5lYXN5aWNvbi5uZXQvY2RuLWltZy5lYXN5aWNvbi5jbi9maWxlcy8xMTYvMTE2OTU3Ny5wbmetePWQAAAAAElFTkSuQmCC",
				key: "鼠标左",

				bottom: "1rem",
				right: "1rem",

				textWidth: "4rem",
			},
			{
				name: LittleManDataType.actionName.Swiping,
				imageBase64: "data:image/png;base64,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",
				key: "鼠标右",

				bottom: "1rem",
				right: "6rem",

				textWidth: "4rem",
			},
			{
				name: LittleManDataType.actionName.Blink,
				imageBase64: "data:image/png;base64,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",

				key: "F",

				bottom: "1rem",
				right: "11rem",

				textWidth: "4rem",
			}
		]

		return <>
			{
				value.map((value, index) => {
					let downHandler = state => {
						return _triggerDownAction(state, value.name)
					}
					let upHandler = state => {
						return _triggerUpAction(state, value.name)
					}

					return <section key={index} className="button" style={{
						"bottom": `${value.bottom}`,
						"right": `${value.right}`
					}}

						onMouseDown={event => {
							event.preventDefault()
							if (isMobile()) {
								return
							}

							downHandler(readState()).then(state => {
								// NullableUtils.forEach(soundId => {
								// 	play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
								// }, soundId)

								writeState(state)
							})
						}}
						onMouseUp={event => {
							event.preventDefault()
							if (isMobile()) {
								return
							}

							upHandler(readState()).then(state => {
								// NullableUtils.forEach(soundId => {
								// 	play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
								// }, soundId)

								writeState(state)
							})
						}}

						onTouchStart={event => {
							event.preventDefault()
							downHandler(readState()).then(state => {
								// NullableUtils.forEach(soundId => {
								// 	play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
								// }, soundId)

								writeState(state)

								// event.preventDefault()
								// event.stopPropagation()
							})
						}}
						onTouchEnd={event => {
							event.preventDefault()

							upHandler(readState()).then(state => {
								// NullableUtils.forEach(soundId => {
								// 	play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
								// }, soundId)

								writeState(state)

								// event.preventDefault()
								// event.stopPropagation()
							})
						}}
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