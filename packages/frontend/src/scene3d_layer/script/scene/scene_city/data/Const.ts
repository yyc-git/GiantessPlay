import { getName } from "../girl/Girl"
import { animationName } from "./DataType"
import { getConfigData, getName as getSceneName } from "../CityScene"
import { state } from "../../../../type/StateType"

export let getAnimationFrameCountMap = () => {
	return {

		[animationName.Walk]: 32,
		[animationName.Run]: 20,
		[animationName.Stomp]: 70,

		[animationName.BreastPress]: 80,
		[animationName.KeepCrawl]: 120,
		[animationName.StandToCrawl]: 60,
		[animationName.CrawlToStand]: 60,
		[animationName.CrawlMove]: 39,



		[animationName.Pickup]: 90,
		[animationName.Pickdown]: 65,
		[animationName.KeepPick]: 30,
		[animationName.Pinch]: 40,
		[animationName.Eat]: 60,




		[animationName.HeavyStressing]: 60,
		[animationName.HeavyStressingBreast]: 60,
		[animationName.HeavyStressingTrigoneAndButt]: 60,
		[animationName.Death]: 60,


		[animationName.CrawlHeavyStressing]: 60,
		[animationName.CrawlHeavyStressingBreast]: 60,
		[animationName.CrawlHeavyStressingTrigoneAndButt]: 60,
		[animationName.CrawlDeath]: 60,


		[animationName.Hello]: 50,
	} as Record<animationName, number>
}

export let getAnimationFrameCount = (state: state, animationName_) => {
	return getConfigData(state).girlAllAnimationFrameCountMap[animationName_]
}

export let getAnimationFrameCountWithoutState = (animationName_) => {
	return getAnimationFrameCountMap()[animationName_]
}

export let getMikuResourcePath = (name) => `./resource_girl/${name}/miku_v2.pmd`

export let getNeruResourcePath = (name) => `./resource_girl/${name}/Neru_Akita.pmd`

export let getLukaResourcePath = (name) => `./resource_girl/${name}/Luka_Megurine.pmd`

export let getMeikoResourcePath = (name) => `./resource_girl/${name}/Meiko/Meiko_Sakine.pmx`

export let getHakuQPResourcePath = (name) => `./resource_girl/${name}/旗袍 Haku/tda haku QP.pmx`
// export let getHakuQPResourcePath = (name) => `./resource_girl/${name}/Tda Miku Standard Base 2.5/Tda Miku Standard Base 2.5.pmx`

export let getHakuLadyResourcePath = (name) => `./resource_girl/${name}/The TDA Lady Haku Is Trump Ver2.00 [Silver]/The TDA Lady Haku Is Trump Ver2.00 [Silver].pmx`

// export let getLuoli1ResourcePath = (name) => `./resource_girl/${name}/ぷにる/傉偵傞_僶僢僌塃.pmx`

export let getBaixiMaidResourcePath = (name) => `./resource_girl/${name}/女仆白希/女仆白希安全裤.pmx`

export let getXiahuiResourcePath = (name) => `./resource_girl/${name}/TDA式宴 夏卉/TDA Utage CORAL COAST.pmx`

export let getXiaye1ResourcePath = (name) => `./resource_girl/${name}/Tda 夏夜1 HMS illustrious Prom Dress Ver1.00 [Silver]/Tda HMS illustrious Prom Dress Ver1.00 [Silver].pmx`

export let getXiaye2ResourcePath = (name) => `./resource_girl/${name}/TDA 夏夜2 MOON LIGHT DANCER LTY/TDA MOON LIGHT DANCER LTY.pmx`

export let getNeroResourcePath = (name) => `./resource_girl/${name}/TDA Nero Claudius L2 bride Ver 1.00/TDA Nero Claudius L2 bride.pmx`

export let getChangeeResourcePath = (name) => `./resource_girl/${name}/TDA 嫦娥123话OL装 Ver 1.00/TDA 嫦娥123话OL装 Ver 1.00.pmx`

// export let getLuotianyiResourcePath = (name) => `./resource_girl/${name}/TDA 洛天依旗袍 芒种 Ver1.00/TDA 洛天依旗袍 芒种 Ver1.00.pmx`

