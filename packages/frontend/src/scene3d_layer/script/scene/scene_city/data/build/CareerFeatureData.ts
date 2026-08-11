import { characterType, fontType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "../../../../../type/StateType"
import { getLanguageDataByData, getLanguageTextData, languageKey, getLanguageTextVariableData, languageVariableKey as languageVariableKey_, variableData } from "../../../../../internation/Data"
import { api } from "type-api/src/Type"
import { camp, collisionPart, damageType, giantessAddToSkeletonData, missionFinishStatus, propName, usedGirl, usedGirlEnum } from "../../type/StateType"
import { coin, gem, rate } from "../reward/RewardDataType"
import { visibleData } from "../../behaviour_tree/action_node/utils/GiantessSelectTargetUtils"
import { nullable } from "block/src/Type"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { generateKey, getLastTime, getPassTime, setEnhenceByCarryLevel, setExpFactor, setIsControlledUnitCanAttack, setIsUseFullHpReplaceCoinType, setLastTime, setUBCapacityFactor } from "../../build/Career"
import { getTradeData } from "../interaction/InteractionData"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { endSepcialTime, getNow, getSepcialTimeDuration, isStartSepcialTime, isStartSepcialTimeByKey, startSepcialTime } from "../../Time"
import { getCallResourceId, getGetPropResourceId, isLittleCharacterType } from "../../CityScene"
import { getSystemVolume } from "../../utils/SoundUtils"
import { addPropCount, buildAllProps, getTitle } from "../../reward/Prop"
import { buildOpenTradeHandlerEventData, buildShowUILightTipEventData, buildShowUITipEventData, getAfterBuyTradeEventName, getGetPropEventName, getOpenTradeEventName, getShowUILightTipEventName, getShowUITipEventName, getSwitchWeaponEventName } from "../../../../../utils/EventUtils"
import { isEliteGiantess } from "../../../../../mod/EliteGiantessMod"
import { getDuelistFactor, getEnhenceArmyFactor, getEnhenceEliteGiantessFactor, getEnhenceLevelGiantessFactor, setDuelistFactor, setEnhenceArmyFactor, setEnhenceEliteGiantessFactor, setEnhenceLevelGiantessFactor } from "../../difficulty/Difficulty"
import { addHp, getCurrentUsedGirls, isGirl, isLevelGiantess, isLevelGiantessExceptPlayer, triggerAction } from "../../girl/Girl"
import { getDestroyedEventName } from "../../utils/EventUtils"
import { getCoinFactor, getItemPriceFactor, getPropCountFactor, getRealTotalCoin, getTotalCoin, setCoinFactor, setItemPriceFactor, setPropCountFactor } from "../../reward/RewardGenerator"
import { getPlayerFullHp, getPlayerHp } from "../../utils/PlayerUtils"
import { getLevelCoin, getRealLevelCoin, setLevelCoin, setTotalCoin } from "../../reward/Coin"
import { isArmy, isArmyExceptEliteGiantess } from "../../utils/ArmyUtils"
import { hasOpenedModal, pushLightUITips, setLightUITips } from "../../UI"
import { getFreeBuyCount, getRandomTrade, getTradeVarietyFactor, setFreeBuyCount, setTradeVarietyFactor } from "../../Interaction"
import { setLockedAttackTargetToPlayer } from "../../manage/mission/Mission"
import { getWeaponGirlBlockService } from "../../../../../mod/InteractionMod"
import { getAllWeaponNames, getCurrentGunName, getCurrentGunWeaponName } from "../../little_man/Gun"
import { animationName, excitement, experienceFactor } from "../DataType"
import { isArtifact } from "../../../../../mod/PropOtherMod"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { clearAttackTargetData } from "../../manage/city1/Army"
import { addMarkStatusToName } from "../../utils/StatusUtils"
import { isLittleMan } from "../../little_man/LittleMan"
import { setDefenseFactor, setEmitSpeedFactor, setMoveSpeed } from "../../utils/build/ArmyBuildUtils"
import { armorPiercingForceRatio, critRatio, weaponType } from "../ValueType"
import { getUnitFullHpAndExcitement } from "../../girl/PickPose"
import { getBody } from "../mmd/MMDData"
import { getAbsorbBlockService, getBuffProtocolName, getBuffCharmBlockName, getBuffArmyCharmBlockName } from "../../../../../mod/BuffMod"
import { isEatingFromPick } from "../../girl/PickPoseUtils"
import { getSprayMilkBlockService } from "../../../../../mod/SkillGiantessMod"
import { service } from "buff-protocol/src/service/ServiceType"
import { Vector3 } from "three"

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();


export enum careerFeatureName {
    Empty = "Empty",
    IncreaseLuck = "IncreaseLuck",
    DecreaseLuck = "DecreaseLuck",
    IncreaseMoveSpeed = "IncreaseMoveSpeed",
    DecreaseArmorStrength = "DecreaseArmorStrength",
    ReduceDamage = "ReduceDamage",
    IncreaseFullHp = "IncreaseFullHp",
    IncreaseRestoreHpStrength = "IncreaseRestoreHpStrength",
    IncreaseStubRate = "IncreaseStubRate",
    IncreaseItemPrice = "IncreaseItemPrice",
    DecreaseItemPrice = "DecreaseItemPrice",
    IncreaseGetCoin = "IncreaseGetCoin",
    DecreaseRewardPropCount = "DecreaseRewardPropCount",
    // IncreaseLevelGiantessExcitementClimaxRate = "IncreaseLevelGiantessExcitementClimaxRate",
    IncreaseTradeVariety = "IncreaseTradeVariety",
    IncreaseUpgradeWeaponCost = "IncreaseUpgradeWeaponCost",
    EnhenceByFreeUB = "EnhenceByFreeUB",
    EnhenceByFreeShoe = "EnhenceByFreeShoe",
    IncreaseUBCapacity = "IncreaseUBCapacity",
    IncreaseTrigoneAndButtDamage = "IncreaseTrigoneAndButtDamage",
    EnhenceByCarry = "EnhenceByCarry",
    IncreaseGiantessDamaged = "IncreaseGiantessDamaged",
    IncreaseExp = "IncreaseExp",
    DecreaseGiantessDefense = "DecreaseGiantessDefense",

    AfterMissionComplete_AliveOneEnemy_GetReward = "AfterMissionComplete_AliveOneEnemy_GetReward",
    IncreaseMeleeDamageByMoveSpeed = "IncreaseMeleeDamageByMoveSpeed",
    DecreaseDefenseWhenNotMove = "DecreaseDefenseWhenNotMove",
    ReduceDamageButIncreaseWhenDamaged = "ReduceDamageButIncreaseWhenDamaged",
    ReduceDamageButIncreaseWhenSingleDamage = "ReduceDamageButIncreaseWhenSingleDamage",
    ReduceGiantessDamage = "ReduceGiantessDamage",
    IncreaseDamageMMDGiantessWeakness = "IncreaseDamageMMDGiantessWeakness",
    IncreaseAttackWhenStubExcitementClimax = "IncreaseAttackWhenStubExcitementClimax",
    IncreaseFullHpByEat = "IncreaseFullHpByEat",
    RemainScaleByEat = "RemainScaleByEat",
    UseFullHpReplaceCoin = "UseFullHpReplaceCoin",
    AfterMissionComplete_ConvertCoinToFullHp = "AfterMissionComplete_ConvertCoinToFullHp",
    // GetRandomPropEveryMinute = "GetRandomPropEveryMinute",
    GetGoodsEveryMinute = "GetGoodsEveryMinute",
    EnhenceGiantessAfterBeat = "EnhenceGiantessAfterBeat",
    EnhenceArmyAfterBeat = "EnhenceArmyAfterBeat",
    IncreaseDamageByCoin = "IncreaseDamageByCoin",
    IncreaseGetCoinEveryMimute = "IncreaseGetCoinEveryMimute",
    IncreaseGetCoinWithMaxHp = "IncreaseGetCoinWithMaxHp",
    // DecreaseLevelCoinEveryTwoMinutes = "DecreaseLevelCoinEveryTwoMinutes",
    DecreaseCoinAfterBuyTrade = "DecreaseCoinAfterBuyTrade",
    Duelist = "Duelist",
    BulletSpeedMax = "BulletSpeedMax",
    ConvertToFriendCampByFreeUB = "ConvertToFriendCampByFreeUB",
    ControlledUnitCanAttack = "ControlledUnitCanAttack",
    DamageControlledUnit = "DamageControlledUnit",
    AbsorbDeathControlledUnit = "AbsorbDeathControlledUnit",
    DamagedSprayMilk = "DamagedSprayMilk",
    BreastFeeding = "BreastFeeding",
    CharmNearFoot = "CharmNearFoot",
    // InhaleStompRangeUnits = "InhaleStompRangeUnits",
    ConvertToFriendCampForPutToShoe = "ConvertToFriendCampForPutToShoe",


}

export enum category {
    Number,
    Mechanism,
}

export enum languageVariableKey {
    Empty,
    IncreaseLuck,
    DecreaseLuck,
    IncreaseMoveSpeed,
    DecreaseArmorStrength,
    ReduceDamage,
    IncreaseFullHp,
    IncreaseRestoreHpStrength,
    IncreaseStubRate,
    IncreaseItemPrice,
    DecreaseItemPrice,
    IncreaseGetCoin,
    DecreaseRewardPropCount,
    // IncreaseLevelGiantessExcitementClimaxRate,
    IncreaseTradeVariety,
    IncreaseUpgradeWeaponCost,
    EnhenceByFreeUB,
    EnhenceByFreeShoe,
    IncreaseUBCapacity,
    IncreaseTrigoneAndButtDamage,
    EnhenceByCarry,
    IncreaseGiantessDamaged,
    IncreaseExp,
    DecreaseGiantessDefense,

    AfterMissionComplete_AliveOneEnemy_GetReward,
    IncreaseMeleeDamageByMoveSpeed,
    DecreaseDefenseWhenNotMove,
    ReduceDamageButIncreaseWhenDamaged,
    ReduceDamageButIncreaseWhenSingleDamage,
    ReduceGiantessDamage,
    IncreaseDamageMMDGiantessWeakness,
    IncreaseAttackWhenStubExcitementClimax,
    IncreaseFullHpByEat,
    RemainScaleByEat,
    UseFullHpReplaceCoin,
    AfterMissionComplete_ConvertCoinToFullHp,
    // GetRandomPropEveryMinute,
    GetGoodsEveryMinute,
    EnhenceGiantessAfterBeat,
    EnhenceArmyAfterBeat,
    IncreaseDamageByCoin,
    IncreaseGetCoinEveryMimute,
    IncreaseGetCoinWithMaxHp,
    DecreaseCoinAfterBuyTrade,
    Duelist,
    BulletSpeedMax,
    ConvertToFriendCampByFreeUB,
    ControlledUnitCanAttack,
    DamageControlledUnit,
    AbsorbDeathControlledUnit,
    DamagedSprayMilk,
    BreastFeeding,
    CharmNearFoot,
    // InhaleStompRangeUnits,
    ConvertToFriendCampForPutToShoe,

}


export let getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            [languageVariableKey.Empty]: (value) => `无`,
            [languageVariableKey.IncreaseLuck]: (value) => `增加${value}运气`,
            [languageVariableKey.DecreaseLuck]: (value) => `减少${value}运气`,
            [languageVariableKey.IncreaseMoveSpeed]: (value) => `移动速度增加${value}%`,
            [languageVariableKey.DecreaseArmorStrength]: (value) => `护甲强度减${value}%`,
            [languageVariableKey.ReduceDamage]: (value) => `减少${value}%伤害`,
            [languageVariableKey.IncreaseFullHp]: (value) => `生命上限增加${value}%`,
            [languageVariableKey.IncreaseRestoreHpStrength]: (value) => `生命恢复强度增加${value}%`,
            [languageVariableKey.IncreaseStubRate]: (value) => `硬直概率增加${value}%`,
            [languageVariableKey.IncreaseItemPrice]: (value) => `物品价格增加${value}%`,
            [languageVariableKey.DecreaseItemPrice]: (value) => `物品价格减少${value}%`,
            [languageVariableKey.IncreaseGetCoin]: (value) => `获得的金币增加${value}%`,
            [languageVariableKey.DecreaseRewardPropCount]: (value) => `奖励的道具数量减少${value}%`,
            // [languageVariableKey.IncreaseLevelGiantessExcitementClimaxRate]: (value) => `造成关卡巨大娘兴奋/高潮的概率提升${value}%`,
            [languageVariableKey.IncreaseTradeVariety]: (value) => `商店物品种类增加${value}%`,
            [languageVariableKey.IncreaseUpgradeWeaponCost]: (value) => `升级武器需要的金币增加${value}%`,
            [languageVariableKey.EnhenceByFreeUB]: (value) => `从阴道释放的单位会增强${value}级`,
            [languageVariableKey.EnhenceByFreeShoe]: (value) => `从鞋释放的单位会增加生命上限${value}%`,
            [languageVariableKey.IncreaseUBCapacity]: (value) => `增加UB容量${value}%`,
            [languageVariableKey.IncreaseTrigoneAndButtDamage]: (value) => `阴部所受伤害增加${value}%`,
            [languageVariableKey.EnhenceByCarry]: (value) => `携带单位带来${value}级动作速度、兴奋速度加成`,
            [languageVariableKey.IncreaseGiantessDamaged]: (value) => `巨大娘受到的伤害增加${value}%`,
            [languageVariableKey.IncreaseExp]: (value) => `增加获得的经验值${value}%`,
            [languageVariableKey.DecreaseGiantessDefense]: (value) => `降低巨大娘防御力${value}%`,


            [languageVariableKey.AfterMissionComplete_AliveOneEnemy_GetReward]: (value) => `通关后，每存活1个敌人，获得对应的宝石、金币、经验值的${value}%`,
            [languageVariableKey.IncreaseMeleeDamageByMoveSpeed]: (value) => `每1点移动速度增加${value}%近战伤害`,
            [languageVariableKey.DecreaseDefenseWhenNotMove]: (value) => `站立不动时，护甲强度为0，防御力减${value}%`,
            [languageVariableKey.ReduceDamageButIncreaseWhenDamaged]: ([v1, v2, v3]) => `减少${v1}%伤害。受到攻击后，增加${v2}%伤害，持续${v3}秒`,
            [languageVariableKey.ReduceDamageButIncreaseWhenSingleDamage]: ([v1, v2, v3]) => `减少${v1}%伤害。对同一个目标的每次攻击都会增加${v2}%伤害，持续${v3}秒`,
            [languageVariableKey.ReduceGiantessDamage]: (value) => `受到巨大娘的伤害减${value}%`,
            [languageVariableKey.IncreaseDamageMMDGiantessWeakness]: (value) => `对MMD巨大娘弱点的伤害增加${value}%`,
            [languageVariableKey.IncreaseAttackWhenStubExcitementClimax]: (value) => `MMD巨大娘硬直/兴奋/高潮后，您增加攻击力${value}%`,
            [languageVariableKey.IncreaseFullHpByEat]: (value) => `吃一个单位增加最大生命值${value}点。通关后增加的生命值会保留到后续关卡`,
            [languageVariableKey.RemainScaleByEat]: (value) => `通关后，因吃而增加的身高、生命值会保留到后续关卡`,
            [languageVariableKey.UseFullHpReplaceCoin]: (value) => `使用最大生命值代替金币来交易（1生命值=10金币）`,
            [languageVariableKey.AfterMissionComplete_ConvertCoinToFullHp]: (value) => `通关后，获得的金币的${value}%转换为最大生命值（1生命值=10金币）`,
            // [languageVariableKey.GetRandomPropEveryMinute]: (value) => `每分钟随机获得${value}个道具`,
            [languageVariableKey.GetGoodsEveryMinute]: (value) => `每分钟获得${value}个商品（不可局外保留）`,
            // [languageVariableKey.EnhenceGiantessAfterBeat]: (value) => `你击杀一个精英巨大娘或者关卡巨大娘后，本局未来生成的所有的精英巨大娘或者关卡巨大娘会更强（巨大娘、小人角色均受影响）`,
            [languageVariableKey.EnhenceGiantessAfterBeat]: (value) => `你击杀一个精英巨大娘或者关卡巨大娘后，本局未来生成的所有的精英巨大娘或者关卡巨大娘会更强`,
            // [languageVariableKey.EnhenceArmyAfterBeat]: (value) => `你击杀一个军队单位后，本局未来生成的所有的军队单位会更强（巨大娘、小人角色均受影响）`,
            [languageVariableKey.EnhenceArmyAfterBeat]: (value) => `你击杀一个军队单位后，本局未来生成的所有的军队单位会更强`,
            [languageVariableKey.IncreaseDamageByCoin]: (value) => `每持有50金币，伤害增加${value}%`,
            [languageVariableKey.IncreaseGetCoinEveryMimute]: (value) => `每分钟，获得的金币增加${value}%`,
            [languageVariableKey.IncreaseGetCoinWithMaxHp]: (value) => `满血时捡起一个道具，获得的金币增加${value}%`,
            [languageVariableKey.DecreaseCoinAfterBuyTrade]: (value) => `商店购买后，金币减少${value}%`,
            [languageVariableKey.Duelist]: (value) => `每1分钟的最后5秒进入决斗时间（持续30秒）：关卡巨大娘、敌人的攻击目标锁定为玩家；新出现的敌人会更强（巨大娘、小人角色均受影响）`,
            [languageVariableKey.BulletSpeedMax]: (value) => `武器子弹速度最快`,
            [languageVariableKey.ConvertToFriendCampByFreeUB]: (value) => `从阴道释放的单位会转换为友方阵营`,
            [languageVariableKey.ControlledUnitCanAttack]: (value) => `被控制的单位可以攻击`,
            // [languageVariableKey.DamageControlledUnit]: (value) => `被控制的单位每隔3秒减${value}级的血量`,
            [languageVariableKey.DamageControlledUnit]: (value) => `被控制的单位每隔3秒被${value}级伤害`,
            [languageVariableKey.AbsorbDeathControlledUnit]: (value) => `被控制的单位被击败后会被吸收，${value}级增加巨大娘属性，对应部位局部变大`,
            [languageVariableKey.DamagedSprayMilk]: (value) => `站立或者走路时胸受击，可能会喷奶`,
            // [languageVariableKey.BreastFeeding]: (value) => `放入胸部的单位会被${value}级喂奶，导致单位持续加血、胸部持续变大、巨大娘持续减血`,
            [languageVariableKey.BreastFeeding]: (value) => `放入胸部的单位会被${value}级喂奶`,
            [languageVariableKey.CharmNearFoot]: (value) => `脚附近的人形单位可能被${value}级魅惑`,
            // [languageVariableKey.InhaleStompRangeUnits]: (value) => `踩踏范围受影响的单位有${value}几率被吸入鞋中`,
            [languageVariableKey.ConvertToFriendCampForPutToShoe]: () => `被放入鞋的单位在魅惑满级后会转换为友方阵营`,

        },
        [language.English]: {
            [languageVariableKey.Empty]: (value) => `Empty`,
            [languageVariableKey.IncreaseLuck]: (value) => `Increase ${value} luck`,
            [languageVariableKey.DecreaseLuck]: (value) => `Decrease ${value} luck`,
            [languageVariableKey.IncreaseMoveSpeed]: (value) => `Move speed increase ${value}%`,
            [languageVariableKey.DecreaseArmorStrength]: (value) => `Armor strength decrease ${value}%`,
            [languageVariableKey.ReduceDamage]: (value) => `Decrease ${value}% damage`,
            [languageVariableKey.IncreaseFullHp]: (value) => `Maximum health increased by ${value}%`,
            [languageVariableKey.IncreaseRestoreHpStrength]: (value) => `Heath regeneration increased by ${value}%`,
            [languageVariableKey.IncreaseStubRate]: (value) => `The probability of stun increases ${value}%`,
            [languageVariableKey.IncreaseItemPrice]: (value) => `Increase item's price ${value}%`,
            [languageVariableKey.DecreaseItemPrice]: (value) => `Decrease item's price ${value}%`,
            [languageVariableKey.IncreaseGetCoin]: (value) => `The number of coins obtained has increased ${value}%`,
            [languageVariableKey.DecreaseRewardPropCount]: (value) => `Decrease rewarded item's count ${value}%`,
            // [languageVariableKey.IncreaseLevelGiantessExcitementClimaxRate]: (value) => `Increases the probability of causing level giantess to become excitement/climax by ${value}%`,
            [languageVariableKey.IncreaseTradeVariety]: (value) => `The variety of items in the trade has increased by ${value}%`,
            [languageVariableKey.IncreaseUpgradeWeaponCost]: (value) => `The cost of coin for upgrade weapon increased by ${value}%`,
            [languageVariableKey.EnhenceByFreeUB]: (value) => `Units released from the vagina will be enhenced ${value} level`,
            [languageVariableKey.EnhenceByFreeShoe]: (value) => `Units released from the shoe will be increase maximum health ${value}%`,
            [languageVariableKey.IncreaseUBCapacity]: (value) => `Increase UB capacity ${value}%`,
            [languageVariableKey.IncreaseTrigoneAndButtDamage]: (value) => `Injury to the genital area increases by ${value}%`,
            [languageVariableKey.EnhenceByCarry]: (value) => `Unit carried brings a level ${value} action speed, excitement speed bonus`,
            [languageVariableKey.IncreaseGiantessDamaged]: (value) => `The damage suffered by giantess increases by ${value}%`,
            [languageVariableKey.IncreaseExp]: (value) => `Increase exp ${value}%`,
            [languageVariableKey.DecreaseGiantessDefense]: (value) => `Decrease giantess defense ${value}%`,

            [languageVariableKey.AfterMissionComplete_AliveOneEnemy_GetReward]: (value) => `After completing the level, for every surviving enemy, receive ${value}% of the corresponding gems, coins, and experience points`,
            [languageVariableKey.IncreaseMeleeDamageByMoveSpeed]: (value) => `Every 1 move speed increase ${value}% melee damage`,
            [languageVariableKey.DecreaseDefenseWhenNotMove]: (value) => `When stand, armor strength decrease to 0, defense decrease ${value}%`,
            [languageVariableKey.ReduceDamageButIncreaseWhenDamaged]: ([v1, v2, v3]) => `Decrease ${v1}% damage. After be attacked, increase ${v2}% damage, keep ${v3}s`,
            [languageVariableKey.ReduceDamageButIncreaseWhenSingleDamage]: ([v1, v2, v3]) => `Reduce ${v1}% damage. Each attack on the same target will increase ${v2}% damage, keep ${v3}s`,
            [languageVariableKey.ReduceGiantessDamage]: (value) => `Reduce ${value}% of damage caused by giantess`,
            [languageVariableKey.IncreaseDamageMMDGiantessWeakness]: (value) => `Increases damage to the weakness of MMD giantess by ${value}%`,
            [languageVariableKey.IncreaseAttackWhenStubExcitementClimax]: (value) => `After MMD giantess stun/excitement/climax, you increase your attack power by ${value}%`,
            [languageVariableKey.IncreaseFullHpByEat]: (value) => `Eat a unit will increase ${value} maxium hp. After completing the level, the increase in maxium hp due to eating will be retained for subsequent levels`,
            [languageVariableKey.RemainScaleByEat]: (value) => `After completing the level, the increase in height and maxium hp due to eating will be retained for subsequent levels`,
            [languageVariableKey.UseFullHpReplaceCoin]: (value) => `Use maximum health instead of coins to trade (1 hp=10 coins)`,
            [languageVariableKey.AfterMissionComplete_ConvertCoinToFullHp]: (value) => `After completing the level, ${value}% of the obtained coins will be converted to the maximum health value (1 hp=10 coins)`,
            // [languageVariableKey.GetRandomPropEveryMinute]: (value) => `Randomly obtain ${value} items every minute`,
            [languageVariableKey.GetGoodsEveryMinute]: (value) => `Obtain ${value} goods every minute(can't save out of level)`,
            // [languageVariableKey.EnhenceGiantessAfterBeat]: (value) => `When you defeat an elite giantess or level giantess, all future elite giantesses or level giantesses spawned in the current level will be stronger(giantess/littleman character all affected)`,
            // [languageVariableKey.EnhenceArmyAfterBeat]: (value) => `When you defeat an army unit, all future army spawned in the current level will be stronger(giantess/littleman character all affected)`,
            [languageVariableKey.EnhenceGiantessAfterBeat]: (value) => `When you defeat an elite giantess or level giantess, all future elite giantesses or level giantesses spawned in the current level will be stronger`,
            [languageVariableKey.EnhenceArmyAfterBeat]: (value) => `When you defeat an army unit, all future army spawned in the current level will be stronger`,
            [languageVariableKey.IncreaseDamageByCoin]: (value) => `For every 50 coins held, damage increases by ${value}%`,
            [languageVariableKey.IncreaseGetCoinEveryMimute]: (value) => `Every minute, the amount of coins obtained increases by ${value}%`,
            [languageVariableKey.IncreaseGetCoinWithMaxHp]: (value) => `When picking up a item while at full health, the amount of coins obtained increases by ${value}%`,
            [languageVariableKey.DecreaseCoinAfterBuyTrade]: (value) => `After buy in the trade, coin decrease ${value}%`,
            [languageVariableKey.Duelist]: (value) => `Every 5 seconds of the last minute, the duel time begins (lasting for 30 seconds): level giantess and enemies will target the player; newly appearing enemies will be stronger (giantess/littleman character all affected)`,
            [languageVariableKey.BulletSpeedMax]: (value) => `Bullet speed max`,
            [languageVariableKey.ConvertToFriendCampByFreeUB]: (value) => `Units released from the vagina will be converted to friendly camp`,
            [languageVariableKey.ControlledUnitCanAttack]: (value) => `Units controlled can be attacked`,
            [languageVariableKey.DamageControlledUnit]: (value) => `The controlled units are level ${value} damaged every 3 seconds`,
            [languageVariableKey.AbsorbDeathControlledUnit]: (value) => `The controlled unit will be absorbed after being destoryed, and will increase level ${value} giantess attribute, corresponding to partial enlargement of the corresponding area`,
            [languageVariableKey.DamagedSprayMilk]: (value) => `When idling or walking, if the breast is hit, milk may be sprayed`,
            [languageVariableKey.BreastFeeding]: (value) => `The unit placed in the breast will be breastfed at the ${value} level`,
            [languageVariableKey.CharmNearFoot]: (value) => `The humanoid unit near foot may level ${value} charm`,
            // [languageVariableKey.InhaleStompRangeUnits]: (value) => `There is a ${value} chance that units affected by the stomp range will be sucked into the shoes`,
            [languageVariableKey.ConvertToFriendCampForPutToShoe]: () => `The unit placed in the shoe will convert to friendly camp after reaching the max charm level`,


        },
    }
}

