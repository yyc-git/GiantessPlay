import React from 'react';
import { Image } from 'antd';
import { Device } from 'meta3d-jiehuo-abstract';
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