import isBot from './isBot'
import isSuspectedBot from './isSuspectedBot'
import isIFrame from './isIFrame'

//	eslint-disable-next-line
;(function () {
	if (window.__browser_deprecation__) {
		return
	}
	const { site, rollout, fleetConfig, requestUrl } = window.fedops.data
	const ish = isBot(window) || isIFrame() || isSuspectedBot() ? 1 : 0
	let is_cached = false
	const match = document.cookie.match(
		/ssr-caching="?cache[,#]\s*desc=(\w+)(?:[,#]\s*varnish=(\w+))?(?:[,#]\s*dc[,#]\s*desc=(\w+))?(?:"|;|$)/
	)
	let caching = 'none'
	if (match && match.length) {
		caching = `${match[1]},${match[2] || 'none'}`
		is_cached = isCached(caching)
	}
	if (!match && window.PerformanceServerTiming) {
		const serverTiming = performance.getEntriesByType('navigation')[0].serverTiming
		if (serverTiming && serverTiming.length) {
			const names = ['cache', 'constnish', 'dc']
			const parts: Array<string> = []
			serverTiming.forEach(({ name, description }) => {
				const i = names.indexOf(name)
				if (i > 0) {
					parts[i] = description
				}
			})
			is_cached = isCached(parts[1]) || isCached(parts[2])
		}
	}
	const types = {
		WixSite: 1,
		UGC: 2,
		Template: 3,
	}
	const st = types[site.siteType] || 0
	const fedOpsAppName = site.isResponsive ? 'thunderbolt-responsive' : 'thunderbolt'
	const { isDACRollout, siteAssetsVersionsRollout } = rollout
	const is_dac_rollout = isDACRollout ? 1 : 0
	const is_sav_rollout = siteAssetsVersionsRollout ? 1 : 0
	const is_rollout = fleetConfig.code === 0 || fleetConfig.code === 1 ? fleetConfig.code : null
	const ts = Date.now() - window.initialTimestamps.initialTimestamp
	const tsn = Date.now() - window.initialTimestamps.initialRequestTimestamp
	let pageVisibilty = 'visible'
	const { fedops } = window
	fedops.apps = fedops.apps || {}
	fedops.apps[fedOpsAppName] = { startLoadTime: tsn }
	fedops.sessionId = site.sessionId
	fedops.vsi = uuidv4()
	fedops.is_cached = is_cached
	fedops.phaseStarted = (phase: string) => {
		const duration = Date.now() - ts
		sendBI(28, `&name=${phase}&duration=${duration}`)
	}
	fedops.phaseEnded = (phase: string) => {
		const duration = Date.now() - ts
		sendBI(22, `&name=${phase}&duration=${duration}`)
	}

	addEventListener(
		'offline',
		() => {
			fedops.phaseStarted('offline')
		},
		true
	)
	addEventListener(
		'online',
		() => {
			fedops.phaseStarted('online')
		},
		true
	)

	fedops.pagehide = () => {
		const { visibilityState } = document
		if (visibilityState !== pageVisibilty) {
			pageVisibilty = visibilityState
			fedops.phaseStarted(visibilityState)
		}
	}
	addEventListener('pagehide', fedops.pagehide, true)
	addEventListener('visibilitychange', fedops.pagehide, true)
	fedops.pagehide()

	let bfcache = false
	addEventListener(
		'pageshow',
		({ persisted }) => {
			if (persisted) {
				if (!bfcache) {
					bfcache = true
					caching += ',browser_cache'
					fedops.is_cached = true
				}
				fedops.phaseStarted('bfcache')
			}
		},
		true
	)

	// @ts-ignore Performance Navigation timeing that is suggested is not implemented yet
	if (performance.navigation.type === 1 || performance.navigation.type === 2) {
		fedops.phaseStarted('page_reload')
	}
	sendBI(21, `&ts=${ts}&tsn=${tsn}`)

	function sendBI(evid: number, extra = '') {
		const url =
			'//frog.wix.com/bolt-performance?src=72&evid=' +
			evid +
			'&appName=' +
			fedOpsAppName +
			'&is_rollout=' +
			is_rollout +
			'&is_sav_rollout=' +
			is_sav_rollout +
			'&is_dac_rollout=' +
			is_dac_rollout +
			'&dc=' +
			site.dc +
			'&is_cached=' +
			is_cached +
			'&msid=' +
			site.metaSiteId +
			'&session_id=' +
			window.fedops.sessionId +
			'&ish=' +
			ish +
			'&vsi=' +
			window.fedops.vsi +
			'&caching=' +
			caching +
			'&pv=' +
			pageVisibilty +
			'&v=' +
			window.thunderboltVersion +
			'&url=' +
			requestUrl +
			'&st=' +
			st +
			extra
		sendBeacon(url)
	}
	function sendBeacon(url: string) {
		if (requestUrl.includes('suppressbi=true')) {
			return
		}
		let sent = false
		try {
			sent = navigator.sendBeacon(url)
		} catch (e) {}
		if (!sent) {
			new Image().src = url
		}
	}

	function isCached(part: any) {
		return !!part && part.indexOf('hit') === 0
	}

	function uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			const r = (Math.random() * 16) | 0,
				v = c === 'x' ? r : (r & 0x3) | 0x8
			return v.toString(16)
		})
	}
})()
