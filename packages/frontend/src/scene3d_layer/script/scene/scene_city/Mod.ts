import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../type/StateType";
import { getState, setState } from "./CityScene";
import { cameraFarLevel, mod } from "./type/StateType";
import { buildAPI } from "../../../mod/Mod";
import { renderAccuracyLevel } from "setting-default/src/Type";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import {
    getBillboardExplodeRangeBlockName, getBillboardIceOverwriteBlockName, getEffectHitExplodeSingleBlockName,
    getEffectHitBlurBlockName,
    getEffectHitCharmBlockName,
    getEffectHitCrippledBlockName,
    getEffectHitExcitementBlockName,
    getEffectHitIceSingleBlockName,
    getEffectHitPoisonSingleBlockName,
    getEffectHitInjureSingleBlockName,
    // getEffectHitFragileGrowthBlockName,
    getEffectHitDecreaseScaleBlockName,
    getEffectUpgradeBlockName,
    getEffectInjureDamageBlockName,
} from "../../../mod/ParticleMod";
import { MutableMapUtils } from "meta3d-jiehuo-abstract";

export let createState = (): mod => {
    return {
        api: buildAPI(),
        // renderAccuracy: renderAccuracyLevel.Middle,
        cameraFar: cameraFarLevel.Normal,
        allBlockNames: ArrayUtils.create(),

        allServicesCache: MutableMapUtils.create(),
    }
}

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).mod)
}

let _setState = (state: state, modState: mod) => {
    return setState(state, {
        ...getState(state),
        mod: NullableUtils.return_(modState)
    })
}

export let getModAPI = (state: state) => {
    return _getState(state).api
}

export let getCameraFar = (state: state) => {
    return _getState(state).cameraFar
}

export let setCameraFar = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        cameraFar: value
    })
}

export let getAllBlockNames = (state: state) => {
    return _getState(state).allBlockNames
}

export let setAllBlockNames = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        allBlockNames: value
    })
}

export let getSceneAllBlockNames = (state: state, allBlockNames) => {
    return ArrayUtils.removeDuplicateItems(ArrayUtils.intersect(
        getAllBlockNames(state),
        allBlockNames
    ))
}

export let getAllServicesCache = (state: state, key) => {
    return MutableMapUtils.get(_getState(state).allServicesCache, key)
}

export let setAllServicesCache = (state: state, key, value) => {
    return _setState(state, {
        ..._getState(state),
        allServicesCache: MutableMapUtils.set(_getState(state).allServicesCache, key, value)
    })
}

export let getAllServiceWithCache = (state: state, func, key) => {
    let result = getAllServicesCache(state, key)

    if (!NullableUtils.isNullable(result)) {
        return result
    }

    result = func(state)
    state = setAllServicesCache(state, key, result)

    return result
}


export let dispose = (state: state) => {
    return _setState(state, createState())
}

