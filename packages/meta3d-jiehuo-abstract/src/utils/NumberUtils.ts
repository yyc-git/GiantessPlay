import { requireCheck, test } from "./Contract"

export let between = (value, start, end) => {
	return value >= start && value <= end
}

export let getRandomFloat = (start, end) => {
	return (end - start) * Math.random() + start
}

export let getRandomInteger = (start, end) => {
	return Math.round((end - start) * Math.random()) + start
}

export let randomSelect = (arr) => {
	return arr[getRandomInteger(0, arr.length - 1)]
}

export let getDecimal = (value, digit) => {
	return Math.floor(value * Math.pow(10, digit)) / Math.pow(10, digit)
}

export let isInteger = (value) => {
	return Math.floor(value) == value
}

export let isNumber = (value) => {
	return typeof value === 'number' && isFinite(value);
}

export let isNearlyEqual = (value1, value2, digit = 2) => {
	return Math.round(value1 * Math.pow(10, digit)) == Math.round(value2 * Math.pow(10, digit))
}

export let clamp = (value, min, max) => {
	if (value < min) {
		return min
	}

	if (value > max) {
		return max
	}

	return value
}

export let greaterThan = (value, min) => {
	return Math.max(value, min)
}

export let lessThan = (value, max) => {
	return Math.min(value, max)
}

export let getRandomValue1 = () => {
	return 2 * Math.random() - 1
}

export let toFloatString = (value: number) => {
	if (isInteger(value)) {
		return `${value}.0`
	}

	return String(value)
}

export let getRandomValue2 = (value: number) => {
	return Math.floor(Math.random() * value)
}

export let getRandomValue3 = (value: number, min: number) => {
	return Math.random() * value + min
}


export let isRandomRate = (rate: number) => {
	// requireCheck(() => {
	// 	test("rate should in [0,1]", () => {
	// 		return between(rate, 0, 1)
	// 	})
	// }, true)
	requireCheck(() => {
		test("rate should >= 0", () => {
			return rate >= 0
		})
	}, true)

	return Math.random() < rate
}



export let randomHexColor = () => {
	//随机生成十六进制颜色 
	var hex = Math.floor(Math.random() * 16777216).toString(16);
	//生成ffffff以内16进制数 
	while (hex.length < 6) {
		//while循环判断hex位数，少于6位前面加0凑够6位
		hex = '0' + hex;
	}
	return '#' + hex;  //返回‘#'开头16进制颜色
}