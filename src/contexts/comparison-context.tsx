'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CompareMonitor {
  _id: string
  name: string
  slug: string
  mainImage?: any
  screenSize: number
  resolution: string
  panelType: string
  refreshRate: number
  responseTime?: number
  aspectRatio?: string
  curved: boolean
  curveRadius?: string
  hdrSupport?: string[]
  colourGamut?: {
    srgb?: number
    adobeRgb?: number
    dcip3?: number
  }
  brightness?: number
  contrastRatio?: string
  adaptiveSync?: string[]
  ports?: Array<{
    type: string
    count: number
    version?: string
  }>
  usbHub: boolean
  speakers: boolean
  standAdjustments?: string[]
  vesaMount?: string
  weight?: number
  msrp?: number
  brand?: {
    name: string
    slug: string
  }
}

interface ComparisonContextType {
  monitors: CompareMonitor[]
  addMonitor: (monitor: CompareMonitor) => void
  removeMonitor: (id: string) => void
  clearAll: () => void
  isInComparison: (id: string) => boolean
  maxMonitors: number
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

const MAX_MONITORS = 4

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [monitors, setMonitors] = useState<CompareMonitor[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('compareMonitors')
    if (saved) {
      try {
        setMonitors(JSON.parse(saved))
      } catch {
        localStorage.removeItem('compareMonitors')
      }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('compareMonitors', JSON.stringify(monitors))
  }, [monitors])

  const addMonitor = (monitor: CompareMonitor) => {
    if (monitors.length >= MAX_MONITORS) return
    if (monitors.some((m) => m._id === monitor._id)) return
    setMonitors((prev) => [...prev, monitor])
  }

  const removeMonitor = (id: string) => {
    setMonitors((prev) => prev.filter((m) => m._id !== id))
  }

  const clearAll = () => {
    setMonitors([])
  }

  const isInComparison = (id: string) => {
    return monitors.some((m) => m._id === id)
  }

  return (
    <ComparisonContext.Provider
      value={{
        monitors,
        addMonitor,
        removeMonitor,
        clearAll,
        isInComparison,
        maxMonitors: MAX_MONITORS,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }
  return context
}
