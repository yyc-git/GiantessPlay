import React from 'react';
import { handleEventHandler } from './ErrorUtils';
import { Modal } from "antd-mobile"
import { getLanguageTextData, languageKey } from '../../scene3d_layer/internation/Data';
import { requestFullScreen as requestFullScreenUtils } from './ScreenUtils';
import { setIsFullScreenFlag } from '../../scene3d_layer/script/scene/scene_city/UI';
import { readState, writeState } from '../../business_layer/State';
import { CameraControls } from 'meta3d-jiehuo-abstract';
import { Device } from 'meta3d-jiehuo-abstract';

export let requestFullScreen = (state) => {
    Modal.alert({
        content: getLanguageTextData(state, languageKey.FullScreen),
        confirmText: getLanguageTextData(state, languageKey.Confirm),
        onConfirm: handleEventHandler(() => {
            requestFullScreenUtils()

            if (Device.isMobile()) {
                CameraControls.setZoneDomPosition()
            }

            state = setIsFullScreenFlag(readState(), true)
            // state = saveIsFullScreenFlag(state)

            writeState(state)
        }),
    })
}