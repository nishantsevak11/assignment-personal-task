'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { createTask, deleteTask, updateTask, getProjects } from '@/lib/actions'
import { Task, Project } from '@/lib/types'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface TaskDialogProps {
  children?: React.ReactNode
  task?: Task
  onUpdate?: () => void
}

export default function TaskDialog({ children, task, onUpdate }: TaskDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>(
    task?.status || 'pending'
  )
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    task?.priority || 'medium'
  )
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
  )
  const [projectId, setProjectId] = useState<number>(task?.projectId || 0)
  const [projects, setProjects] = useState<Project[]>([])

  const resetForm = useCallback(() => {
    if (!task) {
      setTitle('')
      setDescription('')
      setStatus('pending')
      setPriority('medium')
      setDueDate('')
      if (projects.length > 0) {
        setProjectId(projects[0].id)
      }
    }
  }, [task, projects])

  useEffect(() => {
    if (open) {
      const loadProjects = async () => {
        try {
          const projectList = await getProjects()
          setProjects(projectList)
          if (!task && projectList.length > 0) {
            setProjectId(projectList[0].id)
          }
        } catch (error) {
          console.error('Error loading projects:', error)
        }
      }
      loadProjects()
    }
  }, [open, task])

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['tasks'])
      toast({
        title: 'Success',
        description: 'Task created successfully',
      })
      resetForm()
      setOpen(false)
      onUpdate?.()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      })
    }
  })

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['tasks'])
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      })
      setOpen(false)
      onUpdate?.()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      })
    }
  })

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['tasks'])
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      })
      setOpen(false)
      onUpdate?.()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      projectId
    }

    if (task) {
      updateTaskMutation.mutate({ ...taskData, id: task.id })
    } else {
      createTaskMutation.mutate(taskData)
    }
  }

  const handleDelete = () => {
    if (!task) return
    deleteTaskMutation.mutate(task.id)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) {
        resetForm()
      }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
          <DialogDescription>
            {task
              ? 'Make changes to your task here.'
              : 'Add a new task to your project.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select
              value={projectId.toString()}
              onValueChange={(value) => setProjectId(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: typeof status) => setStatus(value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value: typeof priority) => setPriority(value)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {task && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteTaskMutation.isLoading}
              >
                {deleteTaskMutation.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete Task
              </Button>
            )}
            <Button
              type="submit"
              disabled={createTaskMutation.isLoading || updateTaskMutation.isLoading || !title.trim()}
            >
              {(createTaskMutation.isLoading || updateTaskMutation.isLoading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
