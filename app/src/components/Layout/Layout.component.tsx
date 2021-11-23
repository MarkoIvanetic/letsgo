import { Box } from '@mui/system'
import Header from '../Header/Header.component'
import React from 'react'

export const Layout: React.FC = ({ children }) => {
    const [mobileOpen, setMobileOpen] = React.useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header onDrawerToggle={handleDrawerToggle} />
                <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
                    {children}
                </Box>
                <Box component="footer" sx={{ p: 2, backgroundColor: 'palette.primary.dark' }}>
                    {/* <Box component="footer" sx={{ p: 2, backgroundColor: '#eaeff1' }}> */}
                    Copyright
                </Box>
            </Box>
        </Box>
    )
}