// export type careerFeatureValue = number
// export type careerFeatureValue = number | [number, ...]
export type careerFeatureValue = number | any

export type careerFeatureData = {
    name: careerFeatureName,
    positive: boolean,
    category: category,
    characterType: characterType,
    // excludeNames: Array<careerFeatureName>,
    // value?: number,
    rate: rate,
    getDescriptionFunc: (state: state, value: careerFeatureValue) => string,
    generateRandomValueFunc: (state: state) => careerFeatureValue,
    selectRandomConditionFunc?: (state: state, data: Array<careerFeatureData>) => boolean,
    applyFunc: (state: state, characterType: characterType, value: careerFeatureValue, name: careerFeatureName) => Promise<state>,
    deapplyFunc?: (state: state, characterType: characterType, name: careerFeatureName) => Promise<state>,
}




let _isOtherCharacterTypeApplied = (api, state, characterType_, careerFeatureName) => {
    let otherCharacterType = characterType_ == characterType.Giantess ? characterType.LittleMan : characterType.Giantess

    return api.isUseCareerFeatureByCharacterType(state, otherCharacterType, careerFeatureName)
}

let _handleDamageControlledUnit = (api, state, usedGirl, data, level, collisionPartSizeFactor, collisionPartAbsorbFactor) => {
    let forceDirection = api.buildRandomDirectionInXZ()
    let damageType_ = damageType.Global
    let weaponType_ = weaponType.EffectSelf

    return api.ArrayUtils.reducePromise(
        data.toArray(),
        (state, { queue, index, name, getLocalTransformFunc, getBoxFunc }: giantessAddToSkeletonData) => {
            let force = api.getArmyFullHp(state, name) * level * collisionPartSizeFactor * collisionPartAbsorbFactor * 0.1
            let weaponValue_ = api.buildEffectWeaponValue(
                force,
                armorPiercingForceRatio.Middle,
                weaponType_,
                critRatio.Zero
            )

            let box = getBoxFunc(state, queue, index, name)

            if (NullableUtils.isNullable(box)) {
                return Promise.resolve(state)
            }

            return api.damageWithSingleData(
                state, [[force, forceDirection], [damageType_, weaponType_]],
                weaponValue_,
                api.girl.buildNameByUsedGirl(usedGirl),
                api.NullableUtils.getEmpty(),
                [
                    getLocalTransformFunc(state, queue, index, name),
                    box,
                    name
                ]
            ).then(api.TupleUtils.getTuple2First)
        },
        state
    )
}






