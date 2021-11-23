import { useMemo } from 'react'
import { useSearchParams as useSearchParamsRouter, useParams } from 'react-router-dom'

/**
 * Provides get/set for url parameters, parses url query
 *
 * @returns {Object}
 */

const useSearchParams = () => {
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParamsRouter({})

    const search = useMemo(() => {
        const urlSearchParams = new URLSearchParams(searchParams)
        return Object.fromEntries(urlSearchParams.entries())
    }, [searchParams])

    return { params, search, setSearchParams }
}

export default useSearchParams
