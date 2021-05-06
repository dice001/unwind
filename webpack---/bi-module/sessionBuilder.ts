import { ViewerModel, CookieAnalysis, WixBiSession } from '@wix/thunderbolt-symbols'
import isBot from './isBot'
import isSuspectedBot from './isSuspectedBot'
import isIFrame from './isIFrame'

const SITE_TYPES: Record<ViewerModel['site']['siteType'], WixBiSession['st']> = {
	WixSite: 1,
	UGC: 2,
	Template: 3,
}

const extractServerTiming = () => {
	let serverTiming: Array<any>
	try {
		serverTiming = performance.getEntriesByType('navigation')[0].serverTiming || []
	} catch (e) {
		serverTiming = []
	}
	let microPop
	const matches: Array<string> = []
	serverTiming.forEach((st) => {
		switch (st.name) {
			case 'cache':
				matches[1] = st.description
				break
			case 'varnish':
				matches[2] = st.description
				break
			case 'dc':
				microPop = st.description
				break
			default:
				break
		}
	})
	return {
		microPop,
		matches,
	}
}

const extractCookieData = (): CookieAnalysis => {
	let microPop,
		caching = 'none'
	let match = document.cookie.match(
		/ssr-caching="?cache[,#]\s*desc=(\w+)(?:[,#]\s*varnish=(\w+))?(?:[,#]\s*dc[,#]\s*desc=(\w+))?(?:"|;|$)/
	)
	if (!match && window.PerformanceServerTiming) {
		const results = extractServerTiming()
		microPop = results.microPop
		match = results.matches
	}
	if (match && match.length) {
		caching = `${match[1]},${match[2] || 'none'}`
		if (!microPop) {
			microPop = match[3]
		}
	}
	if (caching === 'none') {
		const timing = performance.timing
		if (timing && timing.responseStart - timing.requestStart === 0) {
			caching = 'browser'
		}
	}
	return {
		caching,
		isCached: caching.indexOf('hit') === 0,
		...(microPop ? { microPop } : {}),
	}
}

const uuidv4 = () =>
	'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0,
			v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})

const btype = isBot(window) || isIFrame() || isSuspectedBot()

const initializeBiSession = (): WixBiSession => ({
	suppressbi: window.viewerModel.requestUrl.includes('suppressbi=true'),
	initialTimestamp: window.initialTimestamps.initialTimestamp,
	initialRequestTimestamp: window.initialTimestamps.initialRequestTimestamp,
	viewerSessionId: window.fedops ? window.fedops.vsi : uuidv4(),
	siteRevision: String(window.viewerModel.site.siteRevision),
	msId: window.viewerModel.site.metaSiteId,
	is_rollout:
		window.viewerModel.fleetConfig.code === 0 || window.viewerModel.fleetConfig.code === 1
			? window.viewerModel.fleetConfig.code
			: null,
	is_platform_loaded: 0,
	requestId: window.viewerModel.requestId,
	requestUrl: encodeURIComponent(window.viewerModel.requestUrl),
	sessionId: String(window.viewerModel.site.sessionId),
	btype,
	isjp: !!btype,
	dc: window.viewerModel.site.dc,
	siteCacheRevision: '__siteCacheRevision__',
	checkVisibility: (() => {
		let alwaysVisible = true
		function checkVisibility() {
			alwaysVisible = alwaysVisible && document.hidden !== true
		}
		document.addEventListener('visibilitychange', checkVisibility, { passive: true })
		checkVisibility()
		return () => {
			checkVisibility()
			return alwaysVisible
		}
	})(),
	...extractCookieData(),
	isMesh: 1,
	isServerSide: 0,
	st: SITE_TYPES[window.viewerModel.site.siteType] || 0,
	commonConfig: window.viewerModel.commonConfig,
})

export default initializeBiSession
