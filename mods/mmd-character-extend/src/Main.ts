import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service as mmdCharacterService } from "mmd-character-protocol/src/service/ServiceType"
import { state as mmdCharacterState } from "mmd-character-protocol/src/state/StateType"
import { getAttributeData, getBoneNameForLightStressing, getClothCollisionData, getClothHpData, getDataForPartialScale, getFirstPersonControlsData, getMMDData, getMMDMaterialFixData, getPickedTransform, getPutToBreastTransform, getPutToShoeTransform, getSelectCharacterData, getShoeData, getSnapshotData, getUBControlledTransform, handleVMDPath } from "./json/MMDData"
import { getData } from "./json/CollisionShapeData"
import { mmdCharacter } from "./json/Type"

export let getBlockService: getBlockServiceBlockManager<
    mmdCharacterService
> = (api) => {
    return {
        handleVMDPath: handleVMDPath,

        getMMDData: getMMDData,
        getMMDMaterialFixData: getMMDMaterialFixData,
        getClothCollisionData: getClothCollisionData,
        getClothHpData: getClothHpData,
        getFirstPersonControlsData: getFirstPersonControlsData,
        getShoeData: getShoeData,
        getBoneNameForLightStressing: getBoneNameForLightStressing,
        getDataForPartialScale: getDataForPartialScale,
        getPickedTransform: getPickedTransform,
        getUBControlledTransform: getUBControlledTransform,
        getPutToBreastTransform: getPutToBreastTransform,
        getPutToShoeTransform: getPutToShoeTransform,
        getSelectCharacterData: getSelectCharacterData,
        getSnapshotData: getSnapshotData,

        getCollisionShapeData: getData,

        getAttributeData: getAttributeData,

        // isEnablePhysics: (mmdCharacter_) => {
        //     // switch (mmdCharacter_) {
        //     //     case mmdCharacter.Meiko:
        //     //     case mmdCharacter.Vanilla:
        //     //     case mmdCharacter.Meibiwusi:
        //     //     case mmdCharacter.Haku_QP:
        //     //         return true
        //     //     default:
        //     return false
        //     // }
        // },
    }
}

export let createBlockState: createBlockStateBlockManager<
    mmdCharacterState
> = () => {
    return null
}

export let getBlockInfo: getBlockInfoBlockManager = (api) => {
    if (api.internation.isChinese()) {
        return {
            protocolName: "mmd-character-protocol",
            blockName: "mmd-character-extend",
            /*! title should be unique
            * 
            */
            title: "MMD人物->扩展",
            author: "官方",
            category: "MMD人物",
            version: "0.0.1",
        }
    }

    return {
        protocolName: "mmd-character-protocol",
        blockName: "mmd-character-extend",
        /*! title should be unique
        * 
        */
        title: "MMD Character->Extend",
        author: "Author",
        category: "MMD Character",
        version: "0.0.1",
    }

}