export let getAllNotRelatedToSceneBlockNames = () => {
    return [
        "mmd-character-default",
        "mmd-character-extend",

        "career-littleman-random",
        "career-giantess-random",
        "career-default",
        "career-footfetish",
        "career-wetnurse",
        "career-carry",
        "career-absorber",
        "career-vaginalcapturer",
        "career-duelist",
        "career-weaponworkman",
        "career-farmer",
        "career-enterpriser",
        "career-saver",
        "career-littleman-bandit",
        "career-giantess-bandit",
        "career-peace",
        "career-runner",
        "career-giantess-pleaser",
        "career-masochism",
        "career-sadism",
        "career-foodie",
        "career-demon",

        // "sound-background-default",
        // "setting-default",
        // "setting-sound",

        // "enemy-elite-giantess-melee",
        // "enemy-elite-giantess-magic",
        // "enemy-elite-giantess-share-default",
        "prop-bullet-basic",
        "prop-bullet-submachine",
        "prop-bullet-shot",
        "prop-bullet-bigger",
        "prop-bullet-smaller",
        // "weapon-kicklight",
        // "weapon-stomplight",
        // "weapon-stompheavy",
        // "weapon-magicattack1",
        // "weapon-walk",


        getEffectInjureDamageBlockName(),
        getEffectUpgradeBlockName(),

        getEffectHitBlurBlockName(),
        getEffectHitCharmBlockName(),
        getEffectHitCrippledBlockName(),
        getEffectHitExcitementBlockName(),
        getEffectHitIceSingleBlockName(),
        getEffectHitPoisonSingleBlockName(),
        getEffectHitInjureSingleBlockName(),
        // getEffectHitFragileGrowthBlockName(),
        getEffectHitDecreaseScaleBlockName(),
        getEffectHitExplodeSingleBlockName(),
        "particle-bullet-emit-submachine",
        "particle-bullet-hit-submachine",
        "particle-bullet-emit-basic",
        "particle-bullet-hit-basic",
        "particle-bullet-emit-shot",
        "particle-bullet-hit-shot",
        "particle-bullet-emit-fireball",
        "particle-bullet-hit-fireball",
        "particle-bullet-emit-bigger",
        "particle-bullet-emit-smaller",
        getBillboardExplodeRangeBlockName(),
        getBillboardIceOverwriteBlockName(),
        "particle-share-default",




        // "buff-strong",
        // "buff-run",
        // "buff-callgoddess",
        // "buff-excitement-girl",
        // "buff-excitement-level-giantess",
        // "buff-tired-girl",
        // "buff-tired-level-giantess",
        // "buff-holywater",
        // "buff-giantessstimulator",
        // "buff-giantesscontroller",

        "prop-artifact-restorecloth",
        "prop-artifact-infinitybig",
        "prop-artifact-callgoddess",
        "prop-artifact-giantessstimulator",
        "prop-artifact-giantesscontroller",
        "prop-artifact-specificgiantess",
        "prop-artifact-missioncomplete",

        "prop-other-strong",
        "prop-other-run",
        "prop-other-holywater",
        "prop-other-capture",
        "prop-other-smallerwater",
        "prop-other-use-giantesscharacter",


        "prop-share-default",



        "behaviour-balance",

        // "behaviour-playergoddess",
        // "behaviour-attack-playergiantess",
        // "event-game-callgoddess",
        // "event-game-attack-callgiantess",
        // "fsm-girl-excitement",
        // "fsm-level-giantess-excitement",
        // "fsm-girl-climax",
        // "fsm-level-giantess-climax",
        // "level-giantess-playergiantess",
        // "level-giantess-protect-boss1",
        // "level-giantess-protect-boss2",

        "skill-little-man-swiping",
        "skill-little-man-fastrun",



        "skill-giantess-stomp",
        "skill-giantess-stomp-rub",
        "skill-giantess-left-stomp",
        "skill-giantess-jump-stomp",
        "skill-giantess-stand-to-sit",
        "skill-giantess-sit-to-stand",
        "skill-giantess-sit-rub",
        "skill-giantess-sit-tightenleg",
        "skill-giantess-keep-sit",
        "skill-giantess-sit-heavystressing",
        "skill-giantess-sit-heavystressing-breast",
        "skill-giantess-sit-heavystressing-trigoneandbutt",
        "skill-giantess-sit-death",
        "skill-giantess-keep-ub",
        "skill-giantess-pick-to-ub",
        "skill-giantess-ub-to-pick",
        "skill-giantess-thrust",
        "skill-giantess-insert",
        "skill-giantess-put-to-breast",
        "skill-giantess-put-to-shoe",
        "skill-giantess-free-ub",
        "skill-giantess-free-breast",
        "skill-giantess-free-shoe",
        "skill-giantess-ub-heavystressing",
        "skill-giantess-breast-press",
        "skill-giantess-breast-press-rub",
        "skill-giantess-crawl-beat",
        "skill-giantess-crawl-lick",
        "skill-giantess-spray-milk",



        "weapon-little-man-swiping",
        "weapon-kicklight",
        "weapon-stomplight",
        "weapon-stompheavy",
        "weapon-magicattack1",
        "weapon-walk",


        "buff-emit-defense-increasedefense",
        "buff-emit-backstab",
        "buff-emit-hpratio",
        "buff-emit-hpratio-inverse",
        "buff-emit-shoot-distance-inverse",
        "buff-emit-shoot-distance-direct",
        "buff-emit-pull",
        "buff-emit-decreasescale",
        "buff-emit-defense-doorshield",
        "buff-emit-fragilegrowth",
        "buff-emit-defense-stressprotect",
        "buff-emit-poison-single",
        "buff-emit-ice-single",

        "buff-emit-crippled",
        "buff-army-crippled",
        "buff-littleman-crippled",

        "buff-emit-blur",
        "buff-army-blur",
        "buff-littleman-blur",

        "buff-emit-charm",
        "buff-army-charm",
        "buff-littleman-charm",

        "buff-emit-excitement",
        "buff-army-excitement",
        "buff-littleman-excitement",

        "buff-elite-giantess-passivebigger",
        "buff-elite-giantess-damagebigger",

        "buff-giantess-eat",
        "buff-giantess-absorb",
        "buff-littleman-masochism",
        "buff-giantess-masochism",
        "buff-giantess-sadism",
        "buff-army-sadism",
        "buff-littleman-excitement-increaseattack",
        "buff-army-stressprotect",
        "buff-littleman-stressprotect",
        "buff-giantess-stressprotect",
        "buff-bossstatus-stressprotect",

        "buff-playerstatus-damagebigger",
        "buff-bossstatus-damagebigger",
        "buff-playerstatus-passivebigger",
        "buff-bossstatus-passivebigger",

        "buff-army-increasedefense",
        "buff-army-ice-overwrite",
        "buff-army-ice-single",
        "buff-army-poison-single",
        "buff-army-injure-single",
        "buff-giantess-increasedefense",
        "buff-giantess-ice-overwrite",
        "buff-giantess-ice-single",
        "buff-giantess-poison-single",
        "buff-giantess-injure-single",
        "buff-littleman-increasedefense",
        "buff-littleman-ice-single",
        "buff-littleman-poison-single",

        "buff-strong",
        "buff-run",
        "buff-callgoddess",
        "buff-excitement-girl",
        "buff-excitement-level-giantess",
        "buff-tired-girl",
        "buff-tired-level-giantess",
        "buff-holywater",
        "buff-giantessstimulator",
        "buff-giantesscontroller",
        "buff-giantess-smallerwater",
        "buff-giantess-hard",

        "upgrade-skill-enhence-breastpressrub-charm",
        "upgrade-skill-enhence-breastpressrub-puttobreast",
        "upgrade-skill-enhence-sitrub-charm",
        "upgrade-skill-enhence-sitrub-insert",
        "upgrade-skill-enhence-stomprub-puttoshoe",
        "upgrade-skill-enhence-puttobreast-charm",
        "upgrade-skill-enhence-thrust-excitement",
        "upgrade-skill-enhence-puttoshoe-blur",
        "upgrade-skill-enhence-crawllick-eat",
        "upgrade-skill-enhence-crawllick-blur",
        "upgrade-skill-enhence-pinch-crippled",
        "upgrade-skill-enhence-jumpstomp-crippled",
        "upgrade-skill-enhence-stomp-crippled",
        "upgrade-skill-enhence-sit-rotate",
        "upgrade-skill-enhence-stomp-rotate",
        "upgrade-skill-enhence-run-repel",
        "upgrade-skill-fragilegrowth",
        "upgrade-skill-passivebigger",
        "upgrade-skill-damagebigger",
        "upgrade-skill-learn-run",
        "upgrade-skill-jumpstomp",
        "upgrade-skill-leftstomp",
        "upgrade-skill-stomprub",
        "upgrade-skill-standtosit-sittostand",
        "upgrade-skill-sitrub",
        "upgrade-skill-tightenleg",
        "upgrade-skill-picktoub-ubtopick",
        "upgrade-skill-thrust",
        "upgrade-skill-insert",
        "upgrade-skill-puttobreast",
        "upgrade-skill-puttoshoe",
        "upgrade-skill-freebreast",
        "upgrade-skill-freeshoe",
        "upgrade-skill-freeub",
        "upgrade-skill-breast-press",
        "upgrade-skill-breast-press-rub",
        "upgrade-skill-crawl-beat",
        "upgrade-skill-crawl-lick",
        "upgrade-skill-spray-milk",
        "upgrade-skill-ice-overwrite",
        "upgrade-skill-ice-single",
        "upgrade-skill-explode-range",
        "upgrade-skill-explode-single",
        "upgrade-skill-poison-single",
        "upgrade-skill-injure-single",
        "upgrade-defense-stressing-decreasedamage",
        "upgrade-defense-decreasestressingrate",
        "upgrade-defense-increasestrong-whenmeleeattack",
        "upgrade-defense-decreasedamage-whenlie",
        "upgrade-defense-buqu",
        "upgrade-defense-stressprotect",
        "upgrade-defense-limitdamage",
        "upgrade-defense-doorshield",
        "upgrade-defense-increasedefense",
        "upgrade-attack-decreasescale",
        "upgrade-attack-pull",
        "upgrade-attack-shoot-distance-direct",
        "upgrade-attack-shoot-distance-inverse",
        "upgrade-attack-hpratio",
        "upgrade-attack-hpratio-inverse",
        "upgrade-attack-backstab",
        "upgrade-assistant-addmaxexcitement",
        "upgrade-other-addbullet",
        "upgrade-other-increasepickproprange",
        "upgrade-other-partialscale-breast",
        "upgrade-other-partialscale-torsor",
        "upgrade-other-damaged-partialscale-breast",



        "interaction-weapongirl",


        "enemy-elite-giantess-melee",
        "enemy-elite-giantess-magic",
        "enemy-elite-giantess-share-default",



        "fsm-girl-climax",
        "fsm-level-giantess-climax",

        "fsm-girl-excitement",
        "fsm-level-giantess-excitement",

        "fsm-littleman-fall",
        "fsm-littleman-repel",


    ]
}

