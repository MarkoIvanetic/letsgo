import { Container } from '@mui/material'
import React from 'react'

const Layout: React.FC = ({ children }) => {
    return <Container maxWidth="sm">{children}</Container>
}

export default Layout
