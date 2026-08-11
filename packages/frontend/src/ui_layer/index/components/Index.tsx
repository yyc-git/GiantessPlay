import "./Index.scss"

import React, { useState, useEffect } from 'react';
import { Button, Layout } from 'antd';
import { readState, writeState } from "../../../business_layer/State";
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../store/AppStore";
import { page, scene } from "../../global/store/GlobalStoreType";
import { setPage, setTargetScene } from '../../global/store/GlobalStore';
import SelectCharacter from "../select_character/components/SelectCharater";
import Scene from "../scene/component/Scene";
import { hideCanvas } from "../../utils/CanvasUtils";
import { addNeedToPlaySound, play, stopIndexSounds } from "../../../business_layer/Sound";
import { getIsDebug, getIsProduction, isChinese } from "../../../scene3d_layer/script/scene/Scene";
import IndexMain from "../index_main/components/IndexMain";
import SelectLevel from "../select_level/components/SelectLevel";
import { getAbstractState } from "../../../scene3d_layer/state/State";
import Setting from "../setting/components/Setting";
import Mod from "../mod/components/Mod";
// import Donate from "../donate/components/Donate";
import Share from "../share/components/Share";
import Explain from "../explain/components/Explain";
import { off, on, trigger } from "../../../business_layer/Event";
import { buildErrorEventData, getErrorEventName, getIsEnterScenarioEventName, getNetworkErrorEventName } from "../../../scene3d_layer/utils/EventUtils";
import { setError } from "../error_handle/store/ErrorHandleStore";
import { getKeyDownEventName } from "meta3d-jiehuo-abstract/src/Event";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import ErrorHandle from "../error_handle/component/ErrorHandle";
import ActiveCode from "../active_code/components/ActiveCode";
import SelectLittleMan from "../select_little_man/components/SelectLittleMan";
// import SelectChapter from "../select_chapter/components/SelectChapter";
import Difficulty from "../difficulty/components/Difficulty";
import Talent from "../talent/components/Talent";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { Event } from "meta3d-jiehuo-abstract";
import { buildAPI } from "../../../scene3d_layer/mod/Mod";
import Login from "../login/components/Login";
import Register from "../register/components/Register";
import * as Backend from "backend/src/Main"
// import NetworkErrorHandle from "../error_handle/network_error_handle/component/NetworkErrorHandle";
import { Modal } from "antd-mobile";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import { getLanguageTextData, languageKey } from "../../../scene3d_layer/internation/Data";
import { handleEventHandler } from "../../utils/ErrorUtils";
import { isStop } from "../../../scene3d_layer/script/scene/scene_city/Time";
import { isEnteringNextLevel } from "../../../scene3d_layer/script/scene/scene_city/manage/mission/Mission";
import SelectCareer from "../select_career/components/SelectCareer";
import { isBossLevel } from "../../../scene3d_layer/script/scene/scene_city/CityScene";
import { getModAPI } from "../../../scene3d_layer/script/scene/scene_city/Mod";
import { getDefaultBlockService } from "../../../scene3d_layer/mod/CareerMod";
import { deferSwitchPageForGetNewestState } from "../../utils/SwitchPageUtils";
import { setDefaultCareer, setSelectedCareerData } from "../../../scene3d_layer/script/scene/scene_city/build/Career";
import { getActualHeight, getActualWidth, getHeight } from "meta3d-utils/src/View";
import { Device } from "meta3d-jiehuo-abstract";

