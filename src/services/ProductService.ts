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

export const getProductsWithLowQty = async () => {
  try {
    const response = await apiClient.get("/products/low-qty");
    console.log("Low quantity products fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetching low quantity products failed:", error);
    // If the endpoint doesn't exist, fall back to getting all products and filtering
    try {
      console.log("Falling back to getAllProducts and filtering...");
      const allProductsResponse = await getAllProducts();
      const lowStockProducts = allProductsResponse.productDTOList?.filter((product: any) => product.qty < 10) || [];
      return {
        ...allProductsResponse,
        productDTOList: lowStockProducts
      };
    } catch (fallbackError) {
      console.error("Fallback method also failed:", fallbackError);
      throw error;
    }
  }
};
