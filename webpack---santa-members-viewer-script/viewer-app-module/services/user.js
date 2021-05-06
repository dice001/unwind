const {
    USER_NAME_PATTERN
} = require('../constants')
const {
    getAjaxJson,
    postAjaxJson
} = require('./ajax')
const {
    getMemoryStorage,
    getAndParseMemoryStorageItem
} = require('./memory-storage')

const CURRENT_USER_SLUG_STORAGE_KEY = 'current-user-slug'
const CURRENT_USER_ID_STORAGE_KEY = 'current-user-id'

const VIEWED_USER_ID_STORAGE_KEY = 'members-area-viewed-user-id';
const VIEWED_USER_COUNTERS_STORAGE_KEY = 'members-area-viewed-user-counters';
const CURRENT_USER_COUNTERS_STORAGE_KEY = 'members-area-current-user-counters';

function init(wixCodeApi) {
    let viewedUser = {},
        currentUser = {},
        userRoles = {}

    function getViewedUserMenuCountersWithCaching(santaMembersInstance) {
        const memoryStorage = getMemoryStorage()
        const previousViewedMemberId = memoryStorage.getItem(VIEWED_USER_ID_STORAGE_KEY)
        const userCountersFromStorage = getAndParseMemoryStorageItem(VIEWED_USER_COUNTERS_STORAGE_KEY)

        if (userCountersFromStorage && previousViewedMemberId === viewedUser.id) {
            return userCountersFromStorage
        }

        return getMenuCounters(viewedUser.id ? viewedUser : currentUser, santaMembersInstance)
            .catch(() => {})
            .then(counters => {
                memoryStorage.setItem(VIEWED_USER_COUNTERS_STORAGE_KEY, JSON.stringify(counters))
                memoryStorage.setItem(VIEWED_USER_ID_STORAGE_KEY, viewedUser.id)
                return counters
            })
    }

    function getCurrentUserMenuCountersWithCaching(santaMembersInstance) {
        const memoryStorage = getMemoryStorage()
        const previousCurrentUserId = memoryStorage.getItem(CURRENT_USER_ID_STORAGE_KEY)
        const userCountersFromStorage = getAndParseMemoryStorageItem(CURRENT_USER_COUNTERS_STORAGE_KEY)

        if (userCountersFromStorage && previousCurrentUserId === currentUser.id) {
            return userCountersFromStorage
        }

        return getMenuCounters(currentUser, santaMembersInstance)
            .catch(() => {})
            .then(counters => {
                memoryStorage.setItem(CURRENT_USER_COUNTERS_STORAGE_KEY, JSON.stringify(counters))
                memoryStorage.setItem(CURRENT_USER_ID_STORAGE_KEY, currentUser.id)
                return counters
            })
    }

    function getMenuCounters(user, santaMembersInstance) {
        if (user.loggedIn === false) {
            return Promise.resolve({})
        }
        return new Promise(resolve => {
            const userId = user && user.id
            if (userId && santaMembersInstance) {
                fetchNumbers(userId, santaMembersInstance, response => {
                    resolve(response)
                })
            }
        })
    }

    function fetchNumbers(userId, instance, successFn) {
        const baseURL = wixCodeApi.window.viewMode === 'Site' ? wixCodeApi.location.baseUrl : 'https://www.wix.com/'
        return getAjaxJson({
            baseURL,
            url: `${baseURL}/_api/santa-members-server/temporary/members/${userId}/numbers`,
            authorizationHeader: instance,
            onSuccess: successFn
        })
    }

    function fetchRoles(viewedUserId, loggedInUserId, instance) {
        return new Promise(resolve => {
            const baseURL = wixCodeApi.window.viewMode === 'Site' ? wixCodeApi.location.baseUrl : 'https://www.wix.com/'
            const payload = []
            if (viewedUserId) {
                payload.push(viewedUserId)
            }
            if (loggedInUserId) {
                payload.push(loggedInUserId)
            }
            postAjaxJson({
                baseURL,
                url: `${baseURL}/_api/santa-members-server/temporary/members/roles`,
                instance,
                payload,
                onSuccess: roles => {
                    resolve(roles)
                }
            })
        })
    }

    function replaceUserPatternWithSlug(url, user) {
        return url
            .replace(USER_NAME_PATTERN, user.slug)
            .replace(encodeURI(USER_NAME_PATTERN), user.slug)
    }

    function getViewedUser() {
        return viewedUser
    }

    function getCurrentUser() {
        return currentUser
    }

    function getRoles() {
        return userRoles
    }

    function setRoles(roles) {
        userRoles = roles
    }

    function setViewedUser(userData) {
        if (userData) {
            viewedUser = userData
        }
    }

    function setCurrentUser(userData, instance) {
        return Promise.resolve()
            .then(() => {
                currentUser.loggedIn = userData.loggedIn
                currentUser.id = userData.id
                return getCurrentUserSlug(userData, instance)
            })
            .then(slug => {
                currentUser.slug = slug
                return currentUser
            })
    }

    function fetchCurrentUserSlug(instance) {
        const baseURL = wixCodeApi.location.baseUrl
        return new Promise(resolve => getAjaxJson({
            baseURL,
            url: baseURL + '/_api/members/v1/members/my',
            authorizationHeader: instance,
            onSuccess: m => resolve(m.member ? .profile ? .slug)
        }))
    }

    function getCurrentUserSlug(userData, instance) {
        const memoryStorage = getMemoryStorage()
        const storageSlug = memoryStorage.getItem(CURRENT_USER_SLUG_STORAGE_KEY)
        const currentUserId = memoryStorage.getItem(CURRENT_USER_ID_STORAGE_KEY)

        if (storageSlug && currentUserId === userData.id) {
            return storageSlug
        }

        if (!currentUserId || currentUserId !== userData.id) {
            memoryStorage.setItem(CURRENT_USER_ID_STORAGE_KEY, userData.id)
        }

        if (userData.loggedIn && userData.getSlug) {
            // Calling manually instead of userData.loggedIn.getSlug to not depend on their implementation
            // This was applied as a hotfix because of broken userData.loggedIn.getSlug implementation
            if (wixCodeApi.window.viewMode === 'Site') {
                return fetchCurrentUserSlug(instance)
                    .then(slug => {
                        const finalSlug = slug || userData.id
                        memoryStorage.setItem(CURRENT_USER_SLUG_STORAGE_KEY, finalSlug)
                        return finalSlug
                    })
                    .catch(() => userData.id)
            }

            // For Preview mode we can't do the request so using default
            return userData.getSlug()
        }
        return userData.id
    }

    return {
        fetchNumbers,
        fetchRoles,
        getCurrentUser,
        getMenuCounters,
        getViewedUserMenuCountersWithCaching,
        getCurrentUserMenuCountersWithCaching,
        getRoles,
        getViewedUser,
        replaceUserPatternWithSlug,
        setCurrentUser,
        setRoles,
        setViewedUser
    }
}

module.exports = {
    init
}