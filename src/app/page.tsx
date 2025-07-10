import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { tasksDb } from "@/lib/db"
import { TaskItem } from "@/components/TaskItem"
import { FilterTabs } from "@/components/FilterTabs"
import { AddTaskForm } from "@/components/AddTaskForm"

// Force dynamic rendering - we need database access
export const dynamic = 'force-dynamic'

type FilterStatus = 'all' | 'active' | 'completed'

interface SearchParams {
  filter?: FilterStatus
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const allTasks = await tasksDb.getAll()
  const resolvedSearchParams = await searchParams
  const filter = resolvedSearchParams.filter || 'all'
  
  // Filter tasks based on current filter
  const filteredTasks = filter === 'all' 
    ? allTasks
    : filter === 'active'
      ? allTasks.filter(task => !task.completed)
      : allTasks.filter(task => task.completed)

  // Calculate counts for filter tabs
  const allCount = allTasks.length
  const activeCount = allTasks.filter(task => !task.completed).length
  const completedCount = allTasks.filter(task => task.completed).length

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
          Task Manager
        </h1>
        <div className="max-w-2xl mx-auto space-y-6">
          <AddTaskForm taskCount={allCount} />

          <Card>
            <CardHeader>
              <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
              <CardDescription>
                Manage your tasks below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FilterTabs 
                allCount={allCount}
                activeCount={activeCount}
                completedCount={completedCount}
              />
              {filteredTasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8" data-testid="empty-tasks-message">
                  {allCount === 0 
                    ? "No tasks yet. Add one above to get started!" 
                    : `No ${filter} tasks found.`
                  }
                </p>
              ) : (
                <div className="space-y-3" data-testid="tasks-list">
                  {filteredTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}