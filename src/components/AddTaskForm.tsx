'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProcrastinationMessage } from "./ProcrastinationMessage"
import { createTask } from "@/app/actions"

interface AddTaskFormProps {
  taskCount: number
}

export function AddTaskForm({ taskCount }: AddTaskFormProps) {
  const [showProcrastination, setShowProcrastination] = useState(false)
  const [isProcrastinating, setIsProcrastinating] = useState(false)
  const [procrastinationTimeLeft, setProcrastinationTimeLeft] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)
  const pendingFormDataRef = useRef<FormData | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    
    // Show procrastination message with some randomness (70% chance after 3+ tasks)
    const shouldShowMessage = taskCount >= 3 && Math.random() < 0.7
    
    if (shouldShowMessage && !showProcrastination && !isProcrastinating) {
      pendingFormDataRef.current = formData
      setShowProcrastination(true)
      return
    }

    // If we're here, either procrastination was dismissed or we're bypassing it
    try {
      await createTask(formData)
      
      // Reset form
      formRef.current?.reset()
      setShowProcrastination(false)
      pendingFormDataRef.current = null
      
      // Trigger a page refresh to show the new task
      window.location.reload()
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleProcrastinate = () => {
    setShowProcrastination(false)
    setIsProcrastinating(true)
    setProcrastinationTimeLeft(300) // 5 minutes in seconds

    // Start countdown
    const interval = setInterval(() => {
      setProcrastinationTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsProcrastinating(false)
          // Auto-submit the task after procrastination period
          if (pendingFormDataRef.current) {
            createTask(pendingFormDataRef.current).then(() => {
              formRef.current?.reset()
              pendingFormDataRef.current = null
              window.location.reload()
            })
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleDismissProcrastination = async () => {
    setShowProcrastination(false)
    
    // Submit the pending form data
    if (pendingFormDataRef.current) {
      try {
        await createTask(pendingFormDataRef.current)
        formRef.current?.reset()
        pendingFormDataRef.current = null
        window.location.reload()
      } catch (error) {
        console.error('Failed to create task:', error)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
          <CardDescription>
            Create a new task to add to your list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-2">
              <Input 
                name="title"
                placeholder="Enter task title..." 
                required
                className="flex-1"
                disabled={isProcrastinating}
              />
              <Button 
                type="submit" 
                data-testid="add-task-button"
                disabled={isProcrastinating}
              >
                {isProcrastinating ? `Wait ${formatTime(procrastinationTimeLeft)}` : 'Add Task'}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select 
                name="priority" 
                className="px-3 py-2 border rounded-md"
                defaultValue="medium"
                disabled={isProcrastinating}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <Input 
                name="category"
                placeholder="Category (optional)"
                disabled={isProcrastinating}
              />
            </div>
            <Input 
              name="description"
              placeholder="Description (optional)"
              disabled={isProcrastinating}
            />
          </form>

          {isProcrastinating && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-sm text-center">
                🧘‍♂️ Procrastination mode active. Your task will be created in {formatTime(procrastinationTimeLeft)}
              </p>
              <p className="text-blue-600 text-xs text-center mt-1">
                Perfect time for that coffee break you&apos;ve been planning!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {showProcrastination && (
        <div className="mb-6">
          <ProcrastinationMessage
            onDismiss={handleDismissProcrastination}
            onProcrastinate={handleProcrastinate}
            taskCount={taskCount}
          />
        </div>
      )}
    </>
  )
}