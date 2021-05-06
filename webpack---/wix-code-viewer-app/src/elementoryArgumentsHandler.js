'use strict'
const assign_ = require('lodash/assign')

const setExtraHeaders = (wixSdk, appLogger) => {
    try {
        self.elementorySupport.options = self.elementorySupport.options || {}
        self.elementorySupport.options.headers = assign_({},
            self.elementorySupport.options.headers, {
                'x-wix-site-revision': wixSdk.site.revision
            }
        )
    } catch (e) {
        appLogger.error(e)
    }
}

module.exports = {
    setExtraHeaders
}