import React from 'react'
import { Layout, Newsfeed } from '@/components'
import { Routes, Route, Link } from 'react-router-dom'
import { AppProvider } from '@/providers/app'

const App: React.FC = () => {
    return (
        <AppProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<Newsfeed />} />
                    <Route path="all" element={<Newsfeed />} />
                </Routes>
            </Layout>
        </AppProvider>
    )
}

export default App
