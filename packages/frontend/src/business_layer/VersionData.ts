import { NullableUtils } from "meta3d-jiehuo-abstract"
import { isChinese } from "../scene3d_layer/script/scene/Scene"

export let getVersionData = (state) => {
    return {
        mainVersion: 1,
        subVersion: 2,
        // postfix: NullableUtils.return_(`-beta.2`),
        // postfix: NullableUtils.return_(isChinese(state) ? ` 正式版` : ` release`),
        // postfix: NullableUtils.return_(isChinese(state) ? ` 正式版-1` : ` release-1`),
        postfix: `.7`,
        newContentChi:
            `
v1.2.7 相关更新点如下，感谢您：

修复与优化

- 修复使用巨大娘控制道具->UB后，持续处于抓取状态的错误
- 修复巨大娘控制道具结束后状态未正确恢复的错误
- 移除生成道具UI选项

游戏机制

- 未开启友伤热点时小人角色现在也可被玩家控制的巨大娘抓取
- 提升捕获巨大娘的几率

视觉与体验

- 优化巨大娘角色第一人称视角腿部画面现晃动程度显著减轻
- 在“退出登录”时增加弹窗确认


v1.2.6 相关更新点如下，感谢您：

游戏机制

- 巨大娘角色现在不会被地图边缘卡住
- 进攻防守城市关卡中己方单位数量不再限制敌人刷新数量
- 更新升级方向弹出概率，现在等级越高弹出越容易

视觉与界面

- 增加渲染精度最高时的可见范围
- 优化关卡结算页面中的宝石结算界面

修复与优化

- 修复小人锁定目标为巨大娘时巨大娘死后未解除锁定的问题
- 修复夏卉角色左脚碰撞体积异常的问题
- 修复掉落道具有可能为零的错误


v1.2.5 相关更新点如下，感谢您：

修复与优化

- 修复账号服务器数据可能被清空的错误
- 现在报错后可在恢复游戏中恢复巨大娘使用道具
- 修复Boss关卡中Boss移动时可能报错的错误
- 修复抓精英巨大娘时可能报错的错误
- 修复小人无法看见巨大娘全身模型的错误
- 修复移动端选择职业时滚动可能导致误选的错误
- 修复移动端全屏后方向键显示可能不完整的错误


v1.2.4 相关更新点如下，感谢您：

修复与优化

- 修复调试时启用生产环境在加载至12%时卡住的错误
- 修复小人第一人称下关闭技能选择界面后相机可能移动的错误
- 修复移动端选择职业需要点击两次的错误
- 新增对应用套壳环境的检测功能

新增内容与功能

- 新增移除地图边缘区域热点

游戏平衡

- 城市关卡：使用巨大娘角色时不会出现野生巨大娘

v1.2.3 相关更新点如下，感谢您：

游戏平衡

- 玩家使用小人角色时不会出现敌人巨大娘

用户界面

- 当存在多个 MMD 巨大娘时同步显示其状态
- 主动变大增益效果现显示剩余时间并移除读条

系统更新

- 优化了友伤机制


v1.2.2 相关更新点如下，感谢您：

核心调整

- 游戏不再自动调整分辨率与渲染精度

新增内容与功能

- 新增允许友伤热点选项


v1.2.1 相关更新点如下，感谢您：

修复与优化

- 修复了巨大娘角色选择了和平主义职业->通关时会报错的错误
- 修复了报getUsedGirlData error的错误
- 修复了高x时报错的错误
- 修复了指定巨大娘的不存在的目标时报错的错误
- 修复了控制巨大娘变大无效的错误
- 修复了小人疾跑、重击不能用的错误
- 修复了玩家部分buff无法显示的错误


v1.2.0 相关更新点如下，感谢您：

新增内容与功能

- 现已支持多个 MMD 巨大娘同时登场

修复与优化

- 修复了第一、二关首领在攻击时可能导致游戏崩溃的错误
- 修复了关卡巨大娘不会选择远点的单位的错误

已知问题

- 当前多个 MMD 巨大娘之间尚未实现交互行为
`

        //             `
        // 本次版本主要贡献者：

        // v1.1.19 相关更新点如下，感谢您：

        // 新增内容

        // - 首页移除v2.0-alpha.1内测版（多人联网demo） 入口


        // v1.1.18 相关更新点如下，感谢您：

        // 新增内容

        // - 首页增加v2.0-alpha.1内测版（多人联网demo） 入口


        // v1.1.17 相关更新点如下，感谢您：

        // 系统调整

        // - 巨大娘行动不再对友方单位造成伤害
        // - 国外赞助平台更换为「引力圈」
        // - 更新游戏品牌标识

        // 常规维护

        // - 修复多项已知问题


        // v1.1.16 相关更新点如下，感谢您：

        // 核心机制调整

        // - 巨大娘的行动现在对友方单位同样生效并造成伤害
        // - 玩家现在可以伤害友方单位

        // 新增内容

        // - 新增巨大娘职业：足控者

        // 职业平衡修改

        // - 修改奶妈职业：喂奶现在有几率将目标单位转换为友方阵营

        // 修复与优化

        // - 修复 AI使用夹腿技能时可能报错的问题
        // - 修复 喂奶、喷奶、抽入、抽插技能对自身伤害异常过高的问题
        // - 修复 巨大娘伤害精英巨大娘时可能报错的问题
        // - 修复 巨大娘技能不会造成0伤害的问题


        // v1.1.15 相关更新点如下，感谢您：

        // 新增内容

        // - 新增巨大娘职业：奶妈
        // - 新增巨大娘升级方向：
        //     - 胸碾：放入胸
        //     - 脚碾：放入鞋
        //     - 臀碾：插入

        // 平衡性调整

        // - 降低「吃」「吸收」带来的身高与血量加成
        // - 使用无限变大神器后，被动变大/受击变大的最大升级级数降至20级

        // 修复与优化

        // - 治疗恢复效果现在会显示具体数值
        // - 修复 同时选择携带者与吸收者职业时，放入胸->落下可能报错的BUG
        // - 修复 吸收者职业：吸收伤害不应该一定触发目标硬直的问题
        // - 优化 部分巨大娘角色的放入鞋技能现可放置单位于脚趾间
        // - 初音、诺亚角色现可使用放入鞋技能
        // - 修复 初音角色悬空异常问题


        // v1.1.14 相关更新点如下，感谢您：

        // 新增内容

        // - 新增巨大娘职业：吸收者
        // - 新增小人/巨大娘职业：施虐狂

        // 平衡性调整

        // - 降低胸部自动缩小速度
        // - 提高腹部自动缩小速度

        // 修复与优化

        // - 修复 受虐狂等职业：小人/巨大娘同时选择时不应相互影响的BUG
        // - 修复 人形单位起身过程中也应能被踩倒的判定逻辑
        // - 修复 移动端第一人称视角升级导致的相机偏移
        // - 修复 移动端职业选择页面滑动误触问题

        // v1.1.13 相关更新点如下，感谢您：

        // 新增内容

        // - 新增巨大娘职业：携带者

        // 平衡性调整

        // - 降低UB技能对自身造成的伤害
        // - 降低插入技能对单位的伤害值
        // - 巨大娘刺激器神器现在更易触发胸部变大效果

        // 系统扩展

        // - 新增巨大娘升级方向：
        //     - 胸部受击时触发局部变大
        //     - 提高兴奋值上限

        // 修复与优化

        // - 修复 巨大娘高潮状态结束后才应缩小体型的逻辑错误
        // - 修复 喷奶对非控制单位造成伤害时的报错问题
        // - 修复 第一人称视角下升级导致的相机偏移
        // - 修复 玩家巨大娘被动变大后相机不居中的问题
        // - 优化部分文案与界面样式

        // v1.1.12 相关更新点如下，感谢您：

        // 新增内容

        // - 新增巨大娘职业：阴道捕获者

        // 平衡性调整

        // - 降低巨大娘角色的兴奋率
        // - 升级所需经验值回调至先前水平
        // - 提升升级后出现方向选择界面的概率

        // 系统扩展

        // - 新增巨大娘升级方向：
        //     - 增强胸部局部变大效果
        //     - 增强腹部局部变大效果

        // 问题修复

        // - 修复插入技能造成的自身伤害计算错误
        // - 修复释放UB后切换至小人形态时，下坠单位异常停滞的问题


        // v1.1.11 相关更新点如下，感谢您：

        // 系统扩展

        // - 新增胸部、腹部局部变大机制
        // - 局部变大会降低角色动作速度
        // - 局部变大状态会随时间缓慢恢复原状
        // - 使用巨大娘刺激器神器后，胸部受击将触发局部变大效果
        // - 喷奶动作结束后胸部会缩小
        // - 胸部尺寸将影响喷奶效果（尺寸越大效果越强）
        // - 高潮后胸部立即恢复初始尺寸
        // - 吞噬单位后腹部会变大
        // - 腹部达到最大尺寸时，继续吞噬不会获得增益效果

        // 修复与优化

        // - 修复被抓取单位异常变大的问题
        // - 修复奔跑击退动作显示0伤害值的问题
        // - 修正击退距离的计算公式

        // v1.1.10 相关更新点如下，感谢您：

        // 系统与平衡性调整

        // - 升级后，有一定概率不会弹出升级方向选择（级越高，不弹出概率越高）
        // - 降低了升级所需的经验值
        // - 移除开局赠送道具
        // - 玩家小人角色被压住时现可起身了
        // - 增加玩家小人角色的起身所需时间

        // 修复与优化

        // - 修复 玩家巨大娘角色行走时相机偏离中心的问题
        // - 修复 香子兰行走与奔跑动画异常
        // - 修复 空之律者浮空异常
        // - 修复 夏夜2抓取动画浮空问题
        // - 更新 难度自定义页面视觉样式
        // - 修复 精英巨大娘血迹过小的问题
        // - 修复 防御城市关卡中玩家女神/巨大娘误将军队设为目标的问题
        // - 提升玩家女神生命值


        // v1.1.9 相关更新点如下，感谢您：

        // 平衡性调整

        // - 增加了升级所需的经验值

        // 修复与优化

        // - 修复 小人角色近战攻击不应击扁军车及军事建筑的问题
        // - 修复 巨大娘抓取后放下单位时碰撞箱异常的问题
        // - 修复 准心默认瞄准位置过高的问题
        // - 修复 巨大娘脱鞋后可能无法有效踩踏的问题

        // v1.1.8 相关更新点如下，感谢您：

        // 修复与优化

        // - 现已捕获并处理 pointer lock 未被正确捕获的错误
        // - 修复 人类角色后退时准心频繁闪烁问题
        // - 修复 巨大娘控制器的臀碾、夹腿动作，现可立即触发执行
        // - 修复 小人攻击炮塔时伤害数字颜色显示异常
        // - 修复 玩家小人角色被囚禁后相机视角过近的问题
        // - 优化 玩家小人角色视角：现可完整观察超巨大娘全身
        // - 优化 被动变大/受击变大机制：改为限制因技能增加的高度上限


        // v1.1.7 相关更新点如下，感谢您：

        // 修复与优化

        // - 修复 巨大娘 技能加强的升级方向应该对小人角色不可选 bug
        // - 修复 使用道具后可能不自动关闭道具界面 bug
        // - 修复 小人默认使用第一人称时，后退会导致准心消失 bug
        // - 修复 关卡巨大娘使用喷奶时，对单位造成的伤害不应该在第1帧 bug 
        // - 修复 进攻城市关卡：门出现后，靠近时按V应该可以进门(即使没有显示 进入门 提示) bug
        // - 修复 关卡巨大娘对玩家小人角色使用释放胸部、释放鞋、释放UB时，不应该出现qte bug
        // - 修复 进攻城市关卡：夹腿时如果进入门，夹腿音乐应该停止 bug
        // - 玩家巨大娘角色有控制的单位时（如UB），不能切换为小人角色
        // - 更新 巨大娘 技能加强 升级方向的文案
        // - 巨大娘控制器加入“喷奶”动作

        // v1.1.6 相关更新点如下，感谢您：

        // 系统扩展

        // - 巨大娘控制器新增性格与新动作
        // - 玩家巨大娘角色：所有体型变大技能现可同步激活
        // - 新增Buff：残废、魅惑、模糊、兴奋
        // - 巨大娘玩家角色新增技能强化的升级方向（如趴舔动作可吃）
        // - 巨大娘AI现可运用技能强化升级方向

        // 修复与优化

        // - 修复 巨大娘的中毒/致伤状态伤害重复计算的BUG
        // - 修复 进攻城市关卡中单位在鞋内死亡后复活位置悬空的问题
        // - 修复 下坠单位受跳踩攻击时卡滞空中的异常
        // - 优化 小人角色在胸部/鞋/UB内位置现在正确了
        // - 优化 巨大娘AI将胸部/鞋/UB内单位作为目标时，使用专属动作逻辑
        // - 修复 tween动画ID获取报错

        // v1.1.5 相关更新点如下，感谢您：

        // 修复与优化

        // - 修复 小人角色被抓后，相机不应该被固定以及应该可以使用第一人称相机 bug
        //     - 小人第一人称相机改为使用巨大娘的第一人称相机
        // - 修复 概率选择机制异常
        // - 防御城市关卡移除破坏率检测机制
        // - 更新 UB伤害计算方式
        // - 降低喷奶技能伤害值
        // - 巨大娘选择页面现在显示全部角色
        // - 现在可抓处于下落、击退状态的单位
        // - AI优化：增加抓距离判定逻辑
        // - 修复 关卡巨大娘频繁切换目标的问题
        // - 修复 小人角色移动过程中无法进行近战攻击的问题
        // - 修复 Boss第2关踩踏动作异常
        // - 修复 选择"武器工匠"职业后，进入新关卡时子弹速度未重置的bug
        // - 缩小道具图标尺寸
        // - 修复 防御城市关卡中精英巨大娘可能静止不动的问题
        // - 优化资源加载超时处理机制
        // - 修复加载bug

        // 平衡性调整

        // - "武器工匠"职业幸运值削减幅度提升

        // v1.1.4 相关更新点如下，感谢您：

        // 新增内容与优化

        // - 为关卡巨大娘新增全部最新动作
        // - 为Boss第1、2关的Boss巨大娘新增踩踏类动作
        // - 关卡巨大娘新增随机性格系统（影响姿势选择、动作偏好、目标选择及体型变化概率）
        // - Boss第2关指定位置踩踏动作速度提升
        // - 更新巨大娘技能属性体系

        // 修复与调整

        // - 修复 关卡巨大娘AI逻辑：玩家操控的巨大娘AI不再受难度设置影响
        // - 调整 不同技能获得的兴奋值差异化
        // - 修复 柚叶角色脚部碰撞体积异常
        // - 修复 Boss第2关：因捏死而复活后，巨大娘可能保持站立静止状态的问题
        // - 修复 敌方巨大娘目标锁定机制（严格限定仅以玩家为目标）
        // - 修复 坐姿第一人称视角不应该选择角色的问题
        // - 修复 爬行动作滑步现象
        // - 分离玩家小人形态与巨大娘形态的相机灵敏度设置
        // - 修复 伤害限制技能失效问题

        // v1.1.3 相关更新点如下，感谢您：

        // 新增内容

        // - 玩家巨大娘角色新增技能：
        //     - 胸碾 (Breast Crush)
        //     - 舔 (Lick)
        //     - 拍 (Pat)
        //     - 喷奶 (Lactation Spray)

        // 修复与优化

        // - 修复 高潮、Boss第2关液体粒子的大小与偏移问题
        // - 修复 Boss第2关抓取功能报错
        // - 修复 character_shadow资源加载失败问题
        // - 修复 快捷键H应该为放入鞋子 bug
        // - 优化 13%加载卡顿：采用分批并行加载；VMD加载改为串行
        // - 更新 硬直、兴奋、高潮概率计算（更易触发）
        // - 降低精英巨大娘伤害
        // - 加快千米级巨大娘动作速度
        // - 巨大娘天赋“增加动作速度”最大等级提升至75
        // - 降低巨大娘音效音量
        // - 敌方巨大娘目标永久锁定玩家
        // - 更新技能描述文案
        // - 更新激活页面说明
        // - 增加网络防火墙检测时间阈值
        // - 扩展平板设备兼容性

        // v1.1.2 相关更新点如下，感谢您：
        // 修复与优化

        // - 修复 关卡巨大娘进行踩踏或者脚碾时如果硬直了，可能会不动 bug
        // - 修复 第二个开始的关卡巨大娘进行踩踏或者脚碾时，可能会不动 bug
        // - 修复 巨大娘进行夹腿时如果硬直了，夹腿的声音不会停止 bug
        // - 修复 BaiXi巨大娘人物 坐 硬直相关的vmd
        // - 激活页面 加入 激活后的收益说明
        // - 增加按键ui大小
        // - 降低了武器的伤害
        // - 修复 加载资源可能因失败而报错 bug：现在会重新加载最多3次
        // - 修复 Boss第2关：如果boss进入踩踏的动作击杀boss，boss会重复执行踩踏动作并且游戏崩溃 bug

        // v1.1.1 相关更新点如下，感谢您：
        // 修复与优化

        // - 修复 关卡巨大娘进行踩踏或者脚碾时，可能会不动 bug
        // - 修复 关卡巨大娘可能会趴着不动 bug
        // - 修复 Boss第2关的脚碾报错 bug
        // - 修复 Boss第3关的手护胸报错 bug
        // - 脚碾时现在会看向目标了 
        // - 更新升级界面中的巨大娘技能图标
        // - 更新了升级描述文案

        // v1.1.0 相关更新点如下，感谢您：

        // 新增内容

        // - 玩家巨大娘角色新增技能：
        //     - 跳踩 
        //     - 左脚踩踏 
        //     - 碾脚 
        //     - 坐 
        //     - 夹腿 
        //     - 臀碾
        //     - 抽插
        //     - 插入
        //     - 放入胸部 
        //     - 放入鞋
        //     - 释放胸部/鞋/UB

        // 开发优化

        // - 实现脚本一键发布至腾讯云与Vercel

        // 版本规划

        // - 更多新技能、职业、局部变大等内容将陆续在v1.1.x版本推出

        //         `
        //         `
        // v1.0.14 相关更新点如下，感谢您：
        // 修复与优化

        // - 修复 诺亚 趴相关动作陷在地里 bug
        // - 修复 精英巨大娘移动速度与行动速度不匹配 bug
        // - 修复 进攻城市关卡：难度高后，精英巨大娘可能不刷新 bug
        // - 修复 玩家巨大娘击败单位没有爆宝石、金币 bug
        // - 修复 可能会重复删除场景或者在删除场景后更新场景而报错 bug
        // - 修复 小人角色：开始重击->学习近战霸体->结束重击：可能会报错 bug
        // - 移除 升级后的提示
        // - 优化 运行性能

        // v1.0.13 相关更新点如下，感谢您：

        // 新玩家系统

        // - 新手奖励领取时 显示获得的神器名称
        // - 新手奖励领取期限 缩短至5天

        // 修复与优化

        // - 修复 地形纹理加载报错
        // - 修复 “召唤的玩家女神/巨大娘共享玩家巨大娘角色天赋”没有生效 bug
        // - 建筑体积与奖励关联：不同大小建筑掉落不同奖励

        // 职业调整

        // - "普通人"职业 移除宝石需求


        // v1.0.12 相关更新点如下，感谢您：
        // 修复与优化

        // - 进攻城市关卡：消灭所有敌人后不再触发增援事件
        // - 优化召唤类BUFF剩余时间显示格式

        // 平衡性调整

        // - 召唤的玩家女神/巨大娘共享玩家巨大娘角色天赋
        // - 商店调整：
        // • 召唤巨大娘等道具降价
        // • 神器实施差异化定价
        // • 商品栏位扩充

        // v1.0.11 相关更新点如下，感谢您：
        // 🔧 修复与优化

        // - 修复 捕获巨大娘后角色丢失 bug
        // - 修复 Meibiwusi中文显示异常
        // - 小人名称本地化（中文显示）
        // - 修复 随机职业特性冲突 bug

        // - 激活游戏后机制变更：
        // • 不再掉落"巨大娘人物使用"道具
        // • 神器/复活石/捕获器爆率增加的幅度提升至200%

        // v1.0.10 相关更新点如下，感谢您：
        // 🔧 修复与优化

        // - 加快放大/缩小枪射击速度
        // - 修复 随难度提升军队攻击频率下降 bug
        // - UI调整：道具数量显示位置变更
        // - 巨大娘名称本地化（中文显示）
        // - 移动端：扩大虚拟移动键区域

        // ⚖️ 平衡性调整

        // - 削弱 "击杀军队后增强"职业特性 的攻击力加成
        // - 召唤女神神器效果强化：每次的叠加时间按2倍计算
        // - 武器升级金币公式重算


        // v1.0.9 相关更新点如下，感谢您：
        // 🔧 修复与优化

        // - littleMan倒地时不显示准心
        // - 修复 获得地形纹理(如 base2)时可能报错
        // - 修复 获得建筑的血量可能报错
        // - UI新增 “不显示建筑烟雾”选项
        // - 玩家被击败后 恢复播放死亡动画
        // - 升级交互修改：默认自动弹出升级方向窗口，可切换为手动弹出

        // ⚖️ 平衡性调整

        // - 调整 热度和奖励级别
        // - 低难度下 关卡巨大娘不会多次主动变大

        // v1.0.8 相关更新点如下，感谢您：
        // 🔧 修复与优化

        // - 增加提示的内容
        // - 捕获新的网络错误
        // - 优化：静态物体摧毁后销毁关联数据

        // ⚖️ 平衡性调整

        // - 降低领取奖励的宝石数量
        // - 进攻城市关卡：精英巨大娘生成距离提升

        // v1.0.7 相关更新点如下，感谢您：

        // - 调整 复活石、捕获器、巨大娘人物使用 道具的爆率
        // - 刷步加弹升级方向更早出现
        // - 更新userData数据库字段
        // - 新玩家/新激活玩家加入 “每日领取奖励”
        // - 修复 使用清除仇恨->切换角色报错 bug
        // - 修复 移动端：进入关卡->结束关卡->进入关卡：射击方式变为点射 bug
        // - 修复 getCareerData报错 bug
        // - 修复 小人天赋叠加 bug
        // - 修复 PC端：关闭界面会射击一次 bug
        // - 优化 召唤出的女神过大时，渲染精度最大到“非常高”
        // - 敌方巨大娘和野生巨大娘属性对调


        // v1.0.6 相关更新点如下，感谢您：

        // - 修复 相机丢失：暂停一下游戏后，回来就报错 bug
        // - 调整 复活石、捕获器、巨大娘人物使用 道具的爆率
        // - 修复 小人角色硬直后，应该自动回到上一次的开火或者近战攻击状态 bug
        // - PC端加入“连射”控制选项
        // - 修复 宝石、金币 对于3万米巨大娘、小人远程打击的情况不可达 bug
        // - 调整炮塔属性

        // v1.0.5 相关更新点如下，感谢您：

        // - 优化 运行性能，提高帧数
        // - 修复 Boss第2关：使用Sunxiaomei->LightStomp报错 bug
        // - 恢复 Ciming, Lipusi, Sunxiaomei脚部骨骼相关
        // - Ciming鞋类型使用厚高跟鞋类型
        // - 优化 内存泄露造成的闪退
        // - 散弹枪升级子弹数量：从5级降到3级


        // v1.0.4 相关更新点如下，感谢您：

        // - 修复 出现巨大娘时报骨骼undefined的错误 bug
        // - 修复 高跟鞋被打掉后脚部碰撞不正确 bug
        // - 修复 决斗者职业导致事件触发时报rate NaN错误 bug
        // - 修复 关卡失败而玩家角色没有被击败时，玩家角色不应该死亡 bug
        // - 修复 激活游戏后，选择巨大娘人物仍然会消耗“巨大娘人物使用”道具 bug

        // v1.0.3 相关更新点如下，感谢您：

        // - 火力支援事件降低伤害
        // - 提升“增加军队/精英巨大娘人数”热点的奖励级别
        // - 增加道具爆率
        // - 限制“巨大娘人物使用”道具最大可爆出的个数
        // - 修复 绑定事件、生成奖励相关的bug

        // v1.0.2 相关更新点如下，感谢您：

        // - 修复 激活页面可能显示不正确 bug
        // - 修复 计算激活时间不正确 bug
        // - 禁止激活vip
        // - 修复 Sunxiaomei骨骼错误 bug
        // - 修复 Boss关卡没有触发事件 bug
        // - 错误处理 显示当前时间
        // - 修复 玩家巨大娘角色被击败后血量不为0 bug
        // - 修复 新用户登录后不能看到版本更新 bug

        // v1.0.1 相关更新点如下，感谢您：

        // - 玩家的巨大娘角色的弱点伤害在难度低时会被降低
        // - 加强巨大娘对中毒等被动技能的随身高而衰减的效果
        // - 降低 近战士兵血量
        // - 开局临时赠送子弹
        // - 修复 Ciming、Lipusi骨骼undefined bug
        // - 修复 rate错误 bug
        // - 修复 切换角色报错 bug
        // - 修复 结束关卡后可能报错 bug
        // - 修复 等待20秒后会停止循环 bug
        // - 现在等待20秒后除了道具外不会新增宝石、金币
        // - 修复 认真了事件触发可能报错 bug
        // - 玩家被击败后不会播放死亡动画，会立即结束关卡

        // 发布了v1.0正式版，版本特点为 稳定、核心玩法成型、删档、免费且可激活游戏。
        // 相关更新点如下，感谢您：

        // - 加入8个新的巨大娘人物
        // - 加入新的小人人物
        // - 修复bug
        // - 优化
        // - 补充小的功能点
        // `
        ,
        newContentEng:
            `
v1.2.7 Release Notes

Fixes & Optimizations

- Fixed a bug where using the Giantess control prop->UB: would cause the character to remain stuck in a grabbing state
- Fixed a bug where the character state would not reset properly after the Giantess control prop ended
- Removed the "Generate Item" UI option

Game Mechanics

- LittleMan character can now be grabbed by Player Giantess even when the Allow Friendly Damage heat is disabled
- Increaase capture giantess probability

Visual & Experience

- Significantly reduced severe camera shake in the Giantess character's first-person leg perspective
- Show confirm before logout


v1.2.6 Release Notes

Game Mechanics

- Giantess characters will no longer get stuck at map edges
- Ally units no longer limit enemy spawn counts in attack/defend city missions
- Updated upgrade direction pop-up probability now higher at higher levels

Visual & UI

- Increased visible range at maximum rendering quality
- Optimized gem display in level completion interface

Fixes & Optimizations

- Fixed issue where tiny character's target lock wouldn't clear after Giantess death
- Fixed abnormal collision volume on Xia Hui's left foot
- Fixed bug where dropped items could have zero quantity


v1.2.5 Release Notes

Fixes & Optimizations

- Fixed a bug where account server data might be cleared
- Use Giantesses Item are now restored in Restore Game if an error occurs
- Fixed a bug where Boss movement in Boss Levels could cause errors
- Fixed a bug that could occur when pick elite Giantess
- Fixed a bug where LittleMan could not see the Giantess's full body model
- Fixed a bug where scrolling when selecting a career on mobile could cause accidental selection
- Fixed a bug where the direction buttons might display incompletely after switching to full screen on mobile


v1.2.4 Release Notes

Fixes & Optimizations

- Fixed a bug where enabling production mode during debugging caused hanging at 12% load
- Fixed a bug where the camera might move after closing the skill selection interface in LittleMan Character first-person view
- Fixed a bug requiring two taps to select a career on mobile devices
- Added detection for app wrapper environments

New Content & Features

- Added Remove Map Edge Area heat

Game Balance

- Attack City Stage: not appear wild giantess when use giantess character


v1.2.3 Release Notes

Game Balance

- Enemy Giantesses will not appear when the player uses a LittleMan Character

User Interface

- Status of multiple MMD Giantesses is now displayed simultaneously
- The active growth buff now displays remaining time and the time bar has been removed

System Updates

- Updated the Allow Friendly Damage mechanics


v1.2.2 Release Notes

Core Changes

- The game no longer automatically adjusts resolution and rendering quality

New Content & Features

- Added the "Allow damage between friendly units" heat


v1.2.1 Release Notes

Fixes & Optimizations

- Fixed an error when a Giantess with the Peacefull career completes a level
- Fixed the getUsedGirlData error
- Fixed an error occurring when climax
- Fixed an error when directing a Giantess to target a non-existent entity
- Fixed the issue where controlling a Giantess to grow larger was ineffective
- Fixed the inability to use sprint and heavy attack abilities for littleMan
- Fixed the display issue for certain player buffs

v1.2.0 Release Notes

New Content & Features

- Support has been added for multiple MMD Giantess to appear simultaneously

Fixes & Optimizations

- Fixed a crash bug that could occur during the boss's attack sequence in Boss Levels 1 and 2
- Fixed a bug that level giantess not select far units

Known Issues

- There is currently no interaction between multiple MMD Giantess
`
        //             `
        // The main contributors of this version are:
        // qq1442740150、TouhouEnthusiast

        // v1.1.19 Release Notes

        // Update

        // - Index page remove v2.0-alpha.1(Multiplayer Demo) entry


        // v1.1.18 Release Notes

        // New Content

        // - Index page add v2.0-alpha.1(Multiplayer Demo) entry


        // v1.1.17 Release Notes

        // System Adjustments

        // - Giantess actions no longer damage allied units
        // - International sponsorship platform switched to "Gravity Circle"
        // - Updated game logo

        // General Maintenance

        // - Fixed various known issues



        // v1.1.16 Release Notes

        // Core Mechanic Changes

        // - Giantess actions now affect and damage allied units
        // - Players can now damage allied units

        // New Content

        // - Added new Giantess career: Foot Fetish

        // Career Balance Updates

        // - Healer career rework: Breast Feeding now has a chance to convert target units to ally faction

        // Fixes & Optimizations

        // - Fixed potential errors when AI uses Thigh Squeeze
        // - Resolved excessive self-damage from Breast Feeding, Milk Spray, Suction, and Thrust actions
        // - Fixed errors when Giantesses damage Elite Giantesses
        // - Giantess skills can now not has 0 damage

        // v1.1.15 Release Notes

        // New Content

        // - Added new Giantess career: Healer
        // - New Giantess upgrade directions:
        //     - Breast Press Rub: Put To Breast
        //     - Stomp Rub: Put To Shoe
        //     - Sit Rub: Insert

        // Balance Adjustments

        // - Reduced height/HP bonuses from Eat and Absorb
        // - Maximum upgrade level for Passive/Impact Growth reduced to 20 when using Infinite Big Artifact

        // Fixes & Optimizations

        // - Healing effects now display numerical values
        // - Fixed potential errors when using Put to breast -> Fall with Carrier+Absorber careers
        // - Absorber career: Absorption damage no longer guarantees stagger
        // - Some Giantess Characters can now store units between toes when using Put to shoe
        // - Miku and Noah now have can learn Put to shoe skill
        // - Fixed Miku floating in air Bug


        // v1.1.14 Release Notes

        // New Content

        // - Added new Giantess career: Absorber
        // - New LittleMan/Giantss career: Sadist

        // Balance Adjustments

        // - Slowed breast auto-shrink speed
        // - Accelerated belly auto-shrink speed

        // Fixes & Optimizations

        // - Fixed career interference bug when both select Masochism
        // - Humanoid units can now be lie down during stand-up animation
        // - Fixed mobile camera offset after leveling up in first-person view
        // - Prevented accidental career selection when scrolling on mobile


        // v1.1.13 Release Notes

        // New Content

        // - Added new Giantess career: Carrier

        // Balance Adjustments

        // - Reduced self-damage from UB skill
        // - Lowered damage dealt by Insert action to units
        // - Giantess Stimulator artifact now more easily triggers breast growth

        // System Expansion

        // - New Giantess upgrade directions:
        //     - Breast damaged will partial scale
        //     - Add Max Excitement

        // Fixes & Optimizations

        // - Fixed Giantess size reduction occurring before climax animation completion
        // - Resolved errors when milk spray damages non-controlled units
        // - Fixed camera offset after leveling up in first-person view 
        // - Corrected camera misalignment after passive growth for Player Giantess character
        // - Updated text descriptions and UI styles


        // v1.1.12 Release Notes

        // New Content

        // - Added new Giantess career: Vaginal Capturer

        // Balance Adjustments

        // - Reduced excitement rate for Giantesses
        // - Reverted EXP requirements for upgrade to previous values
        // - Increased probability of upgrade selection after leveling up

        // System Expansion

        // - New Giantess upgrade directions:
        //     - Enhanced Chest Partial Growth
        //     - Enhanced Belly Partial Growth

        // Fixes

        // - Fixed incorrect self-damage from Insert skill
        // - Resolved falling units freezing when releasing UB and switching to littleMan


        // v1.1.11 Release Notes

        // System Expansion

        // - Implemented partial growth mechanics for breast and belly
        // - Partial growth reduces action speed
        // - Added gradual recovery to original size over time
        // - Breast attacks now trigger growth when using Giantess Stimulator artifact
        // - Breast size decreases after milk spray attacks
        // - Larger breast size enhances milk spray effectiveness
        // - Breast resets to original size after climax
        // - Belly expands after eating units
        // - No additional benefits when eating units at maximum belly size

        // Fixes & Optimizations

        // - Fixed abnormal size increase of picked units
        // - Resolved 0 damage display during running repel
        // - Corrected repoel distance calculation formula

        // v1.1.10 Release Notes

        // System & Balance Adjustments

        // - may skip upgrade selection after leveling up (the skip probability increases with level)
        // - Reduced EXP required for level ups
        // - Removed starting gift items
        // - LittleMan can now stand up when pinned down
        // - Extended stand-up time for littleMan

        // Fixes & Optimizations

        // - Fixed camera offset when player Giantess character walks
        // - Fixed walk/run animations for Vanilla
        // - Fixed hovering glitch for Kongzhilvzhe
        // - Fixed floating animation during grab actions for Xiaye2
        // - Updated css of difficulty customization page
        // - Fixed undersized blood effects for Elite Giantesses
        // - Fixed targeting issue in Defense City Stage (player goddess/giantess incorrectly targeting army)
        // - Increase HP for player goddesses

        // v1.1.9 Release Notes

        // Balance Adjustments

        // - Increased EXP required for level ups

        // Fixes & Optimizations

        // - Fixed littleMan melee attacks incorrectly flattening military vehicles, military buildings
        // - Fixed incorrect collision box after Giantess pickdown units
        // - Fixed crosshair default target position being too high
        // - Fixed Giantess being unable to stomp correctly after removing shoes

        // v1.1.8 Release Notes

        // Fixes & Optimizations

        // - Added error handling for pointer lock uncaught failures
        // - Fixed crosshair flickering issue when littleman move back
        // - Giantess Controller SitRub/TightenLeg actions now execute immediately
        // - Fixed incorrect damage number colors when littleMan attacks turrets
        // - Adjusted camera distance when littleMan is imprisoned (was too close)
        // - Perspective optimization: littleMan can now see entire body of super-sized Giantesses
        // - Revised passive/damage bigger: limit increased height for these skills instead

        // v1.1.7 Release Notes

        // Fixes & Optimizations

        // - Fixed BUG where Giantess skill enhancement options were incorrectly available to littleMan
        // - Fixed issue where item interface might not auto-close after use
        // - Fixed crosshair disappearing when littleMan backtracks in first-person view
        // - Fixed Level Giantess milk spray damage incorrectly applying on first frame
        // - Fixed City Attack Stage: Allow entering doors by pressing V when nearby (even without prompt)
        // - Fixed BUG where QTEs triggered when Level Giantess used free skills on littleMan
        // - Fixed thigh squeeze audio not stopping when entering doors in City Attack Stage
        // - Added restriction: Cannot switch to littleMan while controlling units (e.g. UB)
        // - Updated text descriptions for Giantess skill enhancement upgrades
        // - Added "Spray Milk" action to Giantess Controller


        // v1.1.6 Release Notes

        // System Expansion

        // - Giantess Controller now includes a personality and new actions
        // - Player giantess characters: All bigger skills can now be learned simultaneously
        // - Add new buffs: Crippled, Charmed, Blurred, Excited
        // - Player giantess character now have upgrade options for skill enhancements (e.g., crawl lick upgrade to eat)
        // - Giantess AI can now utilize skill enhancement upgrade options

        // Fixes & Optimizations

        // - Fixed a bug where poison/injury status damage for giantesses was calculated repeatedly
        // - Fixed an issue where littleMan in the "Attack City" level would reborn suspended in mid-air after dying inside shoes
        // - Fixed an bug where falling units would get stuck in mid-air when hit by jump stomp attack
        // - Optimized the positioning of little man character inside breasts/shoes/UB—their positions are now correctly calculated
        // - Optimized giantess AI to use specific action logic when targeting units inside breasts/shoes/UB
        // - Fixed an error with tween animation ID retrieval

        // v1.1.5 Release Notes

        // Fixes & Optimizations

        // - Removed camera restriction when pickup
        // - littleMan now uses Giantess first-person camera
        // - Fixed probability selection mechanism errors
        // - Removed destory rate check in Protect City stage
        // - Updated UB damage calculation
        // - Reduced spray milk damage
        // - Select Giantess page now displays all characters
        // - Units in falling/repel states can now be picked
        // - AI: Added pick distance judgment
        // - Fixed Level Giantess frequently switching targets
        // - Fixed littleMan unable to melee attack while moving
        // - Fixed stomping action bugs in Boss Stage 2
        // - Fixed bullet speed not resetting when entering new stage as Weapon WorkMan career
        // - Reduced item icon size
        // - Fixed Elite Giantesses idling in Protect City stage
        // - Improved timeout handling for resource loading
        // - Fixed Loading bug
        // - Fixed Boss Stage 2: If the boss enters the stomp rub action and is killed, the boss will repeatedly execute the stomping action and cause the game to crash bug

        // Balance Adjustments

        // - Weapon WorkMan career now receives greater luck reduction

        // v1.1.4 Release Notes

        // New Features & Optimizations

        // - Added all new actions to Level Giantesses
        // - Added stomp-related actions to Boss Giantesses in Boss Stages 1 & 2
        // - Implemented random personality system for Level Giantesses (affects pose selection, action preference, target choice, and growth probability)
        // - Improved targeted stomping speed in Boss Stage 2
        // - Updated Giantess skill attributes

        // Fixes & Adjustments

        // - Fixed Level Giantess AI: Player Giantess AI no longer affected by difficulty settings
        // - Different skills now provide varying excitement
        // - Fixed foot collision volume for Youye character
        // - Fixed Boss Level 2 issue: Giantesses remaining idle after revival by Pinch
        // - Fixed enemy Giantess targeting logic (now exclusively targets players)
        // - Fixed first-person perspective in sitting pose shouldn't rotate character
        // - Fixed crawling slide glitch
        // - Separated camera sensitivity settings for littleMan and Giantess 
        // - Fixed damage limitation skill failure

        // v1.1.3 Release Notes

        // New Content

        // - Added new skills for player Giantess characters:
        //     - Breast Rub
        //     - Crawl Beat
        //     - Crawl Lick
        //     - Spray Milk

        // Fixes & Optimizations

        // - Fixed particle size/offset for climax effects & Boss Stage 2 liquids
        // - Fixed pickup errors in Boss Stage 2
        // - Fixed character_shadow resource loading failures
        // - Fixed key H should be put to shoe
        // - Optimized 13% loading stall: Implemented batched parallel loading + serial VMD loading
        // - Updated probability calculations for Stun/Excitement/Climax (now easier to trigger)
        // - Reduced Elite Giantess damage
        // - Increased action speed for kilometer-level Giantesses
        // - Max level for Giantess talent "Action Speed Increase" increased to 75
        // - Lowered Giantess sound effect volume
        // - Enemy Giantesses now permanently target players
        // - Updated skill descriptions
        // - Revised activation page instructions
        // - Extended anti-cheat wall detection time threshold
        // - Expanded tablet device compatibility

        // v1.1.2 Release Notes
        // Fixes & Optimizations

        // - Fixed bug where Giantesses could freeze during stomp/foot grind actions when stunned
        // - Fixed bug where Giantesses in non-initial stages could freeze during stomp/foot grind actions
        // - Fixed bug where thigh squeeze sound effects persisted after being stunned
        // - Fixed VMD animations for BaiXi Giantess's sitting stagger state
        // - Added benefit descriptions to the activation page
        // - Increased Operate button UI size
        // - Weapon damage values were reduced
        // - Fixed resource loading failure errors: Added retry mechanism (max 3 attempts)

        // v1.1.1 Release Notes
        // Fixes & Optimizations

        // - Fixed bug where Giantesses could freeze during stomp/foot grind actions
        // - Fixed bug where Giantesses might remain stuck in prone state
        // - Fixed errors during foot grind in Boss Stage 2
        // - Fixed errors during chest protection animation in Boss Stage 3
        // - Added target focusing behavior during foot grind actions
        // - Updated skill icons for Giantess upgrades
        // - Improved upgrade description texts

        // v1.1.0 Release Notes
        // New Content

        // - Added new skills for player Giantess characters:
        //     - Stomp Jump
        //     - Left Foot Stomp
        //     - Foot Grind
        //     - Sit
        //     - Thigh Squeeze
        //     - Hip Crush
        //     - Thrust
        //     - Insert
        //     - Store in Breast
        //     - Store in Shoe
        //     - Free Breast/Shoe/UB

        // Development Optimization

        // - Implemented one-click deployment to Tencent Cloud & Vercel

        // Future Roadmap

        // - Additional skills, careers, partial growth mechanics to be released in v1.1.x updates
        // `
        //         `
        // v1.0.14 Release Notes
        // Fixes & Optimizations

        // - Fixed Noah's crawl animations clipping into terrain
        // - Fixed Elite Giantess movement/action speed mismatch
        // - Fixed Elite Giantess spawn failure in City Attack Stage at high difficulty
        // - Fixed not generate gem, coin by player giantess bug
        // - Fixed may duplicate dispose scene or update scene after dispose error
        // - Fix littleman character: Start swiping ->Learn melee strong ->End swiping: may report error bug
        // - Remove upgrade tip
        // - performance optimizations

        // v1.0.13 Release Notes
        // New Player System

        // - Newbie rewards display obtained Artifact names
        // - Newbie reward claim window reduced to 5 days

        // Fixes & Optimizations

        // - Fixed terrain texture loading errors
        // - Fixed bug: Summoned units' talent sharing not activating
        // - Building size affects rewards: Different rewards from various-sized structures

        // Class Changes

        // - "Ordinary" class no longer requires gems

        // v1.0.12 Release Notes
        // Fixes & Optimizations

        // - City Attack Stage: Reinforcement events disabled after clearing all enemies
        // - Improved time display format for summoned buffs (e.g. goddess summons)

        // Balance Adjustments

        // - Summoned player goddesses/Giantesses now share the talents of player's Giantess character
        // - Shop adjustments:
        // • Price reduction for Giantess summon items
        // • Tier-based pricing implemented for Artifacts
        // • Increased stock slots

        // v1.0.11 Release Notes
        // 🔧 Fixes & Optimizations

        // - Fixed captured Giantess disappearing bug
        // - Fixed Meibiwusi's Chinese display error
        // - Fixed conflicting features in random career

        // Post-activation-game changes:
        // • "Giantess Character Usage" items stop dropping
        // • Drop rates for Artifacts/Revival Stones/Capture increased to 200%

        // v1.0.10 Release Notes
        // 🔧 Fixes & Optimizations

        // - Increased fire rate for Bigger/Smaller Guns
        // - Fixed bug: Army attack frequency decreased at higher difficulties
        // - UI: Relocated item quantity display
        // - Mobile: Expanded virtual joystick area

        // ⚖️ Balance Adjustments

        // - Nerfed attack bonus from "Army Kill Empowerment" career feature
        // - "Goddess Summon" artifact effect buffed: Duration ×2 on stack
        // - Recalculated gold cost formula for weapon upgrades


        // v1.0.9 Release Notes
        // 🔧 Fixes & Optimizations

        // - Crosshair hidden when littleMan is downed
        // - Fixed terrain texture acquisition errors (e.g. base2)
        // - Fixed get building's hp may error
        // - Added "Not Show Building Smoke" UI option
        // - Death animations are now played again after player defeat
        // - Upgrade interaction: Auto-popup upgrade direction window by default, switchable to manual

        // ⚖️ Balance Adjustments

        // - Adjusted heat & reward level
        // - Level Giantesses won't proactively grow repeatedly on lower difficulties

        // v1.0.8 Release Notes
        // 🔧 Fixes & Optimizations

        // - Add more tip
        // - Capture more network error
        // - Optimization: destroy related data of static objects when destoryed

        // ⚖️ Balance Adjustments

        // - Reduced gem from Get Reward
        // - Attack City Stage: Elite Giantesses now spawn farther away

        // v1.0.7 Release Notes
        // Thank you for your support. The following updates are now live:

        // 🔧 Fixes & Optimizations
        // - Adjusted drop rates for:
        // • Revival Stone
        // • Capture 
        // • Giantess Character Usage items
        // - Fixed "Clear Hatred → Switch Character" error
        // - Fixed mobile bug: Tap firing not continuous after re-entering stages
        // - Fixed getCareerData errors
        // - Fixed littleman character talent stacking bug
        // - Fixed PC bug: shouldn't trigger shooting when closing interfaces
        // - Optimized rendering: Max precision set to "Very High" for oversized summoned goddesses

        // ⚖️ Balance Adjustments
        // - Swapped attributes between enemy and wild Giantesses

        // ✨ New Features
        // - Daily Login Rewards added for new/activated players
        // - "Add Bullet By Move" now unlocks earlier
        // - Database schema update (userData fields)

        // v1.0.6 Release Notes
        // Thank you for your continued support. The following updates and adjustments are now live:

        // Fixes & Adjustments
        // - Fixed a bug where camera loss caused errors after pausing the game.
        // - Adjusted drop rates for Revival Stone, Capture Device, and Giantess Character Usage items
        // - Fixed an issue where littleman characters failed to automatically resume their previous ranged firing or melee attack state after exiting stagger
        // - Resolved unreachability of gems and coins for 30,000-meter-tall Giantesses or littleman characters during ranged attacks.

        // New Features
        // - Added "Continuous Fire" control option for PC, enabling continuous projectile firing when holding the attack key.

        // Balance Changes
        // - Adjusted turret attributes to improve combat balance.

        // v1.0.5 Update Notes:
        // Thank you for your continued support. The following fixes and adjustments are now implemented:

        // - Optimize runtime, improve FPS
        // - Fixed LightStomp error with Sunxiaomei in Boss level2
        // - Restore Ciming, Lipusi, Sunxiaomei foot bone related
        // - Ciming's shoe type use rear heel type
        // - Optimize memory leak cause exit
        // - Shotgun upgrade->bullet count: decrease to 3 level

        // v1.0.4 Update Notes:
        // Thank you for your continued support. The following fixes and adjustments are now implemented:

        // - Fixed "undefined bone" errors when spawning Giantesses
        // - Fixed incorrect foot collision physics after high heels are knocked off
        // - Fixed "rate NaN" errors triggered by the Duelist career during events
        // - Fixed an issue where player characters wouldn't die upon stage failure if not defeated
        // - Fixed a bug where selecting Giantess characters still consumed "Giantess Character Usage" items after game activation

        // v1.0.3 Update Notes:
        // Thank you for your support. The following updates are now live:

        // - Reduced damage from the Fire Support Event
        // - Increased reward level for "Add Army/Elite Giantess count" heat
        // - Raised item drop rates
        // - Limited maximum drops of "Giantess Character Usage" items per battle
        // - Fixed bugs related to event binding and reward generation

        // v1.0.2: Thank you for your support. The following updates have been implemented:

        // - Fixed a bug where the activation page might display incorrectly
        // - Fixed incorrect activation time calculation
        // - VIP activation is now disabled
        // - Fixed bone errors for Sunxiaomei
        // - Fixed a bug where Boss level failed to trigger events
        // - Error handling: Added display of current time
        // - Fixed an issue where defeated Giantess player characters did not have HP reduced to 0
        // - Fixed a bug where new users couldn't see version update notice after logging in

        // v1.0.1: Relevant updates are as follows. Thank you for your support:

        // - Weak point damage from players' Giantess characters is reduced at lower difficulty levels
        // - Enhanced the scaling effect of passive skills (e.g., poison) on Giantesses based on height
        // - Reduced HP of melee soldiers
        // - Temporarily granted bullets at the start of the game
        // - Fixed undefined bone errors for Ciming and Lipusi
        // - Fixed rate calculation errors
        // - Fixed character switching errors
        // - Fixed potential post-stage completion errors
        // - Fixed a bug causing loop interruptions after 20 seconds of waiting
        // - No new gems/gold (except items) will spawn after 20 seconds of waiting
        // - Fixed potential errors when triggering the "Serious" event
        // - Players skip death animation upon defeat and immediately end the stage

        // The v1.0 release version is now live. Key features include stability, fully developed core gameplay, save data wipe, and free-to-play with activation.
        // Here are the relevant updates. Thank you for your support:

        // - Added 8 new Giantess characters
        // - Added new little characters
        // - Bug fixes
        // - Optimizations
        // - Minor feature additions
        // `

    }
}