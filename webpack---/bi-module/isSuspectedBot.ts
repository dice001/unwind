export default () => {
	if (!Function.prototype.bind) {
		return 'bind'
	}

	const { document, navigator } = window
	if (!document || !navigator) {
		return 'document'
	}
	const { webdriver, userAgent, plugins, languages } = navigator
	if (webdriver) {
		return 'webdriver'
	}

	if (!plugins || Array.isArray(plugins)) {
		return 'plugins'
	}

	if (!userAgent) {
		return 'userAgent'
	}
	if (userAgent.indexOf('Snapchat') > 0 && document.hidden) {
		return 'Snapchat'
	}

	if (!languages || languages.length === 0 || !Object.isFrozen(languages)) {
		return 'languages'
	}

	try {
		// @ts-ignore
		throw Error()
	} catch (e) {
		const { stack } = e || {}
		if (/ph\x61n\x74om|n\x6fde[^_]/i.test(stack)) {
			return 'stack'
		}
	}

	return ''
}
