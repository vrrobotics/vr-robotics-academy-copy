import { useState, useEffect } from 'react';
import { Batches } from '@/entities';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface BatchDropdownProps {
  batches: Batches[];
  selectedBatchId?: string;
  onBatchChange: (batchId: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function BatchDropdown({
  batches,
  selectedBatchId,
  onBatchChange,
  isLoading = false,
  placeholder = 'Select a batch'
}: BatchDropdownProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string>(selectedBatchId || '');

  useEffect(() => {
    if (selectedBatchId) {
      setInternalSelectedId(selectedBatchId);
    }
  }, [selectedBatchId]);

  const handleChange = (value: string) => {
    setInternalSelectedId(value);
    onBatchChange(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <LoadingSpinner />
        <span className="text-sm text-gray-400">Loading batches...</span>
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="text-sm text-gray-400">
        No batches available
      </div>
    );
  }

  return (
    <Select value={internalSelectedId} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-64 bg-gray-800 border-gray-700 text-foreground">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700">
        {batches.map((batch) => (
          <SelectItem key={batch._id} value={batch._id}>
            <div className="flex items-center gap-2">
              <span>{batch.batchName || 'Unnamed Batch'}</span>
              <span className="text-xs text-gray-400">({batch.batchLevel || 'N/A'})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