// let _handleDamageHandlerForReduceDamage = (careerFeatureName, value) => (api: api, state: state, data) => {
let _handleDamageHandlerForReduceDamage = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.ReduceDamage

    if (
        // api.isPlayerByCharacterType(state, userData.fromName, api.getUseCareerCharacterType(state, getName()))
        api.isUseCareerFeature(state, userData.fromName, careerFeatureName_)
        // && !api.isPlayerGiantessByName(state, userData.fromName)
        && api.isNotMaxForce(userData.forceSize)
    ) {
        return Promise.resolve([state, {
            ...userData,
            damage: userData.damage * (1 - api.getCareerFeatureValue(state, careerFeatureName_)),
        }])
    }

    return Promise.resolve([state, userData])
}

let _handleMissionFinishHandlerForAfterMissionComplete_AliveOneEnemy_GetReward = (characterType_) => (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.AfterMissionComplete_AliveOneEnemy_GetReward

    // let isUseCareerFeatureForLittleMan = api.isUseCareerFeature(state, api.getLittleManName(), careerFeatureName_)
    // let isUseCareerFeatureForGiantess = api.isUseCareerFeature(state, api.girl.buildNameByUsedGirl(usedGirl), careerFeatureName_)
    // if (
    //     (
    //         isUseCareerFeatureForLittleMan
    //         || isUseCareerFeatureForGiantess
    //     )
    //     && userData.missionFinishStatus == missionFinishStatus.Complete
    // ) {
    if (
        // api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)
        // && 
        userData.missionFinishStatus == missionFinishStatus.Complete
    ) {
        let rate = api.getCareerFeatureValueByCharacterType(state, characterType_, careerFeatureName_)

        //army
        let [gems, coins, experiences] = api.getAllAliveArmyData(state).reduce(([gems, coins, experiences], armyData) => {
            return armyData.filter(data => {
                return api.getCampExn(state, data.name) != api.getPlayerCamp()
            }).reduce(([gems, coins, experiences], data: visibleData) => {
                let rewardData = api.findRewardData(state, api.buildArmyRewardKey(state, data.name))

                return [
                    gems + rewardData.gem(state),
                    coins + rewardData.coin(state),
                    experiences + rewardData.experienceValue
                ]
            }, [gems, coins, experiences])
        }, [0, 0, 0])

        //level giantess
        if (api.hasLevelGiantessExceptPlayer(state)) {
            gems += gem.MostHigh
            coins += coin.MostHigh
            experiences += experienceFactor.VeryHigh
        }

        gems = Math.round(gems * rate)
        coins = Math.round(coins * rate)
        experiences = Math.round(experiences * rate)


        state = api.addGemInLevel(state, gems)
        state = api.addCoinInLevel(state, coins)


        // state = api.getPlayerNamesByIsUseCareerFeature(isUseCareerFeatureForLittleMan, isUseCareerFeatureForGiantess
        state = api.getPlayerNamesByCharacterType(characterType_).reduce((state, name) => {
            return api.setExperienceValue(state, api.girl.getUsedGirlByName(name), name, experiences)
        }, state)

        return api.updateUIAndSound(state)
    }

    return Promise.resolve(state)
}

let _handleMissionFinishHandlerForAfterMissionComplete_ConvertCoinToFullHp = (characterType_) => (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.AfterMissionComplete_ConvertCoinToFullHp

    if (
        // api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)
        userData.missionFinishStatus == missionFinishStatus.Complete
    ) {
        let careerFeatureValue = api.getCareerFeatureValueByCharacterType(state, characterType_, careerFeatureName_)

        let levelCoin = api.getLevelCoin(state)
        let addedHp = Math.round(levelCoin * careerFeatureValue / 10)

        state = api.addCoinInLevel(state, -Math.round(levelCoin * careerFeatureValue))

        if (characterType_ == characterType.LittleMan) {
            state = api.littleMan.setHpIncrease(state,
                api.littleMan.getHpIncrease(state) + addedHp
            )
        }
        else if (characterType_ == characterType.Giantess) {
            state = api.girl.setHpIncrease(state,
                api.girl.getHpIncrease(state) + addedHp
            )
        }

        return api.updateUIAndSound(state)

    }

    return Promise.resolve(state)
}

let _handleDamageHandlerForIncreaseGiantessDamaged = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.IncreaseGiantessDamaged

    if (
        api.isUseCareerFeature(state, userData.name, careerFeatureName_)
    ) {
        return Promise.resolve([state, {
            ...userData,
            damage: userData.damage * (1 + api.getCareerFeatureValue(state, careerFeatureName_))
        }])
    }

    return Promise.resolve([state, userData])
}

let _handleDamageHandlerForIncreaseMeleeDamageByMoveSpeed = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.IncreaseMeleeDamageByMoveSpeed

    if (
        api.isUseCareerFeature(state, userData.fromName, careerFeatureName_)
        && api.isMeleeWeapon(userData.weaponValue.meleeRange)
    ) {
        return Promise.resolve([state, {
            ...userData,
            damage: userData.damage * (1 + api.getMaxActuallMoveSpeed(state, 2000) * api.getCareerFeatureValue(state, careerFeatureName_))
        }])
    }

    return Promise.resolve([state, userData])
}

let _handleGetLittleManValueHandlerForDecreaseDefenseWhenNotMove = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.DecreaseDefenseWhenNotMove

    if (
        api.isUseCareerFeatureByCharacterType(state, characterType.LittleMan, careerFeatureName_)
        && api.getMaxActuallMoveSpeed(state, api.Device.computeValue(150)) == 0
    ) {
        return Promise.resolve([state, {
            ...userData,
            defenseFactor: userData.defenseFactor * (1 - api.getCareerFeatureValueByCharacterType(state, characterType.LittleMan, careerFeatureName_)),
            armorStrength: 0,
        }])
    }

    return Promise.resolve([state, userData])
}

let _getBuffProtocolName = () => "buff-protocol"

let _getLittleManBuffMasochismBlockName = () => "buff-littleman-masochism"

let _getGiantessBuffMasochismBlockName = () => "buff-giantess-masochism"

let _computeDamageForReduceDamageButIncreaseWhenDamaged = (api: api, state: state, fromName, [v1, v2]) => {
    let superPositionCount
    if (api.littleMan.isLittleMan(fromName)) {
        let service = api.blockAPI.getBlockService<any>(state, _getBuffProtocolName(), _getLittleManBuffMasochismBlockName())

        let buff = api.findBuff(state, service.getName(), fromName, api.NullableUtils.getEmpty())

        superPositionCount = api.NullableUtils.getWithDefault(
            api.NullableUtils.map(buff => buff.superPositionCount,
                buff),
            0
        )
    }
    else if (api.girl.isGirl(fromName)) {
        let service = api.blockAPI.getBlockService<any>(state, _getBuffProtocolName(), _getGiantessBuffMasochismBlockName())

        let buff = api.findBuff(state, service.getName(), fromName, api.NullableUtils.return_(usedGirlEnum.PlayerGirl))

        superPositionCount = api.NullableUtils.getWithDefault(
            api.NullableUtils.map(buff => buff.superPositionCount,
                buff),
            0
        )
    }
    else {
        superPositionCount = 0
    }

    return 1 - v1 + v2 * superPositionCount
}

