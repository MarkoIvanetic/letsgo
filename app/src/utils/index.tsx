import { NewsURLParamMap } from '@/types'

export const NEWS_CATEGORIES: string[] = [
    'global',
    'business',
    'entertainment',
    'health',
    'science',
    'sports',
    'technology'
]

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

export const encodeURLParameterMap = (paramsMap: NewsURLParamMap): string => {
    const queryString = Object.keys(paramsMap)
        .map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(paramsMap[key])
        })
        .join('&')
    return queryString ? `?${queryString}` : ''
}
