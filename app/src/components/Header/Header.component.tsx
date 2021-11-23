import React from 'react'

import { Container, AppBar, Grid, IconButton, Typography, Toolbar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme } from '@mui/material/styles'

import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

import { NavigationLink } from '@/components'
import { NEWS_CATEGORIES } from '@/utils'
import { ColorModeContext } from '@/context'
interface HeaderProps {
    onDrawerToggle: () => void
}

const Header: React.FC<HeaderProps> = ({ onDrawerToggle }) => {
    const theme = useTheme()

    const { toggleColorMode } = React.useContext(ColorModeContext)

    return (
        <React.Fragment>
            <AppBar color="primary" position="static" elevation={0}>
                <Toolbar>
                    <Grid container spacing={1} alignItems="center">
                        <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
                            <IconButton color="inherit" aria-label="open drawer" onClick={onDrawerToggle} edge="start">
                                <MenuIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h2">News API</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton sx={{ ml: 1 }} size="large" onClick={toggleColorMode} color="inherit">
                                {theme.palette.mode === 'dark' ? (
                                    <Brightness7Icon fontSize="inherit" />
                                ) : (
                                    <Brightness4Icon fontSize="inherit" />
                                )}
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <AppBar component="div" position="sticky" elevation={0} sx={{ zIndex: 1 }}>
                <Container>
                    <Grid container spacing={1} alignItems="center">
                        {NEWS_CATEGORIES.map(category => {
                            return (
                                <Grid item key={category}>
                                    <NavigationLink to={`/news/${category}`}>{category.toUpperCase()}</NavigationLink>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Container>
            </AppBar>
        </React.Fragment>
    )
}

export default Header
