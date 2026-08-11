import 'antd/dist/reset.css'


// import '@ant-design/flowchart/dist/index.css'

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
// import store from "./MainStore"


import App from './ui_layer/components/App';
import store from './ui_layer/store/AppStore';
import { View } from 'meta3d-jiehuo-abstract';
import { language } from './scene3d_layer/type/StateType';
// import { setLanguage } from './scene3d_layer/script/scene/Scene';
// import { readState, writeState } from './business_layer/State';

let _decideLanguage = () => {
    return new Promise((resolve, reject) => {
        // globalThis.geoip2.country(geoipResponse => {
        //     /* There's no guarantee that a successful response object
        //      * has any particular property, so we need to code defensively. */
        //     if (!geoipResponse.country.iso_code) {
        //         return;
        //     }

        //     let language_
        //     /* ISO country codes are in upper case. */
        //     switch (geoipResponse.country.iso_code.toLowerCase()) {
        //         case "cn":
        //             language_ = language.Chinese
        //             break
        //         default:
        //             language_ = language.English
        //             break
        //     }

        //     // writeState(setLanguage(readState(), language_))
        //     resolve(language_)
        // }, reject);


        // 浏览器为IE的情况 
        let a = navigator.language || (navigator as any).browserLanguage

        if (!a.toLowerCase().includes("zh-cn")) {
            resolve(language.English)
        }
        else {
            resolve(language.Chinese)
        }
    })
}

_decideLanguage().then(language => {
    // As of React 18
    const root = ReactDOM.createRoot(document.getElementById('root'))

    root.render(
        // @ts-ignore
        <Provider store={store}>
            <App language={language} />
        </Provider>,
    )
})