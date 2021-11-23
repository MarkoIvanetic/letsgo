export interface Article {
    id: string
    title: string
    url: string
    urlToImage: string
    description: string
    slug: string
    content: string
}

export interface NewsURLParamMap {
    [param: string]: string | number
}
