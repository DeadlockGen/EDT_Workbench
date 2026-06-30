import { useState, useEffect } from 'react'
import { theme } from 'antd'

export function useTheme() {
  const { token } = theme.useToken()
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return { isDark, token, themeMode: isDark ? 'vs-dark' : 'vs' }
}
