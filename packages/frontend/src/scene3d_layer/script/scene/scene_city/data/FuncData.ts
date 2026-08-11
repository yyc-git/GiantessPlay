import { state } from "../../../../type/StateType"
import { getConfigData, isLittleCharacterType, setConfigData } from "../CityScene"
import { usedGirlEnum } from "../type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { updateHpData } from "../girl/Cloth"
import { getAllUsedMMDData, getValue as getGirlValue, getValueByUsedGirl, hasGirlValue, setGirlScaleAndKeepCamera, setGirlScale, setFullHp, getBodyHp, setAllColor, setPartColor, getFullHp as getGirlFullHp, limitScale, setUpgradeFuncs, getUpgradeFuncs, isGirl } from "../girl/Girl"
import * as GiantessBuildUtils from "../utils/build/GiantessBuildUtils"
import * as LittleManBuildUtils from "../utils/build/LittleManBuildUtils"
import * as ArmyBuildUtils from "../utils/build/ArmyBuildUtils"
import { getCurrentStudyActions, setCurrentStudyActions, setHp, getFullHp, getValue as getLittleManValue, getName as getLittleManName } from "../little_man/LittleMan"
import { getEnhanceBiggerFullTime, getEnhanceIncreaseScale, getScaleRatio, addScaleIncrease, setBiggerEnhanceLevel, setMaxBiggerCount, getBiggerTimeRatio, addBiggerTime, setSavedStudyActions, getSavedStudyActions, addInitialScale, setExcitementFactorLevel, setCurrentStudyActions as setGirlCurrentStudyActions, setDamageBiggerFactorLevel, studyActiveBigger } from "../girl/player/Girl"
import { getClothDamageEnhanceRatio, getDamageIncreaseRatio, getEmitSpeedIncreaseRatio, setClothDamageEnhanceLevel, setCrazyLevel, setIsEnableComboStorm, setOldSoldierLevel, setLifeCount } from "../StaticDynamic"
import { setIsEnableLuckDog } from "../reward/RewardGenerator"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { setArmyCountRatio, setDecreaseGenerateArmyIntervalRatio, setEliteArmyCountRatio, setEnemyDamageRatio, setEnemyHpRatio, setEnhenceArmyLevel, setEnhenceBossGiantessBossLevel, setEnhenceEliteGiantessLevel, setEnhenceLevelGiantessLevel, setIsAllowFriendDamage, setIsRemoveMapEdgeZone, setMaxMMDGiantessCountLevel, setRestoreHpRatio } from "../difficulty/HeatImplementer"
import { getGetClothHpDataFunc, initClothHpData } from "../utils/ClothUtils"
import { getDurationFactor, playSmallerAnimation, setDurationFactor } from "../girl/Animation"
import { isSoldier, } from "../manage/city1/soldier/Soldier"
import { getAttackFactor, getCritRatioFactor, getDefenseFactor, getEmitSpeedFactor, getMoveSpeed, setAttackFactor, setCritRatioFactor, setDefenseFactor, setEmitSpeedFactor, setMoveSpeed } from "../StaticDynamicUnit"
import { setIsNeedRefindPath, setIsNotAttackLittleManTime } from "../manage/city1/Army"
import { getNow } from "../Time"
import { applyUpgradeFuncsByRandomLevel, getIsApplying, removeUpgradeFuncs } from "../build/Upgrade"
import { getLanguageDataByData, getLanguageTextData, getLanguageTextVariableData, languageKey, languageVariableKey } from "../../../../internation/Data"
import { getBlockAPI } from "../../../../mod/Mod"
import { isChinese, isEnglish } from "../../Scene"
import { damageGiantess, destroyGiantess } from "../utils/DamageUtils"
import { getMaxScale, getScale } from "../girl/Utils"
import { subExcitement } from "../girl/Excitement"
import { addValue, buildPercentDescription, dividValue, limitValueNotExceedOne, multiplyValue, subValue } from "./utils/BufferUtils"
import { refreshBiggerTime } from "../girl/InitWhenImportScene"
import { isMilltaryVehicle } from "../manage/city1/milltary_vehicle/MilltaryVehicleUtils"
import { isMilltaryBuilding } from "../manage/city1/milltary_building/MilltaryBuildingUtils"
import { isArmy, setInstanceColor } from "../utils/ArmyUtils"
import { getModAPI } from "../Mod"
import { getCharacterType } from "meta3d-jiehuo-abstract/src/scene/Scene"
import { getHp, getFullHp as getFullHpLODQueueObjectUtils, setHp as setHpLODQueueObjectUtils } from "../utils/LODQueueObjectUtils"
import { Flow } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../business_layer/State"
import { api } from "type-api/src/Type"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { computeRatio } from "./difficulty/DifficultyData"
import { addBuff, removeBuff } from "../buff/Buff"
import { getUpgradeFuncs as getUpgradeFuncsMod } from "../../../../mod/UpgradeMod"



