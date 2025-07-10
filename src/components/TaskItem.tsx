'use client'

import { useState } from 'react'
import { Task } from "@/lib/db"
import { toggleTask } from "@/app/actions"
import { EditTask } from "./EditTask"
import { DeleteConfirmation } from "./DeleteConfirmation"
import { Button } from "@/components/ui/button"

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (isEditing) {
    return <EditTask task={task} onCancel={() => setIsEditing(false)} />
  }

  return (
    <>
      {showDeleteConfirm && (
        <DeleteConfirmation 
          task={task} 
          onCancel={() => setShowDeleteConfirm(false)} 
        />
      )}
    <div 
      className="flex items-start space-x-3 p-3 border rounded-lg"
      data-testid={`task-${task.id}`}
    >
      <form action={toggleTask}>
        <input type="hidden" name="taskId" value={task.id} />
        <input type="hidden" name="completed" value={task.completed.toString()} />
        <button 
          type="submit" 
          className="p-1 border-0 bg-transparent hover:opacity-75 cursor-pointer rounded flex items-center justify-center"
          data-testid={`toggle-task-${task.id}`}
        >
          <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
            task.completed 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'border-gray-300 bg-white'
          }`}>
            {task.completed && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
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
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          data-testid={`edit-task-${task.id}`}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteConfirm(true)}
          data-testid={`delete-task-${task.id}`}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </div>
    </>
  )
}