import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { getLanguageTextData, languageKey } from "../../../../internation/Data"
import { readState } from "../../../../state/State"
import { getSay1SoundResourceId } from "../manage/city1/ManageScene"
import { animationName } from "./DataType"
import { getAllScenarioData } from "../../../../mod/EventGameMod"
import { state } from "../../../../type/StateType"

export enum command {
	enterScenario,

	markBegin,
	markFinish,

	// blackScreen,
	moveCamera,

	appearWildGiantess,
	appeareEnemyGiantess,
	// appearPlayerGoddess,
	// appearPlayerGoddess,

	enemyReinforceReach,
	enemyFireSupport,

	// hard,

	// enemyAddRandomBuff,

	// walkToPosition,
	// stop,
	// playGirlAnimation,
	// // showGirlAndActiveAllActions,
	// initGirl,

	// say,

	realtimeSay,

	exitScenario,
}

export type command_ = command | string

// enum characterName {
// 	girl = "巨大女孩"
// }

export type singleData<command> = {
	command: command,
	data?: Object | Array<any>,
	isWaitToComplete?: boolean,
}

export enum scenarioName {
	// EnterCity = "EnterCity",
	WildGiantessAppear = "WildGiantessAppear",
	EnemyGiantessAppear = "EnemyGiantessAppear",
	// CallGiantess = "CallGiantess",
	// CallGoddess = "CallGoddess",

	EnemyReinforceReach = "EnemyReinforceReach",
	EnemyFireSupport = "EnemyFireSupport",

	// EnemyAddRandomBuff = "EnemyAddRandomBuff",

	// Hard = "Hard",
}

export type data<scenarioName extends string, command> = Record<scenarioName, Array<singleData<command>>>

