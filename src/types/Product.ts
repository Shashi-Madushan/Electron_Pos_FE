export interface Product {
  productId: string;
  productName: string;
  categoryId: number;
  brandId: number;
  cost: number;
  salePrice: number;
  qty: number;
  isActive: boolean;
  trackInventory: boolean;
  image?: string;
}
