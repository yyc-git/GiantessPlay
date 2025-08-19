import { NumberUtils } from "meta3d-jiehuo-abstract"
import { data } from "../../ScenarioData"
import { getDownArrowResourceId } from "./Const"
import { collisionPart } from "./CollisionShapeData"
import {
	getSayAddSoundResourceId, getSayBeatSoundResourceId, getSayGoSoundResourceId, getSayHitLeftNipple1SoundResourceId, getSayHitLeftNipple2SoundResourceId, getSayHitLeftNipple3SoundResourceId, getSayHitRightNipple1SoundResourceId,
	getSayHitRightNipple2SoundResourceId,
	getSayHitRightNipple3SoundResourceId,
	getSayLeftRightSoundResourceId, getSayOneSoundResourceId, getSayOnlySoundResourceId, getSayReachSoundResourceId, getSayStressing1SoundResourceId, getSayStressing2SoundResourceId, getSayStressing3SoundResourceId, getSayTwoBeatSoundResourceId, getSayTwoOneSoundResourceId
} from "../../../manage/biwu/level3/ManageScene"

export enum command {
	handleGoToTrigone,
	handleReachTrigone,
	addImage,
	removeImage,
	initMap,
	addEffectForHitNipple,
	onlyAddArmy,
	rightHandAddArmy,
	rightHandOnePointAttack,
	rightHandBeatAttack,

	leftHandRightHand,

	twoHandsOnePointAttack,
	twoHandsBeatAttack,

	wait,

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
	GoToTrigone = "GoToTrigone",
	ReachTrigone = "ReachTrigone",

	OnlyAddArmy = "OnlyAddArmy",

	RightHandAddArmy = "RightHandAddArmy",
	RightHandOnePointAttack = "RightHandOnePointAttack",
	RightHandBeatAttack = "RightHandBeatAttack",

	LeftHandRightHand = "LeftHandRightHand",

	TwoHandsOneFingerAttack = "TwoHandsOneFingerAttack",
	TwoHandsBeatAttack = "TwoHandsBeatAttack",



	HitRightNipple = "HitRightNipple",
	HitLeftNipple = "HitLeftNipple",

	Stressing = "Stressing",
}

