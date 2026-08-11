import { state } from "enemy-elite-giantess-share-protocol/src/state/StateType"
import { Map } from "immutable"
import { api } from "type-api/src/Type"

export let createState = (api: api): state => {
    return {
        eliteGiantessMap: api.MutableMapUtils.create(),

        // glb: NullableUtils.getEmpty(),

        stateMachineMap: api.MutableMapUtils.create(),
        // hpMap: api.MutableMapUtils.create(),
        hpMap: Map(),

        lodQueueIndexMap: api.MutableMapUtils.create(),

        moveTweenMap: api.MutableMapUtils.create(),

        // shadowQueueMap: api.MutableMapUtils.create(),

        bloodData: api.createBloodData(),

        allClipDurations: api.MutableMapUtils.create(),
        allClipSteps: api.MutableMapUtils.create(),

        moveDataMap: api.MutableMapUtils.create(),

        // crowdPositions: [],

        initialQuaternionMap: api.MutableMapUtils.create(),

        // rocketQueue: NullableUtils.getEmpty(),

        // commander: createCommanderState(),
    }
}