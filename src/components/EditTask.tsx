'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { editTask } from "@/app/actions"
import { Task } from "@/lib/db"

interface EditTaskProps {
  task: Task
  onCancel: () => void
}

export function EditTask({ task, onCancel }: EditTaskProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await editTask(formData)
      onCancel() // Close edit mode after successful update
    } catch (error) {
      console.error('Failed to update task:', error)
      // In a real app, you'd show an error message to the user
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <h4 className="font-medium text-sm text-gray-700">Edit Task</h4>
      <form action={handleSubmit} className="space-y-3">
        <input type="hidden" name="taskId" value={task.id} />
        
        <div>
          <Input 
            name="title"
            defaultValue={task.title}
            placeholder="Enter task title..." 
            required
            className="w-full"
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Input 
            name="description"
            defaultValue={task.description || ''}
            placeholder="Description (optional)"
            className="w-full"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <select 
            name="priority" 
            className="px-3 py-2 border rounded-md"
            defaultValue={task.priority}
            disabled={isSubmitting}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          
          <Input 
            name="category"
            defaultValue={task.category || ''}
            placeholder="Category (optional)"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}