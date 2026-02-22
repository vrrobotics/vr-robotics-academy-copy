import React, { useState, useEffect } from 'react';
import { Users } from '@/entities';
import { UserManagementService } from '@/services/userManagementService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Search, Download } from 'lucide-react';
import UserManagementModal from './UserManagementModal';

interface UserManagementTableProps {
  onUserCreated?: (user: Users) => void;
  onUserUpdated?: (user: Users) => void;
  onUserDeleted?: (userId: string) => void;
}

export default function UserManagementTable({
  onUserCreated,
  onUserUpdated,
  onUserDeleted
}: UserManagementTableProps) {
  const [users, setUsers] = useState<Users[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Users[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users
  useEffect(() => {
    let filtered = users;

    // Filter by role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        (user.fullName?.toLowerCase().includes(lowerQuery)) ||
        (user.email?.toLowerCase().includes(lowerQuery)) ||
        (user.department?.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, selectedRole]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const allUsers = await UserManagementService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      const newUser = await UserManagementService.createUser(userData);
      setUsers([...users, newUser]);
      setIsModalOpen(false);
      setSelectedUser(null);
      onUserCreated?.(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (userId: string, userData: any) => {
    try {
      const updatedUser = await UserManagementService.updateUser(userId, userData);
      setUsers(users.map(u => u._id === userId ? updatedUser : u));
      setIsModalOpen(false);
      setSelectedUser(null);
      onUserUpdated?.(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await UserManagementService.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      onUserDeleted?.(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (user: Users) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleExportCSV = async () => {
    try {
      const csv = await UserManagementService.exportUsersToCSV(filteredUsers);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400';
      case 'teacher':
        return 'bg-blue-500/20 text-blue-400';
      case 'student':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-white">User Management</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white flex-1 sm:flex-none"
          >
            + Create User
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary-foreground/10 border-primary/20 text-white placeholder:text-gray-500"
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 bg-secondary-foreground/10 border border-primary/20 text-white rounded-md"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-primary/20 bg-secondary-foreground/5">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No users found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20 bg-secondary-foreground/10">
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(new Set(filteredUsers.map(u => u._id)));
                      } else {
                        setSelectedUsers(new Set());
                      }
                    }}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Join Date</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={`border-b border-primary/10 ${
                    index % 2 === 0 ? 'bg-transparent' : 'bg-secondary-foreground/5'
                  } hover:bg-primary/10 transition-colors`}
                >
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-3 text-white font-medium">{user.fullName}</td>
                  <td className="px-6 py-3 text-gray-300 text-sm">{user.email}</td>
                  <td className="px-6 py-3">
                    <Badge className={`${getRoleColor(user.role)} border-0`}>
                      {user.role || 'N/A'}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-gray-300 text-sm">{user.department || '-'}</td>
                  <td className="px-6 py-3 text-gray-300 text-sm">
                    {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 hover:bg-primary/20 rounded-md transition-colors"
                        title="Edit user"
                      >
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 hover:bg-red-500/20 rounded-md transition-colors"
                        title="Delete user"
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
      <UserManagementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={selectedUser ? 
          (data) => handleUpdateUser(selectedUser._id, data) :
          (data) => handleCreateUser(data)
        }
        user={selectedUser}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total Users</div>
          <div className="text-2xl font-bold text-primary mt-1">{users.length}</div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Admins</div>
          <div className="text-2xl font-bold text-red-400 mt-1">
            {users.filter(u => u.role === 'admin').length}
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Teachers</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">
            {users.filter(u => u.role === 'teacher').length}
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Students</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {users.filter(u => u.role === 'student').length}
          </div>
        </div>
      </div>
    </div>
  );
}
