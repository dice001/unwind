'use strict'
const values_ = require('lodash/values')
const {
    init: initSiteMonitoring
} = require('./siteMonitoring')
const {
    buildNamespacesMap
} = require('@wix/wix-code-viewer-utils')

const SCRIPT_ERROR_MESSAGE = 'There was an error in your script'
const DISABLE_USER_CODE_QUERY_PARAM = 'wixCodeDisableUserCode'

function _shouldDisableUserCode(wixSdk) {
    const query = wixSdk.location.query || {}
    return query[DISABLE_USER_CODE_QUERY_PARAM] === 'true'
}

const createUserExports = ({
    appLogger,
    userConsole,
    modules
}) => {
    // Log errors from static event handlers, because
    // they are reported as "Script error" when
    // caught using the "error" global event handler
    try {
        return modules.reduce((userExports, module) => {
            Object.keys(module || {}).forEach(key => {
                const originalFn = module[key]
                userExports[key] = function(...args) {
                    try {
                        return originalFn(...args)
                    } catch (e) {
                        // we log the error from our domain instead of throwing it, so we'll
                        // get a proper error and stack trace instead of "Script Error"
                        userConsole.error(e)
                    }
                }
            })
            return userExports
        }, {})
    } catch (e) {
        appLogger.error(e)
    }
}

function runUserCode({
    userConsole,
    appLogger,
    fedopsLogger,
    active$wBiFactory,
    wixSdk,
    $w,
    userCodeModules,
    wixCodeScripts,
    instance,
    onLog
} = {}) {
    try {
        if (_shouldDisableUserCode(wixSdk)) {
            return
        }

        const loadingCodeMessages = wixCodeScripts.reduce((acc, script) => {
            acc[script.scriptName] = `Loading the code for the ${
        script.displayName
      }. To debug this code, open ${script.scriptName} in Developer Tools.`

            return acc
        }, {})

        initSiteMonitoring({
            appLogger,
            fedopsLogger,
            wixSdk,
            instance,
            onLog,
            ignoredConsoleMessages: values_(loadingCodeMessages)
        })

        if (wixCodeScripts.length === 0) {
            return {}
        }

        const wrappedWixSdk = buildNamespacesMap(
            wixSdk,
            self.fetch.bind(self),
            active$wBiFactory.wrapObjectPropertiesWithBi
        )
        const wrapped$w = active$wBiFactory.wrapFunctionReturnValueWithBi($w)
        wrapped$w.at = active$wBiFactory.wrapFunctionCallWithBi($w.at, $w)

        const modules = wixCodeScripts.map(script => {
            if (userConsole && userConsole.info) {
                userConsole.info(loadingCodeMessages[script.scriptName])
            }

            let module = {}
            if (!userCodeModules.has(script.url)) {
                appLogger.warn(
                    `Trying to run a user code script which was not loaded`, {
                        extra: {
                            script
                        }
                    }
                )
                return
            }

            try {
                const moduleFunc = userCodeModules.get(script.url)
                module = moduleFunc && moduleFunc({
                    $w: wrapped$w,
                    $ns: wrappedWixSdk
                })
            } catch (e) {
                userConsole.error(SCRIPT_ERROR_MESSAGE)
                userConsole.error(e)
            }

            return module
        })

        const userExports = createUserExports({
            appLogger,
            userConsole,
            modules
        })
        return userExports
    } catch (e) {
        appLogger.error(e)
        throw e
    }
}

module.exports = {
    runUserCode
}