import apiClient from "../ApiClient";

interface UserDTO {
    // Add your user properties here
    [key: string]: any;
}

export const getAllUsers = async () => {
    try {
        const response = await apiClient.get('/admin/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export const deleteUser = async (userId: number) => {
    try {
        const response = await apiClient.delete(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

export const updateUser = async (userId: number, userData: UserDTO) => {
    try {
        const response = await apiClient.put(`/admin/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

// Additional endpoints (not currently in use)


export const getUserInfo = async () => {
    try {
        const response = await apiClient.get('/user/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
}

export const updateUserInfo = async (userData: any) => {
    try {
        const response = await apiClient.patch('/user/update', userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user info:', error);
        throw error;
    }
}

export const changePassword = async (passwordData: { oldPassword: string; newPassword: string }) => {
    try {
        const response = await apiClient.post('/user/change-password', passwordData);
        return response.data;
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
}

export const deleteAccount = async () => {
    try {
        const response = await apiClient.delete('/user/delete');
        return response.data;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
}