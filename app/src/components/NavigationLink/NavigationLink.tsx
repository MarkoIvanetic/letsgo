// @ts
import React, { useEffect } from 'react'
import { Link as RouterLink, LinkProps, useMatch, useResolvedPath } from 'react-router-dom'
import { NavigationButton } from '@/components/NavigationLink/NavigationLink.style'

export const NavigationLink = ({ children, to, ...rest }: LinkProps) => {
    const resolved = useResolvedPath(to)
    const match = useMatch({ path: resolved.pathname, end: true })

    useEffect(() => {
        console.log('match:', !!match)
    }, [match])

    return (
        <NavigationButton
            color="inherit"
            sx={{ borderColor: match ? 'white' : 'transparent' }}
            component={RouterLink}
            to={to}
            {...rest}>
            {children}
        </NavigationButton>
    )
}
