import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const useSearchParams = () => {
    const { search } = useLocation()

    const parsed = useMemo(() => {
        const urlSearchParams = new URLSearchParams(search)
        const params = Object.fromEntries(urlSearchParams.entries())

        return params
    }, [search])

    return { search, parsed }
}

export default useSearchParams
