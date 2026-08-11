import "./ErrorHandle.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import Title from "antd/es/typography/Title";
import { AppDispatch, AppState } from "../../../store/AppStore";
import { Mask, Modal } from "antd-mobile";
import { getLanguageTextData, getLanguageTextVariableData, languageKey, languageVariableKey } from "../../../../scene3d_layer/internation/Data";
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../business_layer/State";
import screenfull from "screenfull";
import { stopIndexSounds } from "../../../../business_layer/Sound";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import { getMessage, getStack, handleEventHandler } from "../../../utils/ErrorUtils";
import { removeAll } from "meta3d-jiehuo-abstract/src/storage/Storage";
import * as Backend from "backend/src/Main"
import { exit } from "../../../utils/MissionUtils";
import { renderButton } from "../../../utils/ButtonUtils";
import { stopLoop } from "../../../../scene3d_layer/script/scene/scene_city/Loop";
import { handleNetworkRequest } from "../../../utils/BackendUtils";
import { updateRewardWhenMissionFinish } from "../../../../scene3d_layer/script/scene/scene_city/reward/RewardGenerator";
import { markIsMustStopLoop } from "../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { Camera } from "meta3d-jiehuo-abstract";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { isEnglish } from "../../../../scene3d_layer/script/scene/Scene";
import Text from 'antd/es/typography/Text';
import { getNowClockFormat } from "../../../../scene3d_layer/script/scene/scene_city/Time";
import { getCurrentMMDCharacterName } from "../../../../scene3d_layer/script/scene/scene_city/girl/Girl";
import { usedGirlEnum } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { isNeedUseGiantessProp } from "../../../../scene3d_layer/script/scene/scene_city/User";
import { addPropCount } from "../../../../scene3d_layer/script/scene/scene_city/reward/Prop";
import { getUseGiantessCharacterBlockService } from "../../../../scene3d_layer/mod/PropOtherMod";

let ErrorHandle: React.FC = () => {
	let error = useSelector<AppState>((state) => state.errorHandle.error) as Error

	let dispatch: AppDispatch = useDispatch()

	let _handleMessage = (message) => {
		if (message.includes("network request error")
			|| message.includes("TimeoutError")
			|| message.includes("timed out")
		) {
			return getLanguageTextVariableData(readState(), languageVariableKey.NetworkError)(message)
		}

		if (message.includes("QuotaExceededError")) {
			return getLanguageTextData(readState(), languageKey.QuotaExceededErrorTitle)
		}

		// if (message.includes("Array buffer")) {
		if (message.includes("allocation")) {
			return getLanguageTextVariableData(readState(), languageVariableKey.ArrayBufferAllocationError)(message)
		}

		if (message.includes("precision")) {
			return getLanguageTextVariableData(readState(), languageVariableKey.PrecisionNull)(message)
		}


		return message
	}

	useEffect(() => {
		console.error(error)

		let state = readState()

		if (getMessage(error).includes("QuotaExceededError")
			|| getMessage(error).includes("IndexedDB")
		) {
			let handler = Modal.show({
				getContainer: LandscapeUtils.getRootDom(),
				// bodyClassName: "network_error_handle_modal_body",
				title: getLanguageTextData(state, languageKey.QuotaExceededErrorTitle),
				content: getLanguageTextData(state, languageKey.QuotaExceededErrorContent),
				actions: [
					{
						key: 'clear',
						text: getLanguageTextData(state, languageKey.ClearCacheAndReload),
						primary: true,
					},
				],
				onAction: handleEventHandler(async (action, index) => {
					handler.close()

					return Promise.all(
						[
							Backend.removeAll(),
							removeAll()
						]
					).then(_ => {
						location.reload()
					})
				}),
			})
		}
		else {
			stopIndexSounds(readState()).then(state => {
				state = stopLoop(state)
				state = markIsMustStopLoop(state, true)

				if (Camera.isCanLock(getAbstractState(state))) {
					state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
				}


				writeState(state)

				if (screenfull.isFullscreen) {
					screenfull.exit()
				}
			})
		}
	}, [error]);

	return <Layout className="error-handle-main"  >
		<Mask
			visible={true}
			opacity={0.5}
		>
			<Flex justify="center" align="center">
				<Title className="title">{getLanguageTextData(readState(), languageKey.ErrorHandleTitle)}</Title>

			</Flex>

			<Flex justify="center" align="center">
				{
					renderButton(state => {
						let handler = Modal.show({
							getContainer: LandscapeUtils.getRootDom(),
							title: getLanguageTextData(state, languageKey.SnapshotTitle),
							content: getLanguageTextData(state, languageKey.SnapshotContent),
							actions: [
								{
									key: 'toSnapshot',
									text: getLanguageTextData(state, languageKey.ToSnapshot),
									primary: true,
								},
								{
									key: 'joinGroup',
									text: getLanguageTextData(state, languageKey.JoinGroup),
									primary: false,
								},
								{
									key: 'next',
									text: getLanguageTextData(state, languageKey.Next),
									primary: false,
								},
							],
							onAction: handleEventHandler(async (action, index) => {
								switch (action.key) {
									case "toSnapshot":
										handler.close()
										break
									case "joinGroup":
										handler.close()

										let url
										if (isEnglish()) {
											url = "https://discord.gg/JbhkqUJKFF"
										}
										else {
											url = "http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=QpNrLbhk5TZD8bg_sNalLrAKHVS3qCD2&authKey=ePPMKFJ1H3OXMdRLXJlYKNdyMPoO%2Fh2FWzcxgx5LjtdqZGmKU5i5QbYbAZeZRoz%2F&noverify=0&group_code=892578345"
										}

										globalThis.open(url, "_blank")

										break
									case "next":
										handler.close()

										Modal.confirm({
											content: getLanguageTextData(state, languageKey.RestoreGame),
											confirmText: getLanguageTextData(state, languageKey.Confirm),
											cancelText: getLanguageTextData(state, languageKey.Cancel),
											onConfirm: handleEventHandler(_ => {
												return handleNetworkRequest(state => {
													if (isNeedUseGiantessProp(state, getCurrentMMDCharacterName(state, usedGirlEnum.PlayerGirl))) {
														state = addPropCount(state, getUseGiantessCharacterBlockService(state).getName(), 1)
													}

													return updateRewardWhenMissionFinish(state, true)
														// .then(state => updateCharacterWhenMissionFinish(state, missionFinishStatus.End))
														.then(writeState)
												}, state => {
													location.reload()
													return Promise.resolve(state)
												}, state => {
													location.reload()
													return Promise.resolve(state)
												})
											}),
										})
										break
								}
							}),
						})

						return Promise.resolve(state)
					}, "restore", getLanguageTextData(readState(), languageKey.RestoreGameButton))
				}
				<Text>{getNowClockFormat()}</Text>
			</Flex>


			{/* <Row className="level">
			</Row> */}

			<Row justify="center" className="row">
				<Col className="col" span={24}>
					<Row justify="center" >
						<Row justify="center" className="title_container">
							<Title className="level1" >{_handleMessage(getMessage(error))}</Title>
						</Row>
						<Row justify="center" className="title_container">
							<Title className="level2" >{getStack(error)}</Title>
						</Row>
					</Row>

					{/* <Row className="level">
                </Row> */}
					{/* {
			renderButton(_ =>{

			}, "refresh", )
                } */}

				</Col>
			</Row>
		</Mask>
	</Layout >
};

export default ErrorHandle;