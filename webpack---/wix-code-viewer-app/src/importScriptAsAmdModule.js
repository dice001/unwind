'use strict'

const {
    UserCodeNetworkError
} = require('./logger/errors/userCodeNetworkError')

const importScriptWindow = url =>
    new Promise((resolve, reject) => {
        const element = document.createElement('script')
        element.async = false //make sure the scripts execute in the order they are added
        element.src = url
        element.onload = () => resolve()
        element.onerror = e => reject(new UserCodeNetworkError(e, url))
        document.body.appendChild(element)
    })

const importSync = url => {
    let definedModule = null
    const oldDefine = self.define
    self.define = function define(_, mod) {
        definedModule = mod
    }
    self.define.amd = true

    try {
        self.importScripts(url)
        return definedModule
    } catch (e) {
        if (e.name === 'NetworkError' || e.name === 'NS_BINDING_ABORTED') {
            throw new UserCodeNetworkError(e, url)
        }

        throw e
    } finally {
        if (oldDefine) {
            self.define = oldDefine
        } else {
            delete self.define
        }
    }
}

const importAsync = async url => {
    let definedModule = null
    const oldDefine = self.define
    self.define = function define(_, mod) {
        definedModule = mod
    }
    self.define.amd = true

    try {
        await importScriptWindow(url)
        return definedModule
    } finally {
        if (oldDefine) {
            self.define = oldDefine
        } else {
            delete self.define
        }
    }
}

module.exports.importSync = importSync
module.exports.importAsync = importAsync