/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
var express = require('express')
var fetch = require('node-fetch')
var {generateUrlParams, generateSlugFromTitle, generateUUID} = require('../utils/index')
var router = express.Router()

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

const transformArticle = (category) => ({url, title, urlToImage, ...rest}) => {
		const id = generateUUID(url)
		const slug = generateSlugFromTitle(title) + '-' + id
		return {...rest, slug, id, category, urlToImage: urlToImage || 'https://picsum.photos/600/400'}
	}

router.get('/', async function (req, res) {
	res.redirect('/news/top')
})

router.get('/all', async function (req, res) {
	const category = req.query.q || 'general'
	const response = await fetchNewsData('everything', {
		...{...req.query, q: category}, // api requires some form of search narrowing
	})
	const data = await response.json()
	if (data.status === 'error') {
		console.log(data.message);
		res.status(500).send({error: data.message})
		return
	}
	enrichedData = {
		...data,
		totalResults: Math.min(100, data?.totalResults),
		articles: (data.articles || []).map(transformArticle(category)),
	}
	res.send(enrichedData)
})

router.use(function (req, res) {
	res.status(404).send({error: 'Unable to find ' + req.originalUrl})
})

module.exports = router
