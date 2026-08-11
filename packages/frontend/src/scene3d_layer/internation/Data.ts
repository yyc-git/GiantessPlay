import { getLanguage } from "../script/scene/Scene"
import { getTextData as getTextDataInternation, getTextDataByVariable as getTextDataByVariableInternation, getImageData as getImageDataInternation } from "../script/scene/scene_city/Internation"
import { language, state } from "../type/StateType"

// export type data = Record<language, Record<languageKey, string>>
export type data = Record<language, Record<any, string>>

// export type variableData = Record<language, Record<languageVariableKey, (value: string) => string>>
export type variableData = Record<language, Record<any, (value: string) => string>>

export type imageData = Record<language, Record<languageImageKey, string>>

export enum languageKey {
    VeryLow,
    Low,
    Middle,
    High,
    VeryHigh,

    CameraRotateSpeed,


    // JoinCrowdFunding,
    EnterOldVersion,
    Enter2Version,
    EnterGame,
    Mod,
    Setting,
    Website,
    Logout,
    IsLogout,

    Confirm,
    Cancel,
    BackToIndex,
    Back,
    Reset,
    More,


    Clipboard,
    EnableClipboard,

    Success,
    Fail,


    DifficultTitle,
    TotalHeat,
    HeatUnit,
    RewardLevel,
    LevelUnit,
    MatchDifficultyExplain,
    MatchDifficultyTitle,

    DifficultyName,
    DifficultyRatio,
    DifficultyOperate,
    DifficultyHeat,


    AddCommonArmyCount,
    AddEliteArmyCount,
    AddArmyDamage,
    SubPlayerRestoreHp,
    AddArmyHp,

    EnhenceEliteGiantess,
    EnhenceArmy,
    EnhenceLevelGiantess,
    EnhenceBossGiantess,
    AddMaxMMDGiantessCount,
    AllowFriendDamage,
    RemoveMapEdgeZone,

    DecreaseGenerateArmyInterval,



    Difficulty,


    AddGiantessHp,
    AddGiantessDefenseFactor,
    AddGiantessAttackFactor,
    AddGiantessLife,
    AddBiggerScale,
    AddActiveBiggerTime,
    AddPassiveBiggerIncreaseScale,
    AddDamageBiggerIncreaseScale,
    AddInitialScale,
    SubDurationFactor,
    AddGiantessCritRatioFactor,
    AddGiantessLuck,
    SubGiantessRestoreHpTime,
    AddGiantessRestoreHpSpeedRate,
    GiantessStrong,
    AddGiantessArmor,

    AddLittleManHp,
    AddLittleManDefenseFactor,
    AddLittleManArmor,
    AddLittleManAttackFactor,
    AddEmitterLifeFactor,
    AddMoveSpeed,
    AddLittleManLife,
    LittleManStrong,
    AddLittleManCritRatioFactor,
    AddLittleManLuck,
    SubLittleManRestoreHpTime,
    AddLittleManRestoreHpSpeedRate,

    TalentTitle,
    GemRemain,
    Take,
    GemNotEnough,
    UnlockTalentPhaseDescription,
    UpgradeMax,


    Has,




    // LearnRun,
    LearnBigger,
    LearnStandToCrawlAndCrawlToStand,
    LearnStandToCrawlAndCrawlToStandDescription,
    LearnBreastPress,
    LearnPickAndPickdown,
    LearnPickAndPickdownDescription,
    LearnPinch,
    LearnEat,
    LearnEatDescription,
    ChangeToPassiveBigger,
    EnhanceBigger,
    MoveAndStompDamageEnhance,
    OldSoldier_Giantess,
    LuckDog_Giantess,

    LearnBlink,
    LearnSwip,
    LearnFastRun,
    ComboStorm,
    ClothDamageEnhance,
    FragileGrowth,
    Crazy,
    OldSoldier_Little,
    LuckDog_Little,










    MissionCompleteTitle,
    EnterNextCityLevel,
    LevelGameTime,
    LevelGem,
    LevelCoin,
    EnterBossLevel,
    // Wait5S,
    Wait20S,
    ActiveReward,


    MissionEndTitle,
    TotalGameTime,


    MissionFailTitle,




    EndLevelConfirm,
    Camera,
    // Skill,
    UI,
    Operate,
    EndLevel,
    ZoomIn,
    ZoomOut,
    Up,
    Down,
    SetTarget,
    Chest,
    Foot,
    Free,
    Eye,
    Leg,
    UseThirdPersonCamera,
    UseFirstPersonCamera,
    MainSettingTitle,
    PackageTitle,
    AddToFastProp,

    HideUI,
    ShowUI,

    ShowGemAnimation,
    NotShowGemAnimation,
    ShowCoinAnimation,
    NotShowCoinAnimation,
    GenerateProp,
    NotGenerateProp,
    ShowUpgradeParticle,
    HideUpgradeParticle,
    ShowBuildingSmoke,
    HideBuildingSmoke,
    ShowExplosionSmoke,
    HideExplosionSmoke,
    EliteGiantePlayDeathAnimation,
    EliteGianteNotPlayDeathAnimation,

    EnableFullScreen,
    DisableFullScreen,

    SetSkillButtonTip,
    StartSetSkillButton,
    EndSetSkillButton,
    ResetSkillButton,

    FireWayTip,
    BurstFire,
    ContinueFire,


    BasicBulletTitle,
    LaserBulletTitle,
    RocketBulletTitle,
    // BiggerBulletTitle,
    // SmallerToLastBiggerCountBulletTitle,

    BasicBulletDescription,
    LaserBulletDescription,
    RocketBulletDescription,
    // BiggerBulletDescription,
    // SmallerToLastBiggerCountBulletDescription,


    AddHp1Title,
    AddHp2Title,
    AddHp3Title,
    AddHp4Title,
    AddExcitement1Title,
    AddExcitement2Title,
    AddExcitement3Title,
    AddExcitement4Title,

    AddHp1Description,
    AddHp2Description,
    AddHp3Description,
    AddHp4Description,
    AddExcitement1Description,
    AddExcitement2Description,
    AddExcitement3Description,
    AddExcitement4Description,


    CallGiantessTitle,
    ClearHatredTitle,

    CallGiantessDescription,
    ClearHatredDescription,


    ReviveTitle,

    ReviveDescription,



    None,
    ArtifactPropTypeTitle,
    BulletPropTypeTitle,
    WaterPropTypeTitle,
    AssistantPropTypeTitle,
    OtherPropTypeTitle,





    OperateShootKey,
    // OperateSwipingKey,



    PressV,
    ChestBoxDescription,
    TradeGirlDescription,
    // BlessGirlDescription,
    FateGirlDescription,



    Coin,
    CoinNotEnough,



    EnterDuelistTime,
    EndDuelistTime,


    LittleMan,
    Giantess,
    LittleManAndGiantess,



    Hour,
    Minute,
    Second,

    Meter,



    Infinity,



    TradeTitle,
    Buy,
    Close,
    All,



    UpgradeTitle,
    Skip,
    Change,
    // NotWantCurrentUpgradeItems,
    Want,
    NotWant,
    AutoPopup,
    ManualPopup,


    SelectLittleManCareerTitle,
    SelectGiantessCareerTitle,
    GenerateRandomCareer,



    ShareTitle,
    ShareTitle2,
    ShareTitle3,


    SelectCharacterTitle,
    ForceReviveContent,
    RemainTalentContent,
    ForceRevive,
    DirectRevive,
    NeedCapture,



    SelectLittleManTitle,



    SettingTitle,




    ModTitle,
    ModInfo,

    ResourceLoadFail,


    ErrorHandleTitle,
    NetworkErrorHandleTitle,

    NetworkErrorHandleContent,

    RetryBackendRequest,
    Relogin,



    QuotaExceededErrorTitle,
    QuotaExceededErrorContent,
    ClearCacheAndReload,


    RestoreGameButton,
    SnapshotTitle,
    SnapshotContent,
    ToSnapshot,
    JoinGroup,
    Next,
    RestoreGame,




    ExplainTitle,
    KeyTitle,
    FunctionTitle,
    Key1Function,
    Key2Function,





    VersionExplain,


    SceneDescription,

    GetBackendDataInfo,
    InitingInfo,

    CssCompatible,


    EnteringScene,
    CaptureWildGiantessSuccessInfo,
    RestorePointerLockInfo,
    KnowInfo,
    GetReward,
    GetConfirm,
    // GivePlayerRandomBuff,
    NothingHappen,

    Ignore,


    SuggestUseChrome,
    SuggestUseALook,
    IPadHasCompatibilityIssue,
    TipInApp,

    FullScreen,

    MemoryIsSmall,
    ContextLost,
    WebGLError,
    CanvasNone,

    AutoRestore,


    UseGiantessCharacterNotEnough,
    // UseArtifactNotEnough,
    GoToActive,
    UseGiantessCharacter,

    InputActiveCode,
    ActiveSuccess,
    ActiveVIPSuccess,
    ActiveFail,
    IfNotCharge,
    IfAlreadyCharge,
    Charge,
    GetActiveCode,
    ActiveBenefits,



    CaptureNotEnough,


    ClickToContinue,

    Body,


    TotalDamage,
    DestroyUnitCount,

    Building,
    Prop,
    Car,

    Infantry,
    Commander,
    Laserer,
    Rocketeer,
    Melee,

    Tank,
    MissileVehicle,
    FlameVehicle,

    MissileTurret,
    ShellTurret,

    EliteGiantess,
    GiantessBoss,





    AppearWildGiantessName,
    AppearWildGiantessSay1,
    AppearWildGiantessSay2,

    AppearEnemyGiantessName,
    AppearEnemyGiantessSay1,

    AppearPlayerGoddessName,
    AppearPlayerGoddessSay1,


    LevelGiantessHardName,
    LevelGiantessHardSay1,




    BossLevel1BeginSay1,
    BossLevel1PickdownArmy1Say1,
    BossLevel1PickdownArmy3Say1,
    BossLevel1StompLittleManSay1,

    BossLevel2BeginSay1,
    BossLevel2BeginSay2,
    BossLevel2PickdownArmyNormalSay1,
    BossLevel2PickdownArmyHardSay1,
    BossLevel2HardSay1,
    BossLevel2StressingSay1,
    BossLevel2StressingSay2,
    BossLevel2StressingSay3,


    BossLevel3GoToTrigoneSay1,
    BossLevel3ReachTrigoneSay1,
    BossLevel3OnlyAddArmySay1,
    BossLevel3RightHandAddArmySay1,
    BossLevel3RightHandOnePointAttackSay1,
    BossLevel3RightHandBeatAttackSay1,
    BossLevel3LeftHandRightHandSay1,
    BossLevel3TwoHandsOneFingerAttackSay1,
    BossLevel3TwoHandsBeatAttackSay1,
    BossLevel3HitRightNippleSay1,
    BossLevel3HitRightNippleSay2,
    BossLevel3HitRightNippleSay3,
    BossLevel3HitLeftNippleSay1,
    BossLevel3HitLeftNippleSay2,
    BossLevel3HitLeftNippleSay3,
    BossLevel3StressingSay1,
    BossLevel3StressingSay2,






    WildGiantessAppear,
    WildGiantessAppearDescription,
    EnemyGiantessAppear,
    EnemyGiantessAppearDescription,
    EnemyReinforceReach,
    EnemyReinforceReachDescription,
    EnemyFireSupport,
    CallGiantess,
    EnemyAddRandomBuff,

    CancelEvent,



    EnterDoor,



    UpgradeTip,
    NoValidCrowdPositionsTip,
    NoInRangeCrowdPositionsTip,



    ActiveBiggerNumber,
    UnDamage,
    Hard,
    OldSoldierNumber,
    ComboStormNumber,
    ClearHatred,


    LoginTitle,
    RegisterTitle,
    Account,
    Password,
    Register,
    Login,

    Visitor,


    SelectLevelTitle,
    PlayLevel,
    // ProtectLevel,



    HowToGetGiantessCharacterQ,
    HowToGetGiantessCharacterA,

}

export enum languageVariableKey {
    RewardLevelExplain,

    AddCommonArmyCount,
    AddEliteArmyCount,
    AddArmyDamage,
    SubPlayerRestoreHp,
    AddArmyHp,

    EnhenceEliteGiantess,
    EnhenceArmy,
    EnhenceLevelGiantess,
    EnhenceBossGiantess,
    AddMaxMMDGiantessCount,
    AllowFriendDamage,
    RemoveMapEdgeZone,

    DecreaseGenerateArmyInterval,



    AddGiantessHp,
    AddGiantessDefenseFactor,
    AddGiantessAttackFactor,
    AddGiantessLife,
    AddBiggerScale,
    AddActiveBiggerTime,
    AddPassiveBiggerIncreaseScale,
    AddDamageBiggerIncreaseScale,
    AddInitialScale,
    SubDurationFactor,
    AddGiantessCritRatioFactor,
    AddGiantessLuck,
    SubGiantessRestoreHpTime,
    AddGiantessRestoreHpSpeedRate,
    GiantessStrong,
    AddGiantessArmor,

    AddLittleManHp,
    AddLittleManDefenseFactor,
    AddLittleManArmor,
    AddLittleManAttackFactor,
    AddEmitterLifeFactor,
    AddMoveSpeed,
    AddLittleManLife,
    LittleManStrong,
    AddLittleManCritRatioFactor,
    AddLittleManLuck,
    SubLittleManRestoreHpTime,
    AddLittleManRestoreHpSpeedRate,

    PhaseTitle,
    TalentLevel,





    LearnBigger,
    ChangeToPassiveBigger,
    EnhanceBigger,
    MoveAndStompDamageEnhance,
    OldSoldier_Giantess,
    LuckDog_Giantess,

    ComboStorm,
    ClothDamageEnhance,
    // FragileGrowth,
    Crazy,
    OldSoldier_Little,
    LuckDog_Little,



    SelectedCareers,





    KeepTime,

    IncreaseMoveSpeedBuffDescription,
    IncreaseDefenseFactorDescription,
    ClearHatredDescription,
    IncreaseActionSpeedDescription,
    DecreaseActionSpeedDescription,


    GetItem,



    GetPropTitle,



    ExceedBuyCount,


    GetReward,



    Loading,


    NetworkError,

    QuotaExceededError,

    ArrayBufferAllocationError,

    PrecisionNull,

}



export enum languageImageKey {
    Title,
    FAQButton,
    ShareButton,
    ActiveButton,
    GetRewardButton,
    UpdateNotice,
    JoinCrowdFunding,

    Code,
}

