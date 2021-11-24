import { Box } from '@mui/system'
import Header from '../Header/Header.component'
import React from 'react'

const Layout: React.FC = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: 'background.paper' }}>
                    {children}
                </Box>
                <Box component="footer" sx={{ p: 4, backgroundColor: 'background.paper' }}>
                    Copyright
                </Box>
            </Box>
        </Box>
    )
}

export default Layout
