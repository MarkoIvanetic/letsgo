import React from 'react'
import { noop } from '@/utils'

const ColorModeContext = React.createContext({ toggleColorMode: noop })

export default ColorModeContext
