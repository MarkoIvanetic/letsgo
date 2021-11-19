import { Container } from '@mui/material'
import { Box } from '@mui/system'
import Navigation from './navigation'
import Header from './header'
import React from 'react'

const drawerWidth = 256

export const Layout2: React.FC = ({ children }) => {
    return <Container maxWidth={false}>{children}</Container>
}
export const Layout: React.FC = ({ children }) => {
    const [mobileOpen, setMobileOpen] = React.useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Navigation
                    PaperProps={{ style: { width: drawerWidth } }}
                    sx={{ display: { sm: 'block', xs: 'none' } }}
                />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header onDrawerToggle={handleDrawerToggle} />
                <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
                    {children}
                </Box>
                <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
                    Copyright
                </Box>
            </Box>
        </Box>
    )
}