export let getData = (girlName): data<scenarioName, command> => {
	return {
		[scenarioName.GoToTrigone]: [
			{
				command: command.enterScenario,
			},
			{
				command: command.say,
				data: {
					name: girlName,
					contents: [{
						content: "到肚子上来~",
						soundId: getSayGoSoundResourceId()
					}],
					time: 1000,
				},
				isWaitToComplete: true,
			},
			{
				command: command.handleGoToTrigone,
			},
			{
				command: command.addImage,
				data: {
					resourceId: getDownArrowResourceId(),
					positiion: [-150, 40 + 20, 60],
					// width: 1,
					// height: 1,
					width: 50,
					height: 50,
				},
			},
			{
				command: command.exitScenario,
			},

		],

		[scenarioName.ReachTrigone]: [
			{
				command: command.markBegin,
			},
			{
				command: command.handleReachTrigone,
			},
			{
				command: command.removeImage,
				data: {
					resourceId: getDownArrowResourceId()
				},
			},
			{
				command: command.initMap,
			},
			{
				command: command.moveCamera,
				data: [
					{
						time: 0,
						position: [-130, 40, 66],
						target: [-200, 50, 66],
					},
				],
			},
			{
				command: command.say,
				data: {
					name: girlName,
					contents: [{
						content: "你到了哦~",
						soundId: getSayReachSoundResourceId()
					}],
					time: 1000,
				},
				isWaitToComplete: true,
			},
			{
				command: command.markFinish,
			},
		],

		[scenarioName.OnlyAddArmy]: [
			{
				command: command.markBegin,
			},
			{
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: "放点小玩具助兴~",
						soundId: getSayOnlySoundResourceId()
					}],
					time: 2000,
					isInMiddle: true,
				},
				// isWaitToComplete: true,
			},
			{
				command: command.onlyAddArmy,
			},
			{
				command: command.markFinish,
			},
		],

		[scenarioName.RightHandAddArmy]: [
			{
				command: command.markBegin,
				data: scenarioName.RightHandAddArmy
			},
			{
				// command: command.say,
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: "放一些小玩具，一起玩玩~",
						soundId: getSayAddSoundResourceId()
					}],
					time: 2000,
					isInMiddle: true,
				},
				// isWaitToComplete: true,
			},
			{
				command: command.rightHandAddArmy,
			},
			{
				command: command.markFinish,
			},
		],

		[scenarioName.RightHandOnePointAttack]: [
			{
				command: command.markBegin,
			},
			{
				// command: command.say,
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: "我只用一根手指~",
						soundId: getSayOneSoundResourceId()
					}],
					time: 1000,
					isInMiddle: true,
				},
				// isWaitToComplete: true,
			},
			{
				command: command.rightHandOnePointAttack,
			},
			{
				command: command.markFinish,
			},
		],


		[scenarioName.RightHandBeatAttack]: [
			{
				command: command.markBegin,
			},
			{
				// command: command.say,
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: "我用一只手掌哦~",
						soundId: getSayBeatSoundResourceId()
					}],
					time: 2000,
					isInMiddle: true,
				},
				// isWaitToComplete: true,
			},
			{
				command: command.rightHandBeatAttack,
			},
			{
				command: command.markFinish,
			},
		],

		[scenarioName.LeftHandRightHand]: [
			{
				command: command.markBegin,
			},
			{
				// command: command.say,
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: "要防护下~",
						soundId: getSayLeftRightSoundResourceId()
					}],
					time: 1000,
					isInMiddle: true,
				},
				// isWaitToComplete: true,
			},
			{
				command: command.leftHandRightHand,
			},
			{
				command: command.markFinish,
			},
		],


		[scenarioName.TwoHandsOneFingerAttack]: [
			{
				command: command.markBegin,
			},
			{
				// command: command.say,
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: "我要用两根手指哦~",
						soundId: getSayTwoOneSoundResourceId()
					}],
					time: 2000,
					isInMiddle: true,
				},
				// isWaitToComplete: true,
			},
			{
				command: command.twoHandsOnePointAttack,
			},
			{
				command: command.markFinish,
			},
		],


		[scenarioName.TwoHandsBeatAttack]: [
			{
				command: command.markBegin,
			},
			{
				// command: command.say,
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: "要认真点啦~",
						soundId: getSayTwoBeatSoundResourceId()
					}],
					time: 2000,
					isInMiddle: true,
				},
				// isWaitToComplete: true,
			},
			{
				command: command.twoHandsBeatAttack,
			},
			{
				command: command.markFinish,
			},
		],



		[scenarioName.HitRightNipple]: [
			{
				command: command.markBegin,
			},
			{
				// command: command.say,
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [{
						content: "啊啊啊~~~右边乳头有点痒痒的",
						soundId: getSayHitRightNipple1SoundResourceId()
					},
					{
						content: "人家有点感觉啦~",
						soundId: getSayHitRightNipple2SoundResourceId()
					},
					{
						content: "哎哟~你打得很准嘛~",
						soundId: getSayHitRightNipple3SoundResourceId()
					},
					],
					time: 2000,
					isInMiddle: true,
				},
				// isWaitToComplete: true,
			},
			{
				command: command.addEffectForHitNipple,
				data: collisionPart.RightNipple,
			},
			{
				command: command.wait,
				data: 2000,
				isWaitToComplete: true,
			},
			{
				command: command.markFinish,
			},
		],
		[scenarioName.HitLeftNipple]: [
			{
				command: command.markBegin,
			},
			{
				// command: command.say,
				command: command.realtimeSay,
				data: {
					name: girlName,
					contents: [
						{
							content: "啊啊啊~左边乳头有点痒痒的",
							soundId: getSayHitLeftNipple1SoundResourceId()
						},
						{
							content: "弄得人家有点感觉啦~",
							soundId: getSayHitLeftNipple2SoundResourceId()
						},
						{
							content: "啊啊啊~你打得很准嘛~",
							soundId: getSayHitLeftNipple3SoundResourceId()
						},
					],
					time: 2000,
					isInMiddle: true,
				},
				// isWaitToComplete: true,
			},
			{
				command: command.addEffectForHitNipple,
				data: collisionPart.LeftNipple,
			},
			{
				command: command.wait,
				data: 2000,
				isWaitToComplete: true,
			},
			{
				command: command.markFinish,
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
							content: "啊啊啊~",
							soundId: getSayStressing1SoundResourceId()
						},
						// {
						// 	content: "你有点厉害哦~",
						// 	soundId: getSayStressing2SoundResourceId()
						// },
						{
							content: "哎哟~",
							soundId: getSayStressing3SoundResourceId()
						},
					],
					time: 1000,
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