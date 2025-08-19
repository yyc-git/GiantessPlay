import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getSay1SoundResourceId, getSay21SoundResourceId, getSay3SoundResourceId, getSayStompSoundResourceId } from "../../../manage/biwu/level1/ManageScene"
import { data } from "../../ScenarioData"
import { animationName } from "./DataType"
import { getWorldPosition } from "../../../little_man/Transform"

export enum command {
	walkToTargetPosition,
	pickdownArmy,
	lookat,
	wait,
	markBegin,
	markFinish,
	stompLittleMan,

	enterScenario,
	moveCamera,
	playGirlAnimation,
	say,
	realtimeSay,
	exitScenario,
}

export enum scenarioName {
	Begin = "Begin",

	PickdownArmy1 = "PickdownArmy1",
	PickdownArmy2_1 = "PickdownArmy2_1",
	PickdownArmy2_2 = "PickdownArmy2_2",
	// PickdownArmy3_1 = "PickdownArmy3_1",
	// PickdownArmy3_2 = "PickdownArmy3_2",
	// PickdownArmy3_3 = "PickdownArmy3_3",
	// PickdownArmy3_4 = "PickdownArmy3_4",
	PickdownArmy3 = "PickdownArmy3",

	StompLittleMan = "StompLittleMan",
}

let _getRandomPosition = () => {
	return [
		NumberUtils.getRandomInteger(
			-180, -20
		),
		0,
		NumberUtils.getRandomInteger(
			30, 55
		),
	]
}

let _getGiantessStandPosition = () => {
	return [-180, 0, 45]
}


// let _getRandomTime = () => {
// 	return NumberUtils.getRandomFloat(
// 		800, 1500
// 	)
// }

