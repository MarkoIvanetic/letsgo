import React from 'react'
import { Layout } from '@/components'
import { Newsfeed, Article } from '@/pages'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '@/providers/app'

const App: React.FC = () => {
    return (
        <AppProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/news/global" />} />
                    <Route path="/news/:category" element={<Newsfeed />} />
                    <Route path="/news/:category/:slug" element={<Article />} />
                </Routes>
            </Layout>
        </AppProvider>
    )
}

export default App
