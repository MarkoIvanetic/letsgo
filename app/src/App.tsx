import { CssBaseline } from '@mui/material'
import React from 'react'
import Layout from './components/layout'
import axios, { AxiosRequestHeaders } from 'axios'

const DEFAULT_HEADERS: AxiosRequestHeaders = {
    'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY as string
}

const client = axios.create({
    baseURL: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency',
    timeout: 1000,
    headers: DEFAULT_HEADERS
})

const App: React.FC = () => {
    console.log('I rendered:', DEFAULT_HEADERS)

    client.get('listing/latest').then((response: any) => {
        console.log(response)
    })

    return (
        <>
            <CssBaseline />
            <Layout>Webpack is cool!</Layout>
        </>
    )
}

export default App
