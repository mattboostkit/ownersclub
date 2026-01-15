'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, X, ArrowLeft, Monitor, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Monitor presets with common configurations
const MONITOR_PRESETS = [
  { name: 'Full HD 24"', diagonal: 24, resolution: '1920x1080', aspectRatio: '16:9' },
  { name: 'Full HD 27"', diagonal: 27, resolution: '1920x1080', aspectRatio: '16:9' },
  { name: 'QHD 27"', diagonal: 27, resolution: '2560x1440', aspectRatio: '16:9' },
  { name: '4K 27"', diagonal: 27, resolution: '3840x2160', aspectRatio: '16:9' },
  { name: '4K 32"', diagonal: 32, resolution: '3840x2160', aspectRatio: '16:9' },
  { name: 'Ultrawide 34"', diagonal: 34, resolution: '3440x1440', aspectRatio: '21:9' },
  { name: 'Super Ultrawide 49"', diagonal: 49, resolution: '5120x1440', aspectRatio: '32:9' },
  { name: 'OLED 42"', diagonal: 42, resolution: '3840x2160', aspectRatio: '16:9' },
  { name: 'OLED 48"', diagonal: 48, resolution: '3840x2160', aspectRatio: '16:9' },
  { name: 'OLED 55"', diagonal: 55, resolution: '3840x2160', aspectRatio: '16:9' },
]

const COLORS = [
  { bg: '#dc2626', border: '#ef4444', name: 'Red' },
  { bg: '#16a34a', border: '#22c55e', name: 'Green' },
  { bg: '#ca8a04', border: '#eab308', name: 'Yellow' },
  { bg: '#2563eb', border: '#3b82f6', name: 'Blue' },
  { bg: '#9333ea', border: '#a855f7', name: 'Purple' },
  { bg: '#0891b2', border: '#06b6d4', name: 'Cyan' },
]

interface MonitorConfig {
  id: string
  name: string
  diagonal: number
  resolution: string
  aspectRatio: string
  color: typeof COLORS[0]
}

// Calculate physical dimensions from diagonal and aspect ratio
function calculateDimensions(diagonal: number, aspectRatio: string) {
  const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number)
  const ratio = widthRatio / heightRatio

  // Using Pythagorean theorem: diagonal² = width² + height²
  // width = ratio * height
  // diagonal² = (ratio * height)² + height²
  // diagonal² = height² * (ratio² + 1)
  // height = diagonal / sqrt(ratio² + 1)
  const height = diagonal / Math.sqrt(ratio * ratio + 1)
  const width = height * ratio

  return { width, height }
}

// Calculate PPI from resolution and diagonal
function calculatePPI(resolution: string, diagonal: number) {
  const [resWidth, resHeight] = resolution.split('x').map(Number)
  const diagonalPixels = Math.sqrt(resWidth * resWidth + resHeight * resHeight)
  return Math.round(diagonalPixels / diagonal)
}

// Convert inches to cm
function inchesToCm(inches: number) {
  return inches * 2.54
}

