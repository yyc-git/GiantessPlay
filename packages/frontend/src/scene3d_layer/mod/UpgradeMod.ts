import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { state } from "../type/StateType"
import { buildAPI, getBlockServiceExn } from "./Mod"
import { service } from "upgrade-protocol/src/service/ServiceType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { api } from "type-api/src/Type"
import { modProtocolName } from "./data/ModData"
import { getAllServiceWithCache, getModAPI, getSceneAllBlockNames } from "../script/scene/scene_city/Mod"
import { buildData, upgradeFuncData } from "../script/scene/scene_city/data/build/BuildData"
import { characterType, girlType } from "meta3d-jiehuo-abstract/src/type/StateType"

// export let getStrongBlockName = () => "buff-strong"

// export let getStrongBlockService = (state: state) => {
//     return getBlockServiceExn<service>(state, "buff-protocol", "buff-strong")
// }

// export let getCallGoddessBlockService = (state: state) => {
//     return getBlockServiceExn<service>(state, "buff-protocol", "buff-callgoddess")
// }

// export let getExcitementGirlBlockService = (state: state) => {
//     return getBlockServiceExn<service>(state, "buff-protocol", "buff-excitement-girl")
// }



export let getPassiveBiggerBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "upgrade-protocol", "upgrade-skill-passivebigger")
}


let _getAllBlockNames = (state: state) => {
    return getSceneAllBlockNames(state, [
        "upgrade-skill-enhence-breastpressrub-charm",
        "upgrade-skill-enhence-breastpressrub-puttobreast",
        "upgrade-skill-enhence-sitrub-charm",
        "upgrade-skill-enhence-sitrub-insert",
        "upgrade-skill-enhence-stomprub-puttoshoe",
        "upgrade-skill-enhence-puttobreast-charm",
        "upgrade-skill-enhence-thrust-excitement",
        "upgrade-skill-enhence-puttoshoe-blur",
        "upgrade-skill-enhence-crawllick-eat",
        "upgrade-skill-enhence-crawllick-blur",
        "upgrade-skill-enhence-pinch-crippled",
        "upgrade-skill-enhence-jumpstomp-crippled",
        "upgrade-skill-enhence-stomp-crippled",
        "upgrade-skill-enhence-sit-rotate",
        "upgrade-skill-enhence-stomp-rotate",
        "upgrade-skill-enhence-run-repel",
        "upgrade-skill-fragilegrowth",
        "upgrade-skill-passivebigger",
        "upgrade-skill-damagebigger",
        "upgrade-skill-learn-run",
        "upgrade-skill-jumpstomp",
        "upgrade-skill-leftstomp",
        "upgrade-skill-stomprub",
        "upgrade-skill-standtosit-sittostand",
        "upgrade-skill-sitrub",
        "upgrade-skill-tightenleg",
        "upgrade-skill-picktoub-ubtopick",
        "upgrade-skill-thrust",
        "upgrade-skill-insert",
        "upgrade-skill-puttobreast",
        "upgrade-skill-puttoshoe",
        "upgrade-skill-freebreast",
        "upgrade-skill-freeshoe",
        "upgrade-skill-freeub",
        "upgrade-skill-breast-press",
        "upgrade-skill-breast-press-rub",
        "upgrade-skill-crawl-beat",
        "upgrade-skill-crawl-lick",
        "upgrade-skill-spray-milk",
        "upgrade-skill-ice-overwrite",
        "upgrade-skill-ice-single",
        "upgrade-skill-explode-range",
        "upgrade-skill-explode-single",
        "upgrade-skill-poison-single",
        "upgrade-skill-injure-single",
        "upgrade-defense-stressing-decreasedamage",
        "upgrade-defense-decreasestressingrate",
        "upgrade-defense-increasestrong-whenmeleeattack",
        "upgrade-defense-decreasedamage-whenlie",
        "upgrade-defense-buqu",
        "upgrade-defense-stressprotect",
        "upgrade-defense-limitdamage",
        "upgrade-defense-doorshield",
        "upgrade-defense-increasedefense",
        "upgrade-attack-decreasescale",
        "upgrade-attack-pull",
        "upgrade-attack-shoot-distance-direct",
        "upgrade-attack-shoot-distance-inverse",
        "upgrade-attack-hpratio",
        "upgrade-attack-hpratio-inverse",
        "upgrade-attack-backstab",
        "upgrade-assistant-addmaxexcitement",
        "upgrade-other-addbullet",
        "upgrade-other-increasepickproprange",
        "upgrade-other-partialscale-breast",
        "upgrade-other-partialscale-torsor",
        "upgrade-other-damaged-partialscale-breast",
    ])
}



let _getAllServicesDirectly = (state) => {
    return _getAllBlockNames(state).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.UpgradeProtocol, blockName)
    })
}

let _getAllServices = (state):Array<service> => {
    return getAllServiceWithCache(state, _getAllServicesDirectly,"upgrade")
}

export let addToUpgradeData = (state: state, data: buildData) => {
    let api = getModAPI(state)

    return _getAllServices(state).reduce((result, service) => {
        let upgradeFuncs
        switch (service.getCharacterType()) {
            case characterType.LittleMan:
                upgradeFuncs = [result.littleManUpgradeFuncs]
                break
            case characterType.Giantess:
                upgradeFuncs = [result.giantessUpgradeFuncs]
                break
            case characterType.Both:
                upgradeFuncs = [result.giantessUpgradeFuncs, result.littleManUpgradeFuncs]
                break
        }

        ArrayUtils.forEach(upgradeFuncs, funcs => {
            let _ = ArrayUtils.push(
                funcs,
                service.getUpgradeData(api, state)
            )
        })

        return result
    }, data)
}

export let getUpgradeFuncs = (state: state, girlType_: girlType) => {
    let api = getModAPI(state)

    return _getAllServices(state).reduce((result, service) => {
        if (ArrayUtils.includes(
            NullableUtils.getWithDefault(
                service.getGirlTypes,
                () => [girlType.PlayerGirl]
            )(), girlType_
        )) {
            return ArrayUtils.push(
                result, service.getUpgradeData(api, state)
            )
        }

        return result
    }, [])
}


export let getUpgradeFuncsByName = (state: state, blockName) => {
    let api = getModAPI(state)

    return _getAllServices(state).reduce((result, service) => {
        if (service.getName().toLowerCase().includes(blockName.toLowerCase().replace("-", "_"))) {
            return ArrayUtils.push(
                result, service.getUpgradeData(api, state)
            )
        }

        return result
    }, [])
}
