import { Article, NewsURLParamMap } from '@/types'
import axios, { AxiosResponse } from 'axios'
import { encodeURLParameterMap } from '@/utils'
import { queryClient } from '@/lib/react-query'

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

const getArticleList = (category: string, searchMap: NewsURLParamMap): Promise<ArticleListResponse> => {
    const queryParam = encodeURLParameterMap({ ...searchMap, q: category })
    return client.get(`news/all${queryParam}`).then(({ data }) => {
        return data as ArticleListResponse
    })
}

const getArticle = (slug: string): Promise<Article> => {
    const queryParam = encodeURLParameterMap({ slug })

    return client.get(`news/article${queryParam}`).then(({ data }) => data)
}

export { client, getArticleList, getArticle }
