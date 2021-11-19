import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Button, Container, CssBaseline, Typography } from '@mui/material'
// import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from 'react-query'
import { AxiosError } from 'axios'
import { ReactQueryDevtools } from 'react-query/devtools'
// import { BrowserRouter as Router } from 'react-router-dom'

// import { Notifications } from '@/components/Notifications/Notifications/'
// import { AuthProvider } from '@/lib/auth'
import { queryClient } from '@/lib/react-query'
import { Box } from '@mui/system'

type AppProviderProps = {
    children: React.ReactNode
}

type ErrorFallbackProps = {
    error: Error | AxiosError
}

const ErrorFallback = ({ error }: ErrorFallbackProps) => {
    console.log(JSON.stringify(error))

    return (
        <Container maxWidth={false}>
            <Box
                sx={{
                    top: '0',
                    bottom: '0',
                    right: '0',
                    left: '0',
                    bgcolor: '#e57373',
                    color: '#f3e5f5',
                    display: 'inline-flex',
                    position: 'absolute',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <Typography variant="h2" component="div" gutterBottom>
                    Ooops, something went wrong:
                </Typography>

                <Typography component="div" gutterBottom>
                    {error.message}
                </Typography>
                <Button
                    color="error"
                    onClick={() => window.location.assign(window.location.origin)}
                    variant="contained">
                    Refresh
                </Button>
            </Box>
        </Container>
    )
}

export const AppProvider = ({ children }: AppProviderProps) => {
    return (
        <>
            {/* <React.Suspense
             fallback={
                 <div className="flex items-center justify-center w-screen h-screen">
                     <Spinner size="xl" />
                 </div>
             }> */}
            <React.StrictMode>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    {/* <HelmetProvider> */}
                    <CssBaseline />
                    <QueryClientProvider client={queryClient}>
                        {process.env.NODE_ENV !== 'test' && <ReactQueryDevtools />}
                        {/* <Notifications /> */}
                        {/* <AuthProvider> */}
                        {/* <Router>{children}</Router> */}
                        {/* </AuthProvider> */}
                        {children}
                    </QueryClientProvider>
                    {/* </HelmetProvider> */}
                </ErrorBoundary>
            </React.StrictMode>
            {/* </React.Suspense> */}
        </>
    )
}