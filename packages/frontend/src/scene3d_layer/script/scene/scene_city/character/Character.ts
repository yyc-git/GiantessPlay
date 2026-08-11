import { Vector3 } from "three";
import { usedGirlEnum, character, missionFinishStatus, } from "../type/StateType";
import { getConfigData, getState, isLittleCharacterType, mutableSetState, setConfigData, setState } from "../CityScene";
import { state } from "../../../../type/StateType";
import { modelName } from "../little_man_data/ModelData";
import { List } from "immutable";
import * as Backend from "backend/src/Main"
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getCurrentModelData } from "../little_man/LittleMan";
import { getCurrentMMDCharacterName, setCurrentMMDCharacterByUsedGirl } from "../girl/Girl";
import { getIsDebug, getIsProduction } from "../../Scene";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
// import { mmdCharacter } from "mmd-character-protocol/src/service/ServiceType";
import { mmdCharacter } from "mmd-character-default/src/json/Type"
import { readState } from "../../../../state/State";
import { getAllBlockServiceFuncWithDefault } from "../../../../mod/Mod";
import { service } from "mmd-character-protocol/src/service/ServiceType";
import { modProtocolName } from "../../../../mod/data/ModData";
import { getAllSelectCharacterData } from "../../../../mod/MMDMod";
// import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

type characterDataBackend = {
    littleManCharacters: Array<{
        modelName: modelName,
        isAlive: boolean
    }>,
    giantessCharacters: Array<{
        mmdCharacter: mmdCharacter,
        isAlive: boolean
    }>,
}


const _v1 = new Vector3();
const _v2 = new Vector3();


export let createState = (): character => {
    return {
        littleManCharacters: List(),
        giantessCharacters: List(),
    }
}

let _getState = (state): character => {
    return getState(state).character
}

let _setState = (state, characterState: character) => {
    return setState(state, {
        ...getState(state),
        character: characterState
    })
}

let _mutableSetState = (state, buildState: character) => {
    // return mutableSetState(state, {
    //     ...getState(state),
    //     character: buildState
    // })
    // getState(state).character = buildState
    readState().cityScene.character = buildState
    return state
}


export let getLittleManCharacters = (state: state) => {
    return _getState(state).littleManCharacters
}

export let getGiantessCharacters = (state: state) => {
    return _getState(state).giantessCharacters
}

export let setLittleManCharacters = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        littleManCharacters: value
    })
}

export let setGiantessCharacters = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        giantessCharacters: value
    })
}

// let _getFirstMMDCharacter = (state: state) => {
//     return getConfigData(state).allMMDData[0][0]
// }

