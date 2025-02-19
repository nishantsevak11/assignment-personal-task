'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Task } from '@/lib/types'
import { getTasks } from '@/lib/actions'
import TaskList from '@/components/task-list'
import TaskDialog from '@/components/task-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function TasksPage() {
  const { data: session, status } = useSession()
  const queryClient = useQueryClient()

  const { data: tasks = [], isLoading: isLoadingTasks, refetch } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: getTasks,
    enabled: status === 'authenticated',
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache the data
  })

  if (status === 'loading' || isLoadingTasks) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    redirect('/login')
  }

  const handleTaskUpdate = async () => {
    await refetch() // Force a fresh fetch of tasks
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <TaskDialog onUpdate={handleTaskUpdate}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </TaskDialog>
      </div>

      <TaskList tasks={tasks} onUpdate={handleTaskUpdate} />
    </div>
  )
}