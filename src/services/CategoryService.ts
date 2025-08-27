import apiClient from "./ApiClient";

export const saveCategory = async (categoryData: any) => {
  try {
    const response = await apiClient.post("/categories", categoryData);
    return response.data;
  } catch (error) {
    console.error("Saving category failed:", error);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await apiClient.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Fetching categories failed:", error);
    throw error;
  }
};

export const getCategoryById = async (id: string | number) => {
  try {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetching category by ID failed:", error);
    throw error;
  }
};

export const updateCategory = async (id: string | number, categoryData: any) => {
  try {
    const response = await apiClient.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Updating category failed:", error);
    throw error;
  }
};

export const deleteCategory = async (id: string | number) => {
  try {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Deleting category failed:", error);
    throw error;
  }
};