let _handleDamageHandlerForReduceDamageButIncreaseWhenDamaged = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.ReduceDamageButIncreaseWhenDamaged

    if (
        api.isUseCareerFeature(state, userData.fromName, careerFeatureName_)
        // && !api.isPlayerGiantessByName(state, userData.fromName)
        && api.isNotMaxForce(userData.forceSize)
    ) {
        let [v1, v2, v3] = api.getCareerFeatureValue(state, careerFeatureName_)

        userData = {
            ...userData,
            damage: userData.damage * _computeDamageForReduceDamageButIncreaseWhenDamaged(api, state, userData.fromName, [v1, v2])
        }
    }
    else if (api.isUseCareerFeature(state, userData.name, careerFeatureName_)) {
        let [v1, v2, v3] = api.getCareerFeatureValue(state, careerFeatureName_)

        if (api.littleMan.isLittleMan(userData.name)) {
            return api.blockAPI.getBlockService<any>(state, _getBuffProtocolName(), _getLittleManBuffMasochismBlockName()).addBuff(api, state, v3, v2).then(state => [state, userData])
        }
        else if (api.girl.isGirl(userData.name)) {
            let usedGirl = api.girl.getUsedGirlByName(userData.name)
            return api.blockAPI.getBlockService<any>(state, _getBuffProtocolName(), _getGiantessBuffMasochismBlockName()).addBuff(api, state, usedGirl, v3, v2).then(state => [state, userData])
        }
        else {
            throw new Error("err")
        }
    }

    return Promise.resolve([state, userData])
}


let _getArmyBuffSadismBlockName = () => "buff-army-sadism"

let _getGiantessBuffSadismBlockName = () => "buff-giantess-sadism"

let _computeDamageForReduceDamageButIncreaseWhenSingleDamage = (api: api, state: state, toName, v1) => {
    let sumValue
    if (api.isArmy(state, toName)) {
        let service = api.blockAPI.getBlockService<any>(state, _getBuffProtocolName(), _getArmyBuffSadismBlockName())

        let buff = api.findBuff(state, service.getName(), toName, api.NullableUtils.getEmpty())

        sumValue = api.NullableUtils.getWithDefault(
            api.NullableUtils.map(buff => buff.sumValue,
                buff),
            0
        )
    }
    else if (api.girl.isGirl(toName)) {
        let service = api.blockAPI.getBlockService<any>(state, _getBuffProtocolName(), _getGiantessBuffSadismBlockName())

        let buff = api.findBuff(state, service.getName(), toName, api.NullableUtils.return_(api.girl.getUsedGirlByName(toName)))

        sumValue = api.NullableUtils.getWithDefault(
            api.NullableUtils.map(buff => buff.sumValue,
                buff),
            0
        )
    }
    else {
        return 1
    }


    return (1 - v1) * (1 + sumValue)
}

let _handleDamageHandlerForReduceDamageButIncreaseWhenSingleDamage = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.ReduceDamageButIncreaseWhenSingleDamage

    if (
        api.isUseCareerFeature(state, userData.fromName, careerFeatureName_)
        && api.isNotMaxForce(userData.forceSize)
    ) {
        let [v1, v2, v3] = api.getCareerFeatureValue(state, careerFeatureName_)

        userData = {
            ...userData,
            damage: userData.damage * _computeDamageForReduceDamageButIncreaseWhenSingleDamage(api, state, userData.name, v1)
        }


        if (api.isArmy(state, userData.name)) {
            return api.blockAPI.getBlockService<any>(state, _getBuffProtocolName(), _getArmyBuffSadismBlockName()).addBuff(api, state, userData.name, v3, v2).then(state => [state, userData])
        }
        else if (api.girl.isGirl(userData.name)) {
            let usedGirl = api.girl.getUsedGirlByName(userData.name)
            return api.blockAPI.getBlockService<any>(state, _getBuffProtocolName(), _getGiantessBuffSadismBlockName()).addBuff(api, state, usedGirl, v3, v2).then(state => [state, userData])
        }
    }

    return Promise.resolve([state, userData])
}


let _handleDamageLittleManHandlerForReduceGiantessDamage = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.ReduceGiantessDamage

    if (api.isUseCareerFeature(state, userData.name, careerFeatureName_)
        && (
            api.girl.isGirl(userData.fromName)
            || api.isEliteGiantess(state, userData.fromName)
        )
    ) {
        return Promise.resolve([state, {
            ...userData,
            damage: userData.damage * (1 - api.getCareerFeatureValue(state, careerFeatureName_))
        }])
    }

    return Promise.resolve([state, userData])
}

let _handleDamageGiantessHandlerForReduceGiantessDamageIncreaseDamageMMDGiantessWeakness = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.IncreaseDamageMMDGiantessWeakness

    if (api.isUseCareerFeature(state, userData.fromName, careerFeatureName_)
        && userData.damageType == damageType.Weakness
        && api.littleMan.isLittleMan(userData.fromName)
    ) {
        return Promise.resolve([state, {
            ...userData,
            damage: userData.damage * (1 + api.getCareerFeatureValue(state, careerFeatureName_))
        }])
    }

    return Promise.resolve([state, userData])
}

let _getLittleManBuffIncreaseAttackBlockName = () => "buff-littleman-excitement-increaseattack"

let _handleGiantessStubHandlerForIncreaseAttackWhenStubExcitementClimax = (api: api, state: state, data) => {
    let careerFeatureName_ = careerFeatureName.IncreaseAttackWhenStubExcitementClimax
    let characterType_ = api.getCharacterType(api.getAbstractState(state))

    if (api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)
    ) {
        return api.blockAPI.getBlockService<any>(state, _getBuffProtocolName(), _getLittleManBuffIncreaseAttackBlockName()).addBuff(api, state, api.getCareerFeatureValueByCharacterType(state, characterType_, careerFeatureName_))
    }

    return Promise.resolve(state)
}

let _handleTriggerPlayerGirlEatHandlerHandlerForIncreaseFullHpByEat = (api: api, state: state, data) => {
    // let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.IncreaseFullHpByEat
    let characterType_ = api.getCharacterType(api.getAbstractState(state))

    if (api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)
    ) {
        let oldHpIncrease = api.girl.getHpIncrease(state)
        let newHpIncrease = oldHpIncrease + api.getCareerFeatureValueByCharacterType(state, characterType_, careerFeatureName_)

        state = api.girl.setHpIncrease(state, newHpIncrease)
        state = api.GiantessBuildUtils.setFullHp(state, api.buildFuncData(state), (state, hp) => {
            return hp - oldHpIncrease + newHpIncrease
        }, false, usedGirlEnum.PlayerGirl)
    }

    return Promise.resolve(state)
}

let _handleTriggerPlayerGirlEatHandlerHandlerForRemainScaleByEat = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.RemainScaleByEat
    let characterType_ = api.getCharacterType(api.getAbstractState(state))

    if (api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)
    ) {
        state = api.girl.setScaleIncrease(state, api.girl.getScaleIncrease(state) + userData.scaleIncrease)
    }

    return Promise.resolve(state)
}

// let _updateHandlerForGetRandomPropEveryMinute = (key) => (api: api, state, _) => {
//     let careerFeatureName_ = careerFeatureName.GetRandomPropEveryMinute
//     let characterType_ = api.getCharacterType(api.getAbstractState(state))

//     if (api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)
//         && getPassTime(state, careerFeatureName_, key) >= 60
//         // && getPassTime(state, careerFeatureName_, key) >= 10
//         // && !getIsShowingUITip(state)
//     ) {
//         let getTrade = NumberUtils.randomSelectCount(getTradeData(state), 2)
//         state = getTrade.reduce((state, d) => {
//             return addPropCount(state, d.name, d.count)
//         }, state)

//         state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
//             api.SoundManager.buildNeedToPlaySoundData(getGetPropResourceId(), api.getIsDebug(state), getSystemVolume(state))
//         ))

//         state = setLastTime(state, careerFeatureName_, key, getNow(state))


//         let allProps = buildAllProps(state, 0)
//         // return api.event.trigger(state, api.getAbstractState, getShowUITipEventName(), buildShowUITipEventData(



//         state = pushLightUITips(state,
//             getLanguageTextVariableData(state, languageVariableKey_.GetItem)(getTrade.reduce((str, d) => {
//                 return str + `${getTitle(allProps, d.name)}(${d.count})` + "+"
//             }, "").slice(0, -1)),
//         )
//         // return api.event.trigger(state, api.getAbstractState, getShowUILightTipEventName(), buildShowUILightTipEventData(
//         //     getLanguageTextVariableData(state, languageVariableKey_.GetItem)(getTrade.reduce((str, d) => {
//         //         return str + `${getTitle(allProps, d.name)}(${d.count})` + "+"
//         //     }, "").slice(0, -1)),
//         //     // () => {
//         //     //     let state = api.readState()

//         //     //     state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
//         //     //         api.SoundManager.buildNeedToPlaySoundData(getGetPropResourceId(), api.getIsDebug(state), getSystemVolume(state))
//         //     //     ))

//         //     //     state = setLastTime(state, careerFeatureName_, getNow(state))

//         //     //     api.writeState(state)

//         //     //     return Promise.resolve()
//         //     // }
//         // ))
//     }

//     return Promise.resolve(state)
// }

let _updateHandlerForGetGoodsEveryMinute = (key) => (api: api, state, _) => {
    // let careerFeatureName_ = careerFeatureName.GetGoodsEveryMinute
    // let characterType_ = api.getCharacterType(api.getAbstractState(state))

    // if (api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)
    //     // && getPassTime(state, careerFeatureName_, key) >= 60
    //     && getPassTime(state, careerFeatureName_, key) >= 5
    // ) {
    //     state = setLastTime(state, careerFeatureName_, key, getNow(state))

    //     return api.event.trigger(state, api.getAbstractState, getOpenTradeEventName(), buildOpenTradeHandlerEventData(
    //         getRandomTrade(state).map(d => [d[0], 0, d[2], d[3], d[4], d[5]])
    //     ))
    // }

    // return Promise.resolve(state)
    let careerFeatureName_ = careerFeatureName.GetGoodsEveryMinute
    // let characterType_ = api.getCharacterType(api.getAbstractState(state))

    if (
        getFreeBuyCount(state) > 0
        // api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)
        && getPassTime(state, careerFeatureName_, key) >= 60
        // && getPassTime(state, careerFeatureName_, key) >= 5
        // && getPassTime(state, careerFeatureName_, key) >= 10
        && !hasOpenedModal(state)
    ) {
        state = setLastTime(state, careerFeatureName_, key, getNow(state))

        return api.event.trigger(state, api.getAbstractState, getOpenTradeEventName(), buildOpenTradeHandlerEventData(
            // getRandomTrade(state, true).filter(d => {
            getRandomTrade(state).filter(d => {
                return d[0] != propName.Revive
                // }).map(d => [d[0], 0, d[2], d[3], d[4], d[5], false])
            }).map(d => {
                let count
                if (isArtifact(state, d[0])) {
                    count = 1
                }
                else {
                    count = d[2]
                }

                return [d[0], 0, count, d[3], d[4], d[5], true]
            })
        ))
    }

    return Promise.resolve(state)

}

// let _updateHandlerForDecreaseCoinEveryTwoMinutes = (characterType_, key) => (api: api, state, _) => {
//     let careerFeatureName_ = careerFeatureName.DecreaseLevelCoinEveryTwoMinutes

