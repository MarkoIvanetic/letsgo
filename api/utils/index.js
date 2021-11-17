const generateUrlParams = paramsMap => {
    const searchParams = new URLSearchParams(paramsMap)
    return searchParams.toString()
}

module.exports = { generateUrlParams }
