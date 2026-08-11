import * as BlockManager from "block/src/BlockManager"
import { language, state } from "../type/StateType"
import { blockName, blockProtocolName, blockService, blockState, getBlockService, info as infoBlockManager } from "block/src/BlockManagerType"
// import { buildAPI as buildBlockAPI } from "block/src/BlockManager"
import { getAbstractState, getBlockState, readState, setAbstractState, setBlockState as setBlockState_, writeState } from "../state/State"
import { modProtocolName } from "./data/ModData"
// import { blockProtocolName } from "./data/ModData"
// import {getBlockService, createBlockState} from "mmd-character-default/src/Main"
import * as SceneProtect from "scene-protect/src/Main"
import * as MMDCharacterDefault from "mmd-character-default/src/Main"
import * as MMDCharacterExtend from "mmd-character-extend/src/Main"
import * as SoundBackgroundDefault from "sound-background-default/src/Main"
import * as CareerDefault from "career-default/src/Main"
import * as CareerLittleManRandom from "career-littleman-random/src/Main"
import * as CareerGiantessRandom from "career-giantess-random/src/Main"
import * as CareerPeace from "career-peace/src/Main"
import * as CareerRunner from "career-runner/src/Main"
import * as CareerGiantessPleaser from "career-giantess-pleaser/src/Main"
import * as CareerMasochism from "career-masochism/src/Main"
import * as CareerFoodie from "career-foodie/src/Main"
import * as CareerDemon from "career-demon/src/Main"
import * as CareerLittleManBandit from "career-littleman-bandit/src/Main"
import * as CareerGiantessBandit from "career-giantess-bandit/src/Main"
import * as CareerSaver from "career-saver/src/Main"
import * as CareerFarmer from "career-farmer/src/Main"
import * as CareerEnterpriser from "career-enterpriser/src/Main"
import * as CareerDuelist from "career-duelist/src/Main"
import * as CareerWeaponWorkMan from "career-weaponworkman/src/Main"
import * as CareerVaginalCapture from "career-vaginalcapturer/src/Main"
import * as CareerCarry from "career-carry/src/Main"
import * as CareerAbsorber from "career-absorber/src/Main"
import * as CareerWetNurse from "career-wetnurse/src/Main"
import * as CareerSadism from "career-sadism/src/Main"
import * as CareerFootFetish from "career-footfetish/src/Main"
import * as SettingDefault from "setting-default/src/Main"
import * as SettingSound from "setting-sound/src/Main"
import * as MeleeGiantess from "enemy-elite-giantess-melee/src/Main"
import * as MagicGiantess from "enemy-elite-giantess-magic/src/Main"
import * as EliteGiantessShareDefault from "enemy-elite-giantess-share-default/src/Main"
import * as PropBulletBasic from "prop-bullet-basic/src/Main"
import * as PropBulletSubMachine from "prop-bullet-submachine/src/Main"
import * as PropBulletShot from "prop-bullet-shot/src/Main"
import * as PropBulletBigger from "prop-bullet-bigger/src/Main"
import * as PropBulletSmaller from "prop-bullet-smaller/src/Main"
import * as WeaponLittleManSwiping from "weapon-little-man-swiping/src/Main"
import * as WeaponKickLight from "weapon-kicklight/src/Main"
import * as WeaponStompLight from "weapon-stomplight/src/Main"
import * as WeaponStompHeavy from "weapon-stompheavy/src/Main"
import * as WeaponMagicAttack1 from "weapon-magicattack1/src/Main"
import * as WeaponWalk from "weapon-walk/src/Main"
import * as ParticleEffectInjureDamage from "particle-effect-injure-damage/src/Main"
import * as ParticleEffectUpgrade from "particle-effect-upgrade/src/Main"
import * as ParticleEffectHitBlur from "particle-effect-hit-blur/src/Main"
import * as ParticleEffectHitCharm from "particle-effect-hit-charm/src/Main"
import * as ParticleEffectHitCrippled from "particle-effect-hit-crippled/src/Main"
import * as ParticleEffectHitExcitement from "particle-effect-hit-excitement/src/Main"
import * as ParticleEffectHitPoisonSingle from "particle-effect-hit-poisonsingle/src/Main"
import * as ParticleEffectHitInjureSingle from "particle-effect-hit-injuresingle/src/Main"
// import * as ParticleEffectHitFragileGrowth from "particle-effect-hit-fragilegrowth/src/Main"
import * as ParticleEffectHitDecreaseScale from "particle-effect-hit-decreasescale/src/Main"
import * as ParticleEffectHitIceSingle from "particle-effect-hit-icesingle/src/Main"
import * as ParticleEffectHitExplodeSingle from "particle-effect-hit-explodesingle/src/Main"
import * as ParticleBulletEmitSubMachine from "particle-bullet-emit-submachine/src/Main"
import * as ParticleBulletHitSubMachine from "particle-bullet-hit-submachine/src/Main"
import * as ParticleBulletEmitBasic from "particle-bullet-emit-basic/src/Main"
import * as ParticleBulletHitBasic from "particle-bullet-hit-basic/src/Main"
import * as ParticleBulletEmitShot from "particle-bullet-emit-shot/src/Main"
import * as ParticleBulletHitShot from "particle-bullet-hit-shot/src/Main"
import * as ParticleBulletEmitFireball from "particle-bullet-emit-fireball/src/Main"
import * as ParticleBulletHitFireball from "particle-bullet-hit-fireball/src/Main"
import * as ParticleBulletEmitBigger from "particle-bullet-emit-bigger/src/Main"
import * as ParticleBulletEmitSmaller from "particle-bullet-emit-smaller/src/Main"
import * as ParticleBillboardExplodeRange from "particle-billboard-explode-range/src/Main"
import * as ParticleBillboardIceOverwrite from "particle-billboard-ice-overwrite/src/Main"
import * as ParticleShareDefault from "particle-share-default/src/Main"
import * as BuffGiantessHard from "buff-giantess-hard/src/Main"
import * as BuffGiantessSmallerWater from "buff-giantess-smallerwater/src/Main"
import * as BuffGiantessEat from "buff-giantess-eat/src/Main"
import * as BuffGiantessAbsorb from "buff-giantess-absorb/src/Main"
import * as BuffLittleManMasochism from "buff-littleman-masochism/src/Main"
import * as BuffGiantessMasochism from "buff-giantess-masochism/src/Main"
import * as BuffGiantessSadism from "buff-giantess-sadism/src/Main"
import * as BuffArmySadism from "buff-army-sadism/src/Main"
import * as BuffLittleManExcitementIncreaseAttack from "buff-littleman-excitement-increaseattack/src/Main"
import * as BuffEmitDefenseIncreaseDefense from "buff-emit-defense-increasedefense/src/Main"
import * as BuffArmyIncreaseDefense from "buff-army-increasedefense/src/Main"
import * as BuffLittleManIncreaseDefense from "buff-littleman-increasedefense/src/Main"
import * as BuffGiantessIncreaseDefense from "buff-giantess-increasedefense/src/Main"
import * as BuffEmitBackStab from "buff-emit-backstab/src/Main"
import * as BuffEmitHpRatio from "buff-emit-hpratio/src/Main"
import * as BuffEmitHpRatioInverse from "buff-emit-hpratio-inverse/src/Main"
import * as BuffEmitShootDistanceInverse from "buff-emit-shoot-distance-inverse/src/Main"
import * as BuffEmitShootDistanceDirect from "buff-emit-shoot-distance-direct/src/Main"
import * as BuffEmitPull from "buff-emit-pull/src/Main"
import * as BuffEmitDecreaseScale from "buff-emit-decreasescale/src/Main"
import * as BuffEmitDefenseDoorShield from "buff-emit-defense-doorshield/src/Main"
import * as BuffEmitFragileGrowth from "buff-emit-fragilegrowth/src/Main"
import * as BuffEmitCrippled from "buff-emit-crippled/src/Main"
import * as BuffArmyCrippled from "buff-army-crippled/src/Main"
import * as BuffLittleManCrippled from "buff-littleman-crippled/src/Main"
import * as BuffEmitCharm from "buff-emit-charm/src/Main"
import * as BuffArmyCharm from "buff-army-charm/src/Main"
import * as BuffLittleManCharm from "buff-littleman-charm/src/Main"
import * as BuffEmitBlur from "buff-emit-blur/src/Main"
import * as BuffArmyBlur from "buff-army-blur/src/Main"
import * as BuffLittleManBlur from "buff-littleman-blur/src/Main"
import * as BuffEmitExcitement from "buff-emit-excitement/src/Main"
import * as BuffArmyExcitement from "buff-army-excitement/src/Main"
import * as BuffLittleManExcitement from "buff-littleman-excitement/src/Main"
import * as BuffArmyStressProtect from "buff-army-stressprotect/src/Main"
import * as BuffEmitDefenseStressProtect from "buff-emit-defense-stressprotect/src/Main"
import * as BuffEmitPoisonSingle from "buff-emit-poison-single/src/Main"
import * as BuffLittleManPoisonSingle from "buff-littleman-poison-single/src/Main"
import * as BuffEmitIceSingle from "buff-emit-ice-single/src/Main"
import * as BuffLittleManIceSingle from "buff-littleman-ice-single/src/Main"
import * as BuffEliteGiantessDamageBigger from "buff-elite-giantess-damagebigger/src/Main"
import * as BuffEliteGiantessPassiveBigger from "buff-elite-giantess-passivebigger/src/Main"
import * as BuffLittleManStressProtect from "buff-littleman-stressprotect/src/Main"
import * as BuffGiantessStressProtect from "buff-giantess-stressprotect/src/Main"
import * as BuffBossStressProtect from "buff-bossstatus-stressprotect/src/Main"
import * as BuffPlayerStatusDamageBigger from "buff-playerstatus-damagebigger/src/Main"
import * as BuffPlayerStatusPassiveBigger from "buff-playerstatus-passivebigger/src/Main"
import * as BuffBossStatusDamageBigger from "buff-bossstatus-damagebigger/src/Main"
import * as BuffBossStatusPassiveBigger from "buff-bossstatus-passivebigger/src/Main"
import * as BuffArmyIceOverwrite from "buff-army-ice-overwrite/src/Main"
import * as BuffArmyIceSingle from "buff-army-ice-single/src/Main"
import * as BuffArmyPoisonSingle from "buff-army-poison-single/src/Main"
import * as BuffArmyInjureSingle from "buff-army-injure-single/src/Main"
import * as BuffGiantessIceOverwrite from "buff-giantess-ice-overwrite/src/Main"
import * as BuffGiantessIceSingle from "buff-giantess-ice-single/src/Main"
import * as BuffGiantessPoisonSingle from "buff-giantess-poison-single/src/Main"
import * as BuffGiantessInjureSingle from "buff-giantess-injure-single/src/Main"
import * as BuffStrong from "buff-strong/src/Main"
import * as BuffRun from "buff-run/src/Main"
import * as BuffCallGoddess from "buff-callgoddess/src/Main"
import * as BuffExcitementGirl from "buff-excitement-girl/src/Main"
import * as BuffExcitementLevelGiantess from "buff-excitement-level-giantess/src/Main"
import * as BuffTiredGirl from "buff-tired-girl/src/Main"
import * as BuffTiredLevelGiantess from "buff-tired-level-giantess/src/Main"
import * as BuffHolyWater from "buff-holywater/src/Main"
import * as BuffGiantessStimulator from "buff-giantessstimulator/src/Main"
import * as BuffGiantessController from "buff-giantesscontroller/src/Main"
import * as UpgradeAssistantAddMaxExcitement from "upgrade-assistant-addmaxexcitement/src/Main"
import * as UpgradeOtherIncreasePickPropRange from "upgrade-other-increasepickproprange/src/Main"
import * as UpgradeOtherAddBullet from "upgrade-other-addbullet/src/Main"
import * as UpgradeOtherPartialScaleBreast from "upgrade-other-partialscale-breast/src/Main"
import * as UpgradeOtherPartialScaleTorsor from "upgrade-other-partialscale-torsor/src/Main"
import * as UpgradeOtherDamagedPartialScaleBreast from "upgrade-other-damaged-partialscale-breast/src/Main"
import * as UpgradeDefenseIncreaseDefense from "upgrade-defense-increasedefense/src/Main"
import * as UpgradeAttackBackStab from "upgrade-attack-backstab/src/Main"
import * as UpgradeAttackHpRatio from "upgrade-attack-hpratio/src/Main"
import * as UpgradeAttackHpRatioInverse from "upgrade-attack-hpratio-inverse/src/Main"
import * as UpgradeAttackShootDistanceInverse from "upgrade-attack-shoot-distance-inverse/src/Main"
import * as UpgradeAttackShootDistanceDirect from "upgrade-attack-shoot-distance-direct/src/Main"
import * as UpgradeAttackPull from "upgrade-attack-pull/src/Main"
import * as UpgradeAttackDecreaseScale from "upgrade-attack-decreasescale/src/Main"
import * as UpgradeDefenseDoorShield from "upgrade-defense-doorshield/src/Main"
import * as UpgradeDefenseLimitDamage from "upgrade-defense-limitdamage/src/Main"
import * as UpgradeDefenseStressProtect from "upgrade-defense-stressprotect/src/Main"
import * as UpgradeDefenseBuQu from "upgrade-defense-buqu/src/Main"
import * as UpgradeDefenseDecreaseDamageWhenLie from "upgrade-defense-decreasedamage-whenlie/src/Main"
import * as UpgradeDefenseIncreaseStrongWhenMeleeAttack from "upgrade-defense-increasestrong-whenmeleeattack/src/Main"
import * as UpgradeDefenseDecreaseStressingRate from "upgrade-defense-decreasestressingrate/src/Main"
import * as UpgradeSkillEnhenceBreastPressRubCharm from "upgrade-skill-enhence-breastpressrub-charm/src/Main"
import * as UpgradeSkillEnhenceBreastPressRubPutToBreast from "upgrade-skill-enhence-breastpressrub-puttobreast/src/Main"
import * as UpgradeSkillEnhenceSitRubCharm from "upgrade-skill-enhence-sitrub-charm/src/Main"
import * as UpgradeSkillEnhenceSitRubInsert from "upgrade-skill-enhence-sitrub-insert/src/Main"
import * as UpgradeSkillEnhenceStompRubPutToShoe from "upgrade-skill-enhence-stomprub-puttoshoe/src/Main"
import * as UpgradeSkillEnhencePutToBreastCharm from "upgrade-skill-enhence-puttobreast-charm/src/Main"
import * as UpgradeSkillEnhenceThrustExcitement from "upgrade-skill-enhence-thrust-excitement/src/Main"
import * as UpgradeSkillEnhenceCrawlLickEat from "upgrade-skill-enhence-crawllick-eat/src/Main"
import * as UpgradeSkillEnhenceCrawlLickBlur from "upgrade-skill-enhence-crawllick-blur/src/Main"
import * as UpgradeSkillEnhencePutToShoeBlur from "upgrade-skill-enhence-puttoshoe-blur/src/Main"
import * as UpgradeSkillEnhenceJumpStompCrippled from "upgrade-skill-enhence-jumpstomp-crippled/src/Main"
import * as UpgradeSkillEnhencePinchCrippled from "upgrade-skill-enhence-pinch-crippled/src/Main"
import * as UpgradeSkillEnhenceStompCrippled from "upgrade-skill-enhence-stomp-crippled/src/Main"
import * as UpgradeSkillEnhenceSitRotate from "upgrade-skill-enhence-sit-rotate/src/Main"
import * as UpgradeSkillEnhenceStompRotate from "upgrade-skill-enhence-stomp-rotate/src/Main"
import * as UpgradeSkillEnhenceRunRepel from "upgrade-skill-enhence-run-repel/src/Main"
import * as UpgradeSkillFragileGrowth from "upgrade-skill-fragilegrowth/src/Main"
import * as UpgradeSkillDamageBigger from "upgrade-skill-damagebigger/src/Main"
import * as UpgradeSkillPassiveBigger from "upgrade-skill-passivebigger/src/Main"
import * as UpgradeSkillLearnRun from "upgrade-skill-learn-run/src/Main"
import * as UpgradeSkillJumpStomp from "upgrade-skill-jumpstomp/src/Main"
import * as UpgradeSkillLeftStomp from "upgrade-skill-leftstomp/src/Main"
import * as UpgradeSkillStompRub from "upgrade-skill-stomprub/src/Main"
import * as UpgradeSkillSit from "upgrade-skill-standtosit-sittostand/src/Main"
import * as UpgradeSkillSitRub from "upgrade-skill-sitrub/src/Main"
import * as UpgradeSkillTightenLeg from "upgrade-skill-tightenleg/src/Main"
import * as UpgradeSkillUB from "upgrade-skill-picktoub-ubtopick/src/Main"
import * as UpgradeSkillThrust from "upgrade-skill-thrust/src/Main"
import * as UpgradeSkillInsert from "upgrade-skill-insert/src/Main"
import * as UpgradeSkillPutToBreast from "upgrade-skill-puttobreast/src/Main"
import * as UpgradeSkillPutToShoe from "upgrade-skill-puttoshoe/src/Main"
import * as UpgradeSkillFreeBreast from "upgrade-skill-freebreast/src/Main"
import * as UpgradeSkillFreeShoe from "upgrade-skill-freeshoe/src/Main"
import * as UpgradeSkillFreeUB from "upgrade-skill-freeub/src/Main"
import * as UpgradeSkillBreastPress from "upgrade-skill-breast-press/src/Main"
import * as UpgradeSkillBreastPressRub from "upgrade-skill-breast-press-rub/src/Main"
import * as UpgradeSkillCrawlBeat from "upgrade-skill-crawl-beat/src/Main"
import * as UpgradeSkillCrawlLick from "upgrade-skill-crawl-lick/src/Main"
import * as UpgradeSkillSprayMilk from "upgrade-skill-spray-milk/src/Main"
import * as UpgradeSkillIceOverwrite from "upgrade-skill-ice-overwrite/src/Main"
import * as UpgradeSkillIceSingle from "upgrade-skill-ice-single/src/Main"
import * as UpgradeSkillExplodeRange from "upgrade-skill-explode-range/src/Main"
import * as UpgradeSkillExplodeSingle from "upgrade-skill-explode-single/src/Main"
import * as UpgradeSkillPoisonSingle from "upgrade-skill-poison-single/src/Main"
import * as UpgradeSkillInjureSingle from "upgrade-skill-injure-single/src/Main"
import * as UpgradeDefenseStressingDecreaseDamage from "upgrade-defense-stressing-decreasedamage/src/Main"
// import * as PropOtherUseArtifact from "prop-other-use-artifact/src/Main"
import * as PropOtherUseGiantessCharacter from "prop-other-use-giantesscharacter/src/Main"
import * as PropOtherSmallerWater from "prop-other-smallerwater/src/Main"
import * as PropOtherCapture from "prop-other-capture/src/Main"
import * as PropOtherStrong from "prop-other-strong/src/Main"
import * as PropOtherRun from "prop-other-run/src/Main"
import * as PropOtherHolyWater from "prop-other-holywater/src/Main"
import * as PropShareDefault from "prop-share-default/src/Main"
import * as PropArtifactRestoreCloth from "prop-artifact-restorecloth/src/Main"
import * as PropArtifactInfinityBig from "prop-artifact-infinitybig/src/Main"
import * as PropArtifactCallGoddess from "prop-artifact-callgoddess/src/Main"
import * as PropArtifactGiantessStimulator from "prop-artifact-giantessstimulator/src/Main"
import * as PropArtifactGiantessController from "prop-artifact-giantesscontroller/src/Main"
import * as PropArtifactSpecificGiantess from "prop-artifact-specificgiantess/src/Main"
import * as PropArtifactMissionComplete from "prop-artifact-missioncomplete/src/Main"
// import * as BehaviourPlayerGoddess from "behaviour-playergoddess/src/Main"
import * as BehaviourBalance from "behaviour-balance/src/Main"
// import * as BehaviourAttackPlayerGiantess from "behaviour-attack-playergiantess/src/Main"
// import * as BehaviourProtectPlayerGiantess from "behaviour-protect-playergiantess/src/Main"
// import * as BehaviourProtectPlayerGoddess from "behaviour-protect-playergoddess/src/Main"
// import * as BehaviourProtectLevelGiantess1 from "behaviour-protect-level-giantess1/src/Main"
// import * as BehaviourProtectLevelGiantess2 from "behaviour-protect-level-giantess2/src/Main"
import * as EventGameHard from "event-game-hard/src/Main"
import * as EventGameCallGoddess from "event-game-callgoddess/src/Main"
import * as EventGameAttackCallGiantess from "event-game-attack-callgiantess/src/Main"
import * as EventGameProtectCallGiantess from "event-game-protect-callgiantess/src/Main"
import * as EventGameProtectCallGoddess from "event-game-protect-callgoddess/src/Main"
import * as EventGameProtectEliteGiantess from "event-game-protect-elite-giantess/src/Main"
import * as EventGameProtectArmy from "event-game-protect-army/src/Main"
import * as EventGameProtectLevelGiantess1 from "event-game-protect-level-giantess1/src/Main"
import * as EventGameProtectLevelGiantess2 from "event-game-protect-level-giantess2/src/Main"
import * as FSMGirlExcitement from "fsm-girl-excitement/src/Main"
import * as FSMLevelGiantessExcitement from "fsm-level-giantess-excitement/src/Main"
import * as FSMGirlClimax from "fsm-girl-climax/src/Main"
import * as FSMLevelGiantessClimax from "fsm-level-giantess-climax/src/Main"
import * as FSMLittleManFall from "fsm-littleman-fall/src/Main"
import * as FSMLittleManRepel from "fsm-littleman-repel/src/Main"
import * as LevelGiantessPlayerGiantess from "level-giantess-playergiantess/src/Main"
import * as LevelGiantessProtectBoss1 from "level-giantess-protect-boss1/src/Main"
import * as LevelGiantessProtectBoss2 from "level-giantess-protect-boss2/src/Main"
import * as SkillLittleManSwiping from "skill-little-man-swiping/src/Main"
import * as SkillLittleManFastRun from "skill-little-man-fastrun/src/Main"
import * as SkillGiantessStomp from "skill-giantess-stomp/src/Main"
import * as SkillGiantessStompRub from "skill-giantess-stomp-rub/src/Main"
import * as SkillGiantessLeftStomp from "skill-giantess-left-stomp/src/Main"
import * as SkillGiantessJumpStomp from "skill-giantess-jump-stomp/src/Main"
import * as SkillGiantessKeepSit from "skill-giantess-keep-sit/src/Main"
import * as SkillGiantessStandToSit from "skill-giantess-stand-to-sit/src/Main"
import * as SkillGiantessSitToStand from "skill-giantess-sit-to-stand/src/Main"
import * as SkillGiantessSitRub from "skill-giantess-sit-rub/src/Main"
import * as SkillGiantessSitTightenLeg from "skill-giantess-sit-tightenleg/src/Main"
import * as SkillGiantessSitHeavyStressing from "skill-giantess-sit-heavystressing/src/Main"
import * as SkillGiantessSitHeavyStressingBreast from "skill-giantess-sit-heavystressing-breast/src/Main"
import * as SkillGiantessSitHeavyStressingTrigoneAndButt from "skill-giantess-sit-heavystressing-trigoneandbutt/src/Main"
import * as SkillGiantessSitDeath from "skill-giantess-sit-death/src/Main"
import * as SkillGiantessKeepUB from "skill-giantess-keep-ub/src/Main"
import * as SkillGiantessPickToUB from "skill-giantess-pick-to-ub/src/Main"
import * as SkillGiantessUBToPick from "skill-giantess-ub-to-pick/src/Main"
import * as SkillGiantessThrust from "skill-giantess-thrust/src/Main"
import * as SkillGiantessInsert from "skill-giantess-insert/src/Main"
import * as SkillGiantessPutToBreast from "skill-giantess-put-to-breast/src/Main"
import * as SkillGiantessPutToShoe from "skill-giantess-put-to-shoe/src/Main"
import * as SkillGiantessFreeUB from "skill-giantess-free-ub/src/Main"
import * as SkillGiantessFreeBreast from "skill-giantess-free-breast/src/Main"
import * as SkillGiantessFreeShoe from "skill-giantess-free-shoe/src/Main"
import * as SkillGiantessUBHeavyStressing from "skill-giantess-ub-heavystressing/src/Main"
import * as SkillGiantessBreastPress from "skill-giantess-breast-press/src/Main"
import * as SkillGiantessBreastPressRub from "skill-giantess-breast-press-rub/src/Main"
import * as SkillGiantessCrawlBeat from "skill-giantess-crawl-beat/src/Main"
import * as SkillGiantessCrawlLick from "skill-giantess-crawl-lick/src/Main"
import * as SkillGiantessSprayMilk from "skill-giantess-spray-milk/src/Main"
import * as InteractionBlessGirl from "interaction-blessgirl/src/Main"
import * as InteractionWeaponGirl from "interaction-weapongirl/src/Main"
import { api } from "type-api/src/Type"
import { Device, StateMachine } from "meta3d-jiehuo-abstract"
import { Box3, Color, DoubleSide, FrontSide, Matrix4, NoBlending, Quaternion, Triangle, Vector2, Vector3 } from "three"
import { getParticleNeedCollisionCheckLoopCount, getStateMachineUtils, handleHitArmy, healArmy } from "../script/scene/scene_city/utils/ArmyUtils2"
import { particleNeedCollisionCheckLoopFrames, usedGirlEnum } from "../script/scene/scene_city/type/StateType"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { Loader } from "meta3d-jiehuo-abstract"
import { List } from "immutable"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getIsDebug, getIsProduction, getLanguage, isChinese, isEnglish } from "../script/scene/Scene"
import { buildFakeGirlWeaponValue, computeGirlBoxAndNotChangeCenterXY, computeGirlBoxAndSetToState, computeHeight, computeScaleByBox, getActualHeight, getBreastVolumnFactor, getDamageTypeFactor, getForceFactor, getGiantessCamp, getGirlBox, getGirlPosition, getGirlRotation, getHeightByScale, getMaxScale, getPivotWorldPosition, getPositionParrelToObj, getSkillStateFactor, isBigGiantess, isMiddleGiantessOrBiggerByScale, setGirlPosition, updatePosition as updatePositionGirl, } from "../script/scene/scene_city/girl/Utils"
import { getValueByUsedGirl, isGirl, isLevelGiantess, getValue as getGirlValue, setNeedUpdateStatusName, getCurrentMMDCharacterName, triggerAction, getExcitement, getBiggerCount, hasGirlValue, isEnemyGiantess, getCurrentMMDCharacterNameByUsedGirl, initWhenImportScene as initWhenImportSceneGirl, update as updateGirl, isPlayerGoddess, isLevelGiantessExceptPlayer, isTriggerAction, isPlayerGiantess, changeToInitialScale, computeAttenuationByHeightForEffect, setAddHitEffectFunc as setAddHitEffectFuncGirl, removeAddHitEffectFunc as removeAddHitEffectFuncGirl, isUseGirl, isPlayerGirl, setGirlScaleAndKeepCamera, getBodyHp as getGirlBodyHp, getFullHp as getGirlFullHp, setGiantessStressingRate, limitScale as limitScaleGirl, getCenter, isGiantessExceptPlayer, isBossGiantess, getMovableRanges as getMovableRangesGirl, isBack as isBackGirl, setGirlScaleByDeferTimeout0, getLabelTime, isPlayerGirlOrGiantess, isActionState as isActionStateGirl, getGirl, resetAction, setBreastPartialScaleMaxFactor, setTorsorPartialScaleMaxFactor, getUsedGirlByName, getCurrentUsedGirls, buildNameByUsedGirl, hasLevelGiantessExceptPlayer, hasUsedGirl, getUsedGirlData, hasLevelGiantessExceptPlayerGirl, getNeedUpdateStatusName, isMMDCharacterExist } from "../script/scene/scene_city/girl/Girl"
import { buildArmyRewardKey, buildFakeBulletParticle, checkRangeBoxCollisionWithArmy, computeAttackFrames, computeRemainAttackFrames, createMoveState, getAllAliveArmyData, getAllAliveArmyExceptEliteGiantessCount, getAllAliveEliteGiantessCount, getShootDirection, getTargetDataForSoldier, handleAllCollisions, handleCollision, handleDestroyed, handleDestroying, isArmy, isBack, isCanNotAttackByCD, isCreature, updateEliteGiantessAI, updatePosition, updatePositionByName } from "../script/scene/scene_city/utils/ArmyUtils"
import { getArmyValueForAttack } from "../script/scene/scene_city/manage/city1/soldier/utils/CommanderUtils"
import { getEmitSpeedFactor, setDefenseFactor, setMoveSpeed, setAttackFactor, setEmitSpeedFactor, setCritRatioFactor, disposeData, computeEliteGiantessMoveSpeed, getMoveSpeed } from "../script/scene/scene_city/StaticDynamicUnit"
import { isChangeToLieState, createStressingState, createDestroyingState, buildBloodDecalQueue, createBloodData, checkCurrentState, handlePickdown, handleExitControlled as handleCharacterExitControlled } from "../script/scene/scene_city/utils/CharacterUtils"
import { generateCharacterCrowd, getMiddleDistance, getNearDistance, parseCharacterQueue } from "../script/scene/scene_city/manage/city1/WholeScene"
import { clearAttackTargetObjectOrBuilding, getAttackTarget, getAttackTargetObjectData, getAttackTargetUsedGirl, getCampExn, getGetPositionYFuncDefaultKey, getIsEliteGiantessAttacking, getPositionY, getUpdateLittleManWeaponFunc, setAddHitEffectFunc, setAttackTarget, setAttackTargetObjectDataByVisibleData, setAttackTargetUsedGirl, setCamp, setIsEliteGiantessAttacking, setLastAttackFrame, setUpdateLittleManWeaponFunc } from "../script/scene/scene_city/manage/city1/Army"
import { addBoneGroup, setBonePositionOffset } from "../script/scene/scene_city/utils/BoneUtils"
import { getConfigData, getGirlScale, getPinchCharacterSoundResourceId, getScene, getSceneChapter, isBossLevel, isCharacterType, isGiantessCharacterType, isGiantessCharacterTypeByUsedGirl, isLittleCharacterType, isSceneChapter, restoreCameraFromSavedData, setBehaviourTreeData, setCharacterType, setCollisionShapeData, setConfigData, setGameEventData, setGameEventDirectorData, setGirlScale, setGirlValue, setLittleManActionState, setScenaryData } from "../script/scene/scene_city/CityScene"
import { getGiantessVolume, getGirlVolume, getLittleManVolume, getOriginSystemVolume, getSystemVolume, getVolume, playGiantessVoice } from "../script/scene/scene_city/utils/SoundUtils"
import { addBox3Helper, isMaxArmySpeed } from "../script/scene/scene_city/utils/ConfigUtils"
import { getGiantessPutToBreastTransformFunc, getGiantessPutToShoeTransformFunc, getGiantessTransformFunc, getGiantessUBControlledTransformFunc, getPickTransformPrefix, getPutToBreastBox, getPutToBreastTransformPrefix, getPutToShoeBox, getPutToShoeTransformPrefix, getUBBox, getUBControlledTransformPrefix } from "../script/scene/scene_city/utils/SkeletonUtils"
import { getEnhenceEliteGiantessLevel, getEnhenceLevelGiantessLevel, getIsAllowFriendDamage, isExceedMaxMMDGiantessCountAfterAdd, isNotGenerateArmy, isNotGenerateEliteArmy, updateArmyValue, updateEliteGiantessValue, updateEliteGiantessValueDefault, updateEnemyGiantessValue, updateLevelGiantessValue, updateWildGiantessValue } from "../script/scene/scene_city/difficulty/HeatImplementer"
import { buildDownDirection, buildRandomDirectionInXZ, buildUpDirection, computeDirectionInXZ } from "../utils/DirectionUtils"
import { computeTimeSecond } from "../script/scene/scene_city/utils/AnimationUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import * as DamageUtils from "../script/scene/scene_city/utils/DamageUtils"
import { ModelLoader } from "meta3d-jiehuo-abstract"
import { Collision } from "meta3d-jiehuo-abstract"
import { GPUSkin } from "meta3d-jiehuo-abstract"
import { Flow } from "meta3d-jiehuo-abstract"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { generateArmy, generateCommanders, generateFlameVehicles, generateInfantrys, generateLaserers, generateMelees, generateMissileVehicles, generateRocketeers, generateTanks, getPointBoxForBullet, getPointBoxForParticle } from "../script/scene/scene_city/manage/city1/ArmyManager"
import { LOD } from "meta3d-jiehuo-abstract"
import { isBreastControlledState, isControlledState, isDestoryRelatedStates, isFallState, isLieState, isPickedControlledState, isRepelState, isShoeControlledState, isStressingState, isUBControlledState } from "../script/scene/scene_city/utils/FSMStateUtils"
import { getCollisionPartCenter, getCollisionPartOBB, queryAllOBBShapesCollisionWithBox, queryBoxShapeCollision, queryOBBShapeCollision, queryOBBShapeCollisionWithBox } from "../script/scene/scene_city/girl/Collision"
import { getBoxForPick, getLocalTransform, getPickObjectBox, getPickObjectData, getUBObjectData, hasPickData, removePickData, updateTransform, updateUBControlledTransform, updatePutToBreastTransform, getPutToBreastObjectData, updatePutToShoeTransform, getPutToShoeObjectData, getPickObjectTotalBoxVolume, isUBed, isControlled } from "../script/scene/scene_city/girl/PickPoseUtils"
import { changeStandBoxToLieBox } from "../script/scene/scene_city/utils/LieUtils"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import { fixGiantessModelMaterial } from "../script/scene/scene_city/utils/MaterialUtils"
import { createState as createBulletState } from "meta3d-jiehuo-abstract/src/particle/BulletEmitter"
import { buildParticleId, generateId } from "meta3d-jiehuo-abstract/src/particle/IDUtils"
import { getAllEmitParticlesForCollisionCheck, setNeedCollisionCheckLoopCount } from "meta3d-jiehuo-abstract/src/particle/ParticleManager"
import { buildOffsetParticle, buildRepeatOffsetParticle, getCurrentFrameImageData } from "meta3d-jiehuo-abstract/src/particle/ParticleUtils"
import { addGun } from "../script/scene/scene_city/little_man/InitWhenImportScene"
import { disposeGeometry } from "meta3d-jiehuo-abstract/src/scene/utils/DisposeUtils"
import { addBuff, buildDescriptionWithCharacterType, disposeEnemyData, findBuff, findBuffData, hasBuff, removeBuff } from "../script/scene/scene_city/buff/Buff"
import { getName as getLittleManName, getValue as getLittleManValue, getFullHp as getLittleManFullHp, getHp as getLittleManHp, addHp as addLittleManHp, setHp as setLittleManHp, initWhenImportScene as initWhenImportSceneLittleMan, update as updateLittleMan, getStateMachine, getBox, getMaxActuallMoveSpeed, isLittleMan, isBack as isBackLittleMan, getHpIncrease, setHpIncrease, getMovableRanges, isBurstFire, handleExitControlled, setStateMachine } from "../script/scene/scene_city/little_man/LittleMan"
import { getPropCount, subPropCount } from "../script/scene/scene_city/reward/Prop"
import { convertSToMs, getNow, getPassTimeFromNow } from "../script/scene/scene_city/Time"
import * as GiantessBuildUtils from "../script/scene/scene_city/utils/build/GiantessBuildUtils"
import * as LittleManBuildUtils from "../script/scene/scene_city/utils/build/LittleManBuildUtils"
import { buildFuncData } from "../script/scene/scene_city/data/FuncData"
import { computeIncreaseFactor, getIsApplying, getLevelByCharacter, increaseGirlAttribute, isStudy, setExperienceValue, updateGiantessItem } from "../script/scene/scene_city/build/Upgrade"
import { trigger, dispose as disposeGameEventDirector, initWhenImportScene as initWhenImportSceneGameEventDirector, triggerByFilter } from "../script/scene/scene_city/director/GameEventDirector"
import { addImpendingGameEventData, addInstantGameEventData } from "../script/scene/scene_city/director/utils/GameEventDirectorUtils"
import { getCommand, markBegin, markFinish, realtimeSay, selectValidGTSPoint } from "../script/scene/scene_city/scenario/Command"
import { addPlayerGoddess } from "../script/scene/scene_city/girl/player_goddess/Girl"
import { getLookatQuaternion, getScaleFromMatrix4, setScaleToMatrix4 } from "meta3d-jiehuo-abstract/src/utils/TransformUtils"
import { getPlayerCamp, getPlayerHeight, getPlayerName, getPlayerNamesByCharacterType, getPlayerNamesByIsUseCareerFeature, getPlayerPosition, isNearObject, isNearPlayer, isPlayer, isPlayerByCharacterType, isPlayerGiantess as isPlayerGiantessPlayer } from "../script/scene/scene_city/utils/PlayerUtils"
import { buildTree, clearTarget, getKey, getVeryNearestTargetCount, getSettingFactorAffectBiggerRate, getTarget, hasTarget, isBuildingTarget, markWhetherNotExecuteGiantessAI, setTarget, wrapActionNode, getAttackAction, getLastChangePoseTime, setLastChangePoseTime, initWhenImportScene as initWhenImportSceneBehaviourTreeManager, resetFinish, getNearTargets, getPersonality, getLastSetTargetTime, setLastSetTargetTime, setPersonality, getAllPersonalities, resetAllFinish } from "../script/scene/scene_city/behaviour_tree/BehaviourTreeManager"
import { isRandomRate } from "meta3d-jiehuo-abstract/src/utils/NumberUtils"
import { getCurrentPose, isPose, resetPose, changePose as changePose_ } from "../script/scene/scene_city/girl/Pose"
import { getDefaultAllCollisionParts, getNearGirlDistance, getNearestUsedGirl, isCharacter, isInGirlAttackRange, isMiddleDistanceFromGirl, isNearGirl, isRigidBody, isSmallDistanceFromGirl, isVehicle, isVeryNearGirl, setAllCollisionParts } from "../script/scene/scene_city/utils/CollisionUtils"
// import { selectTarget as selectTargetAction } from "../script/scene/scene_city/behaviour_tree/action_node/PlayerGoddessSelectTarget"
import { walkToTarget } from "../script/scene/scene_city/behaviour_tree/action_node/WalkToTarget"
import { rest } from "../script/scene/scene_city/behaviour_tree/action_node/Rest"
import { stomp } from "../script/scene/scene_city/behaviour_tree/action_node/Stomp"
import { breastPress } from "../script/scene/scene_city/behaviour_tree/action_node/BreastPress"
import { pickup } from "../script/scene/scene_city/behaviour_tree/action_node/Pickup"
import { pickdown } from "../script/scene/scene_city/behaviour_tree/action_node/Pickdown"
import { pinch } from "../script/scene/scene_city/behaviour_tree/action_node/Pinch"
import { eat } from "../script/scene/scene_city/behaviour_tree/action_node/Eat"
import { bigger } from "../script/scene/scene_city/behaviour_tree/action_node/Bigger"
import { computeAnimatonDurationFactor, getCurrentAnimationName, isChangeScaling, playSmallerAnimation } from "../script/scene/scene_city/girl/Animation"
import { clearTarget as clearTargetAction } from "../script/scene/scene_city/behaviour_tree/action_node/ClearTarget"
import { changePose } from "../script/scene/scene_city/behaviour_tree/action_node/ChangePose"
import { getLanguageDataByData } from "../internation/Data"
// import { disposeAllBuffMods } from "./BuffMod"
import { isChangeCrawlPoseState, getStateMachine as getStateMachineGirl, setStateMachine as setStateMachineGirl } from "../script/scene/scene_city/girl/FSMState"
import { computeCoinByItemPriceFactor, findRewardData, generateReward, getTotalCoin, mergeAllRewardData, mergeRewardData } from "../script/scene/scene_city/reward/RewardGenerator"
import { addExcitement, subExcitement } from "../script/scene/scene_city/girl/Excitement"
import { closePageModal, handleCloseModal, handleOpenModal } from "../../ui_layer/utils/ModalUtils"
import { addApplyFuncForNextLevel, handleMissionComplete, isEnteringNextLevel, initWhenImportScene as initWhenImportSceneMission, getGameTime, getDestroyedRate, handleMissionFail, getWholeGameTimeMinutes } from "../script/scene/scene_city/manage/mission/Mission"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getPosition, getWorldPosition, setPosition, setPositionAndComputeBox, setWorldPositionAndComputeBox, updatePosition as updatePositionLittleMan } from "../script/scene/scene_city/little_man/Transform"
import { Camera } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { hasOpenedModal, registerBossStatusUpdateFunc, setUIUpdateLoopCount } from "../script/scene/scene_city/UI"
import { getCameraFar, getGiantessCameraTarget, setCameraFar, update as updateCamera, updateDistanceRateOnlyOnceInOneFrame, updateThirdPersonControlsForChangeScale } from "../script/scene/scene_city/Camera"
import { initWhenImportScene as initWhenImportSceneMap, getRandomMapLoadData } from "../script/scene/scene_city/manage/city1/map/Map"
import { getDifficultyData } from "../script/scene/scene_city/data/play/level1/difficulty/DifficultyData"
import { build } from "../script/scene/scene_city/model/city1/BuildScene"
import { disposePlayLevel, disposeUtils, getPropLoadData, handleBeforeLoadResourcePlayLevel, handleLevel, initWhenImportSceneUtils, resgisterDamageData, setCurrentMMDCharacter, setPlayerMMDValue, updateHeadLookatTarget, updateUtils } from "../script/scene/scene_city/manage/city1/ManageScene"
import { increaseGiantessAttribute, increaseGoddessAttribute, updateStatus } from "../script/scene/scene_city/girl/utils/LevelGirlUtils2"
import { initClothHpData } from "../script/scene/scene_city/utils/ClothUtils"
import { getClothHpData } from "../script/scene/scene_city/data/mmd/MMDData"
import { getBone, getRandomMMDDataExceptMMDData, getSpecificGiantessMMDDataExceptMMDData, setUsedMMDData } from "../script/scene/scene_city/utils/MMDUtils"
import { addFootDamageDecal, getGroundY, getPositionParrelToGround, parseAndAddResources } from "../script/scene/scene_city/manage/city1/Terrain"
import { buildCaptureLevelGiantessEventData, buildGiantessStubData, buildSceneUIEventData, buildStompHitTerrainEventData, getCaptureLevelGiantessEventName, getGenerateGiantessRandomCareerEventName, getGenerateLittleManRandomCareerEventName, getGetLittleManValueEventName, getGetPropEventName, getGiantessClimaxEventName, getGiantessExcitementEventName, getGiantessStressingEventName, getStartKeepStompEventName, getMissionCompleteEventName, getMissionFinishEventName, getPickPropRangeDistanceFactorForLittleManEventName, getSceneUIEventName, getEndStompBackEventName, getStompHitTerrainEventName, getTriggerPlayerGirlEatHandlerEventName, getFirstStartKeepLeftStompEventName, getEndLeftStompBackEventName, getInsertEventName, buildInsertEventData, buildPutToBreastEventData, getPutToBreastEventName, buildPutToShoeEventData, getPutToShoeEventName, buildPickupEventData, getPickupEventName, getEndBreastPressBackEventName, getStartKeepBreastPressEventName, buildFreeEventData, getFreeUBEventName, buildRemoveDataData, getRemovePickDataEventName, getRemoveUBDataEventName, getRemoveBreastDataEventName, getRemoveShoeDataEventName, getFreeShoeEventName, } from "../utils/EventUtils"
import { getArmyCountFactorByAutoDifficulty, isCanGenerate, isCanGenerateMax } from "../script/scene/scene_city/director/ArmyDirector"
import { generateArmyInSpecificPosition } from "../script/scene/scene_city/manage/city1/generator/utils/ArmyGeneratorUtils"
import { findValidArmyPoint, generateEliteGiantesses, generateMilltaryBuildings, generateMilltaryBuildingsDirectly, generateMilltaryVehicles, generateSoldiers } from "../script/scene/scene_city/manage/city1/generator/ArmyGenerator"
import { getAllGameEventData, getAllGameEventDirectorData, getAllScenarioData } from "./EventGameMod"
import { getPlayerAttackTarget, hasAttackTarget, isNotAttackLittleMan } from "../script/scene/scene_city/utils/AttackTargetUtils"
import { findNearData, findNearestData, findRandomNearData, getAllAliveBuildingData, getAllAliveEliteGiantessData, getAllAliveMilltaryBuildingData, getAllAliveMilltaryVehicleData, getAllAliveSoldierData, selectLittleMan, selectRandomNearBuilding, selectRandomNearEliteGiantess, selectRandomNearMilltaryBuilding, selectRandomNearMilltaryVehicle, selectRandomNearSoldier, selectTarget, selectTargetByDefault, selectTargetBySelectTargetPrior } from "../script/scene/scene_city/behaviour_tree/action_node/utils/GiantessSelectTargetUtils"
import { addEnemyGiantess } from "../script/scene/scene_city/girl/enemy/Girl"
import { getAllSkillDataForLevelOrBoss } from "../script/scene/scene_city/data/GirlDataUtils"
import { addWildGiantess } from "../script/scene/scene_city/girl/wild/Girl"
import { getBossDestroyProp, getLevelGirlDestroyProp } from "../script/scene/scene_city/data/reward/RewardData"
import { addLevelGiantess, createDestroyedStateUtils, createDestroyingStateUtils, createStressingStateUtils, damageLevelGiantess, removeLevelGiantess, triggerLevelGiantessAction, updateLevelGiantess } from "../script/scene/scene_city/girl/utils/LevelGirlUtils"
import { getAutoDifficulty } from "../script/scene/scene_city/difficulty/Difficulty"
import { computeNewValueByDivid, computeNewValueByMultiply, getEnhenceAutoDifficulty } from "../script/scene/scene_city/difficulty/DifficultyUtils"
import { computeRatio } from "../script/scene/scene_city/data/difficulty/DifficultyData"
import { getAllUsedMMDDataForPlayerMMD } from "../script/scene/scene_city/data/play/level1/MMDUtils"
import { buildAllBuildingAndTreeResourceIds, getInteractionLoadData, randomLimitAllBuildingUsedResources } from "../script/scene/scene_city/data/play/level1/map/MapData"
import { MutableNumberMapUtils } from "meta3d-jiehuo-abstract"
import { handleDoor, showDoor } from "../script/scene/scene_city/manage/city1/Mission"
import { getIsHit } from "../script/scene/scene_city/data/biwu/level2/behaviour_tree_data/action_node/utils/QTEUtils"
// import { pickdownByQTE } from "../script/scene/scene_city/behaviour_tree/action_node/FallByQTE"
import { Toast } from "antd-mobile"
import { generateTurrets as generateShellTurrets } from "../script/scene/scene_city/manage/city1/milltary_building/ShellTurret"
import { generateTurrets as generateMissileTurrets } from "../script/scene/scene_city/manage/city1/milltary_building/MissileTurret"
import { addCoinInLevel, getLevelCoin, setCoin, setTotalCoin } from "../script/scene/scene_city/reward/Coin"
import { isCloth, resetCloth, restoreCloth, updateHpData } from "../script/scene/scene_city/girl/Cloth"
import { initAllLevelGirlValue, limitInitialScale } from "./LevelGiantessMod"
import { getAllNotRelatedToSceneBlockNames, getModAPI } from "../script/scene/scene_city/Mod"
import { scaleEliteGiantess, isMaxHeight, isMaxScale, limitScale, isEliteGiantess, isMinHeight, updateAnimationDurationFactor } from "./EliteGiantessMod"
import { triggerAction as triggerLittleManAction, setActionState, isActionState, resetIsTriggerAction } from "../script/scene/scene_city/little_man/Action"
import { shootStartHandler } from "../script/scene/scene_city/little_man/Shoot"
import { getLookat, isNotInMovableRanges } from "../script/scene/scene_city/little_man/Utils"
import { getEarlyFrameIndex, getFirstFrameIndex, getLastFrameIndex, getLateFrameIndex } from "../script/scene/scene_city/utils/DataUtils"
import { isCanAction } from "../script/scene/scene_city/little_man/climb/ClimbManager"
import { getValue as getSwipingWeaponValue } from "../script/scene/scene_city/weapon/SwipingWeapon"
import { getCharacterType } from "meta3d-jiehuo-abstract/src/scene/Scene"
import { handleSwipHitArmy, handleSwipHitGirl, handleSwipHitLittleMan, handleSwipHitStatic } from "../script/scene/scene_city/manage/city1/soldier/weapon/Swip"
import { finishUse } from "../script/scene/scene_city/Interaction"
import { getAllInteractionConfig, getAllMapData } from "./InteractionMod"
import { getLoadResourceIdData } from "../script/scene/scene_city/data/MapData"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { execLoop, updateUIAndSound } from "../../business_layer/Loop"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { fixZFighting } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils"
import { buildEffectWeaponValue, buildGirlWeaponValue, computeRemoteDistance, isEffect, isMeleeWeapon, isRangeWeapon, isRemoteDamage, limitNonBulletEmitterSpeed } from "../script/scene/scene_city/utils/WeaponUtils"
import { getTransform, getBox as getBoxLODQueueObjectUtils, getFullHp as getFullHpLODQueueObjectUtils, getHp as getHpLODQueueObjectUtils, setHp as setHpLODQueueObjectUtils, handleRepel } from "../script/scene/scene_city/utils/LODQueueObjectUtils"
import { getHpIncrease as getHpIncreaseGirl, setHpIncrease as setHpIncreaseGirl, getExcitementFactorLevel, setOriginPlayerGirlScale, getScaleIncrease, setScaleIncrease, getDamageBiggerFactorLevel } from "../script/scene/scene_city/girl/player/Girl"
import { getExcitementByName } from "../script/scene/scene_city/girl/InitWhenImportScene"
import { getDestroyedEventName } from "../script/scene/scene_city/utils/EventUtils"
import { buildActionNodeForBalance } from "./BehaviourMod"
import { emitterSpeed } from "../script/scene/scene_city/data/ValueType"
import { getGiantessCharacters } from "../script/scene/scene_city/character/Character"
import { getCareerFeatureValue, getCareerFeatureValueByCharacterType, getUseCareerCharacterType, getUseCareerFeatureCharacterType, isUseCareerFeature, isUseCareerFeatureByCharacterType } from "./CareerMod"
import { addGemInLevel } from "../script/scene/scene_city/reward/Gem"
import { getUBCapacityFactor, isUseCareer } from "../script/scene/scene_city/build/Career"
import { setAnimationDurationFactor } from "../script/scene/scene_city/EliteGiantess"
import { addCurrentGunBullet } from "../script/scene/scene_city/little_man/Gun"
import { getShoeType, isRemoveShoe, restoreShoe } from "../script/scene/scene_city/data/mmd/Shoe"
import { findCareerFeatureDataByName, getCareerFeatureData, getNullableValue } from "../script/scene/scene_city/data/build/CareerFeatureData"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { getSelectActionPrior, isGiantessControlled, isGiantessControlledTargetNone } from "./PropOtherMod"
import * as PlayerGirlData from "../script/scene/scene_city/data/player/GirlData"
import { getPositionByName } from "./ModUtils"
import { getDeferCloseModalTime } from "../../ui_layer/utils/SwitchPageUtils"
import { getAllSelectCharacterData, getMMDName } from "./MMDMod"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { getRateByHasCount } from "../script/scene/scene_city/reward/RewardUtils"
import { triggerDownActionForBurstFire, triggerDownActionForContinueFire, triggerUpActionForBurstFire, triggerUpActionForContinueFire } from "../../ui_layer/utils/OperateUtils"
import { isActive } from "../script/scene/scene_city/User"
import { addStatusToName, addStatusToNameInTime, formatSecondUnit } from "../script/scene/scene_city/utils/StatusUtils"
import { stompRub } from "../script/scene/scene_city/behaviour_tree/action_node/StompRub"
import { getAnimationNamesExceptDamageNames } from "../script/scene/scene_city/data/Data"
import { createLieState, createInitialState } from "../script/scene/scene_city/little_man/FSMState"
import { findValidPosition, getGridForJudgeWalkable } from "../script/scene/scene_city/manage/city1/PathFind"
import { buildMultipleTweens, computeMovableVelocity } from "../script/scene/scene_city/utils/MoveUtils"
import { updateMoveCollision } from "../script/scene/scene_city/little_man/Move"
import { PathFind } from "meta3d-jiehuo-abstract"
import { handleRepelForCharacter } from "../script/scene/scene_city/utils/RepelUtils"
import { executeClimax, executeExcitement, getExcitementBuffSuperPositionCount } from "../script/scene/scene_city/girl/FSMStateUtils"
import { getBoxBottomPoint, getBoxMaxSize, getBoxTopPoint, getBoxVolumn, setBoxHeight } from "../script/scene/scene_city/utils/Box3Utils"
import { eat as handleEat, handleBreastFall, handleHandFall, handleShoeFall, handleUBFall } from "../script/scene/scene_city/girl/PickPose"
import { isFull } from "../script/scene/scene_city/girl/CarryUtils"
import { computeFallTime, isChangeToFallState } from "../script/scene/scene_city/utils/FallUtils"
import { leftStomp } from "../script/scene/scene_city/behaviour_tree/action_node/LeftStomp"
import { jumpStomp } from "../script/scene/scene_city/behaviour_tree/action_node/JumpStomp"
import { sprayMilk } from "../script/scene/scene_city/behaviour_tree/action_node/SprayMilk"
import { breastPressRub } from "../script/scene/scene_city/behaviour_tree/action_node/BreastPressRub"
import { crawlBeat } from "../script/scene/scene_city/behaviour_tree/action_node/CrawlBeat"
import { crawlLick } from "../script/scene/scene_city/behaviour_tree/action_node/CrawlLick"
import { thrust } from "../script/scene/scene_city/behaviour_tree/action_node/Thrust"
import { insert } from "../script/scene/scene_city/behaviour_tree/action_node/Insert"
import { putToBreast } from "../script/scene/scene_city/behaviour_tree/action_node/PutToBreast"
import { putToShoe } from "../script/scene/scene_city/behaviour_tree/action_node/PutToShoe"
import { freeUB } from "../script/scene/scene_city/behaviour_tree/action_node/FreeUB"
import { freeBreast } from "../script/scene/scene_city/behaviour_tree/action_node/FreeBreast"
import { freeShoe } from "../script/scene/scene_city/behaviour_tree/action_node/FreeShoe"
import { lookatTarget } from "../script/scene/scene_city/behaviour_tree/action_node/Utils"
import { sitRub } from "../script/scene/scene_city/behaviour_tree/action_node/SitRub"
import { sitTightenLeg } from "../script/scene/scene_city/behaviour_tree/action_node/TightenLeg"
import { isInGirlAttackRangeWithTarget, selectOneByWeight, selectOneByTwoLayerWeights, selectOneIndexByWeight, clearTargetByName } from "../script/scene/scene_city/utils/BehaviourManagerUtils"
import { removeTweensByKey, setTweensByKey } from "../script/scene/scene_city/TweenManager"
import { expandOBB, makeOBBHeightMax } from "../script/scene/scene_city/utils/OBBUtils"
import { buildCameraFar } from "../script/scene/scene_city/LittleManCamera"
import { hitEffect, addBuff as addBuffEmitBuff } from "../script/scene/scene_city/utils/BuffUtils"
import { computeRepelDirection } from "../script/scene/scene_city/utils/SkillGiantessUtils"
import { getGiantessLevel } from "../script/scene/scene_city/utils/UpgradeUtils"
import { isStatic } from "../script/scene/scene_city/utils/OctreeObjectUtils"
import { getBreastPartialScaleRatio, getTorsorPartialScaleRatio, limitBreastRatio, limitTorsorRatio, partialScaleBreast, partialScaleTorsor } from "../script/scene/scene_city/utils/PartialScaleGiantessUtils"
import { isEnemeyGiantessWithRate, preHandleAttackTarget, selectArmy } from "./SceneMod"
import { queryPutDataByBox } from "../script/scene/scene_city/utils/PutUtils"
// import { Terrain } from "meta3d-jiehuo-abstract"
// import { resetGiantessControllerBlockState } from "../script/scene/scene_city/behaviour_tree/action_node/ResetGiantessControllerBlockState"
// import { getSizeFactor, multiplyScalar } from "../script/scene/scene_city/data/CollisionShapeData"