//     if (api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)
//         && getPassTime(state, careerFeatureName_, key) >= 120
//         // && getPassTime(state, careerFeatureName_, key) >= 5
//     ) {
//         // state = setTotalCoin(state, Math.round(getRealTotalCoin(state) * (1 - api.getCareerFeatureValueByCharacterType(state, characterType_, careerFeatureName_))))
//         state = setLevelCoin(state, Math.round(getRealLevelCoin(state) * (1 - api.getCareerFeatureValueByCharacterType(state, characterType_, careerFeatureName_))))

//         state = setLastTime(state, careerFeatureName_, key, getNow(state))
//     }

//     return Promise.resolve(state)
// }

let _afterBuyHandlerForDecreaseCoinAfterBuyTrade = (api: api, state, _) => {
    let careerFeatureName_ = careerFeatureName.DecreaseCoinAfterBuyTrade
    let characterType_ = api.getCharacterType(api.getAbstractState(state))

    if (api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)
    ) {
        state = setTotalCoin(state, Math.round(getRealTotalCoin(state) * (1 - api.getCareerFeatureValueByCharacterType(state, characterType_, careerFeatureName_))))
    }

    return Promise.resolve(state)
}

let _updateHandlerForIncreaseGetCoinEveryMimute = (key) => (api: api, state, _) => {
    let careerFeatureName_ = careerFeatureName.IncreaseGetCoinEveryMimute
    let characterType_ = api.getCharacterType(api.getAbstractState(state))

    if (api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)
        && getPassTime(state, careerFeatureName_, key) >= 60
    ) {
        state = setCoinFactor(state, getCoinFactor(state) + api.getCareerFeatureValueByCharacterType(state, characterType_, careerFeatureName_))

        state = setLastTime(state, careerFeatureName_, key, getNow(state))
    }

    return Promise.resolve(state)
}

let _updateHandlerForDuelist = (key) => (api: api, state, _) => {
    let careerFeatureName_ = careerFeatureName.Duelist
    // let characterType_ = api.getCharacterType(api.getAbstractState(state))
    let specialTimeKey = careerFeatureName_

    let increasedFactor = getDuelistFactor(state) * 2

    if (
        getPassTime(state, careerFeatureName_, key) >= 55
        // getPassTime(state, careerFeatureName_, key) >= 5
        // getPassTime(state, careerFeatureName_, key) >= 10
        && !isStartSepcialTime(state)
    ) {
        state = startSepcialTime(state, specialTimeKey, getNow(state))

        state = setLockedAttackTargetToPlayer(state, true)

        state = setEnhenceArmyFactor(state, getEnhenceArmyFactor(state) + increasedFactor)
        state = setEnhenceEliteGiantessFactor(state, getEnhenceEliteGiantessFactor(state) + increasedFactor)
        state = setEnhenceLevelGiantessFactor(state, getEnhenceLevelGiantessFactor(state) + increasedFactor)


        state = pushLightUITips(state,
            getLanguageTextData(state, languageKey.EnterDuelistTime),
        )


        // state = setLastTime(state, careerFeatureName_, key, getNow(state))
    }
    else if (
        isStartSepcialTimeByKey(state, specialTimeKey)
        && NullableUtils.getExn(getSepcialTimeDuration(state)) >= 30
        // && NullableUtils.getExn(getSepcialTimeDuration(state)) >= 10
    ) {
        state = endSepcialTime(state)

        state = setLockedAttackTargetToPlayer(state, false)

        state = setEnhenceArmyFactor(state, getEnhenceArmyFactor(state) - increasedFactor)
        state = setEnhenceEliteGiantessFactor(state, getEnhenceEliteGiantessFactor(state) - increasedFactor)
        state = setEnhenceLevelGiantessFactor(state, getEnhenceLevelGiantessFactor(state) - increasedFactor)



        state = setLastTime(state, careerFeatureName_, key, getNow(state) + 5000)


        state = pushLightUITips(state,
            getLanguageTextData(state, languageKey.EndDuelistTime),
        )
    }

    return Promise.resolve(state)
}

let _getPropHandlerForIncreaseGetCoinWithMaxHp = (api: api, state, _) => {
    let careerFeatureName_ = careerFeatureName.IncreaseGetCoinWithMaxHp
    let characterType_ = api.getCharacterType(api.getAbstractState(state))

    if (api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)
        && getPlayerHp(state) == getPlayerFullHp(state)
    ) {
        state = setCoinFactor(state, getCoinFactor(state) + api.getCareerFeatureValueByCharacterType(state, characterType_, careerFeatureName_))
    }

    return Promise.resolve(state)
}

let _destoryedHandlerForEnhenceGiantessAfterBeat = (api: api, state, data) => {
    let userData = NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.EnhenceGiantessAfterBeat

    if (api.isUseCareerFeature(state, userData.fromName, careerFeatureName_)
    ) {
        if (isEliteGiantess(state, userData.toName)) {
            // state = setEnhenceEliteGiantessFactor(state, getEnhenceEliteGiantessFactor(state) + NumberUtils.getRandomFloat(0.05, 0.1))
            // state = setEnhenceEliteGiantessFactor(state, getEnhenceEliteGiantessFactor(state) + NumberUtils.getRandomFloat(0.025, 0.05))
            state = setEnhenceEliteGiantessFactor(state, getEnhenceEliteGiantessFactor(state) + NumberUtils.getRandomFloat(0.02, 0.04))
        }
        else if (isGirl(userData.toName) && isLevelGiantessExceptPlayer(state, api.girl.getUsedGirlByName(userData.toName))) {
            state = setEnhenceLevelGiantessFactor(state, getEnhenceLevelGiantessFactor(state) + NumberUtils.getRandomFloat(0.5, 1.5))
        }
    }

    return Promise.resolve(state)
}

let _destoryedHandlerForEnhenceArmyAfterBeat = (api: api, state, data) => {
    let userData = NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.EnhenceArmyAfterBeat

    if (api.isUseCareerFeature(state, userData.fromName, careerFeatureName_)
    ) {
        if (isArmyExceptEliteGiantess(userData.toName)) {
            // state = setEnhenceArmyFactor(state, getEnhenceArmyFactor(state) + NumberUtils.getRandomFloat(0.005, 0.02))
            state = setEnhenceArmyFactor(state, getEnhenceArmyFactor(state) + NumberUtils.getRandomFloat(0.0025, 0.01))
        }
    }

    return Promise.resolve(state)
}

let _handleDamageHandlerForIncreaseDamageByCoin = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.IncreaseDamageByCoin

    if (
        api.isUseCareerFeature(state, userData.fromName, careerFeatureName_)
    ) {
        userData = {
            ...userData,
            damage: userData.damage * (1 + (getRealTotalCoin(state) / 50) * api.getCareerFeatureValue(state, careerFeatureName_))
        }
    }

    return Promise.resolve([state, userData])
}

// let _switchWeaponHandlerForBulletSpeedMax = (api: api, state, _) => {
//     // let careerFeatureName_ = careerFeatureName.BulletSpeedMax

//     state = getWeaponGirlBlockService(state).custom.setBulletSpeedMax(api, state, getCurrentGunWeaponName(state))

//     return Promise.resolve(state)
// }

let _convertToFriendCamp = (api, state, name) => {
    if (api.getCampExn(state, name) == camp.Player) {
        return state
    }

    state = clearAttackTargetData(state, name)

    state = api.setCamp(state, name, camp.Player)

    state = addMarkStatusToName(state, name, getCallResourceId())

    return state
}

let _handleConvertToFriendCampByFreeUB = (api: api, state: state, data) => {
    let careerFeatureName_ = careerFeatureName.ConvertToFriendCampByFreeUB
    let characterType_ = api.getCharacterType(api.getAbstractState(state))

    if (api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)) {
        let { objectData } = api.NullableUtils.getExn(data.userData)

        state = objectData.reduce((state, { name }) => {
            return _convertToFriendCamp(api, state, name)
        }, state)
    }

    return Promise.resolve(state)
}

let _handleEnhenceByFreeUB = (api: api, state: state, data) => {
    let careerFeatureName_ = careerFeatureName.EnhenceByFreeUB
    let characterType_ = api.getCharacterType(api.getAbstractState(state))

    if (api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)) {
        let { objectData } = api.NullableUtils.getExn(data.userData)

        let level = api.getCareerFeatureValueByCharacterType(state, characterType_, careerFeatureName_)
        let funcData = api.buildFuncData(state)

        state = objectData.reduce((state, { name }) => {
            //         if (isLittleMan(name)) {
            //             state = api.LittleManBuildUtils.setHp(state, funcData, (state, value) => {
            //                 return value * (1 + 0.2 * level)
            //             }, true)
            //             state = api.LittleManBuildUtils.setDefenseFactor(state, funcData, (state, value) => {
            //                 return value * (1 + 0.1 * level)
            //             })
            //         }
            //         else {
            // api.setarmyfu()
            //         }
            state = setEmitSpeedFactor(state, funcData, (state, value) => value * (1 - 0.1 * level), name)
            state = setDefenseFactor(state, funcData, (state, value) => value * (1 + 0.1 * level), name)
            state = setMoveSpeed(state, funcData, (state, value) => value * (1 + 0.2 * level), name)

            return state
        }, state)
    }

    return Promise.resolve(state)
}

let _handleEnhenceByFreeShoe = (api: api, state: state, data) => {
    let careerFeatureName_ = careerFeatureName.EnhenceByFreeShoe
    let characterType_ = api.getCharacterType(api.getAbstractState(state))

    if (api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)) {
        let { objectData } = api.NullableUtils.getExn(data.userData)

        let value = api.getCareerFeatureValueByCharacterType(state, characterType_, careerFeatureName_)
        // let funcData = api.buildFuncData(state)

        state = objectData.reduce((state, { name }) => {
            //         if (isLittleMan(name)) {
            //             state = api.LittleManBuildUtils.setHp(state, funcData, (state, value) => {
            //                 return value * (1 + 0.2 * level)
            //             }, true)
            //             state = api.LittleManBuildUtils.setDefenseFactor(state, funcData, (state, value) => {
            //                 return value * (1 + 0.1 * level)
            //             })
            //         }
            //         else {
            // api.setarmyfu()
            //         }
            state = api.setArmyHp(state, name, api.getArmyFullHp(state, name) * (1 + value))

            return state
        }, state)
    }

    return Promise.resolve(state)
}

let _handleDamageHandlerForIncreaseTrigoneAndButtDamage = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.IncreaseTrigoneAndButtDamage
    let characterType_ = api.getCharacterType(api.getAbstractState(state))

    if (
        api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)
        && userData.collisionPart == collisionPart.TrigoneAndButt
    ) {
        return Promise.resolve([state, {
            ...userData,
            damage: userData.damage * (1 + api.getCareerFeatureValue(state, careerFeatureName_))
        }])
    }

    return Promise.resolve([state, userData])
}


let _handleRemoveDataEventNameForAbsorbDeathControlledUnit = (setScaleFunc, usedGirl, scaleFactor,) => (api: api, state: state, data) => {
    let careerFeatureName_ = careerFeatureName.AbsorbDeathControlledUnit
    let characterType_ = api.getCharacterType(api.getAbstractState(state))

    if (api.isUseCareerFeatureByCharacterType(state, characterType_, careerFeatureName_)) {
        let { name } = api.NullableUtils.getExn(data.userData)

        let level = api.getCareerFeatureValueByCharacterType(state, characterType_, careerFeatureName_)

        if (api.getArmyHp(state, name) <= 0
            && !isEatingFromPick(state, usedGirl)
        ) {
            let [hp, excitement_] = getUnitFullHpAndExcitement(state, name)

            let factor = NumberUtils.clamp(excitement_ / excitement.Middle, 0.5, 5) * scaleFactor * level
            let scaleIncrease = 1 * factor

            state = setScaleFunc(api, state, usedGirl, scaleIncrease)


            let addedHp = Math.round(hp * api.getGirlValue(state, usedGirl).abstorbHpRate * level)

            state = api.GiantessBuildUtils.setFullHp(state, api.buildFuncData(state), (state, hp) => {
                return hp + addedHp
            }, false, usedGirlEnum.PlayerGirl)

            return getAbsorbBlockService(state).addBuff(api, state, usedGirl, 1)
        }
    }

    return Promise.resolve(state)
}

