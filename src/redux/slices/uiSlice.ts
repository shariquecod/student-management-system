import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Locale } from '@/i18n/types'
import { DEFAULT_LOCALE } from '@/i18n/types'

interface UiState {
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  locale: Locale
}

const initialState: UiState = {
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  locale: DEFAULT_LOCALE,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload
    },
    setMobileSidebarOpen(state, action: PayloadAction<boolean>) {
      state.mobileSidebarOpen = action.payload
    },
    toggleMobileSidebar(state) {
      state.mobileSidebarOpen = !state.mobileSidebarOpen
    },
    setLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload
    },
  },
})

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setMobileSidebarOpen,
  toggleMobileSidebar,
  setLocale,
} = uiSlice.actions
export default uiSlice.reducer
