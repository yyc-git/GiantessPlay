import React from 'react';
import { Card, Button, Image } from 'antd';
import { isMobile } from '../../business_layer/Device';
import { readState, writeState } from '../../business_layer/State';
import { buildNeedToPlaySoundData } from 'meta3d-jiehuo-abstract/src/audio/SoundManager';
import { getClickSmallSoundResourceId } from '../../business_layer/Loader';
import { getIsDebug } from 'meta3d-jiehuo-abstract/src/state/State';
import { getAbstractState } from '../../scene3d_layer/state/State';
import { play } from '../../business_layer/Sound';
import { NullableUtils } from 'meta3d-jiehuo-abstract';
import { state } from '../../scene3d_layer/type/StateType';
import { getSoundSetting } from '../../scene3d_layer/mod/SettingMod';
import { handleEventHandler } from './ErrorUtils';
// import { Card } from 'antd-mobile';
// import { Card } from 'antd';


export let renderCard = (handler: (state: state) => Promise<state>, title, children, className = "", soundId = getClickSmallSoundResourceId(),) => {
    // @ts-ignore
    return <Card className={className} title={title}
        // onPointerDown={handleEventHandler(_ => {
        onClick={handleEventHandler(_ => {
            if (isMobile()) {
                return
            }

            return handler(readState()).then(state => {
                play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
                writeState(state)
            })
        })}
        onTouchStart={handleEventHandler(e => {
            globalThis["card_touchstart_html_move"] = ""
            globalThis["card_touchstart_html"] = NullableUtils.getWithDefault(
                NullableUtils.map(target => target.innerHTML, e.target),
                ""
            )
        })}
        onTouchMove={handleEventHandler(e => {
            globalThis["card_touchstart_html_move"] = globalThis["card_touchstart_html"]
        })}
        onTouchEnd={handleEventHandler(e => {
            let html = NullableUtils.getWithDefault(
                NullableUtils.map(target => target.innerHTML, e.target),
                ""
            )

            if (html == globalThis["card_touchstart_html_move"]) {
                return
            }

            return handler(readState()).then(state => {
                play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
                writeState(state)
            })
        })}
    >
        {children}
    </Card >
}