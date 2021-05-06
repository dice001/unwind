const {
    UUID_PATTERN
} = require('../constants')

const mapQueryParams = (query) => Object.keys(query).map(k => `${k}=${query[k]}`).join('&')

function buildCurrentPath({
    location
}) {
    const {
        prefix,
        path,
        query
    } = location
    const queryParams = Object.keys(query).length > 0 ? `?${mapQueryParams(query)}` : ''
    const url = `/${prefix}/${path.join('/')}${queryParams}`

    return url
}

function replaceUuidWithSlug(url, slug) {
    if (!slug) {
        return url
    }

    const [, ...path] = url.split('/')
    if (path[1].match(UUID_PATTERN)) {
        path[1] = slug
        return `/${path.join('/')}`
    }

    return url;
}

module.exports = {
    buildCurrentPath,
    replaceUuidWithSlug
}