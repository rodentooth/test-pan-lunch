import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { tasksDb } from "@/lib/db"
import { createTask, toggleTaskComplete } from "./actions"

// Force dynamic rendering - we need database access
export const dynamic = 'force-dynamic'

export default async function Home() {
  const tasks = await tasksDb.getAll()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
          Task Manager
        </h1>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>
                Create a new task to add to your list.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createTask} className="space-y-4">
                <div className="flex space-x-2">
                  <Input 
                    name="title"
                    placeholder="Enter task title..." 
                    required
                    className="flex-1"
                  />
                  <Button type="submit" data-testid="add-task-button">Add Task</Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    name="priority" 
                    className="px-3 py-2 border rounded-md"
                    defaultValue="medium"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <Input 
                    name="category"
                    placeholder="Category (optional)"
                  />
                </div>
                <Input 
                  name="description"
                  placeholder="Description (optional)"
                />
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks ({tasks.length})</CardTitle>
              <CardDescription>
                Manage your tasks below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No tasks yet. Add one above to get started!
                </p>
              ) : (
                <div className="space-y-3" data-testid="tasks-list">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-start space-x-3 p-3 border rounded-lg"
                      data-testid={`task-${task.id}`}
                    >
                      <form action={async () => {
                        'use server'
                        await toggleTaskComplete(task.id, !task.completed)
                      }}>
                        <button type="submit" className="flex items-center">
                          <Checkbox 
                            defaultChecked={task.completed}
                            disabled
                          />
                        </button>
                      </form>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {task.priority && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.priority === 'high' ? 'bg-red-100 text-red-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {task.priority}
                            </span>
                          )}
                          {task.category && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              {task.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
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