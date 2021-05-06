const ExtendableError = require('es6-error')

const ERROR_NAME = 'TelemetryLogSendError'

class TelemetryLogSendError extends ExtendableError {
    constructor(originalError, payload) {
        super(originalError.message)
        this.name = ERROR_NAME
        this.originalError = originalError
        this.payload = payload
    }
}

module.exports.TelemetryLogSendError = TelemetryLogSendError
module.exports.ERROR_NAME = ERROR_NAME