const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();
const _b1 = new Box3();


// type extendInfo = {
//     getBlockService: any,
//     blockState: blockState,
// }

// export type info = extendInfo | infoBlockManager
export type info = {
    protocolName: blockProtocolName,
    blockName: blockName,

    title: string,
    version: string,
    category: string,
    author: string,

    getBlockService: any,
    blockState: blockState,
}

// export let registerBlock = <blockService, blockState>(state: state, blockProtocolName: blockProtocolName,
export let registerBlockRemainOldBlockState = <blockService, blockState>(state: state, blockProtocolName: blockProtocolName,
    blockName,
    getBlockService: getBlockService<blockService>,
    blockState: blockState
): state => {
    return setBlockState_(state, BlockManager.registerBlock(getModAPI(state), getBlockState(state), blockProtocolName, blockName, getBlockService,
        NullableUtils.getWithDefault(
            BlockManager.getBlockState(getBlockState(state), blockProtocolName, blockName),
            blockState
        )
    ))
}

export let getBlockServiceExn = <blockService>(state: state, blockProtocolName: blockProtocolName, blockName: blockName): blockService => {
    return BlockManager.getBlockServiceExn(getBlockState(state), blockProtocolName, blockName)
}

export let getBlockStateExn = <blockState>(state: state, blockProtocolName: blockProtocolName, blockName): blockState => {
    return BlockManager.getBlockStateExn(getBlockState(state), blockProtocolName, blockName)
}

