'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { tasksDb, CreateTaskInput } from '@/lib/db'

export async function createTask(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as 'low' | 'medium' | 'high'
  const category = formData.get('category') as string

  if (!title || title.trim().length === 0) {
    throw new Error('Task title is required')
  }

  const taskInput: CreateTaskInput = {
    title: title.trim(),
    description: description?.trim() || undefined,
    priority: priority || 'medium',
    category: category?.trim() || undefined,
  }

  try {
    await tasksDb.create(taskInput)
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to create task:', error)
    throw new Error('Failed to create task')
  }
}

export async function toggleTaskComplete(taskId: number, completed: boolean) {
  try {
    await tasksDb.update(taskId, { completed })
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to update task:', error)
    throw new Error('Failed to update task')
  }
}

export async function editTask(formData: FormData) {
  const taskId = parseInt(formData.get('taskId') as string)
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as 'low' | 'medium' | 'high'
  const category = formData.get('category') as string

  if (!title || title.trim().length === 0) {
    throw new Error('Task title is required')
  }

  try {
    await tasksDb.update(taskId, {
      title: title.trim(),
      description: description?.trim() || undefined,
      priority: priority || 'medium',
      category: category?.trim() || undefined,
    })
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to update task:', error)
    throw new Error('Failed to update task')
  }
}

export async function toggleTask(formData: FormData) {
  const taskId = parseInt(formData.get('taskId') as string)
  const currentCompleted = formData.get('completed') === 'true'
  
  await toggleTaskComplete(taskId, !currentCompleted)
}

export async function deleteTaskAction(formData: FormData) {
  const taskId = parseInt(formData.get('taskId') as string)
  
  await deleteTask(taskId)
}

export async function deleteTask(taskId: number) {
  try {
    await tasksDb.delete(taskId)
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to delete task:', error)
    throw new Error('Failed to delete task')
  }
}