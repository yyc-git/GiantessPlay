import { state } from "../scene3d_layer/type/StateType";
import { scene } from "../ui_layer/global/store/GlobalStoreType";
import * as CityScene3D from "../business_layer/CityScene3D";
import { Loader } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../scene3d_layer/state/State";
import { resourceType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { Event } from "meta3d-jiehuo-abstract";
import { buildAPI } from "../scene3d_layer/mod/Mod";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { writeState } from "./State";
import { handleNetworkRequest } from "../ui_layer/utils/BackendUtils";
import { getModAPI } from "../scene3d_layer/script/scene/scene_city/Mod";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getBaseMap1ResourceId, getCharacterBloodResourceId, getCharacterShadowResourceId, getName } from "../scene3d_layer/script/scene/scene_city/CityScene";
// import * as WarehouseScene3D from "../business_layer/WarehouseScene3D";

// export let loadCurrentSceneResource = (state: state, setPercentFunc, currentScene, levelNumber) => {
//     switch (currentScene) {
//         case scene.Play:
//             return CityScene3D.loadResource(state, setPercentFunc, levelNumber)
//         // case scene.Warehouse:
//         // default:
//         //     return WarehouseScene3D.loadResource(state, setPercentFunc, levelNumber)
//     }
// }

// export let getIndexSoundResourceId = () => "background1"

export let getClickSmallSoundResourceId = () => "click_small"

export let getClickMiddleSoundResourceId = () => "click_middle"

export let getClickLargeSoundResourceId = () => "click_large"

export let getRewardSoundResourceId = () => "reward"

export let loadWholeResource = (state: state, setPercentFunc) => {
    return Event.trigger(state, getAbstractState, getModAPI(state).event.getLoadWholeResourceEventName(), NullableUtils.getEmpty()).then(state => {
        writeState(state)

        // return handleNetworkRequest(state => {
        //     return Loader.load(getAbstractState(state), ([
        //         // {
        //         //     id: getIndexSoundResourceId(),
        //         //     path: [`./resource/whole/audio/${getIndexSoundResourceId()}.mp3`],
        //         //     type: resourceType.Audio
        //         // },
        //         {
        //             id: getClickSmallSoundResourceId(),
        //             path: [`./resource/whole/audio/${getClickSmallSoundResourceId()}.mp3`],
        //             type: resourceType.Audio
        //         },
        //         {
        //             id: getClickMiddleSoundResourceId(),
        //             path: [`./resource/whole/audio/${getClickMiddleSoundResourceId()}.mp3`],
        //             type: resourceType.Audio
        //         },
        //         {
        //             id: getClickLargeSoundResourceId(),
        //             path: [`./resource/whole/audio/${getClickLargeSoundResourceId()}.mp3`],
        //             type: resourceType.Audio
        //         },
        //     ] as any)
        //         .concat(Loader.getNeedLoadResourceData(getAbstractState(state))),
        //         setPercentFunc)
        //         .then(abstractState => {
        //             // if (Math.random() < 0.8) {
        //             //     throw new Error("network request error")
        //             // }
        //             // throw new Error("QuotaExceededError")

        //             writeState(setAbstractState(state, abstractState))
        //         })
        // }, (state) => {
        //     let abstractState = Loader.clearNeedLoadResourceData(getAbstractState(state))

        //     return setAbstractState(state, abstractState)
        // })
        return Loader.load(getAbstractState(state), ([
            // {
            //     id: getIndexSoundResourceId(),
            //     path: [`./resource/whole/audio/${getIndexSoundResourceId()}.mp3`],
            //     type: resourceType.Audio
            // },

            {
                id: getClickSmallSoundResourceId(),
                path: [`./resource/whole/audio/${getClickSmallSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getClickMiddleSoundResourceId(),
                path: [`./resource/whole/audio/${getClickMiddleSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getClickLargeSoundResourceId(),
                path: [`./resource/whole/audio/${getClickLargeSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
            {
                id: getRewardSoundResourceId(),
                path: [`./resource/whole/audio/${getRewardSoundResourceId()}.mp3`],
                type: resourceType.Audio
            },
        ] as any)
            .concat(
                /*! load here again to ensure load success
                * 
                */
                [
                    {
                        id: getBaseMap1ResourceId(),
                        path: `./resource/${getName()}/terrain/base/${getBaseMap1ResourceId()}.png`,
                        type: resourceType.Texture
                    },
                    {
                        id: getCharacterShadowResourceId(),
                        path: `./resource/${getName()}/cityzen/${getCharacterShadowResourceId()}.png`,
                        type: resourceType.Texture
                    },
                    {
                        id: getCharacterBloodResourceId(),
                        path: `./resource/${getName()}/cityzen/${getCharacterBloodResourceId()}.png`,
                        type: resourceType.Texture
                    },

                ]
            )
            .concat(Loader.getNeedLoadResourceData(getAbstractState(state))),
            setPercentFunc)
            .then(abstractState => {
                // writeState(setAbstractState(state, abstractState))

                // let abstractState = Loader.clearNeedLoadResourceData(getAbstractState(state))

                return setAbstractState(state, abstractState)
            })
    })
}