let _handleRemovePickDataEventNameForAbsorbDeathControlledUnit = (usedGirl) => _handleRemoveDataEventNameForAbsorbDeathControlledUnit((api, state, usedGirl, scaleIncrease) => {
    return api.setGirlScaleAndKeepCamera(state, usedGirl, api.getGirlScale(state, usedGirl) + scaleIncrease)
}, usedGirl, 0.25)

let _handleRemoveBreastDataEventNameForAbsorbDeathControlledUnit = (usedGirl) => _handleRemoveDataEventNameForAbsorbDeathControlledUnit((api, state, usedGirl, scaleRatio) => {
    return api.partialScaleBreast(state, usedGirl, api.limitBreastRatio(state, usedGirl, api.getBreastPartialScaleRatio(state, usedGirl) + scaleRatio))
}, usedGirl, 0.1)

let _handleRemoveShoeDataEventNameForAbsorbDeathControlledUnit = _handleRemovePickDataEventNameForAbsorbDeathControlledUnit


let _handleRemoveUBDataEventNameForAbsorbDeathControlledUnit = (usedGirl) => _handleRemoveDataEventNameForAbsorbDeathControlledUnit((api, state, usedGirl, scaleRatio) => {
    return api.partialScaleTorsor(state, usedGirl, api.limitTorsorRatio(state, usedGirl, api.getTorsorPartialScaleRatio(state, usedGirl) + scaleRatio))
}, usedGirl, 0.05)



let _handleDamageGiantessHandlerForDamagedSprayMilk = (usedGirl) => (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let careerFeatureName_ = careerFeatureName.DamagedSprayMilk

    if (api.isUseCareerFeature(state, userData.name, careerFeatureName_)
        && (userData.collisionPart == collisionPart.LeftBreast || userData.collisionPart == collisionPart.RightBreast)
        && [animationName.Idle, animationName.Walk].includes(api.girl.getCurrentAnimationName(state, usedGirl))
    ) {
        let hp = api.girl.getBodyHp(state, usedGirl)
        // let fullHp = api.girl.getFullHp(state, usedGirl)

        // if (hp < fullHp * 0.3) {
        //     return Promise.resolve([state, userData])
        // }

        if (api.NumberUtils.isRandomRate(api.getForceFactor(hp, userData.damage, 0.25, 0.7, 0))) {
            // if (true) {
            let actionName_ = getSprayMilkBlockService(state).getActionName()

            return triggerAction(state, usedGirl, actionName_).then(api.TupleUtils.getTuple2First).then(state => [state, userData])
        }
    }

    return Promise.resolve([state, userData])
}

