import { state } from "frontend/src/scene3d_layer/type/StateType";
import { api } from "type-api/src/Type";
import { getAllGameEventBlockNames } from "./Utils";

export let getAllBlockNames = (api: api) => {
    return [
        // "event-game-protect-elite-giantess",
        // "event-game-protect-army",
        // "event-game-protect-level-giantess1",
        // "event-game-protect-level-giantess2",
        // "event-game-protect-callgiantess",
        // "event-game-protect-callgoddess",
        ...api.getAllNotRelatedToSceneBlockNames(),
        ...getAllGameEventBlockNames(),
        "scene-protect",
        // "mmd-character-default",
        // "mmd-character-extend",
        // "sound-background-default",
        // "setting-default",
        // "setting-sound",
        "enemy-elite-giantess-melee",
        "enemy-elite-giantess-magic",
        "enemy-elite-giantess-share-default",
        // "prop-bullet-basic",
        // "prop-bullet-submachine",
        // "prop-bullet-shot",
        // "prop-bullet-bigger",
        // "prop-bullet-smaller",
        "weapon-kicklight",
        "weapon-stomplight",
        "weapon-stompheavy",
        "weapon-magicattack1",
        "weapon-walk",
        // "particle-bullet-emit-submachine",
        // "particle-bullet-hit-submachine",
        // "particle-bullet-emit-basic",
        // "particle-bullet-hit-basic",
        // "particle-bullet-emit-shot",
        // "particle-bullet-hit-shot",
        // "particle-bullet-emit-fireball",
        // "particle-bullet-hit-fireball",
        // "particle-bullet-emit-bigger",
        // "particle-bullet-emit-smaller",
        // "particle-share-default",
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
        // "prop-other-strong",
        // "prop-other-run",
        // "prop-other-holywater",
        // "prop-share-default",
        // "prop-artifact-infinitybig",
        // "prop-artifact-callgoddess",
        // "prop-artifact-giantessstimulator",
        // "prop-artifact-giantesscontroller",
        // "prop-artifact-specificgiantess",
        // "prop-artifact-missioncomplete",
        // "behaviour-playergoddess",
        // "behaviour-attack-playergiantess",
        // "behaviour-protect-playergiantess",
        // "behaviour-protect-playergoddess",
        // "behaviour-protect-level-giantess1",
        // "behaviour-protect-level-giantess2",
        // "event-game-callgoddess",
        // "event-game-attack-callgiantess",
        // "event-game-protect-callgiantess",
        // "event-game-protect-callgoddess",
        // "event-game-protect-elite-giantess",
        // "event-game-protect-army",
        // "event-game-protect-level-giantess1",
        // "event-game-protect-level-giantess2",
        "level-giantess-playergiantess",
        "level-giantess-protect-boss1",
        "level-giantess-protect-boss2",

        "interaction-weapongirl",
    ]
}

// export let clearAndRegisterSceneAllMods = (api: api, state: state) => {
//     return api.clearAndRegisterSceneAllMods(
//         state,
//         _getAllBlockNames()
//     )

//     // state = api.disposeAllMods(state)

//     // let blockState = api.blockAPI.createState()

//     // blockState = _getAllBlockNames().reduce((blockState, blockName) => {
//     //     let service = api.blockAPI.getBlockServiceByBlockName(state, blockName)

//     //     blockState = api.blockAPI.registerBlock(
//     //         api,
//     //         blockState,
//     //         service.getBlockInfo(api).protocolName,
//     //         service.getBlockInfo(api).blockName,
//     //         service.getBlockService,
//     //         service.createBlockState(api)
//     //     )

//     //     return blockState
//     // }, blockState)


//     // state = api.blockAPI.setBlockState(state, blockState)

//     // return api.initAllBlocks(state)
// }