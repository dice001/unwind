function parseConfigItems(config) {

    if (!config || !config[0]) {
        return []
    }

    const isV1 = config[0].isVisible !== undefined
    return isV1 ? parseV1Config(config) : parseV2Config(config)
}

function parseV1Config(config) {
    return config.map(item => ({
        link: item.link,
        isVisibleInMenuBar: item.isVisible,
        isVisibleInMobileMenuBar: item.isVisibleMobile,
        visibleForRoles: item.visibleForRoles
    }))
}

function parseV2Config(config) {
    return config.map(item => ({
        link: item.l,
        isVisibleInMenuBar: !item.hmb,
        isVisibleInMobileMenuBar: !item.hmmb,
        visibleForRoles: item.vfr || []
    }))
}

module.exports = {
    parseConfigItems
}