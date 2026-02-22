import React, { useState, useEffect } from 'react';
import { Batches, Students } from '@/entities';
import { BatchManagementService } from '@/services/batchManagementService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Search, Users } from 'lucide-react';
import BatchManagementModal from './BatchManagementModal';

interface BatchManagementTableProps {
  onBatchCreated?: (batch: Batches) => void;
  onBatchUpdated?: (batch: Batches) => void;
  onBatchDeleted?: (batchId: string) => void;
}

export default function BatchManagementTable({
  onBatchCreated,
  onBatchUpdated,
  onBatchDeleted
}: BatchManagementTableProps) {
  const [batches, setBatches] = useState<Batches[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<Batches[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batches | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load batches
  useEffect(() => {
    loadBatches();
  }, []);

  // Filter batches
  useEffect(() => {
    let filtered = batches;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(batch => batch.batchStatus === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(batch =>
        (batch.batchName?.toLowerCase().includes(lowerQuery)) ||
        (batch.batchLevel?.toLowerCase().includes(lowerQuery)) ||
        (batch.assignedTeacherName?.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredBatches(filtered);
  }, [batches, searchQuery, selectedStatus]);

  const loadBatches = async () => {
    try {
      setIsLoading(true);
      const allBatches = await BatchManagementService.getAllBatches();
      setBatches(allBatches);
    } catch (error) {
      console.error('Error loading batches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBatch = async (batchData: any) => {
    try {
      const newBatch = await BatchManagementService.createBatch(batchData);
      setBatches([...batches, newBatch]);
      setIsModalOpen(false);
      setSelectedBatch(null);
      onBatchCreated?.(newBatch);
    } catch (error) {
      console.error('Error creating batch:', error);
    }
  };

  const handleUpdateBatch = async (batchId: string, batchData: any) => {
    try {
      const updatedBatch = await BatchManagementService.updateBatch(batchId, batchData);
      setBatches(batches.map(b => b._id === batchId ? updatedBatch : b));
      setIsModalOpen(false);
      setSelectedBatch(null);
      onBatchUpdated?.(updatedBatch);
    } catch (error) {
      console.error('Error updating batch:', error);
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;

    try {
      await BatchManagementService.deleteBatch(batchId);
      setBatches(batches.filter(b => b._id !== batchId));
      onBatchDeleted?.(batchId);
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  const handleEditBatch = (batch: Batches) => {
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-white">Batch Management</h2>
        <Button
          onClick={() => {
            setSelectedBatch(null);
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
        >
          + Create Batch
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, level, or teacher..."
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
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-primary/20 bg-secondary-foreground/5">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading batches...</div>
        ) : filteredBatches.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No batches found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20 bg-secondary-foreground/10">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Batch Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Start Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">End Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Teacher</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch, index) => (
                <tr
                  key={batch._id}
                  className={`border-b border-primary/10 ${
                    index % 2 === 0 ? 'bg-transparent' : 'bg-secondary-foreground/5'
                  } hover:bg-primary/10 transition-colors`}
                >
                  <td className="px-6 py-3 text-white font-medium">{batch.batchName}</td>
                  <td className="px-6 py-3 text-gray-300 text-sm">{batch.batchLevel}</td>
                  <td className="px-6 py-3 text-gray-300 text-sm">{formatDate(batch.startDate)}</td>
                  <td className="px-6 py-3 text-gray-300 text-sm">{formatDate(batch.endDate)}</td>
                  <td className="px-6 py-3 text-gray-300 text-sm">{batch.assignedTeacherName || '-'}</td>
                  <td className="px-6 py-3">
                    <Badge className={`${getStatusColor(batch.batchStatus)} border-0`}>
                      {batch.batchStatus || 'N/A'}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditBatch(batch)}
                        className="p-2 hover:bg-primary/20 rounded-md transition-colors"
                        title="Edit batch"
                      >
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDeleteBatch(batch._id)}
                        className="p-2 hover:bg-red-500/20 rounded-md transition-colors"
                        title="Delete batch"
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
      <BatchManagementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBatch(null);
        }}
        onSubmit={selectedBatch ? 
          (data) => handleUpdateBatch(selectedBatch._id, data) :
          (data) => handleCreateBatch(data)
        }
        batch={selectedBatch}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total Batches</div>
          <div className="text-2xl font-bold text-primary mt-1">{batches.length}</div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Active</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {batches.filter(b => b.batchStatus === 'active').length}
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Completed</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">
            {batches.filter(b => b.batchStatus === 'completed').length}
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Pending</div>
          <div className="text-2xl font-bold text-yellow-400 mt-1">
            {batches.filter(b => b.batchStatus === 'pending').length}
          </div>
        </div>
      </div>
    </div>
  );
}
