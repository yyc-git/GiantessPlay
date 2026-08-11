import { createInstance, getItem, setItem } from "localforage"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { scene } from "../../ui_layer/global/store/GlobalStoreType"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"

type levelCompleteData = Record<scene, number>

let store = createInstance({ name: "store_level" })

let _getCacheKey = () => "level_complete"

export let setData = (sceneChapter: scene, levelNumber: number) => {
    return store.getItem<levelCompleteData>(_getCacheKey()).then(data => {
        let map = NullableUtils.getWithDefault(
            data,
            MutableRecordUtils.create()
        )
        if (NullableUtils.getWithDefault(
            MutableRecordUtils.get(map, sceneChapter),
            1
        ) > levelNumber) {
            return
        }

        return store.setItem(_getCacheKey(), MutableRecordUtils.set(map, sceneChapter, levelNumber)
        )
    })
}

export let getData = () => {
    return store.getItem<levelCompleteData>(_getCacheKey())
}

export let isValid = (data: nullable<levelCompleteData>, sceneChapter: scene, levelNumber: number) => {
    // if (levelNumber == 1) {
    //     return true
    // }

    // if (NullableUtils.isNullable(data)) {
    //     return false
    // }

    // return NullableUtils.getWithDefault(
    //     NullableUtils.map(l => {
    //         // return levelNumber >= l
    //         return l + 1 >= levelNumber
    //     }, MutableRecordUtils.get(NullableUtils.getExn(data), sceneChapter)),
    //     false
    // )

    return true
}
