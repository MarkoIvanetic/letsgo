import { Button as MuiButton } from '@mui/material'

import { styled } from '@mui/material/styles'

const NavigationButton = styled(MuiButton)(
    () => ({
        marginBottom: '5px',
        marginRight: '5px',
        borderRadius: '0',
        borderBottom: '2px solid'
    }),
    { name: 'NavigationLink' }
)

export { NavigationButton }