export let getTextData = (): data => {
    return {
        [language.Chinese]: {
            // [languageKey.JoinCrowdFunding]: "参与众筹，获得8折激活码等限量回报",


            [languageKey.VeryLow]: "非常低",
            [languageKey.Low]: "低",
            [languageKey.Middle]: "中",
            [languageKey.High]: "高",
            [languageKey.VeryHigh]: "非常高",

            [languageKey.CameraRotateSpeed]: "鼠标灵敏度",

            [languageKey.EnterOldVersion]: "进入老版本",
            [languageKey.Enter2Version]: "进入v2.0内测版",
            [languageKey.EnterGame]: "进入游戏",
            [languageKey.Mod]: "模组",
            [languageKey.Setting]: "设置",
            [languageKey.Website]: "官网",

            [languageKey.Logout]: "登出",
            [languageKey.IsLogout]: "是否登出?",

            [languageKey.Confirm]: "确定",
            [languageKey.Cancel]: "取消",
            [languageKey.BackToIndex]: "返回首页",
            [languageKey.Back]: "返回",
            [languageKey.Reset]: "重置",
            [languageKey.More]: "更多",

            [languageKey.Clipboard]: "复制",
            [languageKey.EnableClipboard]: "允许复制",
            [languageKey.Success]: "成功",
            [languageKey.Fail]: "失败",


            [languageKey.DifficultTitle]: "难度自定义",
            [languageKey.TotalHeat]: "总热度",
            [languageKey.HeatUnit]: "点",
            [languageKey.RewardLevel]: "奖励级别",
            [languageKey.LevelUnit]: "级",
            [languageKey.MatchDifficultyExplain]: "根据您的情况，系统为您自动计算难度系数，影响敌人的强度",
            [languageKey.MatchDifficultyTitle]: "自动匹配的难度系数",

            [languageKey.DifficultyName]: "项目名",
            [languageKey.DifficultyRatio]: "倍率",
            [languageKey.DifficultyOperate]: "操作",
            [languageKey.DifficultyHeat]: "热度",

            [languageKey.AddCommonArmyCount]: "设置普通敌人人数",
            [languageKey.AddEliteArmyCount]: "设置精英敌人人数",
            [languageKey.AddArmyDamage]: "增加敌人伤害",
            [languageKey.SubPlayerRestoreHp]: "减少玩家生命回复",
            [languageKey.AddArmyHp]: "增加敌人生命上限",


            [languageKey.EnhenceEliteGiantess]: "强化精英巨大娘",
            [languageKey.EnhenceArmy]: "强化军队",
            [languageKey.EnhenceLevelGiantess]: "强化关卡巨大娘",
            [languageKey.EnhenceBossGiantess]: "强化Boss巨大娘",
            [languageKey.AddMaxMMDGiantessCount]: "增加MMD巨大娘最大的个数",
            [languageKey.AllowFriendDamage]: "允许友伤",
            [languageKey.RemoveMapEdgeZone]: "移除地图边缘区域",

            [languageKey.DecreaseGenerateArmyInterval]: "减少敌人刷新间隔",



            [languageKey.Difficulty]: "难度",







            [languageKey.AddGiantessHp]: "增加生命上限",
            [languageKey.AddGiantessDefenseFactor]: "增加防御力",
            [languageKey.AddGiantessAttackFactor]: "增加攻击力",
            [languageKey.AddGiantessLife]: "可满血复活",
            [languageKey.AddBiggerScale]: "增加变大倍数",
            [languageKey.AddActiveBiggerTime]: "增加主动变大的持续时间",
            [languageKey.AddPassiveBiggerIncreaseScale]: "增加被动变大增加的倍数",
            [languageKey.AddDamageBiggerIncreaseScale]: "增加受击变大增加的倍数",
            [languageKey.AddInitialScale]: "增加初始倍数",
            [languageKey.SubDurationFactor]: "增加动作速度",
            [languageKey.AddGiantessCritRatioFactor]: "增加暴击率",
            [languageKey.AddGiantessLuck]: "增加幸运",
            [languageKey.SubGiantessRestoreHpTime]: "减少hp恢复时间",
            [languageKey.AddGiantessRestoreHpSpeedRate]: "增加hp恢复数值",
            [languageKey.GiantessStrong]: "霸体",
            [languageKey.AddGiantessArmor]: "加强盔甲",

            [languageKey.AddLittleManHp]: "增加生命上限",
            [languageKey.AddLittleManDefenseFactor]: "增加防御力",
            [languageKey.AddLittleManArmor]: "加强盔甲",
            [languageKey.AddLittleManAttackFactor]: "增加攻击力",
            [languageKey.AddEmitterLifeFactor]: "增加射程",
            [languageKey.AddMoveSpeed]: "增加移速",
            [languageKey.AddLittleManLife]: "可满血复活",
            [languageKey.LittleManStrong]: "霸体",
            [languageKey.AddLittleManCritRatioFactor]: "增加暴击率",
            [languageKey.AddLittleManLuck]: "增加幸运",
            [languageKey.SubLittleManRestoreHpTime]: "减少hp恢复时间",
            [languageKey.AddLittleManRestoreHpSpeedRate]: "增加hp恢复数值",


            [languageKey.TalentTitle]: "天赋",
            [languageKey.GemRemain]: "剩余",
            [languageKey.Take]: "消耗",
            [languageKey.GemNotEnough]: "宝石不够",
            [languageKey.UnlockTalentPhaseDescription]: "上一个阶段点满5个天赋解锁",
            [languageKey.UpgradeMax]: "升满",


            [languageKey.Has]: "拥有",



            [languageKey.LearnBigger]: "主动变大",
            [languageKey.LearnStandToCrawlAndCrawlToStand]: "趴",
            [languageKey.LearnStandToCrawlAndCrawlToStandDescription]: "解锁趴姿势",
            [languageKey.LearnBreastPress]: "胸压（趴姿势）",
            [languageKey.LearnPickAndPickdown]: "抓",
            [languageKey.LearnPickAndPickdownDescription]: "解锁抓姿势，可进一步获取捏、吃、UB等技能",
            [languageKey.LearnPinch]: "手握（抓姿势）",
            [languageKey.LearnEat]: "吃（抓姿势）",
            [languageKey.LearnEatDescription]: "肚子会涨大。如果肚子太大了则无法再吃下去",
            [languageKey.ChangeToPassiveBigger]: "使用被动变大",
            [languageKey.EnhanceBigger]: "增加变大倍数",
            [languageKey.MoveAndStompDamageEnhance]: "移动伤害加强",
            [languageKey.OldSoldier_Giantess]: "战场老兵（巨大娘）",
            [languageKey.LuckDog_Giantess]: "幸运儿（巨大娘）",

            [languageKey.LearnBlink]: "闪避",
            [languageKey.LearnSwip]: "重击",
            [languageKey.LearnFastRun]: "疾跑",
            [languageKey.ComboStorm]: "连击风暴",
            [languageKey.ClothDamageEnhance]: "衣服伤害加强",
            // [languageKey.FragileGrowth]: "脆弱生息",
            [languageKey.Crazy]: "疯狂",
            [languageKey.OldSoldier_Little]: "战场老兵（小人）",
            [languageKey.LuckDog_Little]: "幸运儿（小人）",







            [languageKey.BasicBulletTitle]: "普通子弹",
            [languageKey.LaserBulletTitle]: "激光子弹",
            [languageKey.RocketBulletTitle]: "火箭弹",
            // [languageKey.BiggerBulletTitle]: "变大子弹",
            // [languageKey.SmallerToLastBiggerCountBulletTitle]: "缩小子弹",

            [languageKey.BasicBulletDescription]: "单点普通攻击",
            [languageKey.LaserBulletDescription]: "单点强力攻击",
            [languageKey.RocketBulletDescription]: "范围攻击",
            // [languageKey.BiggerBulletDescription]: "击中巨大娘，可让其变大一级",
            // [languageKey.SmallerToLastBiggerCountBulletDescription]: "击中巨大娘，可让其缩小一级",


            [languageKey.AddHp1Title]: "加血（小）",
            [languageKey.AddHp2Title]: "加血（中）",
            [languageKey.AddHp3Title]: "加血（大）",
            [languageKey.AddHp4Title]: "加血（极大）",
            [languageKey.AddExcitement1Title]: "加兴奋（小）",
            [languageKey.AddExcitement2Title]: "加兴奋（中）",
            [languageKey.AddExcitement3Title]: "加兴奋（大）",
            [languageKey.AddExcitement4Title]: "加兴奋（极大）",

            [languageKey.AddHp1Description]: "加10%最大生命值",
            [languageKey.AddHp2Description]: "加30%最大生命值",
            [languageKey.AddHp3Description]: "加50%最大生命值",
            [languageKey.AddHp4Description]: "加100%最大生命值",
            [languageKey.AddExcitement1Description]: "加兴奋（小）",
            [languageKey.AddExcitement2Description]: "加兴奋（中）",
            [languageKey.AddExcitement3Description]: "加兴奋（大）",
            [languageKey.AddExcitement4Description]: "加兴奋（极大）",

            [languageKey.CallGiantessTitle]: "召唤巨大娘",
            [languageKey.ClearHatredTitle]: "清除仇恨",

            [languageKey.CallGiantessDescription]: "召唤巨大娘",
            // [languageKey.ClearHatredDescription]: "在有巨大娘的情况下，所有敌人只会攻击巨大娘",
            [languageKey.ClearHatredDescription]: "消除玩家的仇恨",


            [languageKey.ReviveTitle]: "复活石",

            [languageKey.ReviveDescription]: "用于无损复活人物。每次使用会消耗一个道具",


            [languageKey.None]: "无",
            [languageKey.ArtifactPropTypeTitle]: "神器",
            [languageKey.BulletPropTypeTitle]: "子弹",
            // [languageKey.WaterPropTypeTitle]: "补品",
            [languageKey.WaterPropTypeTitle]: "药水",
            [languageKey.AssistantPropTypeTitle]: "辅助",
            [languageKey.OtherPropTypeTitle]: "其它",


            [languageKey.OperateShootKey]: "左键",



            [languageKey.PressV]: "按V",
            [languageKey.ChestBoxDescription]: "打开宝箱",
            [languageKey.TradeGirlDescription]: "购买",
            [languageKey.FateGirlDescription]: "开启命运女神",



            [languageKey.Coin]: "金币",
            [languageKey.CoinNotEnough]: "金币不足",


            [languageKey.EnterDuelistTime]: "进入决斗时间",
            [languageKey.EndDuelistTime]: "结束决斗时间",




            [languageKey.LittleMan]: "小人",
            [languageKey.Giantess]: "巨大娘",
            [languageKey.LittleManAndGiantess]: "小人和巨大娘",






            [languageKey.MissionCompleteTitle]: "通关",
            // [languageKey.EnterNextCityLevel]: "下一关",
            [languageKey.EnterNextCityLevel]: "进攻城市关卡",
            [languageKey.LevelGameTime]: "本局游戏时间",
            [languageKey.LevelGem]: "本局获得宝石",
            [languageKey.LevelCoin]: "本局获得金币",
            // [languageKey.EnterBossLevel]: "挑战Boss",
            [languageKey.EnterBossLevel]: "Boss关卡",
            // [languageKey.Wait5S]: "等待5秒",
            [languageKey.Wait20S]: "等待20秒",
            [languageKey.ActiveReward]: "激活奖励",


            [languageKey.MissionEndTitle]: "感谢您玩游戏~",
            [languageKey.TotalGameTime]: "总游戏时间",


            [languageKey.MissionFailTitle]: "再接再厉",




            [languageKey.EndLevelConfirm]: "是否结束关卡？",
            [languageKey.Camera]: "相机",
            [languageKey.UI]: "UI",
            [languageKey.Operate]: "操作",
            [languageKey.EndLevel]: "结束关卡",
            [languageKey.ZoomIn]: "拉近",
            [languageKey.ZoomOut]: "拉远",
            [languageKey.Up]: "上",
            [languageKey.Down]: "下",
            [languageKey.SetTarget]: "设置目标",
            [languageKey.Chest]: "胸",
            [languageKey.Foot]: "足",
            [languageKey.Free]: "自由",
            [languageKey.Eye]: "眼",
            [languageKey.Leg]: "腿",
            [languageKey.UseThirdPersonCamera]: "使用第三人称相机",
            [languageKey.UseFirstPersonCamera]: "使用第一人称相机",
            [languageKey.MainSettingTitle]: "主菜单",
            [languageKey.PackageTitle]: "道具",
            [languageKey.AddToFastProp]: "加入道具栏",

            [languageKey.HideUI]: "隐藏UI",
            [languageKey.ShowUI]: "显示UI",

            [languageKey.ShowGemAnimation]: "显示宝石动画",
            [languageKey.NotShowGemAnimation]: "不显示宝石动画",
            [languageKey.ShowCoinAnimation]: "显示金币动画",
            [languageKey.NotShowCoinAnimation]: "不显示金币动画 ",
            [languageKey.GenerateProp]: "生成道具",
            [languageKey.NotGenerateProp]: "不生成道具",
            [languageKey.ShowUpgradeParticle]: "显示升级动画",
            [languageKey.HideUpgradeParticle]: "隐藏升级动画",
            [languageKey.ShowBuildingSmoke]: "显示建筑烟雾",
            [languageKey.HideBuildingSmoke]: "隐藏建筑烟雾",
            [languageKey.ShowExplosionSmoke]: "显示爆炸烟雾",
            [languageKey.HideExplosionSmoke]: "隐藏爆炸烟雾",
            [languageKey.EliteGiantePlayDeathAnimation]: "精巨播放死亡动画",
            [languageKey.EliteGianteNotPlayDeathAnimation]: "精巨不播放动画",

            [languageKey.EnableFullScreen]: "开启全屏",
            [languageKey.DisableFullScreen]: "关闭全屏",

            [languageKey.SetSkillButtonTip]: "设置右下角的键位（拖动）",
            [languageKey.StartSetSkillButton]: "开始设置",
            [languageKey.EndSetSkillButton]: "结束设置",
            [languageKey.ResetSkillButton]: "重置",

            [languageKey.FireWayTip]: "攻击方式",
            [languageKey.BurstFire]: "点射",
            [languageKey.ContinueFire]: "连射",





            [languageKey.Hour]: "小时",
            [languageKey.Minute]: "分",
            [languageKey.Second]: "秒",
            [languageKey.Meter]: "米",



            [languageKey.Infinity]: "无限",



            [languageKey.TradeTitle]: "货物清单",
            [languageKey.Buy]: "购买",
            [languageKey.Close]: "关闭",
            [languageKey.All]: "全部",



            [languageKey.UpgradeTitle]: "选择升级方向",
            // [languageKey.UpgradeTitle]: "选择技能",
            [languageKey.Skip]: "跳过",
            [languageKey.Change]: "换",
            // [languageKey.NotWantCurrentUpgradeItems]: "不要",
            [languageKey.Want]: "要",
            [languageKey.NotWant]: "不要",
            [languageKey.AutoPopup]: "自动弹出",
            [languageKey.ManualPopup]: "手动弹出",


            [languageKey.SelectLittleManCareerTitle]: "选择小人职业",
            [languageKey.SelectGiantessCareerTitle]: "选择巨大娘职业",
            [languageKey.GenerateRandomCareer]: "生成随机职业",

            [languageKey.ShareTitle]: "分享给好友",
            [languageKey.ShareTitle2]: "分享给好友，扫码进入游戏",
            [languageKey.ShareTitle3]: "分享在线地址，浏览器进入",



            [languageKey.SelectCharacterTitle]: "选择巨大娘",
            // [languageKey.ForceReviveContent]: "复活会消耗一个捕获器道具，并清零角色天赋。是否复活？",
            [languageKey.ForceReviveContent]: "复活会清零角色天赋。是否复活？",
            [languageKey.ForceRevive]: "强制复活",
            [languageKey.RemainTalentContent]: "复活会消耗一个复活石但保留天赋，是否复活？",
            [languageKey.DirectRevive]: "直接复活",
            [languageKey.NeedCapture]: "需要捕获",



            [languageKey.SelectLittleManTitle]: "选择小人",




            [languageKey.SettingTitle]: "设置",




            [languageKey.ModTitle]: "模组管理",
            [languageKey.ModInfo]: "目前正在开发中，暂未开放",


            [languageKey.ResourceLoadFail]: "资源加载失败，请刷新页面，从而重新加载",

            [languageKey.ErrorHandleTitle]: "错误处理",
            [languageKey.NetworkErrorHandleTitle]: "网络错误处理",

            [languageKey.NetworkErrorHandleContent]: "后端请求出错了",

            [languageKey.RetryBackendRequest]: "再次后端请求",
            // [languageKey.Relogin]: "刷新页面重新登录，建议作为游客",
            [languageKey.Relogin]: "刷新页面重新登录",


            [languageKey.QuotaExceededErrorTitle]: "离线缓存已满",
            [languageKey.QuotaExceededErrorContent]: "请点击按钮清理缓存。如果再次失败，请手动清除浏览器缓存，或者重装浏览器后再试",
            [languageKey.ClearCacheAndReload]: "清理离线缓存并刷新页面",


            [languageKey.RestoreGameButton]: "恢复游戏",
            [languageKey.SnapshotTitle]: "截图，发送给开发者",
            [languageKey.SnapshotContent]: "首先请手动截图，然后到QQ群（群号：892578345）发送给群主，群主会优先处理，感谢~然后可以点“下一步”",
            [languageKey.ToSnapshot]: "去手动截图",
            [languageKey.JoinGroup]: "加QQ群",
            [languageKey.Next]: "下一步",
            [languageKey.RestoreGame]: "将保存您的本局数据，并刷新页面",




            [languageKey.ExplainTitle]: "操作说明",
            [languageKey.KeyTitle]: "按键",
            [languageKey.FunctionTitle]: "功能",
            [languageKey.Key1Function]: "移动",
            [languageKey.Key2Function]: "显示或者隐藏鼠标",



            // [languageKey.VersionExplain]: "（内测阶段，数据可能丢失）",
            [languageKey.VersionExplain]: "",



            [languageKey.SceneDescription]: "场景",

            [languageKey.GetBackendDataInfo]: "获得服务器数据",
            [languageKey.InitingInfo]: "正在初始化",


            // [languageKey.CssCompatible]: "您的浏览器不支持部分游戏功能，请使用ALook浏览器或者QQ浏览器",
            [languageKey.CssCompatible]: "您的浏览器不支持部分游戏功能，请使用ALook浏览器或者Chrome浏览器",


            [languageKey.EnteringScene]: "正在进入场景",
            [languageKey.CaptureWildGiantessSuccessInfo]: "已成功捕获野生巨大娘，从下一关开始可使用",
            [languageKey.RestorePointerLockInfo]: "点我恢复pointer lock",
            [languageKey.KnowInfo]: "知道了",
            [languageKey.GetReward]: "获得奖励",
            [languageKey.GetConfirm]: "领取",
            [languageKey.NothingHappen]: "什么也没发生",

            [languageKey.Ignore]: "忽略",

            [languageKey.SuggestUseChrome]: "建议使用谷歌浏览器",
            // [languageKey.SuggestUseALook]: "建议使用ALook浏览器（优先）或者微信或者谷歌浏览器，其中后两者可能无法进入游戏",
            [languageKey.SuggestUseALook]: "建议使用ALook浏览器、默认浏览器、谷歌浏览器",
            [languageKey.IPadHasCompatibilityIssue]: "您的设备（IPad）可能存在兼容性问题，最好更换设备",
            [languageKey.TipInApp]: "请使用网页版，否则可能会崩溃。网址是：https://gts-play.cn",

            [languageKey.FullScreen]: "开启全屏",

            [languageKey.MemoryIsSmall]: "内存太小了，应该至少>=6G，游戏可能会崩溃",
            // [languageKey.ContextLost]: "WebGL上下文丢失（通常由于显存不足造成的），将会为您自动恢复。您可以关闭其它正在运行的App，并确保内存>=6G",
            // [languageKey.ContextLost]: "WebGL上下文丢失（通常由于显存不足造成的）。您可以关闭其它正在运行的App，并确保内存>=6G",
            [languageKey.ContextLost]: "WebGL上下文丢失",

            [languageKey.WebGLError]: "WebGL出错了，将会为您自动恢复",
            [languageKey.CanvasNone]: "画布被隐藏了，将会为您自动恢复",


            [languageKey.AutoRestore]: "自动恢复",

            [languageKey.UseGiantessCharacterNotEnough]: "“巨大娘人物使用”道具个数不足。您需要激活游戏，或者通过击败巨大娘等方式获得道具",
            [languageKey.GoToActive]: "去激活游戏",
            [languageKey.UseGiantessCharacter]: "使用一个“巨大娘人物使用”道具？",

            // [languageKey.UseArtifactNotEnough]: "神器使用道具个数不足。您需要激活游戏，或者通过击败巨大娘等方式获得",

            [languageKey.InputActiveCode]: "输入激活码",
            [languageKey.ActiveSuccess]: "激活成功",
            [languageKey.ActiveVIPSuccess]: "VIP激活成功",
            [languageKey.ActiveFail]: "激活码不正确，请重新输入",
            [languageKey.IfNotCharge]: "如未发电，",
            [languageKey.Charge]: "点我为作者发电",
            [languageKey.IfAlreadyCharge]: "如已发电，",
            [languageKey.GetActiveCode]: "点我获得激活码",
            [languageKey.ActiveBenefits]: `激活后可以获得:
- 可以使用【所有巨大娘角色】（需要先捕获）
- 单局获得宝石数量额外增加50%
- 爆出神器、复活石、捕获器的概率为正常的2倍
- 新人奖励获取量为正常的3倍`,

            [languageKey.CaptureNotEnough]: "捕获器道具个数不足，至少需要1个",



            [languageKey.ClickToContinue]: "点击继续",


            [languageKey.Body]: "身体",



            [languageKey.TotalDamage]: "总伤害值",
            [languageKey.DestroyUnitCount]: "摧毁的单位数量",

            [languageKey.Building]: "建筑",
            [languageKey.Prop]: "物体",
            [languageKey.Car]: "汽车",

            [languageKey.Infantry]: "步兵",
            [languageKey.Commander]: "指挥官",
            [languageKey.Laserer]: "激光兵",
            [languageKey.Melee]: "近战兵",
            [languageKey.Rocketeer]: "火箭兵",

            [languageKey.Tank]: "坦克",
            [languageKey.MissileVehicle]: "导弹车",
            [languageKey.FlameVehicle]: "喷火车",

            [languageKey.ShellTurret]: "炮塔",
            [languageKey.MissileTurret]: "导弹塔",

            [languageKey.EliteGiantess]: "精英巨大娘",
            [languageKey.GiantessBoss]: "巨大娘Boss",




            [languageKey.AppearWildGiantessName]: "野生巨大娘",
            [languageKey.AppearWildGiantessSay1]: "大家好啊~",
            [languageKey.AppearWildGiantessSay2]: "小小的真是可爱~",
            [languageKey.AppearEnemyGiantessName]: "敌人巨大娘",
            [languageKey.AppearEnemyGiantessSay1]: "玩家你好啊~",
            [languageKey.AppearPlayerGoddessName]: "玩家巨大娘",
            [languageKey.AppearPlayerGoddessSay1]: "玩家，我来帮你啦~",

            [languageKey.LevelGiantessHardName]: "关卡巨大娘",
            [languageKey.LevelGiantessHardSay1]: "要认真点啦~",





            [languageKey.BossLevel1BeginSay1]: "勇者，欢迎来到比武场，要战胜我才能离开哦~",
            [languageKey.BossLevel1PickdownArmy1Say1]: "跟这些小玩具玩一下吧~",
            [languageKey.BossLevel1PickdownArmy3Say1]: "这次会放更多的玩具~",
            [languageKey.BossLevel1StompLittleManSay1]: "我也来一起玩~",


            [languageKey.BossLevel2BeginSay1]: "你让我有点兴奋啊~",
            [languageKey.BossLevel2BeginSay2]: "我先用脚跟你玩，不要挂了哦~",
            [languageKey.BossLevel2PickdownArmyNormalSay1]: "来点小玩具助兴~",
            [languageKey.BossLevel2PickdownArmyHardSay1]: "更多的玩具哦~",
            [languageKey.BossLevel2HardSay1]: "要稍微认真了啦~",
            [languageKey.BossLevel2StressingSay1]: "人家有点感觉啦~",
            [languageKey.BossLevel2StressingSay2]: "有点痒痒的~",
            [languageKey.BossLevel2StressingSay3]: "就是这样~",


            [languageKey.BossLevel3GoToTrigoneSay1]: "到肚子上来~",
            [languageKey.BossLevel3ReachTrigoneSay1]: "你到了哦~",
            [languageKey.BossLevel3OnlyAddArmySay1]: "放点小玩具助兴~",
            [languageKey.BossLevel3RightHandAddArmySay1]: "放一些小玩具，一起玩玩~",
            [languageKey.BossLevel3RightHandOnePointAttackSay1]: "我只用一根手指~",
            [languageKey.BossLevel3RightHandBeatAttackSay1]: "我用一只手掌哦~",
            [languageKey.BossLevel3LeftHandRightHandSay1]: "要防护下~",
            [languageKey.BossLevel3TwoHandsOneFingerAttackSay1]: "我要用两根手指哦~",
            [languageKey.BossLevel3TwoHandsBeatAttackSay1]: "要认真点啦~",
            [languageKey.BossLevel3HitRightNippleSay1]: "啊啊啊~~~右边乳头有点痒痒的",
            [languageKey.BossLevel3HitRightNippleSay2]: "人家有点感觉啦~",
            [languageKey.BossLevel3HitRightNippleSay3]: "哎哟~你打得很准嘛",
            [languageKey.BossLevel3HitLeftNippleSay1]: "啊啊啊~左边乳头有点痒痒的",
            [languageKey.BossLevel3HitLeftNippleSay2]: "弄得人家有点感觉啦~",
            [languageKey.BossLevel3HitLeftNippleSay3]: "啊啊啊~你打得很准嘛~",
            [languageKey.BossLevel3StressingSay1]: "啊啊啊~",
            [languageKey.BossLevel3StressingSay2]: "哎哟~",





            [languageKey.WildGiantessAppear]: "野生巨大娘出现",
            [languageKey.WildGiantessAppearDescription]: "野生巨大娘即将出现",
            [languageKey.EnemyGiantessAppear]: "敌人巨大娘出现",
            [languageKey.EnemyGiantessAppearDescription]: "敌人巨大娘即将出现",
            [languageKey.EnemyReinforceReach]: "敌军增援",
            [languageKey.EnemyReinforceReachDescription]: "敌军增援即将到达",
            [languageKey.EnemyFireSupport]: "敌人火力支援",
            [languageKey.CallGiantess]: "召唤巨大娘",
            [languageKey.EnemyAddRandomBuff]: "敌人加随机Buff",

            [languageKey.CancelEvent]: "事件取消了",


            [languageKey.EnterDoor]: "进门",

            // [languageKey.UpgradeTip]: "恭喜您第一次升级~点击左上角经验条右侧的黄色箭头，可选择升级方向",
            [languageKey.UpgradeTip]: "恭喜您第一次升级~点击左上角经验条右侧的黄色箭头，可选择技能",
            // [languageKey.NoValidCrowdPositionsTip]: "恭喜您已经消灭了所有敌人~",
            [languageKey.NoValidCrowdPositionsTip]: "所有敌人已经出现，不会再有新的敌人了",
            [languageKey.NoInRangeCrowdPositionsTip]: "周围敌人已经被消灭，请探索更多的区域",



            [languageKey.ActiveBiggerNumber]: "主动变大",
            [languageKey.UnDamage]: "无敌",
            [languageKey.Hard]: "认真",

            [languageKey.OldSoldierNumber]: "战场老兵",
            [languageKey.ComboStormNumber]: "连击风暴",
            [languageKey.ClearHatred]: "清除仇恨",


            [languageKey.LoginTitle]: "登录",
            [languageKey.RegisterTitle]: "注册",
            [languageKey.Account]: "用户名",
            [languageKey.Password]: "密码（可为空）",
            [languageKey.Register]: "注册",
            [languageKey.Login]: "登录",

            // [languageKey.Visitor]: "直接进游戏（数据在本地，可能丢失）",
            [languageKey.Visitor]: "作为游客进入游戏（数据在本地，可能丢失）",

            [languageKey.SelectLevelTitle]: "选关",
            [languageKey.PlayLevel]: "进攻城市",


            [languageKey.HowToGetGiantessCharacterQ]: "如何获得巨大娘人物？",
            // [languageKey.HowToGetGiantessCharacterA]: "使用小人角色，在进攻城市关卡中击败野生巨大娘后可自动捕获；然后重开关卡即可选择对应的人物",
            [languageKey.HowToGetGiantessCharacterA]: "使用小人角色时，在巨大娘附近使用“捕获器”道具可有概率捕获；然后重开关卡即可选择对应的人物",
        },
        // [language.English]: {
        //     // [languageKey.JoinCrowdFunding]: "Participate in crowdfunding and receive limited rewards such as 20% off activation codes",



        //     [languageKey.VeryLow]: "VeryLow",
        //     [languageKey.Low]: "Low",
        //     [languageKey.Middle]: "Middle",
        //     [languageKey.High]: "High",
        //     [languageKey.VeryHigh]: "VeryHigh",


        //     [languageKey.CameraRotateSpeed]: "Mouse Sensitivity",

        //     [languageKey.EnterOldVersion]: "EnterOldVersion",
        //     [languageKey.EnterGame]: "EnterGame",
        //     [languageKey.Mod]: "Mod",
        //     [languageKey.Setting]: "Setting",
        //     [languageKey.Website]: "Website",

        //     [languageKey.Logout]: "Log Out",

        //     [languageKey.Confirm]: "Confirm",
        //     [languageKey.Cancel]: "Cancel",
        //     // [languageKey.BackToIndex]: "Back to Index",
        //     [languageKey.BackToIndex]: "Back to Main Menu",
        //     [languageKey.Back]: "Back",
        //     [languageKey.Reset]: "Reset",


        //     [languageKey.Clipboard]: "Copy",
        //     [languageKey.EnableClipboard]: "Enable Copy",
        //     [languageKey.Success]: "Success",
        //     [languageKey.Fail]: "Fail",


        //     [languageKey.DifficultTitle]: "Custom Difficulty",
        //     [languageKey.TotalHeat]: "Total Heat",
        //     [languageKey.HeatUnit]: "Point",
        //     // [languageKey.RewardLevel]: "Reward Level",
        //     [languageKey.RewardLevel]: "Gem multiplier level",
        //     [languageKey.LevelUnit]: "Level",
        //     // [languageKey.MatchDifficultyExplain]: "Based on your situation, the system automatically calculates the difficulty factor for you, which affects the strength of the enemy",
        //     // [languageKey.MatchDifficultyTitle]: "Difficulty coefficient of automatic matching",
        //     [languageKey.MatchDifficultyExplain]: "Based on your current strength, enemies become more powerful",
        //     [languageKey.MatchDifficultyTitle]: "Adaptive difficulty",

        //     [languageKey.AddCommonArmyCount]: "set common enemy amount",
        //     [languageKey.AddEliteArmyCount]: "set elite amount",
        //     [languageKey.AddArmyDamage]: "increase enemy damage",
        //     [languageKey.SubPlayerRestoreHp]: "decrease player hp restore",
        //     [languageKey.AddArmyHp]: "increase enemy max hp",
        //     // [languageKey.AddCommonArmyCount]: "Common enemy amount",
        //     // [languageKey.AddEliteArmyCount]: "Elite giantess amount",
        //     // [languageKey.AddArmyDamage]: "Enemy damage",
        //     // [languageKey.SubPlayerRestoreHp]: "Player healing reduction",
        //     // [languageKey.AddArmyHp]: "Army max hp",



        //     [languageKey.EnhenceEliteGiantess]: "enhence elite giantess",
        //     [languageKey.EnhenceArmy]: "enhence army",
        //     [languageKey.EnhenceLevelGiantess]: "enhence level giantess",
        //     [languageKey.EnhenceBossGiantess]: "enhence boss giantess",



        //     [languageKey.Difficulty]: "Difficulty",





        //     [languageKey.AddGiantessHp]: "increase max hp",
        //     [languageKey.AddGiantessDefenseFactor]: "increase defense",
        //     [languageKey.AddGiantessAttackFactor]: "increase attack",
        //     [languageKey.AddGiantessLife]: "add life",
        //     [languageKey.AddBiggerScale]: "increase bigger scale",
        //     [languageKey.AddActiveBiggerTime]: "increase active bigger time",
        //     [languageKey.AddPassiveBiggerIncreaseScale]: "increase passive bigger increase scale",
        //     [languageKey.AddInitialScale]: "increase initial scale",

        //     [languageKey.AddLittleManHp]: "increase max hp",
        //     [languageKey.AddLittleManDefenseFactor]: "increase defense",
        //     [languageKey.AddLittleManArmor]: "enforce armor",
        //     [languageKey.AddLittleManAttackFactor]: "increase attack",
        //     [languageKey.AddEmitterLifeFactor]: "increase emitter life",
        //     [languageKey.AddLittleManLife]: "add life",
        //     [languageKey.LittleManStrong]: "strong",


        //     [languageKey.TalentTitle]: "Talent",
        //     [languageKey.GemRemain]: "Remain",
        //     [languageKey.Take]: "Take",
        //     [languageKey.GemNotEnough]: "gem not enough",
        //     [languageKey.UnlockTalentPhaseDescription]: "Select 5 talent items in previous phase to unlock",


        //     [languageKey.Has]: "Has",


        //     [languageKey.LearnBigger]: "Active Bigger",
        //     [languageKey.LearnStandToCrawlAndCrawlToStand]: "Crawl",
        //     [languageKey.LearnBreastPress]: "Breast Press(Crawl Pose)",
        //     [languageKey.LearnPickAndPickdown]: "Pickup",
        //     [languageKey.LearnPinch]: "Pinch(Pick Pose)",
        //     [languageKey.LearnEat]: "Eat(Pick Pose)",
        //     [languageKey.ChangeToPassiveBigger]: "Change To Passive Bigger",
        //     [languageKey.EnhanceBigger]: "Enhance Bigger",
        //     [languageKey.MoveAndStompDamageEnhance]: "Move Damage Enhance",
        //     [languageKey.OldSoldier_Giantess]: "Old Soldier",
        //     [languageKey.LuckDog_Giantess]: "Luck Dog",

        //     [languageKey.LearnBlink]: "Blink",
        //     [languageKey.LearnSwip]: "Swip",
        //     [languageKey.LearnFastRun]: "FastRun",
        //     [languageKey.ComboStorm]: "Combo Storm",
        //     [languageKey.ClothDamageEnhance]: "Cloth Damage Enhance",
        //     // [languageKey.FragileGrowth]: "Fragile Growth",
        //     [languageKey.Crazy]: "Crazy",
        //     [languageKey.OldSoldier_Little]: "Old Soldier",
        //     [languageKey.LuckDog_Little]: "Luck Dog",





        //     [languageKey.BasicBulletTitle]: "Basic Bullet",
        //     [languageKey.LaserBulletTitle]: "Laser Bullet",
        //     [languageKey.RocketBulletTitle]: "Rocket Bullet",
        //     // [languageKey.BiggerBulletTitle]: "Bigger Bullet",
        //     // [languageKey.SmallerToLastBiggerCountBulletTitle]: "Smallest Bullet",

        //     [languageKey.BasicBulletDescription]: "Single Basic Attack",
        //     [languageKey.LaserBulletDescription]: "Single Strong Attack",
        //     [languageKey.RocketBulletDescription]: "Range Attack",
        //     // [languageKey.BiggerBulletDescription]: "Hit Giantess Can make Her Bigger One Level",
        //     // [languageKey.SmallerToLastBiggerCountBulletDescription]: "Hit Giantess Can make Her Smaller One Level",


        //     [languageKey.AddHp1Title]: "Add Hp(Small)",
        //     [languageKey.AddHp2Title]: "Add Hp(Middle)",
        //     [languageKey.AddHp3Title]: "Add Hp(Big)",
        //     [languageKey.AddHp4Title]: "Add Hp(Very Big)",
        //     [languageKey.AddExcitement1Title]: "Add Excitement(Small)",
        //     [languageKey.AddExcitement2Title]: "Add Excitement(Middle)",
        //     [languageKey.AddExcitement3Title]: "Add Excitement(Big)",
        //     [languageKey.AddExcitement4Title]: "Add Excitement(Very Big)",

        //     [languageKey.AddHp1Description]: "Add 10% full hp",
        //     [languageKey.AddHp2Description]: "Add 30% full hp",
        //     [languageKey.AddHp3Description]: "Add 50% full hp",
        //     [languageKey.AddHp4Description]: "Add 100% full hp",
        //     [languageKey.AddExcitement1Description]: "Add Excitement(Small)",
        //     [languageKey.AddExcitement2Description]: "Add Excitement(Middle)",
        //     [languageKey.AddExcitement3Description]: "Add Excitement(Big)",
        //     [languageKey.AddExcitement4Description]: "Add Excitement(Very Big)",

        //     [languageKey.CallGiantessTitle]: "Call Giantess",
        //     [languageKey.ClearHatredTitle]: "Clear Hatred",

        //     [languageKey.CallGiantessDescription]: "Call Giantess",
        //     // [languageKey.ClearHatredDescription]: "All Enemy Will Attack Giantess If Has Giantess",
        //     [languageKey.ClearHatredDescription]: "Clear Player Hatred",


        //     [languageKey.ReviveTitle]: "Revive",

        //     [languageKey.ReviveDescription]: "Revive",


        //     [languageKey.None]: "None",
        //     [languageKey.ArtifactPropTypeTitle]: "Artifact",
        //     [languageKey.BulletPropTypeTitle]: "Bullet",
        //     // [languageKey.WaterPropTypeTitle]: "Water",
        //     [languageKey.WaterPropTypeTitle]: "Potions",
        //     [languageKey.AssistantPropTypeTitle]: "Assistant",
        //     [languageKey.OtherPropTypeTitle]: "Other",


        //     [languageKey.OperateShootKey]: "LeftMouse",



        //     [languageKey.PressV]: "Press V",
        //     [languageKey.ChestBoxDescription]: "Open ChestBox",
        //     [languageKey.TradeGirlDescription]: "Buy",
        //     [languageKey.FateGirlDescription]: "Open Fate Giantess",



        //     [languageKey.Coin]: "Coin",
        //     [languageKey.CoinNotEnough]: "Coin Not Enough",


        //     [languageKey.EnterDuelistTime]: "Enter duelist time",
        //     [languageKey.EndDuelistTime]: "End duelist time",




        //     [languageKey.LittleMan]: "Little Man",
        //     [languageKey.Giantess]: "Giantess",
        //     [languageKey.LittleManAndGiantess]: "Little Man and Giantess",







        //     [languageKey.MissionCompleteTitle]: "Mission Complete",
        //     [languageKey.EnterNextCityLevel]: "Attack City Level",
        //     [languageKey.LevelGameTime]: "Level Game Time",
        //     [languageKey.LevelGem]: "Level Get Gem",
        //     [languageKey.LevelCoin]: "Level Get Coin",
        //     [languageKey.EnterBossLevel]: "Boss Level",
        //     // [languageKey.Wait5S]: "Wait 5s",
        //     [languageKey.Wait20S]: "Wait 20s",


        //     [languageKey.MissionEndTitle]: "Thank your~",
        //     [languageKey.TotalGameTime]: "Total Game Time",


        //     [languageKey.MissionFailTitle]: "Come On",




        //     [languageKey.EndLevelConfirm]: "Is End Level?",
        //     [languageKey.Camera]: "Camera",
        //     [languageKey.UI]: "UI",
        //     [languageKey.Operate]: "Operate",
        //     [languageKey.EndLevel]: "End Level",
        //     [languageKey.ZoomIn]: "Zoom In",
        //     [languageKey.ZoomOut]: "Zoom Out",
        //     [languageKey.Up]: "Up",
        //     [languageKey.Down]: "Down",
        //     [languageKey.SetTarget]: "Set Target",
        //     [languageKey.Chest]: "Chest",
        //     [languageKey.Foot]: "Foot",
        //     [languageKey.Free]: "Free",
        //     [languageKey.Eye]: "Eye",
        //     [languageKey.Leg]: "Leg",
        //     [languageKey.UseThirdPersonCamera]: "Use Third Person Camera",
        //     [languageKey.UseFirstPersonCamera]: "Use First Person Camera",
        //     [languageKey.MainSettingTitle]: "MainSetting",
        //     // [languageKey.PackageTitle]: "Prop",
        //     [languageKey.PackageTitle]: "Item",
        //     [languageKey.AddToFastProp]: "Add To FastProp",


        //     [languageKey.HideUI]: "Hide UI",
        //     [languageKey.ShowUI]: "Show UI",


        //     [languageKey.NotShowGemAnimation]: "Don't Generate Gems",
        //     [languageKey.ShowCoinAnimation]: "Generate Coins",
        //     [languageKey.NotShowCoinAnimation]: "Don't Generate Coins",
        //     [languageKey.GenerateProp]: "Generate Props",
        //     [languageKey.NotGenerateProp]: "Don't Generate Props",
        //     [languageKey.ShowUpgradeParticle]: "Show Upgrade Effects",
        //     [languageKey.HideUpgradeParticle]: "Hide Upgrade Effects",
        //     [languageKey.ShowExplosionSmoke]: "Show Explosion Residue",
        //     [languageKey.HideExplosionSmoke]: "Hide Explosion Residue",


        //     [languageKey.EnableFullScreen]: "Enable fullscreen",
        //     [languageKey.DisableFullScreen]: "Disable fullscreen",

        //     [languageKey.SetSkillButtonTip]: "Set skill buttons in right-bottom corner(by drag)",
        //     [languageKey.StartSetSkillButton]: "Start to set",
        //     [languageKey.EndSetSkillButton]: "End to set",
        //     [languageKey.ResetSkillButton]: "Reset",

        //     [languageKey.FireWayTip]: "Attack Way",
        //     [languageKey.BurstFire]: "Burst Fire",
        //     [languageKey.ContinueFire]: "Continuous Fire",



        //     [languageKey.Hour]: "H",
        //     [languageKey.Minute]: "M",
        //     [languageKey.Second]: "S",
        //     [languageKey.Meter]: "M",


        //     [languageKey.Infinity]: "Infinity",


        //     [languageKey.TradeTitle]: "Trade List",
        //     [languageKey.Buy]: "Buy",
        //     [languageKey.Close]: "Close",
        //     [languageKey.All]: "All",



        //     [languageKey.UpgradeTitle]: "Select Upgrade Direction",
        //     [languageKey.Skip]: "Skip",
        //     [languageKey.Change]: "Change",
        //     [languageKey.Want]: "Want",
        //     [languageKey.NotWant]: "Not Want",


        //     [languageKey.SelectLittleManCareerTitle]: "Select Little Man Career",
        //     [languageKey.SelectGiantessCareerTitle]: "Select Giantess Career",
        //     [languageKey.GenerateRandomCareer]: "Generate Random Career",

        //     [languageKey.ShareTitle]: "Share to Friend",
        //     // [languageKey.ShareTitle2]: "share with friends, scan the QR code on WeChat to enter the game",
        //     [languageKey.ShareTitle2]: "share with friends, scan the QR code to enter the game",
        //     [languageKey.ShareTitle3]: "share online url, use browser to enter",



        //     [languageKey.SelectCharacterTitle]: "Select Giantess",
        //     [languageKey.ForceReviveContent]: "Revive will reset talent, is revive?",
        //     [languageKey.ForceRevive]: "Force Revive",
        //     [languageKey.RemainTalentContent]: "Revive will take one revive stone but remain talent, is revive?",
        //     [languageKey.DirectRevive]: "Direct Revive",



        //     [languageKey.SelectLittleManTitle]: "Select LittleMan",



        //     [languageKey.SettingTitle]: "Setting",





        //     [languageKey.ModTitle]: "Mod Manage",
        //     [languageKey.ModInfo]: "currently under development and not yet open",



        //     [languageKey.ErrorHandleTitle]: "Error Handle",
        //     [languageKey.NetworkErrorHandleTitle]: "Network Error Handle",

        //     [languageKey.NetworkErrorHandleContent]: "Backend request error",

        //     [languageKey.RetryBackendRequest]: "Try backend request",
        //     [languageKey.Relogin]: "Refresh page and relogin,suggest to as a visitor",


        //     [languageKey.QuotaExceededErrorTitle]: "Offline cache(IndexDB) is full",
        //     [languageKey.QuotaExceededErrorContent]: "Please click the button to clear the cache. If it fails again, please manually clear the browser cache, or reinstall the browser and try again",
        //     [languageKey.ClearCacheAndReload]: "Clear cache and refresh page",



        //     [languageKey.ExplainTitle]: "Skill Explain",
        //     [languageKey.KeyTitle]: "Key",
        //     [languageKey.FunctionTitle]: "Function",
        //     [languageKey.Key1Function]: "move",
        //     [languageKey.Key2Function]: "show or hide mouse",



        //     [languageKey.VersionExplain]: "(internal testing phase, data may be lost)",


        //     [languageKey.SceneDescription]: "Scene",

        //     [languageKey.GetBackendDataInfo]: "Get Backend Data",
        //     [languageKey.InitingInfo]: "Initing",



        //     [languageKey.EnteringScene]: "Entering Scene",
        //     [languageKey.CaptureWildGiantessSuccessInfo]: "Captured Wild Giantess Successfully, can use from next level",
        //     [languageKey.RestorePointerLockInfo]: "click me  to restore pointer lock",
        //     [languageKey.KnowInfo]: "Get it",
        //     [languageKey.GetReward]: "Get Reward",
        //     [languageKey.GetConfirm]: "Get",
        //     [languageKey.NothingHappen]: "Nothing happen",


        //     [languageKey.SuggestUseChrome]: "Suggest using Chrome browser",

        //     [languageKey.FullScreen]: "Enter FullScreen",

        //     [languageKey.MemoryIsSmall]: "Memory is too small, should at least >= 6G, Game maybe crash",
        //     [languageKey.ContextLost]: "WebGL context is lost (usually due to insufficient video memory), it will be automatically restored for you. You can close other running apps and ensure that the memory is >=6G",
        //     [languageKey.WebGLError]: "WebGL is error, it will be automatically restored for you",
        //     [languageKey.CanvasNone]: "Canvas's display is none, it will be automatically restored for you",


        //     [languageKey.ClickToContinue]: "Click to continue",


        //     [languageKey.Body]: "Body",


        //     [languageKey.TotalDamage]: "Total Damage",
        //     [languageKey.DestroyUnitCount]: "Destroy Unit Count",

        //     [languageKey.Building]: "Building",
        //     [languageKey.Prop]: "Prop",
        //     [languageKey.Car]: "Car",

        //     [languageKey.Infantry]: "Infantry",
        //     [languageKey.Commander]: "Commander",
        //     [languageKey.Laserer]: "Laserer",
        //     [languageKey.Melee]: "Melee",
        //     [languageKey.Rocketeer]: "Rocketeer",

        //     [languageKey.Tank]: "Tank",
        //     [languageKey.MissileVehicle]: "Missile Vehicle",
        //     [languageKey.FlameVehicle]: "Flame Vehicle",

        //     [languageKey.ShellTurret]: "Shell Turret",
        //     [languageKey.MissileTurret]: "Missile Turret",

        //     [languageKey.EliteGiantess]: "Elite Giantess",
        //     [languageKey.GiantessBoss]: "Giantess Boss",





        //     [languageKey.AppearWildGiantessName]: "Wild Giantess",
        //     [languageKey.AppearWildGiantessSay1]: "Hello Eveyone~",
        //     [languageKey.AppearWildGiantessSay2]: "Little are so cute~",
        //     [languageKey.AppearEnemyGiantessName]: "Enemy Giantess",
        //     [languageKey.AppearEnemyGiantessSay1]: "Hello Player~",
        //     [languageKey.AppearPlayerGoddessName]: "Player Giantess",
        //     [languageKey.AppearPlayerGoddessSay1]: "Player, I will help you~",


        //     [languageKey.BossLevel1BeginSay1]: "Player, Welcome to beat me~",
        //     [languageKey.BossLevel1PickdownArmy1Say1]: "Play with these little toys~",
        //     [languageKey.BossLevel1PickdownArmy3Say1]: "I will put more toys~",
        //     [languageKey.BossLevel1StompLittleManSay1]: "I will play with you~",


        //     [languageKey.BossLevel2BeginSay1]: "You make me a little excitement~",
        //     [languageKey.BossLevel2BeginSay2]: "I will first use foot to play with you, don't die~",
        //     [languageKey.BossLevel2PickdownArmyNormalSay1]: "Put more toys~",
        //     [languageKey.BossLevel2PickdownArmyHardSay1]: "More toys~",
        //     [languageKey.BossLevel2HardSay1]: "I need to be a little more serious~",
        //     [languageKey.BossLevel2StressingSay1]: "I feels a little bit~",
        //     [languageKey.BossLevel2StressingSay2]: "It's a bit itchy~",
        //     [languageKey.BossLevel2StressingSay3]: "That's it~",


        //     [languageKey.BossLevel3GoToTrigoneSay1]: "Come up to my stomach~",
        //     [languageKey.BossLevel3ReachTrigoneSay1]: "You've arrived~",
        //     [languageKey.BossLevel3OnlyAddArmySay1]: "Put some little toys~",
        //     [languageKey.BossLevel3RightHandAddArmySay1]: "Put some little toys to play~",
        //     [languageKey.BossLevel3RightHandOnePointAttackSay1]: "I will only use one finger~",
        //     [languageKey.BossLevel3RightHandBeatAttackSay1]: "I will use one hand~",
        //     [languageKey.BossLevel3LeftHandRightHandSay1]: "Need protect my chest~",
        //     [languageKey.BossLevel3TwoHandsOneFingerAttackSay1]: "I will use two fingers~",
        //     [languageKey.BossLevel3TwoHandsBeatAttackSay1]: "I will be a little serious~",
        //     [languageKey.BossLevel3HitRightNippleSay1]: "Ah ah~~~The right nipple is a bit itchy",
        //     [languageKey.BossLevel3HitRightNippleSay2]: "I feels a little bit~",
        //     [languageKey.BossLevel3HitRightNippleSay3]: "Oh, you hit very accurately~",
        //     [languageKey.BossLevel3HitLeftNippleSay1]: "Ah ah~The left nipple is a bit itchy",
        //     [languageKey.BossLevel3HitLeftNippleSay2]: "It makes me feel a bit uncomfortable~",
        //     [languageKey.BossLevel3HitLeftNippleSay3]: "Ah ah ah~You hit very accurately~",
        //     [languageKey.BossLevel3StressingSay1]: "Ah ah ah~",
        //     [languageKey.BossLevel3StressingSay2]: "Oh~",





        //     [languageKey.WildGiantessAppear]: "Wild Giantess Appear",
        //     [languageKey.WildGiantessAppearDescription]: "Wild Giantess Will Appear",
        //     [languageKey.EnemyGiantessAppear]: "Enemy Giantess Appear",
        //     [languageKey.EnemyGiantessAppearDescription]: "Enemy Giantess Will Appear",
        //     [languageKey.EnemyReinforceReach]: "Enemy Reinforce Reach",
        //     [languageKey.EnemyReinforceReachDescription]: "Enemy Reinforce Will Reach",
        //     [languageKey.EnemyFireSupport]: "Enemy Fire Support",
        //     [languageKey.CallGiantess]: "Call Giantess",
        //     [languageKey.EnemyAddRandomBuff]: "Enemy Add Random Buff",


        //     [languageKey.CancelEvent]: "Event Cancel",


        //     [languageKey.EnterDoor]: "Enter Door",

        //     [languageKey.UpgradeTip]: "Congratulations on your first level-up! Click the yellow arrow on the right side of the experience bar in the top left corner to choose your upgrade direction",
        //     [languageKey.NoValidCrowdPositionsTip]: "All enemies have appeared, no more enemies",
        //     [languageKey.NoInRangeCrowdPositionsTip]: "The surrounding enemies have been eliminated. Please explore more areas",



        //     [languageKey.ActiveBiggerNumber]: "Active Bigger",
        //     [languageKey.UnDamage]: "UnDamage",
        //     [languageKey.Hard]: "Hard",

        //     [languageKey.OldSoldierNumber]: "Old Soldier",
        //     [languageKey.ComboStormNumber]: "Combo Storm",
        //     [languageKey.ClearHatred]: "Clear Hatred",



        //     [languageKey.LoginTitle]: "Login",
        //     [languageKey.RegisterTitle]: "Register",
        //     [languageKey.Account]: "UserName",
        //     [languageKey.Password]: "Password",
        //     [languageKey.Register]: "Register",
        //     [languageKey.Login]: "Login",

        //     [languageKey.Visitor]: "Enter game as a visitor(data is saved locally, may lost)",

        //     [languageKey.SelectLevelTitle]: "Select Level",
        //     [languageKey.PlayLevel]: "Attack City",


        //     [languageKey.HowToGetGiantessCharacterQ]: "How to get Giantess Character?",
        //     [languageKey.HowToGetGiantessCharacterA]: "When using the littleman character, using the 'capture' item near the giantess has a chance to capture her; then, you can choose the corresponding character by restarting the level",

        // },
        [language.English]: {
            [languageKey.VeryLow]: "VeryLow",
            [languageKey.Low]: "Low",
            [languageKey.Middle]: "Middle",
            [languageKey.High]: "High",
            [languageKey.VeryHigh]: "VeryHigh",
            [languageKey.CameraRotateSpeed]: "Mouse Sensitivity",
            [languageKey.EnterOldVersion]: "Enter Old Version",
            [languageKey.Enter2Version]: "Enter v2.0-Alpha",
            [languageKey.EnterGame]: "Enter Game",
            [languageKey.Mod]: "Mods",
            [languageKey.Setting]: "Settings",
            [languageKey.Website]: "Website",
            [languageKey.Logout]: "Log Out",
            [languageKey.IsLogout]: "Is log out?",
            [languageKey.Confirm]: "Confirm",
            [languageKey.Cancel]: "Cancel",
            [languageKey.BackToIndex]: "Back to Main Menu",
            [languageKey.Back]: "Back",
            [languageKey.Reset]: "Reset",
            [languageKey.More]: "More",

            [languageKey.Clipboard]: "Copy",
            [languageKey.EnableClipboard]: "Enable Copy",
            [languageKey.Success]: "Success",
            [languageKey.Fail]: "Fail",
            [languageKey.DifficultTitle]: "Custom Difficulty",
            [languageKey.TotalHeat]: "Total Heat",
            [languageKey.HeatUnit]: "Points",
            [languageKey.RewardLevel]: "Reward Level",
            [languageKey.LevelUnit]: "Level",
            [languageKey.MatchDifficultyExplain]: "Based on your current strength, enemies become more powerful",
            [languageKey.MatchDifficultyTitle]: "Adaptive difficulty",

            [languageKey.DifficultyName]: "Name",
            [languageKey.DifficultyRatio]: "Ratio",
            [languageKey.DifficultyOperate]: "Operate",
            [languageKey.DifficultyHeat]: "Heat",

            [languageKey.AddCommonArmyCount]: "Common enemy amount",
            [languageKey.AddEliteArmyCount]: "Elite giantess amount",
            [languageKey.AddArmyDamage]: "Enemy damage",
            [languageKey.SubPlayerRestoreHp]: "Player healing reduction",
            [languageKey.AddArmyHp]: "Army max hp",
            [languageKey.EnhenceEliteGiantess]: "Enhance elite giantess",
            [languageKey.EnhenceArmy]: "Enhance army",
            [languageKey.EnhenceLevelGiantess]: "Enhance level giantess",
            [languageKey.EnhenceBossGiantess]: "Enhance boss giantess",
            [languageKey.AddMaxMMDGiantessCount]: "Increase MMD Giantess's max count",
            [languageKey.AllowFriendDamage]: "Allow damage between friendly units",
            [languageKey.RemoveMapEdgeZone]: "Remove map edge zone",

            [languageKey.DecreaseGenerateArmyInterval]: "Reduce the enemy respawn interval",

            [languageKey.Difficulty]: "Difficulty",
            [languageKey.AddGiantessHp]: "Increase max hp",
            [languageKey.AddGiantessDefenseFactor]: "Increase defense",
            [languageKey.AddGiantessAttackFactor]: "Increase attack",
            [languageKey.AddGiantessLife]: "Additional lives",
            [languageKey.AddBiggerScale]: "Increase growth ability scale",
            [languageKey.AddActiveBiggerTime]: "Extend growth ability duration",
            [languageKey.AddPassiveBiggerIncreaseScale]: "Increase passive growth scale",
            [languageKey.AddDamageBiggerIncreaseScale]: "Increase damaged growth scale",
            [languageKey.AddInitialScale]: "Increase starting size",
            [languageKey.SubDurationFactor]: "Increase action speed",
            [languageKey.AddGiantessCritRatioFactor]: "Increase crit crtio",
            [languageKey.AddGiantessLuck]: "Increase luck",
            [languageKey.SubGiantessRestoreHpTime]: "Decrease hp restore time",
            [languageKey.AddGiantessRestoreHpSpeedRate]: "Increase hp restore time speed rate",
            [languageKey.GiantessStrong]: "Strong",
            [languageKey.AddGiantessArmor]: "enforce armor",

            [languageKey.AddLittleManHp]: "Increase max hp",
            [languageKey.AddLittleManDefenseFactor]: "Increase defense",
            [languageKey.AddLittleManArmor]: "enforce armor",
            [languageKey.AddLittleManAttackFactor]: "Increase base damage",
            [languageKey.AddEmitterLifeFactor]: "increase emitter life",
            [languageKey.AddMoveSpeed]: "increase move speed",
            [languageKey.AddLittleManLife]: "Additional lives",
            [languageKey.LittleManStrong]: "Strong",
            [languageKey.AddLittleManCritRatioFactor]: "Increase crit ratio",
            [languageKey.AddLittleManLuck]: "Increase luck",
            [languageKey.SubLittleManRestoreHpTime]: "Decrease hp restore time",
            [languageKey.AddLittleManRestoreHpSpeedRate]: "Increase hp restore time speed rate",



            [languageKey.TalentTitle]: "Talents",
            [languageKey.GemRemain]: "Remaining gems",
            // [languageKey.GemExpand]: "Cost",
            [languageKey.Take]: "Take",
            [languageKey.GemNotEnough]: "Not enough gems",
            [languageKey.UnlockTalentPhaseDescription]: "Buy 5 upgrades to unlock the second page",
            [languageKey.UpgradeMax]: "Upgrade to max",


            [languageKey.Has]: "Has",
            [languageKey.LearnBigger]: "Growth Ability",
            [languageKey.LearnStandToCrawlAndCrawlToStand]: "Crawl",
            [languageKey.LearnStandToCrawlAndCrawlToStandDescription]: "Unlock Crawl pose",
            [languageKey.LearnBreastPress]: "Breast Press (Crawl Pose)",
            [languageKey.LearnPickAndPickdown]: "Pickup",
            [languageKey.LearnPickAndPickdownDescription]: "Unlock Pick pose, can get Pinch, Eat, UB related skills",
            [languageKey.LearnPinch]: "Pinch (Pick Pose)",
            [languageKey.LearnEat]: "Eat (Pick Pose)",
            [languageKey.LearnEatDescription]: "Stomach will swell. If the stomach is too big, it cannot be eaten anymore",

            [languageKey.ChangeToPassiveBigger]: "Switch to Passive Growth",
            [languageKey.EnhanceBigger]: "Enhance the Growth Ability",
            [languageKey.MoveAndStompDamageEnhance]: "Increase Walking Damage",
            [languageKey.OldSoldier_Giantess]: "Old Soldier",
            [languageKey.LuckDog_Giantess]: "Luck Dog",
            [languageKey.LearnBlink]: "Blink",
            [languageKey.LearnSwip]: "Swipe",
            [languageKey.LearnFastRun]: "Sprint",
            [languageKey.ComboStorm]: "Combo Storm",
            [languageKey.ClothDamageEnhance]: "Increase Damage to Clothing",
            [languageKey.Crazy]: "Crazy",
            [languageKey.OldSoldier_Little]: "Old Soldier",
            [languageKey.LuckDog_Little]: "Luck Dog",
            [languageKey.BasicBulletTitle]: "Basic Gun",
            [languageKey.LaserBulletTitle]: "Laser Gun",
            [languageKey.RocketBulletTitle]: "Rocket Launcher",
            [languageKey.BasicBulletDescription]: "Weak single shot",
            [languageKey.LaserBulletDescription]: "Powerful single shot",
            [languageKey.RocketBulletDescription]: "Area attack",
            [languageKey.AddHp1Title]: "Small Heal",
            [languageKey.AddHp2Title]: "Medium Heal",
            [languageKey.AddHp3Title]: "Large heal",
            [languageKey.AddHp4Title]: "Massive heal",
            [languageKey.AddExcitement1Title]: "Add Excitement(Small)",
            [languageKey.AddExcitement2Title]: "Add Excitement(Middle)",
            [languageKey.AddExcitement3Title]: "Add Excitement(Big)",
            [languageKey.AddExcitement4Title]: "Add Excitement(Very Big)",
            [languageKey.AddHp1Description]: "Restores 10% HP",
            [languageKey.AddHp2Description]: "Restores 30% HP",
            [languageKey.AddHp3Description]: "Restores 50% HP",
            [languageKey.AddHp4Description]: "Restores 100% HP",
            [languageKey.AddExcitement1Description]: "Add Excitement(Small)",
            [languageKey.AddExcitement2Description]: "Add Excitement(Middle)",
            [languageKey.AddExcitement3Description]: "Add Excitement(Big)",
            [languageKey.AddExcitement4Description]: "Add Excitement(Very Big)",
            [languageKey.CallGiantessTitle]: "Friendly Giantess Summon",
            [languageKey.ClearHatredTitle]: "Clear Hatred",
            [languageKey.CallGiantessDescription]: "Summons a friendly giantess that fights with you",
            [languageKey.ClearHatredDescription]: "All enemies will attack the giantess instead, if there is one alive",
            [languageKey.ReviveTitle]: "Resurrection stone",
            [languageKey.ReviveDescription]: "Allows you to revive a dead character with no penalty",
            [languageKey.None]: "None",
            [languageKey.ArtifactPropTypeTitle]: "Artifacts",
            [languageKey.BulletPropTypeTitle]: "Bullets",
            [languageKey.WaterPropTypeTitle]: "Potions",
            [languageKey.AssistantPropTypeTitle]: "Assistance",
            [languageKey.OtherPropTypeTitle]: "Other",
            [languageKey.OperateShootKey]: "LMB",
            [languageKey.PressV]: "Press V",
            [languageKey.ChestBoxDescription]: "Open Chest",
            [languageKey.TradeGirlDescription]: "Buy",
            [languageKey.FateGirlDescription]: "Open Fate Giantess",
            [languageKey.Coin]: "Coin",
            [languageKey.CoinNotEnough]: "Coin Not Enough",
            [languageKey.EnterDuelistTime]: "Enter duelist time",
            [languageKey.EndDuelistTime]: "End duelist time",
            [languageKey.LittleMan]: "Little Man",
            [languageKey.Giantess]: "Giantess",
            [languageKey.LittleManAndGiantess]: "Little Man and Giantess",
            [languageKey.MissionCompleteTitle]: "Mission Complete",
            [languageKey.EnterNextCityLevel]: "Attack City Level",
            [languageKey.LevelGameTime]: "Level Play Time",
            [languageKey.LevelGem]: "Gems Obtained",
            [languageKey.LevelCoin]: "Coins Obtained",
            [languageKey.EnterBossLevel]: "Boss Level",
            [languageKey.Wait20S]: "Wait 20s",
            [languageKey.ActiveReward]: "Active Reward",


            [languageKey.MissionEndTitle]: "Thank you for playing~",
            [languageKey.TotalGameTime]: "Total Play Time",
            [languageKey.MissionFailTitle]: "Come On",
            [languageKey.EndLevelConfirm]: "End Level Early?",
            [languageKey.Camera]: "Camera",
            [languageKey.UI]: "UI",
            [languageKey.Operate]: "Operate",
            [languageKey.EndLevel]: "End Level",
            [languageKey.ZoomIn]: "Zoom In",
            [languageKey.ZoomOut]: "Zoom Out",
            [languageKey.Up]: "Up",
            [languageKey.Down]: "Down",
            [languageKey.SetTarget]: "Set Camera Position",
            [languageKey.Chest]: "Chest",
            [languageKey.Foot]: "Foot",
            [languageKey.Free]: "Free",
            [languageKey.Eye]: "Eye",
            [languageKey.Leg]: "Leg",
            [languageKey.UseThirdPersonCamera]: "Use Third Person Camera",
            [languageKey.UseFirstPersonCamera]: "Use First Person Camera",
            [languageKey.MainSettingTitle]: "Main Setting",
            [languageKey.PackageTitle]: "Inventory",
            [languageKey.AddToFastProp]: "Add To Hotbar",
            [languageKey.HideUI]: "Hide UI",
            [languageKey.ShowUI]: "Show UI",
            [languageKey.ShowGemAnimation]: "Show Gem Animation",
            [languageKey.NotShowGemAnimation]: "Don't Show Gem Animation",
            [languageKey.ShowCoinAnimation]: "Show Generate Coin Animation",
            [languageKey.NotShowCoinAnimation]: "Don't Show Coin Animation",
            [languageKey.GenerateProp]: "Generate Props",
            [languageKey.NotGenerateProp]: "Don't Generate Props",
            [languageKey.ShowUpgradeParticle]: "Show Upgrade Effects",
            [languageKey.HideUpgradeParticle]: "Hide Upgrade Effects",
            [languageKey.ShowBuildingSmoke]: "Show Building Smoke",
            [languageKey.HideBuildingSmoke]: "Hide Building Smoke",
            [languageKey.ShowExplosionSmoke]: "Show Explosion Smoke",
            [languageKey.HideExplosionSmoke]: "Hide Explosion Smoke",
            [languageKey.EliteGiantePlayDeathAnimation]: "EliteGiantess play death animation",
            [languageKey.EliteGianteNotPlayDeathAnimation]: "EliteGiantess not play death animation",


            [languageKey.EnableFullScreen]: "Enable fullscreen",
            [languageKey.DisableFullScreen]: "Disable fullscreen",
            [languageKey.SetSkillButtonTip]: "Set skill button's position in right-bottom corner(by drag)",
            [languageKey.StartSetSkillButton]: "Start to set",
            [languageKey.EndSetSkillButton]: "End to set",
            [languageKey.ResetSkillButton]: "Reset",
            [languageKey.FireWayTip]: "Attack Way",
            [languageKey.BurstFire]: "Burst Fire",
            [languageKey.ContinueFire]: "Continuous Fire",
            [languageKey.Hour]: "H",
            [languageKey.Minute]: "M",
            [languageKey.Second]: "S",
            [languageKey.Meter]: "M",
            [languageKey.Infinity]: "Infinity",
            [languageKey.TradeTitle]: "Turret Shop",
            [languageKey.Buy]: "Buy",
            [languageKey.Close]: "Close",
            [languageKey.All]: "All",
            // [languageKey.UpgradeTitle]: "Select an Upgrade",
            [languageKey.UpgradeTitle]: "Select Upgrade Direction",
            // [languageKey.UpgradeTitle]: "Select an Skill",
            [languageKey.Skip]: "Skip",
            [languageKey.Change]: "Change",
            [languageKey.Want]: "Want",
            [languageKey.NotWant]: "Not Want",
            [languageKey.AutoPopup]: "Auto Popup",
            [languageKey.ManualPopup]: "Manual Popup",


            [languageKey.SelectLittleManCareerTitle]: "Select Little Man Career",
            [languageKey.SelectGiantessCareerTitle]: "Select Giantess Career",
            [languageKey.GenerateRandomCareer]: "Generate Random Career",
            [languageKey.ShareTitle]: "Share with Friends",
            [languageKey.ShareTitle2]: "Share with friends, scan the QR code to play the game",
            [languageKey.ShareTitle3]: "Share the website url, use your browser to play the game",
            [languageKey.SelectCharacterTitle]: "Select Giantess",
            // [languageKey.ForceReviveContent]: "Reviving will use one capture item and reset talents. Proceed?",
            [languageKey.ForceReviveContent]: "Reviving will reset talents. Proceed?",
            [languageKey.ForceRevive]: "Partial Resurrection",
            [languageKey.RemainTalentContent]: "Reviving will use one resurrection stone. Proceed?",
            [languageKey.DirectRevive]: "Complete Resurrection",
            [languageKey.NeedCapture]: "Need Capture",

            [languageKey.SelectLittleManTitle]: "Select Little Man",
            [languageKey.SettingTitle]: "Settings",
            [languageKey.ModTitle]: "Mod Manager",
            [languageKey.ModInfo]: "Currently under development",


            [languageKey.ResourceLoadFail]: "resource load fail, please refresh page and try again",

            [languageKey.ErrorHandleTitle]: "Error Handle",
            [languageKey.NetworkErrorHandleTitle]: "Network Error Handle",
            [languageKey.NetworkErrorHandleContent]: "Backend request error",
            [languageKey.RetryBackendRequest]: "Try backend request again",
            // [languageKey.Relogin]: "Refresh page and relogin,suggest to as a visitor",
            [languageKey.Relogin]: "Refresh page and relogin",
            [languageKey.QuotaExceededErrorTitle]: "Offline cache(IndexDB) is full",
            [languageKey.QuotaExceededErrorContent]: "Please click the button to clear the cache. If it fails again, please manually clear the browser cache, or reinstall the browser and try again",
            [languageKey.ClearCacheAndReload]: "Clear cache and refresh page",


            [languageKey.RestoreGameButton]: "Restore game",
            [languageKey.SnapshotTitle]: "Take a screenshot and send it to the developer",
            // [languageKey.SnapshotContent]: "First, please take a screenshot manually, then send it on Discord->bug_reports (join discord: https://discord.gg/JbhkqUJKFF). It will be processed with priority. Thank you! After that, you can click \"Next\"",
            [languageKey.SnapshotContent]: "First, please take a screenshot manually, then send it on Discord->bug_reports. It will be processed with priority. Thank you! After that, you can click \"Next\"",
            [languageKey.ToSnapshot]: "Take a screenshot manually",
            [languageKey.JoinGroup]: "Join discord",
            [languageKey.Next]: "Next",
            [languageKey.RestoreGame]: "Your current level data will be saved and the page will be refreshed",



            [languageKey.ExplainTitle]: "Controls",
            [languageKey.KeyTitle]: "Keys",
            [languageKey.FunctionTitle]: "Function",
            [languageKey.Key1Function]: "Move your character",
            [languageKey.Key2Function]: "Show or hide mouse",
            // [languageKey.VersionExplain]: "(internal testing phase, data may be lost)",
            [languageKey.VersionExplain]: "",
            [languageKey.SceneDescription]: "Loading scenery...",
            [languageKey.GetBackendDataInfo]: "Fetching backend data...",
            [languageKey.InitingInfo]: "Loading...",


            // [languageKey.CssCompatible]: "Your browser does not support certain game functions. Please use Chrome Browser or ALook Browser or QQ Browser",
            [languageKey.CssCompatible]: "Your browser does not support certain game functions. Please use Chrome Browser or ALook Browser",

            [languageKey.EnteringScene]: "Starting the level",
            [languageKey.CaptureWildGiantessSuccessInfo]: "Successfuly captured a Wild Giantess, you can use her from the next level.",
            [languageKey.RestorePointerLockInfo]: "CLICK ME to restore mouse lock",
            // [languageKey.KnowInfo]: "Woohoo!",
            [languageKey.KnowInfo]: "Get it",
            // [languageKey.GetReward]: "Loot",
            // [languageKey.GetConfirm]: "Yay!",
            [languageKey.GetReward]: "Get Reward",
            [languageKey.GetConfirm]: "Get",

            [languageKey.NothingHappen]: "Nothing happened...",

            [languageKey.Ignore]: "Ignore",

            [languageKey.SuggestUseChrome]: "For better game experience, please use the Chrome browser",

            // [languageKey.SuggestUseALook]: "Please use Chrome browser or ALook Browser",
            [languageKey.SuggestUseALook]: "Please use Chrome browser, ALook browser, default browser",
            [languageKey.IPadHasCompatibilityIssue]: "Your device (iPad) may have compatibility issues, it is best to replace the device",
            [languageKey.TipInApp]: "Please enter game by browser instead of app, otherwise may crash. The url is: https://gts-play.cn",

            [languageKey.FullScreen]: "Enter Fullscreen",
            [languageKey.MemoryIsSmall]: "Low RAM detected. If you have less than 6GB, the game might crash.",
            // [languageKey.ContextLost]: "WebGL context is lost (usually due to insufficient video memory), it will be automatically restored for you. You can close other running apps and ensure that the memory is >=6G",
            // [languageKey.ContextLost]: "WebGL context is lost (usually due to insufficient video memory). You can close other running apps and ensure that the memory is >=6G",
            [languageKey.ContextLost]: "WebGL context is lost",

            [languageKey.WebGLError]: "WebGL is error, it will be automatically restored for you",
            [languageKey.CanvasNone]: "Canvas's display is none, it will be automatically restored for you",


            [languageKey.AutoRestore]: "Auto restore",

            [languageKey.UseGiantessCharacterNotEnough]: "The number of \"Giantess Character Use\" item is insufficient. You need to activate game or obtain them by defeating the giantess",
            [languageKey.GoToActive]: "Go to activate game",
            [languageKey.UseGiantessCharacter]: "Use a \"Giantess Character Use\" item?",
            // [languageKey.UseArtifactNotEnough]: "The number of Artifact Use is insufficient. You need to activate game or obtain them by defeating the giantess",

            [languageKey.InputActiveCode]: "Input Active Code",
            [languageKey.ActiveSuccess]: "Active Success",
            [languageKey.ActiveVIPSuccess]: "VIP Active Success",
            [languageKey.ActiveFail]: "Active code is wrong, please input again",
            [languageKey.IfNotCharge]: "If no recharge, ",
            [languageKey.Charge]: "Tap to recharge",
            [languageKey.IfAlreadyCharge]: "If already recharge, ",
            [languageKey.GetActiveCode]: "Tap to get active code",
            [languageKey.ActiveBenefits]: `You can get after active:
- Can use 【All Giantess Characters】 (must be captured first)
- Increases the number of gems obtained in a single round by an additional 50%
- Twice the normal rate of dropping artifacts, revival stones, and captures 
- Newcomer rewards are obtained at three times the normal amount`,


            [languageKey.CaptureNotEnough]: "The number of Capture item is insufficient, need at least one",



            [languageKey.ClickToContinue]: "Click to continue",
            [languageKey.Body]: "Height",
            [languageKey.TotalDamage]: "Total Damage Dealt",
            [languageKey.DestroyUnitCount]: "Destroyed units:",
            [languageKey.Building]: "Building",
            [languageKey.Prop]: "Prop",
            [languageKey.Car]: "Car",
            [languageKey.Infantry]: "Infantry",
            [languageKey.Commander]: "Commander",
            [languageKey.Laserer]: "Laserer",
            [languageKey.Melee]: "Melee",
            [languageKey.Rocketeer]: "Rocketeer",
            [languageKey.Tank]: "Tank",
            [languageKey.MissileVehicle]: "Missile Vehicle",
            [languageKey.FlameVehicle]: "Flame Vehicle",
            [languageKey.ShellTurret]: "Shell Turret",
            [languageKey.MissileTurret]: "Missile Turret",
            [languageKey.EliteGiantess]: "Elite Giantess",
            [languageKey.GiantessBoss]: "Giantess Boss",
            [languageKey.AppearWildGiantessName]: "Wild Giantess",
            [languageKey.AppearWildGiantessSay1]: "Hello Everyone~",
            [languageKey.AppearWildGiantessSay2]: "Tinies are so cute~",
            [languageKey.AppearEnemyGiantessName]: "Enemy Giantess",
            [languageKey.AppearEnemyGiantessSay1]: "Hello Player~",
            [languageKey.AppearPlayerGoddessName]: "Player Giantess",
            [languageKey.AppearPlayerGoddessSay1]: "Player, I will help you~",
            [languageKey.LevelGiantessHardName]: "Level Giantess",
            [languageKey.LevelGiantessHardSay1]: "I need to be a little more serious~",



            [languageKey.BossLevel1BeginSay1]: "Try to to beat me, Player~",
            [languageKey.BossLevel1PickdownArmy1Say1]: "Play with these little toys~",
            [languageKey.BossLevel1PickdownArmy3Say1]: "Have some more toys~",
            [languageKey.BossLevel1StompLittleManSay1]: "I will play with you~",
            [languageKey.BossLevel2BeginSay1]: "You make me a bit excited~",
            [languageKey.BossLevel2BeginSay2]: "I will use my foot to play with you, don't die~",
            [languageKey.BossLevel2PickdownArmyNormalSay1]: "Have some more toys~",
            [languageKey.BossLevel2PickdownArmyHardSay1]: "More toys~",
            [languageKey.BossLevel2HardSay1]: "I need to be a little more serious~",
            [languageKey.BossLevel2StressingSay1]: "I'm starting to feel it'~",
            [languageKey.BossLevel2StressingSay2]: "It's a bit itchy~",
            [languageKey.BossLevel2StressingSay3]: "That's it~",
            [languageKey.BossLevel3GoToTrigoneSay1]: "Come up to my belly~",
            [languageKey.BossLevel3ReachTrigoneSay1]: "You've arrived~",
            [languageKey.BossLevel3OnlyAddArmySay1]: "Placing some little toys~",
            [languageKey.BossLevel3RightHandAddArmySay1]: "Have some more toys to play with~",
            [languageKey.BossLevel3RightHandOnePointAttackSay1]: "I will only use one finger~",
            [languageKey.BossLevel3RightHandBeatAttackSay1]: "Hmm, i will use one hand~",
            [languageKey.BossLevel3LeftHandRightHandSay1]: "Need to protect my chest~",
            [languageKey.BossLevel3TwoHandsOneFingerAttackSay1]: "I will use two fingers~",
            [languageKey.BossLevel3TwoHandsBeatAttackSay1]: "Time to be a bit more serious~",
            [languageKey.BossLevel3HitRightNippleSay1]: "Ah-ah~ The right nipple is a bit itchy",
            [languageKey.BossLevel3HitRightNippleSay2]: "I'm starting to feel it~",
            [languageKey.BossLevel3HitRightNippleSay3]: "Oh, you're so accurate~",
            [languageKey.BossLevel3HitLeftNippleSay1]: "Ah-ah~ The left nipple is a bit itchy",
            [languageKey.BossLevel3HitLeftNippleSay2]: "It makes me a bit uncomfortable~",
            [languageKey.BossLevel3HitLeftNippleSay3]: "Ah-ah-ah~ You hit very accurately~",
            [languageKey.BossLevel3StressingSay1]: "Ah-ah-ah~",
            [languageKey.BossLevel3StressingSay2]: "Oh~",
            [languageKey.WildGiantessAppear]: "A Wild Giantess Appears",
            [languageKey.WildGiantessAppearDescription]: "A Wild Giantess Will Soon Appear",
            [languageKey.EnemyGiantessAppear]: "An Enemy Giantess Appears",
            [languageKey.EnemyGiantessAppearDescription]: "AEnemy Giantess Will Soon Appear",
            [languageKey.EnemyReinforceReach]: "Enemy Reinforcements Incoming",
            [languageKey.EnemyReinforceReachDescription]: "Enemy Reinforcements Will Soon Arrive",
            [languageKey.EnemyFireSupport]: "Enemy Artillery Strike",
            [languageKey.CallGiantess]: "A Giantess Appears",
            [languageKey.EnemyAddRandomBuff]: "Enemies Gain a Random Buff",
            [languageKey.CancelEvent]: "Event Cancelled",
            [languageKey.EnterDoor]: "Enter Door",
            // [languageKey.UpgradeTip]: "Congratulations on your first level-up! Click the yellow arrow on the right side of the experience bar in the top left corner to choose your upgrade direction",
            [languageKey.UpgradeTip]: "Congratulations on your first level-up! Click the yellow arrow on the right side of the experience bar in the top left corner to choose your skill",
            [languageKey.NoValidCrowdPositionsTip]: "All enemies have appeared, no more enemies",
            [languageKey.NoInRangeCrowdPositionsTip]: "The surrounding enemies have been eliminated. Please explore more areas",
            [languageKey.ActiveBiggerNumber]: "Active Bigger",
            [languageKey.UnDamage]: "UnDamage",
            [languageKey.Hard]: "Hard",
            [languageKey.OldSoldierNumber]: "Old Soldier",
            [languageKey.ComboStormNumber]: "Combo Storm",
            [languageKey.ClearHatred]: "Clear Hatred",
            [languageKey.LoginTitle]: "Login",
            [languageKey.RegisterTitle]: "Register",
            [languageKey.Account]: "Username",
            [languageKey.Password]: "Password(can be empty)",
            [languageKey.Register]: "Register",
            [languageKey.Login]: "Login",
            [languageKey.Visitor]: "Play The Game Without Logging In (Data may be lost)",
            [languageKey.SelectLevelTitle]: "Select Level",
            [languageKey.PlayLevel]: "Attack City",
            [languageKey.HowToGetGiantessCharacterQ]: "How to get more Giantess Characters?",
            [languageKey.HowToGetGiantessCharacterA]: "When using the little man character, using the 'Capture' item near the giantess has a chance to capture her; then, restarting the level allows you to select the corresponding character",
        },
    }
}


