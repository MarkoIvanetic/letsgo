/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
var express = require('express')
var fetch = require('node-fetch')
const NodeCache = require('node-cache')
var { generateUrlParams, generateSlugFromTitle, generateUUID, parseUUID, fakeNewsData } = require('../utils/index')
var router = express.Router()

// free news api limits the number of requests per hour
// to solve this, simple node caching library is implemented
// cache will be kept until app is restarted
const newsCache = new NodeCache({
	stdTTL: 0,
	checkperiod: 0,
})

const URL_BASE = 'https://newsapi.org/v2/'

const defaultRequestConfig = {
	method: 'GET',
	headers: {
		'x-api-key': process.env.NEWS_API_KEY,
	},
}

const fetchNewsData = (url, params = {}) => {
	const hasParams = !!Object.keys(params).length
	const paramString = hasParams ? `?${generateUrlParams(params)}` : ''
	return fetch(`${URL_BASE}${url}${paramString}`, defaultRequestConfig)
}

const transformArticle =
	(category) =>
	({ url, title, urlToImage, ...rest }) => {
		const id = generateUUID(url)
		const slug = generateSlugFromTitle(title) + '-' + id
		return { ...rest, slug, title, id, category, urlToImage: urlToImage || 'https://picsum.photos/600/400' }
	}

router.get('/', async function (req, res) {
	res.redirect('/news/top')
})

router.get('/all', async function (req, res) {
	const category = req.query.q || 'general'

	const requestQueryParams = {
		q: category,
		...req.query,
	}

	cachedQuery = newsCache.get(req.url)

	if (cachedQuery !== undefined) {
		console.log('Request served from cache!')
		res.send(cachedQuery)
		return
	} else {
		console.log('Current cache: ', newsCache.keys())
	}

	const response = await fetchNewsData('everything', {
		...{ ...req.query, q: category }, // api requires some form of search narrowing
	})
	const data = await response.json()

	// const data = fakeNewsData

	if (data.status === 'error') {
		console.log(data.message)
		res.status(500).send({ error: data.message })
		return
	}

	enrichedData = {
		...data,
		totalResults: Math.min(100, data?.totalResults),
		articles: (data.articles || []).map(transformArticle(category)),
	}

	// set cache
	newsCache.set(req.url, enrichedData)
	res.send(enrichedData)
})

router.get('/article', async function (req, res) {
	const id = parseUUID(req.query.slug)

	cacheKeys = newsCache.keys()

	// merge articles
	const allArticles = cacheKeys.reduce((acc, key) => {
		cachedQuery = newsCache.get(key)
		return [...acc, ...cachedQuery.articles]
	}, [])

	const article = allArticles.find((article) => article.id === id)

	if (!article) {
		res.status(404).send({ error: 'Cannot find article ' + id })
		return
	}

	res.send(article)
})

router.use(function (req, res) {
	res.status(404).send({ error: 'Unable to find ' + req.originalUrl })
})

module.exports = router
