var express = require('express')
var fetch = require('node-fetch')
var router = express.Router()

const getRequestOptions = () => {
    return {
        method: 'GET',
        // uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
            start: '1',
            limit: '50',
            convert: 'USD'
        },
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
        },
        json: true,
        gzip: true
    }
}

router.get('/', async function (req, res) {
    const {
        route: { path }
    } = req

    // const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency' + path, requestOptions)
    const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', getRequestOptions())
    const data = await response.json()
    console.log(data)
    res.send(data)
})

module.exports = router
