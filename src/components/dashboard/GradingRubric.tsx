import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface RubricLevel {
  level: number;
  description: string;
  points: number;
}

interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  levels: RubricLevel[];
}

interface GradingRubricProps {
  rubricName?: string;
  onSave?: (rubric: { name: string; criteria: RubricCriterion[] }) => void;
}

export default function GradingRubric({ rubricName = 'New Rubric', onSave }: GradingRubricProps) {
  const [name, setName] = useState(rubricName);
  const [criteria, setCriteria] = useState<RubricCriterion[]>([
    {
      id: '1',
      name: 'Content Quality',
      description: 'Accuracy and depth of content',
      maxPoints: 25,
      levels: [
        { level: 4, description: 'Excellent', points: 25 },
        { level: 3, description: 'Good', points: 20 },
        { level: 2, description: 'Fair', points: 15 },
        { level: 1, description: 'Poor', points: 0 }
      ]
    }
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCriterion, setNewCriterion] = useState<Partial<RubricCriterion>>({
    name: '',
    description: '',
    maxPoints: 25,
    levels: [
      { level: 4, description: 'Excellent', points: 25 },
      { level: 3, description: 'Good', points: 20 },
      { level: 2, description: 'Fair', points: 15 },
      { level: 1, description: 'Poor', points: 0 }
    ]
  });

  const totalPoints = criteria.reduce((sum, c) => sum + c.maxPoints, 0);

  const handleAddCriterion = () => {
    if (!newCriterion.name?.trim()) return;

    const criterion: RubricCriterion = {
      id: Date.now().toString(),
      name: newCriterion.name || '',
      description: newCriterion.description || '',
      maxPoints: newCriterion.maxPoints || 25,
      levels: newCriterion.levels || []
    };

    setCriteria([...criteria, criterion]);
    setNewCriterion({
      name: '',
      description: '',
      maxPoints: 25,
      levels: [
        { level: 4, description: 'Excellent', points: 25 },
        { level: 3, description: 'Good', points: 20 },
        { level: 2, description: 'Fair', points: 15 },
        { level: 1, description: 'Poor', points: 0 }
      ]
    });
  };

  const handleDeleteCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleUpdateCriterion = (id: string, updates: Partial<RubricCriterion>) => {
    setCriteria(criteria.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const handleSave = () => {
    onSave?.({ name, criteria });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm mb-2 block">Rubric Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter rubric name..."
            className="bg-secondary-foreground/10 border-primary/20 text-white placeholder:text-gray-500"
          />
        </div>

        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-400 text-sm">Total Points</div>
              <div className="text-3xl font-bold text-primary">{totalPoints}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Criteria Count</div>
              <div className="text-3xl font-bold text-blue-400">{criteria.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Criteria List */}
      <div className="space-y-4">
        <h3 className="text-xl font-heading font-bold text-white">Criteria</h3>

        {criteria.map((criterion) => (
          <div
            key={criterion.id}
            className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4 space-y-3"
          >
            {editingId === criterion.id ? (
              <div className="space-y-3">
                <Input
                  value={criterion.name}
                  onChange={(e) =>
                    handleUpdateCriterion(criterion.id, { name: e.target.value })
                  }
                  placeholder="Criterion name..."
                  className="bg-primary-foreground border-primary/20 text-white"
                />
                <textarea
                  value={criterion.description}
                  onChange={(e) =>
                    handleUpdateCriterion(criterion.id, { description: e.target.value })
                  }
                  placeholder="Criterion description..."
                  rows={2}
                  className="w-full px-3 py-2 bg-primary-foreground border border-primary/20 text-white rounded-md placeholder:text-gray-500"
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={criterion.maxPoints}
                    onChange={(e) =>
                      handleUpdateCriterion(criterion.id, {
                        maxPoints: parseInt(e.target.value) || 0
                      })
                    }
                    placeholder="Max points..."
                    className="bg-primary-foreground border-primary/20 text-white"
                  />
                  <Button
                    onClick={() => setEditingId(null)}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-white font-semibold">{criterion.name}</div>
                    <div className="text-gray-400 text-sm">{criterion.description}</div>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-0">
                    {criterion.maxPoints} pts
                  </Badge>
                </div>

                {/* Levels */}
                <div className="mt-3 space-y-2">
                  {criterion.levels.map((level) => (
                    <div
                      key={level.level}
                      className="flex items-center justify-between text-sm bg-primary-foreground rounded px-3 py-2"
                    >
                      <div>
                        <span className="text-gray-400">Level {level.level}:</span>
                        <span className="text-white ml-2">{level.description}</span>
                      </div>
                      <span className="text-primary font-semibold">{level.points} pts</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={() => setEditingId(criterion.id)}
                    variant="outline"
                    size="sm"
                    className="border-primary/30 text-gray-300 hover:bg-primary/10"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteCriterion(criterion.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Criterion */}
      <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4 space-y-3">
        <h4 className="text-white font-semibold">Add New Criterion</h4>
        <Input
          value={newCriterion.name || ''}
          onChange={(e) => setNewCriterion({ ...newCriterion, name: e.target.value })}
          placeholder="Criterion name..."
          className="bg-primary-foreground border-primary/20 text-white placeholder:text-gray-500"
        />
        <textarea
          value={newCriterion.description || ''}
          onChange={(e) => setNewCriterion({ ...newCriterion, description: e.target.value })}
          placeholder="Criterion description..."
          rows={2}
          className="w-full px-3 py-2 bg-primary-foreground border border-primary/20 text-white rounded-md placeholder:text-gray-500"
        />
        <Input
          type="number"
          value={newCriterion.maxPoints || 25}
          onChange={(e) => setNewCriterion({ ...newCriterion, maxPoints: parseInt(e.target.value) || 0 })}
          placeholder="Max points..."
          className="bg-primary-foreground border-primary/20 text-white placeholder:text-gray-500"
        />
        <Button
          onClick={handleAddCriterion}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Criterion
        </Button>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Rubric
      </Button>
    </div>
  );
}