export let setBlockState = <blockState>(state: state, blockProtocolName: blockProtocolName, blockName, blockState: blockState): state => {
    return setBlockState_(state, BlockManager.setBlockState(getBlockState(state), blockProtocolName, blockName, blockState))
}

export let dispose = (state, allBlockNamesNotDispose) => {
    let api = getModAPI(state)

    return _invokeServiceFunc(state, api, "dispose", allBlockNamesNotDispose)
        .then(state => {
            return setBlockState_(state, BlockManager.dispose(getBlockState(state)))
        })
}

export let disposeAllMods = (state: state) => {
    // let api = getModAPI(state)

    // return disposeAllBuffMods(state, api)
    return state
}

export let getSizeFactor = (state: state) => {
    let factor
    switch (getParticleNeedCollisionCheckLoopCount(state, emitterSpeed.Slow)) {
        // case particleNeedCollisionCheckLoopFrames.Zero:
        case particleNeedCollisionCheckLoopFrames.One:
            factor = 1
            break
        case particleNeedCollisionCheckLoopFrames.Two:
            factor = 1.1
            break
        case particleNeedCollisionCheckLoopFrames.Three:
            factor = 1.2
            break
        // case particleNeedCollisionCheckLoopFrames.Four:
        // 	factor = 1.3
        // 	break
        default:
            throw new Error("err")
    }

    return factor
}


type size = [number, number, number]

export let multiplyScalar = (size: size, scalar): size => {
    return [size[0] * scalar, size[1], size[2] * scalar]
}

let _invokeServiceFunc = (state, api, funcName, allBlockNamesNotInvoke) => {
    return ArrayUtils.reducePromise(
        BlockManager.getAllBlockServiceAndNames(getBlockState(state)),
        (state, [service, blockName]) => {
            if (
                !NullableUtils.isNullable(allBlockNamesNotInvoke)
                &&
                NullableUtils.getExn(allBlockNamesNotInvoke).includes(blockName)) {
                return Promise.resolve(state)
            }

            return NullableUtils.getWithDefault(
                NullableUtils.map(func => {
                    return func(api, state)
                }, service[funcName]),
                Promise.resolve(state)
            )
        }, state
    )
}

