'use client'

import { useComparison, CompareMonitor } from '@/contexts/comparison-context'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import { X, ArrowLeft, Plus, Check, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'

const COLORS = ['#00e0ff', '#ff6b6b', '#feca57', '#48dbfb']

function EmptyState() {
  return (
    <div className="bg-black">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-zinc-900 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-zinc-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">No monitors to compare</h1>
          <p className="text-zinc-400 mb-8">
            Add at least 2 monitors to your comparison list to see them side by side.
          </p>
          <Link href="/monitors">
            <Button className="bg-cyan-500 hover:bg-cyan-400 text-black">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse Monitors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function ComparisonChart({
  title,
  data,
  unit,
  higherIsBetter = true,
}: {
  title: string
  data: { name: string; value: number; color: string }[]
  unit: string
  higherIsBetter?: boolean
}) {
  const validData = data.filter((d) => d.value > 0)
  if (validData.length === 0) return null

  const maxValue = Math.max(...validData.map((d) => d.value))
  const roundedMax = Math.ceil(maxValue * 1.1)
  const bestValue = higherIsBetter
    ? Math.max(...validData.map((d) => d.value))
    : Math.min(...validData.map((d) => d.value))

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={validData} layout="vertical">
            <XAxis
              type="number"
              domain={[0, roundedMax]}
              tick={{ fill: '#a1a1aa' }}
              tickFormatter={(value) => Math.round(value).toString()}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#a1a1aa' }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#ffffff' }}
              itemStyle={{ color: '#00e0ff' }}
              formatter={(value) => [`${value}${unit}`, title]}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {validData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value === bestValue ? '#00e0ff' : entry.color}
                  opacity={entry.value === bestValue ? 1 : 0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-zinc-500 mt-2">
        {higherIsBetter ? '↑ Higher is better' : '↓ Lower is better'}
      </p>
    </div>
  )
}

function ColourGamutRadar({ monitors }: { monitors: CompareMonitor[] }) {
  const hasColourData = monitors.some(
    (m) => m.colourGamut?.srgb || m.colourGamut?.adobeRgb || m.colourGamut?.dcip3
  )

  if (!hasColourData) return null

  const data = [
    {
      subject: 'sRGB',
      ...monitors.reduce(
        (acc, m, i) => ({ ...acc, [m.name]: m.colourGamut?.srgb || 0 }),
        {}
      ),
    },
    {
      subject: 'Adobe RGB',
      ...monitors.reduce(
        (acc, m, i) => ({ ...acc, [m.name]: m.colourGamut?.adobeRgb || 0 }),
        {}
      ),
    },
    {
      subject: 'DCI-P3',
      ...monitors.reduce(
        (acc, m, i) => ({ ...acc, [m.name]: m.colourGamut?.dcip3 || 0 }),
        {}
      ),
    },
  ]

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Colour Gamut Coverage</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#27272a" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#71717a', fontSize: 10 }}
            />
            {monitors.map((monitor, index) => (
              <Radar
                key={monitor._id}
                name={monitor.name}
                dataKey={monitor.name}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            ))}
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-zinc-300 text-sm">{value}</span>
              )}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#ffffff' }}
              itemStyle={{ color: '#00e0ff' }}
              formatter={(value) => [`${value}%`, '']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function FeatureComparisonRow({
  label,
  getValue,
  monitors,
}: {
  label: string
  getValue: (m: CompareMonitor) => string | number | boolean | undefined | null
  monitors: CompareMonitor[]
}) {
  const values = monitors.map((m) => getValue(m))
  const allSame = values.every((v) => v === values[0])

  return (
    <tr className="border-b border-zinc-800">
      <td className="py-3 pr-4 text-zinc-400 font-medium">{label}</td>
      {monitors.map((monitor, index) => {
        const value = getValue(monitor)
        let displayValue: React.ReactNode = '-'

        if (typeof value === 'boolean') {
          displayValue = value ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Minus className="w-5 h-5 text-zinc-600" />
          )
        } else if (value !== undefined && value !== null && value !== '') {
          displayValue = String(value)
        }

        return (
          <td
            key={monitor._id}
            className={`py-3 px-4 text-center ${
              !allSame && index === 0 ? 'bg-cyan-500/5' : ''
            }`}
          >
            <span className="text-white">{displayValue}</span>
          </td>
        )
      })}
    </tr>
  )
}

function ArrayFeatureRow({
  label,
  getValue,
  monitors,
}: {
  label: string
  getValue: (m: CompareMonitor) => string[] | undefined
  monitors: CompareMonitor[]
}) {
  return (
    <tr className="border-b border-zinc-800">
      <td className="py-3 pr-4 text-zinc-400 font-medium">{label}</td>
      {monitors.map((monitor) => {
        const values = getValue(monitor)
        return (
          <td key={monitor._id} className="py-3 px-4 text-center">
            {values && values.length > 0 ? (
              <div className="flex flex-wrap gap-1 justify-center">
                {values.map((v) => (
                  <span
                    key={v}
                    className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded"
                  >
                    {v}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-zinc-600">-</span>
            )}
          </td>
        )
      })}
    </tr>
  )
}

export default function ComparePage() {
  const { monitors, removeMonitor, clearAll } = useComparison()

  if (monitors.length < 2) {
    return <EmptyState />
  }

  // Prepare chart data
  const refreshRateData = monitors.map((m, i) => ({
    name: m.name.length > 15 ? m.name.substring(0, 15) + '...' : m.name,
    value: m.refreshRate,
    color: COLORS[i % COLORS.length],
  }))

  const responseTimeData = monitors
    .filter((m) => m.responseTime)
    .map((m, i) => ({
      name: m.name.length > 15 ? m.name.substring(0, 15) + '...' : m.name,
      value: m.responseTime!,
      color: COLORS[i % COLORS.length],
    }))

  const screenSizeData = monitors.map((m, i) => ({
    name: m.name.length > 15 ? m.name.substring(0, 15) + '...' : m.name,
    value: m.screenSize,
    color: COLORS[i % COLORS.length],
  }))

  const brightnessData = monitors
    .filter((m) => m.brightness)
    .map((m, i) => ({
      name: m.name.length > 15 ? m.name.substring(0, 15) + '...' : m.name,
      value: m.brightness!,
      color: COLORS[i % COLORS.length],
    }))

  const priceData = monitors
    .filter((m) => m.msrp)
    .map((m, i) => ({
      name: m.name.length > 15 ? m.name.substring(0, 15) + '...' : m.name,
      value: m.msrp!,
      color: COLORS[i % COLORS.length],
    }))

  return (
    <div className="bg-black pb-24">
      {/* Header */}
      <section className="bg-gradient-to-b from-zinc-900 to-black py-8 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/monitors"
                className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors mb-2 inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Monitors
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Compare Monitors
              </h1>
              <p className="text-zinc-400 mt-2">
                Comparing {monitors.length} monitors side by side
              </p>
            </div>
            <Button
              variant="outline"
              onClick={clearAll}
              className="text-zinc-400 hover:text-white"
            >
              Clear All
            </Button>
          </div>
        </div>
      </section>

      {/* Monitor Cards */}
      <section className="py-8 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className={`grid grid-cols-2 md:grid-cols-${monitors.length} gap-4`}>
            {monitors.map((monitor, index) => (
              <div
                key={monitor._id}
                className="relative bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
                style={{ borderTopColor: COLORS[index % COLORS.length], borderTopWidth: 3 }}
              >
                <button
                  onClick={() => removeMonitor(monitor._id)}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>

                <div className="aspect-video relative bg-zinc-800">
                  {monitor.mainImage ? (
                    <Image
                      src={urlFor(monitor.mainImage).width(400).height(225).url()}
                      alt={monitor.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {monitor.brand && (
                    <p className="text-cyan-400 text-sm font-medium">
                      {monitor.brand.name}
                    </p>
                  )}
                  <h3 className="text-white font-semibold mt-1">{monitor.name}</h3>
                  {monitor.msrp && (
                    <p className="text-2xl font-bold text-white mt-2">
                      £{monitor.msrp.toLocaleString()}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-3">
                    <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded">
                      {monitor.screenSize}&quot;
                    </span>
                    <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded">
                      {monitor.panelType}
                    </span>
                    <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded">
                      {monitor.refreshRate}Hz
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Comparisons */}
      <section className="py-8 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">Visual Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ComparisonChart
              title="Refresh Rate"
              data={refreshRateData}
              unit="Hz"
              higherIsBetter={true}
            />
            {responseTimeData.length > 0 && (
              <ComparisonChart
                title="Response Time"
                data={responseTimeData}
                unit="ms"
                higherIsBetter={false}
              />
            )}
            <ComparisonChart
              title="Screen Size"
              data={screenSizeData}
              unit='"'
              higherIsBetter={true}
            />
            {brightnessData.length > 0 && (
              <ComparisonChart
                title="Peak Brightness"
                data={brightnessData}
                unit=" nits"
                higherIsBetter={true}
              />
            )}
            {priceData.length > 0 && (
              <ComparisonChart
                title="Price"
                data={priceData}
                unit=""
                higherIsBetter={false}
              />
            )}
            <ColourGamutRadar monitors={monitors} />
          </div>
        </div>
      </section>

      {/* Detailed Specifications Table */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">Detailed Specifications</h2>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="py-4 px-4 text-left text-zinc-400 font-medium">
                    Specification
                  </th>
                  {monitors.map((monitor, index) => (
                    <th
                      key={monitor._id}
                      className="py-4 px-4 text-center"
                      style={{ minWidth: '150px' }}
                    >
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-white font-medium">{monitor.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Display */}
                <tr className="bg-zinc-800/50">
                  <td
                    colSpan={monitors.length + 1}
                    className="py-2 px-4 text-cyan-400 font-semibold text-sm uppercase tracking-wider"
                  >
                    Display
                  </td>
                </tr>
                <FeatureComparisonRow
                  label="Screen Size"
                  getValue={(m) => `${m.screenSize}"`}
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="Resolution"
                  getValue={(m) => m.resolution}
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="Panel Type"
                  getValue={(m) => m.panelType}
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="Aspect Ratio"
                  getValue={(m) => m.aspectRatio}
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="Refresh Rate"
                  getValue={(m) => `${m.refreshRate}Hz`}
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="Response Time"
                  getValue={(m) => (m.responseTime ? `${m.responseTime}ms` : null)}
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="Curved"
                  getValue={(m) => m.curved}
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="Curve Radius"
                  getValue={(m) => m.curveRadius}
                  monitors={monitors}
                />

                {/* HDR & Colour */}
                <tr className="bg-zinc-800/50">
                  <td
                    colSpan={monitors.length + 1}
                    className="py-2 px-4 text-cyan-400 font-semibold text-sm uppercase tracking-wider"
                  >
                    HDR & Colour
                  </td>
                </tr>
                <ArrayFeatureRow
                  label="HDR Support"
                  getValue={(m) => m.hdrSupport}
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="Peak Brightness"
                  getValue={(m) => (m.brightness ? `${m.brightness} nits` : null)}
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="Contrast Ratio"
                  getValue={(m) => m.contrastRatio}
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="sRGB Coverage"
                  getValue={(m) => (m.colourGamut?.srgb ? `${m.colourGamut.srgb}%` : null)}
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="Adobe RGB Coverage"
                  getValue={(m) =>
                    m.colourGamut?.adobeRgb ? `${m.colourGamut.adobeRgb}%` : null
                  }
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="DCI-P3 Coverage"
                  getValue={(m) => (m.colourGamut?.dcip3 ? `${m.colourGamut.dcip3}%` : null)}
                  monitors={monitors}
                />

                {/* Gaming */}
                <tr className="bg-zinc-800/50">
                  <td
                    colSpan={monitors.length + 1}
                    className="py-2 px-4 text-cyan-400 font-semibold text-sm uppercase tracking-wider"
                  >
                    Gaming Features
                  </td>
                </tr>
                <ArrayFeatureRow
                  label="Adaptive Sync"
                  getValue={(m) => m.adaptiveSync}
                  monitors={monitors}
                />

                {/* Connectivity */}
                <tr className="bg-zinc-800/50">
                  <td
                    colSpan={monitors.length + 1}
                    className="py-2 px-4 text-cyan-400 font-semibold text-sm uppercase tracking-wider"
                  >
                    Connectivity
                  </td>
                </tr>
                <FeatureComparisonRow
                  label="USB Hub"
                  getValue={(m) => m.usbHub}
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="Built-in Speakers"
                  getValue={(m) => m.speakers}
                  monitors={monitors}
                />

                {/* Physical */}
                <tr className="bg-zinc-800/50">
                  <td
                    colSpan={monitors.length + 1}
                    className="py-2 px-4 text-cyan-400 font-semibold text-sm uppercase tracking-wider"
                  >
                    Physical
                  </td>
                </tr>
                <ArrayFeatureRow
                  label="Stand Adjustments"
                  getValue={(m) => m.standAdjustments}
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="VESA Mount"
                  getValue={(m) => m.vesaMount}
                  monitors={monitors}
                />
                <FeatureComparisonRow
                  label="Weight"
                  getValue={(m) => (m.weight ? `${m.weight}kg` : null)}
                  monitors={monitors}
                />

                {/* Pricing */}
                <tr className="bg-zinc-800/50">
                  <td
                    colSpan={monitors.length + 1}
                    className="py-2 px-4 text-cyan-400 font-semibold text-sm uppercase tracking-wider"
                  >
                    Pricing
                  </td>
                </tr>
                <FeatureComparisonRow
                  label="MSRP"
                  getValue={(m) => (m.msrp ? `£${m.msrp.toLocaleString()}` : null)}
                  monitors={monitors}
                />
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
