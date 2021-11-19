import axios, { AxiosResponse } from 'axios'

interface Article {
    title: string
    url: string
}

const client = axios.create({
    baseURL: process.env.API_ENDPOINT,
    timeout: 5000
    // headers: DEFAULT_HEADERS
})

axios.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        return Promise.reject(error)
    }
)

const getNewsData = (): Promise<Article[]> => {
    return client.get('news/top').then((data: AxiosResponse) => {
        const {
            data: { articles }
        } = data

        return articles
    })
}

export { client, getNewsData }
