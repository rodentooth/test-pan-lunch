'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"

type FilterStatus = 'all' | 'active' | 'completed'

interface FilterTabsProps {
  allCount: number
  activeCount: number
  completedCount: number
}

export function FilterTabs({ allCount, activeCount, completedCount }: FilterTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentFilter = (searchParams.get('filter') as FilterStatus) || 'all'

  const handleFilterChange = (filter: FilterStatus) => {
    const params = new URLSearchParams(searchParams.toString())
    if (filter === 'all') {
      params.delete('filter')
    } else {
      params.set('filter', filter)
    }
    const queryString = params.toString()
    const url = queryString ? `/?${queryString}` : '/'
    router.push(url)
    router.refresh() // Force refresh to ensure server component re-renders
  }

  const filterOptions = [
    { key: 'all' as const, label: 'All', count: allCount },
    { key: 'active' as const, label: 'Active', count: activeCount },
    { key: 'completed' as const, label: 'Completed', count: completedCount },
  ]

  return (
    <div className="flex space-x-1 mb-4" data-testid="filter-tabs">
      {filterOptions.map(({ key, label, count }) => (
        <Button
          key={key}
          variant={currentFilter === key ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange(key)}
          data-testid={`filter-${key}`}
          className="flex items-center gap-1"
        >
          {label}
          <span className="bg-background text-foreground px-1.5 py-0.5 rounded-full text-xs">
            {count}
          </span>
        </Button>
      ))}
    </div>
  )
}