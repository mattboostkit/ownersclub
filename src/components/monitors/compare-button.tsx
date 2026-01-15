'use client'

import { Plus, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useComparison, CompareMonitor } from '@/contexts/comparison-context'
import { cn } from '@/lib/utils'

interface CompareButtonProps {
  monitor: CompareMonitor
  variant?: 'default' | 'card' | 'detail'
  className?: string
}

export function CompareButton({ monitor, variant = 'default', className }: CompareButtonProps) {
  const { addMonitor, removeMonitor, isInComparison, monitors, maxMonitors } = useComparison()

  const inComparison = isInComparison(monitor._id)
  const isFull = monitors.length >= maxMonitors

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inComparison) {
      removeMonitor(monitor._id)
    } else if (!isFull) {
      addMonitor(monitor)
    }
  }

  if (variant === 'card') {
    return (
      <button
        onClick={handleClick}
        disabled={!inComparison && isFull}
        className={cn(
          'absolute top-3 right-3 z-10 p-2 rounded-lg transition-all duration-200',
          inComparison
            ? 'bg-cyan-500 text-black hover:bg-cyan-400'
            : isFull
              ? 'bg-zinc-800/80 text-zinc-500 cursor-not-allowed'
              : 'bg-zinc-800/80 text-white hover:bg-zinc-700',
          className
        )}
        title={inComparison ? 'Remove from comparison' : isFull ? 'Comparison full' : 'Add to comparison'}
      >
        {inComparison ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    )
  }

  if (variant === 'detail') {
    return (
      <Button
        onClick={handleClick}
        disabled={!inComparison && isFull}
        variant={inComparison ? 'default' : 'outline'}
        className={cn(
          inComparison && 'bg-cyan-500 hover:bg-cyan-400 text-black',
          className
        )}
      >
        {inComparison ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            In Comparison
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Add to Compare
          </>
        )}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      disabled={!inComparison && isFull}
      variant={inComparison ? 'default' : 'outline'}
      size="sm"
      className={cn(
        inComparison && 'bg-cyan-500 hover:bg-cyan-400 text-black',
        className
      )}
    >
      {inComparison ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
    </Button>
  )
}
