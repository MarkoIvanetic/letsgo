// https://usehooks.com/useDarkMode/

import { useLocalStorage } from '.'
import { useMediaQuery } from '@mui/material'

function useDarkMode() {
    // Use our useLocalStorage hook to persist state through a page refresh.
    // Read the recipe for this hook to learn more: usehooks.com/useLocalStorage
    const [enabledState, setEnabledState] = useLocalStorage<boolean>('dark-mode-enabled', false)
    // See if user has set a browser or OS preference for dark mode.
    // The usePrefersDarkMode hook composes a useMedia hook (see code below).
    const prefersDarkMode = usePrefersDarkMode()
    // If enabledState is defined use it, otherwise fallback to prefersDarkMode.
    // This allows user to override OS level setting on our website.
    const enabled = enabledState ?? prefersDarkMode
    // Return enabled state and setter
    return [enabled, setEnabledState] as const
}

function usePrefersDarkMode() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    return prefersDarkMode
}

export default useDarkMode
