const createPublicApi = require('./public-api')
const createUserService = require('./services/user')
const locationService = require('./services/location')
const {
    parseConfigItems
} = require('./config-items-parser')
const {
    initializeMonitoring,
    toMonitored,
    log
} = require('./utils/monitoring')
const menuRenderer = require('./services/menu-renderer')
const {
    find
} = require('./utils/find')
const {
    setMemoryStorage,
    getMemoryStorage
} = require('./services/memory-storage')

let publicApi
let userService
let _config

const initAppForPage = ({
    routerReturnedData,
    appRouters = []
}, {
    storage
}, wixCodeApi) => {
    userService = createUserService.init(wixCodeApi)
    publicApi = createPublicApi({
        appRouters,
        routerReturnedData,
        wixCodeApi
    })
    setMemoryStorage(storage.memory)

    if (!routerReturnedData) {
        return Promise.resolve()
    }

    const slugs = routerReturnedData.memberData && routerReturnedData.memberData.slugs || []
    const viewedUserId = routerReturnedData.memberData && routerReturnedData.memberData.memberContactId || routerReturnedData.userId
    const primarySlug = find(slugs, slug => slug.primary === true)
    const viewedUserSlug = primarySlug && primarySlug.name || viewedUserId
    const viewedUserData = {
        id: viewedUserId,
        slug: viewedUserSlug
    }

    userService.setViewedUser(viewedUserData)
    userService.setRoles(routerReturnedData.roles || {})

    return Promise.resolve()
}

function fetchAndRenderMenus({
    wixCodeApi,
    appParams,
    config,
    $w
}) {
    const viewedUser = userService.getViewedUser()
    const currentUser = userService.getCurrentUser()
    const userRoles = userService.getRoles()
    const needToFetchRoles = Object.keys(userRoles).length === 0 && currentUser.loggedIn
    const santaMembersToken = wixCodeApi.site.getAppToken(appParams.appDefinitionId)

    return Promise.all([
        needToFetchRoles && userService.fetchRoles(viewedUser.id, currentUser.id, santaMembersToken),
        userService.getViewedUserMenuCountersWithCaching(santaMembersToken),
        userService.getCurrentUserMenuCountersWithCaching(santaMembersToken)
    ]).then(([roles, viewedUserCounters, currentUserCounters]) => {
        if (needToFetchRoles) {
            userService.setRoles(roles)
        }

        const parsedConfigItems = parseConfigItems(config)
        const memoryStorage = getMemoryStorage()
        const isMobile = wixCodeApi.window.formFactor === 'Mobile'
        const currentUserRoles = userService.getRoles()[currentUser.id] || []
        const viewedUserRoles = userService.getRoles()[viewedUser.id] || []
        const parsedRouters = (appParams.appRouters || []).map(router => ({ ...router,
            config: JSON.parse(router.config)
        }))
        const parsedRoutersConfigs = parsedRouters.map(router => router.config)
        const publicRouter = parsedRouters.find(router => router.config.type === 'public')
        const publicRouterPrefix = publicRouter.prefix

        toMonitored('renderMembersMenuItems', () => menuRenderer.renderMembersMenus({
            $w,
            wixCodeApi,
            parsedRoutersConfigs,
            viewedUserRoles,
            viewedUser,
            currentUser,
            appsCounters: viewedUserCounters,
            parsedConfigItems,
            memoryStorage,
            publicRouterPrefix,
            isMobile
        }))()
        toMonitored('renderLoginMenuItems', () => menuRenderer.renderLoginMenus({
            $w,
            parsedRoutersConfigs,
            currentUserRoles,
            currentUser,
            appsCounters: currentUserCounters,
            memoryStorage,
            publicRouterPrefix,
            isMobile
        }))()
    })
}

// Old method, making sure whether it is still needed with logs
const redirectIfURLIsInvalid = (config) => {
    const viewedUser = userService.getViewedUser()
    if (config.wixCodeApi.window.viewMode === 'Site') {
        const url = locationService.buildCurrentPath(config.wixCodeApi)
        const urlWithSlug = userService.replaceUserPatternWithSlug(url, viewedUser)
        if (url !== urlWithSlug) {
            const tags = {
                viewerName: config.platformAPIs.bi.viewerName
            }
            log('Deprecation check: redirect', {
                tags,
                extra: {
                    from: url,
                    to: urlWithSlug
                }
            })
            config.wixCodeApi.location.to(urlWithSlug)
        }
    }
}

const createPageReady = (config) => () => {
    const {
        wixCodeApi,
        appParams
    } = config
    _config = config

    const setUserAndRenderMenus = (user = wixCodeApi.user.currentUser) => {
        const santaMembersToken = wixCodeApi.site.getAppToken(appParams.appDefinitionId)
        return userService.setCurrentUser(user, santaMembersToken).then(() => fetchAndRenderMenus(config))
    }

    wixCodeApi.user.onLogin(loggedInUser => toMonitored('onLogin', () => setUserAndRenderMenus(loggedInUser))())
    return setUserAndRenderMenus().then(() => redirectIfURLIsInvalid(config))
}

const createControllers = (controllerConfigs) => controllerConfigs.map((config) => ({
    pageReady: createPageReady(config),
    exports: {}
}))

module.exports = {
    initAppForPage: function(initParams, platformApis, wixCodeApi, platformServices) {
        initializeMonitoring(initParams, platformServices)
        return toMonitored('initAppForPage', () => initAppForPage(initParams, platformApis, wixCodeApi))()
    },
    createControllers: (controllerConfigs) => toMonitored('createControllers', () => createControllers(controllerConfigs))(),
    exports: {
        hasSocialPages: (onSuccess, onError) => toMonitored('publicApi.hasSocialPages', () => publicApi.hasSocialPages(onSuccess, onError))(),
        getViewedUser: (onSuccess, onError) => toMonitored('publicApi.getViewedUser', () => publicApi.getViewedUser(onSuccess, onError))(),
        navigateToSection: (sectionData, onError) => toMonitored('publicApi.navigateToSection', () => publicApi.navigateToSection(sectionData, onError))(),
        navigateToMember: (memberInfo, onError) => toMonitored('publicApi.navigateToMember', () => publicApi.navigateToMember(memberInfo, onError))(),
        getNavigatableRoles: (onError) => toMonitored('publicApi.getNavigatableRoles', () => publicApi.getNavigatableRoles(onError))(),
        getSectionUrl: (sectionData, onError) => toMonitored('publicApi.getSectionUrl', () => publicApi.getSectionUrl(sectionData, onError))(),
        getMemberPagePrefix: (data, onSuccess, onError) => toMonitored('publicApi.getMemberPagePrefix ', () => publicApi.getMemberPagePrefix(data, onSuccess, onError))(),
        setNotificationCount: (displayCount) => toMonitored('publicApi.setNotificationCount', () => publicApi.setNotificationCount(displayCount))(),
        enterPublicProfilePreviewMode: () => toMonitored('publicApi.enterPublicProfilePreviewMode', () => publicApi.enterPublicProfilePreviewMode({
            userService,
            config: _config
        }))(),
        leavePublicProfilePreviewMode: () => toMonitored('publicApi.leavePublicProfilePreviewMode', () => publicApi.leavePublicProfilePreviewMode({
            userService,
            config: _config
        }))(),
    }
}