export let registerAllBlocks = (blockState) => {
    let api = buildAPI()

    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SceneProtect.getBlockInfo(api).protocolName,
        SceneProtect.getBlockInfo(api).blockName,
        SceneProtect.getBlockService,
        SceneProtect.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        MMDCharacterDefault.getBlockInfo(api).protocolName,
        MMDCharacterDefault.getBlockInfo(api).blockName,
        MMDCharacterDefault.getBlockService,
        MMDCharacterDefault.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        MMDCharacterExtend.getBlockInfo(api).protocolName,
        MMDCharacterExtend.getBlockInfo(api).blockName,
        MMDCharacterExtend.getBlockService,
        MMDCharacterExtend.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SoundBackgroundDefault.getBlockInfo(api).protocolName,
        SoundBackgroundDefault.getBlockInfo(api).blockName,
        SoundBackgroundDefault.getBlockService,
        SoundBackgroundDefault.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerDefault.getBlockInfo(api).protocolName,
        CareerDefault.getBlockInfo(api).blockName,
        CareerDefault.getBlockService,
        CareerDefault.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerLittleManRandom.getBlockInfo(api).protocolName,
        CareerLittleManRandom.getBlockInfo(api).blockName,
        CareerLittleManRandom.getBlockService,
        CareerLittleManRandom.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerGiantessRandom.getBlockInfo(api).protocolName,
        CareerGiantessRandom.getBlockInfo(api).blockName,
        CareerGiantessRandom.getBlockService,
        CareerGiantessRandom.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerPeace.getBlockInfo(api).protocolName,
        CareerPeace.getBlockInfo(api).blockName,
        CareerPeace.getBlockService,
        CareerPeace.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerRunner.getBlockInfo(api).protocolName,
        CareerRunner.getBlockInfo(api).blockName,
        CareerRunner.getBlockService,
        CareerRunner.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerGiantessPleaser.getBlockInfo(api).protocolName,
        CareerGiantessPleaser.getBlockInfo(api).blockName,
        CareerGiantessPleaser.getBlockService,
        CareerGiantessPleaser.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerMasochism.getBlockInfo(api).protocolName,
        CareerMasochism.getBlockInfo(api).blockName,
        CareerMasochism.getBlockService,
        CareerMasochism.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerFoodie.getBlockInfo(api).protocolName,
        CareerFoodie.getBlockInfo(api).blockName,
        CareerFoodie.getBlockService,
        CareerFoodie.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerDemon.getBlockInfo(api).protocolName,
        CareerDemon.getBlockInfo(api).blockName,
        CareerDemon.getBlockService,
        CareerDemon.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerLittleManBandit.getBlockInfo(api).protocolName,
        CareerLittleManBandit.getBlockInfo(api).blockName,
        CareerLittleManBandit.getBlockService,
        CareerLittleManBandit.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerGiantessBandit.getBlockInfo(api).protocolName,
        CareerGiantessBandit.getBlockInfo(api).blockName,
        CareerGiantessBandit.getBlockService,
        CareerGiantessBandit.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerSaver.getBlockInfo(api).protocolName,
        CareerSaver.getBlockInfo(api).blockName,
        CareerSaver.getBlockService,
        CareerSaver.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerFarmer.getBlockInfo(api).protocolName,
        CareerFarmer.getBlockInfo(api).blockName,
        CareerFarmer.getBlockService,
        CareerFarmer.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerEnterpriser.getBlockInfo(api).protocolName,
        CareerEnterpriser.getBlockInfo(api).blockName,
        CareerEnterpriser.getBlockService,
        CareerEnterpriser.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerDuelist.getBlockInfo(api).protocolName,
        CareerDuelist.getBlockInfo(api).blockName,
        CareerDuelist.getBlockService,
        CareerDuelist.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerWeaponWorkMan.getBlockInfo(api).protocolName,
        CareerWeaponWorkMan.getBlockInfo(api).blockName,
        CareerWeaponWorkMan.getBlockService,
        CareerWeaponWorkMan.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerVaginalCapture.getBlockInfo(api).protocolName,
        CareerVaginalCapture.getBlockInfo(api).blockName,
        CareerVaginalCapture.getBlockService,
        CareerVaginalCapture.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerCarry.getBlockInfo(api).protocolName,
        CareerCarry.getBlockInfo(api).blockName,
        CareerCarry.getBlockService,
        CareerCarry.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerAbsorber.getBlockInfo(api).protocolName,
        CareerAbsorber.getBlockInfo(api).blockName,
        CareerAbsorber.getBlockService,
        CareerAbsorber.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerWetNurse.getBlockInfo(api).protocolName,
        CareerWetNurse.getBlockInfo(api).blockName,
        CareerWetNurse.getBlockService,
        CareerWetNurse.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerSadism.getBlockInfo(api).protocolName,
        CareerSadism.getBlockInfo(api).blockName,
        CareerSadism.getBlockService,
        CareerSadism.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        CareerFootFetish.getBlockInfo(api).protocolName,
        CareerFootFetish.getBlockInfo(api).blockName,
        CareerFootFetish.getBlockService,
        CareerFootFetish.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SettingDefault.getBlockInfo(api).protocolName,
        SettingDefault.getBlockInfo(api).blockName,
        SettingDefault.getBlockService,
        SettingDefault.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SettingSound.getBlockInfo(api).protocolName,
        SettingSound.getBlockInfo(api).blockName,
        SettingSound.getBlockService,
        SettingSound.createBlockState(api)
    )
    // blockState = BlockManager.registerBlock(
    // api,
    //     blockState,
    //     DefaultGiantess.getBlockInfo(api).protocolName,
    //     DefaultGiantess.getBlockInfo(api).blockName,
    //     DefaultGiantess.getBlockService,
    //     DefaultGiantess.createBlockState(api)
    // )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        MeleeGiantess.getBlockInfo(api).protocolName,
        MeleeGiantess.getBlockInfo(api).blockName,
        MeleeGiantess.getBlockService,
        MeleeGiantess.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        MagicGiantess.getBlockInfo(api).protocolName,
        MagicGiantess.getBlockInfo(api).blockName,
        MagicGiantess.getBlockService,
        MagicGiantess.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        EliteGiantessShareDefault.getBlockInfo(api).protocolName,
        EliteGiantessShareDefault.getBlockInfo(api).blockName,
        EliteGiantessShareDefault.getBlockService,
        EliteGiantessShareDefault.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        WeaponStompLight.getBlockInfo(api).protocolName,
        WeaponStompLight.getBlockInfo(api).blockName,
        WeaponStompLight.getBlockService,
        WeaponStompLight.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        WeaponStompHeavy.getBlockInfo(api).protocolName,
        WeaponStompHeavy.getBlockInfo(api).blockName,
        WeaponStompHeavy.getBlockService,
        WeaponStompHeavy.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropBulletBasic.getBlockInfo(api).protocolName,
        PropBulletBasic.getBlockInfo(api).blockName,
        PropBulletBasic.getBlockService,
        PropBulletBasic.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropBulletSubMachine.getBlockInfo(api).protocolName,
        PropBulletSubMachine.getBlockInfo(api).blockName,
        PropBulletSubMachine.getBlockService,
        PropBulletSubMachine.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropBulletShot.getBlockInfo(api).protocolName,
        PropBulletShot.getBlockInfo(api).blockName,
        PropBulletShot.getBlockService,
        PropBulletShot.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropBulletBigger.getBlockInfo(api).protocolName,
        PropBulletBigger.getBlockInfo(api).blockName,
        PropBulletBigger.getBlockService,
        PropBulletBigger.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropBulletSmaller.getBlockInfo(api).protocolName,
        PropBulletSmaller.getBlockInfo(api).blockName,
        PropBulletSmaller.getBlockService,
        PropBulletSmaller.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        WeaponLittleManSwiping.getBlockInfo(api).protocolName,
        WeaponLittleManSwiping.getBlockInfo(api).blockName,
        WeaponLittleManSwiping.getBlockService,
        WeaponLittleManSwiping.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        WeaponKickLight.getBlockInfo(api).protocolName,
        WeaponKickLight.getBlockInfo(api).blockName,
        WeaponKickLight.getBlockService,
        WeaponKickLight.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        WeaponMagicAttack1.getBlockInfo(api).protocolName,
        WeaponMagicAttack1.getBlockInfo(api).blockName,
        WeaponMagicAttack1.getBlockService,
        WeaponMagicAttack1.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        WeaponWalk.getBlockInfo(api).protocolName,
        WeaponWalk.getBlockInfo(api).blockName,
        WeaponWalk.getBlockService,
        WeaponWalk.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleEffectInjureDamage.getBlockInfo(api).protocolName,
        ParticleEffectInjureDamage.getBlockInfo(api).blockName,
        ParticleEffectInjureDamage.getBlockService,
        ParticleEffectInjureDamage.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleEffectUpgrade.getBlockInfo(api).protocolName,
        ParticleEffectUpgrade.getBlockInfo(api).blockName,
        ParticleEffectUpgrade.getBlockService,
        ParticleEffectUpgrade.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleEffectHitDecreaseScale.getBlockInfo(api).protocolName,
        ParticleEffectHitDecreaseScale.getBlockInfo(api).blockName,
        ParticleEffectHitDecreaseScale.getBlockService,
        ParticleEffectHitDecreaseScale.createBlockState(api)
    )
    // blockState = BlockManager.registerBlock(
    //     api,
    //     blockState,
    //     ParticleEffectHitFragileGrowth.getBlockInfo(api).protocolName,
    //     ParticleEffectHitFragileGrowth.getBlockInfo(api).blockName,
    //     ParticleEffectHitFragileGrowth.getBlockService,
    //     ParticleEffectHitFragileGrowth.createBlockState(api)
    // )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleEffectHitIceSingle.getBlockInfo(api).protocolName,
        ParticleEffectHitIceSingle.getBlockInfo(api).blockName,
        ParticleEffectHitIceSingle.getBlockService,
        ParticleEffectHitIceSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleEffectHitBlur.getBlockInfo(api).protocolName,
        ParticleEffectHitBlur.getBlockInfo(api).blockName,
        ParticleEffectHitBlur.getBlockService,
        ParticleEffectHitBlur.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleEffectHitCharm.getBlockInfo(api).protocolName,
        ParticleEffectHitCharm.getBlockInfo(api).blockName,
        ParticleEffectHitCharm.getBlockService,
        ParticleEffectHitCharm.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleEffectHitCrippled.getBlockInfo(api).protocolName,
        ParticleEffectHitCrippled.getBlockInfo(api).blockName,
        ParticleEffectHitCrippled.getBlockService,
        ParticleEffectHitCrippled.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleEffectHitExcitement.getBlockInfo(api).protocolName,
        ParticleEffectHitExcitement.getBlockInfo(api).blockName,
        ParticleEffectHitExcitement.getBlockService,
        ParticleEffectHitExcitement.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleEffectHitPoisonSingle.getBlockInfo(api).protocolName,
        ParticleEffectHitPoisonSingle.getBlockInfo(api).blockName,
        ParticleEffectHitPoisonSingle.getBlockService,
        ParticleEffectHitPoisonSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleEffectHitInjureSingle.getBlockInfo(api).protocolName,
        ParticleEffectHitInjureSingle.getBlockInfo(api).blockName,
        ParticleEffectHitInjureSingle.getBlockService,
        ParticleEffectHitInjureSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleEffectHitExplodeSingle.getBlockInfo(api).protocolName,
        ParticleEffectHitExplodeSingle.getBlockInfo(api).blockName,
        ParticleEffectHitExplodeSingle.getBlockService,
        ParticleEffectHitExplodeSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleBulletEmitSubMachine.getBlockInfo(api).protocolName,
        ParticleBulletEmitSubMachine.getBlockInfo(api).blockName,
        ParticleBulletEmitSubMachine.getBlockService,
        ParticleBulletEmitSubMachine.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleBulletHitSubMachine.getBlockInfo(api).protocolName,
        ParticleBulletHitSubMachine.getBlockInfo(api).blockName,
        ParticleBulletHitSubMachine.getBlockService,
        ParticleBulletHitSubMachine.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleBulletEmitBasic.getBlockInfo(api).protocolName,
        ParticleBulletEmitBasic.getBlockInfo(api).blockName,
        ParticleBulletEmitBasic.getBlockService,
        ParticleBulletEmitBasic.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleBulletHitBasic.getBlockInfo(api).protocolName,
        ParticleBulletHitBasic.getBlockInfo(api).blockName,
        ParticleBulletHitBasic.getBlockService,
        ParticleBulletHitBasic.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleBulletEmitShot.getBlockInfo(api).protocolName,
        ParticleBulletEmitShot.getBlockInfo(api).blockName,
        ParticleBulletEmitShot.getBlockService,
        ParticleBulletEmitShot.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleBulletHitShot.getBlockInfo(api).protocolName,
        ParticleBulletHitShot.getBlockInfo(api).blockName,
        ParticleBulletHitShot.getBlockService,
        ParticleBulletHitShot.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleBulletEmitFireball.getBlockInfo(api).protocolName,
        ParticleBulletEmitFireball.getBlockInfo(api).blockName,
        ParticleBulletEmitFireball.getBlockService,
        ParticleBulletEmitFireball.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleBulletHitFireball.getBlockInfo(api).protocolName,
        ParticleBulletHitFireball.getBlockInfo(api).blockName,
        ParticleBulletHitFireball.getBlockService,
        ParticleBulletHitFireball.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleBulletEmitBigger.getBlockInfo(api).protocolName,
        ParticleBulletEmitBigger.getBlockInfo(api).blockName,
        ParticleBulletEmitBigger.getBlockService,
        ParticleBulletEmitBigger.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleBulletEmitSmaller.getBlockInfo(api).protocolName,
        ParticleBulletEmitSmaller.getBlockInfo(api).blockName,
        ParticleBulletEmitSmaller.getBlockService,
        ParticleBulletEmitSmaller.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleBillboardExplodeRange.getBlockInfo(api).protocolName,
        ParticleBillboardExplodeRange.getBlockInfo(api).blockName,
        ParticleBillboardExplodeRange.getBlockService,
        ParticleBillboardExplodeRange.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleBillboardIceOverwrite.getBlockInfo(api).protocolName,
        ParticleBillboardIceOverwrite.getBlockInfo(api).blockName,
        ParticleBillboardIceOverwrite.getBlockService,
        ParticleBillboardIceOverwrite.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        ParticleShareDefault.getBlockInfo(api).protocolName,
        ParticleShareDefault.getBlockInfo(api).blockName,
        ParticleShareDefault.getBlockService,
        ParticleShareDefault.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffGiantessHard.getBlockInfo(api).protocolName,
        BuffGiantessHard.getBlockInfo(api).blockName,
        BuffGiantessHard.getBlockService,
        BuffGiantessHard.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffGiantessSmallerWater.getBlockInfo(api).protocolName,
        BuffGiantessSmallerWater.getBlockInfo(api).blockName,
        BuffGiantessSmallerWater.getBlockService,
        BuffGiantessSmallerWater.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffGiantessEat.getBlockInfo(api).protocolName,
        BuffGiantessEat.getBlockInfo(api).blockName,
        BuffGiantessEat.getBlockService,
        BuffGiantessEat.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffGiantessAbsorb.getBlockInfo(api).protocolName,
        BuffGiantessAbsorb.getBlockInfo(api).blockName,
        BuffGiantessAbsorb.getBlockService,
        BuffGiantessAbsorb.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffLittleManMasochism.getBlockInfo(api).protocolName,
        BuffLittleManMasochism.getBlockInfo(api).blockName,
        BuffLittleManMasochism.getBlockService,
        BuffLittleManMasochism.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffGiantessMasochism.getBlockInfo(api).protocolName,
        BuffGiantessMasochism.getBlockInfo(api).blockName,
        BuffGiantessMasochism.getBlockService,
        BuffGiantessMasochism.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffGiantessSadism.getBlockInfo(api).protocolName,
        BuffGiantessSadism.getBlockInfo(api).blockName,
        BuffGiantessSadism.getBlockService,
        BuffGiantessSadism.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffArmySadism.getBlockInfo(api).protocolName,
        BuffArmySadism.getBlockInfo(api).blockName,
        BuffArmySadism.getBlockService,
        BuffArmySadism.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffLittleManExcitementIncreaseAttack.getBlockInfo(api).protocolName,
        BuffLittleManExcitementIncreaseAttack.getBlockInfo(api).blockName,
        BuffLittleManExcitementIncreaseAttack.getBlockService,
        BuffLittleManExcitementIncreaseAttack.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitDefenseIncreaseDefense.getBlockInfo(api).protocolName,
        BuffEmitDefenseIncreaseDefense.getBlockInfo(api).blockName,
        BuffEmitDefenseIncreaseDefense.getBlockService,
        BuffEmitDefenseIncreaseDefense.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffArmyIncreaseDefense.getBlockInfo(api).protocolName,
        BuffArmyIncreaseDefense.getBlockInfo(api).blockName,
        BuffArmyIncreaseDefense.getBlockService,
        BuffArmyIncreaseDefense.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffLittleManIncreaseDefense.getBlockInfo(api).protocolName,
        BuffLittleManIncreaseDefense.getBlockInfo(api).blockName,
        BuffLittleManIncreaseDefense.getBlockService,
        BuffLittleManIncreaseDefense.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffGiantessIncreaseDefense.getBlockInfo(api).protocolName,
        BuffGiantessIncreaseDefense.getBlockInfo(api).blockName,
        BuffGiantessIncreaseDefense.getBlockService,
        BuffGiantessIncreaseDefense.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitBackStab.getBlockInfo(api).protocolName,
        BuffEmitBackStab.getBlockInfo(api).blockName,
        BuffEmitBackStab.getBlockService,
        BuffEmitBackStab.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitHpRatio.getBlockInfo(api).protocolName,
        BuffEmitHpRatio.getBlockInfo(api).blockName,
        BuffEmitHpRatio.getBlockService,
        BuffEmitHpRatio.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitHpRatioInverse.getBlockInfo(api).protocolName,
        BuffEmitHpRatioInverse.getBlockInfo(api).blockName,
        BuffEmitHpRatioInverse.getBlockService,
        BuffEmitHpRatioInverse.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitShootDistanceInverse.getBlockInfo(api).protocolName,
        BuffEmitShootDistanceInverse.getBlockInfo(api).blockName,
        BuffEmitShootDistanceInverse.getBlockService,
        BuffEmitShootDistanceInverse.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitShootDistanceDirect.getBlockInfo(api).protocolName,
        BuffEmitShootDistanceDirect.getBlockInfo(api).blockName,
        BuffEmitShootDistanceDirect.getBlockService,
        BuffEmitShootDistanceDirect.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitPull.getBlockInfo(api).protocolName,
        BuffEmitPull.getBlockInfo(api).blockName,
        BuffEmitPull.getBlockService,
        BuffEmitPull.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitDecreaseScale.getBlockInfo(api).protocolName,
        BuffEmitDecreaseScale.getBlockInfo(api).blockName,
        BuffEmitDecreaseScale.getBlockService,
        BuffEmitDecreaseScale.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitDefenseDoorShield.getBlockInfo(api).protocolName,
        BuffEmitDefenseDoorShield.getBlockInfo(api).blockName,
        BuffEmitDefenseDoorShield.getBlockService,
        BuffEmitDefenseDoorShield.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitFragileGrowth.getBlockInfo(api).protocolName,
        BuffEmitFragileGrowth.getBlockInfo(api).blockName,
        BuffEmitFragileGrowth.getBlockService,
        BuffEmitFragileGrowth.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitCrippled.getBlockInfo(api).protocolName,
        BuffEmitCrippled.getBlockInfo(api).blockName,
        BuffEmitCrippled.getBlockService,
        BuffEmitCrippled.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffArmyCrippled.getBlockInfo(api).protocolName,
        BuffArmyCrippled.getBlockInfo(api).blockName,
        BuffArmyCrippled.getBlockService,
        BuffArmyCrippled.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffLittleManCrippled.getBlockInfo(api).protocolName,
        BuffLittleManCrippled.getBlockInfo(api).blockName,
        BuffLittleManCrippled.getBlockService,
        BuffLittleManCrippled.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitCharm.getBlockInfo(api).protocolName,
        BuffEmitCharm.getBlockInfo(api).blockName,
        BuffEmitCharm.getBlockService,
        BuffEmitCharm.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffArmyCharm.getBlockInfo(api).protocolName,
        BuffArmyCharm.getBlockInfo(api).blockName,
        BuffArmyCharm.getBlockService,
        BuffArmyCharm.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffLittleManCharm.getBlockInfo(api).protocolName,
        BuffLittleManCharm.getBlockInfo(api).blockName,
        BuffLittleManCharm.getBlockService,
        BuffLittleManCharm.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitBlur.getBlockInfo(api).protocolName,
        BuffEmitBlur.getBlockInfo(api).blockName,
        BuffEmitBlur.getBlockService,
        BuffEmitBlur.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffArmyBlur.getBlockInfo(api).protocolName,
        BuffArmyBlur.getBlockInfo(api).blockName,
        BuffArmyBlur.getBlockService,
        BuffArmyBlur.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffLittleManBlur.getBlockInfo(api).protocolName,
        BuffLittleManBlur.getBlockInfo(api).blockName,
        BuffLittleManBlur.getBlockService,
        BuffLittleManBlur.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitExcitement.getBlockInfo(api).protocolName,
        BuffEmitExcitement.getBlockInfo(api).blockName,
        BuffEmitExcitement.getBlockService,
        BuffEmitExcitement.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffArmyExcitement.getBlockInfo(api).protocolName,
        BuffArmyExcitement.getBlockInfo(api).blockName,
        BuffArmyExcitement.getBlockService,
        BuffArmyExcitement.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffLittleManExcitement.getBlockInfo(api).protocolName,
        BuffLittleManExcitement.getBlockInfo(api).blockName,
        BuffLittleManExcitement.getBlockService,
        BuffLittleManExcitement.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffArmyStressProtect.getBlockInfo(api).protocolName,
        BuffArmyStressProtect.getBlockInfo(api).blockName,
        BuffArmyStressProtect.getBlockService,
        BuffArmyStressProtect.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitDefenseStressProtect.getBlockInfo(api).protocolName,
        BuffEmitDefenseStressProtect.getBlockInfo(api).blockName,
        BuffEmitDefenseStressProtect.getBlockService,
        BuffEmitDefenseStressProtect.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitPoisonSingle.getBlockInfo(api).protocolName,
        BuffEmitPoisonSingle.getBlockInfo(api).blockName,
        BuffEmitPoisonSingle.getBlockService,
        BuffEmitPoisonSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffLittleManPoisonSingle.getBlockInfo(api).protocolName,
        BuffLittleManPoisonSingle.getBlockInfo(api).blockName,
        BuffLittleManPoisonSingle.getBlockService,
        BuffLittleManPoisonSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEmitIceSingle.getBlockInfo(api).protocolName,
        BuffEmitIceSingle.getBlockInfo(api).blockName,
        BuffEmitIceSingle.getBlockService,
        BuffEmitIceSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffLittleManIceSingle.getBlockInfo(api).protocolName,
        BuffLittleManIceSingle.getBlockInfo(api).blockName,
        BuffLittleManIceSingle.getBlockService,
        BuffLittleManIceSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEliteGiantessDamageBigger.getBlockInfo(api).protocolName,
        BuffEliteGiantessDamageBigger.getBlockInfo(api).blockName,
        BuffEliteGiantessDamageBigger.getBlockService,
        BuffEliteGiantessDamageBigger.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffEliteGiantessPassiveBigger.getBlockInfo(api).protocolName,
        BuffEliteGiantessPassiveBigger.getBlockInfo(api).blockName,
        BuffEliteGiantessPassiveBigger.getBlockService,
        BuffEliteGiantessPassiveBigger.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffLittleManStressProtect.getBlockInfo(api).protocolName,
        BuffLittleManStressProtect.getBlockInfo(api).blockName,
        BuffLittleManStressProtect.getBlockService,
        BuffLittleManStressProtect.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffGiantessStressProtect.getBlockInfo(api).protocolName,
        BuffGiantessStressProtect.getBlockInfo(api).blockName,
        BuffGiantessStressProtect.getBlockService,
        BuffGiantessStressProtect.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffBossStressProtect.getBlockInfo(api).protocolName,
        BuffBossStressProtect.getBlockInfo(api).blockName,
        BuffBossStressProtect.getBlockService,
        BuffBossStressProtect.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffPlayerStatusDamageBigger.getBlockInfo(api).protocolName,
        BuffPlayerStatusDamageBigger.getBlockInfo(api).blockName,
        BuffPlayerStatusDamageBigger.getBlockService,
        BuffPlayerStatusDamageBigger.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffBossStatusDamageBigger.getBlockInfo(api).protocolName,
        BuffBossStatusDamageBigger.getBlockInfo(api).blockName,
        BuffBossStatusDamageBigger.getBlockService,
        BuffBossStatusDamageBigger.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffPlayerStatusPassiveBigger.getBlockInfo(api).protocolName,
        BuffPlayerStatusPassiveBigger.getBlockInfo(api).blockName,
        BuffPlayerStatusPassiveBigger.getBlockService,
        BuffPlayerStatusPassiveBigger.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffBossStatusPassiveBigger.getBlockInfo(api).protocolName,
        BuffBossStatusPassiveBigger.getBlockInfo(api).blockName,
        BuffBossStatusPassiveBigger.getBlockService,
        BuffBossStatusPassiveBigger.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffArmyIceOverwrite.getBlockInfo(api).protocolName,
        BuffArmyIceOverwrite.getBlockInfo(api).blockName,
        BuffArmyIceOverwrite.getBlockService,
        BuffArmyIceOverwrite.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffArmyIceSingle.getBlockInfo(api).protocolName,
        BuffArmyIceSingle.getBlockInfo(api).blockName,
        BuffArmyIceSingle.getBlockService,
        BuffArmyIceSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffArmyPoisonSingle.getBlockInfo(api).protocolName,
        BuffArmyPoisonSingle.getBlockInfo(api).blockName,
        BuffArmyPoisonSingle.getBlockService,
        BuffArmyPoisonSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffArmyInjureSingle.getBlockInfo(api).protocolName,
        BuffArmyInjureSingle.getBlockInfo(api).blockName,
        BuffArmyInjureSingle.getBlockService,
        BuffArmyInjureSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffGiantessIceOverwrite.getBlockInfo(api).protocolName,
        BuffGiantessIceOverwrite.getBlockInfo(api).blockName,
        BuffGiantessIceOverwrite.getBlockService,
        BuffGiantessIceOverwrite.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffGiantessIceSingle.getBlockInfo(api).protocolName,
        BuffGiantessIceSingle.getBlockInfo(api).blockName,
        BuffGiantessIceSingle.getBlockService,
        BuffGiantessIceSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffGiantessPoisonSingle.getBlockInfo(api).protocolName,
        BuffGiantessPoisonSingle.getBlockInfo(api).blockName,
        BuffGiantessPoisonSingle.getBlockService,
        BuffGiantessPoisonSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffGiantessInjureSingle.getBlockInfo(api).protocolName,
        BuffGiantessInjureSingle.getBlockInfo(api).blockName,
        BuffGiantessInjureSingle.getBlockService,
        BuffGiantessInjureSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffStrong.getBlockInfo(api).protocolName,
        BuffStrong.getBlockInfo(api).blockName,
        BuffStrong.getBlockService,
        BuffStrong.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffRun.getBlockInfo(api).protocolName,
        BuffRun.getBlockInfo(api).blockName,
        BuffRun.getBlockService,
        BuffRun.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffCallGoddess.getBlockInfo(api).protocolName,
        BuffCallGoddess.getBlockInfo(api).blockName,
        BuffCallGoddess.getBlockService,
        BuffCallGoddess.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffExcitementGirl.getBlockInfo(api).protocolName,
        BuffExcitementGirl.getBlockInfo(api).blockName,
        BuffExcitementGirl.getBlockService,
        BuffExcitementGirl.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffExcitementLevelGiantess.getBlockInfo(api).protocolName,
        BuffExcitementLevelGiantess.getBlockInfo(api).blockName,
        BuffExcitementLevelGiantess.getBlockService,
        BuffExcitementLevelGiantess.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffTiredGirl.getBlockInfo(api).protocolName,
        BuffTiredGirl.getBlockInfo(api).blockName,
        BuffTiredGirl.getBlockService,
        BuffTiredGirl.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffTiredLevelGiantess.getBlockInfo(api).protocolName,
        BuffTiredLevelGiantess.getBlockInfo(api).blockName,
        BuffTiredLevelGiantess.getBlockService,
        BuffTiredLevelGiantess.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffHolyWater.getBlockInfo(api).protocolName,
        BuffHolyWater.getBlockInfo(api).blockName,
        BuffHolyWater.getBlockService,
        BuffHolyWater.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffGiantessStimulator.getBlockInfo(api).protocolName,
        BuffGiantessStimulator.getBlockInfo(api).blockName,
        BuffGiantessStimulator.getBlockService,
        BuffGiantessStimulator.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BuffGiantessController.getBlockInfo(api).protocolName,
        BuffGiantessController.getBlockInfo(api).blockName,
        BuffGiantessController.getBlockService,
        BuffGiantessController.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeAssistantAddMaxExcitement.getBlockInfo(api).protocolName,
        UpgradeAssistantAddMaxExcitement.getBlockInfo(api).blockName,
        UpgradeAssistantAddMaxExcitement.getBlockService,
        UpgradeAssistantAddMaxExcitement.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeOtherIncreasePickPropRange.getBlockInfo(api).protocolName,
        UpgradeOtherIncreasePickPropRange.getBlockInfo(api).blockName,
        UpgradeOtherIncreasePickPropRange.getBlockService,
        UpgradeOtherIncreasePickPropRange.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeOtherAddBullet.getBlockInfo(api).protocolName,
        UpgradeOtherAddBullet.getBlockInfo(api).blockName,
        UpgradeOtherAddBullet.getBlockService,
        UpgradeOtherAddBullet.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeOtherPartialScaleBreast.getBlockInfo(api).protocolName,
        UpgradeOtherPartialScaleBreast.getBlockInfo(api).blockName,
        UpgradeOtherPartialScaleBreast.getBlockService,
        UpgradeOtherPartialScaleBreast.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeOtherPartialScaleTorsor.getBlockInfo(api).protocolName,
        UpgradeOtherPartialScaleTorsor.getBlockInfo(api).blockName,
        UpgradeOtherPartialScaleTorsor.getBlockService,
        UpgradeOtherPartialScaleTorsor.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeOtherDamagedPartialScaleBreast.getBlockInfo(api).protocolName,
        UpgradeOtherDamagedPartialScaleBreast.getBlockInfo(api).blockName,
        UpgradeOtherDamagedPartialScaleBreast.getBlockService,
        UpgradeOtherDamagedPartialScaleBreast.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeDefenseIncreaseDefense.getBlockInfo(api).protocolName,
        UpgradeDefenseIncreaseDefense.getBlockInfo(api).blockName,
        UpgradeDefenseIncreaseDefense.getBlockService,
        UpgradeDefenseIncreaseDefense.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeAttackBackStab.getBlockInfo(api).protocolName,
        UpgradeAttackBackStab.getBlockInfo(api).blockName,
        UpgradeAttackBackStab.getBlockService,
        UpgradeAttackBackStab.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeAttackHpRatio.getBlockInfo(api).protocolName,
        UpgradeAttackHpRatio.getBlockInfo(api).blockName,
        UpgradeAttackHpRatio.getBlockService,
        UpgradeAttackHpRatio.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeAttackHpRatioInverse.getBlockInfo(api).protocolName,
        UpgradeAttackHpRatioInverse.getBlockInfo(api).blockName,
        UpgradeAttackHpRatioInverse.getBlockService,
        UpgradeAttackHpRatioInverse.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeAttackShootDistanceInverse.getBlockInfo(api).protocolName,
        UpgradeAttackShootDistanceInverse.getBlockInfo(api).blockName,
        UpgradeAttackShootDistanceInverse.getBlockService,
        UpgradeAttackShootDistanceInverse.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeAttackShootDistanceDirect.getBlockInfo(api).protocolName,
        UpgradeAttackShootDistanceDirect.getBlockInfo(api).blockName,
        UpgradeAttackShootDistanceDirect.getBlockService,
        UpgradeAttackShootDistanceDirect.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeAttackPull.getBlockInfo(api).protocolName,
        UpgradeAttackPull.getBlockInfo(api).blockName,
        UpgradeAttackPull.getBlockService,
        UpgradeAttackPull.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeAttackDecreaseScale.getBlockInfo(api).protocolName,
        UpgradeAttackDecreaseScale.getBlockInfo(api).blockName,
        UpgradeAttackDecreaseScale.getBlockService,
        UpgradeAttackDecreaseScale.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeDefenseDoorShield.getBlockInfo(api).protocolName,
        UpgradeDefenseDoorShield.getBlockInfo(api).blockName,
        UpgradeDefenseDoorShield.getBlockService,
        UpgradeDefenseDoorShield.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeDefenseLimitDamage.getBlockInfo(api).protocolName,
        UpgradeDefenseLimitDamage.getBlockInfo(api).blockName,
        UpgradeDefenseLimitDamage.getBlockService,
        UpgradeDefenseLimitDamage.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeDefenseStressProtect.getBlockInfo(api).protocolName,
        UpgradeDefenseStressProtect.getBlockInfo(api).blockName,
        UpgradeDefenseStressProtect.getBlockService,
        UpgradeDefenseStressProtect.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeDefenseBuQu.getBlockInfo(api).protocolName,
        UpgradeDefenseBuQu.getBlockInfo(api).blockName,
        UpgradeDefenseBuQu.getBlockService,
        UpgradeDefenseBuQu.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeDefenseDecreaseDamageWhenLie.getBlockInfo(api).protocolName,
        UpgradeDefenseDecreaseDamageWhenLie.getBlockInfo(api).blockName,
        UpgradeDefenseDecreaseDamageWhenLie.getBlockService,
        UpgradeDefenseDecreaseDamageWhenLie.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeDefenseIncreaseStrongWhenMeleeAttack.getBlockInfo(api).protocolName,
        UpgradeDefenseIncreaseStrongWhenMeleeAttack.getBlockInfo(api).blockName,
        UpgradeDefenseIncreaseStrongWhenMeleeAttack.getBlockService,
        UpgradeDefenseIncreaseStrongWhenMeleeAttack.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeDefenseDecreaseStressingRate.getBlockInfo(api).protocolName,
        UpgradeDefenseDecreaseStressingRate.getBlockInfo(api).blockName,
        UpgradeDefenseDecreaseStressingRate.getBlockService,
        UpgradeDefenseDecreaseStressingRate.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhenceBreastPressRubCharm.getBlockInfo(api).protocolName,
        UpgradeSkillEnhenceBreastPressRubCharm.getBlockInfo(api).blockName,
        UpgradeSkillEnhenceBreastPressRubCharm.getBlockService,
        UpgradeSkillEnhenceBreastPressRubCharm.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhenceBreastPressRubPutToBreast.getBlockInfo(api).protocolName,
        UpgradeSkillEnhenceBreastPressRubPutToBreast.getBlockInfo(api).blockName,
        UpgradeSkillEnhenceBreastPressRubPutToBreast.getBlockService,
        UpgradeSkillEnhenceBreastPressRubPutToBreast.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhenceSitRubCharm.getBlockInfo(api).protocolName,
        UpgradeSkillEnhenceSitRubCharm.getBlockInfo(api).blockName,
        UpgradeSkillEnhenceSitRubCharm.getBlockService,
        UpgradeSkillEnhenceSitRubCharm.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhenceSitRubInsert.getBlockInfo(api).protocolName,
        UpgradeSkillEnhenceSitRubInsert.getBlockInfo(api).blockName,
        UpgradeSkillEnhenceSitRubInsert.getBlockService,
        UpgradeSkillEnhenceSitRubInsert.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhenceStompRubPutToShoe.getBlockInfo(api).protocolName,
        UpgradeSkillEnhenceStompRubPutToShoe.getBlockInfo(api).blockName,
        UpgradeSkillEnhenceStompRubPutToShoe.getBlockService,
        UpgradeSkillEnhenceStompRubPutToShoe.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhencePutToBreastCharm.getBlockInfo(api).protocolName,
        UpgradeSkillEnhencePutToBreastCharm.getBlockInfo(api).blockName,
        UpgradeSkillEnhencePutToBreastCharm.getBlockService,
        UpgradeSkillEnhencePutToBreastCharm.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhenceThrustExcitement.getBlockInfo(api).protocolName,
        UpgradeSkillEnhenceThrustExcitement.getBlockInfo(api).blockName,
        UpgradeSkillEnhenceThrustExcitement.getBlockService,
        UpgradeSkillEnhenceThrustExcitement.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhenceCrawlLickEat.getBlockInfo(api).protocolName,
        UpgradeSkillEnhenceCrawlLickEat.getBlockInfo(api).blockName,
        UpgradeSkillEnhenceCrawlLickEat.getBlockService,
        UpgradeSkillEnhenceCrawlLickEat.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhenceCrawlLickBlur.getBlockInfo(api).protocolName,
        UpgradeSkillEnhenceCrawlLickBlur.getBlockInfo(api).blockName,
        UpgradeSkillEnhenceCrawlLickBlur.getBlockService,
        UpgradeSkillEnhenceCrawlLickBlur.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhencePutToShoeBlur.getBlockInfo(api).protocolName,
        UpgradeSkillEnhencePutToShoeBlur.getBlockInfo(api).blockName,
        UpgradeSkillEnhencePutToShoeBlur.getBlockService,
        UpgradeSkillEnhencePutToShoeBlur.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhencePinchCrippled.getBlockInfo(api).protocolName,
        UpgradeSkillEnhencePinchCrippled.getBlockInfo(api).blockName,
        UpgradeSkillEnhencePinchCrippled.getBlockService,
        UpgradeSkillEnhencePinchCrippled.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhenceJumpStompCrippled.getBlockInfo(api).protocolName,
        UpgradeSkillEnhenceJumpStompCrippled.getBlockInfo(api).blockName,
        UpgradeSkillEnhenceJumpStompCrippled.getBlockService,
        UpgradeSkillEnhenceJumpStompCrippled.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhenceStompCrippled.getBlockInfo(api).protocolName,
        UpgradeSkillEnhenceStompCrippled.getBlockInfo(api).blockName,
        UpgradeSkillEnhenceStompCrippled.getBlockService,
        UpgradeSkillEnhenceStompCrippled.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhenceSitRotate.getBlockInfo(api).protocolName,
        UpgradeSkillEnhenceSitRotate.getBlockInfo(api).blockName,
        UpgradeSkillEnhenceSitRotate.getBlockService,
        UpgradeSkillEnhenceSitRotate.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhenceStompRotate.getBlockInfo(api).protocolName,
        UpgradeSkillEnhenceStompRotate.getBlockInfo(api).blockName,
        UpgradeSkillEnhenceStompRotate.getBlockService,
        UpgradeSkillEnhenceStompRotate.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillEnhenceRunRepel.getBlockInfo(api).protocolName,
        UpgradeSkillEnhenceRunRepel.getBlockInfo(api).blockName,
        UpgradeSkillEnhenceRunRepel.getBlockService,
        UpgradeSkillEnhenceRunRepel.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillFragileGrowth.getBlockInfo(api).protocolName,
        UpgradeSkillFragileGrowth.getBlockInfo(api).blockName,
        UpgradeSkillFragileGrowth.getBlockService,
        UpgradeSkillFragileGrowth.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillDamageBigger.getBlockInfo(api).protocolName,
        UpgradeSkillDamageBigger.getBlockInfo(api).blockName,
        UpgradeSkillDamageBigger.getBlockService,
        UpgradeSkillDamageBigger.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillPassiveBigger.getBlockInfo(api).protocolName,
        UpgradeSkillPassiveBigger.getBlockInfo(api).blockName,
        UpgradeSkillPassiveBigger.getBlockService,
        UpgradeSkillPassiveBigger.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillLearnRun.getBlockInfo(api).protocolName,
        UpgradeSkillLearnRun.getBlockInfo(api).blockName,
        UpgradeSkillLearnRun.getBlockService,
        UpgradeSkillLearnRun.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillJumpStomp.getBlockInfo(api).protocolName,
        UpgradeSkillJumpStomp.getBlockInfo(api).blockName,
        UpgradeSkillJumpStomp.getBlockService,
        UpgradeSkillJumpStomp.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillLeftStomp.getBlockInfo(api).protocolName,
        UpgradeSkillLeftStomp.getBlockInfo(api).blockName,
        UpgradeSkillLeftStomp.getBlockService,
        UpgradeSkillLeftStomp.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillStompRub.getBlockInfo(api).protocolName,
        UpgradeSkillStompRub.getBlockInfo(api).blockName,
        UpgradeSkillStompRub.getBlockService,
        UpgradeSkillStompRub.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillSit.getBlockInfo(api).protocolName,
        UpgradeSkillSit.getBlockInfo(api).blockName,
        UpgradeSkillSit.getBlockService,
        UpgradeSkillSit.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillSitRub.getBlockInfo(api).protocolName,
        UpgradeSkillSitRub.getBlockInfo(api).blockName,
        UpgradeSkillSitRub.getBlockService,
        UpgradeSkillSitRub.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillTightenLeg.getBlockInfo(api).protocolName,
        UpgradeSkillTightenLeg.getBlockInfo(api).blockName,
        UpgradeSkillTightenLeg.getBlockService,
        UpgradeSkillTightenLeg.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillUB.getBlockInfo(api).protocolName,
        UpgradeSkillUB.getBlockInfo(api).blockName,
        UpgradeSkillUB.getBlockService,
        UpgradeSkillUB.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillThrust.getBlockInfo(api).protocolName,
        UpgradeSkillThrust.getBlockInfo(api).blockName,
        UpgradeSkillThrust.getBlockService,
        UpgradeSkillThrust.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillInsert.getBlockInfo(api).protocolName,
        UpgradeSkillInsert.getBlockInfo(api).blockName,
        UpgradeSkillInsert.getBlockService,
        UpgradeSkillInsert.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillPutToBreast.getBlockInfo(api).protocolName,
        UpgradeSkillPutToBreast.getBlockInfo(api).blockName,
        UpgradeSkillPutToBreast.getBlockService,
        UpgradeSkillPutToBreast.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillPutToShoe.getBlockInfo(api).protocolName,
        UpgradeSkillPutToShoe.getBlockInfo(api).blockName,
        UpgradeSkillPutToShoe.getBlockService,
        UpgradeSkillPutToShoe.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillFreeBreast.getBlockInfo(api).protocolName,
        UpgradeSkillFreeBreast.getBlockInfo(api).blockName,
        UpgradeSkillFreeBreast.getBlockService,
        UpgradeSkillFreeBreast.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillFreeShoe.getBlockInfo(api).protocolName,
        UpgradeSkillFreeShoe.getBlockInfo(api).blockName,
        UpgradeSkillFreeShoe.getBlockService,
        UpgradeSkillFreeShoe.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillFreeUB.getBlockInfo(api).protocolName,
        UpgradeSkillFreeUB.getBlockInfo(api).blockName,
        UpgradeSkillFreeUB.getBlockService,
        UpgradeSkillFreeUB.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillBreastPress.getBlockInfo(api).protocolName,
        UpgradeSkillBreastPress.getBlockInfo(api).blockName,
        UpgradeSkillBreastPress.getBlockService,
        UpgradeSkillBreastPress.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillBreastPressRub.getBlockInfo(api).protocolName,
        UpgradeSkillBreastPressRub.getBlockInfo(api).blockName,
        UpgradeSkillBreastPressRub.getBlockService,
        UpgradeSkillBreastPressRub.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillCrawlBeat.getBlockInfo(api).protocolName,
        UpgradeSkillCrawlBeat.getBlockInfo(api).blockName,
        UpgradeSkillCrawlBeat.getBlockService,
        UpgradeSkillCrawlBeat.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillCrawlLick.getBlockInfo(api).protocolName,
        UpgradeSkillCrawlLick.getBlockInfo(api).blockName,
        UpgradeSkillCrawlLick.getBlockService,
        UpgradeSkillCrawlLick.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillSprayMilk.getBlockInfo(api).protocolName,
        UpgradeSkillSprayMilk.getBlockInfo(api).blockName,
        UpgradeSkillSprayMilk.getBlockService,
        UpgradeSkillSprayMilk.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillIceOverwrite.getBlockInfo(api).protocolName,
        UpgradeSkillIceOverwrite.getBlockInfo(api).blockName,
        UpgradeSkillIceOverwrite.getBlockService,
        UpgradeSkillIceOverwrite.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillIceSingle.getBlockInfo(api).protocolName,
        UpgradeSkillIceSingle.getBlockInfo(api).blockName,
        UpgradeSkillIceSingle.getBlockService,
        UpgradeSkillIceSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillExplodeRange.getBlockInfo(api).protocolName,
        UpgradeSkillExplodeRange.getBlockInfo(api).blockName,
        UpgradeSkillExplodeRange.getBlockService,
        UpgradeSkillExplodeRange.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillExplodeSingle.getBlockInfo(api).protocolName,
        UpgradeSkillExplodeSingle.getBlockInfo(api).blockName,
        UpgradeSkillExplodeSingle.getBlockService,
        UpgradeSkillExplodeSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillPoisonSingle.getBlockInfo(api).protocolName,
        UpgradeSkillPoisonSingle.getBlockInfo(api).blockName,
        UpgradeSkillPoisonSingle.getBlockService,
        UpgradeSkillPoisonSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeSkillInjureSingle.getBlockInfo(api).protocolName,
        UpgradeSkillInjureSingle.getBlockInfo(api).blockName,
        UpgradeSkillInjureSingle.getBlockService,
        UpgradeSkillInjureSingle.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        UpgradeDefenseStressingDecreaseDamage.getBlockInfo(api).protocolName,
        UpgradeDefenseStressingDecreaseDamage.getBlockInfo(api).blockName,
        UpgradeDefenseStressingDecreaseDamage.getBlockService,
        UpgradeDefenseStressingDecreaseDamage.createBlockState(api)
    )
    // blockState = BlockManager.registerBlock(
    //     api,
    //     blockState,
    //     PropOtherUseArtifact.getBlockInfo(api).protocolName,
    //     PropOtherUseArtifact.getBlockInfo(api).blockName,
    //     PropOtherUseArtifact.getBlockService,
    //     PropOtherUseArtifact.createBlockState(api)
    // )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropOtherUseGiantessCharacter.getBlockInfo(api).protocolName,
        PropOtherUseGiantessCharacter.getBlockInfo(api).blockName,
        PropOtherUseGiantessCharacter.getBlockService,
        PropOtherUseGiantessCharacter.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropOtherSmallerWater.getBlockInfo(api).protocolName,
        PropOtherSmallerWater.getBlockInfo(api).blockName,
        PropOtherSmallerWater.getBlockService,
        PropOtherSmallerWater.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropOtherCapture.getBlockInfo(api).protocolName,
        PropOtherCapture.getBlockInfo(api).blockName,
        PropOtherCapture.getBlockService,
        PropOtherStrong.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropOtherStrong.getBlockInfo(api).protocolName,
        PropOtherStrong.getBlockInfo(api).blockName,
        PropOtherStrong.getBlockService,
        PropOtherStrong.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropOtherRun.getBlockInfo(api).protocolName,
        PropOtherRun.getBlockInfo(api).blockName,
        PropOtherRun.getBlockService,
        PropOtherRun.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropOtherHolyWater.getBlockInfo(api).protocolName,
        PropOtherHolyWater.getBlockInfo(api).blockName,
        PropOtherHolyWater.getBlockService,
        PropOtherHolyWater.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropShareDefault.getBlockInfo(api).protocolName,
        PropShareDefault.getBlockInfo(api).blockName,
        PropShareDefault.getBlockService,
        PropShareDefault.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropArtifactRestoreCloth.getBlockInfo(api).protocolName,
        PropArtifactRestoreCloth.getBlockInfo(api).blockName,
        PropArtifactRestoreCloth.getBlockService,
        PropArtifactRestoreCloth.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropArtifactInfinityBig.getBlockInfo(api).protocolName,
        PropArtifactInfinityBig.getBlockInfo(api).blockName,
        PropArtifactInfinityBig.getBlockService,
        PropArtifactInfinityBig.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropArtifactCallGoddess.getBlockInfo(api).protocolName,
        PropArtifactCallGoddess.getBlockInfo(api).blockName,
        PropArtifactCallGoddess.getBlockService,
        PropArtifactCallGoddess.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropArtifactGiantessStimulator.getBlockInfo(api).protocolName,
        PropArtifactGiantessStimulator.getBlockInfo(api).blockName,
        PropArtifactGiantessStimulator.getBlockService,
        PropArtifactGiantessStimulator.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropArtifactGiantessController.getBlockInfo(api).protocolName,
        PropArtifactGiantessController.getBlockInfo(api).blockName,
        PropArtifactGiantessController.getBlockService,
        PropArtifactGiantessController.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropArtifactSpecificGiantess.getBlockInfo(api).protocolName,
        PropArtifactSpecificGiantess.getBlockInfo(api).blockName,
        PropArtifactSpecificGiantess.getBlockService,
        PropArtifactSpecificGiantess.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        PropArtifactMissionComplete.getBlockInfo(api).protocolName,
        PropArtifactMissionComplete.getBlockInfo(api).blockName,
        PropArtifactMissionComplete.getBlockService,
        PropArtifactMissionComplete.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        BehaviourBalance.getBlockInfo(api).protocolName,
        BehaviourBalance.getBlockInfo(api).blockName,
        BehaviourBalance.getBlockService,
        BehaviourBalance.createBlockState(api)
    )
    // blockState = BlockManager.registerBlock(
    //     api,
    //     blockState,
    //     BehaviourPlayerGoddess.getBlockInfo(api).protocolName,
    //     BehaviourPlayerGoddess.getBlockInfo(api).blockName,
    //     BehaviourPlayerGoddess.getBlockService,
    //     BehaviourPlayerGoddess.createBlockState(api)
    // )
    // blockState = BlockManager.registerBlock(
    //     api,
    //     blockState,
    //     BehaviourAttackPlayerGiantess.getBlockInfo(api).protocolName,
    //     BehaviourAttackPlayerGiantess.getBlockInfo(api).blockName,
    //     BehaviourAttackPlayerGiantess.getBlockService,
    //     BehaviourAttackPlayerGiantess.createBlockState(api)
    // )
    // blockState = BlockManager.registerBlock(
    //     api,
    //     blockState,
    //     BehaviourProtectPlayerGiantess.getBlockInfo(api).protocolName,
    //     BehaviourProtectPlayerGiantess.getBlockInfo(api).blockName,
    //     BehaviourProtectPlayerGiantess.getBlockService,
    //     BehaviourProtectPlayerGiantess.createBlockState(api)
    // )
    // blockState = BlockManager.registerBlock(
    //     api,
    //     blockState,
    //     BehaviourProtectPlayerGoddess.getBlockInfo(api).protocolName,
    //     BehaviourProtectPlayerGoddess.getBlockInfo(api).blockName,
    //     BehaviourProtectPlayerGoddess.getBlockService,
    //     BehaviourProtectPlayerGoddess.createBlockState(api)
    // )
    // blockState = BlockManager.registerBlock(
    //     api,
    //     blockState,
    //     BehaviourProtectLevelGiantess1.getBlockInfo(api).protocolName,
    //     BehaviourProtectLevelGiantess1.getBlockInfo(api).blockName,
    //     BehaviourProtectLevelGiantess1.getBlockService,
    //     BehaviourProtectLevelGiantess1.createBlockState(api)
    // )
    // blockState = BlockManager.registerBlock(
    //     api,
    //     blockState,
    //     BehaviourProtectLevelGiantess2.getBlockInfo(api).protocolName,
    //     BehaviourProtectLevelGiantess2.getBlockInfo(api).blockName,
    //     BehaviourProtectLevelGiantess2.getBlockService,
    //     BehaviourProtectLevelGiantess2.createBlockState(api)
    // )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        EventGameHard.getBlockInfo(api).protocolName,
        EventGameHard.getBlockInfo(api).blockName,
        EventGameHard.getBlockService,
        EventGameHard.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        EventGameCallGoddess.getBlockInfo(api).protocolName,
        EventGameCallGoddess.getBlockInfo(api).blockName,
        EventGameCallGoddess.getBlockService,
        EventGameCallGoddess.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        EventGameAttackCallGiantess.getBlockInfo(api).protocolName,
        EventGameAttackCallGiantess.getBlockInfo(api).blockName,
        EventGameAttackCallGiantess.getBlockService,
        EventGameAttackCallGiantess.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        EventGameProtectCallGiantess.getBlockInfo(api).protocolName,
        EventGameProtectCallGiantess.getBlockInfo(api).blockName,
        EventGameProtectCallGiantess.getBlockService,
        EventGameProtectCallGiantess.createBlockState(api)
    )
    // blockState = BlockManager.registerBlock(
    //     api,
    //     blockState,
    //     EventGameProtectCallGiantess.getBlockInfo(api).protocolName,
    //     EventGameProtectCallGiantess.getBlockInfo(api).blockName,
    //     EventGameProtectCallGiantess.getBlockService,
    //     EventGameProtectCallGiantess.createBlockState(api)
    // )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        EventGameProtectCallGoddess.getBlockInfo(api).protocolName,
        EventGameProtectCallGoddess.getBlockInfo(api).blockName,
        EventGameProtectCallGoddess.getBlockService,
        EventGameProtectCallGoddess.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        EventGameProtectEliteGiantess.getBlockInfo(api).protocolName,
        EventGameProtectEliteGiantess.getBlockInfo(api).blockName,
        EventGameProtectEliteGiantess.getBlockService,
        EventGameProtectEliteGiantess.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        EventGameProtectArmy.getBlockInfo(api).protocolName,
        EventGameProtectArmy.getBlockInfo(api).blockName,
        EventGameProtectArmy.getBlockService,
        EventGameProtectArmy.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        EventGameProtectLevelGiantess1.getBlockInfo(api).protocolName,
        EventGameProtectLevelGiantess1.getBlockInfo(api).blockName,
        EventGameProtectLevelGiantess1.getBlockService,
        EventGameProtectLevelGiantess1.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        EventGameProtectLevelGiantess2.getBlockInfo(api).protocolName,
        EventGameProtectLevelGiantess2.getBlockInfo(api).blockName,
        EventGameProtectLevelGiantess2.getBlockService,
        EventGameProtectLevelGiantess2.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        FSMGirlExcitement.getBlockInfo(api).protocolName,
        FSMGirlExcitement.getBlockInfo(api).blockName,
        FSMGirlExcitement.getBlockService,
        FSMGirlExcitement.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        FSMLevelGiantessExcitement.getBlockInfo(api).protocolName,
        FSMLevelGiantessExcitement.getBlockInfo(api).blockName,
        FSMLevelGiantessExcitement.getBlockService,
        FSMLevelGiantessExcitement.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        FSMGirlClimax.getBlockInfo(api).protocolName,
        FSMGirlClimax.getBlockInfo(api).blockName,
        FSMGirlClimax.getBlockService,
        FSMGirlClimax.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        FSMLevelGiantessClimax.getBlockInfo(api).protocolName,
        FSMLevelGiantessClimax.getBlockInfo(api).blockName,
        FSMLevelGiantessClimax.getBlockService,
        FSMLevelGiantessClimax.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        FSMLittleManFall.getBlockInfo(api).protocolName,
        FSMLittleManFall.getBlockInfo(api).blockName,
        FSMLittleManFall.getBlockService,
        FSMLittleManFall.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        FSMLittleManRepel.getBlockInfo(api).protocolName,
        FSMLittleManRepel.getBlockInfo(api).blockName,
        FSMLittleManRepel.getBlockService,
        FSMLittleManRepel.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        LevelGiantessPlayerGiantess.getBlockInfo(api).protocolName,
        LevelGiantessPlayerGiantess.getBlockInfo(api).blockName,
        LevelGiantessPlayerGiantess.getBlockService,
        LevelGiantessPlayerGiantess.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        LevelGiantessProtectBoss1.getBlockInfo(api).protocolName,
        LevelGiantessProtectBoss1.getBlockInfo(api).blockName,
        LevelGiantessProtectBoss1.getBlockService,
        LevelGiantessProtectBoss1.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        LevelGiantessProtectBoss2.getBlockInfo(api).protocolName,
        LevelGiantessProtectBoss2.getBlockInfo(api).blockName,
        LevelGiantessProtectBoss2.getBlockService,
        LevelGiantessProtectBoss2.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillLittleManSwiping.getBlockInfo(api).protocolName,
        SkillLittleManSwiping.getBlockInfo(api).blockName,
        SkillLittleManSwiping.getBlockService,
        SkillLittleManSwiping.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillLittleManFastRun.getBlockInfo(api).protocolName,
        SkillLittleManFastRun.getBlockInfo(api).blockName,
        SkillLittleManFastRun.getBlockService,
        SkillLittleManFastRun.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessStomp.getBlockInfo(api).protocolName,
        SkillGiantessStomp.getBlockInfo(api).blockName,
        SkillGiantessStomp.getBlockService,
        SkillGiantessStomp.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessStompRub.getBlockInfo(api).protocolName,
        SkillGiantessStompRub.getBlockInfo(api).blockName,
        SkillGiantessStompRub.getBlockService,
        SkillGiantessStompRub.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessLeftStomp.getBlockInfo(api).protocolName,
        SkillGiantessLeftStomp.getBlockInfo(api).blockName,
        SkillGiantessLeftStomp.getBlockService,
        SkillGiantessLeftStomp.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessJumpStomp.getBlockInfo(api).protocolName,
        SkillGiantessJumpStomp.getBlockInfo(api).blockName,
        SkillGiantessJumpStomp.getBlockService,
        SkillGiantessJumpStomp.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessKeepSit.getBlockInfo(api).protocolName,
        SkillGiantessKeepSit.getBlockInfo(api).blockName,
        SkillGiantessKeepSit.getBlockService,
        SkillGiantessKeepSit.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessStandToSit.getBlockInfo(api).protocolName,
        SkillGiantessStandToSit.getBlockInfo(api).blockName,
        SkillGiantessStandToSit.getBlockService,
        SkillGiantessStandToSit.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessSitToStand.getBlockInfo(api).protocolName,
        SkillGiantessSitToStand.getBlockInfo(api).blockName,
        SkillGiantessSitToStand.getBlockService,
        SkillGiantessSitToStand.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessSitRub.getBlockInfo(api).protocolName,
        SkillGiantessSitRub.getBlockInfo(api).blockName,
        SkillGiantessSitRub.getBlockService,
        SkillGiantessSitRub.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessSitTightenLeg.getBlockInfo(api).protocolName,
        SkillGiantessSitTightenLeg.getBlockInfo(api).blockName,
        SkillGiantessSitTightenLeg.getBlockService,
        SkillGiantessSitTightenLeg.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessSitHeavyStressing.getBlockInfo(api).protocolName,
        SkillGiantessSitHeavyStressing.getBlockInfo(api).blockName,
        SkillGiantessSitHeavyStressing.getBlockService,
        SkillGiantessSitHeavyStressing.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessSitHeavyStressingBreast.getBlockInfo(api).protocolName,
        SkillGiantessSitHeavyStressingBreast.getBlockInfo(api).blockName,
        SkillGiantessSitHeavyStressingBreast.getBlockService,
        SkillGiantessSitHeavyStressingBreast.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessSitHeavyStressingTrigoneAndButt.getBlockInfo(api).protocolName,
        SkillGiantessSitHeavyStressingTrigoneAndButt.getBlockInfo(api).blockName,
        SkillGiantessSitHeavyStressingTrigoneAndButt.getBlockService,
        SkillGiantessSitHeavyStressingTrigoneAndButt.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessSitDeath.getBlockInfo(api).protocolName,
        SkillGiantessSitDeath.getBlockInfo(api).blockName,
        SkillGiantessSitDeath.getBlockService,
        SkillGiantessSitDeath.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessKeepUB.getBlockInfo(api).protocolName,
        SkillGiantessKeepUB.getBlockInfo(api).blockName,
        SkillGiantessKeepUB.getBlockService,
        SkillGiantessKeepUB.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessPickToUB.getBlockInfo(api).protocolName,
        SkillGiantessPickToUB.getBlockInfo(api).blockName,
        SkillGiantessPickToUB.getBlockService,
        SkillGiantessPickToUB.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessUBToPick.getBlockInfo(api).protocolName,
        SkillGiantessUBToPick.getBlockInfo(api).blockName,
        SkillGiantessUBToPick.getBlockService,
        SkillGiantessUBToPick.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessThrust.getBlockInfo(api).protocolName,
        SkillGiantessThrust.getBlockInfo(api).blockName,
        SkillGiantessThrust.getBlockService,
        SkillGiantessThrust.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessInsert.getBlockInfo(api).protocolName,
        SkillGiantessInsert.getBlockInfo(api).blockName,
        SkillGiantessInsert.getBlockService,
        SkillGiantessInsert.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessPutToBreast.getBlockInfo(api).protocolName,
        SkillGiantessPutToBreast.getBlockInfo(api).blockName,
        SkillGiantessPutToBreast.getBlockService,
        SkillGiantessPutToBreast.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessPutToShoe.getBlockInfo(api).protocolName,
        SkillGiantessPutToShoe.getBlockInfo(api).blockName,
        SkillGiantessPutToShoe.getBlockService,
        SkillGiantessPutToShoe.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessFreeUB.getBlockInfo(api).protocolName,
        SkillGiantessFreeUB.getBlockInfo(api).blockName,
        SkillGiantessFreeUB.getBlockService,
        SkillGiantessFreeUB.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessFreeBreast.getBlockInfo(api).protocolName,
        SkillGiantessFreeBreast.getBlockInfo(api).blockName,
        SkillGiantessFreeBreast.getBlockService,
        SkillGiantessFreeBreast.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessFreeShoe.getBlockInfo(api).protocolName,
        SkillGiantessFreeShoe.getBlockInfo(api).blockName,
        SkillGiantessFreeShoe.getBlockService,
        SkillGiantessFreeShoe.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessUBHeavyStressing.getBlockInfo(api).protocolName,
        SkillGiantessUBHeavyStressing.getBlockInfo(api).blockName,
        SkillGiantessUBHeavyStressing.getBlockService,
        SkillGiantessUBHeavyStressing.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessBreastPress.getBlockInfo(api).protocolName,
        SkillGiantessBreastPress.getBlockInfo(api).blockName,
        SkillGiantessBreastPress.getBlockService,
        SkillGiantessBreastPress.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessBreastPressRub.getBlockInfo(api).protocolName,
        SkillGiantessBreastPressRub.getBlockInfo(api).blockName,
        SkillGiantessBreastPressRub.getBlockService,
        SkillGiantessBreastPressRub.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessCrawlBeat.getBlockInfo(api).protocolName,
        SkillGiantessCrawlBeat.getBlockInfo(api).blockName,
        SkillGiantessCrawlBeat.getBlockService,
        SkillGiantessCrawlBeat.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessCrawlLick.getBlockInfo(api).protocolName,
        SkillGiantessCrawlLick.getBlockInfo(api).blockName,
        SkillGiantessCrawlLick.getBlockService,
        SkillGiantessCrawlLick.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        SkillGiantessSprayMilk.getBlockInfo(api).protocolName,
        SkillGiantessSprayMilk.getBlockInfo(api).blockName,
        SkillGiantessSprayMilk.getBlockService,
        SkillGiantessSprayMilk.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        InteractionBlessGirl.getBlockInfo(api).protocolName,
        InteractionBlessGirl.getBlockInfo(api).blockName,
        InteractionBlessGirl.getBlockService,
        InteractionBlessGirl.createBlockState(api)
    )
    blockState = BlockManager.registerBlock(
        api,
        blockState,
        InteractionWeaponGirl.getBlockInfo(api).protocolName,
        InteractionWeaponGirl.getBlockInfo(api).blockName,
        InteractionWeaponGirl.getBlockService,
        InteractionWeaponGirl.createBlockState(api)
    )






    return blockState
}

