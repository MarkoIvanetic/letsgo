import { CssBaseline } from '@mui/material'
import React, { useEffect, useState } from 'react'
// import Layout from './components/layout'
import Layout from '@/components/layout'
import axios, { AxiosResponse } from 'axios'

const client = axios.create({
    baseURL: process.env.API_ENDPOINT,
    timeout: 5000
    // headers: DEFAULT_HEADERS
})

interface Article {
    title: string
    url: string
}

const App: React.FC = () => {
    const [data, setData] = useState<Article[] | null>(null)

    useEffect(() => {
        client.get('news/top').then((data: AxiosResponse) => {
            const {
                data: { articles }
            } = data

            setData(articles as Article[])
        })
    }, [])

    if (!data) {
        return <span>Loading...</span>
    }

    return (
        <>
            <CssBaseline />
            <Layout>
                {data.map(article => {
                    return <h2 key={article.url}>{article.title}</h2>
                })}
            </Layout>
        </>
    )
}

export default App
