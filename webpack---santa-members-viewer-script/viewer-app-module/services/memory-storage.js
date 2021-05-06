let memoryStorage

function setMemoryStorage(storage) {
    memoryStorage = storage
}

function getMemoryStorage() {
    return memoryStorage
}

function getAndParseMemoryStorageItem(key) {
    const jsonValue = getMemoryStorage().getItem(key)
    return jsonValue && JSON.parse(jsonValue)
}

module.exports = {
    setMemoryStorage,
    getMemoryStorage,
    getAndParseMemoryStorageItem
}