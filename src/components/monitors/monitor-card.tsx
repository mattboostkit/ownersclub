'use client'

import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { CompareButton } from './compare-button'
import { CompareMonitor } from '@/contexts/comparison-context'

interface MonitorCardProps {
  monitor: CompareMonitor & {
    featured?: boolean
  }
}

export function MonitorCard({ monitor }: MonitorCardProps) {
  return (
    <div className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-cyan-500/50 transition-all duration-300">
      <CompareButton monitor={monitor} variant="card" />

      <Link href={`/monitors/${monitor.slug}`}>
        <div className="aspect-video relative bg-zinc-800">
          {monitor.mainImage ? (
            <Image
              src={urlFor(monitor.mainImage).width(600).height(340).url()}
              alt={monitor.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
              <svg
                className="w-16 h-16"
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
          {monitor.featured && (
            <span className="absolute top-3 left-3 bg-cyan-500 text-black text-xs font-semibold px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>
        <div className="p-4">
          {monitor.brand && (
            <p className="text-cyan-400 text-sm font-medium mb-1">
              {monitor.brand.name}
            </p>
          )}
          <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
            {monitor.name}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded">
              {monitor.screenSize}&quot;
            </span>
            <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded">
              {monitor.resolution}
            </span>
            <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded">
              {monitor.panelType}
            </span>
            <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded">
              {monitor.refreshRate}Hz
            </span>
          </div>
          {monitor.msrp && (
            <p className="text-xl font-bold text-white">
              £{monitor.msrp.toLocaleString()}
            </p>
          )}
        </div>
      </Link>
    </div>
  )
}
