'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { deleteTaskAction } from "@/app/actions"
import { Task } from "@/lib/db"

interface DeleteConfirmationProps {
  task: Task
  onCancel: () => void
}

export function DeleteConfirmation({ task, onCancel }: DeleteConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (formData: FormData) => {
    setIsDeleting(true)
    try {
      await deleteTaskAction(formData)
      // The task will be removed from the list via revalidatePath
      // No need to call onCancel since the component will unmount
    } catch (error) {
      console.error('Failed to delete task:', error)
      setIsDeleting(false)
      // In a real app, you'd show an error message to the user
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Delete Task
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete &quot;<strong>{task.title}</strong>&quot;? 
          This action cannot be undone.
        </p>
        
        <div className="flex gap-3 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          
          <form action={handleDelete} className="inline">
            <input type="hidden" name="taskId" value={task.id} />
            <Button 
              type="submit"
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}