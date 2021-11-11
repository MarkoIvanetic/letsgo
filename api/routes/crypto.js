var express = require('express')
var fetch = require('node-fetch')
var router = express.Router()

const getRequestOptions = (apiKey = '7afe6b38-0b9c-49b1-82bc-c4da71e62640') => {
    return {
        method: 'GET',
        // uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
            start: '1',
            limit: '5000',
            convert: 'USD'
        },
        headers: {
            'X-CMC_PRO_API_KEY': apiKey
        },
        json: true,
        gzip: true
    }
}

router.get('/', async function (req, res) {
    const {
        route: { path }
    } = req

    const apiKey = req.get('X-CMC_PRO_API_KEY')
    // const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency' + path, requestOptions)
    const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', getRequestOptions(apiKey))

    res.send(response)
})

module.exports = router
