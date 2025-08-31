export interface SaleItemDTO {
  saleItemId?: number | null;
  saleId?: number | null;
  productId: number;
  qty: number;
  price: number;
  discount: number;
}

export interface SaleDTO {
  saleId?: number | null;
  saleDate: string |null;
  totalAmount: number;
  totalDiscount: number;
  paymentMethod: string;
  userId: number;
  customerId: number | null;
  saleItems: SaleItemDTO[];
}

