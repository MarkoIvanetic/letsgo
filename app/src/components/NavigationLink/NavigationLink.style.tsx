import { Button as MuiButton } from '@mui/material'

import { styled } from '@mui/material/styles'

const NavigationButton = styled(MuiButton)(
    ({ theme }) => ({
        color: theme.palette.primary.light,
        marginBottom: '5px',
        marginRight: '5px',
        borderRadius: '0',
        border: '1px solid'
    }),
    { name: 'NavigationLink' }
)

export { NavigationButton }
