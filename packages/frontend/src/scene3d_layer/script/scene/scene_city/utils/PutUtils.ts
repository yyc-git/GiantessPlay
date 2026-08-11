import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { handleForPick, queryDataByBox } from "../girl/PickPose";
import { NumberUtils } from "meta3d-jiehuo-abstract";

export let queryPutDataByBox = (state: state, usedGirl, box, rate, puttedNames) => {
    let [transforms, boxes, names, queues] = queryDataByBox(state, usedGirl, box)

    let arr = ArrayUtils.map(transforms, (transform, i) => {
        let getModelQueueIndexFunc
        let name = names[i]

        handleForPick(state, (module_) => {
            getModelQueueIndexFunc = module_.getModelQueueIndex
        }, name)

        return [
            queues[i],
            getModelQueueIndexFunc(state, name),
            name,
            transform.clone(),
            boxes[i].clone()
        ]
    }).filter(data => !puttedNames.includes(data[2]))

    return NumberUtils.randomSelectCount(
        arr,
        Math.round(arr.length * rate)
    )
}