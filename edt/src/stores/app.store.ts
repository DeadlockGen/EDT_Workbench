import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppStore {
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        set({ theme })
      },
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed }))
    }),
    {
      name: 'edt-app-store',
      partialize: (state) => ({ theme: state.theme, sidebarCollapsed: state.sidebarCollapsed })
    }
  )
)
