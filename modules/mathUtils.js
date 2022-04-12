const getMaxPages = (entryCount) => {
    return Math.floor(entryCount / 20)
}

const _getMaxPages = getMaxPages;

export {
    _getMaxPages as getMaxPages,
}