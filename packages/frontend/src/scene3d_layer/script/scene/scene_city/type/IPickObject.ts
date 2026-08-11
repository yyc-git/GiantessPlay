import { lodQueueIndex, name } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../type/StateType"

export interface IPickObject {
    getModelQueueIndex: (state: state, name: name) => lodQueueIndex,
    isCanPickup?: (state: state, name: name) => boolean,
    handlePickup: (state: state, usedGirl, name: name) => Promise<state>,
    getPickedTransform
    getUBControlledTransform
    getPutToBreastTransform
    getPutToShoeTransform,
    updateTransform,
    updateUBControlledTransform,
    updatePutToBreastTransform,
    updatePutToShoeTransform,
    handlePickdown,
    handleFall,
    handleUBControl,
    handlePutToBreast,
    handlePutToShoe,
    getValue: (state: state) => any,
    getHp,
    getLocalTransform,
    getBoxForPick
}