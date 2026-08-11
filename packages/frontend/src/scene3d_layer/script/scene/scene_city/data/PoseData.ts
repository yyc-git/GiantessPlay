import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { pose, usedGirl } from "../type/StateType"
import { actionName, animationName } from "./DataType"
import { state } from "../../../../type/StateType"
import { api } from "type-api/src/Type"
import { getKeepUBBlockService } from "../../../../mod/SkillGiantessMod"

export type singleOperateData = {
    name: actionName,
    imageSrc: string,
    key: string,
    textWidth?: nullable<string>,
    rowIndex: number,

    conditionFunc?: (api: api, state: state, usedGirl: usedGirl) => boolean,
}

export type operateRenderData = {
    poseData: Array<{
        pose: pose,
        // scaleState: scaleState,
        names: Array<actionName>
    }>,
    operateData: Array<singleOperateData>
}

export let getOperateRenderData = (): operateRenderData => {
    return {
        poseData: [
            {
                pose: pose.Stand,
                // scaleState: scaleState.Normal,
                names: [
                    actionName.Run,
                    actionName.Bigger,
                    actionName.StandToCrawl,
                    // actionName.Stomp,
                    actionName.Pickup,
                ],
            },
            // {
            //     pose: pose.Stand,
            //     // scaleState: scaleState.Big,
            //     names: [
            //         actionName.Bigger,
            //         actionName.StandToCrawl,
            //         actionName.Stomp,
            //         actionName.Pickup,
            //     ]
            // },
            {
                pose: pose.Pick,
                // scaleState: scaleState.Normal,
                names: [
                    // actionName.Stomp,
                    actionName.Eat,
                    actionName.Pinch,
                    actionName.Run,
                    actionName.Bigger,
                    actionName.Pickdown,
                ]
            },
            // {
            //     pose: pose.Pick,
            //     scaleState: scaleState.Big,
            //     names: [
            //         actionName.Stomp,
            //         actionName.Eat,
            //         actionName.Pinch,
            //         actionName.Bigger,
            //         actionName.Pickdown,
            //     ]
            // },
            {
                pose: pose.Crawl,
                // scaleState: scaleState.Normal,
                names: [
                    // actionName.BreastPress,
                    actionName.CrawlToStand,
                    actionName.Bigger,
                ]
            },
            {
                pose: pose.Sit,
                // scaleState: scaleState.Normal,
                names: [
                    actionName.Bigger,
                ]
            },
            // {
            //     pose: pose.Crawl,
            //     scaleState: scaleState.Big,
            //     names: [
            //         actionName.BreastPress,
            //         actionName.CrawlToStand,
            //         actionName.Bigger,
            //     ]
            // },
        ],
        operateData: [
            // {
            //     name: actionName.Stomp,
            //     imageSrc: "./resource/ui/in_game/common_pose/stomp.png",
            //     key: "E",
            //     rowIndex: 1,

            //     // bottom: "1rem",
            //     // right: "1rem",
            // },
            {
                name: actionName.Eat,
                imageSrc: "./resource/ui/in_game/pick/eat.png",
                key: "O",
                rowIndex: 1,

                conditionFunc: (api, state, usedGirl) => {
                    return api.girl.getCurrentAnimationName(state, usedGirl) == animationName.KeepPick
                }
                // bottom: "1rem",
                // right: "5rem",
            },
            {
                name: actionName.Pinch,
                imageSrc: "./resource/ui/in_game/pick/pinch.png",
                key: "I",
                rowIndex: 1,

                conditionFunc: (api, state, usedGirl) => {
                    return api.girl.getCurrentAnimationName(state, usedGirl) == animationName.KeepPick
                }
                // bottom: "1rem",
                // right: "9rem",
            },
            {
                name: actionName.Run,
                imageSrc: "./resource/ui/in_game/common_pose/run.png",
                key: "Shift",
                rowIndex: 2,

                // bottom: "5rem",
                // right: "1rem",

                // textWidth: "3rem",
                textWidth: "2rem",

                conditionFunc: (api, state, usedGirl) => {
                    return api.girl.getCurrentAnimationName(state, usedGirl) != getKeepUBBlockService(state).getForceAnimationName()

                }
            },
            {
                name: actionName.Bigger,
                imageSrc: "./resource/ui/in_game/common_pose/bigger.png",
                key: "K",
                rowIndex: 2,

                // bottom: "5rem",
                // right: "5rem",
            },
            {
                name: actionName.Pickup,
                imageSrc: "./resource/ui/in_game/stand/pickup.png",
                key: "Y",
                rowIndex: 2,

                // bottom: "5rem",
                // right: "9rem",
            },
            {
                name: actionName.Pickdown,
                imageSrc: "./resource/ui/in_game/pick/pickdown.png",
                key: "U",
                rowIndex: 2,

                conditionFunc: (api, state, usedGirl) => {
                    return api.girl.getCurrentAnimationName(state, usedGirl) == animationName.KeepPick
                }
                // bottom: "5rem",
                // right: "9rem",
            },
            // {
            //     name: actionName.BreastPress,
            //     imageSrc: "./resource/ui/in_game/crawl/breastPress.png",
            //     key: "M",
            //     rowIndex: 1,
            //     // bottom: "1rem",
            //     // right: "1rem",
            // },
            {
                name: actionName.CrawlToStand,
                imageSrc: "./resource/ui/in_game/crawl/crawlToStand.png",
                key: "N",

                rowIndex: 2,
                // bottom: "5rem",
                // right: "1rem",
            },
            {
                name: actionName.StandToCrawl,
                imageSrc: "./resource/ui/in_game/stand/standToCrawl.png",
                key: "B",
                rowIndex: 2,

                // bottom: "5rem",
                // right: "9rem",
            },
        ]
    }
}