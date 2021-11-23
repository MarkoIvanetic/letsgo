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
                    <Route path="/" element={<Navigate to="/news" />} />
                    <Route path="/news" element={<Newsfeed />} />
                    <Route path="/news/:slug" element={<Article />} />
                </Routes>
            </Layout>
        </AppProvider>
    )
}

export default App