export let getData = (girlName): data<scenarioName, command> => {
	return {
		[scenarioName.Begin]: [
			{
				command: command.enterScenario,
			},
			{
				command: command.playGirlAnimation,
				data: {
					name: animationName.Idle,
					isLoop: true
				}
			},
			{
				command: command.moveCamera,
				data: [
					{
						time: 0,
						position: [-130, 3, 48],
						target: [-180, 0, 48],
					},
					{
						time: 1000,
						position: [-130, 3, 48],
						target: [-180, 20, 48],
					},
				],
				isWaitToComplete: true,
			},
			{
				command: command.playGirlAnimation,
				data: {
					name: animationName.Welcome,
				}
			},
			{
				command: command.say,
				data: {
					name: girlName,
					contents: [{
						content: "勇者，欢迎来到比武场，要战胜我才能离开哦~",
						soundId: getSay1SoundResourceId()
					}],
					time: 1500,
				},
				isWaitToComplete: true,
			},
			{
				command: command.exitScenario,
			},
		],

		[scenarioName.PickdownArmy1]: [
			{
				command: command.markBegin,
			},
			{
				command: command.pickdownArmy,
				data: {
					getIndexFunc: state => 1
				},
				isWaitToComplete: true,
			},
			{
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: "跟这些小玩具玩一下吧~",
						soundId: getSay21SoundResourceId()
					}],
					time: 1500,
					isInMiddle: true,
				},
			},
			{
				command: command.markFinish,
			},
		],
		[scenarioName.PickdownArmy2_1]: [
			{
				command: command.markBegin,
			},
			{
				command: command.walkToTargetPosition,
				data: {
					// time: _getRandomTime(),
					getTargetPositionFunc: state => _getRandomPosition(),
				},
				isWaitToComplete: true,
			},
			{
				command: command.pickdownArmy,
				data: {
					getIndexFunc: state => 2
				},
				isWaitToComplete: true,
			},
			{
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: "跟这些小玩具玩一下吧~",
						soundId: getSay21SoundResourceId()
					}],
					time: 1500,
					isInMiddle: true,
				},
			},
			{
				command: command.walkToTargetPosition,
				data: {
					getTargetPositionFunc: state => _getGiantessStandPosition(),
				},
				isWaitToComplete: true,
			},
			{
				command: command.lookat,
				data: {
					getTargetPositionFunc: state => getWorldPosition(state)
				}
			},
			{
				command: command.markFinish,
			},
		],
		[scenarioName.PickdownArmy2_2]: [
			{
				command: command.markBegin,
			},
			{
				command: command.walkToTargetPosition,
				data: {
					// time: _getRandomTime(),
					getTargetPositionFunc: state => _getRandomPosition(),
				},
				isWaitToComplete: true,
			},
			{
				command: command.pickdownArmy,
				data: {
					getIndexFunc: state => 3
				},
				isWaitToComplete: true,
			},
			{
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: "跟这些小玩具玩一下吧~",
						soundId: getSay21SoundResourceId()
					}],
					time: 1500,
					isInMiddle: true,
				},
			},
			{
				command: command.walkToTargetPosition,
				data: {
					getTargetPositionFunc: state => _getGiantessStandPosition(),
				},
				isWaitToComplete: true,
			},
			{
				command: command.lookat,
				data: {
					getTargetPositionFunc: state => getWorldPosition(state)
				}
			},
			{
				command: command.markFinish,
			},
		],
		[scenarioName.PickdownArmy3]: [
			{
				command: command.markBegin,
			},
			{
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: "这次会放更多的玩具~",
						soundId: getSay3SoundResourceId()
					}],
					time: 1500,
					isInMiddle: true,
				},
			},
			{
				command: command.walkToTargetPosition,
				data: {
					// time: _getRandomTime(),
					getTargetPositionFunc: state => _getRandomPosition(),
				},
				isWaitToComplete: true,
			},
			{
				command: command.pickdownArmy,
				data: {
					getIndexFunc: state => 4
				},
				isWaitToComplete: true,
			},
			{
				command: command.walkToTargetPosition,
				data: {
					// time: _getRandomTime(),
					getTargetPositionFunc: state => _getRandomPosition(),
				},
				isWaitToComplete: true,
			},
			{
				command: command.pickdownArmy,
				data: {
					getIndexFunc: state => 5
				},
				isWaitToComplete: true,
			},
			{
				command: command.walkToTargetPosition,
				data: {
					getTargetPositionFunc: state => _getGiantessStandPosition(),
				},
				isWaitToComplete: true,
			},
			{
				command: command.lookat,
				data: {
					getTargetPositionFunc: state => getWorldPosition(state)
				}
			},
			{
				command: command.wait,
				data: 5000,
				isWaitToComplete: true,
			},
			{
				command: command.walkToTargetPosition,
				data: {
					// time: _getRandomTime(),
					getTargetPositionFunc: state => _getRandomPosition(),
				},
				isWaitToComplete: true,
			},
			{
				command: command.pickdownArmy,
				data: {
					getIndexFunc: state => 6
				},
				isWaitToComplete: true,
			},
			{
				command: command.walkToTargetPosition,
				data: {
					// time: _getRandomTime(),
					getTargetPositionFunc: state => _getRandomPosition(),
				},
				isWaitToComplete: true,
			},
			{
				command: command.pickdownArmy,
				data: {
					getIndexFunc: state => 7
				},
				isWaitToComplete: true,
			},
			{
				command: command.walkToTargetPosition,
				data: {
					getTargetPositionFunc: state => _getGiantessStandPosition(),
				},
				isWaitToComplete: true,
			},
			{
				command: command.lookat,
				data: {
					getTargetPositionFunc: state => getWorldPosition(state)
				}
			},
			{
				command: command.markFinish,
			},
		],

		[scenarioName.StompLittleMan]: [
			{
				command: command.markBegin,
			},
			{
				command: command.pickdownArmy,
				data: {
					getIndexFunc: state => 8
				},
				isWaitToComplete: true,
			},
			{
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: "我也来一起玩~",
						soundId: getSayStompSoundResourceId()
					}],
					time: 1000,
					isInMiddle: true,
				},
			},
			{
				command: command.stompLittleMan,
				data: null,
			},
			{
				command: command.markFinish,
			},
		]
	}
}