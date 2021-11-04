import { CssBaseline } from '@mui/material'
import React from 'react'
import Layout from './components/layout'

const App: React.FC = () => {
    console.log('I rendered')

    return (
        <>
            <CssBaseline />
            <Layout>Webpack is cool!</Layout>
        </>
    )
}

export default App
