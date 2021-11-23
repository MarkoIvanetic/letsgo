import { Article, NewsURLParamMap } from '@/types'
import axios, { AxiosResponse } from 'axios'
import { encodeURLParameterMap } from '@/utils'

const client = axios.create({
    baseURL: process.API_ENDPOINT,
    timeout: 8000
})

axios.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        return Promise.reject(error)
    }
)

interface ArticleListResponse {
    totalResults: number
    articles: Article[]
}

const getArticleList = (searchMap: NewsURLParamMap): Promise<ArticleListResponse> => {
    const queryParam = encodeURLParameterMap(searchMap)
    return client.get(`news/all${queryParam}`).then(({ data }) => {
        return data as ArticleListResponse
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
