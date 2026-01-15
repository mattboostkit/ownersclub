'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, ArrowRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useComparison } from '@/contexts/comparison-context'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'

export function ComparisonBar() {
  const { monitors, removeMonitor, clearAll, maxMonitors } = useComparison()

  if (monitors.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur border-t border-zinc-800 shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Selected monitors */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <span className="text-sm text-zinc-400 shrink-0">
              Compare ({monitors.length}/{maxMonitors})
            </span>

            {monitors.map((monitor) => (
              <div
                key={monitor._id}
                className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2 shrink-0"
              >
                {monitor.mainImage && (
                  <div className="w-10 h-6 relative rounded overflow-hidden bg-zinc-700">
                    <Image
                      src={urlFor(monitor.mainImage).width(40).height(24).url()}
                      alt={monitor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="max-w-[120px]">
                  <p className="text-xs text-zinc-400 truncate">{monitor.brand?.name}</p>
                  <p className="text-sm text-white font-medium truncate">{monitor.name}</p>
                </div>
                <button
                  onClick={() => removeMonitor(monitor._id)}
                  className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: maxMonitors - monitors.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-[140px] h-[52px] border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center shrink-0"
              >
                <span className="text-xs text-zinc-600">Add monitor</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-zinc-400 hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>

            <Link href="/compare">
              <Button
                disabled={monitors.length < 2}
                className={cn(
                  'bg-cyan-500 hover:bg-cyan-400 text-black',
                  monitors.length < 2 && 'opacity-50 cursor-not-allowed'
                )}
              >
                Compare Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