export let getCharacterDataFromBackend = (state: state, setCharacterFunc) => {
    return Backend.getCharacterData<characterDataBackend>().then(characterData => {
        if (getIsDebug(state)) {
            characterData = {
                littleManCharacters: [
                    {
                        modelName: modelName.Infantry,
                        isAlive: true
                    },
                    {
                        modelName: modelName.Dreyar,
                        isAlive: true
                    },
                    {
                        modelName: modelName.Mutant,
                        isAlive: true
                    }
                ],
                giantessCharacters: [
                    // {
                    //     mmdCharacter: mmdCharacter.Haku_Lady,
                    //     isAlive: true
                    // },
                    // {
                    //     mmdCharacter: mmdCharacter.Baixi_Maid,
                    //     isAlive: true
                    // },
                    {
                        // mmdCharacter: "Changee",
                        // mmdCharacter: mmdCharacter.Baixi_Maid,
                        // mmdCharacter: "Youye",
                        // mmdCharacter:  "Kongzhilvzhe",
                        // mmdCharacter:  "Qiyana",
                        // mmdCharacter:  "Noah",
                        // mmdCharacter:  "Lipusi",
                        // mmdCharacter: "Ciming",
                        // mmdCharacter: "Sunxiaomei",
                        // mmdCharacter: "Meibiwusi",
                        // mmdCharacter: "Vanilla",
                        // mmdCharacter: "Haku_QP",
                        // mmdCharacter: "Haku_Lady",
                        mmdCharacter: "Nero",
                        // mmdCharacter: "Xiaye1",
                        // mmdCharacter: "Xiaye2",
                        // mmdCharacter: "Moye",
                        // mmdCharacter: "XiaHui",
                        // mmdCharacter: "Miku1",
                        isAlive: true
                    } as any,
                ],
            }
        }


        if (NullableUtils.isNullable(characterData)) {
            // if (getIsDebug(state)) {
            //     // if (true) {
            //     // state = _setState(state, {
            //     // state = _mutableSetState(state, {
            //     //     ..._getState(state),
            //     //     giantessCharacters: List(
            //     //         [
            //     //             // {
            //     //             //     mmdCharacter: mmdCharacter.Haku_Lady,
            //     //             //     isAlive: true
            //     //             // },
            //     //             // {
            //     //             //     mmdCharacter: mmdCharacter.Baixi_Maid,
            //     //             //     isAlive: true
            //     //             // },
            //     //             {
            //     //                 // mmdCharacter: "Changee",
            //     //                 // mmdCharacter: mmdCharacter.Baixi_Maid,
            //     //                 // mmdCharacter: "Youye",
            //     //                 // mmdCharacter:  "Kongzhilvzhe",
            //     //                 // mmdCharacter:  "Qiyana",
            //     //                 // mmdCharacter:  "Noah",
            //     //                 // mmdCharacter:  "Lipusi",
            //     //                 mmdCharacter: "Ciming",
            //     //                 // mmdCharacter: "Sunxiaomei",
            //     //                 // mmdCharacter: "Meibiwusi",
            //     //                 // mmdCharacter: "Vanilla",
            //     //                 // mmdCharacter: "Haku_QP",
            //     //                 // mmdCharacter: "Nero",
            //     //                 // mmdCharacter: "Xiaye1",
            //     //                 // mmdCharacter: "Xiaye2",
            //     //                 // mmdCharacter: "Moye",
            //     //                 // mmdCharacter: "XiaHui",
            //     //                 // mmdCharacter: "Miku1",
            //     //                 // mmdCharacter: "Haku_Lady",
            //     //                 isAlive: true
            //     //             } as any,
            //     //         ]
            //     //         // getAllSelectCharacterData(state)
            //     //         //     .map(d => {
            //     //         //         return {
            //     //         //             mmdCharacter: d[1],
            //     //         //             isAlive: true
            //     //         //         }
            //     //         //     })
            //     //     ),
            //     //     littleManCharacters: List([
            //     //         {
            //     //             modelName: modelName.Infantry,
            //     //             isAlive: true
            //     //         },
            //     //         {
            //     //             modelName: modelName.Dreyar,
            //     //             isAlive: true
            //     //         },
            //     //         {
            //     //             modelName: modelName.Mutant,
            //     //             isAlive: true
            //     //         }
            //     //     ])
            //     // })

            //     // state = setCurrentMMDCharacterByUsedGirl(state, NullableUtils.getExn(getGiantessCharacters(state).first()).mmdCharacter, usedGirlEnum.PlayerGirl)
            //     setCharacterFunc(NullableUtils.getExn(getGiantessCharacters(state).first()).mmdCharacter)

            //     return state
            // }

            return _mutableClearCharacterData(state, setCharacterFunc)
        }

        characterData = NullableUtils.getExn(characterData)

        if (!getIsProduction(state)) {
            // state = setCurrentMMDCharacterByUsedGirl(state, NullableUtils.getExn(ArrayUtils.getLast<any>(characterData.giantessCharacters)).mmdCharacter, usedGirlEnum.PlayerGirl)
            setCharacterFunc(ArrayUtils.getLast<any>(characterData.giantessCharacters).mmdCharacter)
        }

        // return _setState(state, {
        return _mutableSetState(state, {
            ..._getState(state),
            littleManCharacters: List(characterData.littleManCharacters),
            giantessCharacters: List(characterData.giantessCharacters),
        })
    })
}

export let updateCharacterWhenNotAlive = (state: state) => {
    if (isLittleCharacterType(state)) {
        let modelName = getCurrentModelData(state).name

        state = _setState(state, {
            ..._getState(state),
            littleManCharacters: _getState(state).littleManCharacters.map(c => {
                if (c.modelName == modelName) {
                    return {
                        ...c,
                        isAlive: false
                    }
                }

                return c
            }),
        })
    }
    else {
        let mmdCharacterName = getCurrentMMDCharacterName(state, usedGirlEnum.PlayerGirl)

        state = _setState(state, {
            ..._getState(state),
            giantessCharacters: _getState(state).giantessCharacters.map(c => {
                if (c.mmdCharacter == mmdCharacterName) {
                    return {
                        ...c,
                        isAlive: false
                    }
                }

                return c
            }),
        })
    }

    // return updateCharacterBackend(state)
    return state
}

