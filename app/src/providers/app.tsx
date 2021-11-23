import React, { useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Button, Box, Container, CssBaseline, Typography, PaletteMode } from '@mui/material'
import { QueryClientProvider } from 'react-query'
import { AxiosError } from 'axios'
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter } from 'react-router-dom'

import { queryClient } from '@/lib/react-query'
import { ColorModeContext } from '@/context'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useDarkMode } from '@/hooks'

type AppProviderProps = {
    children: React.ReactNode
}

type ErrorFallbackProps = {
    error: Error | AxiosError
}

const ErrorFallback = ({ error }: ErrorFallbackProps) => {
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

const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                  background: {
                      default: 'white',
                      paper: 'white'
                  }
              }
            : {
                  background: {
                      default: '#0e141b',
                      paper: '#0e141b'
                  }
              })
    }
})

export const AppProvider = ({ children }: AppProviderProps) => {
    const [darkMode, setDarkMode] = useDarkMode()

    const [mode, setMode] = React.useState<'light' | 'dark'>(darkMode ? 'dark' : 'light')

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'))
            }
        }),
        []
    )

    const theme = useMemo(() => {
        setDarkMode(mode === 'dark')
        return createTheme(getDesignTokens(mode))
    }, [mode])

    return (
        <>
            {/* <React.Suspense
             fallback={
                 <div className="flex items-center justify-center w-screen h-screen">
                     <Spinner size="xl" />
                 </div>
             }> */}
            <React.StrictMode>
                <ColorModeContext.Provider value={colorMode}>
                    <ThemeProvider theme={theme}>
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                            {/* <HelmetProvider> */}
                            <CssBaseline />
                            <QueryClientProvider client={queryClient}>
                                {process.NODE_ENV !== 'production' && <ReactQueryDevtools />}
                                {/* <Notifications /> */}
                                {/* <AuthProvider> */}
                                <BrowserRouter>{children}</BrowserRouter>
                                {/* </AuthProvider> */}
                            </QueryClientProvider>
                            {/* </HelmetProvider> */}
                        </ErrorBoundary>
                    </ThemeProvider>
                </ColorModeContext.Provider>
            </React.StrictMode>
            {/* </React.Suspense> */}
        </>
    )
}
