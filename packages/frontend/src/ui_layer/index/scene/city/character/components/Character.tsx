import "./Character.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import Title from "antd/es/typography/Title";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { readState } from "../../../../../../scene3d_layer/state/State";
import { getCurrentMMDCharacterNameByUsedGirl, hasCurrentMMDCharacterByUsedGirl, isUseGirl } from "../../../../../../scene3d_layer/script/scene/scene_city/girl/Girl";
import { usedGirlEnum } from "../../../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { renderImage } from "../../../../../utils/ButtonUtils";
import { getName, getSceneChapter, isLittleCharacterType } from "../../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { isCanSwitchCharacterType, switchCharacterType } from "../../../../../../business_layer/CityScene3D";
import { Device } from "meta3d-jiehuo-abstract";
import { scene } from "../../../../../global/store/GlobalStoreType";
import { characterStatus } from "../../../store/SceneStoreType";
import { getAllBlockServiceFuncWithDefault } from "../../../../../../scene3d_layer/mod/Mod";
import { mmdCharacter, service } from "mmd-character-protocol/src/service/ServiceType";
import { modProtocolName } from "../../../../../../scene3d_layer/mod/data/ModData";
import { Event } from "meta3d-jiehuo-abstract";
import { getAbstractState } from "../../../../../../business_layer/State";
import { getManualUIUpdateEventName } from "../../../../../../scene3d_layer/utils/EventUtils";
import { modelName } from "../../../../../../scene3d_layer/script/scene/scene_city/little_man_data/ModelData";
import { getCurrentModelName } from "../../../../../../scene3d_layer/script/scene/scene_city/little_man/LittleMan";
// import { getSnapshotData, mmdCharacter } from "../../../../../../mod/mmd/json/MMDData";

let Character: React.FC = () => {
	let _getLittleManCharacterImage = (state) => {
		let snapshotData = [
			[
				modelName.Infantry,
				"./resource/ui/not_in_game/little_man/snapshot/Infantry.png",
			],
			[
				modelName.Abe,
				"./resource/ui/not_in_game/little_man/snapshot/Abe.png",
			],
			[
				modelName.Dreyar,
				"./resource/ui/not_in_game/little_man/snapshot/Dreyar.png",
			],
			[
				modelName.Ely,
				"./resource/ui/not_in_game/little_man/snapshot/Ely.png",
			],
			[
				modelName.Maria,
				"./resource/ui/not_in_game/little_man/snapshot/Maria.png",
			],
			[
				modelName.Mousey,
				"./resource/ui/not_in_game/little_man/snapshot/Mousey.png",
			],
			[
				modelName.Mutant,
				"./resource/ui/not_in_game/little_man/snapshot/Mutant.png",
			],
			[
				modelName.Ninja,
				"./resource/ui/not_in_game/little_man/snapshot/Ninja.png",
			],
		]

		return NullableUtils.getExn(snapshotData.find(data => data[0] == getCurrentModelName(state)))[1]
	}

	let _getGiantessCharacterImage = (state) => {
		let currentMMDCharacterNameByUsedGirl = getCurrentMMDCharacterNameByUsedGirl(state, usedGirlEnum.PlayerGirl)

		return NullableUtils.getWithDefault(
			NullableUtils.map(d => d[1],
				getAllBlockServiceFuncWithDefault<service>(state, service => service.getSnapshotData(getName()), modProtocolName.MMDCharacterProtocol, []).find(d => {
					return d[0] == currentMMDCharacterNameByUsedGirl
				})),
			// `./resource/ui/not_in_game/mmd/snapshot/${currentMMDCharacterNameByUsedGirl}.png`
			`./resource/ui/not_in_game/mmd/snapshot/default.png`
		)
	}

	let _getCharacterImage = (state) => {
		if (isLittleCharacterType(state)) {
			return _getGiantessCharacterImage(state)
		}

		return _getLittleManCharacterImage(state)
	}

	let characterStatus = useSelector<AppState>((state) => state.scene.characterStatus) as nullable<characterStatus>

	return <Layout className="character-main">
		{
			NullableUtils.getWithDefault(
				NullableUtils.map((characterStatus) => {
					return characterStatus.isCanSwitchCharacterType ? <>
						<section className="section" >
							{
								renderImage(state => {
									if (isCanSwitchCharacterType(state)) {
										return Promise.resolve(switchCharacterType(state))
									}

									return Promise.resolve(state)
								}, _getCharacterImage(readState()), "snapshot")
							}
							{
								// !Device.isMobile() ? <span className="text" >0</span> : null
								!Device.isMobile() ? <span className="text" >Z</span> : null
							}
						</section>
					</> : null
				}, characterStatus),
				null
			)
		}
	</Layout >
};

export default Character;