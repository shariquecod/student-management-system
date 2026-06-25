'use client'

export function usePermission(_resource?: string, _action?: string) {
  return {
    hasPermission: (_resource?: string, _action?: string) => true,
    isLoading: false,
  }
}