let Index: React.FC = () => {
    let page_ = useSelector<AppState>((state) => state.global.page)

    let dispatch: AppDispatch = useDispatch()

    let _render = () => {
        switch (page_) {
            case page.IndexMain:
                hideCanvas()

                return <IndexMain />
            case page.Mod:
                return <Mod />
            case page.Setting:
                return <Setting />
            // case page.Donate:
            //     return <Donate />
            case page.IndexActiveCode:
                return <ActiveCode page={page.IndexMain} />
            case page.ActiveCode:
                return <ActiveCode page={page.SelectCharacter} />
            case page.Share:
                return <Share />
            case page.Website:
                // globalThis.location.href = "https://gts-play-website-jdjsc8wl-yyc-git.4everland.app/"
                // globalThis.location.href = "https://gts-play-website-dz9pzzyc-yyc-git.4everland.app/"

                // globalThis.location.href = "https://gts-play-website-u771.4everland.app/"

                // globalThis.location.href = "https://meta3d-local-9gacdhjl439cff76-1302358347.tcloudbaseapp.com/gts_play_website/build/index.html"
                if (isChinese()) {
                    // globalThis.location.href = "../website/chinese/index.html"
                    globalThis.location.href = "https://gts-play.cn/website/chinese/index.html"
                }
                else {
                    globalThis.location.href = "https://gts-play.cn/website/english/index.html"
                }

                return null
            // case page.SelectRoad:
            //     return <SelectRoad />
            // case page.LittleManSetting:
            //     return <LittleManSetting />
            // case page.GiantessSetting:
            //     return <GiantessSetting />
            // case page.BiwuSetting:
            //     return <BiwuSetting />
            // case page.SelectChapter:
            //     return <SelectChapter />
            case page.SelectCharacter:
                return <SelectCharacter />
            case page.SelectLittleMan:
                return <SelectLittleMan />
            case page.SelectLevel:
                return <SelectLevel />
            case page.SelectLittleManCareer:
                let p1
                if (isEnteringNextLevel(readState())) {
                    if (isBossLevel(readState())) {
                        p1 = page.Scene
                    }
                    else {
                        p1 = page.SelectGiantessCareer
                    }
                }
                else {
                    p1 = page.LittleManTalent
                }
                return <SelectCareer characterType_={characterType.LittleMan} page={p1} />
            case page.SelectGiantessCareer:
                let p2
                if (isEnteringNextLevel(readState())) {
                    p2 = page.Scene
                }
                else {
                    p2 = page.GiantessTalent
                }
                return <SelectCareer characterType_={characterType.Giantess} page={p2} />
            case page.Explain:
                return < Explain />
            case page.Scene:
                return <Scene />

            case page.Difficulty:
                return <Difficulty />
            case page.LittleManTalent:
                return <Talent characterType_={characterType.LittleMan} />
            case page.GiantessTalent:
                return <Talent characterType_={characterType.Giantess} />

            case page.Login:
                return <Login />
            case page.Register:
                return <Register />


            // case page.ErrorHandle:
            //     return <ErrorHandle />
            // case page.NetworkErrorHandle:
            //     return <NetworkErrorHandle />
        }
    }

    let _checkCssCompatible = () => {
        let dom = document.querySelector<HTMLElement>(".index-main")

        let domHeight = Math.min(
            dom.clientHeight,
            dom.clientWidth,
        )
        let pageHeight = Math.min(
            getActualWidth(),
            getActualHeight(),
        )

        // console.log(
        //     dom.clientWidth,
        //     dom.clientHeight,
        //     // dom.style.width,
        //     // dom.style.height,

        //     getActualWidth(),
        //     getActualHeight(),
        // );

        let state = readState()

        if (Device.isMobileByState(getAbstractState(state)) && domHeight < pageHeight / 2) {
            Modal.alert({
                content: getLanguageTextData(state, languageKey.CssCompatible),
                confirmText: getLanguageTextData(state, languageKey.Confirm),
            })
        }
    }


    useEffect(() => {
        _checkCssCompatible()
    }, []);

    useEffect(() => {
        let state = readState()
        if (getIsProduction(state)) {
            switch (page_) {
                case page.IndexMain:
                    // writeState(addNeedToPlaySound(state, buildNeedToPlaySoundData(getIndexSoundResourceId(), getIsDebug(state), 1, true)))

                    // state = play(state, buildNeedToPlaySoundData(getIndexSoundResourceId(), getIsDebug(state), 1, true))

                    // writeState(state)




                    /*! writeState will invoked after "writeState(on(readState(), getErrorEventName(), _errorHandle))", so need usetriggerByReadWriteState! 

                    // Event.trigger(state, getAbstractState, getModAPI(state).event.getPlayIndexSoundEventName(), NullableUtils.getEmpty()).then(writeState)
                    */
                    Event.triggerByReadWriteState(state, getAbstractState, getModAPI(state).event.getPlayIndexSoundEventName(), NullableUtils.getEmpty())
                    break

                // case page.Scene:
                //     writeState(stop(state, getIndexSoundResourceId()))
                //     break
            }
        }
    }, [page_]);

    useEffect(() => {
        let state = readState()
        if (!getIsProduction(state)) {
            state = setDefaultCareer(state)
            writeState(state)



            dispatch(setTargetScene({ scene: scene.Play, levelNumber: 1 }))
            // dispatch(setTargetScene({ scene: "Scene_Protect", levelNumber: 1 }))
            // dispatch(setTargetScene({ scene: scene.Biwu, levelNumber: 1 }))
            // dispatch(setTargetScene({ scene: scene.Biwu, levelNumber: 2 }))
            // dispatch(setTargetScene({ scene: scene.Biwu, levelNumber: 3 }))

            dispatch(setPage(page.Scene))
            // deferSwitchPageForGetNewestState(dispatch, setPage(page.Scene))
        }
    }, []);

    // useEffect(() => {
    //     writeState(on(readState(), getErrorEventName(), _errorHandle))
    //     writeState(on(readState(), getNetworkErrorEventName(), _networkErrorHandle))

    //     return () => {
    //         writeState(off(readState(), getErrorEventName(), _errorHandle))
    //         writeState(off(readState(), getNetworkErrorEventName(), _networkErrorHandle))
    //     };
    // }, []);

    return <Layout className="index-main"  >
        {
            _render()
        }
    </Layout >
};

export default Index;