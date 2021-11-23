const UUID = require('uuid-1345')
const fakeNewsData = require('./fakeNewsData')

const generateUrlParams = (paramsMap) => {
	const searchParams = new URLSearchParams(paramsMap)
	return searchParams.toString()
}

const generateSlugFromTitle = (title) => {
	if (!title || typeof title !== 'string') {
		throw new Error('Title is missing from an article!')
	}
	return title
		.toLowerCase()
		.replace(/[^A-Za-z0-9 ]/g, '')
		.split(' ')
		.filter((w) => !!w)
		.slice(0, 5)
		.join('-')
}

const generateUUID = (seed) => {
	return UUID.v5({
		namespace: UUID.namespace.url,
		name: seed,
	})
}

const uuidMatch = /(?<id>[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12})$/

const parseUUID = (url) => {
	if (!url) {
		return false
	}
	const {id} = url.match(uuidMatch)?.groups || {}
	return id
}

module.exports = {generateUrlParams, generateSlugFromTitle, generateUUID, parseUUID, fakeNewsData}
