import React from 'react';
import { Image } from 'antd';
import { Device } from 'meta3d-jiehuo-abstract';
import { readState } from '../../scene3d_layer/state/State';
import { writeState } from '../../business_layer/State';
import { handleEventHandler } from './ErrorUtils';
// import { LandscapeUtils } from 'meta3d-jiehuo-abstract';

export let renderImage = (src, className = "", preview = Device.isMobile() ? false : true
) => {
	// @ts-ignore
	return <Image src={src} className={className}
		preview={preview}
	// preview={
	// 	{ getContainer: LandscapeUtils.getRootDom() }
	// }
	/>
}

export let renderImage2 = (src, className = "",
	// width,
	// height
	style
) => {
	// @ts-ignore
	return <Image src={src} className={className}
		preview={false}
		// width={width}
		style={style}
	// height={height}
	/>
}

export let renderImageDom = (src, className = "", onClickFunc = (state) => Promise.resolve(state)) => {
	return <img src={src} className={className}
		onClick={handleEventHandler(_ => {
			onClickFunc(readState()).then(writeState)
		})}
	/>
}

export let renderImageDom2 = (src, style, onClickFunc = (state) => Promise.resolve(state)) => {
	return <img src={src} style={style}
		onClick={handleEventHandler(_ => {
			onClickFunc(readState()).then(writeState)
		})}
	/>
}