// export let getData = (girlName): data<scenarioName, command> => {
export let getData = (state: state): data<scenarioName, command_> => {
	return MutableRecordUtils.concat({
		[scenarioName.WildGiantessAppear]: [
			{
				command: command.markBegin,
			},
			// {
			// 	command: command.moveCamera,
			// 	data: [
			// 		{
			// 			time: 0,
			// 			position: [-130, 40, 66],
			// 			target: [-200, 50, 66],
			// 		},
			// 	],
			// },
			{
				command: command.appearWildGiantess,
			},
			{
				command: command.realtimeSay,
				data: {
					name: getLanguageTextData(readState(), languageKey.AppearWildGiantessName),
					contents: [
						{
							content: getLanguageTextData(readState(), languageKey.AppearWildGiantessSay1),
							// TODO
							// soundId: getSayReachSoundResourceId()
						},
						{
							content: getLanguageTextData(readState(), languageKey.AppearWildGiantessSay2),
							// TODO
							// soundId: getSayReachSoundResourceId()
						},
					],
					time: 1000,
				},
				// isWaitToComplete: true,
			},
			{
				command: command.markFinish,
			},
		],
		[scenarioName.EnemyGiantessAppear]: [
			{
				command: command.markBegin,
			},
			// {
			// 	command: command.moveCamera,
			// 	data: [
			// 		{
			// 			time: 0,
			// 			position: [-130, 40, 66],
			// 			target: [-200, 50, 66],
			// 		},
			// 	],
			// },
			{
				command: command.appeareEnemyGiantess,
			},
			{
				command: command.realtimeSay,
				data: {
					name: getLanguageTextData(readState(), languageKey.AppearEnemyGiantessName),
					contents: [
						{
							content: getLanguageTextData(readState(), languageKey.AppearEnemyGiantessSay1),
							// TODO
							// soundId: getSayReachSoundResourceId()
						},
					],
					time: 1000,
				},
				// isWaitToComplete: true,
			},
			{
				command: command.markFinish,
			},
		],
		// [scenarioName.CallGiantess]: [
		// 	{
		// 		command: command.markBegin,
		// 	},
		// 	// {
		// 	// 	command: command.moveCamera,
		// 	// 	data: [
		// 	// 		{
		// 	// 			time: 0,
		// 	// 			position: [-130, 40, 66],
		// 	// 			target: [-200, 50, 66],
		// 	// 		},
		// 	// 	],
		// 	// },
		// 	{
		// 		command: command.appearPlayerGoddess,
		// 	},
		// 	{
		// 		command: command.realtimeSay,
		// 		data: {
		// 			name: getLanguageTextData(readState(), languageKey.AppearPlayerGoddessName),
		// 			contents: [
		// 				{
		// 					content: getLanguageTextData(readState(), languageKey.AppearPlayerGoddessSay1),
		// 					// TODO
		// 					// soundId: getSayReachSoundResourceId()
		// 				},
		// 			],
		// 			time: 1000,
		// 		},
		// 		// isWaitToComplete: true,
		// 	},
		// 	{
		// 		command: command.markFinish,
		// 	},
		// ],

		[scenarioName.EnemyReinforceReach]: [
			{
				command: command.markBegin,
			},
			{
				command: command.enemyReinforceReach,
			},
			{
				command: command.markFinish,
			},
		],

		[scenarioName.EnemyFireSupport]: [
			{
				command: command.markBegin,
			},
			{
				command: command.enemyFireSupport,
			},
			{
				command: command.markFinish,
			},
		],

		// [scenarioName.Hard]: [
		// 	{
		// 		command: command.markBegin,
		// 	},
		// 	{
		// 		command: command.realtimeSay,
		// 		data: {
		// 			name: getLanguageTextData(readState(), languageKey.LevelGiantessHardName),
		// 			contents: [
		// 				{
		// 					content: getLanguageTextData(readState(), languageKey.LevelGiantessHardSay1),
		// 					// soundId: getSayHardSoundResourceId()
		// 				},
		// 			],
		// 			time: 2000,
		// 			isInMiddle: true,
		// 		},
		// 	},
		// 	{
		// 		command: command.hard,
		// 	},
		// 	{
		// 		command: command.markFinish,
		// 		data: scenarioName.Hard
		// 	},
		// ],


		// [scenarioName.EnemyAddRandomBuff]: [
		// 	{
		// 		command: command.markBegin,
		// 	},
		// 	{
		// 		command: command.enemyAddRandomBuff,
		// 	},
		// 	{
		// 		command: command.markFinish,
		// 	},
		// ],

		// [scenarioName.EnterCity]: [
		// 	// {
		// 	// 	command: command.blackScreen,
		// 	// 	// data: 2000,
		// 	// 	data: 10,
		// 	// },
		// 	{
		// 		command: command.enterScenario,
		// 	},
		// 	{
		// 		command: command.moveCamera,
		// 		data: [
		// 			{
		// 				time: 0,
		// 				position: [-430, 30, -65],
		// 				target: [-360, 0, -65],
		// 			},
		// 		],
		// 	},
		// 	// {
		// 	// 	command: command.walkToPosition,
		// 	// 	data: [
		// 	// 		{
		// 	// 			time: 0,
		// 	// 			position: [-380, -65],
		// 	// 			// euler: [0, Math.PI / 2, 0],
		// 	// 		},
		// 	// 		// {
		// 	// 		// 	time: 1000,
		// 	// 		// 	position: [-379, -65],
		// 	// 		// },
		// 	// 	],
		// 	// },
		// 	// // {
		// 	// // 	command: command.showGirlAndActiveAllActions,
		// 	// // 	data: 3,
		// 	// // 	isWaitToComplete: true,
		// 	// // },
		// 	// {
		// 	// 	command: command.showGirlAndActiveAllActions,
		// 	// 	data: 100,
		// 	// 	isWaitToComplete: true,
		// 	// },

		// 	{
		// 		command: command.initGirl,
		// 		data: [-380, -65],
		// 		isWaitToComplete: true,
		// 	},
		// 	{
		// 		command: command.walkToPosition,
		// 		data: [
		// 			{
		// 				time: 0,
		// 				position: [-380, -65],
		// 				// euler: [0, 0, 0],
		// 			},
		// 			{
		// 				// time: 1500,
		// 				// time: 1800,
		// 				time: 2500,
		// 				position: [-360, -65],
		// 				// euler: [0, Math.PI / 2, 0],
		// 			},
		// 		],
		// 		isWaitToComplete: true,
		// 	},
		// 	{
		// 		command: command.moveCamera,
		// 		data: [
		// 			{
		// 				time: 0,
		// 				position: [-430, 30, -65],
		// 				target: [-360, 0, -65],
		// 			},
		// 			{
		// 				time: 2000,
		// 				// time: 20,
		// 				position: [-360, 100, -65],
		// 				target: [100, 0, -65],
		// 			},
		// 			{
		// 				time: 2000,
		// 				position: [-100, 100, -65],
		// 				target: [200, 0, -65],
		// 			},
		// 			{
		// 				time: 2000,
		// 				position: [-90, 100, -65],
		// 				target: [200, 0, -65],
		// 			},
		// 			// {
		// 			// 	time: 4000,
		// 			// 	// time: 40,
		// 			// 	position: [-430, 30, -65],
		// 			// 	target: [-360, 0, -65],
		// 			// },
		// 		],
		// 		isWaitToComplete: true,
		// 	},
		// 	{
		// 		command: command.playGirlAnimation,
		// 		data: {
		// 			name: animationName.Hello,
		// 		}
		// 	},
		// 	{
		// 		command: command.moveCamera,
		// 		data: [
		// 			{
		// 				time: 0,
		// 				position: [-340, 20, -75],
		// 				target: [-360, 15, -65],
		// 			},
		// 		],
		// 	},
		// 	{
		// 		command: command.say,
		// 		data: {
		// 			name: girlName,
		// 			contents: [{
		// 				content: "大家好~一起来玩吧~",
		// 				soundId: getSay1SoundResourceId()
		// 			}],
		// 			time: 2000,
		// 		},
		// 		isWaitToComplete: true,
		// 	},
		// 	{
		// 		command: command.exitScenario,
		// 	},
		// ],

		// [scenarioName.FindNewCityzen]: [
		// 	{
		// 		command: command.enterScenario,
		// 	},
		// 	{
		// 		command: command.stop,
		// 	},
		// 	{
		// 		command: command.moveCamera,
		// 		data: [
		// 			{
		// 				time: 0,
		// 				position: [340, 40, -100],
		// 				target: [450, 0, -100],
		// 			},
		// 			{
		// 				time: 2000,
		// 				position: [380, 80, -100],
		// 				target: [450, 0, -100],
		// 			},
		// 		],
		// 		isWaitToComplete: true,
		// 	},
		// 	{
		// 		command: command.say,
		// 		data: {
		// 			// name: characterName.girl,
		// 			name: girlName,
		// 			contents: [ "又有这么多的小人~" ],
		// 			time: 1000,
		// 			soundId: "say2"
		// 		},
		// 		isWaitToComplete: true,
		// 	},
		// 	{
		// 		command: command.exitScenario,
		// 	},
		// ]
	}, getAllScenarioData(state))
}