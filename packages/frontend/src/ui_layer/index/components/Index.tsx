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
import { addNeedToPlaySound, play } from "../../../business_layer/Sound";
import { buildNeedToPlaySoundData } from "meta3d-jiehuo-abstract/src/audio/SoundManager";
import { getIndexSoundResourceId } from "../../../business_layer/Loader";
import { getIsDebug, getIsProduction } from "../../../scene3d_layer/script/scene/Scene";
import IndexMain from "../index_main/components/IndexMain";
import SelectLevel from "../select_level/components/SelectLevel";
import { getAbstractState } from "../../../scene3d_layer/state/State";
import Setting from "../setting/components/Setting";
// import Donate from "../donate/components/Donate";
import Share from "../share/components/Share";
import Explain from "../explain/components/Explain";
import { off, on } from "../../../business_layer/Event";
import { getErrorEventName, getIsEnterScenarioEventName } from "../../../scene3d_layer/utils/EventUtils";
import { setError } from "../error_handle/store/ErrorHandleStore";
import { getKeyDownEventName } from "meta3d-jiehuo-abstract/src/Event";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import ErrorHandle from "../error_handle/component/ErrorHandle";
import SelectRoad from "../select_road/components/SelectRoad";
import LittleManSetting from "../little_man_setting/components/LittleManSetting";
import GiantessSetting from "../giantess_setting/components/GiantessSetting";
import SelectLittleMan from "../select_little_man/components/SelectLittleMan";
import SelectChapter from "../select_chapter/components/SelectChapter";
import BiwuSetting from "../biwu_setting/components/BiwuSetting";

let Index: React.FC = () => {
    let page_ = useSelector<AppState>((state) => state.global.page)

    let dispatch: AppDispatch = useDispatch()

    let _render = () => {
        switch (page_) {
            case page.IndexMain:
                hideCanvas()

                return <IndexMain />
            case page.Setting:
                return <Setting />
            // case page.Donate:
            //     return <Donate />
            case page.Share:
                return <Share />
            case page.Website:
                // globalThis.location.href = "https://gts-play-website-jdjsc8wl-yyc-git.4everland.app/"
                // globalThis.location.href = "https://gts-play-website-dz9pzzyc-yyc-git.4everland.app/"

                // globalThis.location.href = "https://gts-play-website-u771.4everland.app/"

                globalThis.location.href = "https://meta3d-local-9gacdhjl439cff76-1302358347.tcloudbaseapp.com/gts_play_website/build/index.html"

                return null
            case page.SelectRoad:
                return <SelectRoad />
            case page.LittleManSetting:
                return <LittleManSetting />
            case page.GiantessSetting:
                return <GiantessSetting />
            case page.BiwuSetting:
                return <BiwuSetting />
            case page.SelectChapter:
                return <SelectChapter />
            case page.SelectCharacter:
                return <SelectCharacter />
            case page.SelectLittleMan:
                return <SelectLittleMan />
            case page.SelectLevel:
                return <SelectLevel />
            case page.Explain:
                return < Explain />
            case page.Scene:
                return <Scene />
            case page.ErrorHandle:
                return <ErrorHandle />
        }
    }

    let _errorHandle = (state, { userData }) => {
        dispatch(setError(userData.error))
        dispatch(setPage(page.ErrorHandle))

        return Promise.resolve(state)
    }

    useEffect(() => {
        let state = readState()
        if (getIsProduction(state)) {
            switch (page_) {
                case page.IndexMain:
                    // writeState(addNeedToPlaySound(state, buildNeedToPlaySoundData(getIndexSoundResourceId(), getIsDebug(state), 1, true)))
                    play(state, buildNeedToPlaySoundData(getIndexSoundResourceId(), getIsDebug(state), 1, true))
                    writeState(state)
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
            // dispatch(setTargetScene({ scene: scene.Play, levelNumber: 1 }))
            // dispatch(setTargetScene({ scene: scene.Biwu, levelNumber: 1 }))
            // dispatch(setTargetScene({ scene: scene.Biwu, levelNumber: 2 }))
            dispatch(setTargetScene({ scene: scene.Biwu, levelNumber: 3 }))
            dispatch(setPage(page.Scene))
        }
    }, []);

    useEffect(() => {
        writeState(on(readState(), getErrorEventName(), _errorHandle))

        return () => {
            writeState(off(readState(), getErrorEventName(), _errorHandle))
        };
    }, []);

    return <Layout className="index-main"  >
        {
            _render()
        }
    </Layout >
};

export default Index;