import { ConfigProvider, theme as antTheme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useAppStore } from './stores/app.store'
import { RouterProvider } from './router'

const lightToken = {
  colorPrimary: '#589df6',
  colorBgContainer: '#f5f5f5',
  colorBgElevated: '#ffffff',
  colorBgLayout: '#f0f0f0',
  colorBorder: '#d5d8dc',
  colorBorderSecondary: '#e0e2e6',
  colorText: '#2b2b2b',
  colorTextSecondary: '#555555',
  colorTextDescription: '#6e6e6e',
  colorTextTertiary: '#888888',
  colorFillAlter: '#eaeced',
  colorFillSecondary: '#f0f1f2',
  colorBgMask: 'rgba(0, 0, 0, 0.3)',
  colorError: '#cc6666',
  colorWarning: '#cc7832',
  colorSuccess: '#6a8759',
  colorInfo: '#589df6',
  borderRadius: 4,
  fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
  fontSize: 14
}

const darkToken = {
  colorPrimary: '#589df6',
  colorBgContainer: '#2b2b2b',
  colorBgElevated: '#3c3f41',
  colorBgLayout: '#2b2b2b',
  colorBgSpotlight: '#4e5254',
  colorBorder: '#4e5254',
  colorBorderSecondary: '#4e5254',
  colorText: '#a9b7c6',
  colorTextSecondary: '#7a8a9e',
  colorTextDescription: '#6a7a8e',
  colorTextTertiary: '#5a6a7e',
  colorBgTextHover: 'rgba(165, 180, 198, 0.08)',
  colorBgTextActive: 'rgba(165, 180, 198, 0.15)',
  colorFillAlter: '#323232',
  colorFillSecondary: '#3c3f41',
  colorBgMask: 'rgba(0, 0, 0, 0.6)',
  colorError: '#cc6666',
  colorWarning: '#cc7832',
  colorSuccess: '#6a8759',
  colorInfo: '#589df6',
  borderRadius: 4,
  fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
  fontSize: 14
}

const sharedComponents = {
  Menu: {
    itemBg: 'transparent',
    itemHeight: 36
  },
  Tabs: {
    cardHeight: 32
  }
}

export default function App() {
  const appTheme = useAppStore((s) => s.theme)
  const isDark = appTheme === 'dark'

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: isDark ? darkToken : lightToken,
        components: {
          ...sharedComponents,
          Menu: {
            ...sharedComponents.Menu,
            itemSelectedBg: isDark ? '#4e5254' : '#e0e2e6',
            itemHoverBg: isDark ? '#4e5254' : '#eaeced',
            itemColor: isDark ? '#a9b7c6' : '#2b2b2b',
            itemSelectedColor: isDark ? '#bbd7fb' : '#589df6'
          },
          Tabs: {
            ...sharedComponents.Tabs,
            cardBg: isDark ? '#3c3f41' : '#eaeced'
          },
          Table: {
            headerBg: isDark ? '#2d2d2d' : '#eaeced',
            headerColor: isDark ? '#a9b7c6' : '#2b2b2b',
            rowHoverBg: isDark ? '#323232' : '#f0f1f2'
          },
          Tag: {
            defaultBg: isDark ? '#4e5254' : '#eaeced',
            defaultColor: isDark ? '#a9b7c6' : '#2b2b2b'
          },
          Input: {
            colorBgContainer: isDark ? '#3c3f41' : '#ffffff',
            colorBorder: isDark ? '#4e5254' : '#d5d8dc'
          },
          Select: {
            colorBgContainer: isDark ? '#3c3f41' : '#ffffff',
            colorBorder: isDark ? '#4e5254' : '#d5d8dc'
          },
          Button: {
            defaultBg: isDark ? '#4e5254' : '#ffffff',
            defaultColor: isDark ? '#a9b7c6' : '#2b2b2b',
            defaultBorderColor: isDark ? '#4e5254' : '#d5d8dc',
            colorPrimaryHover: isDark ? '#78abf7' : '#78abf7'
          },
          Card: {
            colorBgContainer: isDark ? '#3c3f41' : '#ffffff'
          },
          Modal: {
            contentBg: isDark ? '#3c3f41' : '#ffffff',
            headerBg: isDark ? '#3c3f41' : '#ffffff'
          },
          Message: {
            contentBg: isDark ? '#3c3f41' : '#ffffff'
          },
          Tooltip: {
            colorBgSpotlight: isDark ? '#4e5254' : '#555555'
          }
        }
      }}
    >
      <div className={isDark ? 'dark' : ''}>
        <RouterProvider />
      </div>
    </ConfigProvider>
  )
}
