import apiClient from "./ApiClient";

// Register a new user
export const registerUser = async (userData: {
  userName: string;
  password: string;
  role: string;
  email: string;
  isActive: boolean;
}) => {
  try {
    const response = await apiClient.post("/users/register", userData);
    return response.data;
  } catch (error) {
    console.error("User registration failed:", error);
    throw error;
  }
};

// Login user
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await apiClient.post("/users/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("User login failed:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/users");
    return response.data;
  } catch (error) {
    console.error("Fetching users failed:", error);
    throw error;
  }
};

export const getUserById = async (id: string | number) => {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetching user by ID failed:", error);
    throw error;
  }
};

export const updateUser = async (id: string | number, userData: any) => {
  try {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Updating user failed:", error);
    throw error;
  }
};

export const deleteUser = async (id: string | number) => {
  try {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Deleting user failed:", error);
    throw error;
  }
};
