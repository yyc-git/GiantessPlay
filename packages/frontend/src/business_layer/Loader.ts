import { state } from "../scene3d_layer/type/StateType";
import { scene } from "../ui_layer/global/store/GlobalStoreType";
import * as CityScene3D from "../business_layer/CityScene3D";
import { Loader } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../scene3d_layer/state/State";
import { resourceType } from "meta3d-jiehuo-abstract/src/type/StateType";
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

export let getIndexSoundResourceId = () => "background1"

export let getClickSmallSoundResourceId = () => "click_small"

export let getClickMiddleSoundResourceId = () => "click_middle"

export let getClickLargeSoundResourceId = () => "click_large"

export let loadWholeResource = (state: state, setPercentFunc) => {
    return Loader.load(getAbstractState(state), ([
        {
            id: getIndexSoundResourceId(),
            path: [`./resource/whole/audio/${getIndexSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
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
    ] as any)
        , setPercentFunc).then(abstractState => {
            return setAbstractState(state, abstractState)
        })
}
