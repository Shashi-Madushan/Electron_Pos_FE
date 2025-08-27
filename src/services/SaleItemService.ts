import apiClient from "./ApiClient";

export const saveSaleItem = async (saleItemData: any) => {
  try {
    const response = await apiClient.post("/sale-items", saleItemData);
    return response.data;
  } catch (error) {
    console.error("Saving sale item failed:", error);
    throw error;
  }
};

export const getAllSaleItems = async () => {
  try {
    const response = await apiClient.get("/sale-items");
    return response.data;
  } catch (error) {
    console.error("Fetching sale items failed:", error);
    throw error;
  }
};

export const getSaleItemById = async (id: string | number) => {
  try {
    const response = await apiClient.get(`/sale-items/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetching sale item by ID failed:", error);
    throw error;
  }
};

export const updateSaleItem = async (id: string | number, saleItemData: any) => {
  try {
    const response = await apiClient.put(`/sale-items/${id}`, saleItemData);
    return response.data;
  } catch (error) {
    console.error("Updating sale item failed:", error);
    throw error;
  }
};

export const deleteSaleItem = async (id: string | number) => {
  try {
    const response = await apiClient.delete(`/sale-items/${id}`);
    return response.data;
  } catch (error) {
    console.error("Deleting sale item failed:", error);
    throw error;
  }
};
