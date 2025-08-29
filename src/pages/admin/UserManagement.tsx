import React, { useState, useEffect } from 'react';
import { 
  registerUser, 
  getAllUsersAdmin, 
  updateUserAdmin, 
  deleteUserAdmin 
} from '../../services/UserService';

interface User {
    userId: number;
    userName: string;
    email: string;
    role: string;
    isActive: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    role: '',
    password: '',
    isActive: true
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getAllUsersAdmin();
      setUsers(response.userDTOList || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({ userName: '', email: '', role: '', password: '', isActive: true });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      userName: user.userName,
      email: user.email,
      role: user.role,
      password: '',
      isActive: user.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser?.userId) {
        // Update existing user
        await updateUserAdmin(selectedUser.userId, {
          userName: formData.userName,
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive
        });
      } else {
        // Create new user
        await registerUser({
          userName: formData.userName,
          email: formData.email,
          role: formData.role,
          password: formData.password,
          isActive: formData.isActive
        });
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserAdmin(Number(userToDelete));
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await updateUserAdmin(Number(user.userId), {
        ...user,
        isActive: !user.isActive
      });
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  // Add error state for empty users
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(users)) {
    return <div>Error: Unable to load users</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button 
          onClick={handleAddUser}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user: User) => (
                <tr key={user.userId}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.userName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(user.userId.toString())}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-20">
          <div className="bg-white/90 p-6 rounded-lg w-96 shadow-xl backdrop-blur-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-20">
          <div className="bg-white/90 p-6 rounded-lg w-96 shadow-xl backdrop-blur-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              {!selectedUser && (
                <div className="mb-4">
                  <label className="block mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

