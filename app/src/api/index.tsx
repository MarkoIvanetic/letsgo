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

const getArticleList = (searchMap: NewsURLParamMap): Promise<ArticleListResponse> => {
    const queryParam = encodeURLParameterMap(searchMap)
    return client.get(`news/all${queryParam}`).then(({ data }) => {
        return data as ArticleListResponse
    })
}

const getArticle = (slug: string, params: NewsURLParamMap): Promise<Article> => {
    // this is one nasty workaround
    // compensating for a api with no route for single article
    const data: Article[] = queryClient.getQueryData(['news']) || []
    console.log(data)

    return Promise.resolve(data.find((article: Article) => article.slug === slug) || ({} as Article))
}

export { client, getArticleList, getArticle }
