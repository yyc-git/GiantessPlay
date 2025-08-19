import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { state } from "../../../../type/StateType";
import { getGirlState, isScaleState, setGirlState } from "./Girl";
import { actionName } from "../data/DataType";
import { actionState, pose, scaleState } from "../type/StateType";

export let changePose = (state: state, pose) => {
    return setGirlState(state, {
        ...getGirlState(state),
        currentPose: pose,
    })
}

export let getCurrentPose = (state: state) => {
    return getGirlState(state).currentPose
}

export let isPose = (state: state, pose) => {
    return getGirlState(state).currentPose == pose
}

export type operateRenderData = Array<{
    pose: pose,
    scaleState: scaleState,
    value: Array<{
        name: actionName,
        imageSrc: string,
        key: string,

        bottom: string,
        right: string,

        textWidth?: nullable<string>,
        // condition?: nullable<(state: state) => boolean>
    }>
}>

export let getOperateRenderData = (): operateRenderData => {
    return [
        {
            pose: pose.Stand,
            scaleState: scaleState.Normal,
            value: [
                {
                    name: actionName.Run,
                    imageSrc: "./resource/ui/in_game/common_pose/run.png",
                    key: "Shift",

                    bottom: "5rem",
                    right: "1rem",

                    textWidth: "3rem",
                    // condition: (state: state) => {
                    //     return !isScaleState(state, scaleState.Big)
                    // }
                },
                {
                    name: actionName.Bigger,
                    imageSrc: "./resource/ui/in_game/common_pose/bigger.png",
                    key: "K",

                    bottom: "5rem",
                    right: "5rem",
                },
                {
                    name: actionName.StandToCrawl,
                    imageSrc: "./resource/ui/in_game/stand/standToCrawl.png",
                    key: "B",

                    bottom: "5rem",
                    right: "9rem",
                },

                {
                    name: actionName.Stomp,
                    imageSrc: "./resource/ui/in_game/common_pose/stomp.png",
                    key: "E",

                    bottom: "1rem",
                    right: "1rem",
                },
                {
                    name: actionName.Pickup,
                    imageSrc: "./resource/ui/in_game/stand/pickup.png",
                    key: "Y",

                    bottom: "1rem",
                    right: "5rem",
                },
            ]
        },
        {
            pose: pose.Stand,
            scaleState: scaleState.Big,
            value: [
                {
                    name: actionName.Bigger,
                    imageSrc: "./resource/ui/in_game/common_pose/bigger.png",
                    key: "K",

                    bottom: "5rem",
                    right: "5rem",
                },
                {
                    name: actionName.StandToCrawl,
                    imageSrc: "./resource/ui/in_game/stand/standToCrawl.png",
                    key: "B",

                    bottom: "5rem",
                    right: "9rem",
                },

                {
                    name: actionName.Stomp,
                    imageSrc: "./resource/ui/in_game/common_pose/stomp.png",
                    key: "E",

                    bottom: "1rem",
                    right: "1rem",
                },
                {
                    name: actionName.Pickup,
                    imageSrc: "./resource/ui/in_game/stand/pickup.png",
                    key: "Y",

                    bottom: "1rem",
                    right: "5rem",
                },
            ]
        },

        {
            pose: pose.Pick,
            scaleState: scaleState.Normal,
            value: [
                {
                    name: actionName.Stomp,
                    imageSrc: "./resource/ui/in_game/common_pose/stomp.png",
                    key: "E",

                    bottom: "1rem",
                    right: "1rem",
                },
                {
                    name: actionName.Eat,
                    imageSrc: "./resource/ui/in_game/pick/eat.png",
                    key: "O",

                    bottom: "1rem",
                    right: "5rem",
                },
                {
                    name: actionName.Pinch,
                    imageSrc: "./resource/ui/in_game/pick/pinch.png",
                    key: "I",

                    bottom: "1rem",
                    right: "9rem",
                },

                {
                    name: actionName.Run,
                    imageSrc: "./resource/ui/in_game/common_pose/run.png",
                    key: "Shift",

                    bottom: "5rem",
                    right: "1rem",

                    textWidth: "3rem",
                },
                {
                    name: actionName.Bigger,
                    imageSrc: "./resource/ui/in_game/common_pose/bigger.png",
                    key: "K",

                    bottom: "5rem",
                    right: "5rem",
                },
                {
                    name: actionName.Pickdown,
                    imageSrc: "./resource/ui/in_game/pick/pickdown.png",
                    key: "U",

                    bottom: "5rem",
                    right: "9rem",
                },
            ]
        },
        {
            pose: pose.Pick,
            scaleState: scaleState.Big,
            value: [
                {
                    name: actionName.Stomp,
                    imageSrc: "./resource/ui/in_game/common_pose/stomp.png",
                    key: "E",

                    bottom: "1rem",
                    right: "1rem",
                },
                {
                    name: actionName.Eat,
                    imageSrc: "./resource/ui/in_game/pick/eat.png",
                    key: "O",

                    bottom: "1rem",
                    right: "5rem",
                },
                {
                    name: actionName.Pinch,
                    imageSrc: "./resource/ui/in_game/pick/pinch.png",
                    key: "I",

                    bottom: "1rem",
                    right: "9rem",
                },

                {
                    name: actionName.Bigger,
                    imageSrc: "./resource/ui/in_game/common_pose/bigger.png",
                    key: "K",

                    bottom: "5rem",
                    right: "5rem",
                },
                {
                    name: actionName.Pickdown,
                    imageSrc: "./resource/ui/in_game/pick/pickdown.png",
                    key: "U",

                    bottom: "5rem",
                    right: "9rem",
                },
            ]
        },

        {
            pose: pose.Crawl,
            scaleState: scaleState.Normal,
            value: [
                {
                    name: actionName.BreastPress,
                    imageSrc: "./resource/ui/in_game/crawl/breastPress.png",
                    key: "M",

                    bottom: "1rem",
                    right: "1rem",
                },


                {
                    name: actionName.CrawlToStand,
                    imageSrc: "./resource/ui/in_game/crawl/crawlToStand.png",
                    key: "N",

                    bottom: "5rem",
                    right: "1rem",
                },
                {
                    name: actionName.Bigger,
                    imageSrc: "./resource/ui/in_game/common_pose/bigger.png",
                    key: "K",

                    bottom: "5rem",
                    right: "5rem",
                },
            ]
        },
        {
            pose: pose.Crawl,
            scaleState: scaleState.Big,
            value: [
                {
                    name: actionName.BreastPress,
                    imageSrc: "./resource/ui/in_game/crawl/breastPress.png",
                    key: "M",

                    bottom: "1rem",
                    right: "1rem",
                },


                {
                    name: actionName.CrawlToStand,
                    imageSrc: "./resource/ui/in_game/crawl/crawlToStand.png",
                    key: "N",

                    bottom: "5rem",
                    right: "1rem",
                },
                {
                    name: actionName.Bigger,
                    imageSrc: "./resource/ui/in_game/common_pose/bigger.png",
                    key: "K",

                    bottom: "5rem",
                    right: "5rem",
                },
            ]
        },
    ]
}