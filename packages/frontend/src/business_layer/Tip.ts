import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getLanguageTextData } from "../scene3d_layer/internation/Data"
import { getModAPI } from "../scene3d_layer/script/scene/scene_city/Mod"
import { language, state } from "../scene3d_layer/type/StateType"

export enum languageKey {
    // UpgradeTip1WhenLoading,
    ActiveTip,
    UpgradeTip2WhenLoading,
    CaptureTipWhenLoading,
    CoinGemUsageTipWhenLoading,
    AttenuationByHeightTip,
    HowToGetGiantessCharacterTip,
    TooHighCantInteractTip,
    ReviveStoneTip,
    MultipleCareerTip,
    ZeroDamageTip,
    CustomControlTip,
    RewardRateTip,
    DuplicateUseTip,
    // CareerTip1WhenLoading,
}

let _getTextData = () => {
    return {
        [language.Chinese]: {
            // [languageKey.UpgradeTip1WhenLoading]: "升2级可选择一次升级方向",
            [languageKey.ActiveTip]: "激活游戏后，可以解锁巨大娘人物、获得更多的宝石奖励、更容易获得神器",
            [languageKey.UpgradeTip2WhenLoading]: "升级后，可切换为手动弹出，从而可点击左上角的黄色的X或者按“X”（PC端）来选择升级方向",
            [languageKey.CaptureTipWhenLoading]: "距离关卡巨大娘较近时，使用捕获器可有概率捕获该角色",
            [languageKey.CoinGemUsageTipWhenLoading]: "金币仅限局内使用；宝石用于局外的天赋",
            [languageKey.AttenuationByHeightTip]: "巨大娘越高，获得的收益(宝石、经验值、道具等)越少",
            [languageKey.HowToGetGiantessCharacterTip]: "使用小人角色时，在巨大娘附近使用“捕获器”道具可有概率捕获；然后重开关卡即可选择对应的人物",
            [languageKey.TooHighCantInteractTip]: "巨大娘大于400米后，不能开宝箱和商店（可以使用缩小药水缩小后再开）",
            [languageKey.ReviveStoneTip]: "复活石可以无损复活角色。可以通过 击败关卡巨大娘或者完成Boss关卡、商店购买 的途径有一定几率获得",
            [languageKey.MultipleCareerTip]: "可以选择多个职业，最多3个",
            [languageKey.ZeroDamageTip]: "和平主义者、受虐狂等职业会导致您的伤害为0",
            [languageKey.CustomControlTip]: "移动端您可以在局内设置->操作 中设置键位",
            [languageKey.RewardRateTip]: "已有的复活石、捕获器、巨大娘人物使用道具越多，爆率越低",
            [languageKey.DuplicateUseTip]: "重复使用召唤女神神器可叠加持续时间",
        },
        [language.English]: {
            // [languageKey.UpgradeTip1WhenLoading]: "Choose an upgrade direction every 2 levels",
            [languageKey.ActiveTip]: "After activate game, you can unlock all characters of giantess, receive more gem rewards, and easily obtain artifacts",
            [languageKey.UpgradeTip2WhenLoading]: "After upgrading, it can be switched to manual popup, so that you can click on the yellow X in the upper left corner or press \"X\" (PC side) to select the upgrade direction",
            [languageKey.CaptureTipWhenLoading]: "Use Capture prop near giantess for capture chance",
            [languageKey.CoinGemUsageTipWhenLoading]: "Coins: In-level only. Gems: Permanent talent upgrades",
            [languageKey.AttenuationByHeightTip]: "The taller the giantess, the less reward (gem, experience, item, etc.) she will receive",
            [languageKey.HowToGetGiantessCharacterTip]: "When using the little man character, using the 'Capture' item near the giantess has a chance to capture her; then, restarting the level allows you to select the corresponding character",
            [languageKey.TooHighCantInteractTip]: "When the Giantess character is more than 400 meters, you cannot open treasure chests or shops (you can use a smaller water item to shrink before opening)",
            [languageKey.ReviveStoneTip]: "Resurrection Stone item can revive characters without losing talent. It can be obtained with a certain probability by defeating the level Giantess or completing the Boss level, or by purchasing it from the store",
            [languageKey.MultipleCareerTip]: "Can select multiple careers, up to a maximum of 3",
            [languageKey.ZeroDamageTip]: "Career like Peace, Masochism will cause your damage to zero",
            [languageKey.CustomControlTip]: "On mobile, you can set skill button's position in Setting->Control after enter game",
            [languageKey.RewardRateTip]: "The more count of resurrection stone, capture, giantess character use items you have, the lower drop rate",
            [languageKey.DuplicateUseTip]: "Reusing the Call Goddess artifact can stack duration",
        }
    }
}


export type tipData = {
    tip: string
}

export let getTipData = (state: state): Array<tipData> => {
    let api = getModAPI(state)

    return [
        // {
        //     tip: api.getLanguageDataByData(state, _getTextData(), languageKey.UpgradeTip1WhenLoading)
        // },
        {
            tip: api.getLanguageDataByData(state, _getTextData(), languageKey.ActiveTip)
        },
        {
            tip: api.getLanguageDataByData(state, _getTextData(), languageKey.UpgradeTip2WhenLoading)
        },
        {
            tip: api.getLanguageDataByData(state, _getTextData(), languageKey.CaptureTipWhenLoading)
        },
        {
            tip: api.getLanguageDataByData(state, _getTextData(), languageKey.CoinGemUsageTipWhenLoading)
        },
        {
            tip: api.getLanguageDataByData(state, _getTextData(), languageKey.AttenuationByHeightTip)
        },
        {
            tip: api.getLanguageDataByData(state, _getTextData(), languageKey.HowToGetGiantessCharacterTip)
        },
        {
            tip: api.getLanguageDataByData(state, _getTextData(), languageKey.TooHighCantInteractTip)
        },
        {
            tip: api.getLanguageDataByData(state, _getTextData(), languageKey.ReviveStoneTip)
        },
        {
            tip: api.getLanguageDataByData(state, _getTextData(), languageKey.MultipleCareerTip)
        },
        {
            tip: api.getLanguageDataByData(state, _getTextData(), languageKey.ZeroDamageTip)
        },
        {
            tip: api.getLanguageDataByData(state, _getTextData(), languageKey.CustomControlTip)
        },
        {
            tip: api.getLanguageDataByData(state, _getTextData(), languageKey.RewardRateTip)
        },
        {
            tip: api.getLanguageDataByData(state, _getTextData(), languageKey.DuplicateUseTip)
        },
    ]
}

export let getRandomTip = (state: state) => {
    return NumberUtils.randomSelect(getTipData(state)).tip
}