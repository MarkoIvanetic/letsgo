var UUID = require('uuid-1345')

const generateUrlParams = paramsMap => {
    const searchParams = new URLSearchParams(paramsMap)
    return searchParams.toString()
}

const generateSlugFromTitle = title => {
    if (!title || typeof title !== 'string') {
        throw new Error('Title is missing from an article!')
    }
    return title
        .toLowerCase()
        .replace(/[^A-Za-z0-9 ]/g, '')
        .split(' ')
        .filter(w => !!w)
        .slice(0, 5)
        .join('-')
}

const generateUUID = seed => {
    return UUID.v5({
        namespace: UUID.namespace.url,
        name: seed
    })
}


module.exports = { generateUrlParams, generateSlugFromTitle, generateUUID }
