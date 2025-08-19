import React from 'react';
import { Button, Image } from 'antd';
import { isMobile } from '../../business_layer/Device';
import { readState, writeState } from '../../business_layer/State';
import { buildNeedToPlaySoundData } from 'meta3d-jiehuo-abstract/src/audio/SoundManager';
import { getClickSmallSoundResourceId } from '../../business_layer/Loader';
import { getIsDebug } from 'meta3d-jiehuo-abstract/src/state/State';
import { getAbstractState } from '../../scene3d_layer/state/State';
import { play } from '../../business_layer/Sound';
import { NullableUtils } from 'meta3d-jiehuo-abstract';
import { state } from '../../scene3d_layer/type/StateType';

export let renderButton = (handler: (state: state) => Promise<state>, key, text, className = "", soundId = getClickSmallSoundResourceId(), type = "primary") => {
	return <Button key={key} className={className} type={type}
		onClick={_ => {
			if (isMobile()) {
				return
			}

			handler(readState()).then(state => {
				play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
				writeState(state)
			})
		}}
		onTouchEnd={event => {
			handler(readState()).then(state => {
				play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
				writeState(state)

				event.preventDefault()
				event.stopPropagation()
			})
		}}
	>
		{text}
	</Button >
}

export let renderImage = (handler: (state: state) => Promise<state>, src, className = "", preview = false, soundId = null) => {
	// @ts-ignore
	return <Image src={src} className={className}
		preview={preview}
		onClick={_ => {
			if (isMobile()) {
				return
			}

			handler(readState()).then(state => {
				NullableUtils.forEach(soundId => {
					play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
				}, soundId)

				writeState(state)
			})
		}}
		onTouchEnd={event => {
			handler(readState()).then(state => {
				NullableUtils.forEach(soundId => {
					play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
				}, soundId)

				writeState(state)

				event.preventDefault()
				event.stopPropagation()
			})
		}}
	/>
}


export let renderImage2 = (downHandler: (state: state) => Promise<state>,
	upHandler: (state: state) => Promise<state>,
	src, className = "", preview = false, soundId = null) => {
	// @ts-ignore
	return <Image src={src} className={className}
		preview={preview}
		onMouseDown={event => {
			event.stopPropagation()
			event.preventDefault()

			if (isMobile()) {
				return
			}

			downHandler(readState()).then(state => {
				NullableUtils.forEach(soundId => {
					play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
				}, soundId)

				writeState(state)
			})
		}}
		onMouseUp={event => {
			event.stopPropagation()
			event.preventDefault()

			if (isMobile()) {
				return
			}

			upHandler(readState()).then(state => {
				NullableUtils.forEach(soundId => {
					play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
				}, soundId)

				writeState(state)
			})
		}}

		onTouchStart={event => {
			event.stopPropagation()
			event.preventDefault()

			downHandler(readState()).then(state => {
				NullableUtils.forEach(soundId => {
					play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
				}, soundId)

				writeState(state)

				event.preventDefault()
				event.stopPropagation()
			})
		}}
		onTouchEnd={event => {
			event.stopPropagation()
			event.preventDefault()

			upHandler(readState()).then(state => {
				NullableUtils.forEach(soundId => {
					play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), 1, false))
				}, soundId)

				writeState(state)

				event.preventDefault()
				event.stopPropagation()
			})
		}}
	/>
}

export let renderBackgroundImage = (
	src, className = "", soundId = null) => {
	return <div className={className} style={{
		backgroundImage: `url(${src})`,
		backgroundSize: "100% 100%"
	}}
	></div >
}