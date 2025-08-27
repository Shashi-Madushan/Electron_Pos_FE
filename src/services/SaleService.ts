import apiClient from "./ApiClient";

export const saveSale = async (saleData: any) => {
  try {
    const response = await apiClient.post("/sales", saleData);
    return response.data;
  } catch (error) {
    console.error("Saving sale failed:", error);
    throw error;
  }
};

export const getAllSales = async () => {
  try {
    const response = await apiClient.get("/sales");
    return response.data;
  } catch (error) {
    console.error("Fetching sales failed:", error);
    throw error;
  }
};

export const getSaleById = async (id: string | number) => {
  try {
    const response = await apiClient.get(`/sales/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetching sale by ID failed:", error);
    throw error;
  }
};

export const updateSale = async (id: string | number, saleData: any) => {
  try {
    const response = await apiClient.put(`/sales/${id}`, saleData);
    return response.data;
  } catch (error) {
    console.error("Updating sale failed:", error);
    throw error;
  }
};

export const deleteSale = async (id: string | number) => {
  try {
    const response = await apiClient.delete(`/sales/${id}`);
    return response.data;
  } catch (error) {
    console.error("Deleting sale failed:", error);
    throw error;
  }
};