export let getCareerFeatureData = (api: api, state: state): Array<careerFeatureData> => [
    {
        name: careerFeatureName.Empty,
        positive: true,
        category: category.Number,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Zero,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.Empty)()
        },
        generateRandomValueFunc: (state) => {
            return getNullableValue()
        },
        applyFunc: (state, characterType_, value, _) => {
            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseLuck,
        positive: true,
        category: category.Number,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseLuck)(api.NumberUtils.getDecimal(value, 1))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.1, 1)
        },
        applyFunc: (state, characterType_, value, _) => {
            switch (characterType_) {
                case characterType.LittleMan:
                    state = api.LittleManBuildUtils.setLuck(state, api.buildFuncData(state), (state, luck) => luck + value)
                    break
                case characterType.Giantess:
                    state = api.GiantessBuildUtils.setLuck(state, api.buildFuncData(state), (state, luck) => luck + value, usedGirlEnum.PlayerGirl)
                    break
            }

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.DecreaseLuck,
        positive: false,
        category: category.Number,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Low,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.DecreaseLuck)(api.NumberUtils.getDecimal(value, 1))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.1, 1)
        },
        selectRandomConditionFunc: (state, data) => {
            return NullableUtils.isNullable(data.find(d => d.name == careerFeatureName.IncreaseLuck))
        },
        applyFunc: (state, characterType_, value, _) => {
            switch (characterType_) {
                case characterType.LittleMan:
                    state = api.LittleManBuildUtils.setLuck(state, api.buildFuncData(state), (state, luck) => luck - value)
                    break
                case characterType.Giantess:
                    state = api.GiantessBuildUtils.setLuck(state, api.buildFuncData(state), (state, luck) => luck - value, usedGirlEnum.PlayerGirl)
                    break
            }

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseMoveSpeed,
        positive: true,
        category: category.Number,
        characterType: characterType.LittleMan,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseMoveSpeed)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.2, 1)
        },
        applyFunc: (state, characterType_, value, _) => {
            state = api.LittleManBuildUtils.setMoveSpeed(state, api.buildFuncData(state), (state, v) => v * (1 + value))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.DecreaseArmorStrength,
        positive: false,
        category: category.Number,
        characterType: characterType.LittleMan,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.DecreaseArmorStrength)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.2, 1)
        },
        applyFunc: (state, characterType_, value, _) => {
            state = api.LittleManBuildUtils.setArmorStrength(state, api.buildFuncData(state), (state, v) => v * (1 - value))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.ReduceDamage,
        positive: false,
        category: category.Number,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.ReduceDamage)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.randomSelect([
                0.25,
                0.5,
                0.75,
                1
            ])
        },
        applyFunc: (state, characterType_, value, name) => {
            if (_isOtherCharacterTypeApplied(api, state, characterType_, name)) {
                return Promise.resolve(state)
            }

            // state = api.event.onWithUserData(state, api.event.getHandleDamageArmyEventName(), _handleDamageHandlerForReduceDamage(name, value))
            // state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandlerForReduceDamage(name, value))
            state = api.event.onWithUserData(state, api.event.getHandleDamageArmyEventName(), _handleDamageHandlerForReduceDamage)
            state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandlerForReduceDamage)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseFullHp,
        positive: true,
        category: category.Number,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseFullHp)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.2, 1)
        },
        applyFunc: (state, characterType_, value, name) => {
            switch (characterType_) {
                case characterType.LittleMan:
                    state = api.LittleManBuildUtils.setHp(state, api.buildFuncData(state), (state, hp) => {
                        return hp * (1 + value)
                    }, true)
                    break
                case characterType.Giantess:
                    state = api.GiantessBuildUtils.setFullHp(state, api.buildFuncData(state), (state, hp) => {
                        return hp * (1 + value)
                    }, true, usedGirlEnum.PlayerGirl)
                    break
            }

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseRestoreHpStrength,
        positive: true,
        category: category.Number,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseRestoreHpStrength)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.2, 1)
        },
        applyFunc: (state, characterType_, value, name) => {
            switch (characterType_) {
                case characterType.LittleMan:
                    state = api.LittleManBuildUtils.setRestoreHpSpeedRate(state, api.buildFuncData(state), (state, v) => {
                        return v * (1 + value)
                    })
                    break
                case characterType.Giantess:
                    state = api.GiantessBuildUtils.setRestoreHpSpeedRate(state, api.buildFuncData(state), (state, v) => {
                        return v * (1 + value)
                    }, usedGirlEnum.PlayerGirl)
                    break
            }

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseStubRate,
        positive: false,
        category: category.Number,
        characterType: characterType.LittleMan,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseStubRate)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.2, 1)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.LittleManBuildUtils.setStressingRateFactor(state, api.buildFuncData(state), (_, v) => v * (1 + value))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseItemPrice,
        positive: false,
        category: category.Number,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseItemPrice)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.1, 5)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = setItemPriceFactor(state, getItemPriceFactor(state) + api.getCareerFeatureValueByCharacterType(state, characterType_, name))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.DecreaseItemPrice,
        positive: true,
        category: category.Number,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.DecreaseItemPrice)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.1, 0.5)
        },
        selectRandomConditionFunc: (state, data) => {
            return NullableUtils.isNullable(data.find(d => d.name == careerFeatureName.IncreaseItemPrice))
        },
        applyFunc: (state, characterType_, value, name) => {
            state = setItemPriceFactor(state, getItemPriceFactor(state) - api.getCareerFeatureValueByCharacterType(state, characterType_, name))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseGetCoin,
        positive: true,
        category: category.Number,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseGetCoin)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.1, 0.3)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = setCoinFactor(state, getCoinFactor(state) + api.getCareerFeatureValueByCharacterType(state, characterType_, name))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.DecreaseRewardPropCount,
        positive: false,
        category: category.Number,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.DecreaseRewardPropCount)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.2, 1)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = setPropCountFactor(state, getPropCountFactor(state) + api.getCareerFeatureValueByCharacterType(state, characterType_, name))

            return Promise.resolve(state)
        },
    },
    // {
    //     name: careerFeatureName.IncreaseLevelGiantessExcitementClimaxRate,
    //     positive: true,
    //     category: category.Number,
    //     characterType: characterType.LittleMan,
    //     // excludeNames: [],
    //     rate: rate.Middle2,
    //     getDescriptionFunc: (state, value) => {
    //         return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseLevelGiantessExcitementClimaxRate)(NumberUtils.convertDecimalToPercent(value, 3))
    //     },
    //     generateRandomValueFunc: (state) => {
    //         return api.NumberUtils.getRandomFloat(0.2, 1)
    //     },
    //     applyFunc: (state, characterType_, value, name) => {
    //         state = increaseLevelGiantessExcitementClimaxRate(state, api.getCareerFeatureValue(state, name))

    //         return Promise.resolve(state)
    //     },
    // },
    {
        name: careerFeatureName.IncreaseTradeVariety,
        positive: true,
        category: category.Number,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseTradeVariety)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.1, 1)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = setTradeVarietyFactor(state, getTradeVarietyFactor(state) + api.getCareerFeatureValueByCharacterType(state, characterType_, name))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseUpgradeWeaponCost,
        positive: false,
        category: category.Number,
        characterType: characterType.LittleMan,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseUpgradeWeaponCost)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.5, 4)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = getWeaponGirlBlockService(state).custom.setCostFactor(api, state, (1 + api.getCareerFeatureValueByCharacterType(state, characterType_, name)))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.EnhenceByFreeUB,
        positive: true,
        category: category.Number,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.EnhenceByFreeUB)(value)
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomInteger(1, 5)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.on(state, api.event.getFreeUBEventName(), _handleEnhenceByFreeUB)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.EnhenceByFreeShoe,
        positive: false,
        category: category.Number,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.EnhenceByFreeShoe)(Math.round(value * 100))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.1, 0.3)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.on(state, api.event.getFreeShoeEventName(), _handleEnhenceByFreeShoe)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseUBCapacity,
        positive: true,
        category: category.Number,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseUBCapacity)(Math.round(value * 100))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.1, 1)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = setUBCapacityFactor(state, api.getCareerFeatureValueByCharacterType(state, characterType_, name))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseTrigoneAndButtDamage,
        positive: false,
        category: category.Number,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseTrigoneAndButtDamage)(Math.round(value * 100))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.5, 2)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandlerForIncreaseTrigoneAndButtDamage)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.EnhenceByCarry,
        positive: true,
        category: category.Number,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.EnhenceByCarry)(value)
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomInteger(1, 3)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = setEnhenceByCarryLevel(state, api.getCareerFeatureValueByCharacterType(state, characterType_, name))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseGiantessDamaged,
        positive: false,
        category: category.Number,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseGiantessDamaged)(Math.round(value * 100))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.1, 2)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandlerForIncreaseGiantessDamaged)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseExp,
        positive: true,
        category: category.Number,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Low,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseExp)(Math.round(value * 100))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.2, 2)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = setExpFactor(state, characterType_, api.getCareerFeatureValueByCharacterType(state, characterType_, name))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.DecreaseGiantessDefense,
        positive: false,
        category: category.Number,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Low,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.DecreaseGiantessDefense)(Math.round(value * 100))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.1, 0.99)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.GiantessBuildUtils.setDefenseFactor(state, api.buildFuncData(state), (state, value) => value * (1 - api.getCareerFeatureValueByCharacterType(state, characterType_, name)), usedGirlEnum.PlayerGirl)

            return Promise.resolve(state)
        },
    },

    {
        name: careerFeatureName.AfterMissionComplete_AliveOneEnemy_GetReward,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Both,
        // excludeNames: [],
        // rate: rate.VeryLow,
        rate: rate.Low,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.AfterMissionComplete_AliveOneEnemy_GetReward)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.1, 1)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.on(state, api.event.getMissionFinishEventName(), _handleMissionFinishHandlerForAfterMissionComplete_AliveOneEnemy_GetReward(characterType_))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseMeleeDamageByMoveSpeed,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.LittleMan,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseMeleeDamageByMoveSpeed)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.05, 0.3)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.onWithUserData(state, api.event.getHandleDamageArmyEventName(), _handleDamageHandlerForIncreaseMeleeDamageByMoveSpeed)
            state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandlerForIncreaseMeleeDamageByMoveSpeed)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.DecreaseDefenseWhenNotMove,
        positive: false,
        category: category.Mechanism,
        characterType: characterType.LittleMan,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.DecreaseDefenseWhenNotMove)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.2, 1)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.onWithUserData(state, api.event.getGetLittleManValueEventName(), _handleGetLittleManValueHandlerForDecreaseDefenseWhenNotMove)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.ReduceDamageButIncreaseWhenDamaged,
        positive: false,
        category: category.Mechanism,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, [v1, v2, v3]) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.ReduceDamageButIncreaseWhenDamaged)([Math.round(v1 * 100), Math.round(v2 * 100), v3])
        },
        generateRandomValueFunc: (state) => {
            return [
                api.NumberUtils.randomSelect([
                    // 0.25,
                    0.5,
                    0.75,
                    1
                ]),
                api.NumberUtils.getRandomFloat(0.02, 0.1),
                api.NumberUtils.getRandomInteger(15, 25)
            ]
        },
        applyFunc: (state, characterType_, value, name) => {
            if (_isOtherCharacterTypeApplied(api, state, characterType_, name)) {
                return Promise.resolve(state)
            }

            state = api.event.onWithUserData(state, api.event.getHandleDamageArmyEventName(), _handleDamageHandlerForReduceDamageButIncreaseWhenDamaged)
            state = api.event.onWithUserData(state, api.event.getHandleDamageLittleManEventName(), _handleDamageHandlerForReduceDamageButIncreaseWhenDamaged)
            state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandlerForReduceDamageButIncreaseWhenDamaged)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.ReduceDamageButIncreaseWhenSingleDamage,
        positive: false,
        category: category.Mechanism,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, [v1, v2, v3]) => {
            // return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.ReduceDamageButIncreaseWhenSingleDamage)([Math.round(v1 * 100), Math.round(v2 * 100), v3])
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.ReduceDamageButIncreaseWhenSingleDamage)([Math.round(v1 * 100), Math.round(v2 * 100), v3])
        },
        generateRandomValueFunc: (state) => {
            return [
                api.NumberUtils.randomSelect([
                    0.5,
                    0.75,
                    0.99
                ]),
                // api.NumberUtils.getRandomFloat(0.1, 0.3),
                // api.NumberUtils.getRandomInteger(5, 30),
                isLittleCharacterType(state) ? api.NumberUtils.getRandomFloat(0.05, 0.3) : api.NumberUtils.getRandomFloat(0.15, 0.8),
                // api.NumberUtils.getRandomInteger(3, 10)
                isLittleCharacterType(state) ? api.NumberUtils.getRandomInteger(3, 10) : api.NumberUtils.getRandomInteger(6, 20),
            ]
        },
        applyFunc: (state, characterType_, value, name) => {
            if (_isOtherCharacterTypeApplied(api, state, characterType_, name)) {
                return Promise.resolve(state)
            }

            state = api.event.onWithUserData(state, api.event.getHandleDamageArmyEventName(), _handleDamageHandlerForReduceDamageButIncreaseWhenSingleDamage)
            state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandlerForReduceDamageButIncreaseWhenSingleDamage)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.ReduceGiantessDamage,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.LittleMan,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.ReduceGiantessDamage)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.2, 1)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.onWithUserData(state, api.event.getHandleDamageLittleManEventName(), _handleDamageLittleManHandlerForReduceGiantessDamage)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseDamageMMDGiantessWeakness,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.LittleMan,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseDamageMMDGiantessWeakness)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.3, 1)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageGiantessHandlerForReduceGiantessDamageIncreaseDamageMMDGiantessWeakness)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseAttackWhenStubExcitementClimax,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.LittleMan,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseAttackWhenStubExcitementClimax)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.05, 0.2)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.on(state, api.event.getGiantessStressingEventName(), _handleGiantessStubHandlerForIncreaseAttackWhenStubExcitementClimax)
            state = api.event.on(state, api.event.getGiantessExcitementEventName(), _handleGiantessStubHandlerForIncreaseAttackWhenStubExcitementClimax)
            state = api.event.on(state, api.event.getGiantessClimaxEventName(), _handleGiantessStubHandlerForIncreaseAttackWhenStubExcitementClimax)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseFullHpByEat,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseFullHpByEat)(value)
        },
        generateRandomValueFunc: (state) => {
            // return api.NumberUtils.getRandomInteger(2, 10)
            return api.NumberUtils.getRandomInteger(1, 4)
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.on(state, api.event.getTriggerPlayerGirlEatHandlerEventName(), _handleTriggerPlayerGirlEatHandlerHandlerForIncreaseFullHpByEat)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.RemainScaleByEat,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.RemainScaleByEat)()
        },
        generateRandomValueFunc: (state) => {
            return getNullableValue()
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.on(state, api.event.getTriggerPlayerGirlEatHandlerEventName(), _handleTriggerPlayerGirlEatHandlerHandlerForRemainScaleByEat)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.UseFullHpReplaceCoin,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.VeryLow,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.UseFullHpReplaceCoin)()
        },
        generateRandomValueFunc: (state) => {
            return getNullableValue()
        },
        applyFunc: (state, characterType_, value, name) => {
            state = setIsUseFullHpReplaceCoinType(state, characterType_)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.AfterMissionComplete_ConvertCoinToFullHp,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.VeryLow,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.AfterMissionComplete_ConvertCoinToFullHp)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.randomSelect([
                0.25,
                0.5,
                0.75,
                1
            ])
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.on(state, api.event.getMissionFinishEventName(), _handleMissionFinishHandlerForAfterMissionComplete_ConvertCoinToFullHp(characterType_))

            return Promise.resolve(state)
        },
        // deapplyFunc: (state, characterType_, name) => {
        //     console.log("aaa")

        //     return Promise.resolve(state)
        // },
    },
    // {
    //     name: careerFeatureName.GetRandomPropEveryMinute,
    //     positive: true,
    //     category: category.Mechanism,
    //     characterType: characterType.Both,
    //     // characterType: characterType.LittleMan,
    //     // excludeNames: [],
    //     rate: rate.Middle1,
    //     getDescriptionFunc: (state, value) => {
    //         return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.GetRandomPropEveryMinute)(value)
    //     },
    //     generateRandomValueFunc: (state) => {
    //         // return api.NumberUtils.getRandomInteger(2, 4)
    //         // return api.NumberUtils.getRandomInteger(1, 6)
    //         return api.NumberUtils.getRandomInteger(1, 3)
    //     },
    //     applyFunc: (state, characterType_, value, name) => {
    //         state = api.event.on(state, api.event.getUpdateEventName(), _updateHandlerForGetRandomPropEveryMinute(generateKey()))

    //         return Promise.resolve(state)
    //     },
    // },
    {
        name: careerFeatureName.GetGoodsEveryMinute,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Both,
        // characterType: characterType.LittleMan,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.GetGoodsEveryMinute)(value)
        },
        generateRandomValueFunc: (state) => {
            // return api.NumberUtils.getRandomInteger(2, 4)
            // return api.NumberUtils.getRandomInteger(1, 6)
            return api.NumberUtils.getRandomInteger(1, 3)
        },
        applyFunc: (state, characterType_, value, name) => {
            if (getFreeBuyCount(state) == 0) {
                state = api.event.on(state, api.event.getUpdateEventName(), _updateHandlerForGetGoodsEveryMinute(generateKey()))
            }

            state = setFreeBuyCount(state, getFreeBuyCount(state) + api.getCareerFeatureValueByCharacterType(state, characterType_, name))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.EnhenceGiantessAfterBeat,
        positive: false,
        category: category.Mechanism,
        // characterType: characterType.LittleMan,
        characterType: characterType.Both,
        // characterType: characterType.LittleMan,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.EnhenceGiantessAfterBeat)()
        },
        generateRandomValueFunc: (state) => {
            return getNullableValue()
        },
        applyFunc: (state, characterType_, value, name) => {
            if (_isOtherCharacterTypeApplied(api, state, characterType_, name)) {
                return Promise.resolve(state)
            }

            state = api.event.on(state, getDestroyedEventName(), _destoryedHandlerForEnhenceGiantessAfterBeat)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.EnhenceArmyAfterBeat,
        positive: false,
        category: category.Mechanism,
        characterType: characterType.Both,
        // characterType: characterType.LittleMan,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.EnhenceArmyAfterBeat)()
        },
        generateRandomValueFunc: (state) => {
            return getNullableValue()
        },
        applyFunc: (state, characterType_, value, name) => {
            if (_isOtherCharacterTypeApplied(api, state, characterType_, name)) {
                return Promise.resolve(state)
            }

            state = api.event.on(state, getDestroyedEventName(), _destoryedHandlerForEnhenceArmyAfterBeat)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseDamageByCoin,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            // return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseDamageByCoin)(NumberUtils.convertDecimalToPercent(value, 3))
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseDamageByCoin)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            // return api.NumberUtils.getRandomFloat(0.005, 0.02)
            return api.NumberUtils.getRandomFloat(0.0025, 0.01)
        },
        applyFunc: (state, characterType_, value, name) => {
            if (_isOtherCharacterTypeApplied(api, state, characterType_, name)) {
                return Promise.resolve(state)
            }

            state = api.event.onWithUserData(state, api.event.getHandleDamageArmyEventName(), _handleDamageHandlerForIncreaseDamageByCoin)
            // state = api.event.onWithUserData(state, api.event.getHandleDamageLittleManEventName(), _handleDamageHandlerForIncreaseDamageByCoin)
            state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandlerForIncreaseDamageByCoin)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseGetCoinEveryMimute,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseGetCoinEveryMimute)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.02, 0.08)
        },
        applyFunc: (state, characterType_, value, name) => {
            if (_isOtherCharacterTypeApplied(api, state, characterType_, name)) {
                return Promise.resolve(state)
            }

            state = api.event.on(state, api.event.getUpdateEventName(), _updateHandlerForIncreaseGetCoinEveryMimute(generateKey()))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.IncreaseGetCoinWithMaxHp,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.IncreaseGetCoinWithMaxHp)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.003, 0.01)
        },
        applyFunc: (state, characterType_, value, name) => {
            if (_isOtherCharacterTypeApplied(api, state, characterType_, name)) {
                return Promise.resolve(state)
            }

            state = api.event.on(state, getGetPropEventName(), _getPropHandlerForIncreaseGetCoinWithMaxHp)

            return Promise.resolve(state)
        },
    },
    // {
    //     name: careerFeatureName.DecreaseLevelCoinEveryTwoMinutes,
    //     positive: false,
    //     category: category.Mechanism,
    //     characterType: characterType.Both,
    //     // excludeNames: [],
    //     rate: rate.Middle1,
    //     getDescriptionFunc: (state, value) => {
    //         return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.DecreaseLevelCoinEveryTwoMinutes)(NumberUtils.convertDecimalToPercent(value, 3))
    //     },
    //     generateRandomValueFunc: (state) => {
    //         return api.NumberUtils.getRandomFloat(0.1, 1)
    //     },
    //     applyFunc: (state, characterType_, value, name) => {
    //         state = api.event.on(state, api.event.getUpdateEventName(), _updateHandlerForDecreaseCoinEveryTwoMinutes(characterType_, generateKey()))

    //         return Promise.resolve(state)
    //     },
    // },
    {
        name: careerFeatureName.DecreaseCoinAfterBuyTrade,
        positive: false,
        category: category.Mechanism,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.DecreaseCoinAfterBuyTrade)(NumberUtils.convertDecimalToPercent(value, 3))
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomFloat(0.2, 1)
        },
        applyFunc: (state, characterType_, value, name) => {
            if (_isOtherCharacterTypeApplied(api, state, characterType_, name)) {
                return Promise.resolve(state)
            }

            state = api.event.on(state, getAfterBuyTradeEventName(), _afterBuyHandlerForDecreaseCoinAfterBuyTrade)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.Duelist,
        positive: false,
        category: category.Mechanism,
        characterType: characterType.Both,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.Duelist)()
        },
        generateRandomValueFunc: (state) => {
            return getNullableValue()
        },
        applyFunc: (state, characterType_, value, name) => {
            if (getDuelistFactor(state) == 0) {
                state = api.event.on(state, api.event.getUpdateEventName(), _updateHandlerForDuelist(generateKey()))
            }

            state = setDuelistFactor(state, getDuelistFactor(state) + 1)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.BulletSpeedMax,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.LittleMan,
        // excludeNames: [],
        rate: rate.Middle2,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.BulletSpeedMax)()
        },
        generateRandomValueFunc: (state) => {
            return getNullableValue()
        },
        applyFunc: (state, characterType_, value, name) => {
            state = getAllWeaponNames(state).reduce((state, weaponName) => {
                return getWeaponGirlBlockService(state).custom.setBulletSpeedMax(api, state, weaponName)
            }, state)

            return Promise.resolve(state)
        },
        deapplyFunc: (state, characterType_, name) => {
            state = getAllWeaponNames(state).reduce((state, weaponName) => {
                return getWeaponGirlBlockService(state).custom.setBulletSpeedMin(api, state, weaponName)
            }, state)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.ConvertToFriendCampByFreeUB,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Low,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.ConvertToFriendCampByFreeUB)()
        },
        generateRandomValueFunc: (state) => {
            return getNullableValue()
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.on(state, api.event.getFreeUBEventName(), _handleConvertToFriendCampByFreeUB)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.ControlledUnitCanAttack,
        positive: false,
        category: category.Mechanism,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.ControlledUnitCanAttack)()
        },
        generateRandomValueFunc: (state) => {
            return getNullableValue()
        },
        applyFunc: (state, characterType_, value, name) => {
            state = setIsControlledUnitCanAttack(state, true)

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.DamageControlledUnit,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.DamageControlledUnit)(value)
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomInteger(1, 3)
        },
        applyFunc: (state, characterType_, value, name) => {
            // let level = api.getCareerFeatureValue(state, name)
            let level = value

            state = api.setAbstractState(state, api.Flow.addInterval(api.getAbstractState(state), [api.getAbstractState, api.setAbstractState, state => {
                return ArrayUtils.reducePromise(
                    api.girl.getCurrentUsedGirls(state),
                    (state, usedGirl: usedGirl) => {
                        if (!api.isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
                            return Promise.resolve(state)
                        }

                        return _handleDamageControlledUnit(api, state, usedGirl, api.getPickObjectData(state, usedGirl), level, 1, 0.25).then(state => {
                            return _handleDamageControlledUnit(api, state, usedGirl, api.getPutToBreastObjectData(state, usedGirl), level, api.getBreastVolumnFactor(state, usedGirl, 0.25, 3), 0.5)
                        }).then(state => {
                            return _handleDamageControlledUnit(api, state, usedGirl, api.getPutToShoeObjectData(state, usedGirl), level, 1, 0.25)
                        }).then(state => {
                            return _handleDamageControlledUnit(api, state, usedGirl, api.getUBObjectData(state, usedGirl), level, 1, 1)
                        })
                    },
                    state
                )
            }], 3, name))
            // }], 0.5, name))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.AbsorbDeathControlledUnit,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.AbsorbDeathControlledUnit)(value)
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomInteger(1, 3)
        },
        applyFunc: (state, characterType_, value, name) => {
            let usedGirl = usedGirlEnum.PlayerGirl
            state = api.event.on(state, api.event.getRemovePickDataEventName(), _handleRemovePickDataEventNameForAbsorbDeathControlledUnit(usedGirl))
            state = api.event.on(state, api.event.getRemoveUBDataEventName(), _handleRemoveUBDataEventNameForAbsorbDeathControlledUnit(usedGirl))
            state = api.event.on(state, api.event.getRemoveBreastDataEventName(), _handleRemoveBreastDataEventNameForAbsorbDeathControlledUnit(usedGirl))
            state = api.event.on(state, api.event.getRemoveShoeDataEventName(), _handleRemoveShoeDataEventNameForAbsorbDeathControlledUnit(usedGirl))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.DamagedSprayMilk,
        positive: false,
        category: category.Mechanism,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Low,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.DamagedSprayMilk)()
        },
        generateRandomValueFunc: (state) => {
            return getNullableValue()
        },
        applyFunc: (state, characterType_, value, name) => {
            state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageGiantessHandlerForDamagedSprayMilk(usedGirlEnum.PlayerGirl))

            return Promise.resolve(state)
        },
    },
    {
        name: careerFeatureName.BreastFeeding,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.VeryLow,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.BreastFeeding)(value)
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomInteger(1, 3)
        },
        applyFunc: (state, characterType_, value, name) => {
            let level = value

            let usedGirl = usedGirlEnum.PlayerGirl

            state = api.setAbstractState(state, api.Flow.addInterval(api.getAbstractState(state), [api.getAbstractState, api.setAbstractState, state => {
                if (!api.isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
                    return Promise.resolve(state)
                }

                let breastScaleFactor = api.getBreastVolumnFactor(state, usedGirl, 0.25, 5)

                const addHpRatio = 0.05 * breastScaleFactor * level
                const rate = 0.1

                return api.ArrayUtils.reducePromise(
                    api.getPutToBreastObjectData(state, usedGirl).toArray(),
                    ([state, totalVolumn, totalAddedHp], { queue, index, name, getBoxFunc }: giantessAddToSkeletonData) => {
                        let box = getBoxFunc(state, queue, index, name)

                        let data = api.healArmy(api, state, addHpRatio, name, box)
                        state = data[0]
                        let addedHp = data[1]

                        if (addedHp > 0) {
                            totalVolumn += api.box3.getBoxVolumn(api.NullableUtils.getExn(box))
                            totalAddedHp += addedHp

                            if (api.NumberUtils.isRandomRate(rate)) {
                                state = _convertToFriendCamp(api, state, name)
                            }
                        }

                        return [state, totalVolumn, totalAddedHp]
                    },
                    [state, 0, 0]
                ).then(([state, totalVolumn, totalAddedHp]) => {
                    let ratio = api.NumberUtils.clamp(totalVolumn / api.box3.getBoxVolumn(api.obb.toBox3(api.getCollisionPartOBB(state, usedGirl, collisionPart.RightBreast))), 0, 1)


                    // state = api.partialScaleBreast(state, usedGirl, api.limitBreastRatio(state, usedGirl,api.getBreastPartialScaleRatio(state, usedGirl) + ratio * 0.25 * level))
                    state = api.partialScaleBreast(state, usedGirl, api.limitBreastRatio(state, usedGirl, api.getBreastPartialScaleRatio(state, usedGirl) + ratio * 1 * level))


                    let position = api.getGirlPosition(state, usedGirl)
                    // let force = totalAddedHp * ratio
                    let force = totalAddedHp * 0.5
                    let collisionPart_ = collisionPart.BoundingBox
                    let damageType_ = damageType.Global
                    let weaponType_ = weaponType.EffectSelf

                    return api.damageGiantess(
                        state,
                        usedGirl,
                        [
                            force,
                            damageType_,
                            weaponType_
                        ],
                        api.girl.buildNameByUsedGirl(usedGirl),

                        collisionPart_,
                        position,
                        api.buildGirlWeaponValue(
                            force,
                            armorPiercingForceRatio.VeryHigh2,
                            critRatio.Zero,
                        ),
                    )
                })
            }], 5, name))

            return Promise.resolve(state)

        },
    },
    {
        name: careerFeatureName.CharmNearFoot,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.CharmNearFoot)(value)
        },
        generateRandomValueFunc: (state) => {
            return api.NumberUtils.getRandomInteger(1, 3)
        },
        applyFunc: (state, characterType_, value, name) => {
            let count = value
            let usedGirl = usedGirlEnum.PlayerGirl

            state = api.setAbstractState(state, api.Flow.addInterval(api.getAbstractState(state), [api.getAbstractState, api.setAbstractState, state => {
                if (!api.isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
                    return Promise.resolve(state)
                }

                const rate = 0.1
                // const rate = 1
                const time = 20
                let position = api.box3.getCenter(
                    api.box3.union(
                        api.obb.toBox3(api.getCollisionPartOBB(state, usedGirl, collisionPart.RightFoot)),
                        api.obb.toBox3(api.getCollisionPartOBB(state, usedGirl, collisionPart.LeftFoot))
                    ),
                    _v1
                )
                // const distance = api.getNearGirlDistance(state, usedGirl, api.box3.getBoxMaxSize(api.obb.toBox3(api.getCollisionPartOBB(state, usedGirl, collisionPart.RightFoot))) * 3)
                const distance = api.getNearGirlDistance(state, usedGirl, api.box3.getBoxMaxSize(api.obb.toBox3(api.getCollisionPartOBB(state, usedGirl, collisionPart.RightFoot))))

                return api.ArrayUtils.reducePromise(
                    api.findNearData(state, api.getAllAliveEliteGiantessData, position, camp.Other, distance)
                        .concat(
                            api.findNearData(state, api.getAllAliveSoldierData, position, camp.Other, distance)
                        ),
                    (state, { name, queue, index }) => {
                        if (api.NumberUtils.isRandomRate(rate)) {
                            return api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffCharmBlockName()).addBuff(api, state, name, api.NullableUtils.getEmpty(), count, time,
                                api.box3.getBoxTopPoint(api.NullableUtils.getExn(queue).getBox(index), 0.2, api.vector3.createEmpty())
                            )
                        }

                        return Promise.resolve(state)
                    },
                    state
                )
            }], 3, name))

            return Promise.resolve(state)

        },
    },
    {
        name: careerFeatureName.ConvertToFriendCampForPutToShoe,
        positive: true,
        category: category.Mechanism,
        characterType: characterType.Giantess,
        // excludeNames: [],
        rate: rate.Middle1,
        getDescriptionFunc: (state, value) => {
            return api.getLanguageDataByData(state, getTextDataByVariable(), languageVariableKey.ConvertToFriendCampForPutToShoe)()
        },
        generateRandomValueFunc: (state) => {
            return getNullableValue()
        },
        applyFunc: (state, characterType_, value, name) => {
            let usedGirl = usedGirlEnum.PlayerGirl

            state = api.setAbstractState(state, api.Flow.addInterval(api.getAbstractState(state), [api.getAbstractState, api.setAbstractState, state => {
                if (!api.isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
                    return Promise.resolve(state)
                }

                let buffName = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffArmyCharmBlockName()).getName()


                state = ArrayUtils.reduce(
                    getCurrentUsedGirls(state),
                    (state, usedGirl: usedGirl) => {
                        return api.getPutToShoeObjectData(state, usedGirl).reduce((state, { name }) => {
                            return api.NullableUtils.getWithDefault(
                                api.NullableUtils.map(buff => {
                                    if (buff.superPositionCount >= 3) {
                                        return _convertToFriendCamp(api, state, name)
                                    }

                                    return state
                                }, api.findBuff(state, buffName, name, api.NullableUtils.getEmpty())),
                                state
                            )
                        }, state)
                    },
                    state
                )

                return Promise.resolve(state)
            }], 3, name))

            return Promise.resolve(state)
        },
    },
]

export let getNullableValue = () => -Infinity

export let findCareerFeatureDataByName = (data, name) => {
    return NullableUtils.getExn(data.find(d => d.name == name))
}