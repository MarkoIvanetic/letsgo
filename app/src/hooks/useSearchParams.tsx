import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NewsURLParamMap } from '@/types'
import { encodeURLParameterMap } from '@/utils'

const useSearchParams = () => {
    const { pathname, search } = useLocation()
    const navigate = useNavigate()
    const [params, setParamsState] = useState<NewsURLParamMap>({})

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(search)
        const params = Object.fromEntries(urlSearchParams.entries())
        setParamsState(params)
    }, [search])

    const setParams = (params: NewsURLParamMap) => {
        console.log(encodeURLParameterMap(params))
        navigate(pathname + encodeURLParameterMap(params))
    }

    return { params, setParams }
}

export default useSearchParams
