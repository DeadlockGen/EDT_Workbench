import { useEffect } from 'react'
import { theme as antTheme } from 'antd'

export function useMonacoTheme() {
  const { token } = antTheme.useToken()

  useEffect(() => {
    // Monaco theme is set via the Editor component's theme prop
  }, [token])

  return {}
}
