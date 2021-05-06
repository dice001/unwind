const {
    USER_NAME_PATTERN
} = require('../constants')
const {
    toMonitored
} = require('../utils/monitoring')
const {
    parseConfigItems
} = require('../config-items-parser')
const {
    getMemoryStorage
} = require('../services/memory-storage')
const {
    getMembersLoginWidgets
} = require('../services/state');
const {
    getNavigatableHomePage
} = require('../services/navigation')
const {
    renderMembersMenus
} = require('../services/menu-renderer')

module.exports = ({
    appRouters,
    routerReturnedData = {},
    wixCodeApi
}) => {
    const wixLocation = wixCodeApi.location
    const wixSite = wixCodeApi.site
    const BLOG_APP_ID = '14bcded7-0066-7c35-14d7-466cb3f09103'
    const FORUM_APP_ID = '14724f35-6794-cd1a-0244-25fd138f9242'
    const FF_APP_ID = '14ebe801-d78a-daa9-c9e5-0286a891e46f'
    const ABOUT_APP_ID = '14dbef06-cc42-5583-32a7-3abd44da4908'
    const SOCIAL_GROUPS_APP_ID = '148c2287-c669-d849-d153-463c7486a694'
    const EVENTS_APP_ID = '140603ad-af8d-84a5-2c80-a0f60cb47351'
    const isMobile = wixCodeApi.window.formFactor === 'Mobile'
    const noop = () => {}

    function matchRoute({
        appDefinitionId,
        sectionId,
        onSuccess = noop,
        onError = noop
    }) {
        if (!appDefinitionId || !sectionId) {
            onError('Error: please provide app ID and section ID for navigation')
        }
        let foundRoute = false
        appRouters.forEach(router => {
            if (foundRoute) {
                return
            }
            const config = JSON.parse(router.config)
            return config.patterns && Object.keys(config.patterns).forEach(pattern => {
                if (foundRoute) {
                    return
                }
                const item = config.patterns[pattern]
                if (item.appData && item.appData.appDefinitionId === appDefinitionId && item.appData.appPageId === sectionId) {
                    foundRoute = true
                    onSuccess(router.prefix, pattern)
                }
            })
        })

        // look in site pages, not member app routes
        if (!foundRoute) {
            const sitePages = wixSite.getSiteStructure().pages
            const pages = sitePages || []
            const page = pages.filter(pg => pg.applicationId === appDefinitionId && !pg.prefix).pop()

            if (page) {
                foundRoute = true
                return onSuccess('', page.url)
            }

            return onError(`Error: can not resolve route for app ${appDefinitionId} and page ${sectionId}`)
        }
    }

    function getRouterOptions(appParams) {
        const parsedRouters = (appParams.appRouters || []).map(router => ({ ...router,
            config: JSON.parse(router.config)
        }))
        const parsedRoutersConfigs = parsedRouters.map(router => router.config)
        const publicRouter = parsedRouters.find(router => router.config.type === 'public')
        const publicRouterPrefix = publicRouter.prefix

        return {
            publicRouterPrefix,
            parsedRoutersConfigs
        };
    }

    function getMenuRenderOptions({
        config,
        userService,
        appsCounters,
        enablePreview
    }) {
        const {
            $w,
            appParams
        } = config
        const {
            parsedRoutersConfigs,
            publicRouterPrefix
        } = getRouterOptions(appParams)
        const viewedUser = userService.getViewedUser();
        const emptyId = '00000000-0000-0000-0000-000000000000';

        return {
            $w,
            wixCodeApi,
            publicRouterPrefix,
            parsedRoutersConfigs,
            appsCounters,
            memoryStorage: getMemoryStorage(),
            parsedConfigItems: parseConfigItems(config),
            currentUser: userService.getCurrentUser(),
            viewedUser: enablePreview ? { ...viewedUser,
                id: emptyId
            } : viewedUser,
            viewedUserRoles: userService.getRoles()[viewedUser.id] || [],
            isMobile
        };
    }

    const hasSocialApp = (page) => {
        const {
            applicationId
        } = page
        return [BLOG_APP_ID, FORUM_APP_ID, FF_APP_ID, ABOUT_APP_ID, SOCIAL_GROUPS_APP_ID, EVENTS_APP_ID].indexOf(applicationId) > -1
    }

    return {
        hasSocialPages: (onSuccess, onError) => {
            return new Promise((resolve, reject) => {
                if (!appRouters) {
                    if (onError) {
                        onError('App routers not initialised')
                    }
                    return reject('App routers not initialised')
                }

                const socialPages = appRouters.filter(router => {
                    const routerConfig = JSON.parse(router.config)
                    return routerConfig.type === 'public' && routerConfig.patterns && Object.keys(routerConfig.patterns).length > 0
                })
                const {
                    pages: sitePages
                } = wixSite.getSiteStructure()
                const socialApps = sitePages.filter(hasSocialApp)
                if (onSuccess) {
                    onSuccess(socialPages.length > 0 || socialApps.length > 0)
                }
                resolve(socialPages.length > 0 || socialApps.length > 0)
            })
        },
        getViewedUser: (onSuccess, onError) => {
            return new Promise((resolve, reject) => {
                const viewedUser = routerReturnedData.memberData && routerReturnedData.memberData.memberContactId

                if (viewedUser) {
                    if (onSuccess) {
                        onSuccess(viewedUser)
                    }
                    resolve(viewedUser)
                } else {
                    if (onError) {
                        onError('Error getting viewed user')
                    }
                    reject('Error getting viewed user')
                }
            })
        },
        navigateToSection: ({
            appDefinitionId,
            sectionId,
            tpaInnerRoute = '',
            memberId = ''
        }, onError) => {
            return new Promise((resolve, reject) => {
                matchRoute({
                    appDefinitionId,
                    sectionId,
                    onSuccess: (prefix, suffix) => {
                        if (prefix && prefix.indexOf('/') !== 0) {
                            prefix = `/${prefix}`
                        }

                        if (tpaInnerRoute && tpaInnerRoute.charAt(0) !== '/') {
                            tpaInnerRoute = '/' + tpaInnerRoute
                        }

                        wixLocation.to(`${prefix}${memberId ? suffix.replace(USER_NAME_PATTERN, memberId) : suffix}${tpaInnerRoute}`)
                        resolve()
                    },
                    onError: (reason) => {
                        if (onError) {
                            onError(reason)
                        }
                        reject(reason)
                    }
                })
            })
        },
        getSectionUrl: ({
            appDefinitionId,
            sectionId,
            memberId = '',
            memberSlug
        }, callBack) => {
            return new Promise((resolve, reject) => {
                const userIndicator = memberSlug || memberId
                matchRoute({
                    appDefinitionId,
                    sectionId,
                    onSuccess: (prefix, suffix) => {
                        if (prefix && prefix.indexOf('/') === 0) {
                            prefix = prefix.substring(1)
                        }

                        if (!prefix && suffix.indexOf('/') === 0) {
                            suffix = suffix.substring(1)
                        }

                        let baseUrl = wixLocation.baseUrl
                        if (baseUrl.slice(-1) !== '/') {
                            baseUrl += '/'
                        }

                        const queryParams = Object.keys(wixLocation.query).map(key => {
                            return `${key}=${wixLocation.query[key]}`
                        }).join('&')
                        if (callBack) {
                            callBack(`${baseUrl}${prefix}${userIndicator ? suffix.replace(USER_NAME_PATTERN, userIndicator) : suffix}${queryParams ? '?' + queryParams : ''}`)
                        }
                        resolve(`${baseUrl}${prefix}${userIndicator ? suffix.replace(USER_NAME_PATTERN, userIndicator) : suffix}${queryParams ? '?' + queryParams : ''}`)
                    },
                    onError: () => {
                        console.error('Route not found for app', appDefinitionId, 'and section', sectionId)
                        if (callBack) {
                            callBack(wixLocation.url)
                        }
                        reject(wixLocation.url)
                    }
                })
            })
        },
        getNavigatableRoles: () => {
            const pageToNavigateTo = getNavigatableHomePage(appRouters)
            if (pageToNavigateTo) {
                const navigatableMembersRoles = pageToNavigateTo.pageData.appData ? .visibleForRoles ? ? []
                return Promise.resolve({
                    navigatableMembersRoles,
                    isNavigationAllowed: true
                })
            } else {
                return Promise.resolve({
                    navigatableMembersRoles: [],
                    isNavigationAllowed: false
                })
            }
        },
        navigateToMember: ({
            memberId,
            memberSlug
        }, onError) => {
            return new Promise((resolve, reject) => {
                const userIndicator = memberSlug || memberId
                if (!memberId) {
                    if (onError) {
                        onError('Error: please provide site member ID')
                    }
                    return reject('Error: please provide site member ID')
                }

                const pageToNavigateTo = getNavigatableHomePage(appRouters)

                if (pageToNavigateTo) {
                    const route = `/${pageToNavigateTo.routerPrefix}${pageToNavigateTo.patternKey.replace('{userName}', userIndicator)}`
                    wixLocation.to(route)
                }
                resolve()
            })

        },
        getMemberPagePrefix: ({
            type = 'public'
        }, onSuccess, onError) => {
            return new Promise((resolve, reject) => {
                if (!appRouters) {
                    if (onError) {
                        onError(`Can not get prefix for type ${type} - no routers`)
                    }
                    return reject(`Can not get prefix for type ${type} - no routers`)
                }
                const router = appRouters.filter(r => JSON.parse(r.config).type === type).pop()

                if (!router) {
                    if (onError) {
                        onError(`Can not get prefix for type ${type}`)
                    }
                    return reject(`Can not get prefix for type ${type}`)
                }
                if (onSuccess) {
                    onSuccess({
                        type,
                        prefix: router.prefix
                    })
                }
                resolve({
                    type,
                    prefix: router.prefix
                })
            })
        },
        setNotificationCount: (displayCount) => {
            const membersLoginWidgets = getMembersLoginWidgets()

            membersLoginWidgets.forEach(widget => {
                if (widget.navBarItems ? .length) {
                    widget.navBarItems = [{ ...widget.navBarItems[0],
                        displayCount
                    }]
                }
            })
        },
        enterPublicProfilePreviewMode: ({
            config,
            userService
        }) => {
            const {
                appParams
            } = config
            const santaMembersToken = wixCodeApi.site.getAppToken(appParams.appDefinitionId)

            return Promise.resolve()
                .then(() => userService.getViewedUserMenuCountersWithCaching(santaMembersToken))
                .then(appsCounters => {
                    const menuRenderOptions = getMenuRenderOptions({
                        config,
                        userService,
                        appsCounters,
                        enablePreview: true
                    })
                    toMonitored('renderMembersMenuItems', () => renderMembersMenus(menuRenderOptions))()
                })
        },
        leavePublicProfilePreviewMode: ({
            config,
            userService
        }) => {
            const {
                appParams
            } = config
            const santaMembersToken = wixCodeApi.site.getAppToken(appParams.appDefinitionId)

            return Promise.resolve()
                .then(() => userService.getViewedUserMenuCountersWithCaching(santaMembersToken))
                .then(appsCounters => {
                    const menuRenderOptions = getMenuRenderOptions({
                        config,
                        userService,
                        appsCounters
                    })
                    toMonitored('renderMembersMenuItems', () => renderMembersMenus(menuRenderOptions))()
                })
        }
    }
}