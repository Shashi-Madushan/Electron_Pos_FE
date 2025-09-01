export type Currency = "LKR" | "USD" | "EUR" | string;

export interface BusinessInfo {
  name: string;
  address?: string;
  phone?: string;
}

export interface SaleItem {
    saleItemId: number;
    saleId: number;
    productId: number;
    qty: number;
    price: number;
    discount: number;
}

export interface Sale {
    date: Date;
    saleId: number;
    saleDate: Date | string;
    totalAmount: number;
    totalDiscount: number;  
    paymentMethod: String;
    userId: number;
    customerId: number;
    saleItems: SaleItem[];
}