export let getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            [languageVariableKey.RewardLevelExplain]: ([v1, v2]) => `获得${v1}%的宝石，获得神器的概率增加${v2}%`,

            [languageVariableKey.AddCommonArmyCount]: (value) => `增加${value}%刷新普通敌人数量`,
            [languageVariableKey.AddEliteArmyCount]: (value) => `增加${value}%刷新精英敌人数量`,
            [languageVariableKey.AddArmyDamage]: (value) => `增加敌人${value}%伤害`,
            [languageVariableKey.AddArmyHp]: (value) => `增加敌人${value}%生命上限`,
            [languageVariableKey.SubPlayerRestoreHp]: (value) => `减少玩家${value}%生命回复`,


            [languageVariableKey.EnhenceEliteGiantess]: (value) => `强化精英巨大娘${value}级`,
            [languageVariableKey.EnhenceArmy]: (value) => `强化军队${value}级`,
            [languageVariableKey.EnhenceLevelGiantess]: (value) => `强化关卡巨大娘${value}级`,
            [languageVariableKey.EnhenceBossGiantess]: (value) => `强化Boss巨大娘${value}级`,
            [languageVariableKey.AddMaxMMDGiantessCount]: (value) => `MMD巨大娘最大个数为${value + 2}个`,
            [languageVariableKey.AllowFriendDamage]: (value) => Number(value) > 0 ? `允许` : `不允许`,
            [languageVariableKey.RemoveMapEdgeZone]: (value) => Number(value) > 0 ? `移除` : `不移除`,

            [languageVariableKey.DecreaseGenerateArmyInterval]: (value) => `减少敌人刷新间隔${value}%`,



            [languageVariableKey.AddGiantessHp]: (value) => `增加${value}%生命上限`,
            // [languageVariableKey.AddGiantessDefenseFactor]: (value) => `增加${value}点防御力`,
            [languageVariableKey.AddGiantessDefenseFactor]: (value) => `增加${value}%防御力`,
            [languageVariableKey.AddGiantessAttackFactor]: (value) => `增加${value}%攻击力`,
            [languageVariableKey.AddGiantessLife]: (value) => `可满血复活${value}次`,
            [languageVariableKey.AddActiveBiggerTime]: (value) => `增加主动变大的持续时间${value}%`,
            [languageVariableKey.AddPassiveBiggerIncreaseScale]: (value) => `增加被动变大增加的倍数${value}%`,
            [languageVariableKey.AddDamageBiggerIncreaseScale]: (value) => `增加受击变大增加的倍数${value}%`,
            [languageVariableKey.AddBiggerScale]: (value) => `增加变大倍数${value}%`,
            [languageVariableKey.AddInitialScale]: (value) => `增加初始倍数${value}%`,
            [languageVariableKey.SubDurationFactor]: (value) => `增加${value}%动作速度`,
            [languageVariableKey.AddGiantessCritRatioFactor]: (value) => `增加${value}%暴击率`,
            [languageVariableKey.AddGiantessLuck]: (value) => `增加${value}%幸运`,
            [languageVariableKey.SubGiantessRestoreHpTime]: (value) => `减少${value}%hp恢复时间`,
            [languageVariableKey.AddGiantessRestoreHpSpeedRate]: (value) => `增加${value}%hp恢复数值`,
            [languageVariableKey.GiantessStrong]: (value) => `降低兴奋、高潮、硬直几率${value}%`,
            [languageVariableKey.AddGiantessArmor]: (value) => `加强盔甲${value}%`,

            [languageVariableKey.AddLittleManHp]: (value) => `增加${value}%生命上限`,
            [languageVariableKey.AddEmitterLifeFactor]: (value) => `增加${value}%射程`,
            [languageVariableKey.AddMoveSpeed]: (value) => `增加${value}%移速`,
            [languageVariableKey.AddLittleManDefenseFactor]: (value) => `增加${value}%防御力`,
            [languageVariableKey.AddLittleManAttackFactor]: (value) => `增加${value}%攻击力`,
            [languageVariableKey.AddLittleManLife]: (value) => `可满血复活${value}次`,
            // [languageVariableKey.LittleManStrong]: (value) => `降低来自军队伤害的硬直几率${value}%`,
            [languageVariableKey.LittleManStrong]: (value) => `降低被踩倒、硬直几率${value}%，被压住也更容易起身`,
            [languageVariableKey.AddLittleManCritRatioFactor]: (value) => `增加${value}%暴击率`,
            [languageVariableKey.AddLittleManLuck]: (value) => `增加${value}%幸运`,
            [languageVariableKey.SubLittleManRestoreHpTime]: (value) => `减少${value}%hp恢复时间`,
            [languageVariableKey.AddLittleManRestoreHpSpeedRate]: (value) => `增加${value}%hp恢复数值`,
            [languageVariableKey.AddLittleManArmor]: (value) => `加强盔甲${value}%`,


            [languageVariableKey.PhaseTitle]: (value) => `阶段${value}`,
            [languageVariableKey.TalentLevel]: (value) => `天赋等级：${value}`,




            [languageVariableKey.ComboStorm]: (value) => `每击中一次敌人,伤害增加10%,持续2秒,最多可以叠加99层`,
            [languageVariableKey.ClothDamageEnhance]: (value) => `增加对巨大娘衣服的伤害${value}%`,
            // [languageVariableKey.FragileGrowth]: (value) => `获得伤害的${value}%的生命汲取,但受到的伤害增加50%`,
            [languageVariableKey.Crazy]: ([value1, value2]) => `增加攻速为原来的${value1}%,但受到的伤害为原来的${value2}%`,
            [languageVariableKey.OldSoldier_Little]: (value) => `每击败一个敌人生命上限增加${value}点`,
            // [languageVariableKey.OldSoldier_Little]: (value) => `每击败一个敌人生命上限增加5点`,
            [languageVariableKey.LuckDog_Little]: (value) => `被击败的敌人有20%概率会掉落双倍的基础奖励`,

            [languageVariableKey.SelectedCareers]: (value) => `您选择这些职业：${value}`,


            [languageVariableKey.LearnBigger]: (value) => `最多变大${value}次`,
            [languageVariableKey.ChangeToPassiveBigger]: (value) => `最大变大上限为${value}倍。注：兴奋度低于10时,每隔20s高度会下降20%(最少10M)`,
            [languageVariableKey.EnhanceBigger]: ([value1, value2]) => `变大倍数将为默认的${value1}倍，但持续时间将为默认的${value2}倍`,
            // [languageVariableKey.MoveAndStompDamageEnhance]: (value) => `移动时造成的伤害增加${value}%`,
            [languageVariableKey.MoveAndStompDamageEnhance]: (value) => `移动和踩踏时造成的伤害增加${value}%`,
            // [languageVariableKey.OldSoldier_Giantess]: (value) => `每击败一个敌人生命上限增加10点`,
            [languageVariableKey.OldSoldier_Giantess]: (value) => `每击败一个敌人生命上限增加${value}点`,
            [languageVariableKey.LuckDog_Giantess]: (value) => `被击败的敌人有20%概率会掉落双倍的基础奖励`,




            [languageVariableKey.KeepTime]: (value) => `持续${value}秒`,

            [languageVariableKey.IncreaseMoveSpeedBuffDescription]: (value) => `提升${value}移动速度`,
            [languageVariableKey.IncreaseDefenseFactorDescription]: (value) => `提升${value}防御力`,
            [languageVariableKey.ClearHatredDescription]: (value) => `清除仇恨，持续${value}秒`,
            [languageVariableKey.IncreaseActionSpeedDescription]: (value) => `提高${value}行动速度`,
            [languageVariableKey.DecreaseActionSpeedDescription]: (value) => `降低${value}行动速度`,

            [languageVariableKey.GetItem]: (value) => `获得这些道具：${value}`,




            [languageVariableKey.GetPropTitle]: (value) => `数量：${value}`,

            [languageVariableKey.ExceedBuyCount]: (value) => `最多只能选择${value}种商品`,


            [languageVariableKey.GetReward]: ([gemCount, artifactCount, artifactNames]) => `获得${gemCount}个宝石、${artifactCount}个神器:${artifactNames}`,




            [languageVariableKey.Loading]: (value) => `加载中：${value}%`,

            [languageVariableKey.NetworkError]: (value) => `网络出错了，请等一下再次尝试。错误信息：${value}`,
            // [languageVariableKey.QuotaExceededError]: (value) => `离线缓存IndexDB已满，请清除浏览器缓存、清理硬盘，或者更换浏览器再试。错误信息：${value}`,
            [languageVariableKey.QuotaExceededError]: (value) => `离线缓存IndexDB已满，错误信息：${value}`,
            [languageVariableKey.ArrayBufferAllocationError]: (value) => `内存已满，请关闭正在运行的App。错误信息：${value}`,

            [languageVariableKey.PrecisionNull]: (value) => `WebGL上下文可能丢失，请刷新页面，重新进入游戏。错误信息：${value}`,
        },
        // [language.English]: {
        //     [languageVariableKey.RewardLevelExplain]: (value) => `Get${value}%Gem`,

        //     [languageVariableKey.AddCommonArmyCount]: (value) => `increase${value}%refresh common enemy count`,
        //     [languageVariableKey.AddEliteArmyCount]: (value) => `increase${value}%refresh elite enemy count`,
        //     [languageVariableKey.AddArmyDamage]: (value) => `increase enemy${value}%damage`,
        //     [languageVariableKey.AddArmyHp]: (value) => `increase enemy${value}%max hp`,
        //     [languageVariableKey.SubPlayerRestoreHp]: (value) => `decrease plalyer${value}%hp restore`,


        //     [languageVariableKey.EnhenceEliteGiantess]: (value) => `enhence elite giantess ${value} level`,
        //     [languageVariableKey.EnhenceArmy]: (value) => `enhence army ${value} level`,
        //     [languageVariableKey.EnhenceLevelGiantess]: (value) => `enhence level giantess ${value} level`,
        //     [languageVariableKey.EnhenceBossGiantess]: (value) => `enhence boss giantess ${value} level`,




        //     [languageVariableKey.AddGiantessHp]: (value) => `increase${value}%max hp`,
        //     [languageVariableKey.AddGiantessDefenseFactor]: (value) => `increase${value}defense`,
        //     [languageVariableKey.AddGiantessAttackFactor]: (value) => `increase${value}attack`,
        //     [languageVariableKey.AddGiantessLife]: (value) => `add ${value} life`,
        //     [languageVariableKey.AddActiveBiggerTime]: (value) => `increase active bigger time${value}%`,
        //     [languageVariableKey.AddPassiveBiggerIncreaseScale]: (value) => `increase passive bigger increase scale${value}%`,
        //     [languageVariableKey.AddBiggerScale]: (value) => `increase bigger scale${value}%`,
        //     [languageVariableKey.AddInitialScale]: (value) => `increase initial scale${value}%`,

        //     [languageVariableKey.AddLittleManHp]: (value) => `increase${value}%max hp`,
        //     [languageVariableKey.AddEmitterLifeFactor]: (value) => `increase${value}%emitter life`,
        //     [languageVariableKey.AddLittleManDefenseFactor]: (value) => `increase${value}defense`,
        //     [languageVariableKey.AddLittleManAttackFactor]: (value) => `increase${value}attack`,
        //     [languageVariableKey.AddLittleManLife]: (value) => `add ${value} life`,
        //     [languageVariableKey.LittleManStrong]: (value) => `reduce the chances of being stepped on or stun, and make it easier to stand up when pressed down`,


        //     [languageVariableKey.PhaseTitle]: (value) => `Phase${value}`,
        //     [languageVariableKey.TalentLevel]: (value) => `Talent Level:${value}`,




        //     [languageVariableKey.ComboStorm]: (value) => `Each time an enemy is hit, the damage increases by 10%, lasting for 2 second, and up to 99 layers can be stacked`,
        //     [languageVariableKey.ClothDamageEnhance]: (value) => `increase cloth damage${value}%`,
        //     // [languageVariableKey.FragileGrowth]: (value) => `get hp from ${value}%damage, but increase damage 50%`,
        //     [languageVariableKey.Crazy]: ([value1, value2]) => `increase attack speed to ${value1}% of the original, but increase damage to ${value2}% of the original`,
        //     [languageVariableKey.OldSoldier_Little]: (value) => `add 1 hp after defeat one enemy`,
        //     [languageVariableKey.LuckDog_Little]: (value) => `drop twice reward 20% after defeat enemy`,

        //     [languageVariableKey.SelectedCareers]: (value) => `You have select these carrers: ${value}`,

        //     [languageVariableKey.LearnBigger]: (value) => `at most bigger ${value} times`,
        //     [languageVariableKey.ChangeToPassiveBigger]: (value) => `max bigger scale is ${value}. note: when excitement below 10, height will decrease 20%(at least 10 m) during 20s`,
        //     [languageVariableKey.EnhanceBigger]: ([value1, value2]) => `bigger scale will be ${value1} times of default, but bigger time will be ${value2} times of default`,
        //     [languageVariableKey.MoveAndStompDamageEnhance]: (value) => `move and stomp damage increase ${value}%`,
        //     [languageVariableKey.OldSoldier_Giantess]: (value) => `add 1 hp after defeat one enemy`,
        //     [languageVariableKey.LuckDog_Giantess]: (value) => `drop twice reward 20% after defeat enemy`,





        //     [languageVariableKey.KeepTime]: (value) => `keep ${value} second`,

        //     [languageVariableKey.IncreaseMoveSpeedBuffDescription]: (value) => `increase${value}move speed`,
        //     [languageVariableKey.IncreaseDefenseFactorDescription]: (value) => `increase${value}defense`,
        //     [languageVariableKey.ClearHatredDescription]: (value) => `clear hatred, keep ${value} second`,
        //     [languageVariableKey.IncreaseActionSpeedDescription]: (value) => `increase${value}action speed`,
        //     [languageVariableKey.DecreaseActionSpeedDescription]: (value) => `decrease${value}action speed`,

        //     [languageVariableKey.GetItem]: (value) => `Get these items:${value}`,



        //     [languageVariableKey.GetPropTitle]: (value) => `Count:${value}`,

        //     [languageVariableKey.ExceedBuyCount]: (value) => `You can only select up to ${value} types of goods`,




        //     [languageVariableKey.Loading]: (value) => `Loading:${value}%`,


        //     [languageVariableKey.ResourceLoadFail]: (value) => `Network error, please try later. message: ${value}`,
        //     // [languageVariableKey.QuotaExceededError]: (value) => ` Offline cache(IndexDB) is full, please clear browser cache or clear phone storage or change browser to try. message: ${value}`,
        //     [languageVariableKey.QuotaExceededError]: (value) => ` Offline cache(IndexDB) is full, message: ${value}`,

        //     [languageVariableKey.ArrayBufferAllocationError]: (value) => `Memory is full, please close running app. message:${value}`,
        // },
        [language.English]: {
            [languageVariableKey.RewardLevelExplain]: ([v1, v2]) => `Gem gain increased by ${v1}%, Artifact gain's chance increase by ${v2}%`,

            [languageVariableKey.AddCommonArmyCount]: (value) => `Increase the amount of common enemies by ${value}%`,
            [languageVariableKey.AddEliteArmyCount]: (value) => `Increase the amount of elite giantesses by ${value}%`,
            [languageVariableKey.AddArmyDamage]: (value) => `Enemy damage increased by ${value}%`,
            [languageVariableKey.AddArmyHp]: (value) => `Maximum health of enemies increased by ${value}%`,
            [languageVariableKey.SubPlayerRestoreHp]: (value) => `decrease player${value}%hp restore`,
            [languageVariableKey.EnhenceEliteGiantess]: (value) => `Current level of elite giantess enhancement: ${value}`,
            [languageVariableKey.EnhenceArmy]: (value) => `Current level of army enhancement: ${value}`,
            [languageVariableKey.EnhenceLevelGiantess]: (value) => `Current level of level giantess enhancement: ${value}`,
            [languageVariableKey.EnhenceBossGiantess]: (value) => `Current level of boss giantess enhancement: ${value}`,
            [languageVariableKey.AddMaxMMDGiantessCount]: (value) => `MMD Giantess's max count is ${value + 2}`,
            [languageVariableKey.AllowFriendDamage]: (value) => Number(value) > 0 ? `Allow damage between friendly units` : `Not allow damage between friendly units`,
            [languageVariableKey.RemoveMapEdgeZone]: (value) => Number(value) > 0 ? `Remove` : `Not remove`,


            [languageVariableKey.DecreaseGenerateArmyInterval]: (value) => `Reduce the enemy respawn interval ${value}%`,

            [languageVariableKey.AddGiantessHp]: (value) => `Max hp increased by ${value}%`,
            [languageVariableKey.AddGiantessDefenseFactor]: (value) => `Defense increased by ${value}%`,
            [languageVariableKey.AddGiantessAttackFactor]: (value) => `Base damage increased by ${value}%`,
            [languageVariableKey.AddGiantessLife]: (value) => `Additional lives: ${value}`,
            [languageVariableKey.AddActiveBiggerTime]: (value) => `Growth ability duration extended by ${value}%`,
            [languageVariableKey.AddPassiveBiggerIncreaseScale]: (value) => `Passive growth scale increased by ${value}%`,
            [languageVariableKey.AddDamageBiggerIncreaseScale]: (value) => `Damaged growth scale increased by ${value}%`,
            [languageVariableKey.AddBiggerScale]: (value) => `Growth ability scale increased by ${value}%`,
            [languageVariableKey.AddInitialScale]: (value) => `Starting size increased by ${value}%`,
            [languageVariableKey.SubDurationFactor]: (value) => `action speed increased by ${value}%`,
            [languageVariableKey.GiantessStrong]: (value) => `Reduces the chance of excitement, climax, stub ${value}%`,
            [languageVariableKey.AddGiantessCritRatioFactor]: (value) => `increase ${value}% crit ratio`,
            [languageVariableKey.AddGiantessLuck]: (value) => `increase ${value}% luck`,
            [languageVariableKey.SubGiantessRestoreHpTime]: (value) => `decrease ${value}% hp restore time`,
            [languageVariableKey.AddGiantessRestoreHpSpeedRate]: (value) => `increase ${value}% hp restore value`,
            [languageVariableKey.AddGiantessArmor]: (value) => `enhence armor ${value}%`,




            [languageVariableKey.AddLittleManHp]: (value) => `Max hp increased by ${value}%`,
            [languageVariableKey.AddEmitterLifeFactor]: (value) => `increase ${value}% fire range`,
            [languageVariableKey.AddMoveSpeed]: (value) => `increase ${value}% move speed`,
            [languageVariableKey.AddLittleManDefenseFactor]: (value) => `Defense increased by ${value}%`,
            [languageVariableKey.AddLittleManAttackFactor]: (value) => `Base damage increased by ${value}%`,
            [languageVariableKey.AddLittleManLife]: (value) => `Additional lives: ${value}`,
            [languageVariableKey.LittleManStrong]: (value) => `Reduces the chance of stub and falling down when stepped on, and makes it easier to stand up ${value}%`,
            [languageVariableKey.AddLittleManCritRatioFactor]: (value) => `increase ${value}% crit ratio`,
            [languageVariableKey.AddLittleManLuck]: (value) => `increase ${value}% luck`,
            [languageVariableKey.SubLittleManRestoreHpTime]: (value) => `decrease ${value}% hp restore time`,
            [languageVariableKey.AddLittleManRestoreHpSpeedRate]: (value) => `increase ${value}% hp restore value`,
            [languageVariableKey.AddLittleManArmor]: (value) => `enhence armor ${value}%`,



            [languageVariableKey.PhaseTitle]: (value) => `Page ${value}`,
            [languageVariableKey.TalentLevel]: (value) => `Talent upgrades bought: ${value}`,
            [languageVariableKey.ComboStorm]: (value) => `Each time you hit an enemy, your damage increases by 10%. This buff lasts for 2 seconds and stacks up to 99`,
            [languageVariableKey.ClothDamageEnhance]: (value) => `Damage dealt to clothing is increased by ${value}%`,
            [languageVariableKey.Crazy]: ([value1, value2]) => `Attack speed increased by ${value1}%, but you take ${value2}% more damage`,
            [languageVariableKey.OldSoldier_Little]: (value) => `add ${value} hp after defeat one enemy`,
            [languageVariableKey.LuckDog_Little]: (value) => `20% chance to gain double drops from killing an enemy`,
            [languageVariableKey.SelectedCareers]: (value) => `You have select these carrers: ${value}`,
            [languageVariableKey.LearnBigger]: (value) => `Growth ability can be used up to ${value} times`,
            // [languageVariableKey.ChangeToPassiveBigger]: (value) => `Max passive growth scale is ${value}. If your excitement is below 10, your height will decrease by 20% (10m minimum) over 20s`,
            [languageVariableKey.EnhanceBigger]: ([value1, value2]) => `Growth ability scale is increased by ${value1} times, but the duration is only ${value2} times`,
            [languageVariableKey.MoveAndStompDamageEnhance]: (value) => `Walking and stomp damage increased by ${value}%`,
            // [languageVariableKey.OldSoldier_Giantess]: (value) => `add 1 hp after defeat one enemy`,
            [languageVariableKey.OldSoldier_Giantess]: (value) => `add ${value} hp after defeat one enemy`,
            [languageVariableKey.LuckDog_Giantess]: (value) => `20% chance to gain double drops from killing an enemy`,
            [languageVariableKey.KeepTime]: (value) => `keep ${value} second`,
            [languageVariableKey.IncreaseMoveSpeedBuffDescription]: (value) => `Move speed increased by ${value}`,
            [languageVariableKey.IncreaseDefenseFactorDescription]: (value) => `Defense increased by ${value}`,
            [languageVariableKey.ClearHatredDescription]: (value) => `Clear hatred for ${value}`,
            [languageVariableKey.IncreaseActionSpeedDescription]: (value) => `Action speed increased by ${value}`,
            [languageVariableKey.DecreaseActionSpeedDescription]: (value) => `Action speed decreased by ${value}`,
            [languageVariableKey.GetItem]: (value) => `Get these items:${value}`,
            [languageVariableKey.GetPropTitle]: (value) => `Count: ${value}`,
            [languageVariableKey.ExceedBuyCount]: (value) => `You can only select up to ${value} types of goods`,


            [languageVariableKey.GetReward]: ([gemCount, artifactCount, artifactNames]) => `Get ${gemCount} gems,${artifactCount} artifacts:${artifactNames}`,

            [languageVariableKey.Loading]: (value) => `Loading: ${value}%`,
            [languageVariableKey.NetworkError]: (value) => `Network error, please try again later. Error message: ${value}`,
            [languageVariableKey.QuotaExceededError]: (value) => ` Offline cache (IndexDB) is full, please clear your browser cache/clear your phone storage/change browser and try again. Error message: ${value}`,
            [languageVariableKey.ArrayBufferAllocationError]: (value) => `Memory is full, please close running app. message:${value}`,

            [languageVariableKey.PrecisionNull]: (value) => `WebGL context may be lost, please refresh the page and re-enter the game. Error message: ${value}`,
        },
    }
}

