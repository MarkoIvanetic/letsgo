// @ts
import React, { useMemo } from 'react'
import { Link as RouterLink, LinkProps, useLocation, useResolvedPath } from 'react-router-dom'
import { NavigationButton } from '@/components/NavigationLink/NavigationLink.style'

export const NavigationLink = ({ children, to, ...rest }: LinkProps) => {
    const resolved = useResolvedPath(to)

    const { pathname, search } = useLocation()

    const match = useMemo(() => {
        return pathname === resolved.pathname && search === resolved.search
    }, [pathname, search])

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