export let initAllBlocks = (state: state, allBlockNamesNotInit) => {
    return _invokeServiceFunc(state, getModAPI(state), "init", allBlockNamesNotInit)
}

export let init = (state: state) => {
    let blockState = BlockManager.createState()

    blockState = registerAllBlocks(blockState)

    state = setBlockState_(state, blockState)

    return initAllBlocks(state, NullableUtils.getEmpty())
}

export let getBlockAPI = () => {
    return {
        getBlockState: (state: state, blockProtocolName: blockProtocolName, blockName): blockState => {
            return BlockManager.getBlockStateExn(getBlockState(state), blockProtocolName, blockName)
        },
        setBlockState: (state: state, blockProtocolName: blockProtocolName, blockName, blockState): state => {
            return setBlockState_(state, BlockManager.setBlockState(getBlockState(state), blockProtocolName, blockName, blockState))
        },

        getBlockService: (state: state, blockProtocolName: blockProtocolName, blockName): blockState => {
            return BlockManager.getBlockServiceExn(getBlockState(state), blockProtocolName, blockName)
        },

        getAllBlockServiceFuncWithDefault: getAllBlockServiceFuncWithDefault,
    }
}

export let buildAPI = (): api => {
    return {
        NumberUtils: NumberUtils,
        NullableUtils: NullableUtils,
        ArrayUtils: ArrayUtils,
        TransformUtils: TransformUtils,
        DamageUtils: DamageUtils,
        TupleUtils: TupleUtils,
        MutableNumberMapUtils: MutableNumberMapUtils,
        MutableMapUtils: MutableMapUtils,
        MutableRecordUtils: MutableRecordUtils,

        ModelLoader: ModelLoader,
        Collision: Collision,
        StateMachine: StateMachine,
        GPUSkin: GPUSkin,
        Flow: Flow,
        SoundManager: SoundManager,
        ArticluatedAnimation: ArticluatedAnimation,
        LOD: LOD,
        ParticleManager: ParticleManager,
        // Terrain: Terrain,
        // UI:UI
        NewThreeInstance: NewThreeInstance,
        Loader: Loader,
        Device: Device,
        PathFind: PathFind,


        GiantessBuildUtils: GiantessBuildUtils,
        LittleManBuildUtils: LittleManBuildUtils,



        blockAPI: getBlockAPI(),

        getIsProduction: getIsProduction,

        internation: {
            isChinese: isChinese,
            isEnglish: isEnglish,
        },

        vector2: {
            create: (x, y) => {
                return new Vector2(x, y)
            },
            fromArray: (v1, arr) => v1.fromArray(arr),
        },
        vector3: {
            create: (x, y, z) => {
                return new Vector3(x, y, z)
            },
            createEmpty: () => {
                return new Vector3()
            },
            add: (v1, v2) => {
                return v1.add(v2)
            },
            sub: (v1, v2) => {
                return v1.sub(v2)
            },
            getX: (v1) => {
                return v1.x
            },
            getZ: (v1) => {
                return v1.z
            },
            setZ: (v1, z) => {
                return v1.setZ(z)
            },
            getY: (v1) => {
                return v1.y
            },
            setY: (v1, y) => {
                return v1.setY(y)
            },
            set: (v1, x, y, z) => {
                return v1.set(x, y, z)
            },
            multiply: (v1, v2) => v1.multiply(v2),
            multiplyScalar: (v1, scalar) => v1.multiplyScalar(scalar),
            setScalar: (v1, scalar) => v1.setScalar(scalar),
            fromArray: (v1, arr) => v1.fromArray(arr),
            toArray: (v1, arr) => v1.toArray(arr),
            clone: (v1) => v1.clone(),
            normalize: (v1) => v1.normalize(),
            distanceToSquared: (v1, v2) => v1.distanceToSquared(v2),
            distanceTo: (v1, v2) => v1.distanceTo(v2),
            applyQuaternion: (v1, quaternion) => v1.applyQuaternion(quaternion),
            getLength: (v1) => v1.length(),

            getTempVector1: () => _v1,
            getTempVector2: () => _v2,
            getTempVector3: () => _v3,
        },
        quaternion: {
            create: (x, y, z, w) => new Quaternion(x, y, z, w),
            clone: (q1) => q1.clone(),
        },
        box3: {
            createEmpty: () => new Box3(),
            getSize: (b1, result) => b1.getSize(result),
            getCenter: (b1, result) => b1.getCenter(result),
            setFromCenterAndSize: (b1, center, size) => b1.setFromCenterAndSize(center, size),
            clone: (b1) => b1.clone(),
            union: (b1, b2) => b1.union(b2),
            copy: (source, target) => source.copy(target),
            intersectsBox: (b1, b2) => b1.intersectsBox(b2),
            applyMatrix4: (b1, m1) => b1.applyMatrix4(m1),
            expandByScalar: (b1, scalar) => b1.expandByScalar(scalar),
            getBoxVolumn: getBoxVolumn,
            getBoxMaxSize: getBoxMaxSize,
            getBoxBottomPoint: getBoxBottomPoint,
            getBoxTopPoint: getBoxTopPoint,
            setBoxHeight: setBoxHeight,

            getTempBox1: () => _b1,
        },
        obb: {
            toBox3: (o1) => o1.toBox3(),
            getCenter: (o1) => o1.center,
            makeOBBHeightMax: makeOBBHeightMax,
            expandOBB: expandOBB,
        },
        matrix4: {
            create: () => new Matrix4(),
            compose: (mat, position, quaternion, scale) => mat.compose(position, quaternion, scale),
            getScaleFromMatrix4: getScaleFromMatrix4,
            setScaleToMatrix4: setScaleToMatrix4,
        },
        material: {
            getFrontSide: () => FrontSide,
            getDoubleSide: () => DoubleSide,
            getNoBlending: () => NoBlending,
            createColor: (r, g, b) => new Color(r, g, b),

            setSide: (m, side) => {
                m.side = side
                return m
            },
            setAlphaTest: (m, value) => {
                m.alphaTest = value
                return m
            },
            setBlending: (m, value) => {
                m.blending = value
                return m
            },
            setColor: (m, value) => {
                m.color = value
                return m
            },
            setSpecular: (m, value) => {
                m.specular = value
                return m
            },
            setShininess: (m, value) => {
                m.shininess = value
                return m
            },
        },
        gameObject: {
            getGameObjectByName: (gameObject, name) => {
                return gameObject.getObjectByName(name)
            },
            getWorldPosition: (gameObject) => {
                return gameObject.getWorldPosition(new Vector3())
            },
            clone: (gameObject) => {
                return gameObject.clone()
            },
            forEach: (gameObject, func) => {
                gameObject.traverse(func)
            },
            isSkinnedMesh: (gameObject) => gameObject.isSkinnedMesh,

            getAnimationClip: (gameObject) => gameObject.animations[0],
        },

        event: {
            on: (state, name, handler) => {
                return setAbstractState(state, Event.on(getAbstractState(state), name, (state: state, customEvent) => {
                    return handler(getModAPI(state), state as state, customEvent)
                }))
            },
            onWithUserData: (state, name, handler) => {
                return setAbstractState(state, Event.onWithUserData(getAbstractState(state), name, (state: state, customEvent) => {
                    return handler(getModAPI(state), state as state, customEvent)
                }))
            },
            onForGetData: (state, name, handler) => {
                return setAbstractState(state, Event.onForGetData(getAbstractState(state), name, (state: state, customEvent) => {
                    return handler(getModAPI(state), state as state, customEvent)
                }))
            },
            onByReadWriteState: (state, name, handler) => {
                return setAbstractState(state, Event.onByReadWriteState(getAbstractState(state), name, (customEvent) => {
                    return handler(getModAPI(state), customEvent)
                }))
            },
            // off: (state, name, handler) => {
            //     return setAbstractState(state, Event.off(getAbstractState(state), name, (state, customEvent) => {
            //         return handler(getModAPI(state), state, customEvent)
            //     }))
            // },
            offAll: (state, name) => {
                return setAbstractState(state, Event.offAll(getAbstractState(state), name))
            },
            trigger: Event.trigger,

            getLoadWholeResourceEventName: () => "getLoadWholeResourceEventName",
            getPlayIndexSoundEventName: () => "getPlayIndexSoundEventName",
            getStopIndexSoundEventName: () => "getStopIndexSoundEventName",

            getLoadSceneResourceEventName: () => "getLoadSceneResourceEventName",
            getInitWhenImportSceneEventName: () => "getInitWhenImportSceneEventName",
            getUpdateEventName: () => "getUpdateEventName",
            getDisposeEventName: () => "getDisposeEventName",
            getHandleGiantessRemainHpEventName: () => "getHandleGiantessRemainHpEventName",
            getHandleDamageArmyEventName: () => "getHandleDamageArmyEventName",
            getHandleDamageGiantessEventName: () => "getHandleDamageGiantessEventName",
            getHandleDamageLittleManEventName: () => "getHandleDamageLittleManEventName",
            getHandleAfterUsePropEventName: () => "getHandleAfterUsePropEventName",
            getHandleAfterDamageLittleManEventName: () => "getHandleAfterDamageLittleManEventName",
            getHandleAfterDamageGiantessEventName: () => "getHandleAfterDamageGiantessEventName",
            getLevelGiantessDestoyedEventName: () => "getLevelGiantessDestoyedEventName",
            // getEnemyGiantessDestoyedEventName: () => "getEnemyGiantessDestoyedEventName",
            getBossDestroyedEventName: () => "getBossDestroyedEventName",
            getUpdateUIEventName: () => "getUpdateUIEventName",
            getBeforeAddGirlEventName: () => "getBeforeAddGirlEventName",
            getAfterRemoveGirlEventName: () => "getAfterRemoveGirlEventName",
            getGenerateArmyEventName: () => "getGenerateArmyEventName",
            getMissionFinishEventName: getMissionFinishEventName,
            getGetLittleManValueEventName: getGetLittleManValueEventName,
            getGiantessStressingEventName: getGiantessStressingEventName,
            getGiantessExcitementEventName: getGiantessExcitementEventName,
            getGiantessClimaxEventName: getGiantessClimaxEventName,
            getGenerateLittleManRandomCareerEventName: getGenerateLittleManRandomCareerEventName,
            getGenerateGiantessRandomCareerEventName: getGenerateGiantessRandomCareerEventName,
            getTriggerPlayerGirlEatHandlerEventName: getTriggerPlayerGirlEatHandlerEventName,
            getPickPropRangeDistanceFactorForLittleManEventName: getPickPropRangeDistanceFactorForLittleManEventName,
            getGetPropEventName: getGetPropEventName,
            getStompHitTerrainEventName: getStompHitTerrainEventName,
            getStartKeepStompEventName: getStartKeepStompEventName,
            getEndStompBackEventName: getEndStompBackEventName,
            getFirstStartKeepLeftStompEventName: getFirstStartKeepLeftStompEventName,
            getEndLeftStompBackEventName: getEndLeftStompBackEventName,
            getInsertEventName: getInsertEventName,
            getPutToBreastEventName: getPutToBreastEventName,
            getPutToShoeEventName: getPutToShoeEventName,
            getPickupEventName: getPickupEventName,
            getStartKeepBreastPressEventName: getStartKeepBreastPressEventName,
            getEndBreastPressBackEventName: getEndBreastPressBackEventName,
            getFreeUBEventName: getFreeUBEventName,
            getFreeShoeEventName: getFreeShoeEventName,
            getRemovePickDataEventName: getRemovePickDataEventName,
            getRemoveUBDataEventName: getRemoveUBDataEventName,
            getRemoveBreastDataEventName: getRemoveBreastDataEventName,
            getRemoveShoeDataEventName: getRemoveShoeDataEventName,

            getKeydownEventName: () => "getKeydownEventName",
            getKeyupEventName: () => "getKeyupEventName",
            getPointdownEventName: () => "getPointdownEventName",
            getPointupEventName: () => "getPointupEventName",
        },
        ui: {
            deferShow: (dispatchEventFunc, state, data) => {
                state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), state => {
                    dispatchEventFunc(data)

                    // if (hasOpenedModal(state)) {
                    //     throw new Error("shouldn't has opened modal")
                    // }

                    if (Camera.isCanLock(getAbstractState(state))) {
                        state = (setAbstractState(state, CameraControls.unlock(getAbstractState(state))))
                    }

                    state = handleOpenModal(state)

                    return Promise.resolve(state)
                }, getDeferCloseModalTime() * 2 / 1000))

                return state
            },
            hide: (dispatchEventFunc, state, data) => {
                writeState(state)

                dispatchEventFunc(data)

                handleCloseModal()

                return readState()
            },
        },
        sceneUI: {
            show: (state, data) => {
                return Event.trigger(state, getAbstractState, getSceneUIEventName(), NullableUtils.return_(buildSceneUIEventData(data)))
            },
            showModal: (state, data) => {
                if (Camera.isCanLock(getAbstractState(state))) {
                    state = (setAbstractState(state, CameraControls.unlock(getAbstractState(state))))
                }

                state = handleOpenModal(state)

                return Event.trigger(state, getAbstractState, getSceneUIEventName(), NullableUtils.return_(buildSceneUIEventData(data)))
            },
            hideModal: (state, handlerCloseFunc) => {
                writeState(state)
                // handleCloseModal()
                // state = readState()

                // return Event.trigger(state, getAbstractState, getSceneUIEventName(), NullableUtils.return_(buildSceneUIEventData([])))
                return closePageModal(handlerCloseFunc)
            },
            alert: (text) => {
                Toast.show({
                    content: text
                })
            },
            hasOpenedModal: (state) => {
                return hasOpenedModal(state)
            },
        },
        load: {
            addResourceData: (state, needLoadResourceData) => setAbstractState(state, Loader.addToNeedLoadResourceData(getAbstractState(state), needLoadResourceData)),
            getResource: Loader.getResource,
        },
        sound: {
            play: (state, data) => {
                if (getIsDebug(state) && !state.config.isOpenSound) {
                    return state
                }

                return setAbstractState(state, SoundManager.play(getAbstractState(state), data))
            },
            stop: (state, resourceId) => {
                return setAbstractState(state, SoundManager.stop(getAbstractState(state), resourceId))
            },
        },
        girl: {
            getGirlBox: getGirlBox,
            isGirl: isGirl,
            computeAttenuationByHeightForEffect: computeAttenuationByHeightForEffect,
            isCloth: isCloth,
            getStateMachine: getStateMachineGirl,
            setStateMachine: setStateMachineGirl,
            getBodyHp: getGirlBodyHp,
            getFullHp: getGirlFullHp,
            getCenter: getCenter,
            getHpIncrease: getHpIncreaseGirl,
            setHpIncrease: setHpIncreaseGirl,
            getScaleIncrease: getScaleIncrease,
            setScaleIncrease: setScaleIncrease,
            updatePosition: updatePositionGirl,
            getRotation: getGirlRotation,
            isBack: isBackGirl,
            isActionState: isActionStateGirl,
            getCurrentAnimationName: getCurrentAnimationName,
            setPosition: setGirlPosition,
            getBone: getBone,
            getGirl: getGirl,
            getSkillStateFactor: getSkillStateFactor,
            computeGirlBoxAndSetToState: computeGirlBoxAndSetToState,
            resetAction: resetAction,
            computeAnimatonDurationFactor: computeAnimatonDurationFactor,
            getGiantessCamp: getGiantessCamp,
            // computeGirlBoxAndNotChangeCenterXY: computeGirlBoxAndNotChangeCenterXY,
            getUsedGirlByName: getUsedGirlByName,
            getCurrentUsedGirls: getCurrentUsedGirls,
            buildNameByUsedGirl: buildNameByUsedGirl,


            initWhenImportScene: initWhenImportSceneGirl,
            update: updateGirl,
        },
        camera: {
            update: updateCamera
        },
        littleMan: {
            isLittleMan: isLittleMan,
            initWhenImportScene: initWhenImportSceneLittleMan,
            update: updateLittleMan,
            setActionState: setActionState,
            getStateMachine: getStateMachine,
            shootStartHandler: shootStartHandler,
            getBox: getBox,
            getLookat: getLookat,
            triggerAction: triggerLittleManAction,
            isActionState: isActionState,
            resetIsTriggerAction: resetIsTriggerAction,
            getHpIncrease: getHpIncrease,
            setHpIncrease: setHpIncrease,
            updatePosition: updatePositionLittleMan,
            isBack: isBackLittleMan,

            setPosition: setPosition,
            handleExitControlled: handleExitControlled,
            setStateMachine: setStateMachine,
            createLieState: createLieState,
            createInitialState: createInitialState,
            setWorldPositionAndComputeBox: setWorldPositionAndComputeBox,
            updateMoveCollision: updateMoveCollision,
            buildCameraFar: buildCameraFar,
            getCameraFar: getCameraFar,
            setCameraFar: setCameraFar,
        },
        gameEventDirector: {
            dispose: disposeGameEventDirector,
            initWhenImportScene: initWhenImportSceneGameEventDirector,
        },
        map: {
            initWhenImportScene: initWhenImportSceneMap,
            getRandomMapLoadData: getRandomMapLoadData
        },
        mission: {
            initWhenImportScene: initWhenImportSceneMission,
        },
        configData: {
            setCollisionShapeData: setCollisionShapeData,
            setGirlValue: setGirlValue,
            setGameEventData: setGameEventData,
            setGameEventDirectorData: setGameEventDirectorData,
            setScenaryData: setScenaryData,
            mergeRewardData: (state, data) => {
                return setConfigData(state, {
                    ...getConfigData(state),
                    rewardData: mergeRewardData(NullableUtils.getExn(getConfigData(state).rewardData), data),
                })
            },
        },


        multiplyScalar: multiplyScalar,
        getSizeFactor: getSizeFactor,


        getAbstractState: getAbstractState,
        setAbstractState: setAbstractState,

        getTargetDataForSoldier: getTargetDataForSoldier,
        getArmyValueForAttack: getArmyValueForAttack,
        getEmitSpeedFactor: getEmitSpeedFactor,
        isChangeToLieState: isChangeToLieState,
        createStressingState: createStressingState,
        createDestroyingState: createDestroyingState,
        handleDestroying: handleDestroying,
        handleDestroyed: handleDestroyed,
        buildBloodDecalQueue: buildBloodDecalQueue,
        setDefenseFactor: setDefenseFactor,
        setMoveSpeed: setMoveSpeed,
        setAttackFactor: setAttackFactor,
        setEmitSpeedFactor: setEmitSpeedFactor,
        setCritRatioFactor: setCritRatioFactor,
        // setMissRatio: setMissRatio,
        generateArmy: generateArmy,
        generateCharacterCrowd: generateCharacterCrowd,
        setCamp: setCamp,
        addBoneGroup: addBoneGroup,
        setBonePositionOffset: setBonePositionOffset,
        parseCharacterQueue: parseCharacterQueue,
        getScene: getScene,
        getIsDebug: getIsDebug,
        getVolume: getVolume,
        // getEliteGiantessVolume: getEliteGiantessVolume,
        createMoveState: createMoveState,
        isMaxArmySpeed: isMaxArmySpeed,
        computeEliteGiantessMoveSpeed: computeEliteGiantessMoveSpeed,
        getMoveSpeed: getMoveSpeed,
        getGiantessTransformFunc: getGiantessTransformFunc,
        getPickTransformPrefix: getPickTransformPrefix,
        createBloodData: createBloodData,
        updateEliteGiantessAI: updateEliteGiantessAI,

        updateArmyValue: updateArmyValue,
        updateEliteGiantessValue: updateEliteGiantessValue,
        updateEliteGiantessValueDefault: updateEliteGiantessValueDefault,
        addBox3Helper: addBox3Helper,
        handleCollision: handleCollision,
        buildDownDirection: buildDownDirection,
        getAttackTarget: getAttackTarget,
        getCampExn: getCampExn,
        computeTimeSecond: computeTimeSecond,
        isLieState: isLieState,
        getDamageTypeFactor: getDamageTypeFactor,
        getForceFactor: getForceFactor,
        disposeStaticDynamicUnitData: disposeData,
        checkCurrentState: checkCurrentState,
        queryOBBShapeCollisionWithBox: queryOBBShapeCollisionWithBox,
        queryAllOBBShapesCollisionWithBox: queryAllOBBShapesCollisionWithBox,
        updateTransform: updateTransform,
        handlePickdown: handlePickdown,
        getLocalTransform: getLocalTransform,
        getBoxForPick: getBoxForPick,
        changeStandBoxToLieBox: changeStandBoxToLieBox,
        getShootDirection: getShootDirection,
        getParticleNeedCollisionCheckLoopCount: getParticleNeedCollisionCheckLoopCount,
        getPointBoxForParticle: getPointBoxForParticle,
        getPointBoxForBullet: getPointBoxForBullet,
        getActualGirlHeight: getActualHeight,
        getIsEliteGiantessAttacking: getIsEliteGiantessAttacking,
        setIsEliteGiantessAttacking: setIsEliteGiantessAttacking,
        fixGiantessModelMaterial: fixGiantessModelMaterial,
        getNearDistance: getNearDistance,
        getMiddleDistance: getMiddleDistance,

        createParticleState: createBulletState,
        buildParticleId: buildParticleId,
        setNeedCollisionCheckLoopCount: setNeedCollisionCheckLoopCount,
        getCurrentFrameImageData: getCurrentFrameImageData,
        buildOffsetParticle: buildOffsetParticle,
        getAllEmitParticlesForCollisionCheck: getAllEmitParticlesForCollisionCheck,

        addGun: addGun,
        getTextureImageBase64: (state, id) => Loader.getTextureImageBase64(getAbstractState(state), id),
        handleHitArmy: handleHitArmy,

        disposeGeometry: disposeGeometry,

        addBuff: addBuff,
        getLittleManName: getLittleManName,
        getLittleManValue: getLittleManValue,
        subPropCount: subPropCount,
        getOriginSystemVolume: getOriginSystemVolume,
        getNow: getNow,

        // setGiantessAttribute: setAttribute,
        buildFuncData: buildFuncData,
        updateGiantessItem: updateGiantessItem,
        getValueByUsedGirl: getValueByUsedGirl,


        isLittleCharacterType: isLittleCharacterType,
        isGiantessCharacterType: isGiantessCharacterType,
        isLevelGiantess: isLevelGiantess,
        isLevelGiantessExceptPlayer: isLevelGiantessExceptPlayer,
        isPlayerGoddess: isPlayerGoddess,
        isPlayerGiantess: isPlayerGiantess,
        isEnemyGiantess: isEnemyGiantess,
        triggerGameEvent: trigger,
        addInstantGameEventData: addInstantGameEventData,
        getCommand: getCommand,
        computeIncreaseFactor: computeIncreaseFactor,
        getGirlScale: getGirlScale,
        setGirlScale: setGirlScale,
        selectValidGTSPoint: selectValidGTSPoint,
        addPlayerGoddess: addPlayerGoddess,
        getLookatQuaternion: getLookatQuaternion,
        getPlayerPosition: getPlayerPosition,
        setBehaviourTreeData: setBehaviourTreeData,
        getBehaviourTreeManagerKey: getKey,
        buildTree: buildTree,
        getLevelByCharacter: getLevelByCharacter,
        isRandomRate: isRandomRate,
        isPose: isPose,
        isChangeScaling: isChangeScaling,
        hasPickData: hasPickData,
        hasTarget: hasTarget,
        getGirlValue: getGirlValue,
        getGirlValueByUsedGirl: getValueByUsedGirl,
        isInGirlAttackRange: isInGirlAttackRange,
        getTarget: getTarget,
        clearTarget: clearTarget,
        // isGiantessNotActiveBigger: state => getGirlScale(state, usedGirl) <= getGirlValue(state, usedGirl).initialScale * 2,
        // isGiantessNotActiveBigger: state => getGirlScale(state, usedGirl) <= 25,
        isGiantessNotActiveBigger: (state, usedGirl) => getBiggerCount(state, usedGirl) <= 0,
        getBiggerCount: getBiggerCount,
        getSettingFactorAffectBiggerRate: getSettingFactorAffectBiggerRate,
        getAllAliveArmyData: getAllAliveArmyData,
        getVeryNearestTargetCount: getVeryNearestTargetCount,
        generateId: generateId,
        // selectPlayerGoddessTarget: selectTargetAction,
        walkToTarget: walkToTarget,
        rest: rest,
        stomp: stomp,
        stompRub: stompRub,
        leftStomp: leftStomp,
        jumpStomp: jumpStomp,
        sprayMilk: sprayMilk,
        putToBreast: putToBreast,
        putToShoe: putToShoe,
        freeUB: freeUB,
        freeBreast: freeBreast,
        freeShoe: freeShoe,
        breastPress: breastPress,
        breastPressRub: breastPressRub,
        crawlLick: crawlLick,
        crawlBeat: crawlBeat,
        sitRub: sitRub,
        tightenLeg: sitTightenLeg,
        pickup: pickup,
        pickdown: pickdown,
        pinch: pinch,
        eat: eat,
        thrust: thrust,
        insert: insert,
        changePose: changePose,
        bigger: bigger,
        clearTargetAction: clearTargetAction,
        // resetGiantessControllerBlockState: resetGiantessControllerBlockState,

        setNeedUpdateStatusName: setNeedUpdateStatusName,
        getCurrentMMDCharacterName: getCurrentMMDCharacterName,
        getCurrentMMDCharacterNameByUsedGirl: getCurrentMMDCharacterNameByUsedGirl,
        getMMDName: getMMDName,

        getSceneChapter: getSceneChapter,
        getLanguageDataByData: getLanguageDataByData,

        isChangeCrawlPoseState: isChangeCrawlPoseState,
        getCurrentPose: getCurrentPose,
        triggerGirlAction: triggerAction,
        getExcitement: getExcitement,
        isControlledState: isControlledState,
        generateReward: generateReward,

        hasBuff: hasBuff,
        removeBuff: removeBuff,
        findBuff: findBuff,
        findBuffData: findBuffData,
        subExcitement: subExcitement,
        getDelta: Device.getDelta,
        getDeltaFactor: Device.getDeltaFactor,
        markWhetherNotExecuteGiantessAI: markWhetherNotExecuteGiantessAI,
        getCollisionPartCenter: getCollisionPartCenter,
        getGirlPosition: getGirlPosition,

        getLittleManFullHp: getLittleManFullHp,
        setLittleManHp: setLittleManHp,

        readState: readState,
        writeState: writeState,
        handleMissionComplete: handleMissionComplete,
        handleMissionFail: handleMissionFail,

        getMilkSplashSoundResourceId: getPinchCharacterSoundResourceId,
        getGirlVolume: getGirlVolume,
        getLittleManWorldPosition: getWorldPosition,

        isEnteringNextLevel: isEnteringNextLevel,
        addApplyFuncForNextLevel: addApplyFuncForNextLevel,
        hasGirlValue: hasGirlValue,


        getDifficultyDataPlayLevel: getDifficultyData,
        buildScenePlayLevel: build,
        disposePlayLevel: disposePlayLevel,
        handlePlayLevel: handleLevel,
        setCharacterType: setCharacterType,
        setAllCollisionParts: setAllCollisionParts,
        getDefaultAllCollisionParts: getDefaultAllCollisionParts,
        initWhenImportScenePlayLevel: initWhenImportSceneUtils,
        behaviourTreeManagerInitWhenImportScenePlayLevel: initWhenImportSceneBehaviourTreeManager,
        updateStatus: updateStatus,
        registerDamageDataPlayLevel: resgisterDamageData,
        getPropLoadData: getPropLoadData,
        handleBeforeLoadResourcePlayLevel: handleBeforeLoadResourcePlayLevel,
        initClothHpData: initClothHpData,
        getClothHpData: getClothHpData,
        setUsedMMDData: setUsedMMDData,
        getGameTime: getGameTime,
        updatePlayLevel: updateUtils,
        updateHeadLookatTarget: updateHeadLookatTarget,
        registerBossStatusUpdateFunc: registerBossStatusUpdateFunc,
        parseAndAddResourcesTerrain: parseAndAddResources,
        getDestroyRate: getDestroyedRate,
        // isSceneChapter: isSceneChapter,

        isCanGenerateMax: isCanGenerateMax,
        generateArmyInSpecificPosition: generateArmyInSpecificPosition,
        generateEliteGiantesses: generateEliteGiantesses,
        getArmyCountFactorByAutoDifficulty: getArmyCountFactorByAutoDifficulty,
        getAllGameEventData: getAllGameEventData,
        getAllGameEventDirectorData: getAllGameEventDirectorData,
        getAllScenarioData: getAllScenarioData,
        markBegin: markBegin,
        markFinish: markFinish,
        realtimeSay: realtimeSay,
        findValidArmyPoint: findValidArmyPoint,
        generateSoldiers: generateSoldiers,
        generateMelees: generateMelees,
        generateInfantrys: generateInfantrys,
        generateRocketeers: generateRocketeers,
        generateCommanders: generateCommanders,
        generateLaserers: generateLaserers,
        generateMilltaryVehicles: generateMilltaryVehicles,
        generateTanks: generateTanks,
        generateMissileVehicles: generateMissileVehicles,
        generateFlameVehicles: generateFlameVehicles,
        hasAttackTarget: hasAttackTarget,
        findNearestData: findNearestData,
        findRandomNearData: findRandomNearData,
        getAllAliveEliteGiantessData: getAllAliveEliteGiantessData,
        getAllAliveSoldierData: getAllAliveSoldierData,
        getAllAliveMilltaryVehicleData: getAllAliveMilltaryVehicleData,
        getAllAliveBuildingData: getAllAliveBuildingData,
        isNearObject: isNearObject,
        setAttackTarget: setAttackTarget,
        setAttackTargetObjectDataByVisibleData: setAttackTargetObjectDataByVisibleData,
        setAttackTargetUsedGirl: setAttackTargetUsedGirl,
        getAttackTargetUsedGirl: getAttackTargetUsedGirl,
        getAttackTargetObjectData: getAttackTargetObjectData,
        getAllAliveArmyExceptEliteGiantessCount: getAllAliveArmyExceptEliteGiantessCount,
        getAllAliveEliteGiantessCount: getAllAliveEliteGiantessCount,

        convertSToMs: convertSToMs,
        addImpendingGameEventData: addImpendingGameEventData,
        selectTargetBySelectTargetPrior: selectTargetBySelectTargetPrior,
        selectTargetByDefault: selectTargetByDefault,
        selectLittleMan: selectLittleMan,
        selectRandomNearMilltaryBuilding: selectRandomNearMilltaryBuilding,
        selectRandomNearMilltaryVehicle: selectRandomNearMilltaryVehicle,
        selectRandomNearSoldier: selectRandomNearSoldier,
        selectRandomNearBuilding: selectRandomNearBuilding,
        addEnemyGiantess: addEnemyGiantess,
        addWildGiantess: addWildGiantess,
        getRandomMMDDataExceptMMDData: getRandomMMDDataExceptMMDData,
        getAllSkillDataForLevelOrBoss: getAllSkillDataForLevelOrBoss,
        updateEnemyGiantessValue: updateEnemyGiantessValue,
        updateWildGiantessValue: updateWildGiantessValue,
        isBossLevel: isBossLevel,
        resetCloth: resetCloth,
        restoreShoe: restoreShoe,
        isNotAttackLittleMan: isNotAttackLittleMan,
        clearAttackTargetObjectOrBuilding: clearAttackTargetObjectOrBuilding,

        // updateLevelGiantessValue: updateLevelGiantessValue,
        getBossDestroyProp: getBossDestroyProp,
        getLevelGirlDestroyProp: getLevelGirlDestroyProp,
        addLevelGiantess: addLevelGiantess,
        removeLevelGiantess: removeLevelGiantess,
        getPlayerName: getPlayerName,
        updateLevelGiantess: updateLevelGiantess,
        damageLevelGiantess: damageLevelGiantess,
        triggerLevelGiantessAction: triggerLevelGiantessAction,
        mergeAllRewardData: mergeAllRewardData,
        createStressingStateUtils: createStressingStateUtils,
        createDestroyedStateUtils: createDestroyedStateUtils,
        createDestroyingStateUtils: createDestroyingStateUtils,
        disposeLevelGiantessBuffData: disposeEnemyData,
        getAutoDifficulty: getAutoDifficulty,
        computeNewValueByMultiply: computeNewValueByMultiply,
        computeNewValueByDivid: computeNewValueByDivid,
        computeRatio: computeRatio,
        getAllUsedMMDDataForPlayerMMD: getAllUsedMMDDataForPlayerMMD,
        setPlayerMMDValue: setPlayerMMDValue,
        getPlayerAttackTarget: getPlayerAttackTarget,
        triggerGameEventByFilter: triggerByFilter,
        selectRandomNearEliteGiantess: selectRandomNearEliteGiantess,
        isNearGirl: isNearGirl,
        isMiddleDistanceFromGirl: isMiddleDistanceFromGirl,
        buildAllBuildingAndTreeResourceIds: buildAllBuildingAndTreeResourceIds,
        randomLimitAllBuildingUsedResources: randomLimitAllBuildingUsedResources,
        isVehicle: isVehicle,
        isRigidBody: isRigidBody,
        isCharacter: isCharacter,
        addFootDamageDecal: addFootDamageDecal,
        computeScaleByBox: computeScaleByBox,
        getHeightByBox: DamageUtils.getHeight,
        getPositionParrelToObj: getPositionParrelToObj,
        isMiddleGiantessOrBiggerByScale: isMiddleGiantessOrBiggerByScale,
        // getMeleeRange: getMeleeRange,
        isBuildingTarget: isBuildingTarget,
        showDoor: showDoor,
        handleDoor: handleDoor,
        isTriggerGirlAction: isTriggerAction,
        getPivotWorldPosition: getPivotWorldPosition,
        getIsHit: getIsHit,
        // pickdownByQTE: pickdownByQTE,
        getAllAliveMilltaryBuildingData: getAllAliveMilltaryBuildingData,
        generateShellTurrets: generateShellTurrets,
        generateMissileTurrets: generateMissileTurrets,
        generateMilltaryBuildingsDirectly: generateMilltaryBuildingsDirectly,
        getTotalCoin: getTotalCoin,
        // setCoin: setCoin,
        setTotalCoin: setTotalCoin,
        setLastAttackFrame: setLastAttackFrame,
        computeAttackFrames: computeAttackFrames,
        computeRemainAttackFrames: computeRemainAttackFrames,
        isCanNotAttackByCD: isCanNotAttackByCD,
        selectTarget: selectTarget,
        getNearGirlDistance: getNearGirlDistance,
        // increasePlayerGoddessAttribute: increaseGirlAttribute,
        getMaxScale: getMaxScale,
        updateHpData: updateHpData,
        changeToInitialScale: changeToInitialScale,
        resetPose: resetPose,
        initAllLevelGirlValue: initAllLevelGirlValue,
        getAllNotRelatedToSceneBlockNames: getAllNotRelatedToSceneBlockNames,
        getEnhenceAutoDifficulty: getEnhenceAutoDifficulty,
        getEnhenceLevelGiantessLevel: getEnhenceLevelGiantessLevel,
        limitEliteGiantessScale: limitScale,
        isEliteGiantessMaxHeight: isMaxHeight,
        isEliteGiantessMinHeight: isMinHeight,
        limitInitialScale: limitInitialScale,
        getSpecificGiantessMMDDataExceptMMDData: getSpecificGiantessMMDDataExceptMMDData,

        getEarlyFrameIndex: getEarlyFrameIndex,
        getFirstFrameIndex: getFirstFrameIndex,
        getLastFrameIndex: getLastFrameIndex,
        isCanActionWhenClimb: isCanAction,
        getSwipingWeaponValue: getSwipingWeaponValue,
        handleAllCollisions: handleAllCollisions,
        getLittleManVolume: getLittleManVolume,
        buildFakeBulletParticle: buildFakeBulletParticle,
        getPlayerCamp: getPlayerCamp,
        getCharacterType: getCharacterType,
        // handleSwipHitStatic: handleSwipHitStatic,
        // handleSwipHitGirl: handleSwipHitGirl,
        // handleSwipHitArmy: handleSwipHitArmy,
        // handleSwipHitLittleMan: handleSwipHitLittleMan,

        buildDescriptionWithCharacterType: buildDescriptionWithCharacterType,
        finishUse: finishUse,
        getInteractionLoadData: getInteractionLoadData,
        getLoadResourceIdData: getLoadResourceIdData,
        getAllInteractionConfig: getAllInteractionConfig,
        getAllMapData: getAllMapData,
        setUpdateLittleManWeaponFunc: setUpdateLittleManWeaponFunc,
        updateUIAndSound: updateUIAndSound,


        fixZFighting: fixZFighting,

        getPositionParrelToGround: getPositionParrelToGround,
        checkRangeBoxCollisionWithArmy: checkRangeBoxCollisionWithArmy,
        setArmyAddHitEffectFunc: setAddHitEffectFunc,
        setGiantessAddHitEffectFunc: setAddHitEffectFuncGirl,
        isUseGirl: isUseGirl,

        buildRandomDirectionInXZ: buildRandomDirectionInXZ,
        buildEffectWeaponValue: buildEffectWeaponValue,
        damageWithMultipleData: DamageUtils.damageWithMultipleData,
        damageWithSingleData: DamageUtils.damageWithSingleData,
        damageGiantess: DamageUtils.damageGiantess,

        getArmyBoxByName: getBoxLODQueueObjectUtils,
        getArmyTransformByName: getTransform,
        getArmyFullHp: getFullHpLODQueueObjectUtils,
        getArmyHp: getHpLODQueueObjectUtils,
        setArmyHp: setHpLODQueueObjectUtils,
        isStressingState: isStressingState,

        isPlayerGirl: isPlayerGirl,
        isPlayerGirlOrGiantess: isPlayerGirlOrGiantess,
        getExcitementFactorLevel: getExcitementFactorLevel,
        getDamageBiggerFactorLevel: getDamageBiggerFactorLevel,
        getExcitementByName: getExcitementByName,
        playSmallerAnimation: playSmallerAnimation,
        // setBiggerWay: setBiggerWay,
        getIsApplying: getIsApplying,
        setGirlScaleAndKeepCamera: setGirlScaleAndKeepCamera,
        getDestroyedEventName: getDestroyedEventName,

        setGiantessStressingRate: setGiantessStressingRate,
        getLateFrameIndex: getLateFrameIndex,
        getLittleManHp: getLittleManHp,
        getMaxForce: DamageUtils.getMaxForce,
        isNotMaxForce: DamageUtils.isNotMaxForce,
        scaleEliteGiantess: scaleEliteGiantess,
        addLittleManHp: addLittleManHp,
        isArmy: isArmy,
        isEliteGiantess: isEliteGiantess,
        computeRateForBuff: (state, fromName, rateForLittleMan, armyFactor = 6, giantessFactor = 6) => {
            if (isGirl(fromName) || isEliteGiantess(state, fromName)) {
                return rateForLittleMan * giantessFactor
            }

            if (isArmy(state, fromName)) {
                return rateForLittleMan * armyFactor
            }

            return rateForLittleMan
        },

        limitScale: limitScaleGirl,
        wrapActionNode: wrapActionNode,
        buildActionNodeForBalance: buildActionNodeForBalance,
        updateLevelGiantessValue: updateLevelGiantessValue,
        computeForceByHeight: DamageUtils.computeForceByHeight,

        getPlayerHeight: getPlayerHeight,
        setOriginPlayerGirlScale: setOriginPlayerGirlScale,
        updateAnimationDurationFactor: updateAnimationDurationFactor,
        // getAnimationDurationFactor:getAnimationDurationFactor,
        isNearPlayer: isNearPlayer,
        isGiantessExceptPlayer: isGiantessExceptPlayer,

        getGiantessCharacters: getGiantessCharacters,
        getCaptureLevelGiantessEventName: getCaptureLevelGiantessEventName,
        buildCaptureLevelGiantessEventData: buildCaptureLevelGiantessEventData,
        isVeryNearGirl: isVeryNearGirl,
        destroyGiantess: DamageUtils.destroyGiantess,

        getUseCareerCharacterType: getUseCareerCharacterType,
        findRewardData: findRewardData,
        buildArmyRewardKey: buildArmyRewardKey,
        addGemInLevel: addGemInLevel,
        addCoinInLevel: addCoinInLevel,
        setExperienceValue: setExperienceValue,
        isPlayerByCharacterType: isPlayerByCharacterType,
        getPlayerNamesByIsUseCareerFeature: getPlayerNamesByIsUseCareerFeature,
        getMaxActuallMoveSpeed: getMaxActuallMoveSpeed,
        isUseCareer: isUseCareer,
        isMeleeWeapon: isMeleeWeapon,
        setEliteGiantessAnimationDurationFactor: setAnimationDurationFactor,
        isBossGiantess: isBossGiantess,
        buildGiantessStubData: buildGiantessStubData,
        getLevelCoin: getLevelCoin,
        addRandomOffset: (position, offset) => {
            return position.clone().set(position.x + offset.x * NumberUtils.getRandomValue1(), position.y + offset.y * NumberUtils.getRandomValue1(), position.z + offset.z * NumberUtils.getRandomValue1())
        },
        updateArmyPositionByName: updatePositionByName,
        getPositionY: (state, x, z) => {
            return getPositionY(state, getGetPositionYFuncDefaultKey(), x, z)
        },
        isNotInMovableRanges: (state, usedGirl, position) => {
            // if (isLittleCharacterType(state)) {
            if (usedGirl == usedGirlEnum.None) {
                return isNotInMovableRanges(position, getMovableRanges(state))
            }

            return isNotInMovableRanges(position, getMovableRangesGirl(state, usedGirl))
        },
        isRangeWeapon: isRangeWeapon,
        isRemoteDamage: isRemoteDamage,
        getPositionByName: getPositionByName,
        computeRemoteDistance: computeRemoteDistance,
        getUpdateLittleManWeaponFunc: getUpdateLittleManWeaponFunc,
        isDamageArmyBack: isBack,
        isCreature: isCreature,

        isPlayerGiantessByName: isPlayerGiantessPlayer,
        addCurrentGunBullet: addCurrentGunBullet,

        // restoreCloth: restoreCloth,
        // restoreShoe: restoreShoe,
        getScaleIncrease: getScaleIncrease,

        isUseCareerFeature: isUseCareerFeature,
        getCareerFeatureData: getCareerFeatureData,
        isCharacterType: isCharacterType,
        findCareerFeatureDataByName: findCareerFeatureDataByName,
        getCareerFeatureValue: getCareerFeatureValue,
        getCareerFeatureValueByCharacterType: getCareerFeatureValueByCharacterType,
        getUseCareerFeatureCharacterType: getUseCareerFeatureCharacterType,
        isUseCareerFeatureByCharacterType: isUseCareerFeatureByCharacterType,
        getPlayerNamesByCharacterType: getPlayerNamesByCharacterType,
        getNullableCareerFeautreDataValue: getNullableValue,

        computeCoinByItemPriceFactor: computeCoinByItemPriceFactor,
        isStudy: isStudy,
        execLoop: execLoop,
        setUIUpdateLoopCount: setUIUpdateLoopCount,
        setGirlScaleByDeferTimeout0: setGirlScaleByDeferTimeout0,

        getLastChangePoseTime: getLastChangePoseTime,
        setLastChangePoseTime: setLastChangePoseTime,
        getPassTimeFromNow: getPassTimeFromNow,

        isGiantessControlled: isGiantessControlled,
        buildAddLabelFunc: DamageUtils.buildAddLabelFunc,
        // getLabelTime: getLabelTime,

        increaseGirlAttribute: increaseGirlAttribute,
        getPlayerGirlValueFromGirlData: PlayerGirlData.getValue,
        // getAllAttackRanges: getAllAttackRanges,

        limitNonBulletEmitterSpeed: limitNonBulletEmitterSpeed,

        // getValidRandomAttackRangeForWalkToTarget: getValidRandomAttackRangeForWalkToTarget,
        getSelectActionPrior: getSelectActionPrior,
        getAttackAction: getAttackAction,

        playGiantessVoice: playGiantessVoice,

        // getLastHardTime: getLastHardTime,

        getHeightByScale: getHeightByScale,

        isNotGenerateArmy: isNotGenerateArmy,
        isNotGenerateEliteArmy: isNotGenerateEliteArmy,

        setCurrentMMDCharacter: setCurrentMMDCharacter,

        getWholeGameTimeMinutes: getWholeGameTimeMinutes,

        isGiantessControlledTargetNone: isGiantessControlledTargetNone,

        getAllSelectCharacterData: getAllSelectCharacterData,

        getPropCount: getPropCount,

        getStateMachine: getStateMachineUtils,
        getRateByHasCount: getRateByHasCount,
        isBurstFire: isBurstFire,
        triggerDownActionForBurstFire: triggerDownActionForBurstFire,
        triggerDownActionForContinueFire: triggerDownActionForContinueFire,
        triggerUpActionForBurstFire: triggerUpActionForBurstFire,
        triggerUpActionForContinueFire: triggerUpActionForContinueFire,

        isActive: isActive,
        formatSecondUnit: formatSecondUnit,

        getGiantessVolume: getGiantessVolume,
        getCollisionPartOBB: getCollisionPartOBB,
        getShoeType: getShoeType,
        buildStompHitTerrainEventData: buildStompHitTerrainEventData,
        buildUpDirection: buildUpDirection,
        // buildChangeGiantessAnimationEventData: buildChangeGiantessAnimationEventData,

        updateDistanceRateOnlyOnceInOneFrame: updateDistanceRateOnlyOnceInOneFrame,
        restoreCameraFromSavedData: restoreCameraFromSavedData,
        updateThirdPersonControlsForChangeScale: updateThirdPersonControlsForChangeScale,

        changePose_: changePose_,
        getAnimationNamesExceptDamageNames: getAnimationNamesExceptDamageNames,

        findValidPosition: findValidPosition,
        buildMultipleTweens: buildMultipleTweens,

        handleCharacterExitControlled: handleCharacterExitControlled,
        isDestoryRelatedStates: isDestoryRelatedStates,
        computeMovableVelocity: computeMovableVelocity,

        getGridForJudgeWalkable: getGridForJudgeWalkable,
        handleRepel: handleRepel,
        handleRepelForCharacter: handleRepelForCharacter,

        getPickObjectData: getPickObjectData,
        getPickObjectBox: getPickObjectBox,
        addExcitement: addExcitement,
        buildGirlWeaponValue: buildGirlWeaponValue,
        executeExcitement: executeExcitement,
        executeClimax: executeClimax,

        getGiantessUBControlledTransformFunc: getGiantessUBControlledTransformFunc,
        getUBControlledTransformPrefix: getUBControlledTransformPrefix,
        removePickData: removePickData,
        updateUBControlledTransform: updateUBControlledTransform,
        buildInsertEventData: buildInsertEventData,
        isBigGiantess: isBigGiantess,
        getUBObjectData: getUBObjectData,
        getUBBox: getUBBox,
        getExcitementBuffSuperPositionCount: getExcitementBuffSuperPositionCount,

        handleUBFall: handleUBFall,
        buildPutToBreastEventData: buildPutToBreastEventData,
        getGiantessPutToBreastTransformFunc: getGiantessPutToBreastTransformFunc,
        getPutToBreastTransformPrefix: getPutToBreastTransformPrefix,
        updatePutToBreastTransform: updatePutToBreastTransform,
        handleBreastFall: handleBreastFall,
        handleHandFall: handleHandFall,
        getPutToBreastObjectData: getPutToBreastObjectData,
        getPutToBreastBox: getPutToBreastBox,

        isCarryFull: isFull,
        buildPutToShoeEventData: buildPutToShoeEventData,
        getGiantessPutToShoeTransformFunc: getGiantessPutToShoeTransformFunc,
        getPutToShoeTransformPrefix: getPutToShoeTransformPrefix,
        updatePutToShoeTransform: updatePutToShoeTransform,
        handleShoeFall: handleShoeFall,
        getPutToShoeObjectData: getPutToShoeObjectData,
        getPutToShoeBox: getPutToShoeBox,
        buildPickupEventData: buildPickupEventData,
        computeFallTime: computeFallTime,

        isEffect: isEffect,
        resetFinish: resetFinish,
        computeDirectionInXZ: computeDirectionInXZ,

        getNearTargets: getNearTargets,
        addStatusToNameInTime: addStatusToNameInTime,

        getPersonality: getPersonality,

        isPointInTriangle: (point, a, b, c) => {
            return new Triangle(a, b, c).containsPoint(point)
        },
        lookatTarget: lookatTarget,
        selectOneIndexByWeight: selectOneIndexByWeight,
        selectOneByWeight: selectOneByWeight,
        selectOneByTwoLayerWeights: selectOneByTwoLayerWeights,
        isInGirlAttackRangeWithTarget: isInGirlAttackRangeWithTarget,

        getPickObjectTotalBoxVolume: getPickObjectTotalBoxVolume,
        isFallState: isFallState,
        isRepelState: isRepelState,
        setTweensByKey: setTweensByKey,
        removeTweensByKey: removeTweensByKey,
        getLastSetTargetTime: getLastSetTargetTime,
        setLastSetTargetTime: setLastSetTargetTime,

        setPersonality: setPersonality,
        getAllPersonalities: getAllPersonalities,
        queryOBBShapeCollision: queryOBBShapeCollision,
        hitEffect: hitEffect,
        addBuffEmitBuff: addBuffEmitBuff,
        resetAllFinish: resetAllFinish,

        computeRepelDirection: computeRepelDirection,
        getGiantessLevel: getGiantessLevel,
        queryBoxShapeCollision: queryBoxShapeCollision,
        handleEat: handleEat,
        buildFakeGirlWeaponValue: buildFakeGirlWeaponValue,
        isStatic: isStatic,
        getGroundY: getGroundY,
        clearTargetByName: clearTargetByName,
        isPickedControlledState: isPickedControlledState,
        isUBControlledState: isUBControlledState,
        isBreastControlledState: isBreastControlledState,
        isShoeControlledState: isShoeControlledState,

        increaseGiantessAttribute: increaseGiantessAttribute,
        increaseGoddessAttribute: increaseGoddessAttribute,
        limitBreastRatio: limitBreastRatio,
        limitTorsorRatio: limitTorsorRatio,
        partialScaleBreast: partialScaleBreast,
        partialScaleTorsor: partialScaleTorsor,
        getBreastPartialScaleRatio: getBreastPartialScaleRatio,
        getTorsorPartialScaleRatio: getTorsorPartialScaleRatio,
        getBreastVolumnFactor: getBreastVolumnFactor,
        buildFreeEventData: buildFreeEventData,
        preHandleAttackTarget: preHandleAttackTarget,
        selectArmy: selectArmy,
        isEnemeyGiantessWithRate: isEnemeyGiantessWithRate,
        getUBCapacityFactor: getUBCapacityFactor,
        setBreastPartialScaleMaxFactor: setBreastPartialScaleMaxFactor,
        setTorsorPartialScaleMaxFactor: setTorsorPartialScaleMaxFactor,
        buildRemoveDataData: buildRemoveDataData,
        addLabel: DamageUtils.addLabel,
        healArmy: healArmy,
        queryPutDataByBox: queryPutDataByBox,
        isChangeToFallState: isChangeToFallState,
        isRemoveShoe: isRemoveShoe,
        findNearData: findNearData,



        hasLevelGiantessExceptPlayer: hasLevelGiantessExceptPlayer,
        hasLevelGiantessExceptPlayerGirl: hasLevelGiantessExceptPlayerGirl,
        getUsedGirlData: getUsedGirlData,
        getNearestUsedGirl: getNearestUsedGirl,
        hasUsedGirl: hasUsedGirl,
        isGiantessCharacterTypeByUsedGirl: isGiantessCharacterTypeByUsedGirl,

        isSmallDistanceFromGirl: isSmallDistanceFromGirl,
        getNeedUpdateStatusName: getNeedUpdateStatusName,

        isMMDCharacterExist: isMMDCharacterExist,
        isExceedMaxMMDGiantessCountAfterAdd: isExceedMaxMMDGiantessCountAfterAdd,
        getIsAllowFriendDamage: getIsAllowFriendDamage,

        isUBed: isUBed,
        isControlled: isControlled,

    }
}

