'use client'

import { CompareButton } from './compare-button'
import { CompareMonitor } from '@/contexts/comparison-context'

interface DetailCompareButtonProps {
  monitor: CompareMonitor
}

export function DetailCompareButton({ monitor }: DetailCompareButtonProps) {
  return <CompareButton monitor={monitor} variant="detail" />
}
