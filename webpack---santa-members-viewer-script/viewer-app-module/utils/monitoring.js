const RAVEN_INIT_STRING = 'https://fe0974951f45411fbe57fbbd7c30bbf2@sentry.wixpress.com/28'
const FEDOPS_APP_NAME = 'santa-members-viewer-app'

let raven
let fedopsInstance

const initializeMonitoring = (initParams, platformServices) => {
    raven = platformServices.monitoring.createMonitor(RAVEN_INIT_STRING)

    if (raven) {
        raven.setUserContext({
            msid: platformServices.bi.metaSiteId
        })
    }

    fedopsInstance = platformServices.fedOpsLoggerFactory.getLoggerForWidget({
        appName: FEDOPS_APP_NAME,
        appId: initParams.appDefinitionId
    })
}

function interactionStarted(interactionName) {
    try {
        fedopsInstance.interactionStarted(interactionName)
    } catch (e) {
        const err = 'Failed to start fedops interaction, reason: ' + e
        if (raven) {
            raven.captureException(err)
        }
    }
}

function interactionEnded(interactionName) {
    try {
        fedopsInstance.interactionEnded(interactionName)
    } catch (e) {
        const err = 'Failed to end fedops interaction, reason: ' + e
        if (raven) {
            raven.captureException(err)
        }
    }
}

const toMonitored = (interactionName, fn) => () => {
    try {
        interactionStarted(interactionName)
        const response = fn()
        interactionEnded(interactionName)
        return response
    } catch (e) {
        console.error(e)
        if (raven) {
            raven.captureException(e)
        }
        throw e
    }
}

function log(message, options = {}) {
    if (raven) {
        raven.captureMessage(message, {
            level: 'info',
            ...options
        })
    }
}

module.exports = {
    initializeMonitoring,
    toMonitored,
    log
}