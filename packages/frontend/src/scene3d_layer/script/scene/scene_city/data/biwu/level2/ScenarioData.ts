import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getSay1SoundResourceId, getSay2SoundResourceId, getSay31SoundResourceId, getSay32SoundResourceId, getSay33SoundResourceId, getSayHardSoundResourceId, getSayPutdownHardSoundResourceId, getSayPutdownNormalSoundResourceId } from "../../../manage/biwu/level2/ManageScene"
import { data } from "../../ScenarioData"
import { animationName } from "./DataType"
import { getCenterPosition } from "./Utils"
import { getLanguageTextData, languageKey } from "../../../../../../internation/Data"
import { readState } from "../../../../../../state/State"

export enum command {
	walkToTargetPosition,
	pickdownArmy,
	wait,
	lookat,

	bigger,


	enterScenario,
	moveCamera,
	playGirlAnimation,
	say,
	realtimeSay,
	exitScenario,
	markBegin,
	markFinish
}

export enum scenarioName {
	Begin = "Begin",
	Stressing = "Stressing",
	Hard = "Hard",
	PickdownArmy_Normal = "PickdownArmy_Normal",
	PickdownArmy_Hard = "PickdownArmy_Hard",
}

let _getRandomPosition = () => {
	return [
		NumberUtils.getRandomInteger(
			-170, -30
		),
		0,
		// NumberUtils.getRandomInteger(
		// 	// 30, 55
		// 	30, 55
		// ),
		60
	]
}

export let getData = (girlName): data<scenarioName, command> => {
	return {
		[scenarioName.Begin]: [
			{
				command: command.enterScenario,
			},
			// {
			// 	command: command.moveCamera,
			// 	data: [
			// 		{
			// 			time: 0,
			// 			position: [-150, 1, 55],
			// 			target: [-180, 0, 48],
			// 		},
			// 	],
			// },
			{
				command: command.moveCamera,
				data: [
					{
						time: 0,
						position: [-150, 0, 55],
						target: [-180, 0, 48],
					},
					{
						time: 1000,
						position: [-150, 0, 55],
						target: [-180, 40, 48],
					},
				],
				isWaitToComplete: true,
			},
			{
				command: command.bigger,
				data: {
					scale: 100
				},
				isWaitToComplete: true,
			},
			{
				command: command.moveCamera,
				data: [
					{
						time: 0,
						position: [-150, 0, 55],
						target: [-180, 100, 48],
					},
				],
				// isWaitToComplete: true,
			},
			{
				command: command.playGirlAnimation,
				data: {
					name: animationName.Excitement,
				}
			},
			{
				command: command.say,
				data: {
					name: girlName,
					contents: [{
						content: getLanguageTextData(readState(), languageKey.BossLevel2BeginSay1),
						soundId: getSay1SoundResourceId()
					}],
					time: 1000,
				},
				isWaitToComplete: true,
			},
			{
				command: command.say,
				data: {
					name: girlName,
					contents: [{
						content: getLanguageTextData(readState(), languageKey.BossLevel2BeginSay2),
						soundId: getSay2SoundResourceId()
					}],
					time: 1000,
				},
				isWaitToComplete: true,
			},
			{
				command: command.exitScenario,
			},
		],
		[scenarioName.PickdownArmy_Normal]: [
			{
				command: command.markBegin,
			},
			{
				command: command.walkToTargetPosition,
				data: {
					getTargetPositionFunc: state => _getRandomPosition(),
				},
				isWaitToComplete: true,
			},
			{
				command: command.lookat,
				data: {
					getTargetPositionFunc: state => getCenterPosition()
				}
			},
			{
				command: command.pickdownArmy,
				data: {
					getIndexFunc: state => NumberUtils.getRandomInteger(1, 3)
				},
				isWaitToComplete: true,
			},
			{
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: getLanguageTextData(readState(), languageKey.BossLevel2PickdownArmyNormalSay1),
						soundId: getSayPutdownNormalSoundResourceId()
					}],
					time: 1500,
					isInMiddle: true,
				},
			},
			{
				command: command.markFinish,
				data: scenarioName.PickdownArmy_Normal
			},
		],
		[scenarioName.PickdownArmy_Hard]: [
			{
				command: command.markBegin,
			},
			{
				command: command.walkToTargetPosition,
				data: {
					getTargetPositionFunc: state => _getRandomPosition(),
				},
				isWaitToComplete: true,
			},
			{
				command: command.lookat,
				data: {
					getTargetPositionFunc: state => getCenterPosition()
				}
			},
			{
				command: command.pickdownArmy,
				data: {
					getIndexFunc: state => NumberUtils.getRandomInteger(4, 8)
				},
				isWaitToComplete: true,
			},
			{
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: getLanguageTextData(readState(), languageKey.BossLevel2PickdownArmyHardSay1),
						soundId: getSayPutdownHardSoundResourceId()
					}],
					time: 1500,
					isInMiddle: true,
				},
			},
			{
				command: command.markFinish,
				data: scenarioName.PickdownArmy_Hard
			},
		],

		[scenarioName.Hard]: [
			{
				command: command.markBegin,
			},
			{
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [
						{
							content: getLanguageTextData(readState(), languageKey.BossLevel2HardSay1),
							soundId: getSayHardSoundResourceId()
						},
					],
					time: 2000,
					isInMiddle: true,
				},
			},
			{
				command: command.wait,
				data: 3000,
				isWaitToComplete: true,
			},
			{
				command: command.markFinish,
				data: scenarioName.Hard
			},
		],

		[scenarioName.Stressing]: [
			{
				command: command.markBegin,
			},
			{
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [
						{
							content: getLanguageTextData(readState(), languageKey.BossLevel2StressingSay1),
							soundId: getSay31SoundResourceId()
						},
						{
							content: getLanguageTextData(readState(), languageKey.BossLevel2StressingSay2),
							soundId: getSay32SoundResourceId()
						},
						{
							content: getLanguageTextData(readState(), languageKey.BossLevel2StressingSay3),
							soundId: getSay33SoundResourceId()
						},
					],
					time: 2000,
					isInMiddle: true,
				},
				// isWaitToComplete: true,
			},
			{
				command: command.markFinish,
			},
		],
	}
}