// export let updateCharacterAndBackendWhenNotAlive = (state: state) => {
//     state = updateCharacterWhenNotAlive(state)

//     return updateCharacterBackend(state)
// }


// export let updateCharacterWhenMissionFinish = (state: state, missionFinishStatus_) => {
//     switch (missionFinishStatus_) {
//         case missionFinishStatus.Fail:
//             if (isLittleCharacterType(state)) {
//                 let modelName = getCurrentModelData(state).name

//                 state = _setState(state, {
//                     ..._getState(state),
//                     littleManCharacters: _getState(state).littleManCharacters.map(c => {
//                         if (c.modelName == modelName) {
//                             return {
//                                 ...c,
//                                 isAlive: false
//                             }
//                         }

//                         return c
//                     }),
//                 })
//             }
//             else {
//                 let mmdCharacterName = getCurrentMMDCharacterName(state, usedGirl)

//                 state = _setState(state, {
//                     ..._getState(state),
//                     giantessCharacters: _getState(state).giantessCharacters.map(c => {
//                         if (c.mmdCharacter == mmdCharacterName) {
//                             return {
//                                 ...c,
//                                 isAlive: false
//                             }
//                         }

//                         return c
//                     }),
//                 })
//             }
//         // return updateCharacterBackend(state)
//         default:
//             // return Promise.resolve(state)
//             return updateCharacterBackend(state)
//     }

// }

let _buildCharacterData = (state): characterDataBackend => {
    return {
        littleManCharacters: _getState(state).littleManCharacters.toArray(),
        giantessCharacters: _getState(state).giantessCharacters.toArray() as any
    }
}

export let updateCharacterBackend = (state: state) => {
    return Backend.setCharacterData(_buildCharacterData(state)).then(_ => state)
}

export let dispose = (state: state) => {
    return state
}

export let markAliveAndUpdateBackend = (state: state, character, characterType_: characterType) => {
    if (characterType_ == characterType.LittleMan) {
        state = _setState(state, {
            ..._getState(state),
            littleManCharacters: _getState(state).littleManCharacters.map(c => {
                if (c.modelName == character) {
                    return {
                        ...c,
                        isAlive: true
                    }
                }

                return c
            }),
        })
    }
    else {
        state = _setState(state, {
            ..._getState(state),
            giantessCharacters: _getState(state).giantessCharacters.map(c => {
                if (c.mmdCharacter == character) {
                    return {
                        ...c,
                        isAlive: true
                    }
                }

                return c
            }),
        })
    }

    return updateCharacterBackend(state)
}

export let clearCharacterData = (state, setCharacterFunc) => {
    // state = _mutableSetState(state, {
    state = _setState(state, {
        ..._getState(state),
        // giantessCharacters: List([]),
        giantessCharacters: List([
            {
                mmdCharacter: mmdCharacter.Baixi_Maid,
                isAlive: true
            } as any,
            // {
            //     mmdCharacter: _getFirstMMDCharacter(state),
            //     isAlive: true
            // },
        ]),
        littleManCharacters: List([
            {
                modelName: modelName.Infantry,
                isAlive: true
            },
        ])
    })

    setCharacterFunc(NullableUtils.getExn(getGiantessCharacters(state).first()).mmdCharacter)

    return state
}

let _mutableClearCharacterData = (state, setCharacterFunc) => {
    state = _mutableSetState(state, {
        // state = _setState(state, {
        ..._getState(state),
        // giantessCharacters: List([]),
        giantessCharacters: List([
            {
                mmdCharacter: mmdCharacter.Baixi_Maid,
                isAlive: true
            } as any,
            // {
            //     mmdCharacter: _getFirstMMDCharacter(state),
            //     isAlive: true
            // },
        ]),
        littleManCharacters: List([
            {
                modelName: modelName.Infantry,
                isAlive: true
            },
            {
                modelName: modelName.Mutant,
                isAlive: true
            },
            {
                modelName: modelName.Ely,
                isAlive: true
            },
            {
                modelName: modelName.Maria,
                isAlive: true
            },
            {
                modelName: modelName.Dreyar,
                isAlive: true
            },
            {
                modelName: modelName.Abe,
                isAlive: true
            },
            {
                modelName: modelName.Mousey,
                isAlive: true
            },
            {
                modelName: modelName.Ninja,
                isAlive: true
            },
        ])
    })

    setCharacterFunc(NullableUtils.getExn(getGiantessCharacters(readState()).first()).mmdCharacter)

    return state
}