export type funcData = {
    NullableUtils: any,
    NumberUtils,
    Flow,

    block: any,

    getModAPI: (state: state) => api,

    getAbstractState,
    setAbstractState,

    isChinese: any,
    isEnglish: any,

    getGirlValue,
    hasGirlValue,

    getGirlMaxScale,
    limitScale,

    getConfigData: any,
    setConfigData: any,

    getValueByUsedGirl,

    initClothHpData: any,
    getGetClothHpDataFunc,
    getAllUsedMMDData: any,
    updateHpData: any,

    isArmy: any,


    // getGirlName: any,
    isGirl: any,

    destroyGiantess: any,

    getLittleManValue: any,
    getLittleManName: any,

    getLittleManFullHp: any,
    setLittleManHp: any,

    setSavedStudyActions,
    getSavedStudyActions,
    setCurrentStudyActions,

    setMaxBiggerCount,
    // 
    // switchBiggerWay,
    studyActiveBigger,
    // setMaxScale,
    getEnhanceIncreaseScale,
    setBiggerEnhanceLevel,
    getEnhanceBiggerFullTime,
    setExcitementFactorLevel,
    setDamageBiggerFactorLevel,

    playSmallerAnimation,
    refreshBiggerTime,


    getScaleRatio,
    addScaleIncrease,
    addMinScale,
    addInitialScale,

    getBiggerTimeRatio,
    addBiggerTime,


    getDurationFactor,
    setDurationFactor,


    getLittleManCurrentStudyActions,
    setLittleManCurrentStudyActions,

    setArmyCountRatio,
    setEliteArmyCountRatio,
    setEnemyDamageRatio,
    setRestoreHpRatio,
    setEnemyHpRatio,

    setEnhenceArmyLevel,
    setEnhenceEliteGiantessLevel,
    setEnhenceLevelGiantessLevel,
    setEnhenceBossGiantessLevel,
    setMaxMMDGiantessCountLevel,
    setIsAllowFriendDamage,
    setIsRemoveMapEdgeZone,

    setDecreaseGenerateArmyIntervalRatio,


    isSoldier,
    isMilltaryBuilding,
    isMilltaryVehicle,

    getIsApplying,

    // getSoldierDefenseFactor,
    // getMilltaryBuildingDefenseFactor,
    // getMilltaryVehicleDefenseFactor,
    // setSoldierDefenseFactor,
    // setMilltaryBuildingDefenseFactor,
    // setMilltaryVehicleDefenseFactor,
    getEmitSpeedFactor,
    setEmitSpeedFactor,
    getCritRatioFactor,
    setCritRatioFactor,
    getAttackFactor,
    setAttackFactor,
    getDefenseFactor,
    setDefenseFactor,
    getMoveSpeed,
    setMoveSpeed,
    setIsNeedRefindPath,
    getHp,
    getFullHp,
    setHp,

    setInstanceColor,

    setIsEnableComboStorm,
    setClothDamageEnhanceLevel,
    getClothDamageEnhanceRatio,

    // getMoveAndStompDamageEnhanceRatio,
    // setMoveAndStompDamageEnhanceLevel,

    // getGetHpRatio,
    getDamageIncreaseRatio,
    getEmitSpeedIncreaseRatio,
    // setFragileGrowthLevel,
    setCrazyLevel,

    setOldSoldierLevel,

    setIsEnableLuckDog,


    setLifeCount,

    setIsNotAttackLittleManTime,

    getNow,

    subExcitement,
    setFullHp,
    getBodyHp,
    getGirlFullHp,


    setGirlScaleAndKeepCamera,
    getGirlScale,
    setGirlScale,

    setPartColor,
    setAllColor,


    multiplyValue,
    dividValue,
    addValue,
    subValue,
    buildPercentDescription,
    limitValueNotExceedOne,

    addBuff,
    removeBuff,
    getUpgradeFuncs,
    setUpgradeFuncs,
    getUpgradeFuncsMod,
    applyUpgradeFuncsByRandomLevel,
    removeUpgradeFuncs,



    // getCharacterType,
    isLittleCharacterType,



    computeRatio,

    getLanguageDataByData,
    getLanguageTextData,
    getLanguageTextVariableData,

    languageKey: any,
    languageVariableKey: any,


    GiantessBuildUtils,
    LittleManBuildUtils,
    ArmyBuildUtils,

    usedGirlEnum,
    characterType,
}

