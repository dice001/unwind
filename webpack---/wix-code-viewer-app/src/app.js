'use strict'

const get_ = require('lodash/get')
const {
    serializeMessage
} = require('@wix/santa-core-utils/dist/cjs/coreUtils/core/logWixCodeConsoleMessage')
const {
    fetchUserCode,
    fetchUserCodeAsync
} = require('./fetchUserCode')
const {
    runUserCode
} = require('./runUserCode')
const workerLogger = require('./workerLogger')
const {
    isWebWorker
} = require('./isWebWorker')
const {
    importSync,
    importAsync
} = require('./importScriptAsAmdModule')
const elementoryArgumentsHandler = require('./elementoryArgumentsHandler')
const traceCreators = require('./logger/traceCreators')
const biEventCreators = require('./logger/biEventCreators')
const {
    createFedopsLogger
} = require('./fedopsCreator')
const {
    convertToDeveloperConsoleSeverity
} = require('./wixCodeLogLevel')
const {
    active$wBiFactoryCreator
} = require('./active$wBiEvent')

const sendConsoleMessagesToEditor = wixCodeApi => consoleMessage => {
    if (consoleMessage.logLevel === 'ASSERT' && consoleMessage.args[0]) {
        return
    }
    const developerConsoleMessage = Object.assign({}, consoleMessage, {
        logLevel: convertToDeveloperConsoleSeverity(consoleMessage.logLevel)
    })
    wixCodeApi.site.notifyEventToEditorApp('wix-code', {
        eventType: 'addConsoleMessage',
        eventPayload: {
            consoleMessage: serializeMessage(developerConsoleMessage)
        }
    })
}

const create = ({
    appLogger,
    userConsole
}) => {
    let userCodeModules = new Map()

    // In Live-Preview the app can be initialized multiple times
    // We want to make sure we do some things only once in that scenario
    // e.g. propagating console messages to the editor
    let firstInit = true

    // We register to the console only if and when initAppForPage is invoked
    let onLog = () => {
        throw new Error('onLog was used before it was created')
    }

    let onUnhandledPromiseRejection = () => {
        throw new Error('onUnhandledRejection was used before it was created')
    }

    let fedopsLogger

    const loadUserCode = async ({
        userCodeMap,
        isWebWorker,
        viewMode
    }) => {
        const userCodeModules = isWebWorker ?
            await fetchUserCode(
                userConsole,
                appLogger,
                fedopsLogger,
                userCodeMap,
                importSync
            ) :
            await fetchUserCodeAsync(appLogger, userCodeMap, importAsync)

        if (viewMode === 'Site' && userCodeMap.length) {
            appLogger.bi(
                biEventCreators.userCodeLoaded({
                    pageId: userCodeMap[0].id
                })
            )
        }

        return userCodeModules
    }

    const initApp = async ({
        wixCodeApi,
        userCodeMap,
        isWebWorker
    }) => {
        elementoryArgumentsHandler.setExtraHeaders(wixCodeApi, appLogger)

        const viewMode = get_(wixCodeApi, ['window', 'viewMode'])

        if (firstInit) {
            // Wrapping the console should run before loading the user code,
            // in case the user code has errors that need to be reported (like syntax errors)
            onLog = workerLogger.wrapConsole(userConsole)
            onUnhandledPromiseRejection = workerLogger.handlePromiseRejections()
            if (viewMode !== 'Site') {
                onLog(sendConsoleMessagesToEditor(wixCodeApi))
                onUnhandledPromiseRejection(sendConsoleMessagesToEditor(wixCodeApi))
            }
            firstInit = false
        }

        userCodeModules = await loadUserCode({
            userCodeMap,
            isWebWorker,
            viewMode
        })
    }

    const initAppLogger = ({
        wixCodeApi,
        reportTrace,
        biLoggerFactory,
        fedOpsLoggerFactory,
        createRavenClient,
        userCodeMap,
        isWebWorker
    }) => {
        const userId = get_(wixCodeApi, ['user', 'currentUser', 'id'])
        const viewMode = get_(wixCodeApi, ['window', 'viewMode'])

        appLogger.init({
            user: {
                id: userId
            },
            hostType: isWebWorker ? 'worker' : 'iframe',
            viewMode,
            reportTrace,
            biLoggerFactory,
            fedOpsLoggerFactory,
            createRavenClient
        })

        appLogger.addSessionData(() => ({
            userCodeScripts: userCodeMap,
            elementoryArguments: {
                baseUrl: self.elementorySupport.baseUrl,
                queryParameters: self.elementorySupport.queryParameters,
                options: self.elementorySupport.options
            }
        }))
    }

    const initAppForPage = async (
        applicationData,
        platformUtils,
        wixCodeApi,
        additionalParams
    ) => {
        try {
            const {
                // instance,
                // instanceId,
                // url,
                appData: {
                    userCodeMap
                }
            } = applicationData
            const {
                biLoggerFactory,
                fedOpsLoggerFactory,
                // getCsrfToken,
                monitoring,
                reportTrace
            } = additionalParams

            const traceConfig = traceCreators.initAppForPage()
            fedopsLogger = createFedopsLogger(fedOpsLoggerFactory)
            fedopsLogger.interactionStarted(traceConfig.actionName)

            const _isWebWorker = isWebWorker()
            initAppLogger({
                wixCodeApi,
                reportTrace,
                biLoggerFactory,
                fedOpsLoggerFactory,
                createRavenClient: monitoring.createMonitor,
                userCodeMap,
                isWebWorker: _isWebWorker
            })

            await appLogger.traceAsync(traceConfig, () =>
                initApp({
                    wixCodeApi,
                    userCodeMap,
                    isWebWorker: _isWebWorker
                })
            )

            fedopsLogger.interactionEnded(traceConfig.actionName)
        } catch (e) {
            appLogger.error(e)
            throw e
        }
    }

    const _createControllers = rawControllerConfigs => {
        const [controllerConfig] = rawControllerConfigs
        const {
            $w,
            wixCodeApi,
            appParams: {
                instance,
                appData: {
                    userCodeMap
                }
            },
            platformAPIs
        } = controllerConfig

        if (userCodeModules.size > 0) {
            const active$wBiFactory = active$wBiFactoryCreator({
                appLogger,
                platformBi: platformAPIs.bi
            })

            const userExports = runUserCode({
                userConsole,
                appLogger,
                fedopsLogger,
                active$wBiFactory,
                instance,
                wixSdk: wixCodeApi,
                $w,
                userCodeModules,
                wixCodeScripts: userCodeMap,
                onLog
            })

            wixCodeApi.events.setStaticEventHandlers(userExports)
        }

        // We don't really have controller instances, so we return an empty array
        return []
    }

    const createControllers = rawControllerConfigs => {
        try {
            const traceConfig = traceCreators.createControllers()
            fedopsLogger.interactionStarted(traceConfig.actionName)

            const controllers = appLogger.traceSync(traceConfig, () =>
                _createControllers(rawControllerConfigs)
            )

            fedopsLogger.interactionEnded(traceConfig.actionName)
            return controllers
        } catch (e) {
            appLogger.error(e)
            throw e
        }
    }

    return {
        initAppForPage,
        createControllers
    }
}

module.exports.create = create