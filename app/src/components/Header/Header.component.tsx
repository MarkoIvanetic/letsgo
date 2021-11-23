import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import { Container } from '@mui/material'
import { NavigationLink } from '@/components'
import { NEWS_CATEGORIES } from '@/utils'
interface HeaderProps {
    onDrawerToggle: () => void
}

const Header: React.FC<HeaderProps> = ({ onDrawerToggle }) => {
    return (
        <React.Fragment>
            <AppBar color="primary" position="sticky" elevation={0}>
                <Toolbar>
                    <Grid container spacing={1} alignItems="center">
                        <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
                            <IconButton color="inherit" aria-label="open drawer" onClick={onDrawerToggle} edge="start">
                                <MenuIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs />
                        <Grid item>
                            <IconButton color="inherit" sx={{ p: 0.5 }}>
                                <Avatar />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <AppBar component="div" position="static" elevation={0} sx={{ zIndex: 1 }}>
                <Container>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item>
                            <NavigationLink to={'/news'}>GLOBAL</NavigationLink>
                        </Grid>
                        {NEWS_CATEGORIES.map(category => {
                            return (
                                <Grid item key={category}>
                                    <NavigationLink to={`/news?q=${category}`}>{category.toUpperCase()}</NavigationLink>
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
