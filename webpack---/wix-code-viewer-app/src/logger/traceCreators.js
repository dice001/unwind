'use strict'

const {
    traceHandlerIds: {
        SYSTEM_TRACING
    }
} = require('./loggerWithHandlers')
const {
    traceLevels
} = require('./traceLevels')

const initAppForPage = () => ({
    actionName: 'wixCode/initAppForPage',
    options: {
        level: traceLevels.INFO,
        reportToHandlers: [SYSTEM_TRACING]
    }
})

const loadUserCode = () => ({
    actionName: 'wixCode/loadUserCode',
    options: {
        level: traceLevels.INFO,
        reportToHandlers: [SYSTEM_TRACING]
    }
})

const createControllers = () => ({
    actionName: 'wixCode/createControllers',
    options: {
        level: traceLevels.INFO,
        reportToHandlers: [SYSTEM_TRACING]
    }
})

const loadSiteMonitoringConfig = () => ({
    actionName: 'wixCode/loadSiteMonitoringConfig',
    options: {
        level: traceLevels.INFO,
        reportToHandlers: [SYSTEM_TRACING]
    }
})

module.exports.initAppForPage = initAppForPage
module.exports.createControllers = createControllers
module.exports.loadUserCode = loadUserCode
module.exports.loadSiteMonitoringConfig = loadSiteMonitoringConfig