function MonitorVisual({ monitors, maxWidth }: { monitors: MonitorConfig[], maxWidth: number }) {
  if (monitors.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        <div className="text-center">
          <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Add monitors to compare their sizes</p>
        </div>
      </div>
    )
  }

  // Calculate dimensions for all monitors
  const monitorsWithDimensions = monitors.map(m => ({
    ...m,
    dimensions: calculateDimensions(m.diagonal, m.aspectRatio),
    resolutionParsed: {
      width: parseInt(m.resolution.split('x')[0]),
      height: parseInt(m.resolution.split('x')[1]),
    },
  }))

  // Find the largest monitor to scale everything
  const largestWidth = Math.max(...monitorsWithDimensions.map(m => m.dimensions.width))
  const largestHeight = Math.max(...monitorsWithDimensions.map(m => m.dimensions.height))

  // Scale factor to fit in container (with padding)
  const containerWidth = maxWidth - 80
  const containerHeight = 400
  const scaleFactor = Math.min(
    containerWidth / largestWidth,
    containerHeight / largestHeight
  ) * 0.9

  // Sort by size (largest first) for proper layering
  const sortedMonitors = [...monitorsWithDimensions].sort(
    (a, b) => (b.dimensions.width * b.dimensions.height) - (a.dimensions.width * a.dimensions.height)
  )

  return (
    <div className="relative w-full h-[450px] flex items-center justify-center">
      <div className="relative" style={{
        width: largestWidth * scaleFactor,
        height: largestHeight * scaleFactor
      }}>
        {sortedMonitors.map((monitor, index) => {
          const scaledWidth = monitor.dimensions.width * scaleFactor
          const scaledHeight = monitor.dimensions.height * scaleFactor

          return (
            <div
              key={monitor.id}
              className="absolute transition-all duration-300"
              style={{
                width: scaledWidth,
                height: scaledHeight,
                left: 0,
                top: 0,
                backgroundColor: `${monitor.color.bg}40`,
                border: `2px solid ${monitor.color.border}`,
                borderRadius: '4px',
              }}
            >
              {/* Dimension label */}
              <div
                className="absolute top-2 left-2 text-xs font-mono px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: monitor.color.bg,
                  color: 'white',
                }}
              >
                {monitor.dimensions.width.toFixed(1)}&quot; × {monitor.dimensions.height.toFixed(1)}&quot; ({monitor.resolutionParsed.width}px)
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-6 bg-zinc-900/90 px-4 py-2 rounded-lg">
        {monitors.map((monitor) => (
          <div key={monitor.id} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: monitor.color.border }}
            />
            <span className="text-sm text-zinc-300">{monitor.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SpecBar({ value, max, color }: { value: number, max: number, color: string }) {
  const percentage = (value / max) * 100
  return (
    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  )
}

function SpecificationsTable({ monitors }: { monitors: MonitorConfig[] }) {
  if (monitors.length === 0) return null

  const monitorsWithSpecs = monitors.map(m => {
    const dimensions = calculateDimensions(m.diagonal, m.aspectRatio)
    const [resWidth, resHeight] = m.resolution.split('x').map(Number)
    const ppi = calculatePPI(m.resolution, m.diagonal)

    return {
      ...m,
      dimensions,
      ppi,
      widthCm: inchesToCm(dimensions.width),
      heightCm: inchesToCm(dimensions.height),
      resWidth,
      resHeight,
    }
  })

  // Calculate max values for bars
  const maxPPI = Math.max(...monitorsWithSpecs.map(m => m.ppi))
  const maxWidth = Math.max(...monitorsWithSpecs.map(m => m.dimensions.width))
  const maxHeight = Math.max(...monitorsWithSpecs.map(m => m.dimensions.height))

  const specs = [
    {
      label: 'Diagonal',
      icon: '📐',
      getValue: (m: typeof monitorsWithSpecs[0]) => `${m.diagonal}"`,
      getBarValue: (m: typeof monitorsWithSpecs[0]) => m.diagonal,
      maxValue: Math.max(...monitorsWithSpecs.map(m => m.diagonal)),
    },
    {
      label: 'Resolution',
      icon: '🖥️',
      getValue: (m: typeof monitorsWithSpecs[0]) => m.resolution,
      getBarValue: null,
      maxValue: 0,
    },
    {
      label: 'Aspect',
      icon: '⬜',
      getValue: (m: typeof monitorsWithSpecs[0]) => m.aspectRatio,
      getBarValue: null,
      maxValue: 0,
    },
    {
      label: 'Density',
      icon: '🔲',
      getValue: (m: typeof monitorsWithSpecs[0]) => `${m.ppi} PPI`,
      getBarValue: (m: typeof monitorsWithSpecs[0]) => m.ppi,
      maxValue: maxPPI,
    },
    {
      label: 'Width',
      icon: '↔️',
      getValue: (m: typeof monitorsWithSpecs[0]) => (
        <div>
          <span className="font-semibold">{m.dimensions.width.toFixed(1)}&quot;</span>
          <span className="text-zinc-500 ml-2 text-sm">{m.widthCm.toFixed(1)} cm</span>
        </div>
      ),
      getBarValue: (m: typeof monitorsWithSpecs[0]) => m.dimensions.width,
      maxValue: maxWidth,
    },
    {
      label: 'Height',
      icon: '↕️',
      getValue: (m: typeof monitorsWithSpecs[0]) => (
        <div>
          <span className="font-semibold">{m.dimensions.height.toFixed(1)}&quot;</span>
          <span className="text-zinc-500 ml-2 text-sm">{m.heightCm.toFixed(1)} cm</span>
        </div>
      ),
      getBarValue: (m: typeof monitorsWithSpecs[0]) => m.dimensions.height,
      maxValue: maxHeight,
    },
  ]

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-5 bg-cyan-500 rounded-full" />
          Specifications
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-3 px-4 text-left text-zinc-400 font-medium w-32">Metric</th>
              {monitors.map((monitor) => (
                <th key={monitor.id} className="py-3 px-4 text-left min-w-[160px]">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: monitor.color.bg }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: monitor.color.border }}
                    />
                    {monitor.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specs.map((spec) => (
              <tr key={spec.label} className="border-b border-zinc-800 last:border-b-0">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span>{spec.icon}</span>
                    <span className="font-medium">{spec.label}</span>
                  </div>
                </td>
                {monitorsWithSpecs.map((monitor) => (
                  <td key={monitor.id} className="py-4 px-4">
                    <div className="text-white">
                      {typeof spec.getValue(monitor) === 'string'
                        ? spec.getValue(monitor)
                        : spec.getValue(monitor)
                      }
                    </div>
                    {spec.getBarValue && (
                      <SpecBar
                        value={spec.getBarValue(monitor)}
                        max={spec.maxValue}
                        color={monitor.color.border}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function SizeComparePage() {
  const [monitors, setMonitors] = useState<MonitorConfig[]>([])
  const [showPresets, setShowPresets] = useState(false)

  const addMonitor = (preset: typeof MONITOR_PRESETS[0]) => {
    if (monitors.length >= 6) return

    const newMonitor: MonitorConfig = {
      id: `${Date.now()}-${Math.random()}`,
      name: preset.name,
      diagonal: preset.diagonal,
      resolution: preset.resolution,
      aspectRatio: preset.aspectRatio,
      color: COLORS[monitors.length % COLORS.length],
    }

    setMonitors([...monitors, newMonitor])
    setShowPresets(false)
  }

  const removeMonitor = (id: string) => {
    setMonitors(monitors.filter(m => m.id !== id))
  }

  const clearAll = () => {
    setMonitors([])
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/monitors"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-cyan-400">
                  Monitor<span className="text-white">SizeCompare</span>
                </h1>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">
                  Size Comparison Tool
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  onClick={() => setShowPresets(!showPresets)}
                  disabled={monitors.length >= 6}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Monitor
                </Button>

                {showPresets && (
                  <div className="absolute top-full mt-2 right-0 w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                    {MONITOR_PRESETS.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => addMonitor(preset)}
                        className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors border-b border-zinc-800 last:border-b-0"
                      >
                        <div className="text-white font-medium">{preset.name}</div>
                        <div className="text-xs text-zinc-500">
                          {preset.resolution} • {preset.aspectRatio}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={clearAll}
                variant="ghost"
                disabled={monitors.length === 0}
                className="text-zinc-400 hover:text-white"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Selected monitors bar */}
      {monitors.length > 0 && (
        <div className="bg-zinc-900/50 border-b border-zinc-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-3 overflow-x-auto">
              {monitors.map((monitor) => (
                <div
                  key={monitor.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0"
                  style={{ backgroundColor: `${monitor.color.bg}30`, border: `1px solid ${monitor.color.border}` }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: monitor.color.border }}
                  />
                  <span className="text-sm text-white">{monitor.name}</span>
                  <button
                    onClick={() => removeMonitor(monitor.id)}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visual comparison */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <MonitorVisual monitors={monitors} maxWidth={1200} />
          </div>
        </div>
      </section>

      {/* Specifications table */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <SpecificationsTable monitors={monitors} />
        </div>
      </section>
    </main>
  )
}
