import React from 'react';
import { handleEventHandler } from './ErrorUtils';
import { readState, writeState } from '../../business_layer/State';


export let renderSpanDom = (text, className = "", onClickFunc = (state) => Promise.resolve(state)) => {
    return <span className={className}
        onClick={handleEventHandler(_ => {
            onClickFunc(readState()).then(writeState)
        })}
    >{text}</span>
}