export let getImageData = (): imageData => {
    return {
        [language.Chinese]: {
            [languageImageKey.Title]: "./resource/ui/not_in_game/title.png",
            [languageImageKey.FAQButton]: "./resource/ui/not_in_game/faq-button.png",
            [languageImageKey.ShareButton]: "./resource/ui/not_in_game/share-button.png",
            [languageImageKey.ActiveButton]: "./resource/ui/not_in_game/active-button.png",
            [languageImageKey.GetRewardButton]: "./resource/ui/not_in_game/getreward-button.png",
            [languageImageKey.UpdateNotice]: "./resource/ui/not_in_game/update-notice.png",
            [languageImageKey.JoinCrowdFunding]: "./resource/ui/not_in_game/crowdfunding.png",

            [languageImageKey.Code]: "./resource/ui/not_in_game/code_text.png",
        },
        [language.English]: {
            [languageImageKey.Title]: "./resource/ui/not_in_game/title-en.png",
            [languageImageKey.FAQButton]: "TODO",
            [languageImageKey.ShareButton]: "./resource/ui/not_in_game/share-button-en.png",
            [languageImageKey.ActiveButton]: "./resource/ui/not_in_game/active-button-en.png",
            [languageImageKey.GetRewardButton]: "./resource/ui/not_in_game/getreward-button-en.png",
            [languageImageKey.UpdateNotice]: "./resource/ui/not_in_game/update-notice-en.png",

            // TODO remove
            [languageImageKey.JoinCrowdFunding]: "./resource/ui/not_in_game/crowdfunding.png",


            [languageImageKey.Code]: "./resource/ui/not_in_game/code_text_english.png",
        },
    }
}


export let getLanguageDataByData = (state: state, data, key, language = getLanguage(state)) => {
    return data[language][key]
}

export let getLanguageTextData = (state: state, key, language = getLanguage(state)) => {
    // return getLanguageDataByData(state, getTextData(), key, language)
    return getLanguageDataByData(state, getTextDataInternation(state), key, language)
}

export let getLanguageTextVariableData = (state: state, key, language = getLanguage(state)) => {
    // return getLanguageDataByData(state, getTextDataByVariable(), key, language)
    return getLanguageDataByData(state, getTextDataByVariableInternation(state), key, language)
}

export let getLanguageImageData = (state: state, key, language = getLanguage(state)) => {
    return getLanguageDataByData(state, getImageDataInternation(state), key, language)
}