let _getInfo = (mod): info => {
    return {
        ...mod.getBlockInfo(buildAPI()),
        getBlockService: mod.getBlockService,
        blockState: mod.createBlockState(buildAPI()),
    }
}

export let getAllModInfo = (state: state): Array<info> => {
    // return [
    //     {
    //         protocolName: modProtocolName.MMDCharacterProtocol,
    //         /*! title should be unique
    //         * 
    //         */
    //         title: "MMD人物->白希",
    //         author: "官方",
    //         category: "MMD人物",
    //         version: "0.0.1",

    //         getBlockService: MMDCharacterDefault.getBlockService,
    //         blockState: MMDCharacterDefault.createBlockState(api),
    //     }
    // ]
    return [
        // MMDCharacterDefault.getBlockInfo(api)
        _getInfo(SceneProtect),
        _getInfo(MMDCharacterDefault),
        _getInfo(MMDCharacterExtend),
        _getInfo(SoundBackgroundDefault),
        _getInfo(CareerDefault),
        _getInfo(CareerLittleManRandom),
        _getInfo(CareerGiantessRandom),
        _getInfo(CareerPeace),
        _getInfo(CareerRunner),
        _getInfo(CareerGiantessPleaser),
        _getInfo(CareerMasochism),
        _getInfo(CareerFoodie),
        _getInfo(CareerDemon),
        _getInfo(CareerLittleManBandit),
        _getInfo(CareerGiantessBandit),
        _getInfo(CareerSaver),
        _getInfo(CareerFarmer),
        _getInfo(CareerEnterpriser),
        _getInfo(CareerDuelist),
        _getInfo(CareerWeaponWorkMan),
        _getInfo(CareerVaginalCapture),
        _getInfo(CareerCarry),
        _getInfo(CareerAbsorber),
        _getInfo(CareerWetNurse),
        _getInfo(CareerSadism),
        _getInfo(CareerFootFetish),
        _getInfo(SettingDefault),
        _getInfo(SettingSound),
        _getInfo(MeleeGiantess),
        _getInfo(MagicGiantess),
        _getInfo(EliteGiantessShareDefault),
        _getInfo(WeaponStompLight),
        _getInfo(WeaponStompHeavy),
        _getInfo(PropBulletBasic),
        _getInfo(PropBulletSubMachine),
        _getInfo(PropBulletShot),
        _getInfo(PropBulletBigger),
        _getInfo(PropBulletSmaller),
        _getInfo(WeaponLittleManSwiping),
        _getInfo(WeaponKickLight),
        _getInfo(WeaponMagicAttack1),
        _getInfo(WeaponWalk),
        _getInfo(ParticleEffectInjureDamage),
        _getInfo(ParticleEffectUpgrade),
        _getInfo(ParticleEffectHitDecreaseScale),
        _getInfo(ParticleEffectHitIceSingle),
        _getInfo(ParticleEffectHitBlur),
        _getInfo(ParticleEffectHitCharm),
        _getInfo(ParticleEffectHitCrippled),
        _getInfo(ParticleEffectHitExcitement),
        _getInfo(ParticleEffectHitPoisonSingle),
        _getInfo(ParticleEffectHitInjureSingle),
        // _getInfo(ParticleEffectHitFragileGrowth),
        _getInfo(ParticleEffectHitExplodeSingle),
        _getInfo(ParticleBulletEmitSubMachine),
        _getInfo(ParticleBulletHitSubMachine),
        _getInfo(ParticleBulletEmitBasic),
        _getInfo(ParticleBulletHitBasic),
        _getInfo(ParticleBulletEmitShot),
        _getInfo(ParticleBulletHitShot),
        _getInfo(ParticleBulletEmitFireball),
        _getInfo(ParticleBulletHitFireball),
        _getInfo(ParticleBulletEmitBigger),
        _getInfo(ParticleBulletEmitSmaller),
        _getInfo(ParticleBillboardExplodeRange),
        _getInfo(ParticleBillboardIceOverwrite),
        _getInfo(ParticleShareDefault),
        _getInfo(BuffGiantessHard),
        _getInfo(BuffGiantessSmallerWater),
        _getInfo(BuffGiantessEat),
        _getInfo(BuffGiantessAbsorb),
        _getInfo(BuffLittleManMasochism),
        _getInfo(BuffGiantessMasochism),
        _getInfo(BuffGiantessSadism),
        _getInfo(BuffArmySadism),
        _getInfo(BuffLittleManExcitementIncreaseAttack),
        _getInfo(BuffEmitDefenseIncreaseDefense),
        _getInfo(BuffArmyIncreaseDefense),
        _getInfo(BuffLittleManIncreaseDefense),
        _getInfo(BuffGiantessIncreaseDefense),
        _getInfo(BuffEmitBackStab),
        _getInfo(BuffEmitHpRatio),
        _getInfo(BuffEmitHpRatioInverse),
        _getInfo(BuffEmitShootDistanceInverse),
        _getInfo(BuffEmitShootDistanceDirect),
        _getInfo(BuffEmitPull),
        _getInfo(BuffEmitDecreaseScale),
        _getInfo(BuffEmitDefenseDoorShield),
        _getInfo(BuffLittleManIceSingle),
        _getInfo(BuffEmitFragileGrowth),
        _getInfo(BuffEmitCrippled),
        _getInfo(BuffArmyCrippled),
        _getInfo(BuffLittleManCrippled),
        _getInfo(BuffEmitCharm),
        _getInfo(BuffArmyCharm),
        _getInfo(BuffLittleManCharm),
        _getInfo(BuffEmitBlur),
        _getInfo(BuffArmyBlur),
        _getInfo(BuffLittleManBlur),
        _getInfo(BuffEmitExcitement),
        _getInfo(BuffEmitExcitement),
        _getInfo(BuffLittleManExcitement),
        _getInfo(BuffArmyStressProtect),
        _getInfo(BuffEmitDefenseStressProtect),
        _getInfo(BuffEmitPoisonSingle),
        _getInfo(BuffLittleManPoisonSingle),
        _getInfo(BuffEmitIceSingle),
        _getInfo(BuffEliteGiantessDamageBigger),
        _getInfo(BuffEliteGiantessPassiveBigger),
        _getInfo(BuffLittleManStressProtect),
        _getInfo(BuffGiantessStressProtect),
        _getInfo(BuffBossStressProtect),
        _getInfo(BuffPlayerStatusDamageBigger),
        _getInfo(BuffBossStatusDamageBigger),
        _getInfo(BuffPlayerStatusPassiveBigger),
        _getInfo(BuffBossStatusPassiveBigger),
        _getInfo(BuffArmyIceOverwrite),
        _getInfo(BuffArmyIceSingle),
        _getInfo(BuffArmyPoisonSingle),
        _getInfo(BuffArmyInjureSingle),
        _getInfo(BuffGiantessIceOverwrite),
        _getInfo(BuffGiantessIceSingle),
        _getInfo(BuffGiantessPoisonSingle),
        _getInfo(BuffGiantessInjureSingle),
        _getInfo(BuffStrong),
        _getInfo(BuffRun),
        _getInfo(BuffCallGoddess),
        _getInfo(BuffExcitementGirl),
        _getInfo(BuffExcitementLevelGiantess),
        _getInfo(BuffTiredGirl),
        _getInfo(BuffTiredLevelGiantess),
        _getInfo(BuffHolyWater),
        _getInfo(BuffGiantessStimulator),
        _getInfo(BuffGiantessController),
        _getInfo(UpgradeAssistantAddMaxExcitement),
        _getInfo(UpgradeOtherIncreasePickPropRange),
        _getInfo(UpgradeOtherAddBullet),
        _getInfo(UpgradeOtherPartialScaleBreast),
        _getInfo(UpgradeOtherPartialScaleTorsor),
        _getInfo(UpgradeOtherDamagedPartialScaleBreast),
        _getInfo(UpgradeDefenseIncreaseDefense),
        _getInfo(UpgradeAttackBackStab),
        _getInfo(UpgradeAttackHpRatio),
        _getInfo(UpgradeAttackHpRatioInverse),
        _getInfo(UpgradeAttackShootDistanceInverse),
        _getInfo(UpgradeAttackShootDistanceDirect),
        _getInfo(UpgradeAttackPull),
        _getInfo(UpgradeAttackDecreaseScale),
        _getInfo(UpgradeDefenseDoorShield),
        _getInfo(UpgradeDefenseLimitDamage),
        _getInfo(UpgradeDefenseStressProtect),
        _getInfo(UpgradeDefenseBuQu),
        _getInfo(UpgradeDefenseDecreaseDamageWhenLie),
        _getInfo(UpgradeDefenseIncreaseStrongWhenMeleeAttack),
        _getInfo(UpgradeDefenseDecreaseStressingRate),
        _getInfo(UpgradeSkillEnhenceBreastPressRubCharm),
        _getInfo(UpgradeSkillEnhenceBreastPressRubPutToBreast),
        _getInfo(UpgradeSkillEnhenceSitRubCharm),
        _getInfo(UpgradeSkillEnhenceSitRubInsert),
        _getInfo(UpgradeSkillEnhenceStompRubPutToShoe),
        _getInfo(UpgradeSkillEnhencePutToBreastCharm),
        _getInfo(UpgradeSkillEnhenceThrustExcitement),
        _getInfo(UpgradeSkillEnhencePutToShoeBlur),
        _getInfo(UpgradeSkillEnhenceCrawlLickEat),
        _getInfo(UpgradeSkillEnhenceCrawlLickBlur),
        _getInfo(UpgradeSkillEnhencePinchCrippled),
        _getInfo(UpgradeSkillEnhenceJumpStompCrippled),
        _getInfo(UpgradeSkillEnhenceStompCrippled),
        _getInfo(UpgradeSkillEnhenceSitRotate),
        _getInfo(UpgradeSkillEnhenceStompRotate),
        _getInfo(UpgradeSkillEnhenceRunRepel),
        _getInfo(UpgradeSkillFragileGrowth),
        _getInfo(UpgradeSkillDamageBigger),
        _getInfo(UpgradeSkillPassiveBigger),
        _getInfo(UpgradeSkillLearnRun),
        _getInfo(UpgradeSkillJumpStomp),
        _getInfo(UpgradeSkillLeftStomp),
        _getInfo(UpgradeSkillStompRub),
        _getInfo(UpgradeSkillSit),
        _getInfo(UpgradeSkillSitRub),
        _getInfo(UpgradeSkillTightenLeg),
        _getInfo(UpgradeSkillUB),
        _getInfo(UpgradeSkillThrust),
        _getInfo(UpgradeSkillInsert),
        _getInfo(UpgradeSkillPutToBreast),
        _getInfo(UpgradeSkillPutToShoe),
        _getInfo(UpgradeSkillFreeBreast),
        _getInfo(UpgradeSkillFreeShoe),
        _getInfo(UpgradeSkillFreeUB),
        _getInfo(UpgradeSkillBreastPress),
        _getInfo(UpgradeSkillBreastPressRub),
        _getInfo(UpgradeSkillCrawlBeat),
        _getInfo(UpgradeSkillCrawlLick),
        _getInfo(UpgradeSkillSprayMilk),
        _getInfo(UpgradeSkillIceOverwrite),
        _getInfo(UpgradeSkillIceSingle),
        _getInfo(UpgradeSkillExplodeRange),
        _getInfo(UpgradeSkillExplodeSingle),
        _getInfo(UpgradeSkillPoisonSingle),
        _getInfo(UpgradeSkillInjureSingle),
        _getInfo(UpgradeDefenseStressingDecreaseDamage),
        // _getInfo(PropOtherUseArtifact),
        _getInfo(PropOtherUseGiantessCharacter),
        _getInfo(PropOtherSmallerWater),
        _getInfo(PropOtherCapture),
        _getInfo(PropOtherStrong),
        _getInfo(PropOtherRun),
        _getInfo(PropOtherHolyWater),
        _getInfo(PropShareDefault),
        _getInfo(PropArtifactRestoreCloth),
        _getInfo(PropArtifactInfinityBig),
        _getInfo(PropArtifactCallGoddess),
        _getInfo(PropArtifactGiantessStimulator),
        _getInfo(PropArtifactGiantessController),
        _getInfo(PropArtifactSpecificGiantess),
        _getInfo(PropArtifactMissionComplete),
        _getInfo(BehaviourBalance),
        // _getInfo(BehaviourPlayerGoddess),
        // _getInfo(BehaviourAttackPlayerGiantess),
        // _getInfo(BehaviourProtectPlayerGiantess),
        // _getInfo(BehaviourProtectPlayerGoddess),
        // _getInfo(BehaviourProtectLevelGiantess1),
        // _getInfo(BehaviourProtectLevelGiantess2),
        _getInfo(EventGameHard),
        _getInfo(EventGameCallGoddess),
        _getInfo(EventGameAttackCallGiantess),
        _getInfo(EventGameProtectCallGiantess),
        // _getInfo(EventGameProtectCallGiantess),
        _getInfo(EventGameProtectCallGoddess),
        _getInfo(EventGameProtectEliteGiantess),
        _getInfo(EventGameProtectArmy),
        _getInfo(EventGameProtectLevelGiantess1),
        _getInfo(EventGameProtectLevelGiantess2),
        _getInfo(FSMGirlExcitement),
        _getInfo(FSMLevelGiantessExcitement),
        _getInfo(FSMGirlClimax),
        _getInfo(FSMLevelGiantessClimax),
        _getInfo(FSMLittleManFall),
        _getInfo(FSMLittleManRepel),
        _getInfo(LevelGiantessPlayerGiantess),
        _getInfo(LevelGiantessProtectBoss1),
        _getInfo(LevelGiantessProtectBoss2),
        _getInfo(SkillLittleManSwiping),
        _getInfo(SkillLittleManFastRun),
        _getInfo(SkillGiantessStomp),
        _getInfo(SkillGiantessStompRub),
        _getInfo(SkillGiantessLeftStomp),
        _getInfo(SkillGiantessJumpStomp),
        _getInfo(SkillGiantessKeepSit),
        _getInfo(SkillGiantessStandToSit),
        _getInfo(SkillGiantessSitToStand),
        _getInfo(SkillGiantessSitRub),
        _getInfo(SkillGiantessSitTightenLeg),
        _getInfo(SkillGiantessSitHeavyStressing),
        _getInfo(SkillGiantessSitHeavyStressingBreast),
        _getInfo(SkillGiantessSitHeavyStressingTrigoneAndButt),
        _getInfo(SkillGiantessSitDeath),
        _getInfo(SkillGiantessKeepUB),
        _getInfo(SkillGiantessPickToUB),
        _getInfo(SkillGiantessUBToPick),
        _getInfo(SkillGiantessThrust),
        _getInfo(SkillGiantessInsert),
        _getInfo(SkillGiantessPutToBreast),
        _getInfo(SkillGiantessPutToShoe),
        _getInfo(SkillGiantessFreeUB),
        _getInfo(SkillGiantessFreeBreast),
        _getInfo(SkillGiantessFreeShoe),
        _getInfo(SkillGiantessUBHeavyStressing),
        _getInfo(SkillGiantessBreastPress),
        _getInfo(SkillGiantessBreastPressRub),
        _getInfo(SkillGiantessCrawlBeat),
        _getInfo(SkillGiantessCrawlLick),
        _getInfo(SkillGiantessSprayMilk),
        _getInfo(InteractionBlessGirl),
        _getInfo(InteractionWeaponGirl),
    ]
}

export let getAllBlockServiceFuncWithDefault = <blockService>(state, getFuncFunc: (service: blockService) => any, protocolName, defaultValue: Array<any>) => {
    return BlockManager.getAllBlockServicesOfBlockProtocolName(getBlockState(state), protocolName).reduce((result, [blockName, blockService]) => {
        return result.concat(getFuncFunc(blockService))
    }, defaultValue)
}

// export let getAllBlockServiceFuncWithDefaultAndConcat = (state, [getFuncFunc, concatFunc], protocolName, defaultValue: Array<any>) => {
//     return BlockManager.getAllBlockServicesOfBlockProtocolName(getBlockState(state), protocolName).reduce((result, [blockName, blockService]) => {
//         return concatFunc(result, getFuncFunc(blockService))
//     }, defaultValue)
// }
export let getAllBlockServiceFuncWithDefault2 = (state, getFuncFunc, protocolName, defaultValue) => {
    return BlockManager.getAllBlockServicesOfBlockProtocolName(getBlockState(state), protocolName).reduce((result, [blockName, blockService]) => {
        // return concatFunc(result, getFuncFunc(blockService))
        return getFuncFunc(result, blockService)
    }, defaultValue)
}