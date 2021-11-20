import { QueryClient } from 'react-query'

const queryConfig = {
    queries: {
        useErrorBoundary: true,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 min
        retry: false
    }
}

export const queryClient = new QueryClient({ defaultOptions: queryConfig })
