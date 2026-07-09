export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'latenta-theme'

function applyTheme(theme: Theme) {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function useTheme() {
  const theme = useState<Theme>('theme', () => 'dark')

  function setTheme(value: Theme) {
    theme.value = value
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, value)
      applyTheme(value)
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function initTheme() {
    if (!import.meta.client) return
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    const resolved: Theme = stored === 'light' || stored === 'dark' ? stored : 'dark'
    theme.value = resolved
    applyTheme(resolved)
  }

  return { theme, setTheme, toggleTheme, initTheme }
}
