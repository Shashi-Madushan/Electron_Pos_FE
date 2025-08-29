import apiClient from "./ApiClient";

export const saveProduct = async (productData: any) => {
  try {
    const response = await apiClient.post("/admin/products", productData);
    return response.data;
  } catch (error) {
    console.error("Saving product failed:", error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await apiClient.get("/products");
    return response.data;
  } catch (error) {
    console.error("Fetching products failed:", error);
    throw error;
  }
};

export const getProductById = async (id: string | number) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetching product by ID failed:", error);
    throw error;
  }
};

export const updateProduct = async (id: string | number, productData: any) => {
  try {
    const response = await apiClient.put(`/admin/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error("Updating product failed:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string | number) => {
  try {
    const response = await apiClient.delete(`/admin/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Deleting product failed:", error);
    throw error;
  }
};