export let buildFuncData = (state: state): funcData => {
    return {
        NullableUtils: NullableUtils,
        NumberUtils: NumberUtils,
        Flow: Flow,

        block: getBlockAPI(),

        getModAPI: getModAPI,

        getAbstractState: getAbstractState,
        setAbstractState: setAbstractState,


        isChinese: isChinese,
        isEnglish: isEnglish,

        getGirlValue: getGirlValue,
        hasGirlValue: hasGirlValue,

        getGirlMaxScale: getMaxScale,
        limitScale: limitScale,

        getConfigData,
        setConfigData,

        getValueByUsedGirl: getValueByUsedGirl,

        initClothHpData: initClothHpData,
        getGetClothHpDataFunc: getGetClothHpDataFunc,
        getAllUsedMMDData: getAllUsedMMDData,
        updateHpData: updateHpData,

        isArmy: isArmy,

        // getGirlName: getGirlName,
        isGirl: isGirl,

        destroyGiantess: destroyGiantess,

        getLittleManValue: getLittleManValue,
        getLittleManName: getLittleManName,

        getLittleManFullHp: getFullHp,
        setLittleManHp: setHp,

        setSavedStudyActions: setSavedStudyActions,
        getSavedStudyActions: getSavedStudyActions,
        setCurrentStudyActions: setGirlCurrentStudyActions,

        setMaxBiggerCount: setMaxBiggerCount,
        // getBiggerWay: 
        // switchBiggerWay: switchBiggerWay,
        studyActiveBigger: studyActiveBigger,
        // setMaxScale: setMaxScale,
        getEnhanceIncreaseScale: getEnhanceIncreaseScale,
        setBiggerEnhanceLevel: setBiggerEnhanceLevel,
        getEnhanceBiggerFullTime: getEnhanceBiggerFullTime,
        setExcitementFactorLevel: setExcitementFactorLevel,
        setDamageBiggerFactorLevel: setDamageBiggerFactorLevel,

        playSmallerAnimation: playSmallerAnimation,
        refreshBiggerTime: refreshBiggerTime,

        getScaleRatio: getScaleRatio,
        addScaleIncrease: addScaleIncrease,

        /*! temp compatible, need remove
        * 
        */
        addMinScale: addScaleIncrease,

        addInitialScale: addInitialScale,

        getBiggerTimeRatio: getBiggerTimeRatio,
        addBiggerTime: addBiggerTime,

        getDurationFactor: getDurationFactor,
        setDurationFactor: setDurationFactor,



        getLittleManCurrentStudyActions: getCurrentStudyActions,
        setLittleManCurrentStudyActions: setCurrentStudyActions,


        setArmyCountRatio: setArmyCountRatio,
        setEliteArmyCountRatio: setEliteArmyCountRatio,
        setEnemyDamageRatio: setEnemyDamageRatio,
        setRestoreHpRatio: setRestoreHpRatio,
        setEnemyHpRatio: setEnemyHpRatio,

        setEnhenceArmyLevel: setEnhenceArmyLevel,
        setEnhenceEliteGiantessLevel: setEnhenceEliteGiantessLevel,
        setEnhenceLevelGiantessLevel: setEnhenceLevelGiantessLevel,
        setEnhenceBossGiantessLevel: setEnhenceBossGiantessBossLevel,
        setMaxMMDGiantessCountLevel: setMaxMMDGiantessCountLevel,
        setIsAllowFriendDamage: setIsAllowFriendDamage,
        setIsRemoveMapEdgeZone: setIsRemoveMapEdgeZone,

        setDecreaseGenerateArmyIntervalRatio: setDecreaseGenerateArmyIntervalRatio,

        isSoldier: isSoldier,
        isMilltaryBuilding: isMilltaryBuilding,
        isMilltaryVehicle: isMilltaryVehicle,

        getIsApplying: getIsApplying,

        // getSoldierDefenseFactor: getSoldierDefenseFactor,
        // getMilltaryBuildingDefenseFactor: getMilltaryBuildingDefenseFactor,
        // getMilltaryVehicleDefenseFactor: getMilltaryVehicleDefenseFactor,
        // setSoldierDefenseFactor: setSoldierDefenseFactor,
        // setMilltaryBuildingDefenseFactor: setMilltaryBuildingDefenseFactor,
        // setMilltaryVehicleDefenseFactor: setMilltaryVehicleDefenseFactor,
        getEmitSpeedFactor: getEmitSpeedFactor,
        setEmitSpeedFactor: setEmitSpeedFactor,
        getCritRatioFactor: getCritRatioFactor,
        setCritRatioFactor: setCritRatioFactor,
        getAttackFactor: getAttackFactor,
        setAttackFactor: setAttackFactor,
        getDefenseFactor: getDefenseFactor,
        setDefenseFactor: setDefenseFactor,
        getMoveSpeed: getMoveSpeed,
        setMoveSpeed: setMoveSpeed,
        setIsNeedRefindPath: setIsNeedRefindPath,
        getHp: getHp,
        getFullHp: getFullHpLODQueueObjectUtils,
        setHp: setHpLODQueueObjectUtils,

        setInstanceColor: setInstanceColor,


        setIsEnableComboStorm: setIsEnableComboStorm,
        setClothDamageEnhanceLevel: setClothDamageEnhanceLevel,
        getClothDamageEnhanceRatio: getClothDamageEnhanceRatio,

        // getMoveAndStompDamageEnhanceRatio: getMoveAndStompDamageEnhanceRatio,
        // setMoveAndStompDamageEnhanceLevel: setMoveAndStompDamageEnhanceLevel,

        // getGetHpRatio: getGetHpRatio,
        // setFragileGrowthLevel: setFragileGrowthLevel,
        getDamageIncreaseRatio: getDamageIncreaseRatio,
        getEmitSpeedIncreaseRatio: getEmitSpeedIncreaseRatio,
        setCrazyLevel: setCrazyLevel,

        setOldSoldierLevel: setOldSoldierLevel,

        setIsEnableLuckDog: setIsEnableLuckDog,


        setLifeCount: setLifeCount,

        setIsNotAttackLittleManTime: setIsNotAttackLittleManTime,

        getNow: getNow,


        subExcitement: subExcitement,
        setFullHp: setFullHp,
        getBodyHp: getBodyHp,
        getGirlFullHp: getGirlFullHp,


        setGirlScaleAndKeepCamera: setGirlScaleAndKeepCamera,
        getGirlScale: getScale,
        setGirlScale: setGirlScale,

        setPartColor: setPartColor,
        setAllColor: setAllColor,


        multiplyValue: multiplyValue,
        dividValue: dividValue,
        addValue: addValue,
        subValue: subValue,
        buildPercentDescription: buildPercentDescription,
        limitValueNotExceedOne: limitValueNotExceedOne,

        addBuff: addBuff,
        removeBuff: removeBuff,
        getUpgradeFuncs: getUpgradeFuncs,
        setUpgradeFuncs: setUpgradeFuncs,
        getUpgradeFuncsMod: getUpgradeFuncsMod,
        applyUpgradeFuncsByRandomLevel: applyUpgradeFuncsByRandomLevel,
        removeUpgradeFuncs: removeUpgradeFuncs,


        // getCharacterType: getCharacterType,
        isLittleCharacterType: isLittleCharacterType,

        // getCurrentUsedGirl:


        computeRatio: computeRatio,


        getLanguageDataByData: getLanguageDataByData,
        getLanguageTextData: getLanguageTextData,
        getLanguageTextVariableData: getLanguageTextVariableData,

        languageKey: languageKey,
        languageVariableKey: languageVariableKey,

        GiantessBuildUtils,
        LittleManBuildUtils,
        ArmyBuildUtils,

        usedGirlEnum: usedGirlEnum,
        characterType: characterType,
    }
}