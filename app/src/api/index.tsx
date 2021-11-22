import { Article } from '@/types'
import axios, { AxiosResponse } from 'axios'

const client = axios.create({
    baseURL: process.API_ENDPOINT,
    timeout: 5000
})

axios.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        return Promise.reject(error)
    }
)

const getArticleList = (): Promise<Article[]> => {
    return client.get('news/top').then((data: AxiosResponse) => {
        const {
            data: { articles }
        } = data

        return articles
    })
}

const getArticle = (slug: string): Promise<Article> => {
    return client.get('news/top').then((data: AxiosResponse) => {
        const {
            data: { articles }
        } = data

        // this is one nasty workaround
        // compensating for a api with no route for single article
        return articles.find((article: Article) => article.slug === slug)
    })
}

export { client, getArticleList, getArticle }