export let getMiku1ResourcePath = (name) => `./resource_girl/${name}/Tda初音Ver1.10/Tda幃弶壒儈僋丒傾儁儞僪_Ver1.10.pmx`

export let getVanillaResourcePath = (name) => `./resource_girl/${name}/Vanilla v1.0/Vanilla.pmx`

export let getMeibiwusiResourcePath = (name) => `./resource_girl/${name}/梅比乌斯OL装/梅比乌斯5.0.pmx`

export let getMoyeResourcePath = (name) => `./resource_girl/${name}/摩耶ver1.04/捁奀夵擇ver1.04.pmx`


export let getMikuResourceId = () => `${getSceneName()}_${getName()}_${getMikuResourcePath(getName())}`

export let getNeruResourceId = () => `${getSceneName()}_${getName()}_${getNeruResourcePath(getName())}`

export let getLukaResourceId = () => `${getSceneName()}_${getName()}_${getLukaResourcePath(getName())}`

export let getMeikoResourceId = () => `${getSceneName()}_${getName()}_${getMeikoResourcePath(getName())}`

export let getHakuQPResourceId = () => `${getSceneName()}_${getName()}_${getHakuQPResourcePath(getName())}`

export let getHakuLadyResourceId = () => `${getSceneName()}_${getName()}_${getHakuLadyResourcePath(getName())}`

// export let getLuoli1ResourceId = () => `${getSceneName()}_${getName()}_${getLuoli1ResourcePath(getName())}`

export let getBaixiMaidResourceId = () => `${getSceneName()}_${getName()}_${getBaixiMaidResourcePath(getName())}`

export let getXiahuiResourceId = () => `${getSceneName()}_${getName()}_${getXiahuiResourcePath(getName())}`

export let getXiaye1ResourceId = () => `${getSceneName()}_${getName()}_${getXiaye1ResourcePath(getName())}`

export let getXiaye2ResourceId = () => `${getSceneName()}_${getName()}_${getXiaye2ResourcePath(getName())}`

export let getNeroResourceId = () => `${getSceneName()}_${getName()}_${getNeroResourcePath(getName())}`

export let getChangeeResourceId = () => `${getSceneName()}_${getName()}_${getChangeeResourcePath(getName())}`

// export let getLuotianyiResourceId = () => `${getSceneName()}_${getName()}_${getLuotianyiResourcePath(getName())}`

export let getMiku1ResourceId = () => `${getSceneName()}_${getName()}_${getMiku1ResourcePath(getName())}`

export let getVanillaResourceId = () => `${getSceneName()}_${getName()}_${getVanillaResourcePath(getName())}`

export let getMeibiwusiResourceId = () => `${getSceneName()}_${getName()}_${getMeibiwusiResourcePath(getName())}`

export let getMoyeResourceId = () => `${getSceneName()}_${getName()}_${getMoyeResourcePath(getName())}`




export let getIdleAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/idle.vmd`

export let getWalkAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/walk.vmd`

export let getRunAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/run.vmd`

export let getStompAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/stomp.vmd`


export let getBreastPressAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/breast_press.vmd`

export let getCrawlMoveAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/crawl_move.vmd`

export let getStandToCrawlAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/stand_to_crawl.vmd`

export let getCrawlToStandAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/crawl_to_stand.vmd`

export let getKeepCrawlAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/keep_crawl.vmd`




export let getPickupAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/pickup.vmd`

export let getPickdonwAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/pickdown.vmd`

export let getKeepPickAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/keep_pick.vmd`

export let getPinchAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/pinch.vmd`

export let getEatAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/eat.vmd`




export let getCrawlHeavyStressingAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/crawl_heavy_stressing.vmd`

export let getCrawlHeavyStressingBreastAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/crawl_heavy_stressing_breast.vmd`

export let getCrawlHeavyStressingTrigoneAndButtAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/crawl_heavy_stressing_trigoneAndButt.vmd`

export let getCrawlDeathAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/crawl_death.vmd`







export let getHeavyStressingAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/heavy_stressing.vmd`

export let getHeavyStressingBreastAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/heavy_stressing_breast.vmd`

export let getHeavyStressingTrigoneAndButtAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/heavy_stressing_trigoneAndButt.vmd`

export let getDeathAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/death.vmd`








export let getHelloAnimationResourcePath = (name) => `./resource_girl/${name}/vmd_scenario/hello.vmd`