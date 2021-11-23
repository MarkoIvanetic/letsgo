import { NewsURLParamMap } from '@/types'

export const NEWS_CATEGORIES: string[] = ['business', 'entertainment', 'health', 'science', 'sports', 'technology']

export const encodeURLParameterMap = (paramsMap: NewsURLParamMap): string => {
    const queryString = Object.keys(paramsMap)
        .map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(paramsMap[key])
        })
        .join('&')
    return queryString ? `?${queryString}` : ''
}
