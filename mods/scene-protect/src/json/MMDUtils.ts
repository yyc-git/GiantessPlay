import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"
import { getAllLevelGiantessServiceExceptPlayer } from "../script/Utils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"

export let getAllRandomUsedMMDData = (api: api, state: state) => {
    let data = api.getAllUsedMMDDataForPlayerMMD(state)

    let services = getAllLevelGiantessServiceExceptPlayer(api, state)

    data = api.ArrayUtils.push(data, {
        usedGirl: ArrayUtils.getExn(services, 0).getUsedGirl(),
        data: api.getSpecificGiantessMMDDataExceptMMDData(state,
            data.map(d => d.data)
        )
    })

    return services.slice(1).reduce((data, service) => {
        return api.ArrayUtils.push(data, {
            usedGirl: service.getUsedGirl(),
            data: api.getRandomMMDDataExceptMMDData(state,
                data.map(d => d.data)
            )
        })
    }, data)
}