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
import { getLanguageTextData, languageKey } from "../../../../../../internation/Data"
import { readState } from "../../../../../../state/State"

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
						content: getLanguageTextData(readState(), languageKey.BossLevel3GoToTrigoneSay1),
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
						content: getLanguageTextData(readState(), languageKey.BossLevel3ReachTrigoneSay1),
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
						content: getLanguageTextData(readState(), languageKey.BossLevel3OnlyAddArmySay1),
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
						content: getLanguageTextData(readState(), languageKey.BossLevel3RightHandAddArmySay1),
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
						content: getLanguageTextData(readState(), languageKey.BossLevel3RightHandOnePointAttackSay1),
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
						content: getLanguageTextData(readState(), languageKey.BossLevel3RightHandBeatAttackSay1),
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
						content: getLanguageTextData(readState(), languageKey.BossLevel3LeftHandRightHandSay1),
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
						content: getLanguageTextData(readState(), languageKey.BossLevel3TwoHandsOneFingerAttackSay1),
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
						content: getLanguageTextData(readState(), languageKey.BossLevel3TwoHandsBeatAttackSay1),
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
						content: getLanguageTextData(readState(), languageKey.BossLevel3HitRightNippleSay1),
						soundId: getSayHitRightNipple1SoundResourceId()
					},
					{
						content: getLanguageTextData(readState(), languageKey.BossLevel3HitRightNippleSay2),
						soundId: getSayHitRightNipple2SoundResourceId()
					},
					{
						content: getLanguageTextData(readState(), languageKey.BossLevel3HitRightNippleSay3),
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
							content:getLanguageTextData(readState(), languageKey.BossLevel3HitLeftNippleSay1),
							soundId: getSayHitLeftNipple1SoundResourceId()
						},
						{
							content:getLanguageTextData(readState(), languageKey.BossLevel3HitLeftNippleSay2),
							soundId: getSayHitLeftNipple2SoundResourceId()
						},
						{
							content:getLanguageTextData(readState(), languageKey.BossLevel3HitLeftNippleSay3),
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
							content:getLanguageTextData(readState(), languageKey.BossLevel3StressingSay1),
							soundId: getSayStressing1SoundResourceId()
						},
						// {
						// 	content: "你有点厉害哦~",
						// 	soundId: getSayStressing2SoundResourceId()
						// },
						{
							content:getLanguageTextData(readState(), languageKey.BossLevel3StressingSay2),
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