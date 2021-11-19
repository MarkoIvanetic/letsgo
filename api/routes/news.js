/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
var express = require('express')
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

router.get('/top', async function (req, res, next) {
    // req.params
    // req.body
    // req.route.path

    const response = await fetchNewsData('top-headlines', {
        country: 'us',
        ...req.query
    })

    const data = await response.json()

    // next(data)
    res.send(data)
})

router.get('/', async function (req, res) {
    res.redirect('/news/all')
})

router.get('/all', async function (req, res, next) {
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

    // res.send(data)
    next(data)
})

router.use(function (req,res,next){
	res.status(404).send({ error: 'Unable to find ' + req.originalUrl });
});

module.exports = router
