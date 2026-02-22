import React, { useState, useEffect } from 'react';
import { Tasks } from '@/entities';
import { TaskManagementService } from '@/services/taskManagementService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Search, CheckCircle2 } from 'lucide-react';
import TaskManagementModal from './TaskManagementModal';

interface TaskTableProps {
  onTaskCreated?: (task: Tasks) => void;
  onTaskUpdated?: (task: Tasks) => void;
  onTaskDeleted?: (taskId: string) => void;
}

export default function TaskTable({
  onTaskCreated,
  onTaskUpdated,
  onTaskDeleted
}: TaskTableProps) {
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Tasks[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Tasks | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks
  useEffect(() => {
    loadTasks();
  }, []);

  // Filter tasks
  useEffect(() => {
    let filtered = tasks;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(task => task.status === selectedStatus);
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        (task.title?.toLowerCase().includes(lowerQuery)) ||
        (task.description?.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, selectedStatus, selectedPriority]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const allTasks = await TaskManagementService.getAllTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const newTask = await TaskManagementService.createTask(taskData);
      setTasks([...tasks, newTask]);
      setIsModalOpen(false);
      setSelectedTask(null);
      onTaskCreated?.(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, taskData: any) => {
    try {
      const updatedTask = await TaskManagementService.updateTask(taskId, taskData);
      setTasks(tasks.map(t => t._id === taskId ? updatedTask : t));
      setIsModalOpen(false);
      setSelectedTask(null);
      onTaskUpdated?.(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const completedTask = await TaskManagementService.completeTask(taskId);
      setTasks(tasks.map(t => t._id === taskId ? completedTask : t));
      onTaskUpdated?.(completedTask);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await TaskManagementService.deleteTask(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
      onTaskDeleted?.(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task: Tasks) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-orange-500/20 text-orange-400';
      case 'low':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const isOverdue = (dueDate?: Date | string, status?: string) => {
    if (!dueDate || status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-white">Tasks</h2>
        <Button
          onClick={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
        >
          + Create Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary-foreground/10 border-primary/20 text-white placeholder:text-gray-500"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 bg-secondary-foreground/10 border border-primary/20 text-white rounded-md"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="px-4 py-2 bg-secondary-foreground/10 border border-primary/20 text-white rounded-md"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-primary/20 bg-secondary-foreground/5">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No tasks found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20 bg-secondary-foreground/10">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Due Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Priority</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <tr
                  key={task._id}
                  className={`border-b border-primary/10 ${
                    index % 2 === 0 ? 'bg-transparent' : 'bg-secondary-foreground/5'
                  } hover:bg-primary/10 transition-colors`}
                >
                  <td className="px-6 py-3">
                    <div className="text-white font-medium">{task.title}</div>
                    <div className="text-gray-400 text-sm truncate">{task.description}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-gray-300 text-sm">{formatDate(task.dueDate)}</div>
                    {isOverdue(task.dueDate, task.status) && (
                      <Badge className="bg-red-500/20 text-red-400 border-0 mt-1">Overdue</Badge>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <Badge className={`${getPriorityColor(task.priority)} border-0`}>
                      {task.priority || 'N/A'}
                    </Badge>
                  </td>
                  <td className="px-6 py-3">
                    <Badge className={`${getStatusColor(task.status)} border-0`}>
                      {task.status || 'N/A'}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      {task.status !== 'completed' && (
                        <button
                          onClick={() => handleCompleteTask(task._id)}
                          className="p-2 hover:bg-green-500/20 rounded-md transition-colors"
                          title="Complete task"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-2 hover:bg-primary/20 rounded-md transition-colors"
                        title="Edit task"
                      >
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="p-2 hover:bg-red-500/20 rounded-md transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <TaskManagementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={selectedTask ? 
          (data) => handleUpdateTask(selectedTask._id, data) :
          (data) => handleCreateTask(data)
        }
        task={selectedTask}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total Tasks</div>
          <div className="text-2xl font-bold text-primary mt-1">{tasks.length}</div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Completed</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {tasks.filter(t => t.status === 'completed').length}
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">In Progress</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">
            {tasks.filter(t => t.status === 'in-progress').length}
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Overdue</div>
          <div className="text-2xl font-bold text-red-400 mt-1">
            {tasks.filter(t => isOverdue(t.dueDate, t.status)).length}
          </div>
        </div>
      </div>
    </div>
  );
}
