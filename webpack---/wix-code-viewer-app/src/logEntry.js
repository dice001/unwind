'use strict'
const EventId = require('./logEventId')
const {
    safeGet
} = require('./safeGet')
const {
    siteMonitoringSeverity
} = require('./wixCodeLogLevel')

const UNKNOWN_ERROR = '[UNKNOWN ERROR]'
const SCRIPT_ERROR = 'Script error.'

const isSiteUnpublished = wixSdk => wixSdk.location.baseUrl === ''

const createPagePath = wixSdk => {
    if (isSiteUnpublished(wixSdk)) {
        return ''
    }
    const url = wixSdk.location.url.replace(wixSdk.location.baseUrl, '')

    const withoutQueryParameters =
        url.indexOf('?') === -1 ? url : url.slice(0, url.indexOf('?'))

    return withoutQueryParameters || '/'
}

const create = ({
    wixSdk,
    ignoredConsoleMessages,
    metaSiteId
}) => {
    const operationId = new EventId()
    const insertId = new EventId()

    const createLogEntry = ({
        message = UNKNOWN_ERROR,
        severity = siteMonitoringSeverity.DEFAULT,
        sourceLocation = {}
    }) => {
        if (message === SCRIPT_ERROR || ignoredConsoleMessages.includes(message)) {
            return
        }

        const log = {
            insertId: insertId.new(),
            timestamp: new Date().toISOString(),
            severity,
            labels: {
                siteUrl: safeGet(() => wixSdk.location.baseUrl, ''),
                namespace: 'Velo',
                tenantId: metaSiteId,
                viewMode: safeGet(() => wixSdk.window.viewMode, ''),
                revision: safeGet(() => wixSdk.site.revision.toString(), '')
            },
            operation: {
                id: operationId.new(),
                producer: safeGet(() => createPagePath(wixSdk), ''),
                first: false,
                last: false
            },
            sourceLocation,
            jsonPayload: {
                message
            }
        }

        return log
    }

    return {
        createLogEntry
    }
}

module.exports.create = create