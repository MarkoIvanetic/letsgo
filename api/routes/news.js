/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
var express = require('express')
var UUID = require('uuid-1345')
var fetch = require('node-fetch')
var { generateUrlParams } = require('../utils/index')

var router = express.Router()

const URL_BASE = 'https://newsapi.org/v2/'

const getRequestOptions = () => {
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

    return fetch(`${URL_BASE}${url}${paramString}`, getRequestOptions())
}

const generateUUIDFromUrl = url => {
    return UUID.v5({
        namespace: UUID.namespace.url,
        name: url
    })
}

const generateSlugFromTitle = title => {
    if (!title || typeof title !== 'string') {
        console.log(title)
        console.log(typeof title)
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

const transformArticle = article => {
    const id = generateUUIDFromUrl(article.url)
    console.log(id)
    const slug = generateSlugFromTitle(article.title) + '-' + id

    return { ...article, slug, id }
}

router.get('/top', async function (req, res) {
    // req.params
    // req.body
    // req.route.path

    const response = await fetchNewsData('top-headlines', {
        country: 'us',
        ...req.query
    })

    const data = await response.json()

    enrichedData = { ...data, articles: data.articles.map(transformArticle) }

    res.send(enrichedData)
})

router.get('/', async function (req, res) {
    res.redirect('/news/all')
})

router.get('/all', async function (req, res) {
    // req.params
    // req.body
    // req.route.path

    // const allowedParams = {
    //     q: true,
    //     sources: true,
    //     language: true,
    //     sortBy: true,
    //     pageSize: true,
    //     from: true,
    //     to: true,
    //     page: true
    // }

    // const mandatoryParams = ['q', 'qInTitle', 'sources', 'domains']

    const response = await fetchNewsData('everything', {
        ...req.query
    })

    const data = await response.json()

    enrichedData = { ...data, articles: data.articles.map(transformArticle) }

    res.send(enrichedData)
})

router.use(function (req, res) {
    res.status(404).send({ error: 'Unable to find ' + req.originalUrl })
})

module.exports = router
