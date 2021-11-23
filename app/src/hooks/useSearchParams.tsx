import { useMemo } from 'react'
import { useSearchParams as useSearchParamsRouter } from 'react-router-dom'

/**
 * Provides get/set for url parameters, parses url query
 *
 * @returns {Object}
 */

const useSearchParams = () => {
    const [searchParams, setSearchParams] = useSearchParamsRouter({})

    const params = useMemo(() => {
        const urlSearchParams = new URLSearchParams(searchParams)
        return Object.fromEntries(urlSearchParams.entries())
    }, [searchParams])

    return { params, setSearchParams }
}

export default useSearchParams
