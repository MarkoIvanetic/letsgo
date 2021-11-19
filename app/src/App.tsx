import React from 'react'
import { Layout, Newsfeed } from '@/components'

import { AppProvider } from '@/providers/app'

const App: React.FC = () => {
    return (
        <AppProvider>
            <Layout>
                <Newsfeed />
            </Layout>
        </AppProvider>
    )
}

export default App
