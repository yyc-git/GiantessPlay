import React from 'react';
import { Switch } from "antd-mobile"
import { readState, writeState } from "../../business_layer/State"

export let renderSwitch = (handler, defaultChecked, uncheckedText, checkedText, className = "") => {
	return <Switch
		key={String(Math.random())}
		className={className}
		defaultChecked={defaultChecked}
		uncheckedText={uncheckedText} checkedText={checkedText}
		onChange={(val: boolean) => {
			writeState(handler(readState(), val))
		}}
	/>
}

export let renderSwitchPromise = (handler, defaultChecked, uncheckedText, checkedText, className = "") => {
	return <Switch
		key={String(Math.random())}
		className={className}
		defaultChecked={defaultChecked}
		uncheckedText={uncheckedText} checkedText={checkedText}
		onChange={(val: boolean) => {
			handler(readState(), val).then(writeState)
		}}
	/>
}