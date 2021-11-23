/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
var express = require('express')
var UUID = require('uuid-1345')
var fetch = require('node-fetch')
var { generateUrlParams, generateSlugFromTitle, generateUUID } = require('../utils/index')

var router = express.Router()

const URL_BASE = 'https://newsapi.org/v2/'

const defaultRequestConfig = () => {
    return {
        method: 'GET',
        headers: {
            'x-api-key': process.env.NEWS_API_KEY
        }
    }
}

const fetchNewsData = (url, params = {}) => {
    const hasParams = !!Object.keys(params).length
    const paramString = hasParams ? `?${generateUrlParams(params)}` : ''

    return fetch(`${URL_BASE}${url}${paramString}`, defaultRequestConfig())
}

const transformArticle = article => {
    const id = generateUUID(article.url)
    console.log(id)
    const slug = generateSlugFromTitle(article.title) + '-' + id
    const urlToImage = article.urlToImage || 'https://picsum.photos/600/400'

    return { ...article, slug, id, urlToImage }
}

router.get('/', async function (req, res) {
    res.redirect('/news/top')
})


router.get('/top', async function (req, res) {

    const response = await fetchNewsData('top-headlines', {
        country: 'us',
        ...req.query
    })

    const data = await response.json()

    enrichedData = { ...data, articles: data.articles.map(transformArticle) }

    res.send(enrichedData)
})

router.get('/all', async function (req, res) {
    console.log({
        q: "world", // api requires some form of search narrowing
        ...req.query
    });
    const response = await fetchNewsData('everything', {
        q: "world", // api requires some form of search narrowing
        ...req.query
    })

    const data = await response.json()

    enrichedData = { ...data, articles: (data.articles || []).map(transformArticle) }

    res.send(enrichedData)
})

router.use(function (req, res) {
    res.status(404).send({ error: 'Unable to find ' + req.originalUrl })
})

module.exports = router
