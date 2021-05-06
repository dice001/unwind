const ExtendableError = require('es6-error')

const ERROR_NAME = 'UserCodeNetworkError'

class UserCodeNetworkError extends ExtendableError {
    constructor(originalError, url) {
        super(`Failed to import user code script: ${originalError.message}`)
        this.name = ERROR_NAME
        this.originalError = originalError
        this.url = url
    }
}

module.exports.UserCodeNetworkError = UserCodeNetworkError
module.exports.ERROR_NAME = ERROR_NAME